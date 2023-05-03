import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ICapy } from "types";
import Image from "next/image";
import { convertIPFSUrl, classNames } from "utils";

export function DialogShowNFT(props: { setOpen: boolean | any; open: boolean | any; capy: ICapy | undefined }) {
  return (
    <>
      {props?.open ? (
        <Transition.Root show={props.open} as={Fragment}>
          <Dialog as="div" className="relative" onClose={props.setOpen}>
            <div className="fixed inset-0 overflow-y-auto bg-black/60 z-[80]">
              <div className="flex min-h-full items-end justify-center p-4 pt-6 text-center sm:items-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-Black1 px-10 flex flex-col justify-evenly h-[27rem] text-left shadow-xl transition-all sm:w-full max-w-lg bg-white">
                    <div className="space-y-2">
                      <p className="text-2xl text-center font-bold">Congratulations You Got!</p>
                    </div>
                    {props.capy ? (
                      <div className="flex flex-wrap w-full justify-between">
                        <div className={classNames("justify-between p-4 rounded-2xl", "bg-slate-400")}>
                          <Image
                            src={convertIPFSUrl(props.capy.url)}
                            alt={props.capy.name}
                            width={35}
                            height={35}
                            className="w-[65px] h-[65px] p-2 object-cover rounded-lg"
                            unoptimized={false}
                          />
                          <p className="text-normal text-center text-white font-medium">{props.capy.name}</p>
                        </div>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-xl btn-gradient px-4 py-5 text-base font-bold bg-[#5767EF] text-white shadow-sm hover:text-Gray1 sm:mt-0 sm:text-sm"
                      onClick={() => props.setOpen(false)}
                    >
                      Gotcha!
                    </button>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : null}
    </>
  );
}
