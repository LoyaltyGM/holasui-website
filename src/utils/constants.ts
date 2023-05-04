export const PACKAGE_ID = process.env.NEXT_PUBLIC_STAKING_PACKAGE_ID;
export const STAKING_HUB_ID = process.env.NEXT_PUBLIC_STAKING_HUB_ID;

// FRENS STAKING POOL
export const STAKING_POOL_FRENS_ID = process.env.NEXT_PUBLIC_STAKING_FRENS_POOL_ID;
export const FRENS_TYPE = process.env.NEXT_PUBLIC_FRENS_TYPE; 
export const STAKING_TICKET_TYPE = `${PACKAGE_ID}::staking::StakingTicket`;
export const STAKING_TABLE_ID = process.env.NEXT_PUBLIC_STAKING_TABLE_ID;


export const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL as string;


// PRICE IN SUI(1 and 3)
export const PRICE_STACKED: number = 1;
export const PRICE_UNSTACKED: number = 3; 

