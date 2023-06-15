import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { AlertErrorMessage, AlertSucceed, CopyTextButton, NoConnectWallet } from "components";
import { classNames, convertIPFSUrl, formatSuiAddress, formatSuiNumber } from "utils";
import { IOffer, TradeObjectType } from "types";
import { signTransactionCancelEscrow, signTransactionExchangeEscrow, suiProvider } from "services/sui";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { LinkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ImageSuiToken from "/public/img/SuiToken.png";

interface IDetailOfferProps {
  offerId: string;
}

export const getServerSideProps: GetServerSideProps<IDetailOfferProps> = async ({ params }) => {
  try {
    const offerId = params?.offerId as string;

    return {
      props: {
        offerId,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

const DetailSwapOffer: NextPage<IDetailOfferProps> = ({ offerId }) => {
  const [offer, setOffer] = useState<IOffer>();
  const { status, wallet } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

  const [recipientObjects, setRecipientObjects] = useState<TradeObjectType[]>([]);
  const [creatorObjects, setCreatorObjects] = useState<TradeObjectType[]>([]);

  useEffect(() => {
    async function fetchOffer() {
      const offerObject = getObjectFields(
        await suiProvider.getObject({
          id: offerId,
          options: { showContent: true },
        })
      ) as IOffer;

      setOffer(offerObject);
    }

    fetchOffer().then();
  }, []);

  useEffect(() => {
    async function fetchRecipientObjects() {
      if (!offer) return;

      const tradeObjects: TradeObjectType[] = [];

      await Promise.all(
        offer.recipient_items_ids?.map(async (objectId: string) => {
          const object = getObjectFields(
            await suiProvider.getObject({
              id: objectId,
              options: { showContent: true },
            })
          );

          const tradeObject = {
            id: objectId,
            url: convertIPFSUrl(object?.url),
          };

          tradeObjects.push(tradeObject);
        })
      );

      setRecipientObjects(tradeObjects);
    }

    async function fetchCreatorObjects() {
      if (!offer) return;

      const tradeObjects: TradeObjectType[] = [];
      await Promise.all(
        offer.creator_items_ids?.map(async (objectId: string) => {
          const object = getObjectFields(
            await suiProvider.getObject({
              id: objectId,
              options: { showContent: true },
            })
          );

          const tradeObject = {
            id: objectId,
            url: convertIPFSUrl(object?.url),
          };

          tradeObjects.push(tradeObject);
        })
      );

      setCreatorObjects(tradeObjects);
    }

    fetchRecipientObjects().then();
    fetchCreatorObjects().then();
  }, [offer]);

  async function acceptOffer() {
    if (!wallet || !offer) return;
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionExchangeEscrow({
          escrowId: offerId,
          recipient_coin_amount: formatSuiNumber(offer?.recipient_coin_amount),
          recipient_objects: getObjectFields(offer.creator_items_ids)?.contents,
        }),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);
      console.log(status);
      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("AcceptOffer");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  }

  async function cancelOffer() {
    if (!wallet || !offer) return;
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCancelEscrow(offerId),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);
      console.log(status);
      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("CancelOffer");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  }

  const OfferInformation = ({
    userObjectIds,
    coinAmount,
  }: {
    coinAmount: number;
    userObjectIds: TradeObjectType[];
  }) => {
    return (
      <div className="md:w-full w-full px-3 md:mb-0 mb-2 ">
        <div className="h-[45vh] md:h-[30vh] mb-2 flex flex-col cursor-pointer justify-between w-full py-2 px-2 font-normal border-2 rounded-lg bg-white border-lightGrayColor text-purpleColor">
          <div className={"grid md:grid-cols-4 grid-cols-3 overflow-auto gap-1 h-[27vh] md:gap-4 md:mt-4 md:h-[20vh]"}>
            {coinAmount > 0 && (
              <div className="text-2xl text-center gap-2 w-24 h-24 border bg-white flex items-center justify-center rounded-md">
                <Image src={ImageSuiToken} alt="token" className="h-[25px] w-[26px]" aria-hidden="true" />
                <p>{`${coinAmount}`}</p>
              </div>
            )}
            {userObjectIds?.map((object) => {
              return (
                <div
                  key={object.id}
                  className={classNames(
                    "border bg-white w-24 h-24 flex flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer"
                  )}
                >
                  <Image src={object.url} alt="collection_img" width={90} height={90} className="mt-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : offer ? (
    <main
      className={classNames(
        "flex flex-col gap-10 min-h-[100vh] md:min-h-[65vh] pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 "
      )}
    >
      <div className={"flex gap-4 mt-10 text-blackColor font-extrabold text-3xl"}>
        <a href={`https://suiexplorer.com/object/${offerId}`} target="_blank" className={"flex items-center"}>
          Offer
          <LinkIcon className={"h-6"} />
        </a>
        from
        <CopyTextButton showText={formatSuiAddress(offer.creator)} copyText={offer?.creator} />
        to
        <CopyTextButton showText={formatSuiAddress(offer.recipient)} copyText={offer.recipient} />
      </div>

      <div className={"flex gap-4 text-xl"}>
        <p className={"font-semibold"}>Status: </p>
        {offer.status == 0 ? (
          <p className={"text-red-500"}>Canceled</p>
        ) : offer.status == 1 ? (
          <p className={"text-green-500"}>Active</p>
        ) : (
          offer.status == 2 && <p className={"text-blue-500"}>Exchanged</p>
        )}
      </div>

      <div className="flex gap-10 justify-items-center justify-evenly items-center rounded-2xl md:h-[50vh] h-full">
        <div className="w-full bg-white rounded-xl border-purpleColor border-2 items-center gap-1 justify-between mb-4 py-2">
          <p className={"px-3 mb-4 mt-2 text-blackColor font-medium"}>{formatSuiAddress(offer.creator)} items</p>
          <OfferInformation userObjectIds={creatorObjects} coinAmount={formatSuiNumber(offer.creator_coin_amount)} />
        </div>
        <div className="w-full bg-white rounded-xl border-redColor border-2 items-center gap-1 justify-between mb-4 py-2">
          <p className={"px-3 mb-4 mt-2 text-blackColor font-medium"}>{formatSuiAddress(offer.recipient)} items</p>
          <OfferInformation
            userObjectIds={recipientObjects}
            coinAmount={formatSuiNumber(offer.recipient_coin_amount)}
          />
        </div>
      </div>

      {offer.status == 1 && wallet?.address == offer.recipient && (
        <button
          onClick={() => acceptOffer()}
          disabled={waitSui}
          className="w-[200px] py-3 bg-[#5AAC67] text-white font-medium mb-4 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Accept
        </button>
      )}

      {offer.status == 1 && wallet?.address == offer.creator && (
        <button
          onClick={() => cancelOffer()}
          disabled={waitSui}
          className="w-[200px] py-3 bg-[#5AAC67] text-white font-medium mb-4 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      )}
    </main>
  ) : (
    <div className={"flex flex-col items-center justify-center mt-40"}>
      <p className={"text-2xl font-semibold mb-4"}>Offer not found</p>
    </div>
  );
};

export default DetailSwapOffer;
