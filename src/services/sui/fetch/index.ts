import { replaceTripleSlash, SLEEP_TICKET_TYPE, SUIGOTCHI_TYPE } from "utils";
import { SuiNFT } from "ethos-connect";
import { ISleepTicket, ICapy } from "types";
import { ConvenenienceSuiObject } from "ethos-connect/dist/types/ConvenienceSuiObject";

export function fetchSuifrens(nftObjects: SuiNFT[]): ICapy[] | null {
  if (!nftObjects) return null;
  return nftObjects
    .filter((object) => object.type === SUIGOTCHI_TYPE)
    .map((suigotchiNftObject) => initializeSuigotchi(suigotchiNftObject));
}

export function fetchSuigotchi(nftObjects: SuiNFT[], id: string): ICapy | null {
  if (!nftObjects) return null;

  const suigotchiNftObject = nftObjects.find((object) => object.objectId === id && object.type === SUIGOTCHI_TYPE);

  return initializeSuigotchi(suigotchiNftObject!);
}

export function fetchSleepTickets(objects: ConvenenienceSuiObject[]): ISleepTicket[] | null {
  if (!objects) return null;
  return objects
    .filter((object) => object.type === SLEEP_TICKET_TYPE)
    .map((sleepTicketNftObject) => initializeSleepTicket(sleepTicketNftObject));
}

export function fetchSleepTicket(objects: ConvenenienceSuiObject[], id: string): ISleepTicket | null {
  if (!objects) return null;

  const tripTicketNftObject = objects.find((object) => object.objectId === id && object.type === SLEEP_TICKET_TYPE);

  return initializeSleepTicket(tripTicketNftObject!);
}

function initializeSuigotchi(nftObject: SuiNFT): ICapy {
  return {
    id: nftObject?.objectId,
    name: nftObject?.name!,
    url: replaceTripleSlash(nftObject?.imageUrl!),
    link: nftObject?.link!,
    energy: +nftObject?.fields?.energy!,
    xp: +nftObject?.fields?.xp!,
    lvl: +nftObject?.fields?.lvl!,
  };
}

function initializeSleepTicket(object: ConvenenienceSuiObject): ISleepTicket {
  return {
    id: object?.objectId,
    suifrens_id: object?.fields?.suigotchi_id!,
    timer: +object?.fields?.timer!,
  };
}

