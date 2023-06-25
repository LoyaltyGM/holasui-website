import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { classNames } from "utils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { StakingRules } from "./StakingRules";
import { IObjectDetailDialog } from "types";
import { Montserrat } from "next/font/google";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export const ObjectDetailDialog = ({
  selectedFrend,
  openedFrend,
  setOpenedFrend,
  stakeFunction,
  waitSui,
}: IObjectDetailDialog) => {
  if (!selectedFrend) return <></>;
  return (
    <Transition.Root show={openedFrend} as={Fragment}>
      <Dialog
        as="div"
        className={classNames("relative z-10", font_montserrat.className)}
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
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "mb-2 flex justify-between  text-center text-base font-bold leading-6 text-black2Color",
                  font_montserrat.className,
                )}
              >
                <p className="mt-1"></p>
                <p className="mt-1">Start staking</p>
                <button onClick={() => setOpenedFrend(false)}>
                  <XMarkIcon className="flex h-7 w-7 md:hidden" />
                </button>
              </Dialog.Title>
              <div className="flex flex-col items-center justify-center">
                <div className={"mt-2 flex flex-col items-center gap-2"}>
                  <div className="rounded-2xl bg-white px-2 py-4">
                    <Image
                      className="h-[35vh] w-auto rounded-lg"
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
                      "mx-auto my-4 block w-full cursor-pointer rounded-md bg-yellowColor px-3 py-2 text-sm font-black text-white hover:bg-[#e5a44a] disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    onClick={() => {
                      stakeFunction(selectedFrend!).then();
                    }}
                    disabled={waitSui}
                  >
                    Stake
                  </button>
                  <StakingRules />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
