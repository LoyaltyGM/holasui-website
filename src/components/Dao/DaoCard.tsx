import Image from "next/image";
import TwitterIcon from "/public/img/twitterIcon.svg";
import Link from "next/link";

interface IDaoCard {
  title: string;
  description: string;
  twitterUrl: string;
  imageUrl: string;
  daoAddress: string;
}

export const DaoCard = (props: IDaoCard) => {
  const ImageDao = () => {
    return (
      <Image
        src={props.imageUrl || "/img/frens-logo.svg"}
        alt={"DAO Image"}
        className={"min-w-[160px] rounded-[11px] border border-black2Color bg-white object-cover"}
        width={160}
        height={340}
      />
    );
  };

  const InfoDao = () => {
    return (
      <div className={"w-full justify-between px-5 pt-5"}>
        <div
          className={
            "flex max-h-[40px] min-h-[40px] content-center items-center justify-between md:max-h-[40px] md:min-h-[40px] "
          }
        >
          <h1 className={"text-xl font-semibold text-blackColor"}>{props.title}</h1>
          <a href={props.twitterUrl} target={"_blank"} className={"hidden md:flex"}>
            <Image src={TwitterIcon} alt={"Twitter Icon"} className={"h-5 w-5 cursor-pointer"} />
          </a>
        </div>
        <p
          className={
            "mt-3 max-h-[110px] min-h-[110px] w-full overflow-hidden text-ellipsis text-lg text-black2Color md:max-h-[117px] md:min-h-[117px] md:text-base"
          }
        >
          {props.description}
        </p>
        <div className={"mb-3"}>
          <Link href={`/dao/${props.daoAddress}`}>
            <button className={"py-3 pr-4 font-medium text-pinkColor underline underline-offset-4"}>
              Learn more
            </button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className={"flex h-[240px] w-full rounded-xl border border-black2Color bg-white"}>
      <ImageDao />
      <InfoDao />
    </div>
  );
};
