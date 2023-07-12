import { useRef, useState } from "react";
import { classNames, ORIGIN_CAPY_DAO_ID } from "utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { IDao } from "types/daoInterface";
import Link from "next/link";
export const SubdaosCards = ({ subDAOs }: { subDAOs: IDao[] }) => {
  const [isLeftVisible, setIsLeftVisible] = useState(false);
  const [isRightVisible, setIsRightVisible] = useState(true);
  const scrollContainer = useRef<any>(null);
  const capyDaoAddress: string = ORIGIN_CAPY_DAO_ID;
  const checkScroll = () => {
    setIsLeftVisible(scrollContainer.current.scrollLeft > 0);
    setIsRightVisible(
      scrollContainer.current.scrollWidth >
        scrollContainer.current.clientWidth + scrollContainer.current.scrollLeft + 1,
    );
  };

  const scroll = (scrollOffset: number) => {
    scrollContainer.current.scrollLeft += scrollOffset;
    checkScroll();
  };

  const Title = () => {
    return <p className={"text-2xl font-bold"}>Sub CapyDAO</p>;
  };

  return (
    <>
      {subDAOs?.length > 0 && (
        <div className={"mt-14 h-56"}>
          <Title />
          {subDAOs.length > 0 ? (
            <div className="mt-10 flex gap-8">
              <button
                className="z-[9] cursor-pointer content-center px-3 py-2"
                disabled={!isLeftVisible}
                onClick={() => scroll(-335)}
              >
                <div
                  className={classNames(
                    "rounded-xl border stroke-[2px] p-2",
                    isLeftVisible
                      ? "border-blackColor text-blackColor"
                      : "border-grayColor text-grayColor",
                  )}
                >
                  <ChevronLeftIcon className={"h-5 w-5"} />
                </div>
              </button>
              <div
                ref={scrollContainer}
                onScroll={checkScroll}
                className="hide-scroll-bar flex w-full cursor-pointer gap-16 overflow-x-scroll"
              >
                {subDAOs?.map((subdao, index) => (
                  <Link
                    href={`/dao/${capyDaoAddress}/subdao/${subdao.id?.id!}`}
                    key={index}
                    className="mr-4 flex h-[170px] min-w-[256px] max-w-[256px] rounded-xl border-2 border-blackColor bg-yellowColor"
                  >
                    <p className="z-[9] px-5 py-4 text-xl font-bold text-white">{subdao.name}</p>
                    <Image
                      src={subdao.image}
                      alt="capy"
                      className="z-[9] h-full min-w-[110px] max-w-[110px] rounded-r-lg object-cover"
                      width={200}
                      height={250}
                    />
                  </Link>
                ))}
              </div>
              <button
                className="z-[9] cursor-pointer px-3 py-2"
                disabled={!isRightVisible}
                onClick={() => scroll(335)}
              >
                <div
                  className={classNames(
                    "rounded-xl border stroke-[2px] p-2",
                    isRightVisible
                      ? "border-blackColor text-blackColor"
                      : "border-grayColor text-grayColor",
                  )}
                >
                  <ChevronRightIcon className={"h-5 w-5"} />
                </div>
              </button>
            </div>
          ) : (
            <div
              className={
                "text-grayColor text-center text-lg font-normal flex justify-center content-center items-center h-36"
              }
            >
              There are no SubDAOs yet
              <br /> Be the first and create subDAO by NFT attributes
            </div>
          )}
        </div>
      )}
    </>
  );
};
