import { useEffect, useState } from "react";
import { ISleepTicket, ICapy } from "types";
import { fetchSleepTickets, fetchSuifrens } from "services/sui";
import { ethos, EthosConnectStatus } from "ethos-connect";
import sleepImage from "/public/img/sleep.png";
import Image from "next/image";
import { DialogShowNFT } from "components/Dialog";

const Home = () => {
  const { wallet, status } = ethos.useWallet();
  const { provider } = ethos.useProviderAndSigner();

  // Data states
  const [capyies, setCapyies] = useState<ICapy[]>();
  const [stacked, setStaked] = useState<ISleepTicket[]>();

  // Dialog states
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        setCapyies(undefined);
        setStaked(undefined);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const objects = wallet?.contents?.objects!;

        const suifrens = fetchSuifrens(nfts);
        if (suifrens) setCapyies(suifrens);

        const sleeps = fetchSleepTickets(objects);
        if (sleeps) setStaked(sleeps);
      } catch (e) {
        console.error(e);
      }
    }
    fetchWalletFrens().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

  const ProjectDescriptionCard = () => {
    return (
      <div className="flex p-4 py-8 gap-2 h-60 border-2 border-[#F6F6F6] rounded-xl">
        <div className="ml-12 flex flex-col content-center justify-center rounded-2xl">
          <Image src={sleepImage} alt={"logo"} height={150} width={150} />
        </div>
        <div className="w-full ml-4">
          <div className="flex justify-between">
            <div>
              <p className="text-3xl font-bold">SuiFrend</p>
              <p>Each staked frens will earn 1 points per minute</p>
            </div>
            <p>Staking Rules</p>
          </div>
          <div className="flex h-24 mt-4 justify-between gap-4">
            <div className="border bg-[#F6F6F6] w-1/4 rounded-xl flex flex-col justify-center content-center text-center">
              <p>Total Staked</p>
              <p className="text-xl font-semibold">228</p>
            </div>
            <div className="border bg-[#F6F6F6] w-1/4 rounded-xl flex flex-col justify-center content-center text-center">
              <p>Your Staked</p>
              <p className="text-xl font-semibold">10</p>
            </div>
            <div className="border bg-[#F6F6F6] w-1/4 rounded-xl flex flex-col justify-center content-center text-center">
              <p>Your Staked Points</p>
              <p className="text-xl font-semibold">228</p>
            </div>
            <div className="border bg-[#F6F6F6] w-1/4 rounded-xl flex flex-col justify-center content-center text-center">
              <p>Hola Staked Points</p>
              <p className="text-xl font-semibold">228</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SuifrensCard = ({ capy }: { capy: ICapy }) => {
    return (
      <div className="flex flex-col items-center gap-2 bg-[#F6F6F6] rounded-xl py-8">
        <div className="relative">
          <div className="w-40 h-40">
            <Image src={capy.url} alt={capy.name} fill={true} />
          </div>
        </div>
        <p className="text-center font-medium mt-2">{capy.name}</p>
      </div>
    );
  };

  const StakedTicketCard = ({ sleep: _ }: { sleep: ISleepTicket }) => {
    return (
      <div className="flex flex-col items-center gap-2 bg-[#F6F6F6] rounded-xl py-8">
        <div className="relative">
          <div className={"w-40 h-40"}>
            <Image src={sleepImage} alt={"sleep"} fill={true} />
          </div>
        </div>
        <div className="text-center font-medium mt-2">Sleep</div>
      </div>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <main className="flex min-h-[85vh] flex-col items-center justify-around mt-20 z-10 rounded-lg bg-white">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm">
        <p className="text-4xl text-center w-full pt-12 font-bold text-[#5767EF]">
          Connect Your Wallet To Check Your Gochi!
        </p>
      </div>
    </main>
  ) : (
    <main className="flex min-h-[85vh] flex-col pl-16 py-6 mt-20 pr-10 z-10 rounded-lg bg-white">
      <ProjectDescriptionCard />
      <h1 className="mt-8 text-4xl font-semibold text-main">My Frens</h1>
      <div className={"grid grid-cols-4 gap-10 mt-8"}>
        {capyies?.map((capy) => (
          <SuifrensCard capy={capy} key={capy.id} />
        ))}
      </div>

      {stacked?.length !== 0 && (
        <>
          <h1 className=" text-4xl text-main mt-8 font-semibold">My Staked Frens</h1>
          <div className={"grid grid-cols-4 gap-10 mt-8"}>
            {stacked?.map((stack) => (
              <StakedTicketCard sleep={stack} key={stack.id} />
            ))}
          </div>
        </>
      )}

      {/* {opened && <DialogShowNFT setOpen={setOpened} open={opened} capy={capyies[0]!} />} */}
    </main>
  );
};

export default Home;
