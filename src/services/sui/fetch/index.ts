import { SUIFREN_CAPY_TYPE, replaceTripleSlash, STAKING_TICKET_TYPE, SWAP_TYPES_LIST } from "utils";
import { SuiNFT } from "ethos-connect";
import { ICapy, IStakingTicket } from "types";

export function fetchCapyStaking(nftObjects: SuiNFT[]): ICapy[] | null {
  if (!nftObjects) return null;
  return nftObjects
    .filter((object) => object.type === SUIFREN_CAPY_TYPE)
    .map((suifrenNftObject) => initializeSuifren(suifrenNftObject));
}

export function fetchNFTObjects(nftObjects: SuiNFT[]): ICapy[] | null {
  if (!nftObjects) return null;
  return nftObjects
    .filter((object) => SWAP_TYPES_LIST.includes(object.type)) //|| object.type === TYPE_WIZARD || object.type === TYPE_FUDDIES)
    .map((suifrenNftObject) => initializeSuifren(suifrenNftObject));
}

export function fetchSuifren(nftObjects: SuiNFT[], id: string): ICapy | null {
  if (!nftObjects) return null;

  const suifrenNftObject = nftObjects.find(
    (object) => object.objectId === id && object.type === SUIFREN_CAPY_TYPE,
  );

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

  const tripTicketNftObject = objects.find(
    (object) => object.objectId === id && object.type === STAKING_TICKET_TYPE,
  );

  return initializeStakingTicket(tripTicketNftObject!);
}

function initializeSuifren(nftObject: SuiNFT): ICapy {
  return {
    id: nftObject?.objectId,
    description: nftObject?.name!,
    url: nftObject?.imageUrl!,
    link: nftObject?.link!,
    type: nftObject?.type!,
    birth_location: nftObject?.fields?.birth_location!,
  };
}

function initializeStakingTicket(object: SuiNFT): IStakingTicket {
  return {
    id: object?.objectId,
    name: object?.name!,
    url: replaceTripleSlash(object?.imageUrl!),
    nft_id: object?.fields?.nft_id!,
    start_time: +object?.fields?.start_time!,
  };
}
