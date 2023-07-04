import { ethos, EthosConnectStatus } from "ethos-connect";
import { classNames, convertIPFSUrl, ORIGIN_CAPY_DAO_ID } from "utils";
import { DaoCard, NoConnectWallet } from "components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { IDao } from "types/daoInterface";

const DAO = () => {
  const { status, wallet } = ethos.useWallet();
  const [dao, setDao] = useState<IDao>();
  const [isDaoLoading, setIsDaoLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsDaoLoading(true);
    async function fetchCapyDao() {
      try {
        const daoObject = await suiProvider.getObject({
          id: ORIGIN_CAPY_DAO_ID,
          options: {
            showContent: true,
          },
        });
        const dao = getObjectFields(daoObject) as IDao;
        dao.subdaos = dao.subdaos?.fields?.contents?.fields?.id?.id;
        dao.proposals = dao.proposals?.fields?.id?.id;
        dao.image = convertIPFSUrl(dao.image);
        setDao(getObjectFields(daoObject) as IDao);
      } catch (e) {
        console.log(e);
      }
    }

    fetchCapyDao()
      .then()
      .finally(() => setIsDaoLoading(false));
  }, []);
  const daoCards = [
    {
      title: "DAO Card One",
      description: "This is the first DAO Card for your application.",
      twitterUrl: "https://twitter.com/dao_card_one",
      imageUrl: "https://pbs.twimg.com/profile_images/1659268735792816136/cKluYy4N_400x400.jpg",
      daoAddress: "0x3D980E50508CFd41a13837A60149927a11c03731",
    },
    {
      title: "DAO Card Two",
      description: "This is the second DAO Card for your application.",
      twitterUrl: "https://twitter.com/dao_card_two",
      imageUrl: "https://pbs.twimg.com/profile_images/1666614102737797122/6E0poPYm_400x400.jpg",
      daoAddress: "0x7c2C195CD6D34B8F845992d380aADB2730bB9C6F",
    },
    {
      title: "DAO Card Three",
      description:
        "Description Description Description Description Description Description Description Description Description\n" +
        'Description Description Description Description Description{" "}',
      twitterUrl: "https://twitter.com/suinsdapp",
      imageUrl: "https://pbs.twimg.com/profile_images/1643318976037142528/pIak4NCj_400x400.jpg",
      daoAddress: "0xA72dE5b3F6388d2A10D6114a9B6389BDA6278E0C",
    },
    {
      title: "DAO Card Four",
      description: "This is the fourth DAO Card for your application.",
      twitterUrl: "https://twitter.com/hola_sui",
      imageUrl: "https://pbs.twimg.com/profile_images/1643318976037142528/pIak4NCj_400x400.jpg",
      daoAddress: "0x52C5317c848ba20C75000F455F153e6F10665221",
    },
    {
      title: "DAO Card Three",
      description:
        "Description Description Description Description Description Description Description Description Description\n" +
        'Description Description Description Description Description{" "}',
      twitterUrl: "https://twitter.com/suinsdapp",
      imageUrl: "https://pbs.twimg.com/profile_images/1643318976037142528/pIak4NCj_400x400.jpg",
      daoAddress: "0xA72dE5b3F6388d2A10D6114a9B6389BDA6278E0C",
    },
    {
      title: "DAO Card Four",
      description: "This is the fourth DAO Card for your application.",
      twitterUrl: "https://twitter.com/hola_sui",
      imageUrl: "https://pbs.twimg.com/profile_images/1643318976037142528/pIak4NCj_400x400.jpg",
      daoAddress: "0x52C5317c848ba20C75000F455F153e6F10665221",
    },
  ];

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"DAO!"} />
  ) : (
    <main
      className={classNames(
        "mt-18 z-10 mt-8 flex min-h-[100vh] flex-col rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] md:pl-16 md:pr-10 ",
      )}
    >
      <div className={"mt-32 flex content-center items-center justify-between"}>
        <h1 className={"text-2xl font-semibold text-blackColor md:text-4xl"}>Hola, DAOs</h1>
        <Link href={"dao/create"} className={"button-primary button-shadow px-5 py-3 font-bold"}>
          Create DAO
        </Link>
      </div>
      <div className={"mb-20 mt-10 grid grid-cols-1 gap-5 md:grid-cols-2"}>
        <DaoCard
          key={dao?.id}
          //@ts-ignore
          daoAddress={dao?.id?.id!}
          title={dao?.name!}
          description={dao?.description!}
          imageUrl={dao?.image!}
          twitterUrl={"https://twitter.com/suinsdapp"}
        />
        {daoCards.map((daoInfo) => {
          return (
            <DaoCard
              key={daoInfo.daoAddress}
              daoAddress={daoInfo.daoAddress}
              title={daoInfo.title}
              description={daoInfo.description}
              imageUrl={daoInfo.imageUrl}
              twitterUrl={daoInfo.twitterUrl}
            />
          );
        })}
      </div>
    </main>
  );
};

export default DAO;
