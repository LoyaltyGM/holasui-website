import { ethos, EthosConnectStatus } from "ethos-connect";
import { useEffect, useState } from "react";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { signTransactionCreateEscrow } from "services/sui";
import {
  AlertErrorMessage,
  AlertSucceed,
  MyCollectionDialog,
  NoConnectWallet,
  RecipientCollectionDialog,
  SwapInformation,
} from "components";
import { TradeObjectType } from "types";
import { classNames, formatSuiAddress } from "utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import ImageSuiToken from "/public/img/SuiToken.png";
import { YourOfferLinkDialog } from "../../components/Dialog/YourOfferLinkDialog";

const Swap = () => {
  const { wallet, status } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

  const [swapType, setSwapType] = useState("");
  // offer dialog
  const [offerCreated, setOfferCreated] = useState(false);
  const [offerTransactionHash, setOfferTransactionHash] = useState<string>();

  // creator
  const [creatorObjectIds, setCreatorObjectIds] = useState<TradeObjectType[]>([]);
  const [creatorCoinAmount, setCreatorCoinAmount] = useState<number | null>(null);

  // recipient
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [recipientCoinAmount, setRecipientCoinAmount] = useState<number | null>(null);
  const [recipientObjectIds, setRecipientObjectIds] = useState<TradeObjectType[]>([]);

  // dialog wallets
  const [showReceivedNFT, setShowReceivedNFT] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  useEffect(() => {}, []);

  async function createOffer() {
    if (!wallet || !recipientAddress) return;
    console.log(swapType);
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateEscrow({
          creator_coin_amount: creatorCoinAmount || 0,
          creator_objects: creatorObjectIds.map((obj) => obj.id),
          recipient: recipientAddress,
          recipient_coin_amount: recipientCoinAmount || 0,
          recipient_object_ids: recipientObjectIds.map((obj) => obj.id),
          type_swap: swapType,
        }),
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("CreateOffer");
        setOfferCreated(true);
        setOfferTransactionHash(response?.events![0].parsedJson?.id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  }
  const Title = () => {
    return (
      <div className="mb-4 mt-4 justify-between md:mb-0 md:mt-20 md:flex">
        <div>
          <h1 className={classNames("text-2xl font-bold text-blackColor md:text-4xl")}>
            Welcome to Hola P2P Swap
          </h1>
          <p className={classNames("mt-1 text-sm font-medium text-black2Color md:text-lg")}>
            Swap NFTs secure and without third-parties companies!
          </p>
        </div>
        <Link href={"./swap/history"}>
          <button className="mt-4 h-12 w-full rounded-lg border-2 border-black2Color bg-white font-semibold text-blackColor hover:border-yellowColor hover:bg-yellowColor hover:text-white md:mt-0 md:w-40">
            View History
          </button>
        </Link>
      </div>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <main
      className={classNames(
        "mt-18 z-10 mt-14 flex min-h-[100vh] flex-col rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] md:pl-16 md:pr-10 ",
      )}
    >
      <>
        <Title />
        <div className="h-full items-center justify-evenly justify-items-center gap-10 rounded-2xl md:flex md:h-[50vh]">
          <div className="mb-4 w-full items-center justify-between gap-1 rounded-xl border-2 border-purpleColor bg-white py-2">
            <p className={"mb-4 mt-2 px-3 font-medium text-blackColor"}>Your offer</p>

            <SwapInformation
              userObjectIds={creatorObjectIds}
              setShowCollection={setShowCollection}
              setCoinAmount={setCreatorCoinAmount}
              coinAmount={creatorCoinAmount}
            />
          </div>
          <div className="mb-4 w-full items-center justify-between gap-1 rounded-xl border-2 border-pinkColor bg-white py-2">
            <div className={"flex content-center items-center justify-between"}>
              <p className={"mb-4 mt-2 px-3 font-medium text-blackColor"}>You want to get</p>
              <div className={"flex content-center items-center gap-1 px-3"}>
                {recipientAddress && (
                  <p className="text-sm text-black2Color">{`${formatSuiAddress(
                    recipientAddress,
                  )}`}</p>
                )}
                {recipientAddress && (
                  <XMarkIcon
                    className={"h-5 w-5 cursor-pointer text-black2Color"}
                    onClick={() => {
                      setRecipientAddress("");
                      setRecipientObjectIds([]);
                      setRecipientCoinAmount(null);
                    }}
                  />
                )}
              </div>
            </div>
            {/* //Counterparty wallet address */}
            <SwapInformation
              userObjectIds={recipientObjectIds}
              setShowCollection={setShowReceivedNFT}
              setCoinAmount={setRecipientCoinAmount}
              coinAmount={recipientCoinAmount}
              recipientAddress={recipientAddress}
              isRecipient={true}
            />
          </div>
        </div>
        <button
          onClick={createOffer}
          disabled={
            waitSui ||
            (!creatorObjectIds.length && !creatorCoinAmount) ||
            (!recipientObjectIds.length && !recipientCoinAmount)
          }
          className="mb-4 w-full rounded-md bg-greenColor py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 md:w-[200px]"
        >
          Create Offer
        </button>

        <div className="flex justify-center gap-10">
          <a className="text-sm underline" href={"https://twitter.com/Hola_sui"} target={"_blank"}>
            How it works?
          </a>
          <div className="flex content-center items-center gap-1 text-right text-sm md:text-center">
            <p>Fee Swap 0.1</p>
            <Image src={ImageSuiToken} alt={"sui token"} className={"h-4 w-4"} />
          </div>
        </div>
        {showCollection && (
          <MyCollectionDialog
            wallet={wallet}
            opened={showCollection}
            setOpened={setShowCollection}
            batchIdTrade={creatorObjectIds}
            setBatchIdTrade={setCreatorObjectIds}
            setTypeSwap={setSwapType}
            typeSwap={swapType}
          />
        )}
        {showReceivedNFT && (
          <RecipientCollectionDialog
            creatorBatchIdTrade={creatorObjectIds}
            wallet={wallet}
            opened={showReceivedNFT}
            setOpened={setShowReceivedNFT}
            batchIdTrade={recipientObjectIds}
            setBatchIdTrade={setRecipientObjectIds}
            walletAddressToSearch={recipientAddress}
            setWalletAddressToSearch={setRecipientAddress}
            setTypeSwap={setSwapType}
            typeSwap={swapType}
          />
        )}
        {offerCreated && offerTransactionHash && (
          <YourOfferLinkDialog
            transactionHash={offerTransactionHash}
            recipientAddress={recipientAddress!}
            opened={offerCreated}
            setOpened={setOfferCreated}
          />
        )}
      </>
    </main>
  );
};

export default Swap;
