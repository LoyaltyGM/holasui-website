import {ethos, EthosConnectStatus} from "ethos-connect";
import {Montserrat} from "next/font/google";
import {useEffect, useState} from "react";
import {getExecutionStatus, getExecutionStatusError, getObjectFields} from "@mysten/sui.js";

import {suiProvider, signTransactionAcceptOffer, signTransactionCreateOffer} from "services/sui";
import {
    MyCollectionDialog,
    RecieveNFTDialog,
    HistoryP2PDialog,
    NoConnectWallet,
    SwapInformation,
    AlertErrorMessage,
    AlertSucceed
} from "components";
import {IOffer, TradeObjectType} from "types";
import {classNames, ESCROW_HUB_ID} from "utils";

const font_montserrat = Montserrat({subsets: ["latin"]});

const Swap = () => {
    const {wallet, status} = ethos.useWallet();
    const [waitSui, setWaitSui] = useState(false);
    const [allOffers, setAllOffers] = useState<IOffer[]>([]);

    // creator
    const [creatorObjectIds, setCreatorObjectIds] = useState<TradeObjectType[]>([]);
    const [creatorCoinAmount, setCreatorCoinAmount] = useState<number | null>(null);

    // recipient
    const [recipientAddress, setRecipientAddress] = useState<string>();
    const [recipientCoinAmount, setRecipientCoinAmount] = useState<number | null>(null);
    const [recipientObjectIds, setRecipientObjectIds] = useState<TradeObjectType[]>([]);

    // dialog wallets
    const [showReceivedNFT, setShowReceivedNFT] = useState(false);
    const [showCollection, setShowCollection] = useState(false);
    const [showHistory, setShowHistory] = useState(false);


    useEffect(() => {
        async function fetchHistory() {
            if (!wallet) return;
            try {
                const response = await suiProvider.getDynamicFields({
                    parentId: ESCROW_HUB_ID,
                });
                Promise.all(
                    response?.data?.map(async (df): Promise<IOffer> => {
                        const suiObject = await suiProvider.getObject({
                            id: df?.objectId!,
                            options: {showContent: true}
                        });

                        return getObjectFields(suiObject) as IOffer;
                    })
                ).then((offers) => {
                    setAllOffers(offers);
                });
            } catch (e) {
                console.error(e);
            }
        }

        fetchHistory().then();
    }, [wallet, waitSui]);

    async function createOffer() {
        if (!wallet || !recipientAddress) return;
        console.log("createOffer");
        setWaitSui(true);
        try {
            const response = await wallet.signAndExecuteTransactionBlock({
                transactionBlock: signTransactionCreateOffer({
                    creator_coin_amount: creatorCoinAmount || 0,
                    creator_object_ids: creatorObjectIds.map((obj) => obj.id),
                    creator_objects: creatorObjectIds.map((obj) => obj.id),
                    recipient: recipientAddress,
                    recipient_coin_amount: recipientCoinAmount || 0,
                    recipient_object_ids: recipientObjectIds.map((obj) => obj.id),
                }),
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
                AlertSucceed("CreateOffer");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setWaitSui(false);
        }
    }

    async function acceptOffer() {
        if (!wallet || !recipientAddress) return;
        console.log("createOffer");
        setWaitSui(true);
        try {
            const response = await wallet.signAndExecuteTransactionBlock({
                transactionBlock: signTransactionAcceptOffer({
                    offerId: "0xe2cba66bc9dd227848b4217c4c4313515055e248df126f859dc04727119dd475",
                    recipient_coin_amount: 0,
                    recipient_objects: [
                        "0xb5cdddf741ecde5a523157995f32fabfb02b1ca546bbc5a74d9fde0a2d116fc7",
                        "0x9dadc80073fba81f92d10d79add2bd508dc462f54d6a94f6a3d5bdc252d12d5a",
                    ],
                }),
                options: {
                    showEffects: true,
                },
            });

            const status = getExecutionStatus(response);
            console.log(status);
            if (status?.status === "failure") {
                console.log(status.error);
                const error_status = getExecutionStatusError(response);
                if (error_status) AlertErrorMessage(error_status);
            } else {
                AlertSucceed("CreateOffer");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setWaitSui(false);
        }
    }

    const Title = () => {
        return (
            <div className="md:mt-20 mt-4 md:mb-0 mb-4 flex justify-between">
                <div>
                    <h1 className={classNames("md:text-4xl text-2xl font-bold text-blackColor")}>Welcome to Hola P2P
                        Swap</h1>
                    <p className={classNames("md:text-lg text-sm font-medium mt-1 text-grayColor")}>
                        Swap NFTs secure and without third-parties companies!
                    </p>
                </div>
                <button
                    className="w-40 font-semibold rounded-lg border-2 h-12 border-grayColor text-blackColor bg-white hover:bg-yellowColor hover:border-yellowColor hover:text-white"
                    onClick={() => setShowHistory(true)}>
                    View History
                </button>
            </div>
        )
    }

    return status === EthosConnectStatus.NoConnection ? (
        <NoConnectWallet title={"P2P Swap!"}/>
    ) : (
        <main
            className={classNames(
                "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg ",
                font_montserrat.className,
                "mt-8"
            )}
        >
            <>
                <Title/>
                <div
                    className="flex flex-col justify-items-center justify-evenly bg-white items-center md:mt-8 mt-4 mb-4 rounded-2xl md:h-[55vh] h-full pb-8 pt-8 px-2 md:px-8 md:py-8 ">
                    <div className="w-full items-center gap-1 md:flex justify-between mb-2">
                        <SwapInformation
                            userObjectIds={creatorObjectIds}
                            setShowCollection={setShowCollection}
                            setCoinAmount={setCreatorCoinAmount}
                            coinAmount={creatorCoinAmount}
                        />

                        {/* //Counterparty wallet address */}
                        <SwapInformation
                            userObjectIds={recipientObjectIds}
                            setShowCollection={setShowReceivedNFT}
                            setCoinAmount={setRecipientCoinAmount}
                            coinAmount={recipientCoinAmount}
                            recipientAddress={recipientAddress}
                            isRecipient={true}
                        />
                    </div>
                    <button
                        onClick={createOffer}
                        disabled={waitSui}
                        className="w-full py-3 bg-redColor text-white font-medium mt-2 rounded-md disabled:opacity-50"
                    >
                        Create Offer
                    </button>
                </div>

                <div className="flex gap-10 justify-center">
                    <p className="text-sm underline">Verified Collection</p>
                    {/* <p className="text-sm">Rules</p> */}
                    <p className="text-sm text-right md:text-center">Fees Swap 0.4 sui</p>
                </div>
                {showCollection && (
                    <MyCollectionDialog
                        wallet={wallet}
                        opened={showCollection}
                        setOpened={setShowCollection}
                        batchIdTrade={creatorObjectIds}
                        setBatchIdTrade={setCreatorObjectIds}
                    />
                )}
                {showReceivedNFT && (
                    <RecieveNFTDialog
                        wallet={wallet}
                        opened={showReceivedNFT}
                        setOpened={setShowReceivedNFT}
                        batchIdTrade={recipientObjectIds}
                        setBatchIdTrade={setRecipientObjectIds}
                        walletAddressToSearch={recipientAddress}
                        setWalletAddressToSearch={setRecipientAddress}
                    />
                )}
                {showHistory && allOffers && <HistoryP2PDialog wallet={wallet}
                                                               opened={showHistory}
                                                               setOpened={setShowHistory}
                                                               offers={allOffers}/>}
            </>
        </main>
    );
};

export default Swap;
