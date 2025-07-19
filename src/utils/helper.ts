import { toast } from "react-toastify";

export const showToastMessage = (message: string, type: string) => {
  if (type === "error") {
    toast.error(message, {
      position: "top-right",
      autoClose: 1000,
      closeOnClick: true,
    });
  } else {
    toast.success(message, {
      position: "top-right",
      autoClose: 1000,
      closeOnClick: true,
    });
  }
};
