import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { use, useEffect, useRef, useState } from "react";
import {
  sweetAlert,
  sweetAlertConfirm,
} from "../../components/ui/sweetAlert/sweetAlert";
import Alert from "../../components/ui/alert/Alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  useCreateUser,
  useDeleteUser,
  useUsers,
  useUpdateUser,
  useDivisi,
  useMentor,
  useRole,
} from "../../services/API_Query";
import { EyeCloseIcon, EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";
import Select from "../../components/form/Select";
import Badge from "../../components/ui/badge/Badge";

export default function User() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const { data: users } = useUsers(page, 10, search);
  const { data: divisis } = useDivisi();
  const { data: mentors } = useMentor(users);
  const { data: roles } = useRole();
  const [dataUser, setDataUser] = useState({
    id: 0,
    username: "",
    nim: "",
    email: "",
    mentorId: "",
    roleId: "",
    role_nama: "",
    password: "",
    divisiId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState<File | null>(null);
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
    const isValid = /^[a-zA-Z0-9._%+-]+@students\.um\.ac\.id$/.test(
      dataUser.email,
    );

    if (!isValid) {
      setErrorUser({ email: "Gunakan email students.um.ac.id", all: "" });
      return;
    }

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
      console.log(dataUser);
      await updateUser.mutateAsync({ id: dataUser.id, data: form });
      setErrorUser({ email: "", all: "" });
      updateRef.current?.close();
      sweetAlert("success", "User berhasil diupdate", "success");
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
      setErrorUser({ email: "", all: (error as any)?.response?.data?.message });
    }
  };
  const [errorUser, setErrorUser] = useState({ email: "", all: "" });

  const createRef = useRef(null);
  const updateRef = useRef(null);
  const imgRef = useRef(null);
  const [imgModal, setImgModal] = useState(null);

  const createUser = useCreateUser(); // ⭐ panggil di atas
  const updateUser = useUpdateUser(); // ⭐ panggil di atas
  const deleteUser = useDeleteUser(); // ⭐ panggil di atas

  const optionsTable = [
    {
      name: "Id",
    },
    {
      name: "Nama Pengguna",
    },
    {
      name: "Nim",
    },
    // {
    //   name: "Email",
    // },
    {
      name: "Terverifikasi",
    },
    {
      name: "Foto",
    },
    {
      name: "Validator",
    },
    {
      name: "Role",
    },
    {
      name: "Divisi",
    },
    {
      name: "Opsi",
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = /^[a-zA-Z0-9._%+-]+@students\.um\.ac\.id$/.test(
      dataUser.email,
    );

    if (!isValid) {
      setErrorUser({ email: "Gunakan email students.um.ac.id", all: "" });
      return;
    }
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
      await createUser.mutateAsync(form);
      setErrorUser({ email: "", all: "" });
      createRef.current?.close();
      sweetAlert("success", "User berhasil ditambahkan", "success");
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
      setErrorUser({ email: "", all: (error as any)?.response?.data?.message });
    }
  };
  return (
    <>
      <PageMeta title="Pengguna - Absensi" description="" />
      <PageBreadcrumb pageTitle="Pengguna" />

      <div className="flex items-center justify-end my-4">
        <Button
          onClick={() => {
            (createRef.current?.showModal(),
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
              }));
            setErrorUser({ email: "", all: "" });
          }}
        >
          Tambah
        </Button>
      </div>
      <div className="space-y-6">
        <ComponentCard title="User">
          <input
            type="text"
            placeholder="Cari nama user..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // reset ke halaman pertama
            }}
            className="w-full mb-4 px-3 py-2 border rounded"
          />
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    {optionsTable.map((option, index) => (
                      <TableCell
                        key={index}
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        {option.name}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {(users as any)?.content?.map((User: any, index: number) => (
                    <TableRow key={User.id}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {User.username}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {User.nim ?? "Belum ada nim"}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        <Badge
                          variant="light"
                          color={User.isVerify === "true" ? "success" : "error"}
                        >
                          {User.isVerify === "true" ? "Sudah" : "Belum"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {User.foto === null ? (
                          <img
                            className="w-12 h-12"
                            src={"/images/create-img/img.avif"}
                            alt=""
                          />
                        ) : (
                          <img
                            onClick={() => {
                              (imgRef.current?.showModal(),
                                setImgModal(User.foto));
                            }}
                            src={`http://localhost:8080/profile/${User.foto}`}
                            alt="Foto User"
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {User.mentorName === "null" ? "N" : User.mentorName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {User.roleName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {User.divisiName === "null" ? "N" : User.divisiName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 space-x-4">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              updateRef.current?.showModal();
                              setDataUser({
                                ...dataUser,
                                id: User.id,
                                username: User.username,
                                nim: User.nim || "",
                                email: User.email || "",
                                mentorId: User.mentorId || "",
                                roleId: User.roleId || "",
                                role_nama: User.roleName || "",
                                divisiId: User.divisiId || "",
                              });
                              setErrorUser({ email: "", all: "" });
                            }}
                            variant="warning"
                            size="sm"
                          >
                            <PencilIcon />{" "}
                          </Button>
                          <dialog
                            ref={updateRef}
                            className="modal modal-bottom sm:modal-middle "
                          >
                            <div className="modal-action">
                              <div className="modal-box bg-white dark:bg-black border-white border">
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
                                {errorUser.all !== "" && (
                                  <Alert
                                    variant="error"
                                    title="Pesan Error"
                                    message={errorUser.all}
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
                                        disabled
                                        name="username"
                                        placeholder="Jhon Doe (Capitalize)"
                                        value={dataUser.username}
                                        onChange={(e) => handleChange(e)}
                                      />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1 my-4">
                                      <Label>Nim</Label>
                                      <Input
                                        disabled
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
                                        isValueSelected={dataUser.divisiId}
                                        options={(divisis as any)?.map(
                                          (item: any) => ({
                                            label: item.nama,
                                            value: item.id,
                                          }),
                                        )}
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
                                    <div className="col-span-2 lg:col-span-1 my-4">
                                      <Label>Role</Label>
                                      <Input
                                        disabled
                                        name="roleId"
                                        placeholder="0123908 (angka 0-9)"
                                        value={dataUser.roleId}
                                        onChange={(e) => handleChange(e)}
                                        type="number"
                                      />
                                    </div>
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
                                      {errorUser.email !== "" && (
                                        <p style={{ color: "red" }}>
                                          {errorUser.email}
                                        </p>
                                      )}
                                    </div>
                                    {dataUser.role_nama === "Mentee" && (
                                      <div className="col-span-2 lg:col-span-1 my-4">
                                        <Label>Validator</Label>
                                        <Select
                                          isValueSelected={dataUser.mentorId}
                                          options={(mentors as any)?.map(
                                            (item: any) => ({
                                              label: item.username,
                                              value: item.id,
                                            }),
                                          )}
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
                                  {/* <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                                    <Label>Foto Profile</Label>
                                    {file || User.foto ? (
                                      <img
                                        src={`http://localhost:8080/uploads/${User.foto}`}
                                        alt="Foto User"
                                        className="h-12 w-12 rounded-full object-cover"
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
                                  </div> */}
                                  <Button
                                    type="submit"
                                    className="w-full"
                                    size="sm"
                                  >
                                    Submit
                                  </Button>
                                </form>
                              </div>
                            </div>
                          </dialog>
                          {/* {User.roleName !== "Admin" && (
                            <Button
                              onClick={() => {
                                sweetAlertConfirm(
                                  "Apakah Anda yakin ",
                                  `ingin menghapus User ${User.username}?`,
                                  async () => {
                                    try {
                                      await deleteUser.mutateAsync(User.id);
                                      sweetAlert(
                                        "success",
                                        "User berhasil dihapus",
                                        "success",
                                      );
                                    } catch (error) {
                                      sweetAlert(
                                        "Peringatan",
                                        (error as any)?.response?.data?.message,
                                        "error",
                                        5000,
                                      );
                                    }
                                  },
                                  "warning",
                                  "Ya, Hapus!",
                                );
                              }}
                              variant="danger"
                              size="sm"
                            >
                              <TrashBinIcon />
                            </Button>
                          )} */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {(users as any)?.content.length > 0 && (
              <>
                {" "}
                <div className="flex justify-end mt-10">
                  {" "}
                  <span className="text-sm font-medium text-black dark:placeholder:text-white/50 dark:text-white/50">
                    Halaman {page + 1} dari {(users as any)?.totalPages}
                  </span>
                </div>
                <div className="w-full flex justify-end items-center">
                  <div className="flex items-center justify-between mt-4">
                    {/* Prev */}
                    <button
                      onClick={() => setPage((old) => Math.max(old - 1, 0))}
                      disabled={page === 0}
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-black disabled:opacity-50 hover:bg-gray-300"
                    >
                      Prev
                    </button>
                    {Array.from(
                      { length: (users as any)?.totalPages },
                      (_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          className={`px-3 py-2 rounded border
              ${
                page === i
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-black hover:bg-gray-100"
              }`}
                        >
                          {i + 1}
                        </button>
                      ),
                    )}

                    {/* Next */}
                    <button
                      onClick={() =>
                        setPage((old) =>
                          old + 1 < (users as any).totalPages ? old + 1 : old,
                        )
                      }
                      disabled={page + 1 >= (users as any)?.totalPages}
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-black disabled:opacity-50 hover:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ComponentCard>
      </div>

      <dialog ref={imgRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-action">
          <div className="modal-box bg-white dark:bg-black border-white border">
            <div className="flex justify-end">
              <form method="dialog">
                <button
                  className="btn"
                  onClick={() => {
                    setImgModal(null);
                  }}
                >
                  Close
                </button>
              </form>
            </div>
            <img
              src={`http://localhost:8080/profile/${imgModal}`}
              alt="Foto User"
              className="h-auto w-80 rounded-md object-cover my-4"
            />
          </div>
        </div>
      </dialog>
      <dialog ref={createRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-action">
          <div className=" bg-white dark:bg-black border-white border p-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-normal text-base">Halo Admin</h3>
              </div>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
            {errorUser.all !== "" && (
              <Alert
                variant="error"
                title="Pesan Error"
                message={errorUser.all}
                showLink={false}
              />
            )}
            <form
              content="multipart/formdata"
              onSubmit={async (e) => {
                handleSubmit(e);
              }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Nama User</Label>
                  <Input
                    minLength={6}
                    type=""
                    name="username"
                    placeholder="Jhon Doe (Capitalize)"
                    value={dataUser.username}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Nim</Label>
                  <Input
                    minLength={10}
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
                    // isRequired={true}
                    options={(divisis as any)?.map((item: any) => ({
                      label: item.nama,
                      value: item.id,
                    }))}
                    isValueSelected={dataUser.divisiId}
                    placeholder="Pilih Opsi"
                    onChange={(value: string) => {
                      setDataUser({ ...dataUser, divisiId: parseInt(value) });
                    }}
                    className="bg-white dark:bg-dark-900"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Role</Label>
                  <Select
                    isRequired={true}
                    options={(roles as any)?.map((item: any) => ({
                      label: item.nama,
                      value: item.id,
                    }))}
                    isValueSelected={dataUser.roleId}
                    placeholder="Pilih Opsi"
                    onChange={(value: string) => {
                      const id = parseInt(value);

                      const selectedRole = (roles as any)?.find(
                        (role: any) => role.id === id,
                      );

                      setDataUser({
                        ...dataUser,
                        roleId: id,
                        role_nama: selectedRole?.nama,
                      });
                    }}
                    className="bg-white dark:bg-dark-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Email</Label>
                  <Input
                    required
                    minLength={10}
                    name="email"
                    placeholder="JhonDoe@gmail.com"
                    value={dataUser.email}
                    onChange={(e) => handleChange(e)}
                    type="email"
                  />
                  {errorUser.email !== "" && (
                    <p style={{ color: "red" }}>{errorUser.email}</p>
                  )}
                </div>
                {dataUser.role_nama === "Mentee" && (
                  <div className="col-span-2 lg:col-span-1 my-4">
                    <Label>Mentor</Label>
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
                      className="bg-white dark:bg-dark-900"
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 my-4 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      required
                      minLength={10}
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
                        <EyeIcon className="fill-gray-500 bg-white dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 bg-white dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <Label>Foto Profile</Label>
                {file ? (
                  <img
                    className="w-44 h-44"
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
    </>
  );
}
