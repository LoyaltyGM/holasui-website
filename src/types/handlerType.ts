import {Dispatch, SetStateAction} from "react";
import { TradeObjectType } from "types";
import {AlertErrorMessage} from "../components";

// handle function for batch mode selection
export const handleSetBatchIdStake = (
    id: string,
    batchIdStake: string[],
    setBatchIdStake: Dispatch<SetStateAction<string[]>>
) => {
    // Check if the id already exists in the array
    if (!batchIdStake.includes(id)) {
        // If it doesn't exist, add it to the array
        setBatchIdStake((prevBatchIdStake) => [...prevBatchIdStake, id]);
    } else {
        // If it exists, remove it from the array
        setBatchIdStake((prevBatchIdStake) => prevBatchIdStake.filter((item) => item !== id));
    }
};

export const handleSetBatchIdForSwap = (
    id: string,
    url: string,
    type: string,
    setTypeSwap: Dispatch<SetStateAction<string>>,
    batchIdTrade: TradeObjectType[],
    setBatchIdTrade: Dispatch<SetStateAction<TradeObjectType[]>>,
    creatorBatchIdTrade?: TradeObjectType[],
    typeSwap?: string,
) => {
    if(creatorBatchIdTrade === undefined) {
        // Check if the list is empty (i.e., it's the first click)
        if (batchIdTrade.length === 0) {
            // Set the type of the swap
            setTypeSwap(type);
            // Add the item to the array
            setBatchIdTrade((prevBatchIdStake) => [...prevBatchIdStake, { id, url, type }]);
        } else {
            // Check if the item's type matches the existing type
            if (batchIdTrade[0].type === type) {
                // Check if the id already exists in the array
                if (!batchIdTrade.some((item) => item.id! === id)) {
                    // If it doesn't exist, add it to the array
                    setBatchIdTrade((prevBatchIdStake) => [...prevBatchIdStake, { id, url, type }]);
                } else {
                    // If it exists, remove it from the array
                    setBatchIdTrade((prevBatchIdStake) => prevBatchIdStake.filter((item) => item.id !== id));
                }
            } else {
                // Show a message to the user
                AlertErrorMessage("not_same_type");
            }
        }
    } else {
        // Check if the item's type matches the existing type
        if (type === creatorBatchIdTrade[0].type) {
            // Check if the id already exists in the array
            if (!batchIdTrade.some((item) => item.id! === id)) {
                // If it doesn't exist, add it to the array
                setBatchIdTrade((prevBatchIdStake) => [...prevBatchIdStake, { id, url, type }]);
            } else {
                // If it exists, remove it from the array
                setBatchIdTrade((prevBatchIdStake) => prevBatchIdStake.filter((item) => item.id !== id));
            }
        } else {
            // Show a message to the user
            AlertErrorMessage("not_same_type");
        }
    }

};
