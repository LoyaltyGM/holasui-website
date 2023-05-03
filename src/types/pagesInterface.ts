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
  name: string;
  url: string;
  link: string;
  lvl: number;
  xp: number;
  energy: number;
}

export interface IFood {
  id: string;
  name: string;
  description: string;
  url: string;
  xp: number;
  rarity: string;
  energy: number;
}

export interface ISleepTicket {
  id: string;
  suifrens_id: string;
  timer: number;
}
