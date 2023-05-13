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

  // dialog wallets
  const [showRules, setShowRules] = useState(false);
  const [showApprovedNFT, setShowApprovedNFT] = useState(false);
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
        "flex min-h-[100vh] md:min-h-[85vh] flex-col pl-2 pr-2 md:pl-16 py-6 mt-20 md:pr-10 z-10 rounded-lg ",
        font_montserrat.className,
        activateSwap ? "mt-6" : "mt-20"
      )}
    >
      {activateSwap ? (
        <>
          <button
            className="flex items-center justify-start w-18 content-start font-normal mt-10"
            onClick={() => setActivateSwap(false)}
          >
            <ArrowLeftIcon className="h-5 w-5 text-darkColor" />
            <p className="text-base">Back</p>
          </button>
          <div className=" flex flex-col justify-items-center justify-between items-center  rounded-2xl h-[80vh] px-12 py-8">
            <p className="text-2xl font-bold mb-4">New Swap</p>
            <div className="w-full items-center gap-4 md:flex justify-between mb-2">
              <div className="md:w-1/2 w-full px-3">
                {/* Your NFT Collection */}
                <div
                  className="h-[45vh] mb-2 flex flex-col justify-between w-full py-4 px-2 font-normal border-2 rounded-lg bg-purpleColor/20 border-purpleColor text-purpleColor "
                  onClick={() => setShowCollection(true)}
                >
                  <button className="bg-purpleColor content-center items-center rounded-md font-bold text-white w-full flex justify-between px-3 py-2">
                    <p>Your Collection</p>
                    <ChevronDownIcon className="h-5 w-5 " />
                  </button>
                  <div className="h-[10vh] bg-purpleColor/20 rounded-lg border-purpleColor border-2 text-xl text-purpleColor px-2 py-1 mt-2">
                    Your Offer
                    <div className={"grid md:grid-cols-5 grid-cols-3 gap-2 md:gap-4 md:mt-4"}>
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
                      {suiValueWalletOne !== 0 ? <p className="text-2xl">{`+${suiValueWalletOne} SUI`}</p> : <></>}
                    </div>
                  </div>
                  <p className="mt-2">Create new swap</p>
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
                      className={"input-field w-full pl-10 bg-bgMain"}
                      placeholder="Sui Amount"
                      pattern={"(https://)?(www.)?(((discord(app)?)?.com/invite)|((discord(app)?)?.gg))/(?<invite>.+)"}
                      onChange={(e) => setSuiValueWalletOne(Number(e.target.value))}
                    />
                  </div>
                </LabeledInput>

                {/* Your Offer */}
              </div>

              {/* //Counterparty wallet address */}
              <div className="md:w-1/2 w-full px-3">
                {/* Your NFT Collection */}
                <div
                  className="h-[45vh] mb-2 flex-col justify-between w-full py-4 px-2 font-normal border-2 rounded-lg bg-yellowColor/30 border-yellowColor text-yellowColor "
                  onClick={() => setActivateSwap(true)}
                >
                  <button className="bg-yellowColor rounded-md font-bold text-white w-full py-2">
                    Your Collection
                  </button>
                  <p className="mt-2">Create new swap</p>
                </div>
                {/* Your Sui Value */}
                <LabeledInput label={""}>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Image src={token} alt="token" className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <input
                      type={"text"}
                      name="discord_url"
                      className={"input-field w-full pl-10 bg-bgMain"}
                      placeholder="Sui Amount"
                      pattern={"(https://)?(www.)?(((discord(app)?)?.com/invite)|((discord(app)?)?.gg))/(?<invite>.+)"}
                      onChange={(e) => setSuiValueWalletOne(Number(e.target.value))}
                    />
                  </div>
                </LabeledInput>

                {/* Your Offer */}
                <div className="h-[10vh] bg-yellowColor/20 rounded-lg border-yellowColor border-2 text-xl text-yellowColor px-2 py-1 mt-2">
                  Your Offer
                </div>
              </div>
            </div>

            <button className="w-full py-3 bg-redColor text-white font-medium mt-2 rounded-md">SWAP</button>
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
        </>
      ) : (
        <>
          <h1 className={classNames("text-4xl font-bold")}>Welcome to Hola P2P Swap</h1>
          <p className={classNames("text-lg font-medium mt-1")}>
            Swap NFTs secure and without third-parties companies!
          </p>
          <div className="flex flex-col justify-items-center justify-evenly items-center mt-10 rounded-2xl h-[35vh] p-6">
            <div className="flex flex-col w-full items-center gap-4">
              <p className="text-2xl font-semibold">Let's start!</p>
              <button
                className="w-1/2 font-bold rounded-lg bg-purpleColor text-white py-4"
                onClick={() => setActivateSwap(true)}
              >
                Create new swap
              </button>
              <button className="w-1/2 font-bold rounded-lg bg-yellowColor text-white py-4">View History</button>
              <div className="flex gap-4">
                <p className="text-sm">Verified Collection</p>
                <p className="text-sm">Rules</p>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Swap;
