import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet } from "../../components";
import { classNames } from "../../utils";
import { DaoCard } from "../../components/Dao";

const DAO = () => {
  const { status, wallet } = ethos.useWallet();
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
      description: "Description Description Description Description Description Description Description Description Description\n" +
          "Description Description Description Description Description{\" \"}",
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
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <main
      className={classNames(
        "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 "
      )}
    >
      <div className={"flex justify-between content-center items-center mt-16"}>
        <h1 className={"text-blackColor text-4xl font-semibold"}>Hola, DAOs</h1>
        <button className={"bg-redColor rounded-2xl text-white font-bold py-4 px-6"}>Create DAO</button>
      </div>
      <div className={"grid grid-cols-2 gap-5 mt-10"}>
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
