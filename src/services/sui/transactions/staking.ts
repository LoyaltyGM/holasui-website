import { TransactionBlock } from "@mysten/sui.js";
import { PACKAGE_ID, STAKING_HUB_ID, STAKING_POOL_FRENS_ID, FRENS_TYPE, PRICE_STACKED, PRICE_UNSTACKED } from "utils/constants";

// start sleep
export const signTransactionStartStaking = (frens_id: string) => {
  console.log(frens_id, STAKING_HUB_ID, STAKING_POOL_FRENS_ID)
  console.log(PACKAGE_ID)
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
  

