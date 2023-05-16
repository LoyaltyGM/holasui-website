import { FRENS_TYPE, replaceTripleSlash, REWARD_OBJECT_TYPE, STAKING_TICKET_TYPE } from "utils";
import { SuiNFT } from "ethos-connect";
import { ICapy, IReward, IStakingTicket } from "types";

export function fetchSuifrens(nftObjects: SuiNFT[]): ICapy[] | null {
  if (!nftObjects) return null;
  console.log(nftObjects);
  return nftObjects
    .filter((object) => object.type === FRENS_TYPE) //|| object.type === TYPE_WIZARD || object.type === TYPE_FUDDIES)
    .map((suifrenNftObject) => initializeSuifren(suifrenNftObject));
}

export function fetchSuifren(nftObjects: SuiNFT[], id: string): ICapy | null {
  if (!nftObjects) return null;

  const suifrenNftObject = nftObjects.find((object) => object.objectId === id && object.type === FRENS_TYPE);

  return initializeSuifren(suifrenNftObject!);
}

export function fetchStakingTickets(objects: SuiNFT[]): IStakingTicket[] | null {
  if (!objects) return null;

  return objects
    .filter((object) => object.type === STAKING_TICKET_TYPE)
    .map((sleepTicketNftObject) => initializeStakingTicket(sleepTicketNftObject));
}

export function fetchStakingTicket(objects: SuiNFT[], id: string): IStakingTicket | null {
  if (!objects) return null;

  const tripTicketNftObject = objects.find((object) => object.objectId === id && object.type === STAKING_TICKET_TYPE);

  return initializeStakingTicket(tripTicketNftObject!);
}

export function fetchRewards(nftObjects: SuiNFT[]): IReward[] | null {
  if (!nftObjects) return null;
  return nftObjects
    .filter((object) => object.type === REWARD_OBJECT_TYPE) //|| object.type === TYPE_WIZARD || object.type === TYPE_FUDDIES)
    .map((rewardObject) => initializeReward(rewardObject));
}

function initializeSuifren(nftObject: SuiNFT): ICapy {
  return {
    id: nftObject?.objectId,
    description: nftObject?.description!,
    url: nftObject?.imageUrl!,
    link: nftObject?.link!,
  };
}

function initializeStakingTicket(object: SuiNFT): IStakingTicket {
  console.log(object.imageUrl);
  return {
    id: object?.objectId,
    name: object?.name!,
    url: replaceTripleSlash(object?.imageUrl!),
    nft_id: object?.fields?.nft_id!,
    start_time: +object?.fields?.start_time!,
  };
}

function initializeReward(object: SuiNFT): IReward {
  return {
    id: object?.objectId,
    name: object?.name!,
    description: object?.description!,
    url: object?.imageUrl!,
    reward_info_id: object?.fields?.reward_info_id!,
  };
}
