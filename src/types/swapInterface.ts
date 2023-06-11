

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