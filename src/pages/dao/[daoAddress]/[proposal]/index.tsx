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
      <nav className="mt-10 flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/dao"
              className="inline-flex items-center text-sm font-medium text-grayColor hover:text-black2Color"
            >
              <svg
                aria-hidden="true"
                className="mr-2 h-4 w-4"
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
    return <div className={"mb-4 mt-16 font-medium text-grayColor"}>Proposal 1</div>;
  };

  const ProposalInfo = () => {
    return (
      <div className={"mb-10 flex justify-between"}>
        <p className={"text-4xl font-bold text-blackColor"}>Proposal name</p>
        <div
          className={
            "flex content-center items-center rounded-xl border border-purpleColor px-5 py-1 text-purpleColor"
          }
        >
          Active
        </div>
      </div>
    );
  };

  const VotingTitle = () => {
    return (
      <>
        <div className={"flex justify-between text-lg"}>
          <p className={"font-medium text-greenColor"}>For</p>
          <p className={"font-semibold text-blackColor"}>123</p>
        </div>
        <div className={"mt-4 h-[10px] w-full rounded-2xl bg-[#F2F2F2]"}>
          <div className={"mt-4 h-[10px] w-[150px] rounded-2xl bg-greenColor"}></div>
        </div>
      </>
    );
  };
  const users = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
  const VotingUsers = () => {
    return (
      <div className={"my-4 grid grid-cols-4 grid-rows-4 place-items-center"}>
        {users.map(() => (
          <Image
            src={
              "https://api-mainnet.suifrens.sui.io/suifrens/0x786be7f41c0cccc7c7e2a61044b34c3b4d4cd31a1c444948ef2011161f7ba927/svg"
            }
            alt={"voting user"}
            width={45}
            height={45}
            className={"mt-2 rounded-full border-2 object-cover"}
          />
        ))}
      </div>
    );
  };

  const VotingCards = () => {
    return (
      <div className={"flex w-full justify-between"}>
        <div
          className={"h-[330px] w-[300px] rounded-3xl border border-black2Color bg-white px-6 py-4"}
        >
          <VotingTitle />
          <VotingUsers />
        </div>
        <div
          className={"h-[330px] w-[300px] rounded-3xl border border-black2Color bg-white px-6 py-4"}
        >
          <div className={"flex justify-between text-lg"}>
            <p className={"font-medium text-redColor"}>Against</p>
            <p className={"font-semibold text-blackColor"}>123</p>
          </div>
          <div className={"mt-4 h-[10px] w-full rounded-2xl bg-[#F2F2F2]"}>
            <div className={"mt-4 h-[10px] w-[150px] rounded-2xl bg-redColor"}></div>
          </div>
          <VotingUsers />
        </div>
        <div
          className={"h-[330px] w-[300px] rounded-3xl border border-black2Color bg-white px-6 py-4"}
        >
          <div className={"flex justify-between text-lg"}>
            <p className={"font-medium text-black2Color"}>Abstain</p>
            <p className={"font-semibold text-blackColor"}>123</p>
          </div>
          <div className={"mt-4 h-[10px] w-full rounded-2xl bg-[#F2F2F2]"}>
            <div className={"mt-4 h-[10px] w-[150px] rounded-2xl bg-black2Color"}></div>
          </div>
          <VotingUsers />
        </div>
      </div>
    );
  };

  const ProposalSettingsInfo = () => {
    const Threshold = () => {
      return (
        <div
          className={
            "flex h-[70px] w-full justify-between rounded-2xl border-2 border-grayColor bg-white px-4 py-2"
          }
        >
          <p className={"font-medium text-grayColor"}>Threshold</p>
          <p className={"font-semibold text-blackColor"}>200 Votes</p>
        </div>
      );
    };
    const EndDate = () => {
      return (
        <div
          className={
            "flex h-[70px] w-full flex-col justify-between rounded-2xl border-2 border-grayColor bg-white px-4 py-2"
          }
        >
          <div className={"flex"}>
            <p className={"w-full font-medium text-grayColor"}>Ending</p>
            <p className={"flex w-2/3 justify-end font-semibold text-blackColor"}>July 1, 2023</p>
          </div>
          <div className={"flex justify-end"}>
            <p className={"text-grayColor"}>10:00 AM</p>
          </div>
        </div>
      );
    };
    return (
      <div className={"mt-8 flex w-full gap-4"}>
        <Threshold />
        <EndDate />
      </div>
    );
  };

  const VotingButtons = () => {
    const [active, setActive] = useState<Number | null>(null);

    return (
      <div className={"mt-16"}>
        <div className={"flex justify-between"}>
          <p className={"text-4xl font-bold text-blackColor"}>Voting</p>
          <button
            className={"rounded-xl bg-pinkColor px-12 py-2 text-white disabled:bg-grayColor"}
            disabled={active === null}
          >
            Vote
          </button>
        </div>
        <div className={"mt-10"}>
          <button
            className={classNames(
              "mb-3 flex max-h-[55px] min-h-[55px] w-full content-center items-center justify-start gap-10 rounded-xl border bg-white pl-6",
              active === 0 ? "border-2 border-yellowColor" : "border-black2Color",
            )}
            onClick={() => setActive(0)}
          >
            <p>1</p>
            <p>For</p>
          </button>
          <button
            className={classNames(
              "mb-3 flex max-h-[55px] min-h-[55px] w-full content-center items-center justify-start gap-10 rounded-xl border bg-white pl-6",
              active === 1 ? "border-2 border-yellowColor" : "border-black2Color",
            )}
            onClick={() => setActive(1)}
          >
            <p>2</p>
            <p>Against</p>
          </button>
          <button
            className={classNames(
              "mb-3 flex max-h-[55px] min-h-[55px] w-full content-center items-center justify-start gap-10 rounded-xl border  bg-white pl-6",
              active === 2 ? "border-2 border-yellowColor" : "border-black2Color",
            )}
            onClick={() => setActive(2)}
          >
            <p>3</p>
            <p>Abstain</p>
          </button>
        </div>
      </div>
    );
  };

  const ProposedTransactions = () => {
    return (
      <div className={"mt-14"}>
        <p className={"text-2xl font-bold text-blackColor"}>Proposed transactions</p>
        <div className={"flex"}></div>
      </div>
    );
  };

  const ProposalDescription = () => {
    return <div></div>;
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <div className={"w-full content-center items-center justify-center md:pl-16 md:pr-10 "}>
      <main
        className={classNames(
          "mt-18 z-10 flex min-h-[100vh] max-w-6xl flex-col justify-center rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] ",
        )}
      >
        <BradcrumbsHeader />
        <ProposalTitle />
        <ProposalInfo />
        <VotingCards />
        <ProposalSettingsInfo />
        <VotingButtons />
        <ProposedTransactions />
        <ProposalDescription />
      </main>
    </div>
  );
};

export default ProposalPage;
