import { TransactionBlock } from "@mysten/sui.js";
import { PACKAGE_ID, STAKING_HUB_ID, STAKING_POOL_FRENS_ID, FRENS_TYPE, PRICE_STACKED, PRICE_UNSTACKED } from "utils/constants";

// start sleep
export const signTransactionStartStaking = (frens_id: string) => {
  const tx = new TransactionBlock();
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(PRICE_STACKED! * 1e9, "u64")]);
  
  tx.moveCall({
    target: `${PACKAGE_ID}::staking::stake`,
    arguments: [
      tx.pure(frens_id), // frens nft address
      tx.pure(STAKING_HUB_ID), // staking hub
      tx.pure(STAKING_POOL_FRENS_ID), // staking pool
      coin,
      tx.pure("0x6"), // time
    ],
    typeArguments: [FRENS_TYPE!], // type of frens
  });

  return tx;
};

export const singTransactionsToBatchStartStaking = (frens_ids: string[]) => {
  // Procure a list of some Sui transfers to make:
  const txb = new TransactionBlock();
  const coin = txb.splitCoins(txb.gas, frens_ids.map((_) => txb.pure(PRICE_STACKED! * 1e9, "u64")));
  // First, split the gas coin into multiple coins:
  frens_ids.forEach((frens_id, index) => {
    txb.moveCall({
      target: `${PACKAGE_ID}::staking::stake`,
      arguments: [
        txb.object(frens_id), // frens nft address
        txb.object(STAKING_HUB_ID!), // staking hub
        txb.object(STAKING_POOL_FRENS_ID!), // staking pool
        coin[index],
        txb.object("0x6"), // time
      ],
      typeArguments: [FRENS_TYPE!], // type of frens
    });
  });  
  return txb;
}

export const signTransactionEndStaking = (stacked_ticket_address: string) => {
    const tx = new TransactionBlock();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(PRICE_UNSTACKED! * 1e9, "u64")]);
    tx.moveCall({
      target: `${PACKAGE_ID}::staking::unstake`,
      arguments: [
        tx.pure(stacked_ticket_address), // stake nft address
        tx.pure(STAKING_HUB_ID), // staking hub
        tx.pure(STAKING_POOL_FRENS_ID), // staking pool
        coin,
        tx.pure("0x6"), // time
      ],
      typeArguments: [FRENS_TYPE!], // type of frens
    });
  
    return tx;
};

export const singTransactionsToBatchUnstaking = (unstaked_frens_ids: string[]) => {
  // Procure a list of some Sui transfers to make:
  const txb = new TransactionBlock();
  const coin = txb.splitCoins(txb.gas, unstaked_frens_ids.map((_) => txb.pure(PRICE_UNSTACKED! * 1e9, "u64")));
  // First, split the gas coin into multiple coins:
  unstaked_frens_ids.forEach((frens_id, index) => {
    txb.moveCall({
      target: `${PACKAGE_ID}::staking::unstake`,
      arguments: [
        txb.object(frens_id), // frens nft address
        txb.object(STAKING_HUB_ID!), // staking hub
        txb.object(STAKING_POOL_FRENS_ID!), // staking pool
        coin[index],
        txb.object("0x6"), // time
      ],
      typeArguments: [FRENS_TYPE!], // type of frens
    });
  });  
  return txb;
}
  

