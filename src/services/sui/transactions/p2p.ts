import { TransactionBlock } from "@mysten/sui.js";
import { ESCROW_HUB_ID, FRENS_TYPE, PACKAGE_ID_TEST_ESCROW, PRICE_ESCROW } from "utils";

export const signTransactionCreateOffer = ({
  creator_object_ids,
  creator_coin_amount,
  recipient,
  recipient_object_ids,
  recipient_coin_amount,
  //
  creator_objects,
}: {
  creator_object_ids: string[];
  creator_coin_amount: number;
  recipient: string;
  recipient_object_ids: string[];
  recipient_coin_amount: number;
  //
  creator_objects: string[];
}) => {
  const tx = new TransactionBlock();

  console.log("escrow::create");
  let offer = tx.moveCall({
    target: `${PACKAGE_ID_TEST_ESCROW}::escrow::create`,
    arguments: [
      // tx.makeMoveVec({
      //   // type: "ID",
      //   objects: creator_object_ids.map((creator_object_id) => tx.pure(creator_object_id, "Id")),
      // }),
      tx.pure(creator_object_ids),
      tx.pure(creator_coin_amount * 1e9),
      tx.pure(recipient),
      // tx.makeMoveVec({
      //   // type: "ID",
      //   objects: recipient_object_ids.map((recipient_object_id) => tx.pure(recipient_object_id, "Id")),
      // }),
      tx.pure(recipient_object_ids),
      tx.pure(recipient_coin_amount * 1e9),
    ],
    typeArguments: [FRENS_TYPE],
  });

  console.log("escrow::update_creator_objects");
  creator_objects.forEach((creator_object) => {
    offer = tx.moveCall({
      target: `${PACKAGE_ID_TEST_ESCROW}::escrow::update_creator_objects`,
      arguments: [offer, tx.pure(creator_object)],
      typeArguments: [FRENS_TYPE],
    });
  });

  if (creator_coin_amount > 0) {
    console.log("splitCoins");
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(creator_coin_amount * 1e9, "u64")]);
    console.log("escrow::update_creator_coin");
    offer = tx.moveCall({
      target: `${PACKAGE_ID_TEST_ESCROW}::escrow::update_creator_coin`,
      arguments: [offer, coin],
      typeArguments: [FRENS_TYPE],
    });
  }

  console.log("escrow::share_offer");

  tx.moveCall({
    target: `${PACKAGE_ID_TEST_ESCROW}::escrow::share_offer`,
    arguments: [tx.object(ESCROW_HUB_ID), offer],
    typeArguments: [FRENS_TYPE],
  });

  return tx;
};

export const signTransactionCreatorCancelOffer = (offerId: string) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID_TEST_ESCROW}::escrow::cancel_creator_offer`,
    arguments: [tx.object(offerId)],
    typeArguments: [FRENS_TYPE],
  });

  return tx;
};

export const signTransactionAcceptOffer = ({
  offerId,
  recipient_coin_amount,
  //
  recipient_objects,
}: {
  offerId: string;
  recipient_coin_amount: number;
  //
  recipient_objects: string[];
}) => {
  const tx = new TransactionBlock();

  recipient_objects.forEach((recipient_object) => {
    tx.moveCall({
      target: `${PACKAGE_ID_TEST_ESCROW}::escrow::update_recipient_objects`,
      arguments: [tx.object(ESCROW_HUB_ID), tx.object(offerId), tx.object(recipient_object)],
      typeArguments: [FRENS_TYPE],
    });
  });

  if (recipient_coin_amount > 0) {
    const [recipientCoin] = tx.splitCoins(tx.gas, [tx.pure(recipient_coin_amount * 1e9, "u64")]);
    tx.moveCall({
      target: `${PACKAGE_ID_TEST_ESCROW}::escrow::update_recipient_coin`,
      arguments: [tx.object(ESCROW_HUB_ID), tx.object(offerId), recipientCoin],
      typeArguments: [FRENS_TYPE],
    });
  }
  
  const [feeCoin] = tx.splitCoins(tx.gas, [tx.pure(0.1 * 1e9, "u64")]);
  tx.moveCall({
    target: `${PACKAGE_ID_TEST_ESCROW}::escrow::exchange`,
    arguments: [tx.object(ESCROW_HUB_ID), tx.object(offerId), feeCoin],
    typeArguments: [FRENS_TYPE],
  });

  return tx;
};

export const signTransactionRecipientCancelOffer = (offerId: string) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${PACKAGE_ID_TEST_ESCROW}::escrow::cancel_recipient_offer`,
    arguments: [tx.object(ESCROW_HUB_ID), tx.object(offerId)],
    typeArguments: [FRENS_TYPE],
  });

  return tx;
};
