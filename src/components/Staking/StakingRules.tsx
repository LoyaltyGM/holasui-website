import { classNames, PRICE_STACKED, PRICE_UNSTACKED } from "utils";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, Dispatch, SetStateAction } from "react";
import { Montserrat } from "next/font/google";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export const RulesDialog = ({
  openRules,
  setOpenRules,
}: {
  openRules: boolean;
  setOpenRules: Dispatch<SetStateAction<boolean>>;
}) => {
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
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "mb-2 text-center text-base font-bold leading-6 text-black2Color",
                  font_montserrat.className,
                )}
              >
                FAQs
              </Dialog.Title>
              <div className="flex flex-col items-center justify-start">
                <div
                  className={classNames(
                    "mt-2 flex flex-col items-start gap-2",
                    font_montserrat.className,
                  )}
                >
                  <p
                    className={
                      "mt-3 flex flex-col content-center items-center text-left font-medium text-black2Color"
                    }
                  >
                    What are Hola Points?
                  </p>
                  <p
                    className={classNames(
                      "-mt-2 flex flex-col content-center items-center text-left text-sm font-normal text-black2Color",
                    )}
                  >
                    Hola Points are not tokens, it's points. It's a reward system for Hola users.
                    You can earn Hola Points by staking frens. The more frens you stake, the more
                    points you earn.
                  </p>

                  <p
                    className={classNames(
                      "mt-3 flex flex-col content-center items-center text-left font-medium text-black2Color",
                    )}
                  >
                    How can I spend my points?
                  </p>
                  <p
                    className={classNames(
                      "-mt-2 flex flex-col content-center items-center text-left text-sm font-normal text-black2Color",
                    )}
                  >
                    TBA.
                  </p>

                  <p
                    className={classNames(
                      "mt-4 flex flex-col content-center items-center text-left font-medium text-black2Color",
                    )}
                  >
                    Why do you need fees?
                  </p>
                  <p
                    className={classNames(
                      "-mt-2 flex flex-col content-center items-center text-left text-sm font-normal text-black2Color",
                    )}
                  >
                    We need fees to continue developing this project, as they help cover costs for
                    servers and other resources.
                  </p>

                  <p
                    className={classNames(
                      "mt-4 flex flex-col content-center items-center text-left font-medium text-black2Color",
                    )}
                  >
                    Who developed this project?
                  </p>
                  <p
                    className={classNames(
                      "-mt-2 flex flex-col content-center items-center text-left text-sm font-normal text-black2Color",
                    )}
                  >
                    The project was developed by the LoyaltyGM team.
                  </p>

                  <p
                    className={classNames(
                      "mt-4 flex flex-col content-center items-center text-left font-medium text-black2Color",
                    )}
                  >
                    If I have an NFT project, can I use the Hola Protocol?
                  </p>
                  <p
                    className={classNames(
                      "-mt-2 content-center items-start text-left text-sm font-normal text-black2Color",
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
                      "mx-auto mb-1 mt-2 block w-full cursor-pointer rounded-md bg-pinkColor px-3 py-2 text-sm font-black text-white hover:bg-[#c8517c] disabled:cursor-not-allowed disabled:opacity-50",
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
    <div className={classNames("items-top flex gap-2 text-black2Color", font_montserrat.className)}>
      <div className="px-2 py-1 text-xs font-medium">Fees for each:</div>
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
