import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
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
  useCreateShift,
  useDeleteShift,
  useHari,
  useShifts,
  useUpdateShift,
  useUsers,
} from "../../services/API_Query";
import { PencilIcon, TimeIcon, TrashBinIcon } from "../../icons";
import Select from "../../components/form/Select";
import { toMinutes } from "../../helpers/toMinute";

export default function Shifts() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const { data: Shifts } = useShifts(page, search);
  const { data: haris } = useHari();
  const { data: users } = useUsers(page, 50, "");
  const [dataShift, setDataShift] = useState({
    id: 0,
    userId: "",
    hariId: "",
    mulai: "",
    toleransiMenit: "",
    akhir: "",
  });
  const [errorShift, setErrorShift] = useState("");

  const createRef = useRef(null);
  const updateRef = useRef(null);
  const imgRef = useRef(null);
  const [imgModal, setImgModal] = useState(null);

  const createShift = useCreateShift(); // ⭐ panggil di atas
  const updateShift = useUpdateShift(); // ⭐ panggil di atas
  const deleteShift = useDeleteShift(); // ⭐ panggil di atas

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
  return (
    <>
      <PageMeta title="Shift - Absensi" description="" />
      <PageBreadcrumb pageTitle="Shift" />

      <div className="flex items-center justify-end my-4">
        <Button
          onClick={() => {
            createRef.current?.showModal();
            setDataShift({
              id: 0,
              mulai: "",
              akhir: "",
              userId: "",
              hariId: "",
              toleransiMenit: "",
            });
            setErrorShift("");
          }}
        >
          Tambah
        </Button>
      </div>

      <div className="space-y-6">
        <ComponentCard title="Shift">
          <input
            type="text"
            placeholder="Cari nama user..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0); // reset ke halaman pertama
            }}
            className="w-full mb-4 px-3 py-2 border rounded dark:placeholder:text-white/50 dark:text-white/50"
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
                  {(Shifts as any)?.content?.map(
                    (Shift: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {index + 1}
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
                          <Button
                            onClick={() => {
                              setDataShift({
                                id: Shift.id,
                                mulai: Shift.mulai.slice(0, 5),
                                akhir: Shift.akhir.slice(0, 5),
                                userId: Shift.userId,
                                hariId: Shift.hariId,
                                toleransiMenit: Shift.toleransiMenit,
                              });
                              setErrorShift("");
                              updateRef.current?.showModal();
                            }}
                            variant="warning"
                            size="sm"
                          >
                            <PencilIcon />{" "}
                          </Button>

                          <dialog
                            ref={updateRef}
                            className="modal modal-bottom sm:modal-middle"
                          >
                            <div className="modal-action">
                              <div className="modal-box dark:bg-black border-white border">
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
                                  onSubmit={async (e) => {
                                    e.preventDefault(); // cegah reload page
                                    try {
                                      await updateShift.mutateAsync({
                                        id: dataShift.id,
                                        data: dataShift,
                                      });
                                      console.log(dataShift);
                                      updateRef.current?.close();
                                      setErrorShift("");
                                      setDataShift({
                                        id: 0,
                                        mulai: "",
                                        akhir: "",
                                        userId: "",
                                        hariId: "",
                                        toleransiMenit,
                                      });
                                      sweetAlert(
                                        "success",
                                        "Shift berhasil diubah",
                                        "success",
                                      );
                                    } catch (error) {
                                      setErrorShift(
                                        (error as any)?.response?.data?.message,
                                      );
                                    }
                                  }}
                                >
                                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1 my-4">
                                      <Label>Waktu Mulai</Label>
                                      <div className="relative">
                                        <Input
                                          type="time"
                                          id="mulai"
                                          name="mulai"
                                          value={dataShift.mulai}
                                          onChange={(e) =>
                                            setDataShift({
                                              ...dataShift,
                                              mulai: e.target.value,
                                            })
                                          }
                                        />
                                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                          <TimeIcon className="size-6" />
                                        </span>
                                      </div>
                                    </div>
                                    <div className="col-span-2 lg:col-span-1 my-4">
                                      <Label>Waktu Akhir</Label>
                                      <div className="relative">
                                        <Input
                                          type="time"
                                          id="akhir"
                                          name="akhir"
                                          value={dataShift.akhir}
                                          onChange={(e) =>
                                            setDataShift({
                                              ...dataShift,
                                              akhir: e.target.value,
                                            })
                                          }
                                        />
                                        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                          <TimeIcon className="size-6" />
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1 my-4">
                                      <Label>Nama Pengguna</Label>
                                      <Select
                                        isValueSelected={dataShift.userId}
                                        options={(users as any)?.content?.map(
                                          (item: any) => ({
                                            label: item.username,
                                            value: item.id,
                                          }),
                                        )}
                                        placeholder="Pilih Opsi"
                                        onChange={(value: string) => {
                                          setDataShift({
                                            ...dataShift,
                                            userId: parseInt(value),
                                          });
                                        }}
                                        className="dark:bg-dark-900"
                                      />
                                    </div>
                                    <div className="col-span-2 lg:col-span-1 my-4">
                                      <Label>Hari</Label>
                                      <Select
                                        isValueSelected={dataShift.hariId}
                                        options={(haris as any)?.map(
                                          (item: any) => ({
                                            label: item.nama,
                                            value: item.id,
                                          }),
                                        )}
                                        placeholder="Pilih Opsi"
                                        onChange={(value: string) => {
                                          setDataShift({
                                            ...dataShift,
                                            hariId: parseInt(value),
                                          });
                                        }}
                                        className="dark:bg-dark-900"
                                      />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1 my-4">
                                      <Label>Toleransi Menit</Label>
                                      <div className="relative">
                                        <Input
                                          type="number"
                                          id="toleransiMenit"
                                          name="toleransiMenit"
                                          placeholder="default 60"
                                          value={dataShift.toleransiMenit}
                                          onChange={(e) =>
                                            setDataShift({
                                              ...dataShift,
                                              toleransiMenit: e.target.value,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
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
                          <Button
                            onClick={() => {
                              sweetAlertConfirm(
                                "Apakah Anda yakin ",
                                `ingin menghapus Shift Milik ${Shift.UserName}?`,
                                async () => {
                                  try {
                                    await deleteShift.mutateAsync(Shift.id);
                                    sweetAlert(
                                      "success",
                                      "Shift berhasil dihapus",
                                      "success",
                                    );
                                  } catch (error) {
                                    setErrorShift((error as any).message);
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
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
            {(Shifts as any)?.content.length > 0 && (
              <>
                {" "}
                <div className="flex justify-end mt-10">
                  {" "}
                  <span className="text-sm font-medium dark:placeholder:text-white/50 dark:text-white/50">
                    Halaman {page + 1} dari {(Shifts as any)?.totalPages}
                  </span>
                </div>
                <div className="w-full flex justify-end items-center">
                  <div className="flex items-center justify-between mt-4">
                    {/* Prev */}
                    <button
                      onClick={() => setPage((old) => Math.max(old - 1, 0))}
                      disabled={page === 0}
                      className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
                    >
                      Prev
                    </button>
                    {Array.from(
                      { length: (Shifts as any)?.totalPages },
                      (_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          className={`px-3 py-2 rounded border
              ${
                page === i
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white hover:bg-gray-100"
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
                          old + 1 < (Shifts as any).totalPages ? old + 1 : old,
                        )
                      }
                      disabled={page + 1 >= (Shifts as any)?.totalPages}
                      className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50 hover:bg-gray-300"
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

      <dialog ref={createRef} className="modal modal-middle">
        <div className="modal-action">
          <div className="modal-box w-full max-w-5xl dark:bg-black border-white border">
            <div className="flex justify-between">
              <div>
                <h3 className="font-normal text-base">Haloo</h3>
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
              onSubmit={async (e) => {
                e.preventDefault(); // cegah reload page
                try {
                  await createShift.mutateAsync(dataShift);
                  createRef.current?.close();
                  setErrorShift("");
                  sweetAlert(
                    "success",
                    "Shift berhasil ditambahkan",
                    "success",
                  );
                  setDataShift((prev) => ({
                    ...prev,
                    id: 0,
                    mulai: "",
                    akhir: "",
                    userId: "",
                    hariId: "",
                  }));
                } catch (error) {
                  setErrorShift((error as any)?.response?.data?.message);
                }
              }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Waktu Mulai</Label>
                  <div className="relative">
                    <Input
                      type="time"
                      id="mulai"
                      name="mulai"
                      value={dataShift.mulai}
                      onChange={(e) =>
                        setDataShift({ ...dataShift, mulai: e.target.value })
                      }
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <TimeIcon className="size-6" />
                    </span>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Waktu Akhir</Label>
                  <div className="relative">
                    <Input
                      type="time"
                      id="akhir"
                      name="akhir"
                      value={dataShift.akhir}
                      onChange={(e) => {
                        const value = e.target.value;

                        if (
                          dataShift.mulai &&
                          toMinutes(value) <= toMinutes(dataShift.mulai)
                        ) {
                          setErrorShift(
                            "Waktu akhir harus setelah waktu mulai",
                          );
                          return;
                        }
                        setDataShift({ ...dataShift, akhir: e.target.value });
                      }}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <TimeIcon className="size-6" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Nama Pengguna</Label>
                  <Select
                    isValueSelected={dataShift.userId}
                    options={(users as any)?.content.map((item: any) => ({
                      label: item.username,
                      value: item.id.toString(),
                    }))}
                    placeholder="Pilih Opsi"
                    onChange={(value) => {
                      setDataShift((prev) => ({
                        ...prev,
                        userId: parseInt(value),
                      }));
                    }}
                  />
                </div>
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Hari</Label>
                  <Select
                    isValueSelected={dataShift.hariId}
                    options={(haris as any)?.map((item: any) => ({
                      label: item.nama,
                      value: item.id.toString(),
                    }))}
                    placeholder="Pilih Opsi"
                    onChange={(value) => {
                      setDataShift((prev) => ({
                        ...prev,
                        hariId: parseInt(value),
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Toleransi Menit</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      id="toleransiMenit"
                      name="toleransiMenit"
                      placeholder="default 60"
                      value={dataShift.toleransiMenit}
                      onChange={(e) =>
                        setDataShift({
                          ...dataShift,
                          toleransiMenit: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
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
