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
        src={props.imageUrl}
        alt={"DAO Image"}
        className={"min-w-[160px] bg-white object-cover border border-grayColor rounded-[11px]"}
        width={160}
        height={340}
      ></Image>
    );
  };

  const InfoDao = () => {
    return (
      <div className={"justify-between min-w-[340px] px-5 pt-5"}>
        <div className={"flex content-center justify-between items-center"}>
          <h1 className={"text-blackColor text-xl font-semibold"}>{props.title}</h1>
          <a href={props.twitterUrl} target={"_blank"}>
            <Image src={TwitterIcon} alt={"Twitter Icon"} className={"w-5 h-5 cursor-pointer"} />
          </a>
        </div>
        <p className={"text-grayColor mt-3 text-ellipsis overflow-hidden min-h-[120px] max-h-[120px]"}>
          {props.description}
        </p>
        <div className={"mb-3"}>
          <Link href={`/dao/${props.daoAddress}`}>
            <button className={"text-redColor underline underline-offset-2 pr-4 py-3"}>Learn more</button>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className={"flex bg-white h-[240px] border-grayColor border rounded-xl"}>
      <ImageDao />
      <InfoDao />
    </div>
  );
};
