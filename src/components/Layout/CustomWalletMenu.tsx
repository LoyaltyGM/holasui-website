import { ethos, EthosConnectStatus } from "ethos-connect";
import { formatSuiAddress, formatSuiNumber } from "utils";
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
          className={
            "pinkColor-second-state rounded-xl border border-pinkColor px-4 py-3 text-pinkColor"
          }
          onClick={() => setOpenWallet(!openWallet)}
        >
          {wallet ? formatSuiAddress(wallet?.address!, 3, 4) : "Connecting wallet..."}
        </button>
      )}
      {openWallet && (
        <button
          className={"absolute left-0 top-0 z-10 h-[100vh] w-[100vw] bg-black/20"}
          onClick={() => setOpenWallet(false)}
        >
          <div className={"absolute right-0 top-[60px] z-20 cursor-default"}>
            <div
              className={
                "relative right-[30px] mt-12 h-44 w-64 rounded-2xl border-2 border-black2Color bg-white px-5 py-4"
              }
            >
              <p className={"font-medium text-blackColor"}>
                Hola, {wallet ? formatSuiAddress(wallet?.address!, 3, 4) : ""}
              </p>
              <div
                className={
                  "mt-5 flex h-12 content-center items-center justify-center gap-2 rounded-xl bg-basicColor"
                }
              >
                <Image
                  src={ImageSuiToken}
                  alt="token"
                  className="h-[25px] w-[26px]"
                  aria-hidden="true"
                />
                <p className={"text-blackColor"}>
                  <span className={"font-semibold"}>{`${
                    formatSuiNumber(wallet?.contents?.suiBalance).toFixed(3) || "Loading"
                  }`}</span>{" "}
                  SUI
                </p>
              </div>
              <button
                className={"mt-5 w-full justify-start py-2 text-blackColor"}
                onClick={() => {
                  wallet?.disconnect();
                  setOpenWallet(false);
                }}
              >
                <div
                  className={
                    "flex content-center items-center justify-start gap-2 fill-blackColor hover:text-grayColor"
                  }
                >
                  <Image src={LogoutIcon} alt={"logout icon"} className={"h-5 w-5"} />
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
