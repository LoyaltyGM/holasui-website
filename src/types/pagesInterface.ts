import { ReactNode } from "react";

export interface ILayoutProps {
  children: ReactNode;
  className?: string;
  isMinHeightTurnOff?: boolean;
  headerBackground?: string;
  footer?: boolean;
}

export type AlertMessageType =
  | "Staking"
  | "Unstaking"
  | "Open"
  | "Claim"
  | "CreateOffer"
  | "CancelOffer"
  | "AcceptOffer"
  | "CreateDao";
