import {Dialog, Transition} from "@headlessui/react";
import {Fragment, useEffect, useState} from "react";
import {ICapy, handleSetBatchIdForSwap, ISwapRecipientCollectionDialog} from "types";
import {Montserrat} from "next/font/google";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {classNames, convertIPFSUrl, formatSuiAddress, FRENS_TYPE, TYPE_WIZARD} from "utils";
import Image from "next/image";
import {fetchSuifrens, suiProvider} from "services/sui";
import {LabeledInput} from "components/Forms/Inputs";

const font_montserrat = Montserrat({subsets: ["latin"]});


function initializeSuifren(nftObject: any): ICapy {
    return {
        id: nftObject?.data?.objectId,
        description: nftObject?.data?.display?.data?.name!,
        url: convertIPFSUrl(nftObject?.data?.display?.data?.image_url!),
        link: "none",
    };
}

export const RecipientCollectionDialog = ({
                                              wallet,
                                              opened,
                                              setOpened,
                                              batchIdTrade,
                                              setBatchIdTrade,
                                              walletAddressToSearch,
                                              setWalletAddressToSearch,
                                          }: ISwapRecipientCollectionDialog) => {
    if (!wallet) return <></>;

    const [frens, setFrens] = useState<ICapy[] | null>();
    const [tempSearchState, setTempSearchState] = useState<string>("");

    useEffect(() => {
        if (!walletAddressToSearch) return;
        fetchRecipientWallet(walletAddressToSearch).then();
    }, [walletAddressToSearch]);

    const nfts = wallet?.contents?.nfts!;
    const suifrens = fetchSuifrens(nfts);

    async function fetchRecipientWallet(searchWalletAddress: string) {
        if (!searchWalletAddress) {
            return;
        }
        // if we don't have anything in temp search state skip this condition
        if (tempSearchState) {
            setWalletAddressToSearch(tempSearchState);
        }
        try {
            const response = await suiProvider.getOwnedObjects({
                owner: searchWalletAddress,
                options: {showContent: true, showType: true, showDisplay: true},
            });

            console.log("RESPONSE", response.data)
            const suifrens = response.data
                .filter(
                    (object) => object?.data?.type === FRENS_TYPE ||
                     object?.data?.type === TYPE_WIZARD
                    // object?.data?.type === TYPE_FUDDIES
                )
                .map((suifrenNftObject) => {
                    return initializeSuifren(suifrenNftObject);
                });

            setFrens(suifrens);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <Transition.Root show={opened} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={() => {
                    setOpened(false);
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
                    <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-auto">
                    <div className="flex min-h-full items-center justify-center">
                        <Dialog.Panel
                            className="max-w-2xl  md:h-[65vh] h-[70vh] w-full relative transform overflow-auto rounded-lg bg-bgMain px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6">
                            <Dialog.Title
                                as="h3"
                                className={classNames(
                                    "flex justify-between items-center content-center text-base leading-6 text-grayColor text-center mb-2 font-bold",
                                    font_montserrat.className
                                )}
                            >
                                <p className="md:text-xs text-xs mt-1 font-light">Selected ({batchIdTrade.length})</p>
                                <p className="mt-1 md:text-xl text-sm">Select NFTs you want</p>

                                <button onClick={() => setOpened(false)}>
                                    <XMarkIcon className="flex h-7 w-7"/>
                                </button>
                            </Dialog.Title>
                            <div className="flex  w-full flex-col items-center justify-center">
                                <div className={"mt-2 flex flex-col items-center gap-2 w-full"}>
                                    <div className={classNames("w-full mt-2 bg-white", font_montserrat.className)}>
                                        <LabeledInput>
                                            <div className="relative bg-white px-2 my-1">
                                                <input
                                                    type={"text"}
                                                    name="wallet_address"
                                                    className={"input-field w-full text-sm mr-4"}
                                                    placeholder="Sui Wallet"
                                                    onChange={(e) => setTempSearchState(e.target.value)}
                                                />
                                            </div>
                                        </LabeledInput>
                                    </div>
                                    <div className={'py-2 w-full gap-1 flex content-center items-center'}>
                                        {walletAddressToSearch && (
                                            <>
                                            <p className={classNames("text-sm text-grayColor", font_montserrat.className)}
                                            >{`Wallet Collection: ${formatSuiAddress(walletAddressToSearch)}`}</p>
                                            <XMarkIcon className='w-5 h-5 text-grayColor cursor-pointer' onClick={()=>{
                                                setWalletAddressToSearch("")
                                                setBatchIdTrade([])
                                                setFrens([])
                                            }} />
                                            </>
                                        )}
                                    </div>
                                    <div className="flex flex-col min-h-[32vh]">
                                        {suifrens ? (
                                            <div
                                                className={"grid md:grid-cols-5 grid-cols-3 gap-2 md:gap-[1.25rem] md:mt-4 overflow-auto"}>
                                                {frens?.map((fren) => {
                                                    return (
                                                        <button
                                                            onClick={() => {
                                                                handleSetBatchIdForSwap(fren.id, fren.url, batchIdTrade, setBatchIdTrade);
                                                            }}
                                                            key={fren.id}
                                                        >
                                                            <div
                                                                className={classNames(
                                                                    "border-2 bg-white flex flex-col content-center justify-center items-center p-2 rounded-md cursor-pointer",
                                                                    batchIdTrade.some((item) => item.id === fren.id)
                                                                        ? "border-yellowColor"
                                                                        : "border-grayColor"
                                                                )}
                                                            >
                                                                <Image src={fren.url} alt="collection_img" width={90}
                                                                       height={130} className="mt-1"/>
                                                                <p className="mt-1">{classNames(fren.description ? `${fren.description}` : '')}</p>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p>Loading...</p>
                                        )}
                                    </div>

                                    <button
                                        className={classNames(
                                            "w-full block mx-auto mt-2 px-3 text-sm py-2 text-white font-black rounded-md  cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                                            font_montserrat.className,
                                            batchIdTrade?.length === 0
                                                ? "bg-redColor hover:bg-redColor/95"
                                                : "bg-yellowColor hover:bg-[#e5a44a]"
                                        )}
                                        onClick={() => {
                                            batchIdTrade?.length === 0 ? fetchRecipientWallet(tempSearchState) : setOpened(false);
                                        }}
                                    >
                                        {batchIdTrade?.length === 0 ? "Search" : "Confirm Items"}
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
