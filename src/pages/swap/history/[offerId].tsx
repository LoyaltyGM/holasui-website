import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { AlertErrorMessage, AlertSucceed, CopyTextButton, NoConnectWallet } from "components";
import { classNames, convertIPFSUrl, formatSuiAddress, formatSuiNumber } from "utils";
import { IOffer, TradeObjectType } from "types";
import {
  signTransactionCancelEscrow,
  signTransactionExchangeEscrow,
  suiProvider,
} from "services/sui";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { ArrowLeftIcon, LinkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ImageSuiToken from "/public/img/SuiToken.png";
import { useRouter } from "next/router";
import { SwapActionDialog } from "components/Dialog/SwapActionDialog";

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
  const [showActionDialog, setShowActionDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchOffer() {
      const offerObject = getObjectFields(
        await suiProvider.getObject({
          id: offerId,
          options: { showContent: true, showDisplay: true },
        }),
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
          const object = await suiProvider.getObject({
            id: objectId,
            options: { showContent: true, showType: true, showDisplay: true },
          });

          const tradeObject = {
            id: objectId,
            url: convertIPFSUrl((object?.data?.display?.data as any).image_url),
            type: object?.data?.type!,
          };

          tradeObjects.push(tradeObject);
        }),
      );

      setRecipientObjects(tradeObjects);
    }

    async function fetchCreatorObjects() {
      if (!offer) return;

      const tradeObjects: TradeObjectType[] = [];
      await Promise.all(
        offer.creator_items_ids?.map(async (objectId: string) => {
          const object = await suiProvider.getObject({
            id: objectId,
            options: { showContent: true, showType: true, showDisplay: true },
          });

          const tradeObject = {
            id: objectId,
            url: convertIPFSUrl((object?.data?.display?.data as any).image_url),
            type: object?.data?.type!,
          };

          tradeObjects.push(tradeObject);
        }),
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
          recipient_objects: offer.recipient_items_ids,
          type_swap: creatorObjects.length > 0 ? creatorObjects[0].type : recipientObjects[0].type,
        }),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);
      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("AcceptOffer");
        setShowActionDialog(true);
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
        transactionBlock: signTransactionCancelEscrow(
          offerId,
          creatorObjects.length > 0 ? creatorObjects[0].type : recipientObjects[0].type,
        ),
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
        setShowActionDialog(true);
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
      <div className="mb-2 w-full px-3 md:mb-0 md:w-full ">
        <div className="mb-2 flex h-[45vh] w-full cursor-pointer flex-col justify-between rounded-lg border-2 border-grayColor bg-white px-2 py-2 font-normal text-purpleColor md:h-[30vh]">
          <div
            className={
              "grid h-[27vh] grid-cols-3 gap-1 overflow-auto md:mt-4 md:h-[20vh] md:grid-cols-4 md:gap-4"
            }
          >
            {coinAmount > 0 && (
              <div className="flex h-24 w-24 items-center justify-center gap-2 rounded-md border bg-white text-center text-2xl">
                <Image
                  src={ImageSuiToken}
                  alt="token"
                  className="h-[25px] w-[26px]"
                  aria-hidden="true"
                />
                <p>{`${coinAmount}`}</p>
              </div>
            )}
            {userObjectIds?.map((object) => {
              return (
                <div
                  onClick={() =>
                    window.open(`https://suiexplorer.com/object/${object.id}`, "_blank")
                  }
                  key={object.id}
                  className={classNames(
                    "flex h-24 w-24 cursor-pointer flex-col content-center items-center justify-center rounded-md border bg-white  p-2",
                  )}
                >
                  <Image
                    src={object.url}
                    alt="collection_img"
                    width={90}
                    height={90}
                    className="mt-1"
                  />
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
        "mt-18 z-10 mt-8 flex min-h-[100vh] flex-col gap-10 rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] md:pl-16 md:pr-10 ",
      )}
    >
      <button
        className={"content-items mt-10 flex items-center gap-2 text-blackColor md:mt-5"}
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className={"h-5 w-5 stroke-[2px]"} />
        <p className={"text-sm font-medium"}>Back</p>
      </button>
      <div className={"justify-between md:flex"}>
        <div className={"gap-4 text-3xl font-extrabold text-blackColor"}>
          <a
            href={`https://suiexplorer.com/object/${offerId}`}
            target="_blank"
            className={"flex items-center gap-1"}
          >
            Offer
            <LinkIcon className={"h-6"} />
          </a>
          <div className={"flex gap-1 text-xl font-bold text-black2Color"}>
            <p>from</p>
            <CopyTextButton showText={formatSuiAddress(offer.creator)} copyText={offer?.creator} />
            <p>to</p>
            <CopyTextButton
              showText={formatSuiAddress(offer.recipient)}
              copyText={offer.recipient}
            />
          </div>
        </div>

        <div className={"mt-10 flex gap-2 text-xl"}>
          <p className={"text-blackColor"}>Status: </p>
          {offer.status == 0 ? (
            <p className={"font-semibold text-pinkColor"}>Canceled</p>
          ) : offer.status == 1 ? (
            <p className={"font-semibold text-yellowColor"}>Active</p>
          ) : (
            offer.status == 2 && <p className={"font-semibold text-green-700"}>Exchanged</p>
          )}
        </div>
      </div>

      <div className="h-full items-center justify-evenly justify-items-center gap-10 rounded-2xl md:flex md:h-[42vh]">
        <div className="w-full items-center justify-between gap-1 rounded-xl border-2 border-purpleColor bg-white py-2">
          <p className={"mb-4 mt-2 px-3 font-medium text-blackColor"}>
            {formatSuiAddress(offer.creator)} items
          </p>
          <OfferInformation
            userObjectIds={creatorObjects}
            coinAmount={formatSuiNumber(offer.creator_coin_amount)}
          />
        </div>
        <div className="w-full items-center justify-between gap-1 rounded-xl border-2 border-pinkColor bg-white py-2">
          <p className={"mb-4 mt-2 px-3 font-medium text-blackColor"}>
            {formatSuiAddress(offer.recipient)} items
          </p>
          <OfferInformation
            userObjectIds={recipientObjects}
            coinAmount={formatSuiNumber(offer.recipient_coin_amount)}
          />
        </div>
      </div>

      {offer.status == 1 && wallet?.address == offer.recipient && (
        <button
          onClick={acceptOffer}
          disabled={waitSui}
          className="mb-4 w-[200px] rounded-md border border-greenColor bg-white py-3 font-medium text-greenColor hover:bg-greenColor hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Accept
        </button>
      )}

      {offer.status == 1 && wallet?.address == offer.creator && (
        <button
          onClick={() => cancelOffer()}
          disabled={waitSui}
          className="w-[200px] rounded-md border border-redColor bg-white py-3 font-medium text-pinkColor hover:bg-redColor hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Cancel Offer
        </button>
      )}
      {showActionDialog && (
        <SwapActionDialog
          opened={showActionDialog}
          setOpened={setShowActionDialog}
          title={wallet?.address === offer.creator ? "Reject" : "Accept"}
        />
      )}
    </main>
  ) : (
    <div className={"mt-40 flex flex-col items-center justify-center"}>
      <p className={"mb-4 text-2xl font-semibold"}>Offer not found</p>
    </div>
  );
};

export default DetailSwapOffer;
