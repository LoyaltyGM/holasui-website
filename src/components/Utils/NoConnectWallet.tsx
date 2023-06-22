import {classNames} from "../../utils";
import Image from "next/image";
import {ethos} from "ethos-connect";
import {Montserrat} from "next/font/google";
import ImageSuietIcon from "/public/img/SuietLogo.svg";


const font_montserrat = Montserrat({subsets: ["latin"]});

export const NoConnectWallet = ({title} :{title: string}) => {
    return (
        <main className="flex min-h-[85vh] flex-col items-center justify-around md:mt-20 z-10 rounded-lg bg-basicColor">
            <div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
                <div
                    className={classNames(
                        "flex flex-col md:flex-row md:gap-2 gap-1 justify-center items-center content-center text-4xl text-center w-full pt-12 font-bold text-[#5A5A95] ",
                        font_montserrat.className
                    )}
                >
                    <p>Connect</p>
                    <Image src={ImageSuietIcon} alt={"suiet"} height={350} width={50} className="h-28" priority/>
                    <p>Suiet Wallet To Unlock {title}</p>
                </div>
                <div className="mt-4 w-full flex justify-center content-center">
                    <ethos.components.AddressWidget/>
                </div>
            </div>
        </main>
    )
}