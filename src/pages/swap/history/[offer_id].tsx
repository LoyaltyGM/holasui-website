import type {GetServerSideProps, NextPage} from "next";
import {IDetailOfferProps} from "types";
import {useState} from "react";
import {ethos, EthosConnectStatus} from "ethos-connect";
import {NoConnectWallet} from "components";
import {classNames} from "utils";

//@ts-ignore
export const getServerSideProps: GetServerSideProps<IDetailOfferProps> = async ({params}) => {
    try {
        const offer_id = Number(params?.offer_id);

        return {
            props: {
                offer_id
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

const DetailSwapOffer: NextPage<IDetailOfferProps> = ({offer_id}) => {
    const [offerId, setOfferId] = useState(offer_id);
    const { status, wallet } = ethos.useWallet();

    return status === EthosConnectStatus.NoConnection ? (
        <NoConnectWallet title={"P2P Swap!"} />
    ) : (
        <main
            className={classNames(
                "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 "
            )}
        >
            <div className={"mt-10 mb-8 text-blackColor font-extrabold text-3xl"}>
                <p>Your offer to</p>
            </div>
            <p className={'bg-black'}>
                {offer_id.id}
            </p>
        </main>
    )
}

export default DetailSwapOffer;