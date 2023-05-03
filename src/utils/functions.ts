export function replaceTripleSlash(url: string): string {
  return url.replace(/\/\/\//g, "/");
}

// Function to convert IPFS URL to normal URL
export const convertIPFSUrl = (ipfsUrl: string): string => {
  const ipfsPrefix = 'ipfs://';
  const normalUrlPrefix = 'https://ipfs.io/ipfs/';

  if (ipfsUrl.startsWith(ipfsPrefix)) {
    const hash = ipfsUrl.slice(ipfsPrefix.length);
    return normalUrlPrefix + hash;
  } else {
    throw new Error('Invalid IPFS URL');
  }
};

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
