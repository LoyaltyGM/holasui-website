import Link from "next/link";
import { ProposalCard } from "./ProposalCard";
import { IProposal } from "types/daoInterface";

export const Proposals = ({
  daoAddress,
  proposals,
}: {
  daoAddress: string;
  proposals: IProposal[];
}) => {
  const TextWhenNoProposals = () => {
    return (
      <div
        className={
          "text-grayColor text-center text-lg font-normal flex justify-center content-center items-center h-36"
        }
      >
        There are no proposals yet
        <br /> Be the first and open a voting in the DAO
      </div>
    );
  };

  return (
    <div className={"mb-10 mt-14"}>
      <div className={"mt-10 flex content-center items-center justify-between"}>
        <p className={"text-2xl font-bold"}>Proposals</p>
        <Link href={`/dao/${daoAddress}/create-proposal`}>
          <button className={"button-primary button-shadow px-5 py-3"}>Submit Proposal</button>
        </Link>
      </div>
      <div className={"mt-10 flex flex-col gap-2 space-y-4"}>
        {proposals?.length > 0 ? (
          proposals
            .map((proposal, index) => (
              <Link href={`/dao/${daoAddress}/proposals/${proposal.id}`} key={index}>
                <ProposalCard proposal={proposal} index={index + 1} />
              </Link>
            ))
            .reverse()
        ) : (
          <TextWhenNoProposals />
        )}
      </div>
    </div>
  );
};
