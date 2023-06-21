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
            <Dialog.Panel className="max-w-lg md:h-[24vh] h-[24vh] w-full relative transform overflow-auto rounded-lg bg-bgMain px-8 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "flex justify-between text-base leading-6 px-5 text-grayColor text-center mb-2 font-bold",
                  font_montserrat.className
                )}
              >
                <p className="mt-1 md:text-2xl text-blackColor text-lg font-bold">{"Success"}</p>
              </Dialog.Title>
              <div className="flex flex-col px-5 justify-start">
                <div className={"mt-2 text-grayColor leading-5 font-medium"}>
                  {title === "Accept" ? "You successfully accepted the offer" : "You successfully cancel the offer"}
                </div>

                <div className={"mt-6 flex justify-between w-full items-center gap-2"}>
                  <button
                    className={classNames(
                      "w-full text-center px-3 text-sm py-3 bg-purpleColor text-white font-bold rounded-md hover:bg-purpleColor/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                      font_montserrat.className
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
