import { GetServerSideProps, NextPage } from "next";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet, ProposalCard } from "components";
import { classNames, convertIPFSUrl, formatSuiAddress } from "utils";
import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, FolderIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import ExternalWebsiteIcon from "/public/img/ExternalLinkIcon.svg";
import SuiToken from "/public/img/SuiToken.png";
import Link from "next/link";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { IDao, IProposal } from "types/daoInterface";
import frensLogo from "/public/img/frens-logo.svg";

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
  const [dao, setDao] = useState<IDao>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subdaos, setSubdaos] = useState<IDao[]>();
  const [proposals, setProposals] = useState<IProposal[]>();

  useEffect(() => {
    setIsLoading(true);
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
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
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
        ).then((subdao) => {
          setSubdaos([...subdao] as IDao[]);
        });
      } catch (e) {
        console.log(e);
      }
    }

    async function fetchProposals() {
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
        ).then((proposal) => {
          setProposals([...proposal] as IProposal[]);
        });
      } catch (e) {
        console.log(e);
      }
    }

    fetchSubdaos().then();
    fetchProposals().then();
  }, [dao]);

  const InfoDao = () => {
    return (
      <div className={"mt-10"}>
        <div className={"flex w-full justify-between"}>
          <div className={"flex w-full justify-between"}>
            <div className={"flex gap-4"}>
              <Image
                src={dao?.image || frensLogo}
                alt={"logo-dao"}
                height={150}
                width={150}
                className={
                  "h-[150px] max-h-[150px] min-h-[150px] w-[150px] min-w-[150px] max-w-[150px] rounded-full border border-blackColor"
                }
              />
              <div>
                <div className={"flex content-center items-center justify-start gap-3"}>
                  <h1 className={"text-4xl font-semibold text-blackColor"}>{dao?.name}</h1>
                  {daoAddress ? (
                    <a href={`https://suivision.xyz/object/${daoAddress}`} target={"_blank"}>
                      <Image
                        src={ExternalWebsiteIcon}
                        alt={"external website icon"}
                        className={"h-4 w-4 cursor-pointer"}
                      />
                    </a>
                  ) : null}
                </div>
                <InfoDaoDescription />
              </div>
            </div>

            <div className={"flex w-1/4 flex-col justify-center"}>
              <Link href={`/dao/${daoAddress}/create-subdao`}>
                <button className={"button-secondary button-shadow"}>
                  <p className={""}>Create SubDAO</p>
                </button>
              </Link>
              <div
                className={
                  "mt-2 flex w-full cursor-pointer justify-center px-2 text-xs text-black2Color underline underline-offset-4 hover:text-pinkColor "
                }
              >
                What is Sub DAO?
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InfoDaoDescription = () => {
    return (
      <div
        className={
          "mr-2 mt-4 max-h-[100px] min-h-[70px] w-full overflow-hidden text-clip text-base font-bold text-black2Color"
        }
      >
        <p className={"w-full"}>
          {dao?.description} askkasks akalsalk asksak sakksa askkasks akalsalk asksak sakksa
          askkasks akalsalk asksak sakksa
        </p>
      </div>
    );
  };

  const Treasury = () => {
    return (
      <div
        className={
          "mt-12 min-h-[125px] w-full content-center items-center justify-between rounded-xl border-2 border-grayColor bg-white px-8 py-6"
        }
      >
        <div className={"flex w-full"}>
          <div className={"w-full"}>
            <p className={"text-lg font-bold text-grayColor"}>Treasury</p>
            <div
              className={
                "mt-4 flex content-center items-center gap-2 text-3xl font-bold text-blackColor"
              }
            >
              <Image src={SuiToken} alt={"sui token logo"} className={"h-9 w-9"} />
              <p className={"text-blackColor"}>{dao?.treasury}</p>
              <p>SUI</p>
            </div>
          </div>
          <div className={"w-1/4"}>
            <button
              className={
                "button-primary button-shadow w-min-[130px] w-max-[130px] mt-4 flex max-h-[48px] min-h-[48px] content-center items-center font-bold text-white"
              }
            >
              Fund treasury
            </button>
          </div>
        </div>
        <p className={"mt-4 max-w-full text-sm text-black2Color"}>
          This treasury exists for {dao?.name} participants to allocate resources for the long-term
          growth and prosperity of the project.
        </p>
      </div>
    );
  };

  const SubdaosCards = () => {
    const [isLeftVisible, setIsLeftVisible] = useState(false);
    const [isRightVisible, setIsRightVisible] = useState(true);
    const scrollContainer = useRef<any>(null);

    const checkScroll = () => {
      console.log("scrollWidth", scrollContainer.current.scrollWidth);
      setIsLeftVisible(scrollContainer.current.scrollLeft > 0);
      setIsRightVisible(
        scrollContainer.current.scrollWidth >
          scrollContainer.current.clientWidth + scrollContainer.current.scrollLeft + 1,
      );
    };

    const scroll = (scrollOffset: number) => {
      scrollContainer.current.scrollLeft += scrollOffset;
      checkScroll();
    };

    const Title = () => {
      return <p className={"text-2xl font-bold"}>Sub CapyDAO</p>;
    };

    return (
      <div className={"mt-14"}>
        <Title />
        <div className="mt-10 flex gap-8">
          <button
            className="z-[9] cursor-pointer content-center px-3 py-2"
            disabled={!isLeftVisible}
            onClick={() => scroll(-335)}
          >
            <div
              className={classNames(
                "rounded-xl border stroke-[2px] p-2",
                isLeftVisible
                  ? "border-blackColor text-blackColor"
                  : "border-grayColor text-grayColor",
              )}
            >
              <ChevronLeftIcon className={"h-5 w-5"} />
            </div>
          </button>
          <div
            ref={scrollContainer}
            onScroll={checkScroll}
            className="hide-scroll-bar flex w-full cursor-pointer gap-16 overflow-x-scroll"
          >
            {/* Here you would map through your cards. I'm just using a static example */}
            {subdaos?.map((subdao, index) => (
              <div
                key={index}
                className="mr-4 flex h-[170px] min-w-[256px] max-w-[256px] rounded-xl border-2 border-blackColor bg-yellowColor"
              >
                <p className="z-[9] px-5 py-4 text-xl font-bold text-white">{subdao.name}</p>
                <Image
                  src={subdao.image}
                  alt="capy"
                  className="z-[9] h-full min-w-[110px] max-w-[110px] rounded-r-lg object-cover"
                  width={200}
                  height={250}
                />
              </div>
            ))}
            {/* Other cards */}
          </div>
          <button
            className="z-[9] cursor-pointer px-3 py-2"
            disabled={!isRightVisible}
            onClick={() => scroll(335)}
          >
            <div
              className={classNames(
                "rounded-xl border stroke-[2px] p-2",
                isRightVisible
                  ? "border-blackColor text-blackColor"
                  : "border-grayColor text-grayColor",
              )}
            >
              <ChevronRightIcon className={"h-5 w-5"} />
            </div>
          </button>
        </div>
      </div>
    );
  };

  const Proposals = () => {
    return (
      <div className={"mb-10 mt-14"}>
        <div className={"mt-10 flex content-center items-center justify-between"}>
          <p className={"text-2xl font-bold"}>Proposals</p>
          <Link href={`/dao/${daoAddress}/create-proposal`}>
            <button className={"button-primary button-shadow px-5 py-3"}>Submit Proposal</button>
          </Link>
        </div>
        <div className={"mt-10 flex flex-col gap-2 space-y-4"}>
          {proposals
            ?.map((proposal, index) => (
              <Link href={`/dao/${daoAddress}/${proposal.id}`} key={index}>
                <ProposalCard proposal={proposal} index={index + 1} />
              </Link>
            ))
            .reverse()}
        </div>
      </div>
    );
  };

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
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <main
      className={classNames(
        "mt-18 z-10 mt-8 flex min-h-[100vh] flex-col rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] md:pl-16 md:pr-10 ",
      )}
    >
      {!isLoading ? (
        <>
          <BradcrumbsHeader />
          <InfoDao />
          <Treasury />
          {/*<SubDAO />*/}
          <SubdaosCards />
          <Proposals />
        </>
      ) : (
        <>
          {/*Skeleton Animation*/}
          {/*BradcrumbsHeader*/}
          <div className="mt-24 flex h-8 w-full animate-pulse rounded-2xl bg-gray2Color" />
          {/*InfoDao*/}
          <div className={"mt-10"}>
            <div className={"flex w-full justify-between"}>
              <div className={"flex w-full justify-between"}>
                <div className={"mr-4 flex w-full gap-4"}>
                  <div
                    className={
                      "h-[150px] max-h-[150px] min-h-[150px]  w-full min-w-[150px] max-w-[150px] animate-pulse rounded-full bg-gray2Color"
                    }
                  />
                  <div className={"w-full"}>
                    <div
                      className={
                        "flex h-10 w-3/4 content-center items-center justify-start gap-3 rounded-2xl bg-gray2Color"
                      }
                    ></div>
                    <div
                      className={"mt-4 h-20 min-w-full animate-pulse rounded-2xl bg-gray2Color"}
                    ></div>
                  </div>
                </div>

                <div className={"flex w-1/4 flex-col justify-center"}>
                  <button className={"button-secondary button-shadow animate-pulse"} disabled>
                    <p className={""}>Create SubDAO</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/*Treasury*/}
          <div
            className={
              "mt-12 min-h-[125px] w-full animate-pulse content-center items-center justify-between rounded-xl bg-gray2Color px-8 py-6"
            }
          />
        </>
      )}
    </main>
  );
};

export default DetailDaoAddress;
