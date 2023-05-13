import { ethos, EthosConnectStatus } from "ethos-connect";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { ChevronDownIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import suietIcon from "/public/img/SuietLogo2.svg";
import { classNames } from "utils";
import { useState } from "react";
import { LabeledInput } from "components/Forms/Inputs";
import token from "/public/img/points.png";
import MyCollectionScreen from "components/Dialog";

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
  const [batchIdTradeRecieve, setBatchIdTradeRecieve] = useState<BatchIdTradeType[]>([]);

  // dialog wallets
  const [showRules, setShowRules] = useState(false);
  const [showRecivedNFT, setShowRecivedNFT] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  console.log(suiValueWalletOne !== null);
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
          <Image src={suietIcon} alt={"suiet"} height={350} width={50} className="h-28" priority />
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
        "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 mt-14 md:pr-10 z-10 rounded-lg ",
        font_montserrat.className,
        "mt-8"
      )}
    >
      <>
        <div className="mt-24 flex justify-between">
          <div>
            <h1 className={classNames("text-4xl font-bold")}>Welcome to Hola P2P Swap</h1>
            <p className={classNames("text-lg font-medium mt-1")}>
              Swap NFTs secure and without third-parties companies!
            </p>
          </div>
          <button className="w-32 font-bold rounded-lg border-2 border-yellowColor text-yellowColor hover:bg-yellowColor hover:text-white py-4">
            View History
          </button>
        </div>
        <div className="flex flex-col justify-items-center justify-evenly bg-white items-center mt-8 mb-4  rounded-2xl h-[55vh] px-8 py-8">
          <p className="text-2xl font-bold mb-4">New P2P Swap</p>
          <div className="w-full items-center gap-4 md:flex justify-between mb-2">
            <div className="md:w-1/2 w-full px-3">
              {/* Your NFT Collection */}
              <div
                className="h-[30vh] mb-2 flex flex-col justify-between w-full py-4 px-2 font-normal border-2 rounded-lg bg-purpleColor/20 border-purpleColor text-purpleColor "
                onClick={() => setShowCollection(true)}
              >
                <button className="bg-purpleColor content-center items-center rounded-md font-bold text-white w-full flex justify-between px-3 py-2">
                  <p>Your Collection</p>
                  <ChevronDownIcon className="h-5 w-5 " />
                </button>
                <div className={"grid md:grid-cols-5 grid-cols-3 gap-2 md:gap-4 md:mt-4 h-[10vh]"}>
                  {batchIdTrade?.map((fren) => {
                    return (
                      <div
                        className={classNames(
                          "border flex flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer",
                          "border-darkColor"
                        )}
                      >
                        <Image src={fren.url} alt="collection_img" width={90} height={130} className="mt-1" />
                      </div>
                    );
                  })}
                  {suiValueWalletOne !== 0 && suiValueWalletOne !== null ? (
                    <p className="text-2xl">{`+${suiValueWalletOne} SUI`}</p>
                  ) : (
                    <></>
                  )}
                </div>

                <p className="mt-2">Your offer</p>
              </div>
              {/* Your Sui Value */}
              <LabeledInput label={""}>
                <div className="relative ">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Image src={token} alt="token" className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    type={"text"}
                    name="discord_url"
                    className={"input-field w-full pl-10 bg-white"}
                    placeholder="Sui Amount"
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
                className="h-[30vh] mb-2 flex flex-col justify-between w-full py-4 px-2 font-normal border-2 rounded-lg bg-yellowColor/20 border-yellowColor text-yellowColor "
                onClick={() => setShowRecivedNFT(true)}
              >
                <button className="bg-yellowColor content-center items-center rounded-md font-bold text-white w-full flex justify-between px-3 py-2">
                  <p>You Recieve</p>
                  <ChevronDownIcon className="h-5 w-5 " />
                </button>
                <div className={"grid md:grid-cols-5 grid-cols-3 gap-2 md:gap-4 md:mt-4 h-[10vh]"}>
                  {batchIdTradeRecieve?.map((fren) => {
                    return (
                      <div
                        className={classNames(
                          "border flex flex-col content-center justify-center items-center p-2 rounded-md  cursor-pointer",
                          "border-darkColor"
                        )}
                      >
                        <Image src={fren.url} alt="collection_img" width={90} height={130} className="mt-1" />
                      </div>
                    );
                  })}
                  {suiValueWalletTwo !== 0 && suiValueWalletTwo !== null ? (
                    <p className="text-2xl">{`+${suiValueWalletTwo} SUI`}</p>
                  ) : (
                    <></>
                  )}
                </div>

                <p className="mt-2">You want</p>
              </div>
              {/* Your Sui Value */}
              <LabeledInput label={""}>
                <div className="relative ">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Image src={token} alt="token" className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    type={"text"}
                    name="discord_url"
                    className={"input-field w-full pl-10 bg-white"}
                    placeholder="Sui Amount"
                    pattern={"(https://)?(www.)?(((discord(app)?)?.com/invite)|((discord(app)?)?.gg))/(?<invite>.+)"}
                    onChange={(e) => setSuiValueWalletTwo(Number(e.target.value))}
                  />
                </div>
              </LabeledInput>
            </div>
          </div>
          <button className="w-full py-3 bg-redColor text-white font-medium mt-2 rounded-md">SWAP</button>
        </div>

        <div className="flex gap-10 justify-center">
          <p className="text-sm">Verified Collection</p>
          <p className="text-sm">Rules</p>
          <p className="text-sm">Fees Swap 0.4 sui</p>
        </div>
        {showCollection && (
          <MyCollectionScreen
            wallet={wallet}
            opened={showCollection}
            setOpened={setShowCollection}
            batchIdTrade={batchIdTrade}
            setBatchIdTrade={setBatchIdTrade}
          />
        )}
        {showRecivedNFT && (
          <MyCollectionScreen
            wallet={wallet}
            opened={showRecivedNFT}
            setOpened={setShowRecivedNFT}
            batchIdTrade={batchIdTradeRecieve}
            setBatchIdTrade={setBatchIdTradeRecieve}
          />
        )}
      </>
    </main>
  );
};

export default Swap;
