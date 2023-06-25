import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { handleSetBatchIdForSwap, ICapy, ISwapRecipientCollectionDialog } from "types";
import { Montserrat } from "next/font/google";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { classNames, convertIPFSUrl, formatSuiAddress, CAPY_TYPE, SWAP_TYPES_LIST } from "utils";
import Image from "next/image";
import { fetchNFTObjects, suiProvider } from "services/sui";
import { LabeledInput } from "components/Forms/Inputs";

const font_montserrat = Montserrat({ subsets: ["latin"] });

function initializeSuifren(nftObject: any): ICapy {
  return {
    id: nftObject?.data?.objectId,
    description: nftObject?.data?.display?.data?.name!,
    url: convertIPFSUrl(nftObject?.data?.display?.data?.image_url!),
    link: "none",
    type: nftObject?.data?.type!,
  };
}

export const RecipientCollectionDialog = ({
  creatorBatchIdTrade,
  wallet,
  opened,
  setOpened,
  batchIdTrade,
  setBatchIdTrade,
  walletAddressToSearch,
  setWalletAddressToSearch,
  setTypeSwap,
  typeSwap,
}: ISwapRecipientCollectionDialog) => {
  if (!wallet) return <></>;
  console.log("creator", creatorBatchIdTrade);
  const [frens, setFrens] = useState<ICapy[] | null>();
  const [tempSearchState, setTempSearchState] = useState<string>("");

  useEffect(() => {
    if (!walletAddressToSearch) return;
    fetchRecipientWallet(walletAddressToSearch).then();
  }, [walletAddressToSearch]);

  const nfts = wallet?.contents?.nfts!;
  const suifrens = fetchNFTObjects(nfts);

  async function fetchRecipientWallet(searchWalletAddress: string) {
    if (!searchWalletAddress) {
      return;
    }
    // if we don't have anything in temp search state skip this condition
    if (tempSearchState) {
      setWalletAddressToSearch(tempSearchState);
    }
    try {
      const response = await suiProvider.getOwnedObjects({
        owner: searchWalletAddress,
        options: { showContent: true, showType: true, showDisplay: true },
      });

      const suifrens = response.data
        .filter((object) => SWAP_TYPES_LIST.includes(object?.data?.type!))
        .map((suifrenNftObject) => {
          return initializeSuifren(suifrenNftObject);
        });

      setFrens(suifrens);
    } catch (e) {
      console.error(e);
    }
  }

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
            <Dialog.Panel className="relative  h-[70vh] w-full max-w-2xl transform overflow-auto rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:p-6 md:h-[65vh]">
              <Dialog.Title
                as="h3"
                className={classNames(
                  "mb-2 flex content-center items-center justify-between text-center text-base font-bold leading-6 text-black2Color",
                  font_montserrat.className,
                )}
              >
                <p className="mt-1 hidden font-light md:flex md:text-xs">
                  Selected ({batchIdTrade.length})
                </p>
                <p className="mt-1 text-sm md:text-xl">Select NFTs you want</p>

                <button onClick={() => setOpened(false)}>
                  <XMarkIcon className="flex h-7 w-7" />
                </button>
              </Dialog.Title>
              <div className="flex  w-full flex-col items-center justify-center">
                <div className={"mt-2 flex w-full flex-col items-center gap-2"}>
                  <div className={classNames("mt-2 w-full bg-white", font_montserrat.className)}>
                    <LabeledInput>
                      <div className="relative my-1 bg-white px-2">
                        <input
                          type={"text"}
                          name="wallet_address"
                          className={"input-field mr-4 w-full text-sm"}
                          placeholder="Sui Wallet"
                          onChange={(e) => setTempSearchState(e.target.value)}
                        />
                      </div>
                    </LabeledInput>
                  </div>
                  <div className={"flex w-full content-center items-center gap-1 py-2"}>
                    {walletAddressToSearch && (
                      <>
                        <p
                          className={classNames(
                            "text-sm text-black2Color",
                            font_montserrat.className,
                          )}
                        >{`Wallet Collection: ${formatSuiAddress(walletAddressToSearch)}`}</p>
                        <XMarkIcon
                          className="h-5 w-5 cursor-pointer text-black2Color"
                          onClick={() => {
                            setWalletAddressToSearch("");
                            setBatchIdTrade([]);
                            setFrens([]);
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex min-h-[32vh] flex-col">
                    {suifrens ? (
                      <div
                        className={
                          "grid grid-cols-3 gap-2 overflow-auto md:mt-4 md:grid-cols-5 md:gap-[1.25rem]"
                        }
                      >
                        {frens?.map((fren) => {
                          return (
                            <button
                              onClick={() => {
                                handleSetBatchIdForSwap(
                                  fren.id,
                                  fren.url,
                                  fren.type,
                                  setTypeSwap,
                                  batchIdTrade,
                                  setBatchIdTrade,
                                  creatorBatchIdTrade,
                                  typeSwap,
                                );
                              }}
                              key={fren.id}
                            >
                              <div
                                className={classNames(
                                  "flex max-h-[160px] min-h-[160px] cursor-pointer flex-col content-center items-center justify-center rounded-md border-2 bg-white p-2",
                                  batchIdTrade.some((item) => item.id === fren.id)
                                    ? "border-yellowColor"
                                    : "border-black2Color",
                                )}
                              >
                                <Image
                                  src={fren.url}
                                  alt="collection_img"
                                  width={90}
                                  height={130}
                                  className="mt-1"
                                />
                                <p
                                  className={classNames(
                                    "mt-1 max-h-[40px] min-h-[40px] text-xs",
                                    font_montserrat.className,
                                  )}
                                >
                                  {classNames(fren.description ? `${fren.description}` : "")}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>

                  <button
                    className={classNames(
                      "mx-auto mt-2 block w-full cursor-pointer rounded-md px-3 py-2 text-sm font-black  text-white disabled:cursor-not-allowed disabled:opacity-50",
                      font_montserrat.className,
                      batchIdTrade?.length === 0
                        ? "bg-pinkColor hover:bg-pinkColor/95"
                        : "bg-yellowColor hover:bg-[#e5a44a]",
                    )}
                    onClick={() => {
                      batchIdTrade?.length === 0
                        ? fetchRecipientWallet(tempSearchState)
                        : setOpened(false);
                    }}
                  >
                    {batchIdTrade?.length === 0 ? "Search" : "Confirm Items"}
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
