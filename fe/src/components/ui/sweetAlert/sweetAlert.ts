import Swal from "sweetalert2";

export const sweetAlert = (
  title: string,
  text: string,
  icon: "error" | "warning" | "success" | "question",
  timer = 1500,
) => {
  Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: `${icon}`,
    draggable: true,
    confirmButtonText: "Selesai",
    timer: timer,
  });
};

export const sweetAlertConfirm = (
  title: string,
  text: string,
  callback: () => void,
  icon?: "error" | "warning" | "success" | "question",
  textBtn?: string,
) => {
  Swal.fire({
    title: `${title}`,
    text: `${text}`,
    icon: `${icon ?? "warning"}`,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: textBtn,
  }).then((result) => {
    if (result.isConfirmed) {
      callback();
    }
  });
};
