import React from "react";
import { ethos } from "ethos-connect";
import { ILayoutProps } from "types";
import Link from "next/link";
import { TwitterIcon } from "components/Icons";
import { classNames } from "utils/";
import Logo from "/public/img/logo.png";
import Image from "next/image";

export function Sidebar({ children }: ILayoutProps) {
  const Header = () => {
    return (
      <div className="fixed-header bg-[#FFFFFF] w-full h-18 text-white px-8 py-2 mr-6 rounded-lg">
        <div
          className="flex 
         justify-between"
        >
          <Link href="/">
            <Image src={Logo} height={75} width={130} alt={"logo"} />
          </Link>

          <div className="flex h-12 gap-8 mt-2">
            <div
              className={classNames(
                "flex flex-col items-center justify-center",
                "text-gray-300 ",
                "group py-2 text-sm font-medium group-hover:text-[#6ea0ec] hover:fill-[#6ea0ec] hover:text-[#6ea0ec] rounded-2xl cursor-pointer"
              )}
            >
              <a href="https://twitter.com/HolaSui" target="_black">
                <TwitterIcon width="26" height="26" />
              </a>
            </div>
            <ethos.components.AddressWidget />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-4 mt-4">
      <Header />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 h-full bg-Background">
          <div className="mx-auto max-w-7xl w-full px-4 sm:pl-[5rem] sm:pr-[1.5rem] md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
