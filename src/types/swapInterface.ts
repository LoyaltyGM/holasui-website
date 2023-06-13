import { Dispatch, SetStateAction } from "react";

export type TradeObjectType = {
  id: string;
  url: string;
};

export type TabType = "sent" | "received";

export interface ISwapInformation {
  userObjectIds: TradeObjectType[];
  setShowCollection: any;
  setCoinAmount: any;
  coinAmount: number | null;
  recipientAddress?: string;
  isRecipient?: boolean;
}

export interface ISwapCollectionDialog {
  wallet: any;
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
  batchIdTrade: TradeObjectType[];
  setBatchIdTrade: Dispatch<SetStateAction<TradeObjectType[]>>;
}

export interface ISwapRecipientCollectionDialog extends ISwapCollectionDialog {
  walletAddressToSearch: string | undefined;
  setWalletAddressToSearch: Dispatch<SetStateAction<string | undefined>>;
}

export interface IOffer {
  id: string;
  status: number;
  escrowed_items: any;
  escrowed_coin: any;
  //
  creator: string;
  creator_items_ids: any;
  creator_coin_amount: number;
  //
  recipient: string;
  recipient_items_ids: any;
  recipient_coin_amount: number;
}
