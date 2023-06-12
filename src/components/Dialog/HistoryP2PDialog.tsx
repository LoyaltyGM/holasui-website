import {Dialog, Transition} from "@headlessui/react";
import {Fragment, useEffect, useState} from "react";
import {IOffer} from "types";
import {Montserrat} from "next/font/google";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {classNames} from "utils";
import Link from "next/link";

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

    const [activeTab, setActiveTab] = useState('sent');
    const [sentOffers, setSentOffers] = useState<IOffer[] | null>();
    const [receivedOffers, setReceivedOffers] = useState<IOffer[] | null>();

    useEffect(() => {
        async function fetchWalletOffers() {
            if (!wallet?.address) {
                return;
            }
            try {
                const sent = offers.filter(offer => offer.creator === wallet.address);
                const received = offers.filter(offer => offer.recipient !== wallet.address);

                setSentOffers(sent);
                setReceivedOffers(received);
            } catch (e) {
                console.error(e);
            }
        }

        fetchWalletOffers().then();
    }, [wallet?.address, wallet?.contents?.nfts, offers]);

    const generateLink = (offer: IOffer) => {
        return "/swap/" + offer.id; // replace this with your actual link generation function
    };



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
                            className="max-w-5xl md:h-[65vh] h-[70vh] w-full relative transform overflow-auto rounded-lg bg-bgMain px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6">
                            <Dialog.Title
                                as="h3"
                                className={classNames(
                                    "flex justify-between text-base leading-6 text-grayColor text-center mb-2 font-bold",
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
                                <div className="flex flex-col w-full text-white">
                                    <div className={'flex justify-between gap-10 mb-5'}>
                                        <button onClick={() => setActiveTab('sent')} className={classNames('px-4 w-1/2 font-medium py-2 rounded-xl', activeTab === 'sent' ? "text-redColor underline" : "text-[#7E7E7E]")}>Sent Offers</button>
                                        <button onClick={() => setActiveTab('received')} className={classNames('px-4 w-1/2 font-medium py-2 rounded-xl', activeTab === 'received' ? "text-redColor underline" : "text-[#7E7E7E]")}>Received Offers</button>
                                    </div>
                                    {activeTab === 'sent' && sentOffers && (
                                        <table className={'text-black'}>
                                            <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Wallet Address</th>
                                                <th>Active</th>
                                                <th>Link</th>
                                            </tr>
                                            </thead>
                                            <tbody className={"text-black"}>
                                            {sentOffers.map((offer, index) => (
                                                <tr key={offer.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{offer.recipient}</td>
                                                    <td>{offer.active ? 'Yes' : 'No'}</td>
                                                    {offer.id ? <td><Link href={generateLink(offer)}>Details</Link></td> : <></>}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    )}
                                    {activeTab === 'received' && receivedOffers && (
                                        <table className={'text-black'}>
                                            <thead className={'mb-2'}>
                                            <tr>
                                                <th>#</th>
                                                <th>Wallet Address</th>
                                                <th>Active</th>
                                                <th>Link</th>
                                            </tr>
                                            </thead>
                                            <tbody className={'space-y-2'}>
                                            {receivedOffers.map((offer, index) => (
                                                <tr key={offer.id?.id!}>
                                                    <td>{index + 1}</td>
                                                    <td>{offer.recipient}</td>
                                                    <td>{offer.active ? 'Yes' : 'No'}</td>
                                                    {offer.id ? <td><Link href={"/swap/" + offer.id?.id}>Details</Link></td> : <></>}



                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    )}
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
