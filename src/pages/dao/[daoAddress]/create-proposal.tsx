import { ethos, EthosConnectStatus } from "ethos-connect";
import { Label, NoConnectWallet } from "components";
import { classNames, formatSuiAddress } from "utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { RadioGroup } from "@headlessui/react";

type Inputs = {
  name: string;
  description: string;
  type: string;
};
const proposalTypes = ["Voting", "Execution"];
const CreateProposal = () => {
  const router = useRouter();
  const { wallet, status } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

  const { register, setValue, handleSubmit, watch } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    if (!wallet) return;
    setWaitSui(true);
    try {
      console.log(form);

      /*
        const response = await wallet.signAndExecuteTransactionBlock({
        });

        const status = getExecutionStatus(response);

        if (status?.status === "failure") {
          console.log(status.error);
          const error_status = getExecutionStatusError(response);
          if (error_status) AlertErrorMessage(error_status);
        } else {
          AlertSucceed("CreateDao");
        }
      */
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

        {/* Type Voting or Execution  radio group*/}
        <div>
          <Label label={"Type"} />
          <RadioGroup
            value={watch("type")}
            onChange={(value) => {
              setValue("type", value);
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
            Create DAO
          </button>
        </div>
      </form>
    </main>
  );
};
export default CreateProposal;
