export const PACKAGE_ID = process.env.NEXT_PUBLIC_STAKING_PACKAGE_ID;
export const STAKING_HUB_ID = process.env.NEXT_PUBLIC_STAKING_HUB_ID;

// FRENS STAKING POOL
export const STAKING_POOL_FRENS_ID = process.env.NEXT_PUBLIC_STAKING_FRENS_POOL_ID;
export const FRENS_TYPE = process.env.NEXT_PUBLIC_FRENS_TYPE;
export const TYPE_WIZARD = "0x81163458f159e8d0061463d4a0690eeaeb58c2cd411d9e2f21d049af84a39cfe::wizard_land::Wiz";
export const TYPE_FUDDIES = "0xac176715abe5bcdaae627c5048958bbe320a8474f524674f3278e31af3c8b86b::fuddies::Fuddies";
export const STAKING_TICKET_TYPE = `${PACKAGE_ID}::staking::StakingTicket`;
export const STAKING_TABLE_ID = process.env.NEXT_PUBLIC_STAKING_TABLE_ID;


export const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL as string;


// PRICE IN SUI(0.5 and 1)
export const PRICE_STACKED: number = process.env.NEXT_PUBLIC_PRICE_STAKE as unknown as number | 0.5;
export const PRICE_UNSTACKED: number = process.env.NEXT_PUBLIC_PRICE_UNSTAKE as unknown as number | 1;; 

