import { ethos, EthosConnectStatus } from "ethos-connect";
import { useState } from "react";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { signTransactionCreateEscrow, signTransactionExchangeEscrow } from "services/sui";
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

const Swap = () => {
  const { wallet, status } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

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
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("CreateOffer");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  }

  async function acceptOffer() {
    if (!wallet) return;
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionExchangeEscrow({
          escrowId: "0x0cf0831bb6a1ed1690bdf2f2e224137575baf5c4a7b1f13661ec094bf3c8fff7",
          recipient_coin_amount: 0.2,
          recipient_objects: [
            "0x8cb0f6f396d1354396047c3d053dff65c8f3bbf78a2ef44b54f174b542f91353",
            "0x390da08119de7f874b2478655e9d40ef5d0c77bde1da70eba3ed5c4ca70ecd76",
          ],
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
        AlertSucceed("CreateOffer");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  }

  const Title = () => {
    return (
      <div className="md:mt-20 mt-4 md:mb-0 mb-4 flex justify-between">
        <div>
          <h1 className={classNames("md:text-4xl text-2xl font-bold text-blackColor")}>Welcome to Hola P2P Swap</h1>
          <p className={classNames("md:text-lg text-sm font-medium mt-1 text-grayColor")}>
            Swap NFTs secure and without third-parties companies!
          </p>
        </div>
        <Link href={"./swap/history"}>
          <button className="w-40 font-semibold rounded-lg border-2 h-12 border-grayColor text-blackColor bg-white hover:bg-yellowColor hover:border-yellowColor hover:text-white">
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
        <div className="flex gap-10 justify-items-center justify-evenly items-center rounded-2xl md:h-[50vh] h-full">
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
          className="w-[200px] py-3 bg-[#5AAC67] text-white font-medium mb-4 rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Create Offer
        </button>

        {/*<button onClick={acceptOffer}>accept</button>*/}
        <div className="flex gap-10 justify-center">
          <p className="text-sm underline">Verified Collection</p>
          <p className="text-sm text-right md:text-center">Fees Swap 0.4 sui</p>
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
