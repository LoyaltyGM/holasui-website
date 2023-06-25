import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { classNames } from "utils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import token from "/public/img/points.png";
import { StakingRules } from "./StakingRules";
import { Montserrat } from "next/font/google";
import { IStakingTicket } from "types";

interface IUnstakeDetailDialog {
  selectedStaked: IStakingTicket | undefined;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  claimPointsFunction: (ticket: IStakingTicket) => Promise<void>;
  unstakeCapyFunction: (ticket: IStakingTicket) => Promise<void>;
  waitSui: boolean;
}

const font_montserrat = Montserrat({ subsets: ["latin"] });
export const UnstakeDetailDialog = ({
  selectedStaked,
  openDialog,
  setOpenDialog,
  claimPointsFunction,
  unstakeCapyFunction,
  waitSui,
}: IUnstakeDetailDialog) => {
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
          <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <Dialog.Title
                className={classNames(
                  "mb-2 flex justify-between  text-center text-base font-bold leading-6 text-black2Color",
                  font_montserrat.className,
                )}
              >
                <p className="mt-1"></p>
                <p className={classNames("mt-1")}>Staking</p>
                <button onClick={() => setOpenDialog(false)}>
                  <XMarkIcon className="flex h-7 w-7 md:hidden" />
                </button>
              </Dialog.Title>
              <div className={classNames("flex flex-col items-center justify-center")}>
                <div className={"mt-2 flex flex-col items-center gap-2"}>
                  <div className="rounded-2xl bg-white px-2 py-4">
                    <Image
                      className="h-[35vh] w-auto rounded-lg"
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
                      "flex flex-col content-center items-center text-center font-bold text-black2Color",
                    )}
                  >
                    Your current hola points
                    <div className="flex items-center  gap-2">
                      <div className="h-2/3 pt-2">
                        <Image src={token} alt={"points"} height={35} width={40} priority />
                      </div>
                      <p className="mt-2 text-3xl font-extrabold">
                        {Math.floor((Date.now() - selectedStaked.start_time) / 60_000)}
                      </p>
                    </div>
                  </div>
                  <button
                    className={classNames(
                      "mx-auto mb-1 mt-2 block w-full cursor-pointer rounded-md bg-yellowColor px-2 py-2 text-sm font-black text-white hover:bg-yellowColorHover disabled:cursor-not-allowed disabled:opacity-50 md:px-3",
                      font_montserrat.className,
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
                      "mx-auto mb-1 mt-2 block w-full cursor-pointer rounded-md bg-pinkColor px-2 py-2 text-sm font-black text-white hover:bg-[#c8517c] disabled:cursor-not-allowed disabled:opacity-50 md:px-3",
                      font_montserrat.className,
                    )}
                    onClick={() => {
                      unstakeCapyFunction(selectedStaked!).then();
                    }}
                    disabled={waitSui}
                  >
                    Unstake
                  </button>

                  <p className={classNames("mb-4 text-center text-xs", font_montserrat.className)}>
                    Points will be calculated to your account after unstaking
                  </p>
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
