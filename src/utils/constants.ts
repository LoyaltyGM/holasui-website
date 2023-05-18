import * as process from "process";

export const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL as string;

// ==== NFT TYPES ====
export const FRENS_TYPE =
  "0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::capy::Capy>";
export const TYPE_WIZARD = "0x81163458f159e8d0061463d4a0690eeaeb58c2cd411d9e2f21d049af84a39cfe::wizard_land::Wiz";
export const TYPE_FUDDIES = "0xac176715abe5bcdaae627c5048958bbe320a8474f524674f3278e31af3c8b86b::fuddies::Fuddies";

// ==== STAKING ====

export const PACKAGE_ID_V0 = process.env.NEXT_PUBLIC_PACKAGE_ID_V0 as string;
export const PACKAGE_ID_V1 = process.env.NEXT_PUBLIC_PACKAGE_ID_V1 as string;
export const STAKING_HUB_ID = process.env.NEXT_PUBLIC_STAKING_HUB_ID as string;
export const STAKING_TICKET_TYPE = `${PACKAGE_ID_V0}::staking::StakingTicket` as string;
export const REWARD_OBJECT_TYPE = `${PACKAGE_ID_V1}::staking::Reward` as string;
// FRENS POOL
export const FRENS_STAKING_POOL_ID = process.env.NEXT_PUBLIC_FRENS_STAKING_POOL_ID as string;
export const FRENS_STAKING_POOL_POINTS_TABLE_ID = process.env.NEXT_PUBLIC_FRENS_STAKING_POOL_POINTS_TABLE_ID as string;
export const GAME_PASS_REWARD_INFO_ID = process.env.NEXT_PUBLIC_GAME_PASS_REWARD_INFO_ID as string;
export const PRICE_STACKED: number = process.env.NEXT_PUBLIC_PRICE_STAKE as unknown as number | 0.5;
export const PRICE_UNSTACKED: number = process.env.NEXT_PUBLIC_PRICE_UNSTAKE as unknown as number | 1;

// ==== ESCROW ====
export const ESCROW_HUB_ID = process.env.NEXT_PUBLIC_SWAP_HUB_ID as string;
