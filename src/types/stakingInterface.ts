import {Dispatch, SetStateAction} from "react";

export interface ICapy {
    id: string;
    description: string;
    url: string;
    link: string;
}

export interface IObjectDetailDialog {
    selectedFrend: ICapy | undefined;
    openedFrend: boolean;
    setOpenedFrend: Dispatch<SetStateAction<boolean>>;
    stakeFunction: any;
    waitSui: boolean;
}

export interface IProjectCard {
    totalStaked: number;
    setOpenRules:  Dispatch<SetStateAction<boolean>>
    stakedList: IStakingTicket[] | null ;
    totalHolaPointsOnchain: number;
    availablePointsToClaim: number;
    claimPointsFunction: (objects_batch: string[]) => void;
}

export interface IStakingTicket {
    id: string;
    name: string;
    url: string;
    nft_id: string;
    start_time: number;
}