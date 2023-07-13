import { TransactionBlock } from "@mysten/sui.js";
import { CAPY_TYPE, DAO_HUB_ID, ORIGIN_CAPY_DAO_ID, TEST_DAO_PACKAGE_ID } from "utils";
import { DaoType } from "types/daoInterface";

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
  dao_type,
  dao_id,
  frens_id,
  name,
  description,
  type,
  recipient,
  amount,
}: {
  dao_type: DaoType;
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

  if (recipient && amount) {
    optionRecipient = tx.moveCall({
      target: `0x1::option::some`,
      arguments: [tx.pure(recipient, "address")],
      typeArguments: ["address"], // type of frens
    });

    optionAmount = tx.moveCall({
      target: `0x1::option::some`,
      arguments: [tx.pure(amount * 1e9, "u64")],
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

  const targetModule =
    dao_type === "dao" ? "dao" : dao_type === "capy_dao" ? "suifren_dao" : "suifren_subdao";

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${targetModule}::create_proposal`,
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
  dao_type,
  subdao_id,
  proposal_id,
}: {
  dao_type: DaoType;
  subdao_id: string;
  proposal_id: string;
}) => {
  const tx = new TransactionBlock();

  const targetModule =
    dao_type === "dao" ? "dao" : dao_type === "capy_dao" ? "suifren_dao" : "suifren_subdao";

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${targetModule}::cancel_proposal`,
    arguments: [tx.pure(subdao_id), tx.pure(proposal_id), tx.pure("0x6")],
    typeArguments: [CAPY_TYPE!], // type of frens
  });

  return tx;
};

export const signTransactionVoteCapyDaoProposal = ({
  dao_type,
  subdao_id,
  frens_id,
  proposal_id,
  vote,
}: {
  dao_type: DaoType;
  subdao_id: string;
  frens_id: string;
  proposal_id: string;
  vote: number;
}) => {
  const tx = new TransactionBlock();

  const targetModule =
    dao_type === "dao" ? "dao" : dao_type === "capy_dao" ? "suifren_dao" : "suifren_subdao";

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${targetModule}::vote`,
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
  dao_type,
  subdao_id,
  proposal_id,
}: {
  dao_type: DaoType;
  subdao_id: string;
  proposal_id: string;
}) => {
  const tx = new TransactionBlock();

  const targetModule =
    dao_type === "dao" ? "dao" : dao_type === "capy_dao" ? "suifren_dao" : "suifren_subdao";

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${targetModule}::execute_proposal`,
    arguments: [tx.pure(subdao_id), tx.pure(proposal_id), tx.pure("0x6")],
    typeArguments: [CAPY_TYPE!], // type of frens
  });

  return tx;
};

// ==== Custom Dao ====

export const signTransactionCreateDao = ({
  nft,
  name,
  description,
  image,
  quorum,
  voting_delay,
  voting_period,
  type,
}: {
  nft: {
    digest: string;
    objectId: string;
    version: string;
  };
  name: string;
  description: string;
  image: string;
  quorum: number;
  voting_delay: number;
  voting_period: number;
  type: string;
}) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::dao::create_dao`,
    arguments: [
      tx.pure(DAO_HUB_ID), // staking hub
      tx.objectRef(nft),
      tx.pure(name),
      tx.pure(description),
      tx.pure(image),
      tx.pure(quorum),
      // day to ms
      tx.pure(voting_delay * 24 * 60 * 60 * 1000),
      tx.pure(voting_period * 24 * 60 * 60 * 1000),
    ],
    typeArguments: [type], // type of dao
  });

  return tx;
};

export const signTransactionDepositToTreasury = ({
  dao_type,
  dao_id,
  amount,
  type,
}: {
  dao_type: DaoType;
  dao_id: string;
  type: string;
  amount: number;
}) => {
  const tx = new TransactionBlock();

  const targetModule =
    dao_type === "dao" ? "dao" : dao_type === "capy_dao" ? "suifren_dao" : "suifren_subdao";

  const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount * 1e9, "u64")]);
  tx.moveCall({
    target: `${TEST_DAO_PACKAGE_ID}::${targetModule}::deposit_to_treasury`,
    arguments: [tx.pure(dao_id), coin],
    typeArguments: [type], // type of dao
  });

  return tx;
};

export const signTransactionCreateCustomDaoProposal = ({
  dao_id,
  nft,
  nftType,
  name,
  description,
  type,
  recipient,
  amount,
}: {
  dao_id: string;
  nft: {
    digest: string;
    objectId: string;
    version: string;
  };
  nftType: string;
  name: string;
  description: string;
  type: number;
  recipient: string | null;
  amount: number | null;
}) => {
  const tx = new TransactionBlock();

  let optionRecipient;
  let optionAmount;

  if (recipient && amount) {
    optionRecipient = tx.moveCall({
      target: `0x1::option::some`,
      arguments: [tx.pure(recipient, "address")],
      typeArguments: ["address"], // type of frens
    });

    optionAmount = tx.moveCall({
      target: `0x1::option::some`,
      arguments: [tx.pure(amount * 1e9, "u64")],
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
    target: `${TEST_DAO_PACKAGE_ID}::dao::create_proposal`,
    arguments: [
      tx.pure(dao_id),
      tx.objectRef(nft),
      tx.pure(name),
      tx.pure(description),
      tx.pure(type),
      optionRecipient,
      optionAmount,
      tx.pure("0x6"),
    ],
    typeArguments: [nftType!], // type of frens
  });

  return tx;
};
