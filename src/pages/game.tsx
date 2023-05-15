import React, { useEffect, useRef } from "react";
import { Montserrat } from "next/font/google";
import { classNames } from "utils";
import { ethos, EthosConnectStatus } from "ethos-connect";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export default function GamePage() {
  const { wallet } = ethos.useWallet();
  const iframeRef = useRef(null);

  useEffect(() => {
    if (wallet && wallet.address && iframeRef.current) {
      //@ts-ignore
      iframeRef.current.contentWindow?.postMessage(wallet.address, "*");
    }
  }, [wallet, iframeRef]);

  return (
    <main className="flex min-h-[65vh] flex-col pl-16 py-6 mt-24 md:mt-32 pr-10 z-10 rounded-lg bg-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className={classNames(font_montserrat.className, "text-4xl font-bold")}>Welcome to Capy Game</p>
        <p className={classNames(font_montserrat.className, "text-2xl")}>To play this game you need 1000 Hola points</p>
      </div>
      <iframe
        ref={iframeRef}
        src="https://bitby.click/jumper2-min.html"
        className="w-full md:h-[65vh] h-[45vh] rounded-md"
        title="Game iframe"
      />
    </main>
  );
}
