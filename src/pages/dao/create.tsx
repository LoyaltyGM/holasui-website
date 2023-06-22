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
        "flex min-h-[100vh] md:min-h-[65vh] flex-col pl-2 pr-2 md:pl-16 py-6 md:mt-14 mt-18 md:pr-10 z-10 rounded-lg mt-8 "
      )}
    >

      <h1>Hello how are you?</h1>
    </main>
  );
};
export default CreateDAO;
