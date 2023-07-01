import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet } from "components";
import { classNames, ESCROW_HUB_ID, formatSuiAddress, formatSuiNumber } from "utils";
import { useEffect, useState } from "react";
import { IOffer, TabType } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ImageSuiToken from "/public/img/SuiToken.png";
import Image from "next/image";

const Index = () => {
  const { status, wallet } = ethos.useWallet();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("sent");
  const [sentOffers, setSentOffers] = useState<IOffer[] | null>();
  const [receivedOffers, setReceivedOffers] = useState<IOffer[] | null>();

  const generateLink = (offer: IOffer) => {
    //@ts-ignore
    return "/swap/history/" + offer.id?.id!; // replace this with your actual link generation function
  };

  useEffect(() => {
    async function fetchHistory() {
      if (!wallet) return;
      try {
        const response = await suiProvider.getDynamicFields({
          parentId: ESCROW_HUB_ID,
        });
        Promise.all(
          response?.data?.map(async (df): Promise<IOffer> => {
            const suiObject = await suiProvider.getObject({
              id: df?.objectId!,
              options: { showContent: true },
            });
            return getObjectFields(suiObject) as IOffer;
          })
        ).then((offers) => {
          const sent = offers
            .filter((offer) => offer.creator === wallet.address)
            .sort((a) => (a.status === 1 ? 1 : -1));
          const received = offers
            .filter((offer) => offer.recipient === wallet.address)
            .sort((a) => (a.status === 1 ? 1 : -1));

          setSentOffers(sent);
          setReceivedOffers(received);
        });
      } catch (e) {
        console.error(e);
      }
    }

    fetchHistory().then();
  }, [wallet]);

  const SwitchTab = () => {
    return (
      <div className={"flex gap-4 mb-5"}>
        <button
          onClick={() => setActiveTab("sent")}
          className={classNames(
            "px-4 w-64 font-medium py-2 rounded-full",
            activeTab === "sent" ? "text-white bg-redColor" : "bg-white text-grayColor"
          )}
        >
          Sent offers
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={classNames(
            "px-4 w-64 font-medium py-2 rounded-full",
            activeTab === "received" ? "text-white bg-purpleColor" : "bg-white text-grayColor"
          )}
        >
          Awaiting offers
        </button>
      </div>
    );
  };
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <main
      className={classNames(
        "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 "
      )}
    >
      <button
        className={"flex gap-2 text-blackColor content-items items-center mt-10 md:mt-5"}
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className={"stroke-[2px] h-5 w-5"} />
        <p className={"text-sm font-medium"}>Back</p>
      </button>
      <div className={"mt-10 mb-8 text-blackColor font-extrabold text-3xl"}>
        <p>Swap History</p>
      </div>
      <SwitchTab />
      {activeTab === "sent" && sentOffers && (
        <table className={"text-grayColor border-separate border-spacing-y-2"}>
          <thead>
            <tr className={"text-grayColor font-light ml-2"}>
              <th scope="col" className="py-3.5 text-left text-sm font-semibold">
                <div className={"ml-2"}>N</div>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                Wallet
              </th>
              <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold">
                Wanted NFTs
              </th>
              <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold">
                Wanted SUI
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Link</span>
              </th>
            </tr>
          </thead>
          <tbody className={"text-black rounded-2xl mt-4"}>
            {sentOffers
              .map((offer, index) => (
                <tr key={offer.id} className={"bg-white border-lightGrayColor rounded-full border "}>
                  <td className={"px-3 py-5 text-xs md:text-sm text-gray-500"}>{index + 1}</td>
                  <td className={"whitespace-nowrap px-3 py-5 text-xs md:text-sm text-gray-500"}>
                    {formatSuiAddress(offer.recipient, 4, 4)}
                  </td>
                  <td className={"hidden md:table-cell whitespace-nowrap px-3 py-5 text-xs md:text-sm text-gray-500"}>
                    <div className={"flex gap-1 content-center items-center"}>
                      <div
                        className={
                          "h-8 w-8  flex content-center justify-center items-center rounded-lg border border-lightGrayColor p-2"
                        }
                      >
                        <p>🖼</p>️
                      </div>
                      {offer.recipient_items_ids.length === 0 ? (
                        <p className={"font-black"}>{"-"}</p>
                      ) : (
                        <p className={"font-semibold"}>+{offer.recipient_items_ids.length}</p>
                      )}
                    </div>
                  </td>
                  <td className={"hidden md:table-cell whitespace-nowrap px-3 py-5 text-xs md:text-sm text-gray-500"}>
                    <div className={"flex gap-1"}>
                      <Image src={ImageSuiToken} alt={"sui token"} className={"h-5 w-5"} />
                      {offer.recipient_coin_amount === 0 ? (
                        <p>{"-"}</p>
                      ) : (
                        <p>{formatSuiNumber(offer.recipient_coin_amount)}</p>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-xs md:text-sm text-gray-500">
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs md:text-sm font-medium",
                        offer.status === 0
                          ? "text-redColor"
                          : offer.status === 1
                          ? "text-yellowColor"
                          : "text-green-700"
                      )}
                    >
                      {offer.status === 0 ? "Canceled" : offer.status === 1 ? "Active" : "Exchanged"}
                    </span>
                  </td>
                  <td className={"whitespace-nowrap px-2 py-5 text-xs md:text-sm text-redColor"}>
                    <Link href={generateLink(offer)}>
                      <div
                        className={
                          "border-redColor hover:bg-redColor hover:text-white border rounded-lg content-center flex items-center justify-center py-2"
                        }
                      >
                        Learn more
                      </div>
                    </Link>
                  </td>
                </tr>
              ))
              .reverse()}
          </tbody>
        </table>
      )}
      {activeTab === "received" && receivedOffers && (
        <table className={"text-grayColor border-separate border-spacing-y-2"}>
          <thead>
            <tr className={"text-grayColor font-light ml-2"}>
              <th scope="col" className="py-3.5 text-left text-sm font-semibold">
                <div className={"ml-2"}>N</div>
              </th>
              <th scope="col" className="flex px-3 py-3.5 text-left text-sm font-semibold">
                Wallet
              </th>
              <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold">
                Offered NFTs
              </th>
              <th scope="col" className="hidden md:table-cell px-3 py-3.5 text-left text-sm font-semibold">
                Offered SUI
              </th>
              <th scope="col" className="flex-col px-3 py-3.5 text-left text-sm font-semibold">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Link</span>
              </th>
            </tr>
          </thead>
          <tbody className={"text-black rounded-2xl mt-4"}>
            {receivedOffers
              .map((offer, index) => (
                <tr key={offer.id} className={"bg-white border-amber-950 rounded-full border"}>
                  <td className={"px-3 py-5 text-xs md:text-sm text-gray-500"}>{index + 1}</td>
                  <td className={"whitespace-nowrap px-3 py-5 text-xs md:text-sm text-gray-500"}>
                    {formatSuiAddress(offer.creator, 4, 4)}
                  </td>
                  <td className={"px-3 py-5 hidden md:table-cell text-sm text-gray-500"}>
                    <div className={"flex gap-1 content-center items-center"}>
                      <div
                        className={
                          "h-8 w-8 flex content-center justify-center items-center rounded-lg border border-lightGrayColor p-2"
                        }
                      >
                        <p>🖼</p>️
                      </div>
                      {offer.recipient_items_ids.length === 0 ? (
                        <p className={"font-black"}>{"-"}</p>
                      ) : (
                        <p className={"font-semibold"}>+{offer.recipient_items_ids.length}</p>
                      )}
                    </div>
                  </td>
                  <td className={"px-3 py-5 hidden md:table-cell text-sm text-gray-500"}>
                    <div className={"flex gap-1"}>
                      <Image src={ImageSuiToken} alt={"sui token"} className={"h-5 w-5"} />
                      {offer.recipient_coin_amount === 0 ? (
                        <p>{"-"}</p>
                      ) : (
                        <p>{formatSuiNumber(offer.recipient_coin_amount)}</p>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 md:px-3 py-5 text-xs md:text-sm text-gray-500">
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs md:text-sm font-medium",
                        offer.status === 0
                          ? "text-redColor"
                          : offer.status === 1
                          ? "text-yellowColor"
                          : "text-green-700"
                      )}
                    >
                      {offer.status === 0 ? "Canceled" : offer.status === 1 ? "Active" : "Exchanged"}
                    </span>
                  </td>
                  <td className={"whitespace-nowrap px-2 py-5 text-xs md:text-sm text-purpleColor"}>
                    <Link href={generateLink(offer)}>
                      <div
                        className={
                          "border-purpleColor hover:bg-purpleColor hover:text-white border rounded-lg content-center flex items-center justify-center py-2"
                        }
                      >
                        Learn more
                      </div>
                    </Link>
                  </td>
                </tr>
              ))
              .reverse()}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default Index;