import { IProposal } from "types/daoInterface";
import {
  DAO_PROPOSAL_STATUS_ACTIVE,
  DAO_PROPOSAL_STATUS_CANCELED,
  DAO_PROPOSAL_STATUS_DEFEATED,
  DAO_PROPOSAL_STATUS_EXECUTED,
  DAO_PROPOSAL_STATUS_PENDING,
} from "utils";
import classNames from "classnames";

export const ProposalCard = ({
  proposal,
  index,
}: {
  proposal: IProposal;
  index: string | number;
}) => {
  return (
    <div
      className={
        "proposal-card proposal-card-shadow flex max-h-[80px] min-h-[80px] w-full cursor-pointer content-center items-center justify-between rounded-3xl border border-[#595959] bg-white px-6 py-4"
      }
    >
      <div className={"flex content-center items-center gap-10"}>
        <p className={"text-xl font-bold text-black2Color"}>{index}</p>
        <p className={"w-1/2 md:min-w-[300px] text-xl font-medium"}>{proposal.name}</p>
      </div>
      <div className={"flex content-center items-center gap-10"}>
        <DateTimeBadge proposal={proposal} />
        <BadgeStatus status={Number(proposal.status)} />
      </div>
    </div>
  );
};

const DateTimeBadge = ({ proposal }: { proposal: IProposal }) => {
  const status = Number(proposal.status);
  const date =
    status === DAO_PROPOSAL_STATUS_ACTIVE
      ? daysUntil(Number(proposal.end_time))
      : daysUntil(Number(proposal.start_time));
  return (
    <div className={"hidden md:flex text-black2Color"}>
      {status !== undefined && status !== null && status === DAO_PROPOSAL_STATUS_ACTIVE
        ? date
        : status === DAO_PROPOSAL_STATUS_CANCELED ||
          status === DAO_PROPOSAL_STATUS_DEFEATED ||
          status === DAO_PROPOSAL_STATUS_EXECUTED
        ? ""
        : date}
    </div>
  );
};

function daysUntil(date: number) {
  const now = new Date().getTime();
  const futureDate = new Date(date).getTime();
  const diffInTime = futureDate - now;
  const diffInDays = Math.ceil(diffInTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

  if (diffInDays < 0) {
    return "The date has already passed!";
  } else if (diffInDays === 0) {
    return "It's today!";
  } else {
    return `${diffInDays} days left`;
  }
}

const BadgeStatus = ({ status }: { status: number }) => {
  return (
    <div
      className={classNames(
        "rounded-xl border px-4 py-2 text-center text-sm",
        status !== undefined && status !== null && status === DAO_PROPOSAL_STATUS_ACTIVE
          ? "border-purpleColor text-purpleColor"
          : status === DAO_PROPOSAL_STATUS_PENDING
          ? "border-grayColor text-grayColor"
          : status === DAO_PROPOSAL_STATUS_CANCELED
          ? "border-redColor text-redColor"
          : status === DAO_PROPOSAL_STATUS_DEFEATED
          ? "border-orangeColor text-orangeColor"
          : status === DAO_PROPOSAL_STATUS_EXECUTED
          ? "border-greenColor text-greenColor"
          : "border-yellowColor text-yellowColor",
      )}
    >
      {status !== undefined && status !== null && status === DAO_PROPOSAL_STATUS_ACTIVE
        ? "Active"
        : status === DAO_PROPOSAL_STATUS_CANCELED
        ? "Canceled"
        : status === DAO_PROPOSAL_STATUS_DEFEATED
        ? "Defeated"
        : status === DAO_PROPOSAL_STATUS_EXECUTED
        ? "Executed"
        : "Pending"}
    </div>
  );
};
