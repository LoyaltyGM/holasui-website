import Image from "next/image";
import frensLogo from "/public/img/frens-logo.svg";
import ExternalWebsiteIcon from "/public/img/ExternalLinkIcon.svg";
import Link from "next/link";
import { IDao } from "types/daoInterface";

export const DAOInfo = ({ dao, daoAddress }: { dao: IDao; daoAddress: string }) => {
  const InfoDaoDescription = () => {
    return (
      <div
        className={
          "mr-2 mt-4 max-h-[100px] min-h-[70px] w-full overflow-hidden text-clip text-base font-bold text-black2Color"
        }
      >
        <p className={"w-full"}>{dao?.description}</p>
      </div>
    );
  };

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
