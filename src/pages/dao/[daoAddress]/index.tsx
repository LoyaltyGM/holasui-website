import { GetServerSideProps, NextPage } from "next";
import { ethos, EthosConnectStatus } from "ethos-connect";
import {
  NoConnectWallet,
  Proposals,
  SubdaosCards,
  Treasury,
  DAOInfo,
  SkeletonDAOMain,
  SkeletonSubDAO,
} from "components";
import { classNames, convertIPFSUrl, formatSuiAddress } from "utils";
import { useEffect, useState } from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { IDao, IProposal } from "types/daoInterface";

interface IDaoAddressProps {
  daoAddress: string;
}

export const getServerSideProps: GetServerSideProps<IDaoAddressProps> = async ({ params }) => {
  try {
    const daoAddress = params?.daoAddress as string;
    return {
      props: {
        daoAddress,
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

const DetailDaoAddress: NextPage<IDaoAddressProps> = ({ daoAddress }) => {
  const { status } = ethos.useWallet();
  // Loading for skeleton animation
  const [isDaoLoading, setIsDaoLoading] = useState<boolean>(true);
  const [isSubdaosLoading, setIsSubdaosLoading] = useState<boolean>(true);
  const [isProposalsLoading, setIsProposalsLoading] = useState<boolean>(true);

  // states for data
  const [dao, setDao] = useState<IDao>();
  const [subdaos, setSubdaos] = useState<IDao[]>();
  const [proposals, setProposals] = useState<IProposal[]>();

  useEffect(() => {
    setIsDaoLoading(true);
    async function fetchDao() {
      try {
        const daoObject = await suiProvider.getObject({
          id: daoAddress,
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

    fetchDao()
      .then()
      .finally(() => setIsDaoLoading(false));
  }, []);

  useEffect(() => {
    setIsSubdaosLoading(true);
    async function fetchSubdaos() {
      try {
        if (!dao?.subdaos) return;
        setSubdaos([] as IDao[]);

        const response = await suiProvider.getDynamicFields({
          parentId: dao?.subdaos,
        });
        Promise.all(
          response?.data?.map(async (df): Promise<IDao> => {
            const dfObject = getObjectFields(
              await suiProvider.getObject({
                id: df?.objectId!,
                options: { showContent: true },
              }),
            );

            const subdao = getObjectFields(
              await suiProvider.getObject({
                id: dfObject?.value,
                options: {
                  showContent: true,
                },
              }),
            )!;
            subdao.image = convertIPFSUrl(subdao.image);

            return subdao as IDao;
          }),
        )
          .then((subdao) => {
            setSubdaos([...subdao] as IDao[]);
          })
          .finally(() => setIsSubdaosLoading(false));
      } catch (e) {
        console.log(e);
      }
    }

    async function fetchProposals() {
      setIsProposalsLoading(true);
      try {
        if (!dao?.proposals) return;

        setProposals([] as IProposal[]);

        const response = await suiProvider.getDynamicFields({
          parentId: dao?.proposals,
        });
        Promise.all(
          response?.data?.map(async (df): Promise<IProposal> => {
            const proposal = getObjectFields(
              await suiProvider.getObject({
                id: df?.objectId!,
                options: { showContent: true },
              }),
            )!;
            proposal.id = proposal?.id?.id;
            return proposal as IProposal;
          }),
        )
          .then((proposal) => {
            setProposals([...proposal] as IProposal[]);
          })
          .finally(() => setIsProposalsLoading(false));
      } catch (e) {
        console.log(e);
      }
    }
    fetchSubdaos().then();
    fetchProposals().then();
  }, [dao]);

  const BradcrumbsHeader = () => {
    return (
      <nav className="mt-24 flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1">
          <li className="inline-flex items-center">
            <Link
              href="/dao"
              className="inline-flex items-center text-sm font-medium text-grayColor hover:text-black2Color"
            >
              <FolderIcon className={"mr-1.5 h-4 w-4"} />
              <p>Hola DAOs</p>
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <p className={"font-semibold text-grayColor md:ml-2 md:mr-2"}>/</p>
              <FolderIcon className={"mr-1.5 h-4 w-4 text-black2Color"} />
              <span className="text-sm font-medium text-black2Color">
                {formatSuiAddress(daoAddress)}
              </span>
            </div>
          </li>
        </ol>
      </nav>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"DAO!"} />
  ) : (
    <main
      className={classNames(
        "mt-18 z-10 mt-8 flex min-h-[100vh] flex-col rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] md:pl-16 md:pr-10 ",
      )}
    >
      {!isDaoLoading ? (
        <>
          <BradcrumbsHeader />
          <DAOInfo daoAddress={daoAddress} dao={dao!} />
          <Treasury dao={dao!} />
          {!isSubdaosLoading ? <SubdaosCards subDAOs={subdaos!} /> : <SkeletonSubDAO />}
          <Proposals daoAddress={daoAddress} proposals={proposals!} />
        </>
      ) : (
        <SkeletonDAOMain />
      )}
    </main>
  );
};

export default DetailDaoAddress;
