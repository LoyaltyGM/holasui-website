import { GetServerSideProps, NextPage } from "next";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet } from "components";
import { classNames } from "utils";
import { useRef, useState } from "react";
import Image from "next/image";
import SuiToken from "/public/img/SuiToken.png";
import Link from "next/link";

interface IProposalProps {
  proposal: string;
}

export const getServerSideProps: GetServerSideProps<IProposalProps> = async ({ params }) => {
  try {
    const proposal = params?.proposal as string;

    return {
      props: {
        proposal,
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

const ProposalPage: NextPage<IProposalProps> = ({ proposal }) => {
  const { status, wallet } = ethos.useWallet();

  const BradcrumbsHeader = () => {
    return (
      <nav className="flex mt-10" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/dao"
              className="inline-flex items-center text-sm font-medium text-grayColor hover:text-black2Color"
            >
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
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-300 md:ml-2">Capy DAO</span>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-300 md:ml-2">Proposal</span>
            </div>
          </li>
        </ol>
      </nav>
    );
  };
  const ProposalTitle = () => {
    return <div className={"font-medium mt-16 mb-4 text-grayColor"}>Proposal 1</div>;
  };

  const ProposalInfo = () => {
    return (
      <div className={"flex justify-between mb-10"}>
        <p className={"text-4xl font-bold text-blackColor"}>Proposal name</p>
        <div
          className={
            "py-1 px-5 content-center items-center flex border rounded-xl border-purpleColor text-purpleColor"
          }
        >
          Active
        </div>
      </div>
    );
  };

  const VotingCards = () => {
    return (
      <div className={"w-full flex justify-between"}>
        <div
          className={"h-[330px] w-[300px] px-6 py-4 border border-black2Color rounded-3xl bg-white"}
        >
          <div className={"flex justify-between text-lg"}>
            <p className={"text-greenColor font-medium"}>For</p>
            <p className={"font-semibold text-blackColor"}>123</p>
          </div>
          <div className={"mt-4 w-full bg-[#F2F2F2] h-[10px] rounded-2xl"}>
            <div className={"mt-4 w-[150px] bg-greenColor h-[10px] rounded-2xl"}></div>
          </div>
        </div>
        <div className={"h-[330px] w-[300px] border border-black2Color rounded-3xl bg-white"}></div>
        <div className={"h-[330px] w-[300px] border border-black2Color rounded-3xl bg-white"}></div>
      </div>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <main
      className={classNames(
        "flex min-h-[100vh] md:min-h-[65vh] max-w-5xl flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 ",
      )}
    >
      <BradcrumbsHeader />
      <ProposalTitle />
      <ProposalInfo />
      <VotingCards />
    </main>
  );
};

export default ProposalPage;
