import { IPFS, ipfsClient } from "utils";

export const storeNFT = async (image: File) => {
  const result = await ipfsClient.add(image);
  return fullPath(result.path);
};

const fullPath = (path: string) => IPFS + `${path}`;
