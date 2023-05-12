import React from "react";
import { ethos } from "ethos-connect";
import { ILayoutProps } from "types";
import Link from "next/link";
import { classNames } from "utils/";
import Logo from "/public/img/logo.png";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import HamburgerMenu from "./HamburgerMenu";

const font_montserrat = Montserrat({ subsets: ["latin"] });
export function Sidebar({ children }: ILayoutProps) {
  const Header = () => {
    return (
      <div className="fixed-header bg-bgMain w-full h-20 text-white pl-6 pr-4 py-2 mr-6 rounded-lg">
        <div
          className="flex 
         justify-between"
        >
          <Link href="/">
            <Image src={Logo} height={100} width={180} alt={"logo"} priority />
          </Link>

          <div className="hidden md:flex h-12 gap-8 mt-2 items-center">
            <div
              className={classNames(
                "flex flex-col items-center justify-center",
                "text-[#595959]",
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
                "text-[#595959]",
                "group py-2 text-xs font-medium group-hover:text-[#6ea0ec] hover:fill-[#6ea0ec] hover:text-[#6ea0ec] rounded-2xl cursor-pointer",
                font_montserrat.className
              )}
            >
              <a href="https://twitter.com/Loyalty_GM" target="_black">
                Twitter
              </a>
            </div>
            <div>
              <ethos.components.AddressWidget />
            </div>
          </div>
          <HamburgerMenu />
        </div>
      </div>
    );
  };

  return (
    <div className="md:mx-4 mt-4">
      <Header />
      <div className="flex flex-1 flex-col">
        <main className="flex-1 h-full bg-bgMain">
          <div className="mx-auto max-w-7xl w-full px-0 sm:pl-[5rem] sm:pr-[1.5rem] md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
