import React, { useState } from "react";
import { ethos } from "ethos-connect";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { Montserrat } from "next/font/google";
import { classNames } from "utils";
import Link from "next/link";

const font_montserrat = Montserrat({ subsets: ["latin"] });

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="flex md:hidden">
      <Bars3Icon
        className="z-10 h-10 w-10 cursor-pointer text-3xl text-black"
        onClick={toggleMenu}
      />
      {isOpen && (
        <div
          className={classNames(
            "fixed left-0 top-0 z-10 h-screen w-screen overflow-x-hidden bg-black/90 bg-opacity-90 px-2 font-medium transition-all duration-500 ease-in-out",
            font_montserrat.className,
          )}
        >
          <XMarkIcon
            className="absolute right-5 top-5 h-10 w-10 cursor-pointer text-3xl text-white"
            onClick={toggleMenu}
          />
          <div className="w-full pt-24 text-center">
            <Link href="/">
              <div className="my-3 block rounded-md bg-pinkColor py-3 text-2xl text-white transition-all duration-300 ease-in-out hover:text-gray-300">
                Staking
              </div>
            </Link>
            <Link href="/swap">
              <div className="my-3 block rounded-md bg-yellowColor py-3 text-2xl text-white transition-all duration-300 ease-in-out hover:text-gray-300">
                P2P Swap
              </div>
            </Link>
            <Link href="/dao">
              <div className="my-3 block rounded-md bg-purpleColor py-3 text-2xl text-white transition-all duration-300 ease-in-out hover:text-gray-300">
                DAO Hack
              </div>
            </Link>

            <div className="my-3 block rounded-md bg-transparent py-3 text-2xl text-white transition-all duration-300 ease-in-out hover:text-gray-300"></div>
            <a
              href="https://discord.gg/X8SXejkVHs"
              target="_black"
              className="my-3 block rounded-md bg-purple-500 py-3 text-2xl text-white transition-all duration-300 ease-in-out hover:text-gray-300"
            >
              Discord
            </a>
            <a
              href="https://twitter.com/Hola_Sui"
              target="_black"
              className="my-3 block rounded-md bg-blue-400 py-3 text-2xl text-white transition-all duration-300 ease-in-out hover:text-gray-300"
            >
              Twitter
            </a>
            <div className="my-3 block text-2xl text-white">
              <ethos.components.AddressWidget />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
