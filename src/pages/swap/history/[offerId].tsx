import type { GetServerSideProps, NextPage } from "next";
import { useEffect, useState } from "react";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { CopyTextButton, NoConnectWallet } from "components";
import { classNames, formatSuiAddress } from "utils";
import { IOffer } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { LinkIcon } from "@heroicons/react/24/outline";

interface IDetailOfferProps {
  offerId: string;
}

export const getServerSideProps: GetServerSideProps<IDetailOfferProps> = async ({ params }) => {
  try {
    const offerId = params?.offerId as string;

    return {
      props: {
        offerId,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

const DetailSwapOffer: NextPage<IDetailOfferProps> = ({ offerId }) => {
  const [offer, setOffer] = useState<IOffer>();
  const { status, wallet } = ethos.useWallet();

  useEffect(() => {
    async function fetchOffer() {
      const offerObject = await suiProvider.getObject({
        id: offerId,
        options: { showContent: true },
      });

      setOffer(getObjectFields(offerObject) as IOffer);
    }

    fetchOffer().then();
  }, []);

  console.log(offer);
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <main
      className={classNames(
        "flex flex-col gap-10 min-h-[100vh] md:min-h-[65vh] pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 "
      )}
    >
      <div className={"flex gap-4 mt-10 text-blackColor font-extrabold text-3xl"}>
        <a href={`https://suiexplorer.com/object/${offerId}`} target="_blank" className={"flex items-center"}>
          Offer
          <LinkIcon className={"h-6"} />
        </a>
        from
        <CopyTextButton showText={formatSuiAddress(offer?.creator || "")} copyText={offer?.creator || ""} />
        to
        <CopyTextButton showText={formatSuiAddress(offer?.recipient || "")} copyText={offer?.recipient || ""} />
      </div>

      <div className={"flex gap-4 text-xl"}>
        <p className={"font-semibold"}>Status: </p>
        {offer?.status == 0 ? (
          <p className={"text-red-500"}>Canceled</p>
        ) : offer?.status == 1 ? (
          <p className={"text-green-500"}>Active</p>
        ) : (
          offer?.status == 2 && <p className={"text-blue-500"}>Exchanged</p>
        )}
      </div>
    </main>
  );
};

export default DetailSwapOffer;
