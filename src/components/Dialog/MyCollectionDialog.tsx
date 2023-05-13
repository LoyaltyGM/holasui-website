import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { ICapy } from "types";
import { Montserrat } from "next/font/google";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { classNames } from "utils";
import Image from "next/image";
import { fetchSuifrens } from "services/sui";

const font_montserrat = Montserrat({ subsets: ["latin"] });

type BatchIdTradeType = {
  id: string;
  url: string;
};

export const MyCollectionDialog = ({
  wallet,
  opened,
  setOpened,
  batchIdTrade,
  setBatchIdTrade,
}: {
  wallet: any;
  opened: boolean;
  setOpened: any;
  batchIdTrade: BatchIdTradeType[];
  setBatchIdTrade: any;
}) => {
  if (!wallet) return <></>;

  const [frens, setFrens] = useState<ICapy[] | null>();

  const nfts = wallet?.contents?.nfts!;
  const suifrens = fetchSuifrens(nfts);
  console.log(suifrens);

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const suifrens = fetchSuifrens(nfts);
        if (suifrens) setFrens(suifrens);

        console.log("suifrens", suifrens);
      } catch (e) {
        console.error(e);
      }
    }
    fetchWalletFrens().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

  const handleSetBatchIdStake = (
    id: string,
    url: string,
    batchIdTrade: BatchIdTradeType[],
    setBatchIdTrade: Dispatch<SetStateAction<BatchIdTradeType[]>>
  ) => {
    console.log("Handle state", batchIdTrade);
    // Check if the id already exists in the array
    if (!batchIdTrade.some((item) => item.id! === id)) {
      // If it doesn't exist, add it to the array
      setBatchIdTrade((prevBatchIdStake) => [...prevBatchIdStake, { id, url }]);
    } else {
      // If it exists, remove it from the array
      setBatchIdTrade((prevBatchIdStake) => prevBatchIdStake.filter((item) => item.id !== id));
    }
  };

  //   console.log("Batch", batchIdTrade);
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

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="max-w-2xl md:h-[65vh] h-[70vh] w-full relative transform overflow-hidden rounded-lg bg-bgMain px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "flex justify-between text-base leading-6 text-[#595959] text-center mb-2 font-bold",
                  font_montserrat.className
                )}
              >
                <p className="text-xs mt-3 font-light">Selected ({batchIdTrade.length})</p>
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
                              onClick={() => {
                                handleSetBatchIdStake(fren.id, fren.url, batchIdTrade, setBatchIdTrade);
                              }}
                            >
                              <div
                                className={classNames(
                                  "border flex flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer",
                                  batchIdTrade.some((item) => item.id === fren.id)
                                    ? "border-yellowColor"
                                    : "border-darkColor"
                                )}
                              >
                                <Image src={fren.url} alt="collection_img" width={90} height={130} className="mt-1" />
                                <p className="mt-1">{`${fren.description}`}</p>
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
                      "w-full block mx-auto my-4 px-3 text-sm py-2 bg-yellowColor text-white font-black rounded-md hover:bg-[#e5a44a] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
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
