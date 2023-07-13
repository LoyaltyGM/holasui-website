import Image from "next/image";
import SuiToken from "/public/img/SuiToken.png";
import { DaoType, IDao } from "types/daoInterface";
import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { classNames } from "utils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { AlertErrorMessage, Label } from "components";
import { signTransactionDepositToTreasury } from "services/sui";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { ethos } from "ethos-connect";
import toast from "react-hot-toast";

export const Treasury = ({
  dao,
  dao_type,
  nft_type,
}: {
  dao: IDao;
  dao_type: DaoType;
  nft_type: string;
}) => {
  const { wallet } = ethos.useWallet();

  const [openedDialog, setOpenedDialog] = useState(false);
  const [waitSui, setWaitSui] = useState(false);

  const onSubmit = async (amount: number) => {
    if (!wallet) return;
    setWaitSui(true);
    try {
      if (!amount || amount <= 0) {
        toast.error("Please input amount");
        return;
      }

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionDepositToTreasury({
          dao_type: dao_type,
          amount: amount,
          dao_id: dao.id,
          type: nft_type,
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
        toast.success("Successfully funded!");
        setOpenedDialog(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  };

  return (
    <div
      className={
        "mt-12 min-h-[125px] w-full content-center items-center justify-between rounded-xl border-2 border-grayColor bg-white px-8 py-6"
      }
    >
      <div className={"md:flex w-full"}>
        <div className={"w-full"}>
          <p className={"text-lg font-bold text-grayColor"}>Treasury</p>
          <div
            className={
              "mt-4 flex content-center items-center gap-2 text-3xl font-bold text-blackColor"
            }
          >
            <Image src={SuiToken} alt={"sui token logo"} className={"h-9 w-9"} />
            <p className={"text-blackColor"}>{dao?.treasury / 1e9}</p>
            <p>SUI</p>
          </div>
        </div>
        <div className={"md:w-1/4 w-full"}>
          <button
            className={
              "button-primary button-shadow  w-full md:w-min-[130px] md:w-max-[130px] mt-4 flex max-h-[48px] min-h-[48px] justify-center content-center items-center font-bold text-white"
            }
            onClick={() => setOpenedDialog(true)}
          >
            Fund treasury
          </button>
        </div>
      </div>
      <p className={"mt-4 max-w-full text-xs md:text-sm text-black2Color"}>
        This treasury exists for {dao?.name} participants to allocate resources for the long-term
        growth and prosperity of the project. In order to withdraw from the treasury, you need to
        initiate a proposal for fund withdrawal. Following a successful execution of the proposal,
        the funds will be transferred directly to the recipient's wallet. The creators of the DAO do
        not have access to these funds.
      </p>

      <FundTreasuryDialog
        openDialog={openedDialog}
        setOpenDialog={setOpenedDialog}
        fundTreasuryFunction={onSubmit}
        waitSui={waitSui}
      />
    </div>
  );
};

interface IFundTreasuryDialog {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  fundTreasuryFunction: (amount: number) => Promise<void>;
  waitSui: boolean;
}

const FundTreasuryDialog = ({
  openDialog,
  setOpenDialog,
  fundTreasuryFunction,
  waitSui,
}: IFundTreasuryDialog) => {
  const [amount, setAmount] = useState(-1);

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
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-basicColor px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <Dialog.Title
                className={classNames(
                  "mb-2 flex justify-between  text-center text-base font-bold leading-6 text-black2Color",
                )}
              >
                <p className="mt-1"></p>
                <p className={classNames("mt-1 font-bold text-blackColor text-xl")}>
                  Fund Treasury
                </p>
                <button onClick={() => setOpenDialog(false)}>
                  <XMarkIcon className="flex h-7 w-7 md:hidden" />
                </button>
              </Dialog.Title>
              <div className={"flex flex-col gap-6"}>
                <div className={"flex flex-col"}>
                  <div className={"flex content-center items-center gap-1"}>
                    <Label label={"Amount"} />
                  </div>
                  <input
                    className={
                      "mt-1 min-h-[40px] w-full rounded-md border border-black2Color bg-basicColor px-2 py-1"
                    }
                    placeholder={"1"}
                    type={"number"}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={0.00001}
                  />
                </div>

                <div className={"flex gap-4"}>
                  <button
                    className={
                      "button-primary button-shadow pinkColor-primary-state rounded-2xl px-3 py-2 font-bold md:px-6 md:py-4 disabled:bg-gray2Color"
                    }
                    type={"submit"}
                    disabled={waitSui}
                    onClick={() => fundTreasuryFunction(amount)}
                  >
                    Fund
                  </button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
