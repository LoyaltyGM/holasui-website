import {Dispatch, SetStateAction} from "react";

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