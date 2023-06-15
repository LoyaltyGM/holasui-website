import * as process from "process";

export const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL as string;

// ==== NFT TYPES ====

// TODO: change to "0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::suifrens::SuiFren<0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::capy::Capy>";
export const FRENS_TYPE = "0x99b53de45f9b488de6b684bf2a4ee2151e434d6a94e13588a918e2fabce82a68::food::Food";
// export const TYPE_WIZARD = "0x81163458f159e8d0061463d4a0690eeaeb58c2cd411d9e2f21d049af84a39cfe::wizard_land::Wiz";
// export const TYPE_FUDDIES = "0xac176715abe5bcdaae627c5048958bbe320a8474f524674f3278e31af3c8b86b::fuddies::Fuddies";

// ==== STAKING ====

export const PACKAGE_ID_V0 = "0x3412f5d7819fddb9d504a422177e3cc62c029f08002a0d51c0f7cfd93cfdfbcc";
export const PACKAGE_ID_V1 = "0xeebdb577b6e4505caaf2b1235a0243e3314082a634218f2192d4aaba89bcb180";
export const STAKING_HUB_ID = "0xc359293e60947b8ce6d7e3fe93bc475f7811b90e650e362650bc51f40db55954";
export const STAKING_TICKET_TYPE = `${PACKAGE_ID_V0}::staking::StakingTicket`;
// FRENS POOL
export const FRENS_STAKING_POOL_ID = "0xd2421e54a1fb642900d30cba6d64bc4f5deaafec9eb507d6060d465efc8af3ea";
export const FRENS_STAKING_POOL_POINTS_TABLE_ID = "0x2c7a680cb2bb1262b064f58b95c3aa12311c241b752af822370ac0505f3b97f0";
export const PRICE_STACKED: number = 0.5;
export const PRICE_UNSTACKED: number = 1;

// ==== ESCROW ====

export const PACKAGE_ID_ESCROW = "0x501e55aa45734a87b11fdfcca02febd136fc063c71db4bc3f15a4f69f1365e7b";

export const ESCROW_HUB_ID = "0xf82210562189d40a63d226b5ca472b7622334cbf820183071c37ecb9af75aca3";

export const PRICE_ESCROW: number = 0.4;
