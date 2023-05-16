import React, { useEffect, useRef, useState } from "react";
import { Montserrat } from "next/font/google";
import { classNames, formatNumber, GAME_PASS_REWARD_INFO_ID, STAKING_TABLE_ID } from "utils";
import { ethos } from "ethos-connect";
import { fetchRewards, signTransactionClaimGamePass, suiProvider } from "services/sui";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { AlertErrorMessage, AlertSucceed } from "../components/Alert/CustomToast";
import { LeaderboardDialog } from "components/Dialog/LeaderboardDialog";
import token from "/public/img/points.png";
import gifCapy from "/public/img/gif_for_game.gif";
import Image from "next/image";
import Link from "next/link";

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
    async function fetchWalletRewards() {
      if (!wallet?.address) {
        setGameAvailable(false);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const rewards = fetchRewards(nfts)?.filter((r) => r?.reward_info_id === GAME_PASS_REWARD_INFO_ID);

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

    fetchWalletRewards().then();
  }, [wallet?.address, wallet?.contents]);

  function setupFrame() {
    try {
      if (!wallet?.address || !iframeRef.current) return;

      //@ts-ignore
      iframeRef.current.contentWindow?.postMessage(wallet.address, "*");
    } catch (e) {
      console.error(e);
    }
  }

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
    <main className="flex min-h-[65vh] flex-col pl-16 py-6 mt-24 md:mt-28 pr-10 z-10 rounded-lg bg-[#5e96dd]">
      <div className="flex w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className={classNames(font_montserrat.className, "text-4xl font-bold text-white")}>Welcome to Capy Game</p>
        {gameAvailable ? (
          <div
            className={classNames(
              "border-2 py-4 border-yellowColor font-bold text-yellowColor hover:bg-yellowColor z-[5] hover:text-white px-4 rounded-md",
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
          className="w-full md:h-[65vh] h-[45vh] rounded-md mt-4"
          onLoad={setupFrame}
        />
      ) : (
        <div className="flex text-white mt-20 items-center content-center justify-end w-full h-full">
          <div className="w-1/2 flex justify-end content-end items-end mr-4">
            <Image
              src={gifCapy}
              alt={"gifCapy"}
              height={100}
              width={100}
              priority
              className="w-1/2 h-full rounded-md"
            />
          </div>
          <div>
            <div
              className={classNames(
                font_montserrat.className,
                "text-2xl leading-6 flex justify-start content-center items-center gap-2 flex-wrap font-semibold "
              )}
            >
              <p>To play this game you need</p>
              <div className="flex gap-2">
                <p className="text-yellowColor">1000</p>
                <Image src={token} alt={"points"} height={25} width={25} priority />
                <p>Hola points from Staking</p>
              </div>
            </div>
            <p className={classNames("text-xl md:text-xl md:pt-4 pt-1", font_montserrat.className)}>
              Your points: {totalMyPointsOnchain ? formatNumber(totalMyPointsOnchain) : 0}
            </p>

            <div className={classNames("flex flex-col font-medium", font_montserrat.className)}>
              <button
                disabled={waitSui || !totalMyPointsOnchain || totalMyPointsOnchain < 1000}
                className="mt-4 px-4 py-2 w-1/2 bg-purpleColor hover:bg-purpleColor/80 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  claimReward().then();
                }}
              >
                Claim Pass
              </button>
              <Link href="/">
                <button
                  disabled={waitSui}
                  className="mt-4 px-4 py-2 w-1/2 bg-redColor hover:bg-redColor/80 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Stake Capy
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {isOpenLeaderboard && (
        <LeaderboardDialog wallet={wallet} opened={isOpenLeaderboard} setOpened={setIsOpenLeaderboard} />
      )}
    </main>
  );
}
