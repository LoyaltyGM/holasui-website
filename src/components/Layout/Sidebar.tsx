import React from "react";

import { ILayoutProps } from "types";
import Link from "next/link";
import { classNames } from "utils/";
import Logo from "/public/img/logo.png";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import HamburgerMenu from "./HamburgerMenu";
import { useRouter } from "next/router";
import CustomWalletMenu from "./CustomWalletMenu";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export function Sidebar({ children }: ILayoutProps) {
  const router = useRouter();

  const Header = () => {
    return (
      <div className={'w-full fixed-header'}>
        <div className="border-2 border-blackColor px-2 mt-2 md:mx-8 mx-2 bg-white py-1 text-white rounded-lg">
          <div className="flex justify-between md:content-center md:items-center">
            <Link href="/">
              <Image src={Logo} height={100} width={180} alt={"logo"} priority />
            </Link>
            <div
              className={classNames(
                "md:flex hidden md:justify-evenly gap-10 text-blackColor mx-3 mt-1 font-semibold",
                font_montserrat.className
              )}
            >
              <Link href="/">
                <div
                  className={classNames(
                    "block py-2 rounded-md my-3",
                    router.pathname === "/" ? "text-yellowColor font-bold" : "hover:text-yellowColorHover"
                  )}
                >
                  Staking
                </div>
              </Link>
              <Link href="/swap">
                <div
                  className={classNames(
                    "block py-2 rounded-md my-3",
                    router.pathname === "/swap" ? "text-purpleColor font-bold" : "hover:text-purpleColor"
                  )}
                >
                  P2P Swap
                </div>
              </Link>
            </div>

            <div className="hidden md:flex h-12 gap-8 mt-2 items-center">
              <div
                className={classNames(
                  "flex flex-col items-center justify-center",
                  "text-black2Color",
                  "group py-2 text-xs font-medium hover:text-[#8d6eec] rounded-2xl cursor-pointer",
                  font_montserrat.className
                )}
              >
                <a href="https://discord.gg/X8SXejkVHs" target="_black">
                  Discord
                </a>
              </div>
              <div
                className={classNames(
                  "flex flex-col items-center justify-center",
                  "text-black2Color",
                  "group py-2 text-xs font-medium group-hover:text-[#6ea0ec] hover:fill-[#6ea0ec] hover:text-[#6ea0ec] rounded-2xl cursor-pointer",
                  font_montserrat.className
                )}
              >
                <a href="https://twitter.com/Hola_Sui" target="_black">
                  Twitter
                </a>
              </div>
              <div>
                <CustomWalletMenu />
              </div>
            </div>
            <HamburgerMenu />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <Header />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 h-full bg-basicColor">
          <div className="mx-auto max-w-7xl w-full px-0 sm:pl-[5rem] sm:pr-[1.5rem] md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
