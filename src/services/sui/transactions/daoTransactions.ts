import { TransactionBlock } from "@mysten/sui.js";
import { CAPY_TYPE, ORIGIN_CAPY_DAO_ID, TEST_DAO_PACKAGE_ID } from "utils";

// ==== CapyDao ====

export const signTransactionCreateCapySubDao = ({
  frens_id,
  birth_location,
  name,
  description,
  image,
  quorum,
  voting_delay,
  voting_period,
}: {
  frens_id: string;
  birth_location: string;
  name: string;
  description: string;
  image: string;
  quorum: number;
  voting_delay: number;
  voting_period: number;
}) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::suifren_subdao::create_subdao`,
    arguments: [
      tx.pure(ORIGIN_CAPY_DAO_ID), // staking hub
      tx.pure(frens_id),
      tx.pure(birth_location),
      tx.pure(name),
      tx.pure(description),
      tx.pure(image),
      tx.pure(quorum),
      // day to ms
      tx.pure(voting_delay * 24 * 60 * 60 * 1000),
      tx.pure(voting_period * 24 * 60 * 60 * 1000),
    ],
    typeArguments: [CAPY_TYPE!], // type of frens
  });

  return tx;
};

export const signTransactionCreateCapyDaoProposal = ({
  isSubDao,
  dao_id,
  frens_id,
  name,
  description,
  type,
  recipient,
  amount,
}: {
  isSubDao: boolean;
  dao_id: string;
  frens_id: string;
  name: string;
  description: string;
  type: number;
  recipient: string | null;
  amount: number | null;
}) => {
  const tx = new TransactionBlock();

  let optionRecipient;
  let optionAmount;
  console.log(recipient, amount);
  if (recipient && amount) {
    optionRecipient = tx.moveCall({
      target: `0x1::option::some`,
      arguments: [tx.pure(recipient, 'address')],
      typeArguments: ["address"], // type of frens
    });

    optionAmount = tx.moveCall({
      target: `0x1::option::some`,
      arguments: [tx.pure(amount * 1e9, 'u64')],
      typeArguments: ["u64"], // type of frens
    });
  } else {
    optionRecipient = tx.moveCall({
      target: `0x1::option::none`,
      arguments: [],
      typeArguments: ["address"], // type of frens
    });

    optionAmount = tx.moveCall({
      target: `0x1::option::none`,
      arguments: [],
      typeArguments: ["u64"], // type of frens
    });
  }

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${
      isSubDao ? "suifren_subdao" : "suifren_dao"
    }::create_proposal`,
    arguments: [
      tx.pure(dao_id),
      tx.pure(frens_id),
      tx.pure(name),
      tx.pure(description),
      tx.pure(type),
      optionRecipient,
      optionAmount,
      tx.pure("0x6"),
    ],
    typeArguments: [CAPY_TYPE!], // type of frens
  });

  return tx;
};

export const signTransactionCancelCapyDaoProposal = ({
  isSubDao,
  subdao_id,
  proposal_id,
}: {
  isSubDao: boolean;
  subdao_id: string;
  proposal_id: string;
}) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${
      isSubDao ? "suifren_subdao" : "suifren_dao"
    }::cancel_proposal`,
    arguments: [tx.pure(subdao_id), tx.pure(proposal_id), tx.pure("0x6")],
    typeArguments: [CAPY_TYPE!], // type of frens
  });

  return tx;
};

export const signTransactionVoteCapyDaoProposal = ({
  isSubDao,
  subdao_id,
  frens_id,
  proposal_id,
  vote,
}: {
  isSubDao: boolean;
  subdao_id: string;
  frens_id: string;
  proposal_id: string;
  vote: number;
}) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${isSubDao ? "suifren_subdao" : "suifren_dao"}::vote`,
    arguments: [
      tx.pure(subdao_id),
      tx.pure(frens_id),
      tx.pure(proposal_id),
      tx.pure(vote),
      tx.pure("0x6"),
    ],
    typeArguments: [CAPY_TYPE!], // type of frens
  });

  return tx;
};

export const signTransactionExecuteCapyDaoProposal = ({
  isSubDao,
  subdao_id,
  proposal_id,
}: {
  isSubDao: boolean;
  subdao_id: string;
  proposal_id: string;
}) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${
      isSubDao ? "suifren_subdao" : "suifren_dao"
    }::execute_proposal`,
    arguments: [tx.pure(subdao_id), tx.pure(proposal_id), tx.pure("0x6")],
    typeArguments: [CAPY_TYPE!], // type of frens
  });

  return tx;
};
