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
            <Dialog.Panel className="max-w-2xl md:h-[65vh] h-[70vh] w-full relative transform overflow-auto rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "flex justify-between text-base leading-6 text-black2Color text-center mb-2 font-bold",
                  font_montserrat.className
                )}
              >
                <p className="hidden md:flex text-xs mt-3 font-light">Selected ({batchIdTrade.length})</p>
                <p className="mt-1 md:text-xl text-lg">Choose from your collection</p>

                <button onClick={() => setOpened(false)}>
                  <XMarkIcon className="flex h-7 w-7" />
                </button>
              </Dialog.Title>
              <div className="flex flex-col items-center justify-center">
                <div className={"mt-2 flex flex-col items-center gap-2"}>
                  <div className="flex flex-col">
                    {suifrens ? (
                      <div className={"grid md:grid-cols-5 grid-cols-3 gap-2 md:gap-4 md:mt-4"}>
                        {frens?.map((fren) => {
                          return (
                            <button
                              key={fren.id}
                              onClick={() => {
                                handleSetBatchIdForSwap(fren.id, fren.url, fren.type, setTypeSwap, batchIdTrade, setBatchIdTrade);
                              }}
                            >
                              <div
                                className={classNames(
                                  "border-2 border-black2Color flex bg-white max-h-[160px] min-h-[160px] flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer",
                                  batchIdTrade.some((item) => item.id === fren.id)
                                    ? "border-yellowColor"
                                    : "border-blackColor"
                                )}
                              >
                                <Image src={fren.url} alt="collection_img" width={90} height={130} className="mt-1" />
                                <p className="mt-1 text-xs min-h-[40px] max-h-[40px] text-clip">
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
                      "w-full block mx-auto my-4 px-3 text-sm py-2 bg-purpleColor text-white font-black rounded-md hover:bg-purpleColor/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                      font_montserrat.className
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
