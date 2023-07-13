import { TransactionBlock } from "@mysten/sui.js";
import { ESCROW_HUB_ID, SUIFREN_CAPY_TYPE, PACKAGE_ID_ESCROW, PRICE_ESCROW } from "utils";

export const signTransactionCreateEscrow = ({
  creator_objects,
  creator_coin_amount,
  recipient,
  recipient_object_ids,
  recipient_coin_amount,
  type_swap,
}: {
  creator_objects: string[];
  creator_coin_amount: number;
  recipient: string;
  recipient_object_ids: string[];
  recipient_coin_amount: number;
  type_swap: string;
}) => {
  const tx = new TransactionBlock();

  const [coin] = tx.splitCoins(tx.gas, [tx.pure(creator_coin_amount * 1e9, "u64")]);

  tx.moveCall({
    target: `${PACKAGE_ID_ESCROW}::escrow::create`,
    arguments: [
      tx.pure(ESCROW_HUB_ID),
      tx.makeMoveVec({
        type: type_swap,
        objects: creator_objects.map((creator_object_id) => tx.pure(creator_object_id)),
      }),
      coin,
      tx.pure(recipient),
      tx.pure(recipient_object_ids),
      tx.pure(recipient_coin_amount * 1e9),
    ],
    typeArguments: [type_swap],
  });

  return tx;
};

export const signTransactionCancelEscrow = (offerId: string, type_swap: string) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID_ESCROW}::escrow::cancel`,
    arguments: [tx.pure(ESCROW_HUB_ID), tx.object(offerId)],
    typeArguments: [type_swap],
  });

  return tx;
};

export const signTransactionExchangeEscrow = ({
  escrowId,
  recipient_objects,
  recipient_coin_amount,
  type_swap,
}: {
  escrowId: string;
  recipient_objects: string[];
  recipient_coin_amount: number;
  type_swap: string;
}) => {
  const tx = new TransactionBlock();

  const [coin] = tx.splitCoins(tx.gas, [tx.pure(recipient_coin_amount * 1e9, "u64")]);
  const [feeCoin] = tx.splitCoins(tx.gas, [tx.pure(PRICE_ESCROW * 1e9, "u64")]);

  tx.moveCall({
    target: `${PACKAGE_ID_ESCROW}::escrow::exchange`,
    arguments: [
      tx.object(ESCROW_HUB_ID),
      feeCoin,
      tx.pure(escrowId),
      tx.makeMoveVec({
        type: type_swap,
        objects: recipient_objects.map((recipient_object_id) => tx.pure(recipient_object_id)),
      }),
      coin,
    ],
    typeArguments: [type_swap],
  });

  return tx;
};
