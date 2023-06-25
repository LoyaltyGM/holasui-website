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
            "flex w-full flex-col content-center items-center justify-center gap-1 pt-12 text-center text-4xl font-bold text-[#5A5A95] md:flex-row md:gap-2 ",
            font_montserrat.className,
          )}
        >
          <p>Connect</p>
          <Image
            src={ImageSuietIcon}
            alt={"suiet"}
            height={350}
            width={50}
            className="h-28"
            priority
          />
          <p>Suiet Wallet To Unlock {title}</p>
        </div>
        <div className="mt-4 flex w-full content-center justify-center">
          <ethos.components.AddressWidget />
        </div>
      </div>
    </main>
  );
};
