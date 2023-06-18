import {useEffect, useState} from "react";
import {ICapy, IStakingTicket, handleSetBatchIdStake} from "types";
import {
    fetchStakingTickets,
    fetchNFTObjects,
    signTransactionClaimPoints,
    signTransactionEndStaking,
    signTransactionStartStaking,
    singTransactionsToBatchClaimPoints,
    singTransactionsToBatchStartStaking,
    singTransactionsToBatchUnstaking,
    suiProvider, fetchCapyStaking,
} from "services/sui";
import {ethos, EthosConnectStatus} from "ethos-connect";
import Image from "next/image";
import {
    classNames,
    FRENS_STAKING_POOL_ID,
    FRENS_STAKING_POOL_POINTS_TABLE_ID,
} from "utils";
import {
    AlertErrorMessage,
    AlertSucceed,
    NoConnectWallet,
    StakingRules,
    BlueMoveButton,
    RulesDialog, ProjectCard, ObjectDetailDialog, UnstakeDetailDialog,
} from "components";
import {getExecutionStatus, getExecutionStatusError, getObjectFields} from "@mysten/sui.js";
import {Montserrat} from "next/font/google";


const font_montserrat = Montserrat({subsets: ["latin"]});

const Home = () => {
    const {wallet, status} = ethos.useWallet();

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
                const suifrens = fetchCapyStaking(nfts);
                if (suifrens) setFrens(suifrens);
                const stakingTickets = fetchStakingTickets(nfts);
                setStakedFrens(stakingTickets);

                if (stakingTickets) {
                    Promise.all(
                        stakingTickets.map(async (staked) => {
                            const response = await suiProvider.getObject({
                                id: staked?.nft_id!,
                                options: {showDisplay: true}
                            });
                            staked.url = (response.data?.display?.data! as Record<string, string>)?.image_url!;
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
                const response = await suiProvider.getObject({
                    id: FRENS_STAKING_POOL_ID!,
                    options: {showContent: true}
                });
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
                    parentId: FRENS_STAKING_POOL_POINTS_TABLE_ID!,
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

    const SuifrensCard = ({capy, batchMode}: { capy: ICapy; batchMode: boolean }) => {
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
                                : "border-grayColor"
                            : "border-[#FFFFFF]"
                    )}
                >
                    <div className="relative">
                        <div className="w-40 h-40">
                            <Image src={capy.url} alt={capy.description} fill={true}/>
                        </div>
                    </div>
                </div>
            </button>
        );
    };

    const StakedTicketCard = ({staking, batchMode}: { staking: IStakingTicket; batchMode: boolean }) => {
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
                        batchMode ? (batchIdUnstake.includes(staking.id) ? "border-redColor" : "border-grayColor") : "border-white"
                    )}
                >
                    <div className="relative">
                        <div className={"w-40 h-40"}>
                            <Image src={staking.url} alt={"staking"} fill={true} className="rounded-md"/>
                        </div>
                    </div>
                </div>
            </button>
        );
    };

    return status === EthosConnectStatus.NoConnection ? (
        <NoConnectWallet title={'Staking!'}/>
    ) : (
        <main className="flex min-h-[85vh] flex-col pl-2 pr-2 md:pl-16 py-6 mt-20 md:pr-10 z-10 rounded-lg bg-bgMain">
            {stakedFrens ? <ProjectCard availablePointsToClaim={availablePointsToClaim} setOpenRules={setOpenRules}
                                        claimPointsFunction={claimBatchPoints} stakedList={stakedFrens}
                                        totalHolaPointsOnchain={totalMyPointsOnchain}
                                        totalStaked={totalStaked}/> : <></>}

            {stakedFrens?.length !== 0 && (
                <>
                    <div className="flex justify-between">
                        <h1
                            className={classNames("mt-8 md:text-4xl text-xl font-semibold text-grayColor", font_montserrat.className)}
                        >
                            My Staked Frens
                        </h1>
                        <div className="md:flex">
                            <p
                                className={classNames(
                                    "md:mt-10 mt-9 w-full text-xs md:px-4 md:text-sm font-normal",
                                )}
                            >
                                {batchUnstakeMode ? (
                                    batchIdUnstake.length === 0 ? (
                                        "Select capy for unstaking"
                                    ) : (
                                        <div className="-mt-1">
                                            <StakingRules/>
                                        </div>
                                    )
                                ) : null}
                            </p>
                            <button
                                className={classNames(
                                    "md:mt-8 text-sm min-w-[220px] md:text-lg border-2 px-3 py-4 md:py-2 md:px-8 w-full rounded-xl bg-white border-redColor text-redColor hover:bg-[#cc5480] hover:text-gray-50 hover:border-transparent",
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
                                    <p>Batch Unstaking</p>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className={"grid md:grid-cols-4 grid-cols-2 gap-2 md:gap-10 mt-8"}>
                        {stakedFrens?.map((stack) => (
                            <StakedTicketCard staking={stack} key={stack.id} batchMode={batchUnstakeMode}/>
                        ))}
                    </div>
                </>
            )}

            <div className="flex justify-between">
                <h1 className={classNames("mt-8 md:text-4xl text-xl font-semibold text-grayColor", font_montserrat.className)}>
                    My Frens
                </h1>
                {frens?.length !== 0 ? (
                    <>
                        <div className="md:flex">
                            <p
                                className={classNames(
                                    "md:mt-10 mt-9 w-full text-xs md:px-4 md:text-sm font-normal",
                                )}
                            >
                                {batchStakeMode ? (
                                    batchIdStake.length === 0 ? (
                                        "Select capy for staking"
                                    ) : (
                                        <div className="-mt-1">
                                            <StakingRules/>
                                        </div>
                                    )
                                ) : null}
                            </p>
                            <button
                                className={classNames(
                                    "md:mt-8 md:min-w-[220px] text-sm md:text-lg bg-white border-yellowColor border-2 px-3 py-4 md:py-2 md:px-8 w-full rounded-xl text-yellowColor hover:bg-yellowColor hover:text-gray-50 hover:border-transparent",
                                )}
                                onClick={() => {
                                    batchStakeMode
                                        ? batchIdStake.length === 0
                                            ? setBatchStakeMode(false)
                                            : stakeBatchCapy(batchIdStake)
                                        : setBatchStakeMode(true);
                                }}
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
                        <SuifrensCard capy={capy} key={capy.id} batchMode={batchStakeMode}/>
                    ))}
                </div>
            ) : (
                <>
                    {stakedFrens?.length !== 0 ? (
                        <div className="mt-8 text-center">
                            <div
                                className={classNames(font_montserrat.className, "md:text-4xl text-2xl font-semibold text-grayColor")}
                            >
                                All your capies are staked
                            </div>
                            <BlueMoveButton text={"Get one more capy on"}/>
                        </div>
                    ) : (
                        <div className={classNames("mt-8 text-center", font_montserrat.className)}>
                            <div className={classNames("text-4xl font-semibold text-grayColor")}>
                                You don't have capy :(
                            </div>
                            <BlueMoveButton text={"Get one Capy on"}/>
                        </div>
                    )}
                </>
            )}
            <p className={classNames("mt-12 text-sm font-light", font_montserrat.className)}>
                SuiFrens by Mysten Labs CC BY 4.0 license
            </p>
            <ObjectDetailDialog openedFrend={openedFrend} waitSui={waitSui} selectedFrend={selectedFrend}
                                setOpenedFrend={setOpenedFrend}
                                stakeFunction={() => stakeCapy(selectedFrend!).then()}
            />
            <UnstakeDetailDialog selectedStaked={selectedStaked} openDialog={openedUnstaked}
                                 setOpenDialog={setOpenedUnstaked} claimPointsFunction={claimPoints}
                                 unstakeCapyFunction={unstakeCapy} waitSui={waitSui}/>
            <RulesDialog setOpenRules={setOpenRules} openRules={openRules}/>
        </main>
    );
};

export default Home;
