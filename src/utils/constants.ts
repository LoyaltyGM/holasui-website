import * as process from "process";
import { create } from "ipfs-http-client";

export const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_BLOCKVISION as string;

// ==== STAKING ====

export const PACKAGE_ID_V0 = "0x3412f5d7819fddb9d504a422177e3cc62c029f08002a0d51c0f7cfd93cfdfbcc";
export const PACKAGE_ID_V1 = "0xeebdb577b6e4505caaf2b1235a0243e3314082a634218f2192d4aaba89bcb180";
export const STAKING_HUB_ID = "0xc359293e60947b8ce6d7e3fe93bc475f7811b90e650e362650bc51f40db55954";
export const STAKING_TICKET_TYPE = `${PACKAGE_ID_V0}::staking::StakingTicket`;
// FRENS POOL
export const FRENS_STAKING_POOL_ID =
  "0xd2421e54a1fb642900d30cba6d64bc4f5deaafec9eb507d6060d465efc8af3ea";
export const FRENS_STAKING_POOL_POINTS_TABLE_ID =
  "0x2c7a680cb2bb1262b064f58b95c3aa12311c241b752af822370ac0505f3b97f0";
export const PRICE_STACKED: number = 0.5;
export const PRICE_UNSTACKED: number = 1;

// ==== ESCROW ====

export const PACKAGE_ID_ESCROW =
  "0x27f071fa2d3003272c17101fc36439e9afe13dd382d1d16bcb0387e4c24598b2";

export const ESCROW_HUB_ID = "0x1f79470adae9a9c6a5908e3deb807330e71cc6ef796048ac4bed6f459971f028";

export const PRICE_ESCROW: number = 0.1;

// ==== DAO ====
// todo: change this to PACKAGE_ID_V2
export const TEST_DAO_PACKAGE_ID =
  "0xf91b3c9e0b9cdd730004025e22ae85213535070d0dc60f0f1d5d937609a6e4d8";
export const ORIGIN_CAPY_DAO_ID =
  "0x3aff388a68c3f1fbc6c85823a4623f4d92f67b857adfe3633b092619020256c4";

// ==== IPFS ====
export const IPFS = "ipfs://";
export const INFURA_IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_DEDICATED_GATEWAY_SUBDOMAIN;
export const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic " +
      Buffer.from(
        process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID +
          ":" +
          process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET,
      ).toString("base64"),
  },
});

// ==== DAO ====
// Vote types
export const DAO_VOTE_TYPE_ABSTAIN: number = 0;
export const DAO_VOTE_TYPE_FOR: number = 1;
export const DAO_VOTE_TYPE_AGAINST: number = 2;

// Proposal types
export const DAO_PROPOSAL_TYPE_VOTING: number = 0;
export const DAO_PROPOSAL_TYPE_FUNDING: number = 1;

// Proposal status
export const DAO_PROPOSAL_STATUS_ACTIVE: number = 0;
export const DAO_PROPOSAL_STATUS_CANCELED: number = 1;
export const DAO_PROPOSAL_STATUS_DEFEATED: number = 2;
export const DAO_PROPOSAL_STATUS_EXECUTED: number = 3;
