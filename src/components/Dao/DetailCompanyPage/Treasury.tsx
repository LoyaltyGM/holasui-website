import Image from "next/image";
import SuiToken from "/public/img/SuiToken.png";
import { IDao } from "../../../types/daoInterface";

export const Treasury = ({ dao }: { dao: IDao }) => {
  return (
    <div
      className={
        "mt-12 min-h-[125px] w-full content-center items-center justify-between rounded-xl border-2 border-grayColor bg-white px-8 py-6"
      }
    >
      <div className={"flex w-full"}>
        <div className={"w-full"}>
          <p className={"text-lg font-bold text-grayColor"}>Treasury</p>
          <div
            className={
              "mt-4 flex content-center items-center gap-2 text-3xl font-bold text-blackColor"
            }
          >
            <Image src={SuiToken} alt={"sui token logo"} className={"h-9 w-9"} />
            <p className={"text-blackColor"}>{dao?.treasury}</p>
            <p>SUI</p>
          </div>
        </div>
        <div className={"w-1/4"}>
          <button
            className={
              "button-primary button-shadow w-min-[130px] w-max-[130px] mt-4 flex max-h-[48px] min-h-[48px] content-center items-center font-bold text-white"
            }
          >
            Fund treasury
          </button>
        </div>
      </div>
      <p className={"mt-4 max-w-full text-sm text-black2Color"}>
        This treasury exists for {dao?.name} participants to allocate resources for the long-term
        growth and prosperity of the project.
      </p>
    </div>
  );
};
