import Image from "next/image";
import frensLogo from "/public/img/frens-logo.svg";
import ExternalWebsiteIcon from "/public/img/ExternalLinkIcon.svg";
import Link from "next/link";
import { IDao } from "types/daoInterface";
import { classNames } from "../../../utils";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export const DAOInfo = ({
  dao,
  daoAddress,
  isSubDao = false,
}: {
  dao: IDao;
  daoAddress: string;
  isSubDao?: boolean;
}) => {
  const [openedDialog, setOpenedDialog] = useState(false);

  const InfoDaoDescription = () => {
    return (
      <div
        className={
          "pr-6 mt-4 max-h-[100px] min-h-[70px] w-full overflow-hidden text-clip text-base font-bold text-black2Color"
        }
      >
        <p className={"w-full"}>{dao?.description}</p>
      </div>
    );
  };

  return (
    <div className={"mt-10"}>
      <div className={"flex w-full justify-between"}>
        <div className={"md:flex w-full md:justify-between"}>
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

          <div
            className={classNames(
              "flex w-full mt-2 md:mt-0 md:w-1/3 flex-col",
              isSubDao
                ? "justify-start items-start content-start md:justify-center md:items-center md:content-start"
                : "justify-start items-start content-start md:justify-center md:items-center md:content-center",
            )}
          >
            {isSubDao ? (
              <div className={"py-2 px-3 bg-yellowColor/30 text-blackColor rounded-lg"}>SubDAO</div>
            ) : (
              <Link href={`/dao/${daoAddress}/create-subdao`}>
                <button
                  className={
                    "button-secondary button-shadow content-center items-center justify-center max-h-[48px] min-h-[48px]"
                  }
                >
                  Create SubDAO
                </button>
              </Link>
            )}
            <div
              className={
                "mt-2 flex justify-center cursor-pointer md:px-4 text-xs text-black2Color underline underline-offset-4 hover:text-pinkColor "
              }
              onClick={() => setOpenedDialog(true)}
            >
              What is Sub DAO?
            </div>
          </div>
        </div>
      </div>

      <WhatIsSubdaoDialog openDialog={openedDialog} setOpenDialog={setOpenedDialog} />
    </div>
  );
};

interface IWhatIsSubdaoDialog {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const WhatIsSubdaoDialog = ({ openDialog, setOpenDialog }: IWhatIsSubdaoDialog) => {
  return (
    <Transition.Root show={openDialog} as={Fragment}>
      <Dialog
        as="div"
        className={classNames("relative z-10")}
        onClose={() => {
          setOpenDialog(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-basicColor px-10 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <Dialog.Title
                className={classNames(
                  "mb-2 flex justify-between  text-center text-base font-bold leading-6 text-black2Color",
                )}
              >
                <p className="mt-1"></p>
                <p className={classNames("mt-1 font-bold text-blackColor")}>What is Subdao?</p>
                <button onClick={() => setOpenDialog(false)}>
                  <XMarkIcon className="flex h-7 w-7 md:hidden" />
                </button>
              </Dialog.Title>
              <div className={"flex flex-col gap-6"}>
                <p>
                  A SubDAO is essentially a miniature version of the main DAO, established around
                  distinct items or attributes inherent in the main DAO. For example, you can form a
                  SubDAO focused on specific traits such as hats, glasses, or even the country of
                  origin (as is the case with Capy). This SubDAO will maintain all the operational
                  features of the larger DAO but will be specifically catered to these unique
                  traits. At present, SubDAO capabilities are only accessible for CapyDAO. If you
                  wish to incorporate your NFT collection into a SubDAO, we welcome you to direct
                  message us on Twitter or Discord. Availing this service is absolutely free.
                </p>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
