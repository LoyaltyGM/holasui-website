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
          }),
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
      <div className={"mb-5 flex gap-4"}>
        <button
          onClick={() => setActiveTab("sent")}
          className={classNames(
            "w-64 rounded-full px-4 py-2 font-medium",
            activeTab === "sent" ? "bg-pinkColor text-white" : "bg-white text-black2Color",
          )}
        >
          Sent offers
        </button>
        <button
          onClick={() => setActiveTab("received")}
          className={classNames(
            "w-64 rounded-full px-4 py-2 font-medium",
            activeTab === "received" ? "bg-purpleColor text-white" : "bg-white text-black2Color",
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
        "mt-18 z-10 mt-8 flex min-h-[100vh] flex-col rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] md:pl-16 md:pr-10 ",
      )}
    >
      <button
        className={"content-items mt-10 flex items-center gap-2 text-blackColor md:mt-5"}
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className={"h-5 w-5 stroke-[2px]"} />
        <p className={"text-sm font-medium"}>Back</p>
      </button>
      <div className={"mb-8 mt-10 text-3xl font-extrabold text-blackColor"}>
        <p>Swap History</p>
      </div>
      <SwitchTab />
      {activeTab === "sent" && sentOffers && (
        <table className={"border-separate border-spacing-y-2 text-black2Color"}>
          <thead>
            <tr className={"ml-2 font-light text-black2Color"}>
              <th scope="col" className="py-3.5 text-left text-sm font-semibold">
                <div className={"ml-2"}>N</div>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                Wallet
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
              >
                Wanted NFTs
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
              >
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
          <tbody className={"mt-4 rounded-2xl text-black"}>
            {sentOffers
              .map((offer, index) => (
                <tr key={offer.id} className={"rounded-full border border-grayColor bg-white "}>
                  <td className={"px-3 py-5 text-xs text-gray-500 md:text-sm"}>{index + 1}</td>
                  <td className={"whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:text-sm"}>
                    {formatSuiAddress(offer.recipient, 4, 4)}
                  </td>
                  <td
                    className={
                      "hidden whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:table-cell md:text-sm"
                    }
                  >
                    <div className={"flex content-center items-center gap-1"}>
                      <div
                        className={
                          "flex h-8  w-8 content-center items-center justify-center rounded-lg border border-grayColor p-2"
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
                  <td
                    className={
                      "hidden whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:table-cell md:text-sm"
                    }
                  >
                    <div className={"flex gap-1"}>
                      <Image src={ImageSuiToken} alt={"sui token"} className={"h-5 w-5"} />
                      {offer.recipient_coin_amount === 0 ? (
                        <p>{"-"}</p>
                      ) : (
                        <p>{formatSuiNumber(offer.recipient_coin_amount)}</p>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:text-sm">
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium md:text-sm",
                        offer.status === 0
                          ? "text-pinkColor"
                          : offer.status === 1
                          ? "text-yellowColor"
                          : "text-green-700",
                      )}
                    >
                      {offer.status === 0
                        ? "Canceled"
                        : offer.status === 1
                        ? "Active"
                        : "Exchanged"}
                    </span>
                  </td>
                  <td className={"whitespace-nowrap px-2 py-5 text-xs text-pinkColor md:text-sm"}>
                    <Link href={generateLink(offer)}>
                      <div
                        className={
                          "flex content-center items-center justify-center rounded-lg border border-pinkColor py-2 hover:bg-pinkColor hover:text-white"
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
        <table className={"border-separate border-spacing-y-2 text-black2Color"}>
          <thead>
            <tr className={"ml-2 font-light text-black2Color"}>
              <th scope="col" className="py-3.5 text-left text-sm font-semibold">
                <div className={"ml-2"}>N</div>
              </th>
              <th scope="col" className="flex px-3 py-3.5 text-left text-sm font-semibold">
                Wallet
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
              >
                Offered NFTs
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
              >
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
          <tbody className={"mt-4 rounded-2xl text-black"}>
            {receivedOffers
              .map((offer, index) => (
                <tr key={offer.id} className={"rounded-full border border-amber-950 bg-white"}>
                  <td className={"px-3 py-5 text-xs text-gray-500 md:text-sm"}>{index + 1}</td>
                  <td className={"whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:text-sm"}>
                    {formatSuiAddress(offer.creator, 4, 4)}
                  </td>
                  <td className={"hidden px-3 py-5 text-sm text-gray-500 md:table-cell"}>
                    <div className={"flex content-center items-center gap-1"}>
                      <div
                        className={
                          "flex h-8 w-8 content-center items-center justify-center rounded-lg border border-grayColor p-2"
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
                  <td className={"hidden px-3 py-5 text-sm text-gray-500 md:table-cell"}>
                    <div className={"flex gap-1"}>
                      <Image src={ImageSuiToken} alt={"sui token"} className={"h-5 w-5"} />
                      {offer.recipient_coin_amount === 0 ? (
                        <p>{"-"}</p>
                      ) : (
                        <p>{formatSuiNumber(offer.recipient_coin_amount)}</p>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-5 text-xs text-gray-500 md:px-3 md:text-sm">
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium md:text-sm",
                        offer.status === 0
                          ? "text-pinkColor"
                          : offer.status === 1
                          ? "text-yellowColor"
                          : "text-green-700",
                      )}
                    >
                      {offer.status === 0
                        ? "Canceled"
                        : offer.status === 1
                        ? "Active"
                        : "Exchanged"}
                    </span>
                  </td>
                  <td className={"whitespace-nowrap px-2 py-5 text-xs text-purpleColor md:text-sm"}>
                    <Link href={generateLink(offer)}>
                      <div
                        className={
                          "flex content-center items-center justify-center rounded-lg border border-purpleColor py-2 hover:bg-purpleColor hover:text-white"
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
