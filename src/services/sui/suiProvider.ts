import { Connection, JsonRpcProvider } from "@mysten/sui.js";
import { SUI_RPC_URL } from "utils/constants";

export const suiProvider = new JsonRpcProvider(new Connection({
  fullnode: SUI_RPC_URL
}));
