import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { ICapy, IStakingTicket } from "types";
import {
  fetchStakingTickets,
  fetchSuifrens,
  signTransactionClaimPoints,
  signTransactionEndStaking,
  signTransactionStartStaking,
  singTransactionsToBatchClaimPoints,
  singTransactionsToBatchStartStaking,
  singTransactionsToBatchUnstaking,
  suiProvider,
} from "services/sui";
import { ethos, EthosConnectStatus } from "ethos-connect";
import suietIcon from "/public/img/SuietLogo2.svg";
import frensLogo from "/public/img/frens-logo.svg";
import bluemoveLogo from "/public/img/bluemove_logo.svg";
import token from "/public/img/points.png";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import {
  classNames,
  formatNumber,
  PRICE_STACKED,
  PRICE_UNSTACKED,
  STAKING_POOL_FRENS_ID,
  STAKING_TABLE_ID,
} from "utils";
import { AlertErrorMessage, AlertSucceed } from "components/Alert/CustomToast";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { Montserrat } from "next/font/google";
import { XMarkIcon } from "@heroicons/react/24/solid";

const font_montserrat = Montserrat({ subsets: ["latin"] });

const Home = () => {
  const { wallet, status } = ethos.useWallet();

  // Data states
  const [frens, setFrens] = useState<ICapy[] | null>();
  const [stakedFrens, setStakedFrens] = useState<IStakingTicket[] | null>();
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalMyPointsOnchain, setTotalMyPointsOnchain] = useState(0);
  const [availablePointsToClaim, setAvailablePointsToClaim] = useState(0);

  // Dialog states
  const [selectedFrend, setSelectedFrend] = useState<ICapy>();
  const [selectedStaked, setSelectedStaked] = useState<IStakingTicket>();
  const [openedFrend, setOpenedFrend] = useState(false);
  const [openedUnstaked, setOpenedUnstaked] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const [waitSui, setWaitSui] = useState(false);

  // Batch Staking states
  const [batchStakeMode, setBatchStakeMode] = useState(false);
  const [batchIdStake, setBatchIdStake] = useState<string[]>([]);
  const [batchUnstakeMode, setBatchUnstakeMode] = useState(false);
  const [batchIdUnstake, setBatchIdUnstake] = useState<string[]>([]);

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        setFrens(null);
        setStakedFrens(null);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const suifrens = fetchSuifrens(nfts);
        if (suifrens) setFrens(suifrens);
        const stakingTickets = fetchStakingTickets(nfts);
        setStakedFrens(stakingTickets);

        if (stakingTickets) {
          Promise.all(
            stakingTickets.map(async (staked) => {
              const response = await suiProvider.getObject({ id: staked?.nft_id!, options: { showDisplay: true } });
              staked.url = (response.data?.display?.data as Record<string, string>)?.image_url;
            })
          ).then(() => setStakedFrens(stakingTickets));
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchWalletFrens().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

  useEffect(() => {
    async function fetchTotalStaked() {
      if (!wallet?.address) {
        return;
      }
      try {
        const response = await suiProvider.getObject({ id: STAKING_POOL_FRENS_ID!, options: { showContent: true } });
        const fields = getObjectFields(response);
        setTotalStaked(fields?.staked || 0);
      } catch (e) {
        setTotalStaked(0);
      }
    }

    async function fetchMyPoints() {
      if (!wallet?.address) {
        return;
      }
      try {
        const response = await suiProvider.getDynamicFieldObject({
          parentId: STAKING_TABLE_ID!,
          name: {
            type: "address",
            value: wallet.address,
          },
        });
        const fields = getObjectFields(response);

        const now = Date.now();

        const onchainPoints: number = +fields?.value || 0;
        const stakedPoints =
          stakedFrens
            ?.map((staked) => {
              return Math.floor((now - staked.start_time) / 60_000);
            })
            .reduce((a, b) => a + b, 0) || 0;
        setAvailablePointsToClaim(stakedPoints);
        setTotalMyPointsOnchain(onchainPoints);
      } catch (e) {
        console.error(e);
      }
    }

    fetchTotalStaked().then();
    fetchMyPoints().then();
  }, [waitSui, wallet?.contents?.nfts, stakedFrens]);

  async function stakeCapy(capy: ICapy) {
    if (!wallet || !capy) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionStartStaking(capy.id),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("Staking");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedFrend(false);
    }
  }

  async function stakeBatchCapy(capy_batch: string[]) {
    if (!wallet || !capy_batch) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: singTransactionsToBatchStartStaking(capy_batch),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("Staking");
        // remove batched capys from the list if success
        setBatchIdStake([]);
        setBatchStakeMode(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedFrend(false);
      //setBatchIdStake([]);
    }
  }

  async function unstakeCapy(ticket: IStakingTicket) {
    if (!wallet || !ticket) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionEndStaking(ticket.id),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("Unstaking");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedUnstaked(false);
    }
  }

  async function unstakeBatchCapy(capy_batch: string[]) {
    if (!wallet || !capy_batch) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: singTransactionsToBatchUnstaking(capy_batch),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("Unstaking");
        // remove batched capys from the list if success
        setBatchIdUnstake([]);
        setBatchUnstakeMode(false);
        // setOpenedUnstaked
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedFrend(false);

      //setBatchIdStake([]);
    }
  }

  async function claimPoints(ticket: IStakingTicket) {
    if (!wallet || !ticket) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionClaimPoints(ticket.id),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("Claim");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedUnstaked(false);
    }
  }

  async function claimBatchPoints(capy_batch: string[]) {
    if (!wallet || !capy_batch) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: singTransactionsToBatchClaimPoints(capy_batch),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("Claim");
        // remove batched capys from the list if success
        setBatchIdUnstake([]);
        setBatchUnstakeMode(false);
        // setOpenedUnstaked
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedFrend(false);

      //setBatchIdStake([]);
    }
  }

  const ProjectDescriptionCard = () => {
    return (
      <div className="md:flex md:p-4 md:py-8 py-4 px-2 gap-2 md:h-60 h-[30rem] border-2 bg-[#FFFFFF] border-[#F6F6F6] rounded-xl">
        <div className="md:ml-12 flex flex-col content-center items-center justify-center rounded-2xl">
          <Image src={frensLogo} alt={"logo"} height={185} width={185} />
        </div>
        <div className="w-full md:ml-4 py-2">
          <div className="flex justify-between">
            <div>
              <p className={classNames("text-3xl font-extrabold text-[#595959]", font_montserrat.className)}>
                SuiFrens
              </p>
              <p className={classNames(font_montserrat.className, "text-[#595959] font-light")}>
                Each staked frens will earn 1 point per minute
              </p>
            </div>
            <button
              onClick={() => setOpenRules(true)}
              className={classNames(
                "text-md font-light text-[#595959] hover:underline mr-2",
                font_montserrat.className
              )}
            >
              FAQs
            </button>
          </div>
          <div className="md:flex h-24 mt-4 justify-between gap-4">
            <div className="bg-[#5A5A95] text-white py-4 w-full md:w-1/4 text rounded-xl flex md:flex-col md:justify-center justify-between content-center text-start px-3">
              <p className={classNames(font_montserrat.className, "font-extrabold md:text-sm md:leading-4")}>
                Total <br className="hidden md:flex" />
                Staked
              </p>
              <p className={classNames("text-2xl font-black", font_montserrat.className)}>
                {totalStaked ? totalStaked : 0}
              </p>
            </div>
            <div className="bg-redColor text-white py-4 mt-2 w-full md:mt-0 md:w-1/4 text rounded-xl flex md:flex-col md:justify-center justify-between content-center text-start px-3">
              <p className={classNames(font_montserrat.className, "font-extrabold md:text-sm md:leading-4")}>
                You <br className="hidden md:flex" />
                Staked
              </p>
              <p className={classNames("text-2xl font-black", font_montserrat.className)}>
                {stakedFrens?.length ? stakedFrens.length : 0}
              </p>
            </div>
            <div className="bg-yellowColor text-white py-4 mt-2 w-full md:mt-0 md:w-1/4 rounded-xl flex md:flex-col md:justify-center justify-between content-center text-start px-3">
              <p
                className={classNames(font_montserrat.className, "font-extrabold mt-2 md:mt-0 md:text-sm md:leading-4")}
              >
                Your Available Hola Points
              </p>
              <div>
                <div className="flex gap-2 md:w-full md:justify-between">
                  <p className={classNames("text-xl md:text-xl md:pt-0 pt-1 font-black", font_montserrat.className)}>
                    {totalMyPointsOnchain ? formatNumber(totalMyPointsOnchain) : 0}
                  </p>
                  {stakedFrens?.length && availablePointsToClaim ? (
                    <button
                      className="underline text-sm"
                      onClick={() => claimBatchPoints(stakedFrens.map((ticket) => ticket.id))}
                    >{`Claim ${formatNumber(availablePointsToClaim)} `}</button>
                  ) : (
                    <button></button>
                  )}
                </div>
                {/* //this claim is available only on desktop */}
                <div className="flex md:hidden text-left text-xs underline ">
                  {stakedFrens?.length && availablePointsToClaim ? (
                    <button
                      className="underline"
                      onClick={() => claimBatchPoints(stakedFrens.map((ticket) => ticket.id))}
                    >{`Claim ${formatNumber(availablePointsToClaim)} `}</button>
                  ) : (
                    <button></button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StakingRule = () => {
    return (
      <div className={classNames("gap-2 flex text-[#595959] items-top", font_montserrat.className)}>
        <div className="text-xs px-2 py-1 font-medium">Fees for each:</div>
        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ring-gray-200">
          <svg className="h-1.5 w-1.5 fill-yellowColor" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          {PRICE_STACKED} SUI STAKE
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ring-gray-200">
          <svg className="h-1.5 w-1.5 fill-[#5A5A95]" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          {PRICE_UNSTACKED} SUI UNSTAKE
        </span>
      </div>
    );
  };

  // handle function for batch mode selection
  const handleSetBatchIdStake = (
    id: string,
    batchIdStake: string[],
    setBatchIdStake: Dispatch<SetStateAction<string[]>>
  ) => {
    // Check if the id already exists in the array
    if (!batchIdStake.includes(id)) {
      // If it doesn't exist, add it to the array
      setBatchIdStake((prevBatchIdStake) => [...prevBatchIdStake, id]);
    } else {
      // If it exists, remove it from the array
      setBatchIdStake((prevBatchIdStake) => prevBatchIdStake.filter((item) => item !== id));
    }
  };

  const SuifrensCard = ({ capy, batchMode }: { capy: ICapy; batchMode: boolean }) => {
    return (
      <button
        onClick={() => {
          batchMode ? handleSetBatchIdStake(capy.id, batchIdStake, setBatchIdStake) : setOpenedFrend(true);
          setSelectedFrend(capy);
        }}
      >
        <div
          className={classNames(
            "flex flex-col items-center gap-2 bg-[#FFFFFF] rounded-xl py-8 border-2",
            batchMode
              ? batchIdStake.includes(capy.id)
                ? "border-yellowColor"
                : "border-[#595959]"
              : "border-[#FFFFFF]"
          )}
        >
          <div className="relative">
            <div className="w-40 h-40">
              <Image src={capy.url} alt={capy.description} fill={true} />
            </div>
          </div>
        </div>
      </button>
    );
  };

  const StakedTicketCard = ({ staking, batchMode }: { staking: IStakingTicket; batchMode: boolean }) => {
    return (
      <button
        onClick={() => {
          batchMode ? handleSetBatchIdStake(staking.id, batchIdUnstake, setBatchIdUnstake) : setOpenedUnstaked(true);
          setSelectedStaked(staking);
        }}
      >
        <div
          className={classNames(
            "flex flex-col items-center gap-2 bg-white rounded-xl py-8 border-2",
            batchMode ? (batchIdUnstake.includes(staking.id) ? "border-redColor" : "border-[#595959]") : "border-white"
          )}
        >
          <div className="relative">
            <div className={"w-40 h-40"}>
              <Image src={staking.url} alt={"staking"} fill={true} className="rounded-md" />
            </div>
          </div>
        </div>
      </button>
    );
  };

  const StakeScreen = () => {
    if (!selectedFrend) return <></>;

    return (
      <Transition.Root show={openedFrend} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setOpenedFrend(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-auto">
            <div className="flex min-h-full items-center justify-center">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-bgMain px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title
                  as="h3"
                  className={classNames(
                    "flex justify-between text-base  leading-6 text-[#595959] text-center mb-2 font-bold",
                    font_montserrat.className
                  )}
                >
                  <p className="mt-1"></p>
                  <p className="mt-1">Start staking</p>
                  <button onClick={() => setOpenedFrend(false)}>
                    <XMarkIcon className="flex md:hidden h-7 w-7" />
                  </button>
                </Dialog.Title>
                <div className="flex flex-col items-center justify-center">
                  <div className={"mt-2 flex flex-col items-center gap-2"}>
                    <div className="bg-white px-2 py-4 rounded-2xl">
                      <Image
                        className="h-[35vh] rounded-lg w-auto"
                        src={selectedFrend.url}
                        alt="Workflow"
                        width={75}
                        height={75}
                        unoptimized={true}
                        priority
                      />
                    </div>

                    <button
                      className={classNames(
                        "w-full block mx-auto my-4 px-3 text-sm py-2 bg-yellowColor text-white font-black rounded-md hover:bg-[#e5a44a] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                        font_montserrat.className
                      )}
                      onClick={() => {
                        stakeCapy(selectedFrend).then();
                      }}
                      disabled={waitSui}
                    >
                      Stake
                    </button>
                    <StakingRule />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

  const UnstakeScreen = () => {
    if (!selectedStaked) return <></>;

    return (
      <Transition.Root show={openedUnstaked} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setOpenedUnstaked(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-auto">
            <div className="flex min-h-full items-center justify-center">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-bgMain px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title
                  className={classNames(
                    "flex justify-between text-base  leading-6 text-[#595959] text-center mb-2 font-bold",
                    font_montserrat.className
                  )}
                >
                  <p className="mt-1"></p>
                  <p className={classNames("mt-1")}>Staking</p>
                  <button onClick={() => setOpenedUnstaked(false)}>
                    <XMarkIcon className="flex md:hidden h-7 w-7" />
                  </button>
                </Dialog.Title>
                <div className="flex flex-col items-center justify-center">
                  <div className={"mt-2 flex flex-col items-center gap-2"}>
                    <div className="bg-white px-2 py-4 rounded-2xl">
                      <Image
                        className="h-[35vh] rounded-lg w-auto"
                        src={selectedStaked.url}
                        alt="Workflow"
                        width={75}
                        height={75}
                        unoptimized={true}
                        priority
                      />
                    </div>
                    <div
                      className={classNames(
                        "font-bold text-center text-[#595959] flex flex-col items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      Your currect hola points
                      <div className="flex gap-2  items-center">
                        <div className="h-2/3 pt-2">
                          <Image src={token} alt={"points"} height={35} width={40} priority />
                        </div>
                        <p className="text-3xl mt-2 font-extrabold">
                          {Math.floor((Date.now() - selectedStaked.start_time) / 60_000)}
                        </p>
                      </div>
                    </div>
                    <button
                      className={classNames(
                        "w-full block mx-auto mb-1 mt-2 md:px-3 px-2 text-sm py-2 bg-yellowColor text-white font-black rounded-md hover:bg-yellowColorHover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                        font_montserrat.className
                      )}
                      onClick={() => {
                        claimPoints(selectedStaked).then();
                      }}
                      disabled={waitSui}
                    >
                      Claim Points
                    </button>
                    <button
                      className={classNames(
                        "w-full block mx-auto mb-1 mt-2 md:px-3 px-2 text-sm py-2 bg-redColor text-white font-black rounded-md hover:bg-[#c8517c] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                        font_montserrat.className
                      )}
                      onClick={() => {
                        unstakeCapy(selectedStaked).then();
                      }}
                      disabled={waitSui}
                    >
                      Unstake
                    </button>

                    <p className={classNames("mb-4 text-xs text-center", font_montserrat.className)}>
                      Points will be calculated to your account after unstaking
                    </p>
                    <StakingRule />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

  const RulesScreen = () => {
    return (
      <Transition.Root show={openRules} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setOpenRules(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-auto">
            <div className="flex min-h-full items-center justify-center">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-bgMain px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title
                  as="h3"
                  className={classNames(
                    "text-base leading-6 text-[#595959] text-center mb-2 font-bold",
                    font_montserrat.className
                  )}
                >
                  FAQs
                </Dialog.Title>
                <div className="flex flex-col items-center justify-start">
                  <div className={"mt-2 flex flex-col items-start gap-2"}>
                    <p
                      className={classNames(
                        "text-left text-[#595959] flex flex-col font-medium items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      What are Hola Points?
                    </p>
                    <p
                      className={classNames(
                        "font-normal text-left text-[#595959] text-sm flex flex-col -mt-2 items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      Hola Points are not tokens, it's points. It's a reward system for Hola users. You can earn Hola
                      Points by staking frens. The more frens you stake, the more points you earn.
                    </p>

                    <p
                      className={classNames(
                        "text-left text-[#595959] mt-3 flex flex-col font-medium items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      How can I spend my points?
                    </p>
                    <p
                      className={classNames(
                        "font-normal text-left text-[#595959] text-sm flex flex-col -mt-2 items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      TBA.
                    </p>

                    <p
                      className={classNames(
                        "text-left text-[#595959] flex flex-col mt-4 font-medium items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      Why do you need fees?
                    </p>
                    <p
                      className={classNames(
                        "font-normal text-left text-[#595959] text-sm flex flex-col -mt-2 items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      We need fees to continue developing this project, as they help cover costs for servers and other
                      resources.
                    </p>

                    <p
                      className={classNames(
                        "text-left text-[#595959] flex flex-col mt-4 font-medium items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      Who developed this project?
                    </p>
                    <p
                      className={classNames(
                        "font-normal text-left text-[#595959] text-sm flex flex-col -mt-2 items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      The project was developed by the LoyaltyGM team.
                    </p>

                    <p
                      className={classNames(
                        "text-left text-[#595959] flex flex-col mt-4 font-medium items-center content-center",
                        font_montserrat.className
                      )}
                    >
                      If I have an NFT project, can I use the Hola Protocol?
                    </p>
                    <p
                      className={classNames(
                        "font-normal text-left text-[#595959] text-sm -mt-2 items-start content-center",
                        font_montserrat.className
                      )}
                    >
                      <p>
                        Yes, if you have an NFT project and want to use the Hola Protocol, please contact us on Twitter
                      </p>
                      <a href="https://twitter.com/Loyalty_GM" target="_blank" className="underline">
                        at @Loyalty_GM to discuss further
                      </a>
                    </p>

                    <button
                      className={classNames(
                        "w-full block mx-auto mb-1 mt-2 px-3 text-sm py-2 bg-redColor text-white font-black rounded-md hover:bg-[#c8517c] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                        font_montserrat.className
                      )}
                      onClick={() => {
                        setOpenRules(false);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <main className="flex min-h-[85vh] flex-col items-center justify-around md:mt-20 z-10 rounded-lg bg-bgMain">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div
          className={classNames(
            "flex flex-col md:flex-row md:gap-2 gap-1 justify-center items-center content-center text-4xl text-center w-full pt-12 font-bold text-[#5A5A95] ",
            font_montserrat.className
          )}
        >
          <p>Connect</p>
          <Image src={suietIcon} alt={"suiet"} height={350} width={50} className="h-28" priority />
          <p>Suiet Wallet To Unlock Staking!</p>
        </div>
        <div className="flex justify-center">
          <ethos.components.AddressWidget />
        </div>
      </div>
    </main>
  ) : (
    <main className="flex min-h-[85vh] flex-col pl-2 pr-2 md:pl-16 py-6 mt-20 md:pr-10 z-10 rounded-lg bg-bgMain">
      <ProjectDescriptionCard />

      {stakedFrens?.length !== 0 && (
        <>
          <div className="flex justify-between">
            <h1
              className={classNames("mt-8 md:text-4xl text-xl font-semibold text-[#595959]", font_montserrat.className)}
            >
              My Staked Frens
            </h1>
            <div className="md:flex">
              <p
                className={classNames(
                  "md:mt-10 mt-9 w-full text-xs md:px-4 md:text-sm font-normal",
                  font_montserrat.className
                )}
              >
                {batchUnstakeMode ? (
                  batchIdUnstake.length === 0 ? (
                    "Select capy for unstaking"
                  ) : (
                    <div className="-mt-1">
                      <StakingRule />
                    </div>
                  )
                ) : null}
              </p>
              <button
                className={classNames(
                  "md:mt-8 text-sm md:text-lg border- border-2 px-3 py-4 md:py-2 md:px-8 w-full rounded-xl bg-white border-redColor text-redColor hover:bg-[#cc5480] hover:text-gray-50 hover:border-transparent",
                  font_montserrat.className
                )}
                onClick={() => {
                  batchUnstakeMode
                    ? batchIdUnstake.length === 0
                      ? setBatchUnstakeMode(false)
                      : unstakeBatchCapy(batchIdUnstake)
                    : setBatchUnstakeMode(true);
                }}
              >
                {batchUnstakeMode ? (
                  batchIdUnstake.length === 0 ? (
                    "Cancel"
                  ) : (
                    "Confirm"
                  )
                ) : (
                  <p className="">Batch Unstaking</p>
                )}
              </button>
            </div>
          </div>

          <div className={"grid md:grid-cols-4 grid-cols-2 gap-2 md:gap-10 mt-8"}>
            {stakedFrens?.map((stack) => (
              <StakedTicketCard staking={stack} key={stack.id} batchMode={batchUnstakeMode} />
            ))}
          </div>
        </>
      )}

      <div className="flex justify-between">
        <h1 className={classNames("mt-8 md:text-4xl text-xl font-semibold text-[#595959]", font_montserrat.className)}>
          My Frens
        </h1>
        {frens?.length !== 0 ? (
          <>
            <div className="md:flex">
              <p
                className={classNames(
                  "md:mt-10 mt-9 w-full text-xs md:px-4 md:text-sm font-normal",
                  font_montserrat.className
                )}
              >
                {batchStakeMode ? (
                  batchIdStake.length === 0 ? (
                    "Select capy for staking"
                  ) : (
                    <div className="-mt-1">
                      <StakingRule />
                    </div>
                  )
                ) : null}
              </p>
              <button
                className={classNames(
                  "md:mt-8 text-sm md:text-lg bg-white border-yellowColor border-2 px-3 py-4 md:py-2 md:px-8 w-full rounded-xl text-yellowColor hover:bg-yellowColor hover:text-gray-50 hover:border-transparent",
                  font_montserrat.className
                )}
                onClick={() => {
                  batchStakeMode
                    ? batchIdStake.length === 0
                      ? setBatchStakeMode(false)
                      : stakeBatchCapy(batchIdStake)
                    : setBatchStakeMode(true);
                }}
                //
              >
                {batchStakeMode ? (batchIdStake.length === 0 ? "Cancel" : "Confirm") : "Batch Staking"}
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {frens?.length !== 0 ? (
        <div className={"grid md:grid-cols-4 grid-cols-2 gap-2 md:gap-10 mt-8"}>
          {frens?.map((capy) => (
            <SuifrensCard capy={capy} key={capy.id} batchMode={batchStakeMode} />
          ))}
        </div>
      ) : (
        <>
          {stakedFrens?.length !== 0 ? (
            <div className="mt-8 text-center">
              <div
                className={classNames(font_montserrat.className, "md:text-4xl text-2xl font-semibold text-[#595959]")}
              >
                All your capies are staked
              </div>
              <a href="https://sui.bluemove.net/collection/suifrens" target="_blank">
                <div
                  className={classNames(
                    "bg-neutral-900 py-4 mt-4 text-white items-center flex content-center justify-center cursor-pointer rounded-xl hover:bg-neutral-800",
                    font_montserrat.className
                  )}
                >
                  <p className="font-semibold">Get one more capy on</p>
                  <Image src={bluemoveLogo} alt={"bluemovelogo"} className="h-8 -ml-5" />
                </div>
              </a>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <div className={classNames(font_montserrat.className, "text-4xl font-semibold text-[#595959]")}>
                You don't have capy :(
              </div>
              <a href="https://sui.bluemove.net/collection/suifrens" target="_blank">
                <div
                  className={classNames(
                    "bg-neutral-900 py-4 mt-4 text-white items-center flex content-center justify-center cursor-pointer rounded-xl hover:bg-neutral-800",
                    font_montserrat.className
                  )}
                >
                  <p className="font-semibold">Get one capy on</p>
                  <Image src={bluemoveLogo} alt={"bluemovelogo"} className="h-8 -ml-5" />
                </div>
              </a>
            </div>
          )}
        </>
      )}
      <p className={classNames("mt-12 text-sm font-light", font_montserrat.className)}>
        SuiFrens by Mysten Labs CC BY 4.0 license
      </p>
      <StakeScreen />
      <UnstakeScreen />
      <RulesScreen />
    </main>
  );
};

export default Home;
