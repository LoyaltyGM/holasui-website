import { ethos, EthosConnectStatus } from "ethos-connect";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { classNames, ESCROW_HUB_ID, formatSuiAddress } from "utils";
import { useEffect, useState } from "react";
import { LabeledInput } from "components/Forms/Inputs";
import { MyCollectionDialog } from "components/Dialog/MyCollectionDialog";
import { RecieveNFTDialog } from "components/Dialog/RecieveNFTDialog";
import ImageSuietIcon from "/public/img/SuietLogo2.svg";
import ImageSuiToken from "/public/img/SuiToken.png";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { AlertErrorMessage, AlertSucceed } from "components/Alert/CustomToast";
import { signTransactionAcceptOffer, signTransactionCreateOffer } from "services/sui/transactions/p2p";
import { IOffer } from "../../types";
import { suiProvider } from "../../services/sui";

const font_montserrat = Montserrat({ subsets: ["latin"] });

type TradeObjectType = {
  id: string;
  url: string;
};

const Swap = () => {
  const { wallet, status } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);
  const [allOffers, setAllOffers] = useState<IOffer[]>([]);
  // const [activateSwap, setActivateSwap] = useState(false);
  // const [activateHistory, setActivateHistory] = useState(false);

  // creator
  const [creatorObjectIds, setCreatorObjectIds] = useState<TradeObjectType[]>([]);
  const [creatorCoinAmount, setCreatorCoinAmount] = useState<number | null>(null);
  // recipient
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [recipientCoinAmount, setRecipientCoinAmount] = useState<number | null>(null);
  const [recipientObjectIds, setRecipientObjectIds] = useState<TradeObjectType[]>([]);

  // dialog wallets
  const [showRecivedNFT, setShowRecivedNFT] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      if (!wallet) return;
      try {
        const response = await suiProvider.getDynamicFields({
          parentId: ESCROW_HUB_ID,
        });
        Promise.all(
          response?.data?.map(async (df): Promise<IOffer> => {
            const suiObject = await suiProvider.getObject({ id: df?.objectId!, options: { showContent: true } });

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
    console.log("createOffer");
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateOffer({
          creator_coin_amount: creatorCoinAmount || 0,
          creator_object_ids: creatorObjectIds.map((obj) => obj.id),
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
    console.log("createOffer");
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionAcceptOffer({
          offerId: "0xe2cba66bc9dd227848b4217c4c4313515055e248df126f859dc04727119dd475",
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

  return status === EthosConnectStatus.NoConnection ? (
    <main className="flex min-h-[85vh] flex-col items-center justify-around md:mt-20 z-10 rounded-lg bg-bgMain">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div
          className={classNames(
            "flex flex-col md:flex-row md:gap-2 gap-1 justify-center items-center content-center text-4xl text-center w-full pt-12 font-bold text-[#5A5A95] ",
            font_montserrat.className
          )}
        >
          <p>Connect</p>
          <Image src={ImageSuietIcon} alt={"suiet"} height={350} width={50} className="h-28" priority />
          <p>Suiet Wallet To Unlock P2P Swap!</p>
        </div>
        <div className="mt-4">
          <ethos.components.AddressWidget />
        </div>
      </div>
    </main>
  ) : (
    <main
      className={classNames(
        "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg ",
        font_montserrat.className,
        "mt-8"
      )}
    >
      <>
        <div className="md:mt-20 mt-4 md:mb-0 mb-4 flex justify-between">
          <div>
            <h1 className={classNames("md:text-4xl text-2xl font-bold")}>Welcome to Hola P2P Swap</h1>
            <p className={classNames("md:text-lg text-sm font-medium mt-1")}>
              Swap NFTs secure and without third-parties companies!
            </p>
          </div>
          <button className="w-32 font-bold rounded-lg border-2 border-yellowColor text-yellowColor hover:bg-yellowColor hover:text-white py-4">
            View History
          </button>
        </div>
        <div className="flex flex-col justify-items-center justify-evenly bg-white items-center md:mt-8 mt-4 mb-4 rounded-2xl md:h-[55vh] h-full pb-8 pt-8 px-2 md:px-8 md:py-8 ">
          {/* <p className="text-2xl font-bold mb-4 hidden md:flex">New P2P Swap</p> */}
          <div className="w-full items-center gap-1 md:flex justify-between mb-2">
            <div className="md:w-1/2 w-full px-3 md:mb-0 mb-2">
              {/* Your NFT Collection */}
              <div
                className="h-[45vh] md:h-[30vh] mb-2 flex flex-col justify-between w-full py-4 px-2 font-normal border-2 rounded-lg bg-purpleColor/20 border-purpleColor text-purpleColor"
                onClick={() => setShowCollection(true)}
              >
                <button className="bg-purpleColor content-center items-center rounded-md font-bold text-white w-full flex justify-between px-3 py-2">
                  <p>Your Collection</p>
                  <ChevronDownIcon className="h-5 w-5 " />
                </button>
                <div
                  className={
                    "grid md:grid-cols-4 grid-cols-3 overflow-auto gap-1 h-[27vh] md:gap-4 md:mt-4 md:h-[20vh]"
                  }
                >
                  {creatorObjectIds?.map((fren) => {
                    return (
                      <div
                        key={fren.id}
                        className={classNames(
                          "border bg-white flex flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer",
                          ""
                        )}
                      >
                        <Image src={fren.url} alt="collection_img" width={90} height={130} className="mt-1" />
                      </div>
                    );
                  })}
                  {creatorCoinAmount !== 0 && creatorCoinAmount !== null ? (
                    <p className="text-2xl text-center border bg-white flex items-center justify-center rounded-md">{`+${creatorCoinAmount} SUI`}</p>
                  ) : (
                    <></>
                  )}
                </div>

                <p className="mt-2">Your offer</p>
              </div>
              {/* Your Sui Value */}
              <LabeledInput label={""}>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Image src={ImageSuiToken} alt="token" className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    type={"text"}
                    name="discord_url"
                    className={"input-field w-full pl-10 bg-white"}
                    placeholder="Sui Amount Send"
                    pattern={"(https://)?(www.)?(((discord(app)?)?.com/invite)|((discord(app)?)?.gg))/(?<invite>.+)"}
                    onChange={(e) => setCreatorCoinAmount(Number(e.target.value))}
                  />
                </div>
              </LabeledInput>
            </div>

            {/* //Counterparty wallet address */}
            <div className="md:w-1/2 w-full px-3">
              {/* Your NFT Collection */}
              <div
                className="h-[45vh] md:h-[30vh] mb-2 flex flex-col justify-between w-full py-4 px-2 font-normal border-2 rounded-lg bg-yellowColor/20 border-yellowColor text-yellowColor "
                onClick={() => setShowRecivedNFT(true)}
              >
                <button className="bg-yellowColor content-center items-center rounded-md font-bold text-white w-full flex justify-between px-3 py-2">
                  <p>You Recieve</p>
                  <ChevronDownIcon className="h-5 w-5 " />
                </button>
                <div>
                  <div
                    className={
                      "grid md:grid-cols-4 grid-cols-3 overflow-auto gap-1 h-[27vh] md:gap-2 md:mt-2 md:h-[14vh]"
                    }
                  >
                    {recipientObjectIds?.map((fren) => {
                      return (
                        <div
                          key={fren.id}
                          className={classNames(
                            "border flex flex-col bg-white md:mt-0 mt-2 content-center justify-center items-center p-2 rounded-md cursor-pointer"
                          )}
                        >
                          <Image src={fren.url} alt="collection_img" width={90} height={130} className="mt-1" />
                        </div>
                      );
                    })}
                    {recipientCoinAmount !== 0 && recipientCoinAmount !== null ? (
                      <div className="text-2xl text-center border bg-white  flex items-center justify-center rounded-md">{`+${recipientCoinAmount} SUI`}</div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="md:flex justify-between">
                  <p className="mt-2">You want</p>
                  {recipientAddress ? (
                    <p className="md:mt-2 mt-0">{`From Wallet: ${formatSuiAddress(recipientAddress)}`}</p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              {/* Your Sui Value */}
              <LabeledInput label={""}>
                <div className="relative ">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Image src={ImageSuiToken} alt="token" className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    type={"text"}
                    name="discord_url"
                    className={"input-field w-full pl-10 bg-white"}
                    placeholder="Sui Amount Recieve"
                    // pattern={"(https://)?(www.)?(((discord(app)?)?.com/invite)|((discord(app)?)?.gg))/(?<invite>.+)"}
                    onChange={(e) => setRecipientCoinAmount(Number(e.target.value))}
                  />
                </div>
              </LabeledInput>
            </div>
          </div>
          <button
            onClick={createOffer}
            disabled={waitSui}
            className="w-full py-3 bg-redColor text-white font-medium mt-2 rounded-md disabled:opacity-50"
          >
            Create Offer
          </button>
          <button
            onClick={acceptOffer}
            disabled={waitSui}
            className="w-full py-3 bg-yellowColor  text-white font-medium mt-2 rounded-md disabled:opacity-50"
          >
            Accept Offer
          </button>
        </div>

        <div className="flex gap-10 justify-center">
          <p className="text-sm underline">Verified Collection</p>
          {/* <p className="text-sm">Rules</p> */}
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
        {showRecivedNFT && (
          <RecieveNFTDialog
            wallet={wallet}
            opened={showRecivedNFT}
            setOpened={setShowRecivedNFT}
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
