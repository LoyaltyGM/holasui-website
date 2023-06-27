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
import { NewsTicker } from "./NewsTicker";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export function Sidebar({ children }: ILayoutProps) {
  const router = useRouter();

  const Header = () => {
    return (
      <div className={"fixed-header w-full"}>
        <div
          className={classNames(
            "mx-2 rounded-lg border-2 border-blackColor bg-white px-2 py-1 text-white md:mx-8",
            router.pathname === "/dao" || router.pathname === "/dao/[daoAddress]"
              ? "mt-4 md:mt-20"
              : "mt-4",
          )}
        >
          <div className="flex justify-between md:content-center md:items-center">
            <Link href="/">
              <Image src={Logo} height={60} width={140} alt={"logo"} priority unoptimized={true} />
            </Link>
            <div
              className={classNames(
                "mx-3 mt-1 hidden gap-10 font-semibold text-blackColor md:flex md:items-center md:justify-evenly",
                font_montserrat.className,
              )}
            >
              <Link href="/">
                <div
                  className={classNames(
                    "my-3 block rounded-md py-2",
                    router.pathname === "/"
                      ? "font-bold text-yellowColor"
                      : "hover:text-yellowColorHover",
                  )}
                >
                  Staking
                </div>
              </Link>
              <Link href="/swap">
                <div
                  className={classNames(
                    "my-3 block rounded-md py-2",
                    router.pathname === "/swap"
                      ? "font-bold text-purpleColor"
                      : "hover:text-purpleColor",
                  )}
                >
                  P2P Swap
                </div>
              </Link>
            </div>

            <div className="mt-2 hidden h-12 items-center gap-8 md:flex">
              <div
                className={classNames(
                  "flex flex-col items-center justify-center",
                  "text-black2Color",
                  "group cursor-pointer rounded-2xl py-2 text-xs font-medium hover:text-[#8d6eec]",
                  font_montserrat.className,
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
                  "group cursor-pointer rounded-2xl py-2 text-xs font-medium hover:fill-[#6ea0ec] hover:text-[#6ea0ec] group-hover:text-[#6ea0ec]",
                  font_montserrat.className,
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
    <>
      {router.pathname === "/dao" || router.pathname === "/dao/[daoAddress]" ? (
        <div className={"left-0 top-0 h-[65px] w-full md:fixed"}>
          <NewsTicker />
        </div>
      ) : null}
      <div
        className={classNames(
          router.pathname === "/dao" || router.pathname === "/dao/[daoAddress]"
            ? "md:mt-14"
            : "mt-4",
        )}
      >
        <Header />
        <div className="flex flex-1 flex-col">
          <main className="h-full flex-1 bg-basicColor">
            <div className="mx-auto w-full max-w-7xl px-0 sm:pl-[5rem] sm:pr-[1.5rem] md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
