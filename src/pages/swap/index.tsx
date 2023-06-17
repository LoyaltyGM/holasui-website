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
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateEscrow({
          creator_coin_amount: creatorCoinAmount || 0,
          creator_objects: creatorObjectIds.map((obj) => obj.id),
          recipient: recipientAddress,
          recipient_coin_amount: recipientCoinAmount || 0,
          recipient_object_ids: recipientObjectIds.map((obj) => obj.id),
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
        setOfferTransactionHash(response?.events![0].parsedJson?.id)

      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  }

  const Title = () => {
    return (
      <div className="md:mt-20 mt-4 md:mb-0 mb-4 md:flex justify-between">
        <div>
          <h1 className={classNames("md:text-4xl text-2xl font-bold text-blackColor")}>Welcome to Hola P2P Swap</h1>
          <p className={classNames("md:text-lg text-sm font-medium mt-1 text-grayColor")}>
            Swap NFTs secure and without third-parties companies!
          </p>
        </div>
        <Link href={"./swap/history"}>
          <button className="w-full mt-4 md:mt-0 md:w-40 font-semibold rounded-lg border-2 h-12 border-grayColor text-blackColor bg-white hover:bg-yellowColor hover:border-yellowColor hover:text-white">
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
        "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 "
      )}
    >
      <>
        <Title />
        <div className="md:flex gap-10 justify-items-center justify-evenly items-center rounded-2xl md:h-[50vh] h-full">
          <div className="w-full bg-white rounded-xl border-purpleColor border-2 items-center gap-1 justify-between mb-4 py-2">
            <p className={"px-3 mb-4 mt-2 text-blackColor font-medium"}>Your offer</p>

            <SwapInformation
              userObjectIds={creatorObjectIds}
              setShowCollection={setShowCollection}
              setCoinAmount={setCreatorCoinAmount}
              coinAmount={creatorCoinAmount}
            />
          </div>
          <div className="w-full bg-white rounded-xl border-redColor border-2 items-center gap-1 justify-between mb-4 py-2">
            <div className={"flex justify-between content-center items-center"}>
              <p className={"px-3 mb-4 mt-2 text-blackColor font-medium"}>You want to get</p>
              <div className={"px-3 flex content-center items-center gap-1"}>
                {recipientAddress && (
                  <p className="text-sm text-grayColor">{`${formatSuiAddress(recipientAddress)}`}</p>
                )}
                {recipientAddress && (
                  <XMarkIcon
                    className={"w-5 h-5 text-grayColor cursor-pointer"}
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
          className="w-full md:w-[200px] py-3 bg-[#5AAC67] text-white font-medium mb-4 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Create Offer
        </button>

        <div className="flex gap-10 justify-center">
          <a className="text-sm underline" href={"https://twitter.com/Hola_sui"} target={"_blank"}>
            How it works?
          </a>
          <div className="flex content-center items-center gap-1 text-sm text-right md:text-center">
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
          />
        )}
        {offerCreated && offerTransactionHash && (
          <YourOfferLinkDialog transactionHash={offerTransactionHash} recipientAddress={recipientAddress!} opened={offerCreated} setOpened={setOfferCreated} />
        )}
        {showReceivedNFT && (
          <RecipientCollectionDialog
            wallet={wallet}
            opened={showReceivedNFT}
            setOpened={setShowReceivedNFT}
            batchIdTrade={recipientObjectIds}
            setBatchIdTrade={setRecipientObjectIds}
            walletAddressToSearch={recipientAddress}
            setWalletAddressToSearch={setRecipientAddress}
          />
        )}
      </>
    </main>
  );
};

export default Swap;
