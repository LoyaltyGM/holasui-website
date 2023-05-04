export function replaceTripleSlash(url: string): string {
  return url.replace(/\/\/\//g, "/");
}

// Function to convert IPFS URL to normal URL
export const convertIPFSUrl = (ipfsUrl: string): string => {
  const ipfsPrefix: string = 'ipfs://';
  const normalUrlPrefix: string = 'https://ipfs.io/ipfs/';
  
  if (ipfsUrl.includes(ipfsPrefix)) {
    const hash = ipfsUrl.slice(ipfsPrefix.length);
    return normalUrlPrefix + hash;
  } else {
    throw new Error('Invalid IPFS URL');
  }
};

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
