import { ethos, EthosConnectStatus } from "ethos-connect";
import {
  AlertErrorMessage,
  AlertSucceed,
  DragAndDropImageForm,
  Label,
  NoConnectWallet,
  Tooltip,
} from "components";
import { classNames, formatSuiAddress, ORIGIN_CAPY_DAO_ID } from "utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Link from "next/link";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { fetchCapyStaking, signTransactionCreateCapySubDao } from "services/sui";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { ICapy } from "types";
import { storeNFT } from "services/ipfs";
import { FolderIcon } from "@heroicons/react/24/solid";

type Inputs = {
  // nftType: string;
  birthLocation: string;
  imageUrl: string;
  name: string;
  description: string;
  quorum: number;
  votingDelay: number;
  votingPeriod: number;
};

const locations = [
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AN",
  "AO",
  "AQ",
  "AR",
  "AS",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BM",
  "BN",
  "BO",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BZ",
  "CA",
  "CC",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CS",
  "CV",
  "CX",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FM",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HM",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "MG",
  "MH",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MP",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NF",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PW",
  "PY",
  "QA",
  "RE",
  "RO",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "ST",
  "SV",
  "SZ",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "UM",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VI",
  "VN",
  "VU",
  "WF",
  "WS",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
];

const CreateSubDAO = () => {
  const router = useRouter();
  const originDaoAddress = router.query.daoAddress as string;

  const { wallet, status } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

  const [frens, setFrens] = useState<ICapy[] | null>();
  const [image, setImage] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: {},
  } = useForm<Inputs>();

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        setFrens(null);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const fetchedFrens = fetchCapyStaking(nfts);
        console.log(fetchedFrens);
        if (fetchedFrens && fetchedFrens.length > 0) {
          setFrens(fetchedFrens);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchWalletFrens().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    if (!wallet) return;
    setWaitSui(true);
    try {
      if (!image) {
        toast.error("Please upload image");
        return;
      }
      form.imageUrl = await storeNFT(image);

      console.log(form);

      const requiredFren = frens?.find((fren) => fren.birth_location === form.birthLocation);
      if (!requiredFren) {
        toast.error("You don't have Capy Fren with this birth location");
        return;
      }

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateCapySubDao({
          name: form.name,
          description: form.description,
          image: form.imageUrl,
          quorum: form.quorum,
          voting_delay: form.votingDelay,
          voting_period: form.votingPeriod,
          birth_location: form.birthLocation,
          frens_id: requiredFren.id,
        }),
        options: {
          showEffects: true,
        },
      });
      console.log(response);

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("CreateDao");
        // go back to DAO page
        router.push(`/dao/${originDaoAddress}`).then();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  };

  const BradcrumbsHeader = () => {
    return (
      <nav className="mt-10 md:flex hidden" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link
              href="/dao"
              className="inline-flex items-center text-sm font-medium text-grayColor hover:text-black2Color"
            >
              <svg
                aria-hidden="true"
                className="mr-2 h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              <span className="text-sm font-medium">DAOs</span>
            </Link>
          </li>
          <li aria-current="page">
            <Link
              href={`/dao/${originDaoAddress}`}
              className="inline-flex items-center font-medium text-grayColor hover:text-black2Color"
            >
              <p className={"font-semibold text-grayColor md:ml-2 md:mr-2"}>/</p>
              <FolderIcon className={"mr-1.5 h-4 w-4"} />
              <span className="text-sm font-medium">{formatSuiAddress(originDaoAddress)}</span>
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center text-grayColor">
              <p className={"font-semibold md:ml-2 md:mr-2"}>/</p>
              <span className="text-sm font-medium">Create SubDAO</span>
            </div>
          </li>
        </ol>
      </nav>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Create DAO!"} />
  ) : originDaoAddress === ORIGIN_CAPY_DAO_ID ? (
    <main
      className={classNames(
        "z-10 mt-20 flex min-h-[100vh] flex-col gap-10 rounded-lg py-6 pl-2 pr-2 md:mt-20 md:min-h-[65vh] md:pl-16 md:pr-10",
      )}
    >
      <BradcrumbsHeader />

      <h1 className={"mt-14 text-2xl font-bold text-blackColor"}>New SubDAO</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={"mb-20 flex flex-col gap-6"}>
        <DragAndDropImageForm
          label="Image"
          className="h-40 w-40 cursor-pointer"
          name="image"
          handleChange={(file) => setImage(file)}
        />

        <div className={"flex flex-col"}>
          <div className={"flex justify-between"}>
            <Label label={"Name"} className={"text-blackColor"} />
            <p className={"text-sm text-black2Color"}>{`${watch("name")?.length}/200`}</p>
          </div>

          <input
            {...register("name", { required: true })}
            className={
              "mt-1 min-h-[40px] w-full rounded-md border border-black2Color bg-basicColor px-2 py-1"
            }
            maxLength={200}
            placeholder={"DAO Name"}
          />
        </div>

        <div className={"flex flex-col"}>
          <div className={"flex justify-between"}>
            <Label label={"Description"} className={"text-blackColor"} />
            <p className={"text-sm text-black2Color"}>{`${watch("description")?.length}/1000`}</p>
          </div>

          <textarea
            {...register("description", { required: true })}
            className={
              "mt-1 h-28 w-full resize-none rounded-md border border-black2Color bg-basicColor px-2 py-1"
            }
            maxLength={1000}
            placeholder={"DAO Description"}
          />
        </div>

        <div className={"flex flex-col"}>
          <div className={"flex content-center items-center gap-1"}>
            <Label label={"DAO Attribute(Birth location)"} className={"text-blackColor"} />
            <Tooltip
              text={
                "This will be a key feature for SubDAO. Only people with this trait can get in."
              }
            >
              <QuestionMarkCircleIcon className={"h-4 w-4 stroke-2 hover:text-pinkColor"} />
            </Tooltip>
          </div>
          {/*  select location */}
          <div className={"flex gap-2"}>
            <select
              {...register("birthLocation", { required: true })}
              className={
                "mt-1 min-h-[40px] w-full rounded-md border border-black2Color bg-basicColor px-2 py-1"
              }
            >
              <option value={""}>Select location</option>
              {locations.map((location) => (
                <option key={location} value={location} className={"w-full bg-blue-200"}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={"flex flex-col"}>
          <div className={"flex content-center items-center gap-1"}>
            <Label label={"Quorum"} className={"text-blackColor"} />
            <Tooltip text={"Votes required for a proposal to pass. (min 50 votes)"}>
              <QuestionMarkCircleIcon className={"h-4 w-4 stroke-2 hover:text-pinkColor"} />
            </Tooltip>
          </div>

          <input
            {...register("quorum", { required: true })}
            className={
              "mt-1 min-h-[40px] w-full rounded-md border border-black2Color bg-basicColor px-2 py-1"
            }
            placeholder={"100"}
            type={"number"}
            min={50}
            step={1}
          />
        </div>

        <div className={"flex flex-col"}>
          <div className={"flex content-center items-center gap-1"}>
            <Label label={"Voting Delay"} className={"text-blackColor"} />
            <Tooltip text={"Delay since proposal is created until voting starts (1-7 days)"}>
              <QuestionMarkCircleIcon className={"h-4 w-4 stroke-2 hover:text-pinkColor"} />
            </Tooltip>
          </div>

          <input
            {...register("votingDelay", { required: true })}
            className={
              "mt-1 min-h-[40px] w-full rounded-md border border-black2Color bg-basicColor px-2 py-1"
            }
            placeholder={"1"}
            type={"number"}
            min={1}
            max={7}
            step={1}
          />
        </div>

        <div className={"flex flex-col"}>
          <div className={"flex content-center items-center gap-1"}>
            <Label label={"Voting Period"} className={"text-blackColor"} />
            <Tooltip text={"Length of period during which people can vote (1-7 days)"}>
              <QuestionMarkCircleIcon className={"h-4 w-4 stroke-2 hover:text-pinkColor"} />
            </Tooltip>
          </div>

          <input
            {...register("votingPeriod", { required: true })}
            className={
              "mt-1 min-h-[40px] w-full rounded-md border border-black2Color bg-basicColor px-2 py-1"
            }
            placeholder={"7"}
            type={"number"}
            min={1}
            max={7}
            step={1}
          />
        </div>

        <div className={"flex gap-4"}>
          <button
            type="button"
            className={
              "rounded-2xl border border-purpleColor px-3 py-2 font-bold text-purpleColor hover:bg-purpleColor hover:text-white md:px-6 md:py-4"
            }
            onClick={router.back}
          >
            Cancel
          </button>
          <button
            className={"pinkColor-primary-state rounded-2xl px-3 py-2 font-bold md:px-6 md:py-4"}
            type={"submit"}
            disabled={waitSui}
          >
            Create DAO
          </button>
        </div>
      </form>
    </main>
  ) : (
    <main
      className={classNames(
        "z-10 mt-20 flex min-h-[100vh] flex-col gap-10 rounded-lg py-6 pl-2 pr-2 md:mt-20 md:min-h-[65vh] md:pl-16 md:pr-10",
      )}
    >
      <BradcrumbsHeader />
      <h1 className={"mt-14 text-2xl font-semibold text-blackColor"}>
        SubDAOs currently available only for Capy DAO.
      </h1>
    </main>
  );
};
export default CreateSubDAO;
