import React, { useEffect, useRef, useState } from "react";
import { Montserrat } from "next/font/google";
import { classNames } from "utils";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { LeaderboardDialog } from "components/Dialog/LeaderboardDialog";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export default function GamePage() {
  const { wallet } = ethos.useWallet();

  const iframeRef = useRef(null);

  const [isOpenLeaderboard, setIsOpenLeaderboard] = useState(false);

  useEffect(() => {
    if (wallet && wallet.address && iframeRef.current) {
      //@ts-ignore
      iframeRef.current.contentWindow?.postMessage(wallet.address, "*");
    }
  }, [wallet, iframeRef]);

  return (
    <main className="flex min-h-[65vh] flex-col pl-16 py-6 mt-24 md:mt-32 pr-10 z-10 rounded-lg bg-white">
      <div className="z-10 mb-5 flex w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div>
          <p className={classNames(font_montserrat.className, "text-4xl font-bold")}>Welcome to Capy Game</p>
          <p className={classNames(font_montserrat.className, "text-2xl")}>
            To play this game you need 1000 Hola points
          </p>
        </div>
        <div
          className={classNames(
            "border-2 py-4 border-yellowColor font-bold text-yellowColor hover:bg-yellowColor hover:text-white px-4 rounded-md",
            font_montserrat.className
          )}
        >
          <button onClick={() => setIsOpenLeaderboard(true)}>Leaderboard</button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        src="https://bitby.click/jumper2-min.html"
        className="w-full md:h-[65vh] h-[45vh] rounded-md"
        title="Game iframe"
      />
      {isOpenLeaderboard && (
        <LeaderboardDialog wallet={wallet} opened={isOpenLeaderboard} setOpened={setIsOpenLeaderboard} />
      )}
    </main>
  );
}
