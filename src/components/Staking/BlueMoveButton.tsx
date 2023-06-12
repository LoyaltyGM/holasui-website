import {classNames} from "utils";
import Image from "next/image";
import bluemoveLogo from "/public/img/bluemove_logo.svg";

export const BlueMoveButton = ({text, fontClassName}:{text: string, fontClassName?: string}) => {
    return(
        <a href="https://sui.bluemove.net/collection/suifrens" target="_blank">
            <div
                className={classNames(
                    "bg-neutral-900 py-4 mt-4 text-white items-center flex content-center justify-center cursor-pointer rounded-xl hover:bg-neutral-800",
                    fontClassName
                )}
            >
                <p className="font-semibold">Get one more capy on</p>
                <Image src={bluemoveLogo} alt={"Blue Move Logo"} className="h-8 -ml-5" />
            </div>
        </a>
    )
}