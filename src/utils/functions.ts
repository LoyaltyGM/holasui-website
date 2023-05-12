export function replaceTripleSlash(url: string): string {
  return url.replace(/\/\/\//g, "/");
}

// Function to convert IPFS URL to normal URL
export const convertIPFSUrl = (ipfsUrl: string): string => {
  const ipfsPrefix: string = "ipfs://";
  const normalUrlPrefix: string = "https://ipfs.io/ipfs/";

  if (ipfsUrl.includes(ipfsPrefix)) {
    const hash = ipfsUrl.slice(ipfsPrefix.length);
    return normalUrlPrefix + hash;
  } else {
    throw new Error("Invalid IPFS URL");
  }
};

export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(num: number) {
  const suffixes = ["", "K", "M", "B", "T"]; // array of number suffixes
  const suffixNum = Math.floor(("" + num).length / 3); // determine the suffix
  let shortenedNum: number | string = num / Math.pow(10, suffixNum * 3); // convert the number to a shortened decimal

  if (shortenedNum.toString().length > 3) {
    // check if it has more than 3 digits
    shortenedNum = shortenedNum.toFixed(2); // round to 1 decimal place if so
  }
  return shortenedNum + suffixes[suffixNum]; // append the suffix
}
