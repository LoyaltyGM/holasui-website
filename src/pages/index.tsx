import { Fragment, useEffect, useState } from "react";
import { IStakingTicket, ICapy } from "types";
import { fetchStakingTickets, fetchSuifrens, suiProvider } from "services/sui";
import { ethos, EthosConnectStatus } from "ethos-connect";

import frensLogo from "/public/img/frens-logo.svg";
import Image from "next/image";
import { Dialog, Transition } from "@headlessui/react";
import { PRICE_STACKED, PRICE_UNSTACKED, STAKING_TABLE_ID, classNames, STAKING_POOL_FRENS_ID } from "utils";
import { signTransactionStartStaking, signTransactionEndStaking } from "services/sui";
import { AlertErrorMessage, AlertSucceed } from "components/Alert/CustomToast";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";

const Home = () => {
  const { wallet, status } = ethos.useWallet();

  // Data states
  const [capyies, setCapyies] = useState<ICapy[]>();
  const [stacked, setStaked] = useState<IStakingTicket[]>();

  // Dialog states
  const [selectedFrend, setSelectedFrend] = useState<ICapy>();
  const [selectedStaked, setSelectedStaked] = useState<IStakingTicket>();
  const [openedFrend, setOpenedFrend] = useState(false);
  const [openedUnstaked, setOpenedUnstaked] = useState(false);
  const [waitSui, setWaitSui] = useState(false);

  const [totalStaked, setTotalStaked] = useState(0);
  const [totalMyPoints, setTotalMyPoints] = useState(0);

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        setCapyies(undefined);
        setStaked(undefined);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const suifrens = fetchSuifrens(nfts);
        if (suifrens) setCapyies(suifrens);
        const staking = fetchStakingTickets(nfts);
        if (staking) {
          //setStaked(staking);
          await Promise.all(
            staking.map(async (staked) => {
              const response = await suiProvider.getObject({ id: staked?.nft_id!, options: { showDisplay: true } });
              const image_url = (response.data?.display?.data as Record<string, string>)?.image_url;
              console.log(image_url);
              staked.url = image_url;
            })
          );
          setStaked(staking);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchWalletFrens().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

  useEffect(() => {
    fetchTotalStaked();
    fetchMyPoints();
  }, [waitSui, wallet?.contents?.nfts]);

  async function fetchTotalStaked() {
    if (!wallet?.address) {
      return;
    }
    const response = await suiProvider.getObject({ id: STAKING_POOL_FRENS_ID!, options: { showContent: true } });
    const fields = getObjectFields(response);
    if (fields) {
      setTotalStaked(fields?.staked);
    } else {
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
      setTotalMyPoints(fields?.value);
    } catch (e) {
      console.error(e);
      setTotalMyPoints(0);
    }
  }

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

  const ProjectDescriptionCard = () => {
    return (
      <div className="flex p-4 py-8 gap-2 h-60 border-2 border-[#F6F6F6] rounded-xl">
        <div className="ml-12 flex flex-col content-center justify-center rounded-2xl">
          <Image src={frensLogo} alt={"logo"} height={185} width={185} />
        </div>
        <div className="w-full ml-4">
          <div className="flex justify-between">
            <div>
              <p className="text-3xl font-bold">SuiFrend</p>
              <p>Each staked frens will earn 1 points per minute</p>
            </div>
            {/* <p>Staking Rules</p> */}
          </div>
          <div className="flex h-24 mt-4 justify-between gap-4">
            <div className="border bg-[#F6F6F6] w-1/4 rounded-xl flex flex-col justify-center content-center text-center">
              <p>Total Staked</p>
              <p className="text-xl font-semibold">{totalStaked ? totalStaked : 0}</p>
            </div>
            <div className="border bg-[#F6F6F6] w-1/4 rounded-xl flex flex-col justify-center content-center text-center">
              <p>Your Staked</p>
              <p className="text-xl font-semibold">{stacked?.length ? stacked.length : 0}</p>
            </div>
            <div className="border bg-[#F6F6F6] w-1/4 rounded-xl flex flex-col justify-center content-center text-center">
              <p>Your Hola Points</p>
              <p className="text-xl font-semibold">{totalMyPoints ? totalMyPoints : 0}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StakingRule = () => {
    return (
      <div className="gap-2 flex text-gray-400 items-top">
        <p className="text-xs px-2 py-1">Fees:</p>
        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ring-gray-200">
          <svg className="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          {PRICE_STACKED} SUI STAKE
        </span>
        <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ring-gray-200">
          <svg className="h-1.5 w-1.5 fill-blue-500" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3} />
          </svg>
          {PRICE_UNSTACKED} SUI UNSTAKE
        </span>
      </div>
    );
  };

  const SuifrensCard = ({ capy }: { capy: ICapy }) => {
    return (
      <button
        onClick={() => {
          setOpenedFrend(true);
          setSelectedFrend(capy);
        }}
      >
        <div className="flex flex-col items-center gap-2 bg-[#F6F6F6] rounded-xl py-8">
          <div className="relative">
            <div className="w-40 h-40">
              <Image src={capy.url} alt={capy.description} fill={true} />
            </div>
          </div>
          <p className="text-center font-medium mt-2">{capy.description}</p>
        </div>
      </button>
    );
  };

  const StakedTicketCard = ({ staking }: { staking: IStakingTicket }) => {
    return (
      <button
        onClick={() => {
          setOpenedUnstaked(true);
          setSelectedStaked(staking);
        }}
      >
        <div className="flex flex-col items-center gap-2 bg-[#F6F6F6] rounded-xl py-8">
          <div className="relative">
            <div className={"w-40 h-40"}>
              <Image src={staking.url} alt={"staking"} fill={true} />
            </div>
          </div>
          <div className="text-center font-medium mt-2">Staking</div>
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-auto">
            <div className="flex min-h-full items-center justify-center">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-main text-center mb-2">
                  {"Start staking"}
                </Dialog.Title>
                <div className="flex flex-col items-center justify-center">
                  <div className={"mt-2 flex flex-col items-center gap-2"}>
                    <div className="bg-gray-200 px-2 py-4 rounded-2xl">
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
                        "w-full block mx-auto my-4 px-3 text-sm py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 cursor-pointer",
                        waitSui && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        stakeCapy(selectedFrend).then();
                      }}
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-auto">
            <div className="flex min-h-full items-center justify-center">
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-main text-center mb-2">
                  {"Staking"}
                </Dialog.Title>
                <div className="flex flex-col items-center justify-center">
                  <div className={"mt-2 flex flex-col items-center gap-2"}>
                    <div className="bg-gray-200 px-2 py-4 rounded-2xl">
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
                    <p>
                      {/* //current time: {Date.now()} <br /> */}
                      {/* start time: {selectedStaked.start_time} <br /> */}
                      Your currect hola points: {Math.floor((Date.now() - selectedStaked.start_time) / 60_000)}
                    </p>

                    <button
                      className={classNames(
                        "w-full block mx-auto my-4 px-3 text-sm py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-400 cursor-pointer",
                        waitSui && "opacity-50 cursor-not-allowed"
                      )}
                      onClick={() => {
                        unstakeCapy(selectedStaked).then();
                      }}
                    >
                      Unstake
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

  return status === EthosConnectStatus.NoConnection ? (
    <main className="flex min-h-[85vh] flex-col items-center justify-around mt-20 z-10 rounded-lg bg-white">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className="text-4xl text-center w-full pt-12 font-bold text-[#5767EF]">
          Connect Your Wallet To Check Your Gochi!
        </p>
      </div>
    </main>
  ) : (
    <main className="flex min-h-[85vh] flex-col pl-16 py-6 mt-20 pr-10 z-10 rounded-lg bg-white">
      <ProjectDescriptionCard />
      <h1 className="mt-8 text-4xl font-semibold text-main">My Frens</h1>
      <div className={"grid grid-cols-4 gap-10 mt-8"}>
        {capyies?.map((capy) => (
          <SuifrensCard capy={capy} key={capy.id} />
        ))}
      </div>

      {stacked?.length !== 0 && (
        <>
          <h1 className=" text-4xl text-main mt-8 font-semibold">My Staked Frens</h1>
          <div className={"grid grid-cols-4 gap-10 mt-8"}>
            {stacked?.map((stack) => (
              <StakedTicketCard staking={stack} key={stack.id} />
            ))}
          </div>
        </>
      )}

      <StakeScreen />
      <UnstakeScreen />
    </main>
  );
};

export default Home;
