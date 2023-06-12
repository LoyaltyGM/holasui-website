export type TradeObjectType = {
    id: string;
    url: string;
};

export interface ISwapInformation {
    userObjectIds: TradeObjectType[];
    setShowCollection: any;
    setCoinAmount: any;
    coinAmount: number | null;
    recipientAddress?: string;
    isRecipient?: boolean;
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
