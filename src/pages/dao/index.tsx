import { ethos, EthosConnectStatus } from "ethos-connect";
import { classNames, convertIPFSUrl, DAO_HUB_ID, ORIGIN_CAPY_DAO_ID } from "utils";
import { DaoCard, NoConnectWallet } from "components";
import Link from "next/link";
import { useEffect, useState } from "react";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { IDao } from "types/daoInterface";

const DAO = () => {
  const { status } = ethos.useWallet();
  const [capyDao, setCapyDao] = useState<IDao>();
  const [daos, setDaos] = useState<IDao[]>([]);

  useEffect(() => {
    async function fetchCapyDao() {
      try {
        const daoObject = await suiProvider.getObject({
          id: ORIGIN_CAPY_DAO_ID,
          options: {
            showContent: true,
          },
        });
        const dao = getObjectFields(daoObject) as any;
        dao.id = dao.id?.id;
        dao.image = convertIPFSUrl(dao.image);

        setCapyDao(getObjectFields(daoObject) as IDao);
      } catch (e) {
        console.log(e);
      }
    }

    async function fetchDaos() {
      try {
        setDaos([]);

        const daoHubObject = await suiProvider.getObject({
          id: DAO_HUB_ID,
          options: {
            showContent: true,
          },
        });

        const daosId = getObjectFields(daoHubObject)!.daos!.fields!.contents!.fields!.id.id;

        const response = await suiProvider.getDynamicFields({
          parentId: daosId,
        });
        Promise.all(
          response?.data?.map(async (df): Promise<IDao> => {
            const dfObject = getObjectFields(
              await suiProvider.getObject({
                id: df?.objectId!,
                options: { showContent: true },
              }),
            );

            const dao = getObjectFields(
              await suiProvider.getObject({
                id: dfObject?.value,
                options: {
                  showContent: true,
                },
              }),
            )!;
            dao.id = dao.id?.id;
            dao.image = convertIPFSUrl(dao.image);

            return dao as IDao;
          }),
        ).then((daos) => {
          setDaos(daos);
        });
      } catch (e) {
        console.log(e);
      }
    }

    fetchCapyDao().then();
    fetchDaos().then();
  }, []);

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
        <Link
          href={"dao/create-dao"}
          className={"button-primary button-shadow px-5 py-3 font-bold"}
        >
          Create DAO
        </Link>
      </div>
      <div className={"mb-20 mt-10 grid grid-cols-1 gap-5 md:grid-cols-2"}>
        <DaoCard
          key={capyDao?.id}
          daoAddress={capyDao?.id!}
          title={capyDao?.name!}
          description={capyDao?.description!}
          imageUrl={capyDao?.image!}
          twitterUrl={"https://twitter.com/suinsdapp"}
        />
        {daos.map((dao) => {
          return (
            <DaoCard
              key={dao.id}
              daoAddress={dao.id}
              title={dao.name}
              description={dao.description}
              imageUrl={dao.image}
              twitterUrl={""}
            />
          );
        })}
      </div>
    </main>
  );
};

export default DAO;
