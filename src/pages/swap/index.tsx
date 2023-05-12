import { ethos, EthosConnectStatus } from "ethos-connect";
import { Montserrat } from "next/font/google";
import Image from "next/image";

import suietIcon from "/public/img/SuietLogo2.svg";
import { classNames } from "utils";

const font_montserrat = Montserrat({ subsets: ["latin"] });

const Swap = () => {
  const { wallet, status } = ethos.useWallet();
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
          {/* <p>Suiet Wallet To Unlock P2P Swap!</p> */}
        </div>
        <div className="mt-4">
          <ethos.components.AddressWidget />
        </div>
      </div>
    </main>
  ) : (
    <main className="flex min-h-[85vh] flex-col pl-2 pr-2 md:pl-16 py-6 mt-20 md:pr-10 z-10 rounded-lg bg-bgMain">
      {/* <h1 className={classNames("text-4xl font-bold", font_montserrat.className)}>Welcome to P2P Swap</h1> */}
    </main>
  );
};

export default Swap;
