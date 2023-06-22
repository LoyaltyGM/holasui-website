import {Dialog, Transition} from "@headlessui/react";
import {Dispatch, Fragment, SetStateAction} from "react";
import {classNames} from "utils";
import {XMarkIcon} from "@heroicons/react/24/solid";
import Image from "next/image";
import token from "/public/img/points.png";
import {StakingRules} from "./StakingRules";
import {Montserrat} from "next/font/google";
import {IStakingTicket} from "types";

interface IUnstakeDetailDialog {
    selectedStaked: IStakingTicket | undefined;
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
    claimPointsFunction: (ticket: IStakingTicket) => Promise<void>;
    unstakeCapyFunction: (ticket: IStakingTicket) => Promise<void>;
    waitSui: boolean;
}

const font_montserrat = Montserrat({subsets: ["latin"]});
export const UnstakeDetailDialog = ({selectedStaked, openDialog, setOpenDialog, claimPointsFunction, unstakeCapyFunction, waitSui} : IUnstakeDetailDialog) => {
    if (!selectedStaked) return <></>;

    return (
        <Transition.Root show={openDialog} as={Fragment}>
            <Dialog
                as="div"
                className={classNames("relative z-10", font_montserrat.className)}
                onClose={() => {
                    setOpenDialog(false);
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
                            className="relative transform overflow-hidden rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                            <Dialog.Title
                                className={classNames(
                                    "flex justify-between text-base  leading-6 text-black2Color text-center mb-2 font-bold",
                                    font_montserrat.className
                                )}
                            >
                                <p className="mt-1"></p>
                                <p className={classNames("mt-1")}>Staking</p>
                                <button onClick={() => setOpenDialog(false)}>
                                    <XMarkIcon className="flex md:hidden h-7 w-7"/>
                                </button>
                            </Dialog.Title>
                            <div className={classNames("flex flex-col items-center justify-center")}>
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
                                            "font-bold text-center text-black2Color flex flex-col items-center content-center",
                                        )}
                                    >
                                        Your current hola points
                                        <div className="flex gap-2  items-center">
                                            <div className="h-2/3 pt-2">
                                                <Image src={token} alt={"points"} height={35} width={40} priority/>
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
                                            claimPointsFunction(selectedStaked!).then();
                                        }}
                                        disabled={waitSui}
                                    >
                                        Claim Points
                                    </button>
                                    <button
                                        className={classNames(
                                            "w-full block mx-auto mb-1 mt-2 md:px-3 px-2 text-sm py-2 bg-pinkColor text-white font-black rounded-md hover:bg-[#c8517c] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                                            font_montserrat.className
                                        )}
                                        onClick={() => {
                                            unstakeCapyFunction(selectedStaked!).then();
                                        }}
                                        disabled={waitSui}
                                    >
                                        Unstake
                                    </button>

                                    <p className={classNames("mb-4 text-xs text-center", font_montserrat.className)}>
                                        Points will be calculated to your account after unstaking
                                    </p>
                                    <StakingRules/>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};