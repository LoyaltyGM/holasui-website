import {Dialog, Transition} from "@headlessui/react";
import {Dispatch, Fragment, SetStateAction, useEffect, useState} from "react";
import {ICapy, IOffer} from "types";
import {Montserrat} from "next/font/google";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {classNames} from "utils";
import Image from "next/image";
import {fetchSuifrens} from "services/sui";

const font_montserrat = Montserrat({subsets: ["latin"]});

export const HistoryP2PDialog = (
    {
        wallet,
        opened,
        setOpened,
        offers
    }: {
        wallet: any;
        opened: boolean;
        setOpened: any;
        offers: IOffer[];
    }) => {
    if (!wallet && !offers) return <></>;

    const [offersDisplay, setOffersDisplay] = useState<IOffer[] | null>();

    useEffect(() => {
        async function fetchWalletOffers() {
            if (!wallet?.address) {
                return;
            }
            try {
                console.log("Offers", offers);
                setOffersDisplay(offers);
            } catch (e) {
                console.error(e);
            }
        }

        fetchWalletOffers().then();
    }, [wallet?.address, wallet?.contents?.nfts, offers]);


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
                            className="max-w-2xl md:h-[65vh] h-[70vh] w-full relative transform overflow-auto rounded-lg bg-bgMain px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6">
                            <Dialog.Title
                                as="h3"
                                className={classNames(
                                    "flex justify-between text-base leading-6 text-[#595959] text-center mb-2 font-bold",
                                    font_montserrat.className
                                )}
                            >
                                <div></div>
                                <p className="mt-1 ml-6 md:text-xl text-xl">History</p>

                                <button onClick={() => setOpened(false)}>
                                    <XMarkIcon className="flex h-7 w-7"/>
                                </button>
                            </Dialog.Title>
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex flex-col bg-black w-full text-white">
                                    <p>sassasaa</p>
                                    {offersDisplay ? <div
                                        className="flex bg-red-300 w-full flex-row items-center justify-between">
                                        {offersDisplay?.map((offer: IOffer) => {
                                            return (
                                                <p className={"text-xl text-black"}>{offer.active}</p>)
                                        })}
                                    </div> : <div className={"bg-yellow-200 w-full h-8"}></div>}
                                </div>
                                <div className={"mt-2 flex flex-col items-center gap-2"}>

                                    <button
                                        className={classNames(
                                            "w-full block mx-auto my-4 px-3 text-sm py-2 bg-purpleColor text-white font-black rounded-md hover:bg-purpleColor/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                                            font_montserrat.className
                                        )}
                                        onClick={() => {
                                            setOpened(false);
                                        }}
                                    >
                                        Confirm
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
