import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ISwapActionDialog } from "types";
import { Montserrat } from "next/font/google";
import { classNames } from "utils";
import { useRouter } from "next/router";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export const SwapActionDialog = ({ title, opened, setOpened }: ISwapActionDialog) => {
  const router = useRouter();

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
          <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className={classNames("fixed inset-0 z-10 overflow-auto", font_montserrat.className)}>
          <div className="flex min-h-full  items-center justify-center">
            <Dialog.Panel className="relative h-[24vh] w-full max-w-lg transform overflow-auto rounded-lg bg-basicColor px-8 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 md:h-[24vh]">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "mb-2 flex justify-between px-5 text-center text-base font-bold leading-6 text-black2Color",
                  font_montserrat.className,
                )}
              >
                <p className="mt-1 text-lg font-bold text-blackColor md:text-2xl">{"Success"}</p>
              </Dialog.Title>
              <div className="flex flex-col justify-start px-5">
                <div className={"mt-2 font-medium leading-5 text-black2Color"}>
                  {title === "Accept"
                    ? "You successfully accepted the offer"
                    : "You successfully cancel the offer"}
                </div>

                <div className={"mt-6 flex w-full items-center justify-between gap-2"}>
                  <button
                    className={classNames(
                      "w-full cursor-pointer rounded-md bg-purpleColor px-3 py-3 text-center text-sm font-bold text-white hover:bg-purpleColor/90 disabled:cursor-not-allowed disabled:opacity-50",
                      font_montserrat.className,
                    )}
                    onClick={() => {
                      return router.push("/swap/history");
                    }}
                  >
                    <p>Go to my history</p>
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
