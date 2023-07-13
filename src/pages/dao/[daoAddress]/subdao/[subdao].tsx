import { GetServerSideProps, NextPage } from "next";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet, Proposals, Treasury, DAOInfo, SkeletonDAOMain } from "components";
import { classNames, convertIPFSUrl, formatSuiAddress } from "utils";
import { useEffect, useState } from "react";
import { FolderIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { IDao, IProposal } from "types/daoInterface";

interface ISubDaoAddressProps {
  daoAddress: string;
  subDaoAddress: string;
}

export const getServerSideProps: GetServerSideProps<ISubDaoAddressProps> = async ({ params }) => {
  try {
    const daoAddress = params?.daoAddress as string;
    const subDaoAddress = params?.subdao as string;
    return {
      props: {
        daoAddress,
        subDaoAddress,
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

const DetailSubDaoAddress: NextPage<ISubDaoAddressProps> = ({ daoAddress, subDaoAddress }) => {
  const { status } = ethos.useWallet();
  // Loading for skeleton animation
  const [isDaoLoading, setIsDaoLoading] = useState<boolean>(true);
  const [isProposalsLoading, setIsProposalsLoading] = useState<boolean>(true);

  const nftType: string =
    "0xee496a0cc04d06a345982ba6697c90c619020de9e274408c7819f787ff66e1a1::capy::Capy";

  // states for data
  const [dao, setDao] = useState<IDao>();
  const [subdao, setSubdao] = useState<IDao>();
  const [proposals, setProposals] = useState<IProposal[]>();

  useEffect(() => {
    setIsDaoLoading(true);
    async function fetchSubdaos() {
      try {
        const subdao = getObjectFields(
          await suiProvider.getObject({
            id: subDaoAddress,
            options: {
              showContent: true,
            },
          }),
        )!;

        console.log("SubDAO Fields", subdao);
        subdao.image = convertIPFSUrl(subdao.image);
        subdao.id = subdao.id.id;
        subdao.proposals = subdao.proposals?.fields?.id?.id;
        return subdao as IDao;
      } catch (e) {
        console.log(e);
      }
    }
    fetchSubdaos()
      .then((subDao) => setSubdao(subDao))
      .finally(() => setIsDaoLoading(false));
  }, []);
  useEffect(() => {
    setIsProposalsLoading(true);
    async function fetchProposals() {
      try {
        if (!subdao?.proposals) return;

        setProposals([] as IProposal[]);

        const response = await suiProvider.getDynamicFields({
          parentId: subdao?.proposals,
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
        ).then((proposal) => {
          setProposals([...proposal] as IProposal[]);
        });
      } catch (e) {
        console.log(e);
      }
    }
    fetchProposals()
      .then()
      .finally(() => setIsProposalsLoading(false));
  }, [subdao]);

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
            <Link
              href={`/dao/${daoAddress}`}
              className="flex items-center hover:text-black2Color text-grayColor"
            >
              <p className={"font-semibold text-grayColor md:ml-2 md:mr-2"}>/</p>
              <FolderIcon className={"mr-1.5 h-4 w-4 "} />
              <span className="text-sm font-medium">
                CapyDAO({formatSuiAddress(daoAddress, 2, 2)})
              </span>
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <p className={"font-semibold text-grayColor md:ml-2 md:mr-2"}>/</p>
              <FolderIcon className={"mr-1.5 h-4 w-4 text-black2Color"} />
              <span className="text-sm font-medium text-black2Color">
                SubDAO({formatSuiAddress(subDaoAddress)})
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
          <DAOInfo daoAddress={daoAddress} dao={subdao!} isSubDao={true} />
          <Treasury dao={subdao!} dao_type={"capy_subdao"} nft_type={nftType} />
          <Proposals daoAddress={daoAddress} proposals={proposals!} isSubDao={true} />
        </>
      ) : (
        <SkeletonDAOMain />
      )}
    </main>
  );
};

export default DetailSubDaoAddress;
