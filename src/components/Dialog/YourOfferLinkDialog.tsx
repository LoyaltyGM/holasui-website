import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IYourOfferLinkDialog } from "types";
import { Montserrat } from "next/font/google";
import { classNames, formatSuiAddress } from "utils";
import Link from "next/link";
import { CopyTextButton } from "../Utils";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export const YourOfferLinkDialog = ({ recipientAddress, transactionHash, opened, setOpened }: IYourOfferLinkDialog) => {
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
            <Dialog.Panel className="max-w-lg md:h-[35vh] h-[35vh] w-full relative transform overflow-auto rounded-lg bg-bgMain px-8 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "flex justify-between text-base leading-6 px-5 text-grayColor text-center mb-2 font-bold",
                  font_montserrat.className
                )}
              >
                <p className="mt-1 md:text-2xl text-blackColor text-lg font-bold">{`Your offer to ${recipientAddress && formatSuiAddress(recipientAddress) || 'underfiend'}`}</p>
              </Dialog.Title>
              <div className="flex flex-col px-5 items-center justify-center">
                <div className={'mt-5 text-grayColor leading-5 font-medium'}>
                  Copy link and send it to your friend. He will be able to accept your offer by clicking on the link.
                </div>
                <div className={'w-full mt-4 text-grayColor'}>
                  <p className={'font-bold'}>Link</p>
                  <div className={'mt-2'}>
                    <CopyTextButton
                      showText={"https://dashboard.holasui.app/swap/history/" + formatSuiAddress(transactionHash)}
                      copyText={"https://dashboard.holasui.app/swap/history/" + transactionHash}
                    />
                  </div>
                </div>
                <div className={"mt-6 flex justify-between w-full items-center gap-2"}>
                  <button
                    className={classNames(
                      "w-2/5 px-3 text-sm py-3 bg-white text-purpleColor border border-purpleColor hover:bg-purpleColor hover:text-white font-bold rounded-md hover:bg-purpleColor/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                      font_montserrat.className
                    )}
                    onClick={() => {
                      setOpened(false);
                    }}
                  >
                    Close
                  </button>
                  <Link
                    href={"/swap/history/" + transactionHash}
                    className={classNames(
                      "w-2/5 text-center px-3 text-sm py-3 bg-purpleColor text-white font-bold rounded-md hover:bg-purpleColor/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                      font_montserrat.className
                    )}
                  >
                    <p>Go to my offer</p>
                  </Link>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
