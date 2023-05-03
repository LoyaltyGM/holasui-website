export const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID;
export const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;

// HUBS frens
export const SUIFRENS_HUB_ID = process.env.NEXT_PUBLIC_SUIGOTCHI_HUB_ID;
export const TRIP_HUB_ID = process.env.NEXT_PUBLIC_TRIP_HUB_ID;


export const SUI_RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL as string;

export const SUIGOTCHI_TYPE = `${PACKAGE_ID}::suigotchi::Suigotchi`;
export const FOOD_TYPE = `${PACKAGE_ID}::food::Food`;
export const ITEM_TYPE = `${PACKAGE_ID}::item::Item`;


export const SLEEP_TICKET_TYPE = `${PACKAGE_ID}::trip::SleepTicket`;


// PRICE IN SUI(1 and 3)
export const PRICE_STACKED: number = 1;
export const PRICE_UNSTACKED: number = 3; 

