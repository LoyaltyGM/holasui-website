import { replaceTripleSlash, FRENS_TYPE, STAKING_TICKET_TYPE, convertIPFSUrl } from "utils";
import { SuiNFT } from "ethos-connect";
import { IStakingTicket, ICapy } from "types";
import { ConvenenienceSuiObject } from "ethos-connect/dist/types/ConvenienceSuiObject";

export function fetchSuifrens(nftObjects: SuiNFT[]): ICapy[] | null {
  if (!nftObjects) return null;
  return nftObjects
    .filter((object) => object.type === FRENS_TYPE)
    .map((suifrenNftObject) => initializeSuifren(suifrenNftObject));
}

export function fetchSuifren(nftObjects: SuiNFT[], id: string): ICapy | null {
  if (!nftObjects) return null;

  const suifrenNftObject = nftObjects.find((object) => object.objectId === id && object.type === FRENS_TYPE);

  return initializeSuifren(suifrenNftObject!);
}

export function fetchStakingTickets(objects: ConvenenienceSuiObject[]): IStakingTicket[] | null {
  if (!objects) return null;
  return objects
    .filter((object) => object.type === STAKING_TICKET_TYPE)
    .map((sleepTicketNftObject) => initializeStakingTicket(sleepTicketNftObject));
}

export function fetchStakingTicket(objects: ConvenenienceSuiObject[], id: string): IStakingTicket | null {
  if (!objects) return null;

  const tripTicketNftObject = objects.find((object) => object.objectId === id && object.type === STAKING_TICKET_TYPE);

  return initializeStakingTicket(tripTicketNftObject!);
}

function initializeSuifren(nftObject: SuiNFT): ICapy {
  return {
    id: nftObject?.objectId,
    description: nftObject?.description!,
    url: nftObject?.imageUrl!,
    link: nftObject?.link!,
  };
}

function initializeStakingTicket(object: ConvenenienceSuiObject): IStakingTicket {
  console.log("init", object)
  return {
    id: object?.objectId,
    name: object?.fields?.name!,
    url: object?.fields?.url!,
    nft_id: object?.fields?.nft_id!,
    start_time: +object?.fields?.start_time!,
  };
}
