import Link from "next/link";
import { ProposalCard } from "./ProposalCard";
import { IProposal } from "../../../types/daoInterface";

export const Proposals = ({
  daoAddress,
  proposals,
}: {
  daoAddress: string;
  proposals: IProposal[];
}) => {
  return (
    <div className={"mb-10 mt-14"}>
      <div className={"mt-10 flex content-center items-center justify-between"}>
        <p className={"text-2xl font-bold"}>Proposals</p>
        <Link href={`/dao/${daoAddress}/create-proposal`}>
          <button className={"button-primary button-shadow px-5 py-3"}>Submit Proposal</button>
        </Link>
      </div>
      <div className={"mt-10 flex flex-col gap-2 space-y-4"}>
        {proposals
          ?.map((proposal, index) => (
            <Link href={`/dao/${daoAddress}/${proposal.id}`} key={index}>
              <ProposalCard proposal={proposal} index={index + 1} />
            </Link>
          ))
          .reverse()}
      </div>
    </div>
  );
};
