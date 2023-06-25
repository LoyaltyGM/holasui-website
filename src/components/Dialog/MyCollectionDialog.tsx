import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { handleSetBatchIdForSwap, ICapy, ISwapCollectionDialog } from "types";
import { Montserrat } from "next/font/google";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { classNames } from "utils";
import Image from "next/image";
import { fetchNFTObjects } from "services/sui";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export const MyCollectionDialog = ({
  wallet,
  opened,
  setOpened,
  batchIdTrade,
  setBatchIdTrade,
  setTypeSwap,
  typeSwap,
}: ISwapCollectionDialog) => {
  if (!wallet) return <></>;

  const [frens, setFrens] = useState<ICapy[] | null>();

  const nfts = wallet?.contents?.nfts!;
  const suifrens = fetchNFTObjects(nfts);

  useEffect(() => {
    async function fetchWalletObjects() {
      if (!wallet?.address) {
        return;
      }
      try {
        const nfts = wallet?.contents.objects;
        const suifrens = fetchNFTObjects(nfts);
        if (suifrens) setFrens(suifrens);
      } catch (e) {
        console.error(e);
      }
    }

    fetchWalletObjects().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

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
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="relative h-[70vh] w-full max-w-2xl transform overflow-auto rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 md:h-[65vh]">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "mb-2 flex justify-between text-center text-base font-bold leading-6 text-black2Color",
                  font_montserrat.className,
                )}
              >
                <p className="mt-3 hidden text-xs font-light md:flex">
                  Selected ({batchIdTrade.length})
                </p>
                <p className="mt-1 text-lg md:text-xl">Choose from your collection</p>

                <button onClick={() => setOpened(false)}>
                  <XMarkIcon className="flex h-7 w-7" />
                </button>
              </Dialog.Title>
              <div className="flex flex-col items-center justify-center">
                <div className={"mt-2 flex flex-col items-center gap-2"}>
                  <div className="flex flex-col">
                    {suifrens ? (
                      <div className={"grid grid-cols-3 gap-2 md:mt-4 md:grid-cols-5 md:gap-4"}>
                        {frens?.map((fren) => {
                          return (
                            <button
                              key={fren.id}
                              onClick={() => {
                                handleSetBatchIdForSwap(
                                  fren.id,
                                  fren.url,
                                  fren.type,
                                  setTypeSwap,
                                  batchIdTrade,
                                  setBatchIdTrade,
                                );
                              }}
                            >
                              <div
                                className={classNames(
                                  "flex max-h-[160px] min-h-[160px] cursor-pointer flex-col content-center items-center justify-center rounded-md border-2 border-black2Color bg-white  p-2",
                                  batchIdTrade.some((item) => item.id === fren.id)
                                    ? "border-yellowColor"
                                    : "border-blackColor",
                                )}
                              >
                                <Image
                                  src={fren.url}
                                  alt="collection_img"
                                  width={90}
                                  height={130}
                                  className="mt-1"
                                />
                                <p className="mt-1 max-h-[40px] min-h-[40px] text-clip text-xs">
                                  {classNames(fren.description ? `${fren.description}` : "")}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p>Loading..</p>
                    )}
                  </div>
                  <button
                    className={classNames(
                      "mx-auto my-4 block w-full cursor-pointer rounded-md bg-purpleColor px-3 py-2 text-sm font-black text-white hover:bg-purpleColor/90 disabled:cursor-not-allowed disabled:opacity-50",
                      font_montserrat.className,
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
