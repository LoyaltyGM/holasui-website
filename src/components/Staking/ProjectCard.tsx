import Image from "next/image";
import { classNames, formatNumber } from "utils";
import { IProjectCard } from "types";
import frensLogo from "/public/img/frens-logo.svg";

export const ProjectCard = ({
  totalStaked,
  setOpenRules,
  stakedList,
  totalHolaPointsOnchain,
  availablePointsToClaim,
  claimPointsFunction,
}: IProjectCard) => {
  return (
    <div className="h-[30rem] gap-2 rounded-xl border-2 border-[#F6F6F6] bg-[#FFFFFF] px-2 py-4 md:flex md:h-60 md:p-4 md:py-8">
      <div className="flex flex-col content-center items-center justify-center rounded-2xl md:ml-12">
        <Image src={frensLogo} alt={"logo"} height={185} width={185} />
      </div>
      <div className="w-full py-2 md:ml-4">
        <div className="flex justify-between">
          <div>
            <p className={classNames("text-3xl font-extrabold text-black2Color")}>SuiFrens</p>
            <p className={classNames("font-light text-black2Color")}>
              Each staked frens will earn 1 point per minute
            </p>
          </div>
          <button
            onClick={() => setOpenRules(true)}
            className={classNames("text-md mr-2 font-light text-black2Color hover:underline")}
          >
            FAQs
          </button>
        </div>
        <div className="mt-4 h-24 justify-between gap-4 md:flex">
          <div className="text flex w-full content-center justify-between rounded-xl bg-[#5A5A95] px-3 py-4 text-start text-white md:w-1/4 md:flex-col md:justify-center">
            <p className={classNames("font-extrabold md:text-sm md:leading-4")}>
              Total <br className="hidden md:flex" />
              Staked
            </p>
            <p className={classNames("text-2xl font-black")}>{totalStaked ? totalStaked : 0}</p>
          </div>
          <div className="text mt-2 flex w-full content-center justify-between rounded-xl bg-pinkColor px-3 py-4 text-start text-white md:mt-0 md:w-1/4 md:flex-col md:justify-center">
            <p className={classNames("font-extrabold md:text-sm md:leading-4")}>
              You <br className="hidden md:flex" />
              Staked
            </p>
            <p className={classNames("text-2xl font-black")}>
              {stakedList?.length ? stakedList.length : 0}
            </p>
          </div>
          <div className="mt-2 flex w-full content-center justify-between rounded-xl bg-yellowColor px-3 py-4 text-start text-white md:mt-0 md:w-1/4 md:flex-col md:justify-center">
            <p className={classNames("mt-2 font-extrabold md:mt-0 md:text-sm md:leading-4")}>
              Your Available Hola Points
            </p>
            <div>
              <div className="flex gap-2 md:w-full md:justify-between">
                <p className={classNames("pt-1 text-xl font-black md:pt-0 md:text-xl")}>
                  {totalHolaPointsOnchain ? formatNumber(totalHolaPointsOnchain) : 0}
                </p>
                {stakedList?.length && availablePointsToClaim ? (
                  <button
                    className="text-sm underline"
                    onClick={() => claimPointsFunction(stakedList?.map((ticket) => ticket.id))}
                  >{`Claim ${formatNumber(availablePointsToClaim)} `}</button>
                ) : (
                  <button></button>
                )}
              </div>
              {/* TODO: rewrite this part */}
              {/* //this claim is available only on desktop */}
              <div className="flex text-left text-xs underline md:hidden ">
                {stakedList?.length && availablePointsToClaim ? (
                  <button
                    className="underline"
                    onClick={() => claimPointsFunction(stakedList?.map((ticket) => ticket.id))}
                  >{`Claim ${formatNumber(availablePointsToClaim)} `}</button>
                ) : (
                  <button></button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
