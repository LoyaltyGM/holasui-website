import { classNames } from "../../utils";
import Image from "next/image";
import { ethos } from "ethos-connect";
import { Montserrat } from "next/font/google";
import ImageSuietIcon from "/public/img/SuietLogo.svg";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export const NoConnectWallet = ({ title }: { title: string }) => {
  return (
    <main className="z-10 flex min-h-[85vh] flex-col items-center justify-around rounded-lg bg-basicColor md:mt-20">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div
          className={classNames(
            "w-full content-center items-center justify-center gap-1 pt-12 text-center text-4xl font-bold text-[#5A5A95] md:w-full md:flex-row md:gap-1",
            font_montserrat.className,
          )}
        >
          <p>Connect your wallet to unlock {title}</p>
        </div>
        <div className="mt-8 flex w-full content-center justify-center">
          <ethos.components.AddressWidget />
        </div>
      </div>
    </main>
  );
};
