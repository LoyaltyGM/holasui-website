import { ethos, EthosConnectStatus } from "ethos-connect";
import {formatSuiAddress, formatSuiNumber} from "utils";
import { useState } from "react";
import ImageSuiToken from "/public/img/SuiToken.png";
import LogoutIcon from "/public/img/IconLogout.svg";
import Image from "next/image";

const CustomWalletMenu = () => {
  const { status, wallet } = ethos.useWallet();
  const [openWallet, setOpenWallet] = useState(false);
  return (
    <div>
      {status === EthosConnectStatus.NoConnection ? (
        <ethos.components.AddressWidget />
      ) : (
        <button
          className={"py-3 px-4 text-pinkColor border-pinkColor border pinkColor-second-state rounded-xl"}
          onClick={() => setOpenWallet(!openWallet)}
        >
          {wallet ? formatSuiAddress(wallet?.address!, 3, 4) : "Connecting wallet..."}
        </button>
      )}
      {openWallet && (
        <button
          className={"absolute w-[100vw] z-10 h-[100vh] bg-black/20 left-0 top-0"}
          onClick={() => setOpenWallet(false)}
        >
          <div className={"absolute z-20 right-0 top-[60px] cursor-default"}>
            <div
              className={
                "relative border-black2Color border-2 px-5 py-4 right-[30px] bg-white mt-12 rounded-2xl h-44 w-64"
              }
            >
              <p className={"font-medium text-blackColor"}>
                Hola, {wallet ? formatSuiAddress(wallet?.address!, 3, 4) : ""}
              </p>
              <div
                className={"h-12 flex justify-center gap-2 bg-basicColor mt-5 rounded-xl content-center items-center"}
              >
                <Image src={ImageSuiToken} alt="token" className="h-[25px] w-[26px]" aria-hidden="true" />
                <p className={"text-blackColor"}><span className={'font-semibold'}>{`${formatSuiNumber(wallet?.contents?.suiBalance).toFixed(3) || "Loading"}`}</span> SUI</p>
              </div>
              <button
                className={"mt-5 text-blackColor justify-start w-full py-2"}
                onClick={() => {
                  wallet?.disconnect();
                  setOpenWallet(false);
                }}
              >
                <div className={"flex gap-2 justify-start content-center items-center fill-blackColor hover:text-grayColor"}>
                  <Image src={LogoutIcon} alt={"logout icon"} className={"w-5 h-5"} />
                  <p>Logout</p>
                </div>
              </button>
            </div>
          </div>
        </button>
      )}
    </div>
  );
};
export default CustomWalletMenu;
