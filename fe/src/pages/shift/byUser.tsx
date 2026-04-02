import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useEffect, useRef, useState } from "react";
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
  useCreateAbsensi,
  useShiftByUser,
  useUpdateShift,
} from "../../services/API_Query";
import { PencilIcon } from "../../icons";
import Select from "../../components/form/Select";
import { useUserStore } from "../../services/state";
import { canAbsen } from "../../helpers/toMinute";
import TextArea from "../../components/form/input/TextArea";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
export default function Shifts() {
  const currentUser = useUserStore((state) => state.user);
  const { data: Shifts } = useShiftByUser(currentUser.id);
  const createAbsensi = useCreateAbsensi();
  const [dataAbsensi, setDataAbsensi] = useState({
    id: 0,
    keterangan: "",
    foto: "",
    status: "",
    jenis: "",
    userId: currentUser.id,
    shiftId: "",
    isPrivate: true,
  });
  const [errorShift, setErrorShift] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const updateRef = useRef(null);

  const optionsTable = [
    {
      name: "Id",
    },
    {
      name: "Hari",
    },
    {
      name: "Nama",
    },
    {
      name: "Mulai Shift",
    },
    {
      name: "Akhir Shift",
    },
    {
      name: "Opsi",
    },
  ];
  const statuss = [
    { value: "HADIR", label: "Hadir" },
    { value: "IZIN", label: "Izin" },
    { value: "SAKIT", label: "Sakit" },
    { value: "TERLAMBAT", label: "Terlambat" },
  ];
  const jeniss = [
    { value: "DATANG", label: "Datang" },
    { value: "PULANG", label: "Pulang" },
  ];
  const isPrivatess = [
    { value: true, label: "Private" },
    { value: false, label: "Public" },
  ];
  const handleImageChange = (e: any) => {
    const files = e.target.files[0];
    if (files) {
      setFile(files);
    }
  };

  const handleCreateAbsensi = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append(
      "data",
      new Blob([JSON.stringify(dataAbsensi)], {
        type: "application/json",
      }),
    );

    if (file) {
      form.append("foto", file);
    }
    updateRef.current?.close();
    sweetAlertConfirm(
      "Peringatan",
      "Absensi hanya dibuat sekali untuk setiap shift, pastikan data benar benar valid?",
      async () => {
        try {
          await createAbsensi.mutateAsync(form)
          updateRef.current?.close();
          setErrorShift("");
          setDataAbsensi({
            id: 0,
            keterangan: "",
            status: "",
            jenis: "",
            userId: currentUser.id,
            isPrivate: true,
            shiftId: "",
            foto: "",
          });
          sweetAlert("success", "absensi berhasil dibuat", "success");
        } catch (error) {
          setErrorShift((error as any)?.response?.data?.message);
          toast.error((error as any)?.response?.data?.message);
        }
      },
      "warning",
      "Ya, Absen sekarang!",
    );
  };

  return (
    <>
      <PageMeta title="Shift - Absensi" description="" />
      <PageBreadcrumb pageTitle="Shift" />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="space-y-6">
        <ComponentCard title="Shift">
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
                  {(Shifts as any)?.map((Shift: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {Shift.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {Shift.hariName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {Shift.UserName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {Shift.mulai}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {Shift.akhir}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 space-x-4">
                        {canAbsen(Shift) ? (
                          <Button
                            onClick={() => {
                              setDataAbsensi((prev) => ({
                                ...prev,
                                keterangan: "",
                                status: "",
                                shiftId: Shift.id,
                                userId: currentUser.id,
                              }));
                              setErrorShift("");
                              setFile(null);
                              updateRef.current?.showModal();
                              setDataAbsensi((prev) => ({
                                ...prev,
                                jenis: "",
                              }));
                            }}
                            variant="warning"
                            size="sm"
                          >
                            Absen <PencilIcon />{" "}
                          </Button>
                        ) : (
                          <p>Absen Tidak Tersedia</p>
                        )}

                        <dialog
                          ref={updateRef}
                          className="modal modal-bottom sm:modal-middle"
                        >
                          <div className="modal-action">
                            <div className="modal-box max-w-4xl w-72 md:w-96 dark:bg-black border-white border">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-normal text-base">
                                    Halo {Shift.UserName}
                                  </h3>
                                </div>
                                <form method="dialog">
                                  <button className="btn">Close</button>
                                </form>
                              </div>
                              {errorShift !== "" && (
                                <Alert
                                  variant="error"
                                  title="Pesan Error"
                                  message={errorShift}
                                  showLink={false}
                                />
                              )}
                              <form
                                content="multipart/formdata"
                                onSubmit={(e) => handleCreateAbsensi(e)}
                              >
                                <div className="grid grid-cols-1 gap-x-6 gap-y-2 lg:grid-cols-2">
                                  <div className="col-span-2 my-2">
                                    <Label>Status</Label>
                                    <Select
                                      isRequired={true}
                                      options={statuss}
                                      isValueSelected={dataAbsensi.status}
                                      placeholder="Pilih Opsi"
                                      onChange={(value: string) => {
                                        setDataAbsensi({
                                          ...dataAbsensi,
                                          status: value,
                                        });
                                      }}
                                      className="dark:bg-dark-900"
                                    />
                                  </div>
                                  <div className="col-span-2 my-2">
                                    <Label>Jenis</Label>
                                    <Select
                                      isRequired={true}
                                      options={jeniss}
                                      isValueSelected={dataAbsensi.jenis}
                                      placeholder="Pilih Opsi"
                                      onChange={(value: string) => {
                                        setDataAbsensi({
                                          ...dataAbsensi,
                                          jenis: value,
                                        });
                                      }}
                                      className="dark:bg-dark-900"
                                    />
                                  </div>

                                  <div className="col-span-2 my-2">
                                    <Label>Set Privasi</Label>
                                    <Select
                                      isRequired={true}
                                      options={isPrivatess}
                                      isValueSelected={dataAbsensi.isPrivate}
                                      placeholder="Pilih Opsi"
                                      onChange={(value: string) => {
                                        setDataAbsensi({
                                          ...dataAbsensi,
                                          isPrivate: value,
                                        });
                                      }}
                                      className="dark:bg-dark-900"
                                    />
                                  </div>

                                  <div className="col-span-2 my-2">
                                    <div>
                                      <Label>Deskripsi Keterangan</Label>
                                      <TextArea
                                        className="resize-none"
                                        placeholder="tulis apapun kegiatanmu disini"
                                        minLength={30}
                                        maxLength={200}
                                        value={dataAbsensi.keterangan}
                                        onChange={(value) =>
                                          setDataAbsensi({
                                            ...dataAbsensi,
                                            keterangan: value,
                                          })
                                        }
                                        rows={6}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                                  <Label>Bukti Foto</Label>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
