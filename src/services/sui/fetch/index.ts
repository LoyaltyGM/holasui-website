import { FRENS_TYPE, replaceTripleSlash, STAKING_TICKET_TYPE } from "utils";
import { SuiNFT } from "ethos-connect";
import { ICapy, IStakingTicket } from "types";

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

// export function fetchNFT() {
//   return()
// }

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
