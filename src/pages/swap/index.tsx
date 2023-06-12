import { ethos, EthosConnectStatus } from "ethos-connect";
import { useEffect, useState } from "react";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { signTransactionCreateEscrow, signTransactionExchangeEscrow, suiProvider } from "services/sui";
import {
  AlertErrorMessage,
  AlertSucceed,
  HistoryP2PDialog,
  MyCollectionDialog,
  NoConnectWallet,
  RecipientCollectionDialog,
  SwapInformation,
} from "components";
import { IOffer, TradeObjectType } from "types";
import { classNames, ESCROW_HUB_ID, formatSuiAddress } from "utils";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Swap = () => {
  const { wallet, status } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);
  const [allOffers, setAllOffers] = useState<IOffer[]>([]);

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
  const [showHistory, setShowHistory] = useState(false);

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
          setAllOffers(offers);
        });
      } catch (e) {
        console.error(e);
      }
    }

    fetchHistory().then();
  }, [wallet, waitSui]);

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
    if (!wallet || !recipientAddress) return;
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionExchangeEscrow({
          escrowId: "0xe2cba66bc9dd227848b4217c4c4313515055e248df126f859dc04727119dd475",
          recipient_coin_amount: 0,
          recipient_objects: [
            "0xb5cdddf741ecde5a523157995f32fabfb02b1ca546bbc5a74d9fde0a2d116fc7",
            "0x9dadc80073fba81f92d10d79add2bd508dc462f54d6a94f6a3d5bdc252d12d5a",
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
        <button
          className="w-40 font-semibold rounded-lg border-2 h-12 border-grayColor text-blackColor bg-white hover:bg-yellowColor hover:border-yellowColor hover:text-white"
          onClick={() => setShowHistory(true)}
        >
          View History
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
        {showHistory && allOffers && (
          <HistoryP2PDialog wallet={wallet} opened={showHistory} setOpened={setShowHistory} offers={allOffers} />
        )}
      </>
    </main>
  );
};

export default Swap;
