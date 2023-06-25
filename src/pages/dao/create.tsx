import { useFormik } from "formik";
import { EthosConnectStatus, ethos } from "ethos-connect";
import { NoConnectWallet } from "../../components";
import { classNames } from "../../utils";

const CreateDAO = () => {
  const { status } = ethos.useWallet();

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Create DAO!"} />
  ) : (
    <main
      className={classNames(
        "mt-18 z-10 mt-8 flex min-h-[100vh] flex-col rounded-lg py-6 pl-2 pr-2 md:mt-14 md:min-h-[65vh] md:pl-16 md:pr-10 ",
      )}
    >
      <h1>Hello how are you?</h1>
    </main>
  );
};
export default CreateDAO;
