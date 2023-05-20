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

export interface IReward {
  id: string;
  name: string;
  description: string;
  url: string;
  reward_info_id: string;
}

export interface IOffer {
  id: string;
  active: boolean;
  object_bag: any;
  //
  creator: string;
  creator_object_ids: string[];
  creator_coin_amount: number;
  //
  recipient: string;
  recipient_object_ids: string[];
  recipient_coin_amount: number;
}
