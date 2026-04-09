import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useEffect, useRef, useState } from "react";
import { sweetAlert } from "../../components/ui/sweetAlert/sweetAlert";
import Alert from "../../components/ui/alert/Alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  useAbsensiByMentor,
  useApprovalAbsensi,
} from "../../services/API_Query";
import { PencilIcon } from "../../icons";
import Select from "../../components/form/Select";
import { useUserStore } from "../../services/state";
import Badge from "../../components/ui/badge/Badge";
import TextArea from "../../components/form/input/TextArea";

export default function AbsensiByMentor() {
  const currentUser = useUserStore((state) => state.user);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const { data: Absensis } = useAbsensiByMentor(currentUser.id, page, search);
  const useApproval = useApprovalAbsensi();
  const [dataAbsensi, setDataAbsensi] = useState({
    id: 0,
    n: "",
    alasanApproval: "",
  });
  const [errorAbsensi, setErrorAbsensi] = useState("");
  const updateRef = useRef(null);
  const imgRef = useRef(null);
  const detailRef = useRef(null);
  const [imgModal, setImgModal] = useState({ img: null, userName: null });

  const optionsTable = [
    {
      name: "Id",
    },
    {
      name: "Nama Pengguna",
    },
    {
      name: "Foto",
    },
    {
      name: "Keterangan",
    },
    {
      name: "Status",
    },
    {
      name: "Approval",
    },
    {
      name: "Tanggal",
    },
    {
      name: "Jenis",
    },
    {
      name: "Dibuat Pada",
    },
    {
      name: "Privasi",
    },
    {
      name: "Opsi",
    },
  ];
  const approvalOptions = [
    { value: "DISETUJUI", label: "Disetujui" },
    { value: "TIDAK", label: "Tidak Disetujui" },
  ];

  return (
    <>
      <PageMeta title="Absensi - Absensi" description="" />
      <PageBreadcrumb pageTitle="Absensi" />

      <div className="space-y-6">
        <ComponentCard title="Absensi">
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
                  {(Absensis as any)?.content?.map(
                    (Absensi: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {Absensi.userName}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {Absensi.foto === null ? (
                            <img
                              className="w-12 h-12"
                              src={"/images/create-img/img.avif"}
                              alt=""
                            />
                          ) : (
                            <img
                              onClick={() => {
                                (imgRef.current?.showModal(),
                                  setImgModal({
                                    img: Absensi.foto,
                                    userName: Absensi.userName,
                                  }));
                              }}
                              src={`http://localhost:8080/absensi/${Absensi.userName}/${Absensi.foto}`}
                              alt="Foto User"
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {Absensi.keterangan.slice(0, 40)}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Badge
                            variant="light"
                            color={
                              Absensi.status !== "TERLAMBAT"
                                ? "success"
                                : "warning"
                            }
                          >
                            {Absensi.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Badge
                            variant={"light"}
                            color={
                              Absensi.apporoval === "DISETUJUI"
                                ? "success"
                                : "warning"
                            }
                          >
                            {Absensi.apporoval}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {Absensi.tanggal}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          <Badge
                            variant="light"
                            color={
                              Absensi.jenis === "DATANG" ? "success" : "info"
                            }
                          >
                            {Absensi.jenis}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {new Date(Absensi.created_at).toLocaleString(
                            "id-ID",
                            {
                              weekday: "long",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            },
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                          {Absensi.isPrivate ? "Private" : "Public"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 space-x-4">
                          {Absensi.apporoval === "PENDING" ? (
                            <Button
                              onClick={() => {
                                updateRef.current?.showModal();
                                setDataAbsensi((prev) => ({
                                  ...prev,
                                  id: Absensi.id,
                                }));
                              }}
                              variant="warning"
                              size="sm"
                            >
                              <PencilIcon />{" "}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                detailRef.current?.showModal();
                              }}
                              variant="primary"
                              size="sm"
                            >
                              <PencilIcon />{" "}
                            </Button>
                          )}

                          <dialog
                            ref={detailRef}
                            className="modal modal-bottom sm:modal-middle"
                          >
                            <div className="modal-action">
                              <div className="modal-box dark:bg-black border-white border">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-normal text-base">
                                      Halo {Absensi.UserName}
                                    </h3>
                                  </div>
                                  <form method="dialog">
                                    <button className="btn">Close</button>
                                  </form>
                                </div>
                                <p>
                                  <span className="font-semibold">
                                    Keterangan Absen :
                                  </span>
                                  {Absensi.keterangan}
                                </p>
                                <p>
                                  <span className="font-semibold">
                                    Alasan Approval :
                                  </span>{" "}
                                  {Absensi.alasanApporoval}
                                </p>
                              </div>
                            </div>
                          </dialog>
                          <dialog
                            ref={updateRef}
                            className="modal modal-bottom sm:modal-middle"
                          >
                            <div className="modal-action">
                              <div className="modal-box dark:bg-black border-white border">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-normal text-base">
                                      Halo {Absensi.UserName}
                                    </h3>
                                  </div>
                                  <form method="dialog">
                                    <button className="btn">Close</button>
                                  </form>
                                </div>
                                {errorAbsensi !== "" && (
                                  <Alert
                                    variant="error"
                                    title="Pesan Error"
                                    message={errorAbsensi}
                                    showLink={false}
                                  />
                                )}
                                <form
                                  onSubmit={async (e) => {
                                    e.preventDefault(); // cegah reload page
                                    try {
                                      await useApproval.mutateAsync({
                                        data: dataAbsensi,
                                        id: dataAbsensi.id,
                                      });
                                      setDataAbsensi({
                                        id: 0,
                                        n: "",
                                        alasanApproval: "",
                                      });
                                      updateRef.current?.close();
                                      setErrorAbsensi("");
                                      sweetAlert(
                                        "success",
                                        "Absensi berhasil diubah",
                                        "success",
                                      );
                                    } catch (error) {
                                      setErrorAbsensi(
                                        (error as any)?.response?.data?.message,
                                      );
                                    }
                                  }}
                                >
                                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                                    <div className="col-span-2 lg:col-span-1 my-4">
                                      <Label>Divisi</Label>
                                      <Select
                                        isValueSelected={dataAbsensi.n}
                                        options={(approvalOptions as any)?.map(
                                          (item: any) => ({
                                            label: item.label,
                                            value: item.value,
                                          }),
                                        )}
                                        placeholder="Pilih Opsi"
                                        onChange={(value: string) => {
                                          setDataAbsensi({
                                            ...dataAbsensi,
                                            n: value,
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
                                          value={dataAbsensi.alasanApproval}
                                          onChange={(value) =>
                                            setDataAbsensi({
                                              ...dataAbsensi,
                                              alasanApproval: value,
                                            })
                                          }
                                          rows={6}
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
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
            {(Absensis as any)?.content?.length > 0 && (
              <>
                <div className="flex justify-end mt-10">
                  {" "}
                  <span className="text-sm font-medium text-black dark:placeholder:text-white/50 dark:text-white/50">
                    Halaman {page + 1} dari {(Absensis as any)?.totalPages}
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
                      { length: (Absensis as any)?.totalPages },
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
                          old + 1 < (Absensis as any).totalPages
                            ? old + 1
                            : old,
                        )
                      }
                      disabled={page + 1 >= (Absensis as any)?.totalPages}
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
          <div className="modal-box dark:bg-black border-white border">
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
              src={`http://localhost:8080/absensi/${imgModal.userName}/${imgModal.img}`}
              alt="Foto User"
              className="h-auto w-80 rounded-md object-cover my-4"
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
