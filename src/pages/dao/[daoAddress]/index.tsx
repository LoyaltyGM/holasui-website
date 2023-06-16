import { GetServerSideProps, NextPage } from "next";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet } from "components";
import { classNames } from "utils";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import ExternalWebsiteIcon from "/public/img/ExternalLinkIcon.svg";
import SuiToken from "/public/img/SuiToken.png";
import Link from "next/link";

interface IDaoAddressProps {
  daoAddress: string;
}

export const getServerSideProps: GetServerSideProps<IDaoAddressProps> = async ({ params }) => {
  try {
    const daoAddress = params?.daoAddress as string;
    // TODO: fetch for sui data about dao

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

const DetailDaoAddress: NextPage<IDaoAddressProps> = ({ daoAddress }) => {
  const { status, wallet } = ethos.useWallet();

  const BackButton = () => {
    return (
      <div className={"flex gap-1 text-blackColor content-center items-center mt-10 cursor-pointer"}>
        <ArrowLeftIcon className={"w-5 h-5"} />
        <p className={"text-sm font-medium"}>Back</p>
      </div>
    );
  };

  const InfoDao = () => {
    return (
      <div className={"mt-10"}>
        <div className={"flex justify-between w-full"}>
          <div className={"flex gap-3 justify-center content-center items-center"}>
            <h1 className={"text-blackColor font-semibold text-4xl"}>Capy DAO</h1>
            <Image src={ExternalWebsiteIcon} alt={"external website icon"} className={"w-5 h-5 cursor-pointer"} />
          </div>
          <div className={"flex flex-col justify-center"}>
            <button className={"bg-redColor text-white px-5 py-3 rounded-lg"}>
              <p className={"font-medium"}>Create SubDAO</p>
            </button>
            <div
              className={
                "w-full flex text-[#595959] cursor-pointer justify-center mt-2 px-2 text-xs underline underline-offset-2"
              }
            >
              What is Sub DAO?
            </div>
          </div>
        </div>
        <InfoDaoDescription />
      </div>
    );
  };

  const InfoDaoDescription = () => {
    return (
      <div className={"w-3/4 max-h-[52px] text-clip overflow-hidden text-base mt-4 font-bold text-grayColor"}>
        <p>
          {
            "DAO description DAO description DAO description DAO description DAO description DAO description DAO description DAO description DAO description DAO description DAO description DAO description DAO description"
          }
        </p>
      </div>
    );
  };

  const Treasury = () => {
    return (
      <div
        className={
          "px-4 flex justify-between bg-white content-center items-center py-2 border-2 w-full mt-6 min-h-[125px] border-lightGrayColor rounded-xl"
        }
      >
        <div className={""}>
          <p className={"font-bold text-lg text-lightGrayColor"}>Treasury</p>
          <div className={"flex mt-4 gap-2 font-bold content-center text-blackColor items-center text-3xl"}>
            <Image src={SuiToken} alt={"sui token logo"} className={"h-9 w-9"} />
            <p className={"text-blackColor"}>1111</p>
            <p>SUI</p>
          </div>
        </div>
        <p className={"max-w-[280px] text-grayColor text-sm"}>
          This treasury exists for Capy DAO participants to allocate resources for the long-term growth and prosperity
          of the Capy’s project.
        </p>
      </div>
    );
  };

  const SubDAO = () => {
    const Title = () => {
      return <p className={"font-bold text-2xl"}>Sub CapyDAO</p>;
    };

    const SubDAOList = () => {
      return (
        <div className={"mt-10 flex gap-10"}>
          <div className={"flex bg-yellowColor border border-grayColor rounded-xl h-[170px] w-[256px]"}>
            <p className={"px-5 py-4 text-white font-bold text-xl z-10"}>Ear4</p>
            <Image
              src={
                "https://api-mainnet.suifrens.sui.io/suifrens/0x211a0715238cba5bd45b0910697b7c7b6058723dee4c35378b7336ccdf1304d1/svg"
              }
              alt={"capy"}
              className={"h-full z-[9]"}
              width={200}
              height={250}
            />
          </div>
          <div className={"flex bg-yellowColor border border-grayColor rounded-xl h-[170px] w-[256px]"}>
            <p className={"px-5 py-4 text-white font-bold text-xl z-10"}>Ear4</p>
            <Image
              src={
                "https://api-mainnet.suifrens.sui.io/suifrens/0x211a0715238cba5bd45b0910697b7c7b6058723dee4c35378b7336ccdf1304d1/svg"
              }
              alt={"capy"}
              className={"h-full z-[9]"}
              width={200}
              height={250}
            />
          </div>
          <div className={"flex bg-yellowColor border border-grayColor rounded-xl h-[170px] w-[256px]"}>
            <p className={"px-5 py-4 text-white font-bold text-xl z-10"}>Ear4</p>
            <Image
              src={
                "https://api-mainnet.suifrens.sui.io/suifrens/0x211a0715238cba5bd45b0910697b7c7b6058723dee4c35378b7336ccdf1304d1/svg"
              }
              alt={"capy"}
              className={"h-full z-[9]"}
              width={200}
              height={250}
            />
          </div>
        </div>
      );
    };

    return (
      <div className={"mt-10"}>
        <Title />
        <SubDAOList />
      </div>
    );
  };

  interface IProposalCard {
    title: string;
    startDate: string;
    status: boolean;
  }

  const ProposalCard = () => {
    return (
      <div
        className={
          "flex content-center items-center justify-between py-4 px-6 bg-white border border-[#595959] w-full min-h-[80px] max-h-[80px] rounded-3xl cursor-pointer"
        }
      >
        <div className={"flex gap-10 content-center items-center"}>
          <p className={"text-[#595959] text-xl font-bold"}>1</p>
          <p className={"min-w-[300px] w-1/2 text-xl font-medium"}>Proposal Name</p>
        </div>
        <div className={"flex gap-10 content-center items-center"}>
          <div className={"text-grayColor"}>Starts in 2 days</div>
          <div className={"border-yellowColor text-yellowColor rounded-xl border px-4 py-2"}>Pending</div>
        </div>
      </div>
    );
  };

  const Proposals = () => {
    return (
      <div className={"mt-10 mb-10"}>
        <div className={"flex justify-between content-center items-center"}>
          <p className={"font-bold text-2xl"}>Proposals</p>
          <button className={"bg-yellowColor text-white px-5 py-3 rounded-lg"}>
            <p className={"font-medium"}>Submit Proposal</p>
          </button>
        </div>
        <div className={"mt-10 space-y-4"}>
          <ProposalCard />
          <ProposalCard />
          <ProposalCard />
        </div>
      </div>
    );
  };

  const BradcrumbsHeader = () => {
    return (
      <nav className="flex mt-10" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/dao" className="inline-flex items-center text-sm font-medium text-[#AAAAAA] hover:text-grayColor">
              <svg
                aria-hidden="true"
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              DAOs
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">Capy DAO</span>
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
        "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 "
      )}
    >
      <BradcrumbsHeader />
      <InfoDao />
      <Treasury />
      <SubDAO />
      <Proposals />
    </main>
  );
};

export default DetailDaoAddress;
