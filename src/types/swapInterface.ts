import { Dispatch, SetStateAction } from "react";

export type TradeObjectType = {
  id: string;
  url: string;
  type: string;
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
  setTypeSwap: Dispatch<SetStateAction<string>>;
  typeSwap: string;
}

export interface IYourOfferLinkDialog {
  recipientAddress: string;
  transactionHash: string;
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
}

export interface ISwapRecipientCollectionDialog extends ISwapCollectionDialog {
  creatorBatchIdTrade: TradeObjectType[];
  walletAddressToSearch: string | undefined;
  setWalletAddressToSearch: Dispatch<SetStateAction<string | undefined>>;
}

export interface IOffer {
  id: string;
  // 0: cancelled, 1: active, 2: exchanged
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
