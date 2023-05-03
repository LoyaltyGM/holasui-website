import { TransactionBlock } from "@mysten/sui.js";
import { PACKAGE_ID, TRIP_HUB_ID } from "utils/constants";

// start sleep
export const signTransactionStartSleep = (suigotchi_address: string) => {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${PACKAGE_ID}::trip::start_sleep`,
    arguments: [
      tx.pure(suigotchi_address), // suigotchi address
      tx.pure(TRIP_HUB_ID), // trip hub
      tx.pure("0x6"), // timer
    ]
  });

  return tx;
};

export const signTransactionEndSleep = (sleep_ticket_address: string) => {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${PACKAGE_ID}::trip::end_sleep`,
      arguments: [
        tx.pure(sleep_ticket_address), // suigotchi address
        tx.pure(TRIP_HUB_ID), // trip hub
        tx.pure("0x6"), // timer
        
      ]
    });
  
    return tx;
  };
  

