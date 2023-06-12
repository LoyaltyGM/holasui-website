import { ReactNode } from "react";

export interface ILayoutProps {
  children: ReactNode;
  className?: string;
  isMinHeightTurnOff?: boolean;
  headerBackground?: string;
  footer?: boolean;
}

export type AlertMessageType = "Staking" | "Unstaking" | "Open" | "Claim" | "ClaimGamePass" | "CreateOffer";

export interface IReward {
  id: string;
  name: string;
  description: string;
  url: string;
  reward_info_id: string;
}

