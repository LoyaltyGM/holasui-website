import { ethos, EthosConnectStatus } from "ethos-connect";
import { AlertErrorMessage, AlertSucceed, Label, NoConnectWallet } from "components";
import { classNames, formatSuiAddress } from "utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RadioGroup } from "@headlessui/react";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { fetchCapyStaking, signTransactionCreateCapyDaoProposal } from "services/sui";
import { ICapy } from "types";
import toast from "react-hot-toast";

type Inputs = {
  name: string;
  description: string;
  type: string;
  recipient?: string | null;
  amount?: number | null;
};

const proposalTypes = ["Voting", "Funding"];

const CreateProposal = () => {
  const router = useRouter();
  const originDaoAddress = router.query.daoAddress as string;
  const { wallet, status } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

  const [frens, setFrens] = useState<ICapy[] | null>();
  const { register, setValue, handleSubmit, watch } = useForm<Inputs>({
    defaultValues: {
      type: proposalTypes[0],
    },
  });

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        setFrens(null);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const fetchedFrens = fetchCapyStaking(nfts);
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
      console.log(form);

      if (!frens || frens.length === 0) {
        toast.error("You don't have Capy Fren");
        return;
      }
      const requiredFren = frens[0];

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateCapyDaoProposal({
          isSubDao: false,
          frens_id: requiredFren.id,
          name: form.name,
          description: form.description,
          type: form.type === "Voting" ? 0 : 1,
          dao_id: originDaoAddress,
          recipient: form.recipient || null,
          amount: form.amount || null,
        }),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("CreateDao");
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
      <nav className="mt-10 flex" aria-label="Breadcrumb">
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
              DAOs
            </Link>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-300 md:ml-2">
                {formatSuiAddress(router.query.daoAddress as string)}
              </span>
            </div>
          </li>

          <li aria-current="page">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-300 md:ml-2">
                Create Proposal
              </span>
            </div>
          </li>
        </ol>
      </nav>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Create DAO!"} />
  ) : (
    <main
      className={classNames(
        "z-10 mt-20 flex min-h-[100vh] flex-col gap-10 rounded-lg py-6 pl-2 pr-2 md:mt-20 md:min-h-[65vh] md:pl-16 md:pr-10",
      )}
    >
      <BradcrumbsHeader />

      <h1 className={"text-2xl font-bold"}>New Proposal</h1>
      <form onSubmit={handleSubmit(onSubmit)} className={"flex flex-col gap-6"}>
        <div className={"flex flex-col"}>
          <div className={"flex justify-between"}>
            <Label label={"Name"} />
            <p className={"text-sm text-black2Color"}>{`${watch("name")?.length}/200`}</p>
          </div>

          <input
            {...register("name", { required: true })}
            className={"mt-1 w-full rounded-md border border-black2Color px-2 py-1"}
            maxLength={200}
            placeholder={"DAO Name"}
          />
        </div>

        <div className={"flex flex-col"}>
          <div className={"flex justify-between"}>
            <Label label={"Description"} />
            <p className={"text-sm text-black2Color"}>{`${watch("description")?.length}/1000`}</p>
          </div>

          <textarea
            {...register("description", { required: true })}
            className={
              "mt-1 h-28 w-full resize-none rounded-md border border-black2Color px-2 py-1"
            }
            maxLength={1000}
            placeholder={"DAO Description"}
          />
        </div>

        <div>
          <Label label={"Type"} />
          <RadioGroup
            value={watch("type")}
            onChange={(value) => {
              setValue("type", value);
              if (value === "Voting") {
                setValue("recipient", null);
                setValue("amount", null);
              }
            }}
            className="mt-2"
          >
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {proposalTypes.map((type) => (
                <RadioGroup.Option
                  key={type}
                  value={type}
                  className={({ checked }) =>
                    classNames(
                      checked
                        ? "bg-pinkColor text-white"
                        : "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
                      "flex cursor-pointer items-center justify-center rounded-full px-3 py-3 text-sm font-semibold uppercase sm:flex-1",
                    )
                  }
                >
                  <RadioGroup.Label as="span">{type}</RadioGroup.Label>
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>

        {/*Shot recipient and amount inputs if type Funding */}
        {watch("type") === "Funding" && (
          <>
            <div className={"flex flex-col"}>
              <Label label={"Recipient"} />
              <input
                {...register("recipient", { required: true })}
                className={"mt-1 w-full rounded-md border border-black2Color px-2 py-1"}
                placeholder={"Recipient"}
              />
            </div>

            <div className={"flex flex-col"}>
              <Label label={"Amount"} />

              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  {...register("amount", { required: true })}
                  className={"w-full rounded-md border border-black2Color px-2 py-1"}
                  placeholder={"Amount"}
                  type={"number"}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-6">
                  <span className="text-sm text-gray-500">SUI</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className={"flex gap-4"}>
          <button
            type="button"
            className={"rounded-2xl border border-pinkColor px-3 py-2 font-bold md:px-6 md:py-4"}
            onClick={router.back}
          >
            Cancel
          </button>
          <button
            className={"pinkColor-primary-state rounded-2xl px-3 py-2 font-bold md:px-6 md:py-4"}
            type={"submit"}
            disabled={waitSui}
          >
            Create Proposal
          </button>
        </div>
      </form>
    </main>
  );
};
export default CreateProposal;
