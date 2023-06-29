import { GetServerSideProps, NextPage } from "next";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { AlertErrorMessage, Label, NoConnectWallet } from "components";
import { classNames, formatSuiAddress } from "utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FolderIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { IProposal } from "types/daoInterface";
import { fetchCapyStaking, signTransactionVoteCapyDaoProposal, suiProvider } from "services/sui";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { useForm } from "react-hook-form";
import { RadioGroup } from "@headlessui/react";
import toast from "react-hot-toast";
import { ICapy } from "types";

interface IProposalProps {
  proposalId: string;
}

type Inputs = {
  vote: string;
};

const voteTypes = ["For", "Against", "Abstain"];

export const getServerSideProps: GetServerSideProps<IProposalProps> = async ({ params }) => {
  try {
    const proposalId = params?.proposal as string;

    return {
      props: {
        proposalId,
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

const ProposalPage: NextPage<IProposalProps> = ({ proposalId }) => {
  const router = useRouter();
  const originDaoAddress = router.query.daoAddress as string;

  const { status, wallet } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

  const [frens, setFrens] = useState<ICapy[] | null>();
  const [proposal, setProposal] = useState<IProposal>();
  const { setValue, handleSubmit, watch } = useForm<Inputs>({
    defaultValues: {
      vote: voteTypes[0],
    },
  });

  useEffect(() => {
    async function fetchProposal() {
      try {
        const proposal = getObjectFields(
          await suiProvider.getObject({
            id: proposalId,
            options: {
              showContent: true,
            },
          }),
        )!;

        proposal.status = +proposal.status;
        proposal.type = +proposal.type;
        proposal.end_time = +proposal.end_time;
        proposal.start_time = +proposal.start_time;

        // let results: any;

        proposal.results.fields.contents.map((field: any) => {
          // 1: For, 2: Against, 0: Abstain
          const voteType = field?.fields?.key;
          const value = field?.fields?.value;

          if (voteType === "1") {
            proposal.results.for = +value;
          } else if (voteType === "2") {
            proposal.results.against = +value;
          } else if (voteType === "0") {
            proposal.results.abstain = +value;
          }
        });

        // console.log();
        setProposal(proposal as IProposal);
      } catch (e) {
        console.error(e);
      }
    }

    fetchProposal().then();
  }, []);

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        setFrens(null);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const fetchedFrens = fetchCapyStaking(nfts);
        if (fetchedFrens && fetchedFrens.length > 0) {
          setFrens(fetchedFrens);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchWalletFrens().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

  const onSubmit = async (form: Inputs) => {
    if (!wallet) return;
    setWaitSui(true);
    try {
      console.log(form);

      if (!frens || frens.length === 0) {
        toast.error("You don't have Capy Fren");
        return;
      }
      const requiredFren = frens[0];

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionVoteCapyDaoProposal({
          isSubDao: false,
          subdao_id: originDaoAddress,
          frens_id: requiredFren.id,
          proposal_id: proposalId,
          vote: form.vote === "For" ? 1 : form.vote === "Against" ? 2 : 0,
        }),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        toast.success("Voted successfully");
        // router.push(`/dao/${originDaoAddress}`).then();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
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
            <div className="flex items-center text-grayColor">
              <p className={"font-semibold text-grayColor md:ml-2 md:mr-2"}>/</p>
              <FolderIcon className={"mr-1.5 h-4 w-4"} />
              <span className="text-sm font-medium">{formatSuiAddress(originDaoAddress)}</span>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <p className={"font-semibold text-grayColor md:ml-2 md:mr-2"}>/</p>
              <FolderIcon className={"mr-1.5 h-4 w-4 text-black2Color"} />
              <span className="text-sm font-medium text-black2Color">{proposal?.name}</span>
            </div>
          </li>
        </ol>
      </nav>
    );
  };

  const ProposalInfo = () => {
    return (
      <div className={"mb-10 mt-16 flex justify-between"}>
        <p className={"text-4xl font-bold text-blackColor"}>{proposal?.name}</p>
        <div
          className={
            "flex content-center items-center rounded-xl border border-purpleColor px-5 py-1 text-purpleColor"
          }
        >
          {proposal?.status === 0
            ? "Active"
            : proposal?.status === 1
            ? "Canceled"
            : proposal?.status === 2
            ? "Defeated"
            : "Executed"}
        </div>
      </div>
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
          <div className={"flex justify-between text-lg"}>
            <p className={"font-medium text-redColor"}>For</p>
            <p className={"font-semibold text-blackColor"}>{proposal?.results?.for || 0}</p>
          </div>
          <div className={"mt-4 h-[10px] w-full rounded-2xl bg-[#F2F2F2]"}>
            <div className={"mt-4 h-[10px] w-[150px] rounded-2xl bg-greenColor"}></div>
          </div>
          <VotingUsers />
        </div>
        <div
          className={"h-[330px] w-[300px] rounded-3xl border border-black2Color bg-white px-6 py-4"}
        >
          <div className={"flex justify-between text-lg"}>
            <p className={"font-medium text-redColor"}>Against</p>
            <p className={"font-semibold text-blackColor"}>{proposal?.results?.against || 0}</p>
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
            <p className={"font-semibold text-blackColor"}>{proposal?.results?.abstain || 0}</p>
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
    const StartDate = () => {
      const [date, setDate] = useState<Date>();

      useEffect(() => {
        if (!proposal || !proposal?.start_time) return;

        setDate(new Date(proposal?.start_time));
      }, [proposal]);

      return (
        <div
          className={
            "flex h-[70px] w-full flex-col justify-between rounded-2xl border-2 border-grayColor bg-white px-4 py-2"
          }
        >
          <div className={"flex"}>
            <p className={"w-full font-medium text-grayColor"}>Starting</p>
            <p className={"flex w-2/3 justify-end font-semibold text-blackColor"}>
              {date?.toLocaleDateString()}
            </p>
          </div>
          <div className={"flex justify-end"}>
            <p className={"text-grayColor"}>{date?.toLocaleTimeString()}</p>
          </div>
        </div>
      );
    };

    const EndDate = () => {
      const [date, setDate] = useState<Date>();

      useEffect(() => {
        if (!proposal || !proposal?.end_time) return;

        setDate(new Date(proposal?.end_time));
      }, [proposal]);

      return (
        <div
          className={
            "flex h-[70px] w-full flex-col justify-between rounded-2xl border-2 border-grayColor bg-white px-4 py-2"
          }
        >
          <div className={"flex"}>
            <p className={"w-full font-medium text-grayColor"}>Ending</p>
            <p className={"flex w-2/3 justify-end font-semibold text-blackColor"}>
              {date?.toLocaleDateString()}
            </p>
          </div>
          <div className={"flex justify-end"}>
            <p className={"text-grayColor"}>{date?.toLocaleTimeString()}</p>
          </div>
        </div>
      );
    };
    return (
      <div className={"mt-8 flex w-full gap-4"}>
        <Threshold />
        <StartDate />
        <EndDate />
      </div>
    );
  };

  const VotingButtons = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className={"mt-16"}>
        <div className={"flex justify-between"}>
          <Label label={"Voting"} />
          <button
            type={"submit"}
            disabled={waitSui}
            className={"pinkColor-primary-state rounded-2xl px-3 py-2 font-bold md:px-6"}
          >
            Vote
          </button>
        </div>
        <RadioGroup
          value={watch("vote")}
          onChange={(value) => {
            setValue("vote", value);
          }}
          className="mt-2"
        >
          <div className="flex flex-col gap-3 sm:grid-cols-6">
            {voteTypes.map((vote) => (
              <RadioGroup.Option
                key={vote}
                value={vote}
                className={({ checked }) =>
                  classNames(
                    checked
                      ? "bg-pinkColor text-white"
                      : "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                    "flex cursor-pointer items-center justify-center rounded-xl px-3 py-3 text-sm font-semibold uppercase sm:flex-1",
                  )
                }
              >
                <RadioGroup.Label as="span">{vote}</RadioGroup.Label>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </form>
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
