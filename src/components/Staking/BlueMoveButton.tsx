import { classNames } from "utils";
import Image from "next/image";
import bluemoveLogo from "/public/img/bluemove_logo.svg";

export const BlueMoveButton = ({
  text,
  fontClassName,
}: {
  text: string;
  fontClassName?: string;
}) => {
  return (
    <a href="https://sui.bluemove.net/collection/suifrens" target="_blank">
      <div
        className={classNames(
          "mt-4 flex cursor-pointer content-center items-center justify-center rounded-xl bg-neutral-900 py-4 text-white hover:bg-neutral-800",
          fontClassName,
        )}
      >
        <p className="font-semibold">Get one more capy on</p>
        <Image src={bluemoveLogo} alt={"Blue Move Logo"} className="-ml-5 h-8" />
      </div>
    </a>
  );
};
