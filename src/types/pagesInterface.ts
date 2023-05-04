import { ReactNode } from "react";

export interface ILayoutProps {
  children: ReactNode;
  className?: string;
  isMinHeightTurnOff?: boolean;
  headerBackground?: string;
  footer?: boolean;
}

export interface ICapy {
  id: string;
  description: string;
  url: string;
  link: string;
}

export interface IStakingTicket {
  id: string;
  name: string;
  url: string;
  nft_id: string;
  start_time: number;
}


