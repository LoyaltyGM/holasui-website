import Image from "next/image";
import {classNames, formatNumber} from "utils";
import {IProjectCard} from "types";
import frensLogo from "/public/img/frens-logo.svg";

export const ProjectCard = ({totalStaked, setOpenRules, stakedList, totalHolaPointsOnchain, availablePointsToClaim, claimPointsFunction}: IProjectCard) => {
    return (
        <div className="md:flex md:p-4 md:py-8 py-4 px-2 gap-2 md:h-60 h-[30rem] border-2 bg-[#FFFFFF] border-[#F6F6F6] rounded-xl">
            <div className="md:ml-12 flex flex-col content-center items-center justify-center rounded-2xl">
                <Image src={frensLogo} alt={"logo"} height={185} width={185} />
            </div>
            <div className="w-full md:ml-4 py-2">
                <div className="flex justify-between">
                    <div>
                        <p className={classNames("text-3xl font-extrabold text-black2Color")}>
                            SuiFrens
                        </p>
                        <p className={classNames("text-black2Color font-light")}>
                            Each staked frens will earn 1 point per minute
                        </p>
                    </div>
                    <button
                        onClick={() => setOpenRules(true)}
                        className={classNames(
                            "text-md font-light text-black2Color hover:underline mr-2",
                        )}
                    >
                        FAQs
                    </button>
                </div>
                <div className="md:flex h-24 mt-4 justify-between gap-4">
                    <div className="bg-[#5A5A95] text-white py-4 w-full md:w-1/4 text rounded-xl flex md:flex-col md:justify-center justify-between content-center text-start px-3">
                        <p className={classNames("font-extrabold md:text-sm md:leading-4")}>
                            Total <br className="hidden md:flex" />
                            Staked
                        </p>
                        <p className={classNames("text-2xl font-black")}>
                            {totalStaked ? totalStaked : 0}
                        </p>
                    </div>
                    <div className="bg-pinkColor text-white py-4 mt-2 w-full md:mt-0 md:w-1/4 text rounded-xl flex md:flex-col md:justify-center justify-between content-center text-start px-3">
                        <p className={classNames("font-extrabold md:text-sm md:leading-4")}>
                            You <br className="hidden md:flex" />
                            Staked
                        </p>
                        <p className={classNames("text-2xl font-black")}>
                            {stakedList?.length ? stakedList.length : 0}
                        </p>
                    </div>
                    <div className="bg-yellowColor text-white py-4 mt-2 w-full md:mt-0 md:w-1/4 rounded-xl flex md:flex-col md:justify-center justify-between content-center text-start px-3">
                        <p
                            className={classNames("font-extrabold mt-2 md:mt-0 md:text-sm md:leading-4")}
                        >
                            Your Available Hola Points
                        </p>
                        <div>
                            <div className="flex gap-2 md:w-full md:justify-between">
                                <p className={classNames("text-xl md:text-xl md:pt-0 pt-1 font-black")}>
                                    {totalHolaPointsOnchain ? formatNumber(totalHolaPointsOnchain) : 0}
                                </p>
                                {stakedList?.length && availablePointsToClaim ? (
                                    <button
                                        className="underline text-sm"
                                        onClick={() => claimPointsFunction(stakedList?.map((ticket) => ticket.id))}
                                    >{`Claim ${formatNumber(availablePointsToClaim)} `}</button>
                                ) : (
                                    <button></button>
                                )}
                            </div>
                            {/* TODO: rewrite this part */}
                            {/* //this claim is available only on desktop */}
                            <div className="flex md:hidden text-left text-xs underline ">
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