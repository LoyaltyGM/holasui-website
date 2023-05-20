import { ethos, EthosConnectStatus } from "ethos-connect";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { ChevronDownIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import { classNames, formatSuiAddress } from "utils";
import { useState } from "react";
import { LabeledInput } from "components/Forms/Inputs";
import { MyCollectionDialog } from "components/Dialog/MyCollectionDialog";
import { RecieveNFTDialog } from "components/Dialog/RecieveNFTDialog";

import ImageToken from "/public/img/points.png";
import ImageSuietIcon from "/public/img/SuietLogo.svg";
import ImageSuiToken from "/public/img/SuiToken.png";

const font_montserrat = Montserrat({ subsets: ["latin"] });

const Swap = () => {
  const { wallet, status } = ethos.useWallet();
  const [activateSwap, setActivateSwap] = useState(false);
  const [activateHistory, setActivateHistory] = useState(false);
  const [suiValueWalletOne, setSuiValueWalletOne] = useState<Number | null>(null);
  const [suiValueWalletTwo, setSuiValueWalletTwo] = useState<Number | null>(null);

  type BatchIdTradeType = {
    id: string;
    url: string;
  };

  const [batchIdTrade, setBatchIdTrade] = useState<BatchIdTradeType[]>([]);

  const [walletAddressToSearch, setWalletAddressToSearch] = useState<string>();
  const [batchIdTradeRecieve, setBatchIdTradeRecieve] = useState<BatchIdTradeType[]>([]);

  // dialog wallets
  const [showRules, setShowRules] = useState(false);
  const [showRecivedNFT, setShowRecivedNFT] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

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
                  {batchIdTrade?.map((fren) => {
                    return (
                      <div
                        className={classNames(
                          "border bg-white flex flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer",
                          ""
                        )}
                      >
                        <Image src={fren.url} alt="collection_img" width={90} height={130} className="mt-1" />
                      </div>
                    );
                  })}
                  {suiValueWalletOne !== 0 && suiValueWalletOne !== null ? (
                    <p className="text-2xl text-center border bg-white flex items-center justify-center rounded-md">{`+${suiValueWalletOne} SUI`}</p>
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
                    onChange={(e) => setSuiValueWalletOne(Number(e.target.value))}
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
                    {batchIdTradeRecieve?.map((fren) => {
                      return (
                        <div
                          className={classNames(
                            "border flex flex-col bg-white md:mt-0 mt-2 content-center justify-center items-center p-2 rounded-md cursor-pointer"
                          )}
                        >
                          <Image src={fren.url} alt="collection_img" width={90} height={130} className="mt-1" />
                        </div>
                      );
                    })}
                    {suiValueWalletTwo !== 0 && suiValueWalletTwo !== null ? (
                      <div className="text-2xl text-center border bg-white  flex items-center justify-center rounded-md">{`+${suiValueWalletTwo} SUI`}</div>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div className="md:flex justify-between">
                  <p className="mt-2">You want</p>
                  {walletAddressToSearch ? (
                    <p className="md:mt-2 mt-0">{`From Wallet: ${formatSuiAddress(walletAddressToSearch)}`}</p>
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
                    onChange={(e) => setSuiValueWalletTwo(Number(e.target.value))}
                  />
                </div>
              </LabeledInput>
            </div>
          </div>
          <button className="w-full py-3 bg-redColor text-white font-medium mt-2 rounded-md">SWAP</button>
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
            batchIdTrade={batchIdTrade}
            setBatchIdTrade={setBatchIdTrade}
          />
        )}
        {showRecivedNFT && (
          <RecieveNFTDialog
            wallet={wallet}
            opened={showRecivedNFT}
            setOpened={setShowRecivedNFT}
            batchIdTrade={batchIdTradeRecieve}
            setBatchIdTrade={setBatchIdTradeRecieve}
            walletAddressToSearch={walletAddressToSearch}
            setWalletAddressToSearch={setWalletAddressToSearch}
          />
        )}
      </>
    </main>
  );
};

export default Swap;
