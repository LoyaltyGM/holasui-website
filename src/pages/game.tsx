import React, { useEffect, useRef, useState } from "react";
import { Montserrat } from "next/font/google";
import { classNames, formatNumber, GAME_PASS_REWARD_INFO_ID, STAKING_TABLE_ID } from "utils";
import { ethos } from "ethos-connect";
import { fetchRewards, signTransactionClaimGamePass, suiProvider } from "services/sui";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { AlertErrorMessage, AlertSucceed } from "../components/Alert/CustomToast";
import { LeaderboardDialog } from "components/Dialog/LeaderboardDialog";
import token from "/public/img/points.png";
import Image from "next/image";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export default function GamePage() {
  const { wallet } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

  const iframeRef = useRef(null);

  const [gameAvailable, setGameAvailable] = React.useState(false);
  const [totalMyPointsOnchain, setTotalMyPointsOnchain] = useState(0);
  const [isOpenLeaderboard, setIsOpenLeaderboard] = useState(false);

  useEffect(() => {
    async function fetchMyPoints() {
      if (!wallet?.address) {
        return;
      }
      try {
        const response = await suiProvider.getDynamicFieldObject({
          parentId: STAKING_TABLE_ID!,
          name: {
            type: "address",
            value: wallet.address,
          },
        });
        const fields = getObjectFields(response);

        const onchainPoints: number = +fields?.value || 0;

        setTotalMyPointsOnchain(onchainPoints);
      } catch (e) {
        console.error(e);
      }
    }

    fetchMyPoints().then();
  }, [wallet?.contents, wallet?.address]);

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        setGameAvailable(false);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const rewards = fetchRewards(nfts)?.filter((r) => r?.reward_info_id === GAME_PASS_REWARD_INFO_ID);
        console.log(rewards);

        if (rewards && rewards?.length > 0) {
          setGameAvailable(true);
        } else {
          setGameAvailable(false);
        }
      } catch (e) {
        console.error(e);
        setGameAvailable(false);
      }
    }

    fetchWalletFrens().then();
  }, [wallet?.address, wallet?.contents]);

  useEffect(() => {
    if (wallet && wallet.address && iframeRef.current) {
      //@ts-ignore
      iframeRef.current.contentWindow?.postMessage(wallet.address, "*");
    }
  }, [wallet, iframeRef]);

  async function claimReward() {
    if (!wallet) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionClaimGamePass(),
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
        AlertSucceed("ClaimGamePass");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  }

  return (
    <main className="flex min-h-[65vh] flex-col pl-16 py-6 mt-24 md:mt-32 pr-10 z-10 rounded-lg bg-white">
      <div className="z-10 flex w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className={classNames(font_montserrat.className, "text-4xl font-bold")}>Welcome to Capy Game</p>
        {gameAvailable ? (
          <div
            className={classNames(
              "border-2 py-4 border-yellowColor font-bold text-yellowColor hover:bg-yellowColor hover:text-white px-4 rounded-md",
              font_montserrat.className
            )}
          >
            <button onClick={() => setIsOpenLeaderboard(true)}>Leaderboard</button>
          </div>
        ) : (
          <></>
        )}
      </div>
      {gameAvailable ? (
        <iframe
          ref={iframeRef}
          src="https://bitby.click/jumper2-min.html"
          className="w-full md:h-[65vh] h-[45vh] rounded-md"
          title="Game iframe"
        />
      ) : (
        <div className="flex flex-col mt-20 items-center justify-start w-full h-full">
          <div>
            <Image src={token} alt={"points"} height={35} width={40} priority />
          </div>
          <div>
            <p className={classNames(font_montserrat.className, "text-2xl font-semibold text-darkColor")}>
              To play this game you need 1000 <Image src={token} alt={"points"} height={35} width={40} priority /> Hola
              points
            </p>
            <p className={classNames("text-xl md:text-xl md:pt-0 pt-1", font_montserrat.className)}>
              Your points: {totalMyPointsOnchain ? formatNumber(totalMyPointsOnchain) : 0}
            </p>

            <button
              disabled={waitSui || !totalMyPointsOnchain || totalMyPointsOnchain < 1000}
              className="mt-4 px-4 py-2 w-1/2 bg-purpleColor text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                claimReward().then();
              }}
            >
              Claim Pass
            </button>
          </div>
        </div>
      )}
      {isOpenLeaderboard && (
        <LeaderboardDialog wallet={wallet} opened={isOpenLeaderboard} setOpened={setIsOpenLeaderboard} />
      )}
    </main>
  );
}
