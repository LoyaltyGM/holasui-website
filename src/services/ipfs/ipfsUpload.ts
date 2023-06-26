import { INFURA_IPFS_GATEWAY, IPFS, ipfsClient } from "utils";

export const getImage = (path: string | undefined): string => {
  if (!path) return "";
  return INFURA_IPFS_GATEWAY + path?.replace(IPFS, "");
};

export const storeNFT = async (image: File) => {
  const result = await ipfsClient.add(image);
  return fullPath(result.path);
};

const fullPath = (path: string) => IPFS + `${path}`;
