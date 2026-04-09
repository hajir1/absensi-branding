import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../../services/state";
import { currentUserSessionsType } from "../header/UserDropdown";
import {
  useDivisi,
  useMentor,
  useRole,
  useUpdateUser,
} from "../../services/API_Query";
import Select from "../form/Select";
import { sweetAlert, sweetAlertConfirm } from "../ui/sweetAlert/sweetAlert";
import Alert from "../ui/alert/Alert";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { useNavigate } from "react-router";

export default function UserMetaCard() {
  const currentUser = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<null | File>(null);
  const [dataUser, setDataUser] = useState({
    id: 0,
    role_nama: "",
    email: (currentUser as unknown as currentUserSessionsType)?.email || "",
    password: "",
    nim: (currentUser as unknown as currentUserSessionsType)?.nim || "",
    username: (currentUser as unknown as currentUserSessionsType)?.name || "",
    mentorId:
      (currentUser as unknown as currentUserSessionsType)?.mentorId || "",
    roleId: (currentUser as unknown as currentUserSessionsType)?.roleId || "",
    divisiId:
      (currentUser as unknown as currentUserSessionsType)?.divisiId || "",
  });
  const [errorUser, setErrorUser] = useState("");

  const updateRef = useRef(null);
  const { data: divisis } = useDivisi();
  const { data: mentors } = useMentor(currentUser);
  const updateUser = useUpdateUser(); // ⭐ panggil di atas
  const imgRef = useRef(null);
  const [imgModal, setImgModal] = useState({
    img: null as string | null,
    userName: null as string | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDataUser((prev) => ({
      ...prev,
      [name]: name === "nim" ? parseInt(value) : value,
    }));
  };
  const handleImageChange = (e: any) => {
    const files = e.target.files[0];
    if (files) {
      setFile(files);
    }
  };
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();
    form.append(
      "data",
      new Blob([JSON.stringify(dataUser)], {
        type: "application/json",
      }),
    );

    if (file) {
      form.append("foto", file);
    }
    try {
      await updateUser.mutateAsync({ id: dataUser.id, data: form });
      sweetAlertConfirm(
        "Data Berhasil Diperbarui",
        "Silahkan login ulang untuk memperbarui data",
        () => {
          navigate("/signin");
        },
        "success",
        "Ya, login ulang",
      );
      setErrorUser("");
      updateRef.current?.close();
      setDataUser({
        id: 0,
        username: "",
        nim: "",
        email: "",
        mentorId: "",
        roleId: "",
        role_nama: "",
        divisiId: "",
        password: "",
      });
    } catch (error) {
      setErrorUser((error as any)?.response?.data?.message);
    }
  };
  useEffect(() => {
    console.log(imgModal);
  }, [imgModal]);

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              {currentUser.foto === undefined ? (
                <img
                  className="w-full h-full object-cover object-center"
                  src={"/images/create-img/img.avif"}
                  alt=""
                />
              ) : (
                <img
                  onClick={() => {
                    (imgRef.current?.showModal(),
                      setImgModal({
                        img: (currentUser as unknown as currentUserSessionsType)
                          ?.foto,
                        userName: (
                          currentUser as unknown as currentUserSessionsType
                        )?.name,
                      }));
                  }}
                  src={`http://localhost:8080/profile/${(currentUser as unknown as currentUserSessionsType)?.foto}`}
                  alt="Foto User"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {(currentUser as unknown as currentUserSessionsType)?.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(currentUser as unknown as currentUserSessionsType)
                    ?.roleName ?? "Belum Diisi"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(currentUser as unknown as currentUserSessionsType)?.email}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(currentUser as unknown as currentUserSessionsType)
                    ?.divisiName ?? "Belum Diisi"}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(currentUser as unknown as currentUserSessionsType)?.nim}
                </p>
              </div>
            </div>
          </div>
          <button
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            onClick={() => {
              updateRef.current?.showModal();
              setDataUser({
                ...dataUser,
                id: currentUser.id,
                username: (currentUser as unknown as currentUserSessionsType)
                  .name,
                nim:
                  (currentUser as unknown as currentUserSessionsType).nim || "",
                email:
                  (currentUser as unknown as currentUserSessionsType).email ||
                  "",
                mentorId:
                  (currentUser as unknown as currentUserSessionsType)
                    .mentorId || "",
                roleId:
                  (currentUser as unknown as currentUserSessionsType).roleId ||
                  0,
                role_nama: "",
                divisiId:
                  (currentUser as unknown as currentUserSessionsType)
                    .divisiId || "",
              });
            }}
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit
          </button>
        </div>
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog ref={updateRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-action">
          <div className="modal-box">
            <div className="flex justify-between">
              <div>
                <h3 className="font-normal text-base">
                  Halo {dataUser?.username}
                </h3>
              </div>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
            {errorUser !== "" && (
              <Alert
                variant="error"
                title="Pesan Error"
                message={errorUser}
                showLink={false}
              />
            )}
            <form
              content="multipart/formdata"
              onSubmit={async (e) => {
                handleUpdate(e);
              }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Nama User</Label>
                  <Input
                    name="username"
                    placeholder="Jhon Doe (Capitalize)"
                    value={dataUser.username}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Nim</Label>
                  <Input
                    name="nim"
                    placeholder="0123908 (angka 0-9)"
                    value={dataUser.nim}
                    onChange={(e) => handleChange(e)}
                    type="number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Divisi</Label>
                  <Select
                    isRequired={true}
                    isValueSelected={dataUser.divisiId}
                    options={(divisis as any)?.map((item: any) => ({
                      label: item.nama,
                      value: item.id,
                    }))}
                    placeholder="Pilih Opsi"
                    onChange={(value: string) => {
                      setDataUser({
                        ...dataUser,
                        divisiId: parseInt(value),
                      });
                    }}
                    className="dark:bg-dark-900"
                  />
                </div>
                {(currentUser as unknown as currentUserSessionsType)
                  ?.roleName === ("Mentee" as any) && (
                  <div className="col-span-2 lg:col-span-1 my-4">
                    <Label>Validator</Label>
                    <Select
                      isValueSelected={dataUser.mentorId}
                      options={(mentors as any)?.map((item: any) => ({
                        label: item.username,
                        value: item.id,
                      }))}
                      placeholder="Pilih Opsi"
                      onChange={(value: string) => {
                        setDataUser({
                          ...dataUser,
                          mentorId: parseInt(value),
                        });
                      }}
                      className="dark:bg-dark-900"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Email</Label>
                  <Input
                    disabled
                    name="email"
                    placeholder="JhonDoe@gmail.com"
                    value={dataUser.email}
                    onChange={(e) => handleChange(e)}
                    type="email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input
                      value={dataUser.password}
                      onChange={(e) => handleChange(e)}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <Label>Foto Profile</Label>
                {file ? (
                  <img
                    className="w-44 h-full"
                    src={URL.createObjectURL(file)}
                    alt=""
                  />
                ) : (
                  <img
                    className="w-44 h-44"
                    src={"/images/create-img/img.avif"}
                    alt=""
                  />
                )}
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    onChange={(e) => handleImageChange(e)}
                    className="sr-only my-2"
                  />
                </label>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, JPEG up to 5MB
                </p>
              </div>
              <Button type="submit" className="w-full" size="sm">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog ref={imgRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-action">
          <div className="modal-box">
            <div className="flex justify-end">
              <form method="dialog">
                <button
                  className="btn"
                  onClick={() => {
                    setImgModal({ img: null, userName: null });
                  }}
                >
                  Close
                </button>
              </form>
            </div>
            <img
              src={`http://localhost:8080/profile/${imgModal.img}`}
              alt="Foto User"
              className="h-auto w-80 rounded-md object-cover my-4"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
