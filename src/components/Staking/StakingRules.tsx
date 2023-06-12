import {classNames, PRICE_STACKED, PRICE_UNSTACKED} from "utils";
import {Dialog, Transition} from "@headlessui/react";
import {Fragment, Dispatch, SetStateAction} from "react";
import {Montserrat} from "next/font/google";

const font_montserrat = Montserrat({subsets: ["latin"]});

export const RulesDialog = ({openRules, setOpenRules}: { openRules: boolean, setOpenRules:  Dispatch<SetStateAction<boolean>>}) => {
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
                    <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-auto">
                    <div className="flex min-h-full items-center justify-center">
                        <Dialog.Panel
                            className="relative transform overflow-hidden rounded-lg bg-bgMain px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                            <Dialog.Title
                                as="h3"
                                className={
                                    classNames("text-base leading-6 text-grayColor text-center mb-2 font-bold", font_montserrat.className)
                                }
                            >
                                FAQs
                            </Dialog.Title>
                            <div className="flex flex-col items-center justify-start">
                                <div className={classNames("mt-2 flex flex-col items-start gap-2", font_montserrat.className)}>
                                    <p
                                        className={
                                            "text-left text-grayColor mt-3 flex flex-col font-medium items-center content-center"
                                        }
                                    >
                                        What are Hola Points?
                                    </p>
                                    <p
                                        className={classNames(
                                            "font-normal text-left text-grayColor text-sm flex flex-col -mt-2 items-center content-center",
                                        )}
                                    >
                                        Hola Points are not tokens, it's points. It's a reward system for Hola users.
                                        You can earn Hola
                                        Points by staking frens. The more frens you stake, the more points you earn.
                                    </p>

                                    <p
                                        className={classNames(
                                            "text-left text-grayColor mt-3 flex flex-col font-medium items-center content-center",
                                        )}
                                    >
                                        How can I spend my points?
                                    </p>
                                    <p
                                        className={classNames(
                                            "font-normal text-left text-grayColor text-sm flex flex-col -mt-2 items-center content-center",
                                        )}
                                    >
                                        TBA.
                                    </p>

                                    <p
                                        className={classNames(
                                            "text-left text-grayColor flex flex-col mt-4 font-medium items-center content-center",
                                        )}
                                    >
                                        Why do you need fees?
                                    </p>
                                    <p
                                        className={classNames(
                                            "font-normal text-left text-grayColor text-sm flex flex-col -mt-2 items-center content-center",
                                        )}
                                    >
                                        We need fees to continue developing this project, as they help cover costs for
                                        servers and other
                                        resources.
                                    </p>

                                    <p
                                        className={classNames(
                                            "text-left text-grayColor flex flex-col mt-4 font-medium items-center content-center",
                                        )}
                                    >
                                        Who developed this project?
                                    </p>
                                    <p
                                        className={classNames(
                                            "font-normal text-left text-grayColor text-sm flex flex-col -mt-2 items-center content-center",
                                        )}
                                    >
                                        The project was developed by the LoyaltyGM team.
                                    </p>

                                    <p
                                        className={classNames(
                                            "text-left text-grayColor flex flex-col mt-4 font-medium items-center content-center",
                                        )}
                                    >
                                        If I have an NFT project, can I use the Hola Protocol?
                                    </p>
                                    <p
                                        className={classNames(
                                            "font-normal text-left text-grayColor text-sm -mt-2 items-start content-center",
                                        )}
                                    >
                                        <p>
                                            Yes, if you have an NFT project and want to use the Hola Protocol, please
                                            contact us on Twitter
                                        </p>
                                        <a href="https://twitter.com/Loyalty_GM" target="_blank" className="underline">
                                            at @Loyalty_GM to discuss further
                                        </a>
                                    </p>

                                    <button
                                        className={classNames(
                                            "w-full block mx-auto mb-1 mt-2 px-3 text-sm py-2 bg-redColor text-white font-black rounded-md hover:bg-[#c8517c] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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

export const StakingRules = () => {
    return (
        <div className={classNames("gap-2 flex text-grayColor items-top", font_montserrat.className)}>
            <div className="text-xs px-2 py-1 font-medium">Fees for each:</div>
            <span
                className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ring-gray-200">
          <svg className="h-1.5 w-1.5 fill-yellowColor" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3}/>
          </svg>
                {PRICE_STACKED} SUI STAKE
        </span>
            <span
                className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium ring-gray-200">
          <svg className="h-1.5 w-1.5 fill-[#5A5A95]" viewBox="0 0 6 6" aria-hidden="true">
            <circle cx={3} cy={3} r={3}/>
          </svg>
                {PRICE_UNSTACKED} SUI UNSTAKE
        </span>
        </div>
    );
};