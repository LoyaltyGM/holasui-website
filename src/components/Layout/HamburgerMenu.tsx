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
    <div className="flex md:hidden relative">
      <Bars3Icon
        className="text-black h-10 w-10 text-3xl absolute top-5 right-2 z-10 cursor-pointer"
        onClick={toggleMenu}
      />
      {isOpen && (
        <div
          className={classNames(
            "fixed z-10 top-0 left-0 w-screen font-medium px-2 h-screen bg-black/90 bg-opacity-90 overflow-x-hidden transition-all duration-500 ease-in-out",
            font_montserrat.className
          )}
        >
          <XMarkIcon
            className="text-white text-3xl h-10 w-10 absolute top-5 right-5 cursor-pointer"
            onClick={toggleMenu}
          />
          <div className="pt-24 w-full text-center">
            <Link href="/">
              <div className="block text-white bg-pinkColor py-3 rounded-md text-2xl my-3 transition-all duration-300 ease-in-out hover:text-gray-300">
                Staking
              </div>
            </Link>
            <Link href="/swap">
              <div className="block text-white bg-yellowColor py-3 rounded-md text-2xl my-3 transition-all duration-300 ease-in-out hover:text-gray-300">
                P2P Swap
              </div>
            </Link>

            <div className="block text-white bg-transparent py-3 rounded-md text-2xl my-3 transition-all duration-300 ease-in-out hover:text-gray-300"></div>
            <a
              href="https://discord.gg/X8SXejkVHs"
              target="_black"
              className="block text-white bg-purple-500 py-3 rounded-md text-2xl my-3 transition-all duration-300 ease-in-out hover:text-gray-300"
            >
              Discord
            </a>
            <a
              href="https://twitter.com/Hola_Sui"
              target="_black"
              className="block text-white bg-blue-400 py-3 rounded-md text-2xl my-3 transition-all duration-300 ease-in-out hover:text-gray-300"
            >
              Twitter
            </a>
            <div className="block text-white text-2xl my-3">
              <ethos.components.AddressWidget />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
