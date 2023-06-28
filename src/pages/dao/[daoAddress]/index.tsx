import { GetServerSideProps, NextPage } from "next";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet } from "components";
import { classNames, formatSuiAddress } from "utils";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, FolderIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import ExternalWebsiteIcon from "/public/img/ExternalLinkIcon.svg";
import SuiToken from "/public/img/SuiToken.png";
import Link from "next/link";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { IDao } from "types/daoInterface";
import frensLogo from "/public/img/frens-logo.svg";

interface IDaoAddressProps {
  daoAddress: string;
}

export const getServerSideProps: GetServerSideProps<IDaoAddressProps> = async ({ params }) => {
  try {
    const daoAddress = params?.daoAddress as string;
    return {
      props: {
        daoAddress,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

interface IProposalCard {
  title: string;
  startDate: string;
  status: boolean;
}

const DetailDaoAddress: NextPage<IDaoAddressProps> = ({ daoAddress }) => {
  const { status, wallet } = ethos.useWallet();
  const [dao, setDao] = useState<IDao>();
  useEffect(() => {
    async function fetchDao() {
      const dao = await suiProvider.getObject({
        id: daoAddress,
        options: {
          showContent: true,
        },
      });
      setDao(getObjectFields(dao) as IDao);
    }

    fetchDao().then();
  }, []);

  const InfoDao = () => {
    return (
      <div className={"mt-10"}>
        <div className={"flex w-full justify-between"}>
          <div className={"flex w-full justify-between"}>
            <div className={"flex gap-4"}>
              <Image
                src={dao?.image || frensLogo}
                alt={"logo-dao"}
                height={150}
                width={150}
                className={"w-30 h-30 rounded-full"}
              />
              <div>
                <div className={"flex content-center items-center justify-start gap-3"}>
                  <h1 className={"text-4xl font-semibold text-blackColor"}>{dao?.name}</h1>
                  <Image
                    src={ExternalWebsiteIcon}
                    alt={"external website icon"}
                    className={"h-5 w-5 cursor-pointer"}
                  />
                </div>
                <InfoDaoDescription />
              </div>
            </div>

            <div className={"flex flex-col justify-center"}>
              <Link href={`/dao/${daoAddress}/create-subdao`}>
                <button className={"min-w-[170px] rounded-lg bg-pinkColor px-5 py-3 text-white"}>
                  <p className={"font-medium"}>Create SubDAO</p>
                </button>
              </Link>
              <div
                className={
                  "mt-2 flex w-full cursor-pointer justify-center px-2 text-xs text-black2Color underline underline-offset-2"
                }
              >
                What is Sub DAO?
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InfoDaoDescription = () => {
    return (
      <div
        className={
          "mt-4 max-h-[52px] w-3/4 overflow-hidden text-clip text-base font-bold text-black2Color"
        }
      >
        <p className={"w-full"}>{dao?.description}</p>
      </div>
    );
  };

  const Treasury = () => {
    return (
      <div
        className={
          "mt-6 flex min-h-[125px] w-full content-center items-center justify-between rounded-xl border-2 border-grayColor bg-white px-4 py-2"
        }
      >
        <div className={""}>
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
        <p className={"max-w-[280px] text-sm text-black2Color"}>
          This treasury exists for {dao?.name} participants to allocate resources for the long-term
          growth and prosperity of the project.
        </p>
      </div>
    );
  };

  const CardScroll = () => {
    const [isLeftVisible, setIsLeftVisible] = useState(false);
    const [isRightVisible, setIsRightVisible] = useState(true);
    const scrollContainer = useRef<any>(null);

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
      <div className={"mt-14"}>
        <Title />
        <div className="mt-10 flex gap-8">
          <button
            className="z-20 cursor-pointer content-center px-3 py-2"
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
            className="hide-scroll-bar flex gap-16 overflow-x-scroll"
          >
            {/* Here you would map through your cards. I'm just using a static example */}
            <div className="mr-4 flex h-[170px] min-w-[256px] max-w-[256px] rounded-xl border border-black2Color bg-yellowColor">
              <p className="z-10 px-5 py-4 text-xl font-bold text-white">Ear4</p>
              <Image
                src="https://api-mainnet.suifrens.sui.io/suifrens/0x211a0715238cba5bd45b0910697b7c7b6058723dee4c35378b7336ccdf1304d1/svg"
                alt="capy"
                className="z-[9] h-full"
                width={200}
                height={250}
              />
            </div>
            <div
              className={
                "flex h-[170px] min-w-[256px] max-w-[256px] rounded-xl border border-black2Color bg-pinkColor"
              }
            >
              <p className={"z-10 px-5 py-4 text-xl font-bold text-white"}>Ear4</p>
              <Image
                src={
                  "https://api-mainnet.suifrens.sui.io/suifrens/0x211a0715238cba5bd45b0910697b7c7b6058723dee4c35378b7336ccdf1304d1/svg"
                }
                alt={"capy"}
                className={"z-[9] h-full"}
                width={200}
                height={250}
              />
            </div>
            <div
              className={
                "flex h-[170px] min-w-[256px] max-w-[256px] rounded-xl border border-yellowColor bg-orange-300"
              }
            >
              <p className={"z-10 px-5 py-4 text-xl font-bold text-white"}>Ear4</p>
              <Image
                src={
                  "https://api-mainnet.suifrens.sui.io/suifrens/0x211a0715238cba5bd45b0910697b7c7b6058723dee4c35378b7336ccdf1304d1/svg"
                }
                alt={"capy"}
                className={"z-[9] h-full"}
                width={200}
                height={250}
              />
            </div>
            <div
              className={
                "flex h-[170px] min-w-[256px] max-w-[256px] rounded-xl border border-black2Color bg-yellowColor"
              }
            >
              <p className={"z-10 px-5 py-4 text-xl font-bold text-white"}>Ear4</p>
              <Image
                src={
                  "https://api-mainnet.suifrens.sui.io/suifrens/0x211a0715238cba5bd45b0910697b7c7b6058723dee4c35378b7336ccdf1304d1/svg"
                }
                alt={"capy"}
                className={"z-[9] h-full"}
                width={200}
                height={250}
              />
            </div>
            <div
              className={
                "flex h-[170px] min-w-[256px] max-w-[256px] rounded-xl border border-yellowColor bg-pinkColor"
              }
            >
              <p className={"z-10 px-5 py-4 text-xl font-bold text-white"}>Ear4</p>
              <Image
                src={
                  "https://api-mainnet.suifrens.sui.io/suifrens/0x211a0715238cba5bd45b0910697b7c7b6058723dee4c35378b7336ccdf1304d1/svg"
                }
                alt={"capy"}
                className={"z-[9] h-full"}
                width={200}
                height={250}
              />
            </div>
            {/* Other cards */}
          </div>
          <button
            className="z-20 cursor-pointer px-3 py-2"
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
      </div>
    );
  };

  const ProposalCard = () => {
    return (
      <div
        className={
          "flex max-h-[80px] min-h-[80px] w-full cursor-pointer content-center items-center justify-between rounded-3xl border border-[#595959] bg-white px-6 py-4"
        }
      >
        <div className={"flex content-center items-center gap-10"}>
          <p className={"text-xl font-bold text-black2Color"}>1</p>
          <p className={"w-1/2 min-w-[300px] text-xl font-medium"}>Proposal Name</p>
        </div>
        <div className={"flex content-center items-center gap-10"}>
          <div className={"text-black2Color"}>Starts in 2 days</div>
          <div className={"rounded-xl border border-yellowColor px-4 py-2 text-yellowColor"}>
            Pending
          </div>
        </div>
      </div>
    );
  };

  const Proposals = () => {
    return (
      <div className={"mb-10 mt-14"}>
        <div className={"mt-10 flex content-center items-center justify-between"}>
          <p className={"text-2xl font-bold"}>Proposals</p>
          <Link href={`/dao/${daoAddress}/create-proposal`}>
            <button className={"rounded-lg bg-yellowColor px-5 py-3 text-white"}>
              <p className={"font-medium"}>Submit Proposal</p>
            </button>
          </Link>
        </div>
        <div className={"mt-10 space-y-4"}>
          <Link href={`/dao/${daoAddress}/0x02`}>
            <ProposalCard />
          </Link>
          <ProposalCard />
          <ProposalCard />
        </div>
      </div>
    );
  };

  const BradcrumbsHeader = () => {
    return (
      <nav className="mt-10 flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1">
          <li className="inline-flex items-center">
            <Link
              href="/dao"
              className="inline-flex items-center text-sm font-medium text-grayColor hover:text-black2Color"
            >
              <FolderIcon className={"mr-1.5 h-4 w-4"} />
              <p>Hola DAOs</p>
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <p className={"font-semibold text-grayColor md:ml-2 md:mr-2"}>/</p>
              <FolderIcon className={"mr-1.5 h-4 w-4 text-black2Color"} />
              <span className="text-sm font-medium text-black2Color">
                {formatSuiAddress(daoAddress)}
              </span>
            </div>
          </li>
        </ol>
      </nav>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <main
      className={classNames(
        "mt-18 z-10 mt-8 flex min-h-[100vh] flex-col rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] md:pl-16 md:pr-10 ",
      )}
    >
      <BradcrumbsHeader />
      <InfoDao />
      <Treasury />
      {/*<SubDAO />*/}
      <CardScroll />
      <Proposals />
    </main>
  );
};

export default DetailDaoAddress;
