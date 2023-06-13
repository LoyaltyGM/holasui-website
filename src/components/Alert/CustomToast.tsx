import toast, { ToastBar, Toaster } from "react-hot-toast";
import { AlertMessageType } from "../../types";

/**
 * Beautiful notifications to your React app
 * @Docs https://react-hot-toast.com/docs/toast-bar
 */
export const CustomToast = () => {
  return (
    <Toaster position="bottom-center" reverseOrder={false}>
      {(t) => (
        <ToastBar toast={t} style={{}}>
          {({ icon, message }) => (
            <button className={"bg-primary/25 p-2 rounded-md flex items-center"} onClick={() => toast.dismiss(t.id)}>
              {icon}
              {message}
            </button>
          )}
        </ToastBar>
      )}
    </Toaster>
  );
};

export function AlertSucceed(success_type: AlertMessageType) {
  let successTitle;
  switch (success_type) {
    case "Staking":
      successTitle = "You have successfully staked your Frens!";
      break;
    case "Unstaking":
      successTitle = "You have successfully unstaked your Frens!";
      break;
    case "Claim":
      successTitle = "You have successfully claimed your points!";
      break;
    case "CreateOffer":
      successTitle = "You have successfully created an offer!";
      break;
    default:
      successTitle = "Something went wrong";
      break;
  }
  return toast.success(successTitle, {
    duration: 9000,
    icon: "🚀",
    style: {
      borderRadius: "50px",
      background: "#62D450",
      color: "#fff",
    },
  });
}

export function AlertErrorMessage(errorCode: string) {
  let errorMessage;
  switch (errorCode) {
    case "23502": // unique value
      errorMessage = "Null value in wallet address";
      break;
    case "no_connection":
      errorMessage = "No connection to wallet";
      break;
    default:
      errorMessage = "Something went wrong";
      break;
  }
  return toast.error(errorMessage, {
    duration: 9000,
    icon: "❌",
    style: {
      borderRadius: "25px",
      background: "#EF423D",
      color: "#fff",
    },
  });
}
