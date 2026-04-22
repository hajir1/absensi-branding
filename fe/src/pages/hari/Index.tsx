import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useRef, useState } from "react";
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
  useCreateHari,
  useDeleteHari,
  useHari,
  useUpdateHari,
} from "../../services/API_Query";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Select from "../../components/form/Select";
import { daysOption } from "../../helpers/data";

export default function Hari() {
  
  /**
   * state
   */
  const [dataHari, setDataHari] = useState({
    id: 0,
    nama: "",
  });
  const [errorHari, setErrorHari] = useState("");

  /**
   * ref
   */
  const createRef = useRef(null);
  const updateRef = useRef(null);
  
  /**
   * crud
   */
  const { data: haris } = useHari();
  const createHari = useCreateHari(); // ⭐ panggil di atas
  const updateHari = useUpdateHari(); // ⭐ panggil di atas
  const deleteHari = useDeleteHari(); // ⭐ panggil di atas


  return (
    <>
      <PageMeta title="Hari - Absensi" description="" />
      <PageBreadcrumb pageTitle="Hari" />

      <div className="flex items-center justify-end my-4">
        <Button
          onClick={() => {
            createRef.current?.showModal();
            setDataHari({ id: 0, nama: "" });
            setErrorHari("");
          }}
        >
          Tambah
        </Button>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Hari">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
              <Table>
                {/* Table Header */}
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Id
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Nama Hari
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      Opsi
                    </TableCell>
                  </TableRow>
                </TableHeader>

                {/* Table Body */}
                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {(haris as any)?.map((Hari: any) => (
                    <TableRow key={Hari.id}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {Hari.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {Hari.nama}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 space-x-4">
                        <Button
                          onClick={() => {
                            setDataHari({ id: Hari.id, nama: Hari.nama });
                            updateRef.current?.showModal();
                            setErrorHari("");
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
                            <div className="modal-box bg-white dark:bg-black border-white border">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-normal text-base">
                                    Halo Admin
                                  </h3>
                                </div>
                                <form method="dialog">
                                  <button className="btn">Close</button>
                                </form>
                              </div>
                              {errorHari !== "" && (
                                <Alert
                                  variant="error"
                                  title="Pesan Error"
                                  message={errorHari}
                                  showLink={false}
                                />
                              )}
                              <form
                                onSubmit={async (e) => {
                                  e.preventDefault(); // cegah reload page

                                  try {
                                    await updateHari.mutateAsync({
                                      id: dataHari.id,
                                      data: dataHari,
                                    });
                                    updateRef.current?.close();
                                    setErrorHari("");
                                    setDataHari({ id: 0, nama: "" });
                                    sweetAlert(
                                      "success",
                                      "Hari berhasil diubah",
                                      "success",
                                    );
                                  } catch (error) {
                                    setErrorHari(
                                      (error as any)?.response?.data?.message,
                                    );
                                  }
                                }}
                              >
                                <div className="grid grid-cols-11 gap-x-6 gap-y-5">
                                  <div className="col-span-10 my-4">
                                    <Label>Nama Hari</Label>
                                    <Select
                                      isRequired={true}
                                      options={daysOption}
                                      isValueSelected={dataHari.nama}
                                      placeholder="Pilih Opsi"
                                      onChange={(value: string) => {
                                        setDataHari({
                                          ...dataHari,
                                          nama: value,
                                        });
                                      }}
                                      className="dark:bg-dark-900"
                                    />
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
                              `ingin menghapus Hari ${Hari.nama}?`,
                              async () => {
                                try {
                                  await deleteHari.mutateAsync(Hari.id);
                                  sweetAlert(
                                    "success",
                                    "Hari berhasil dihapus",
                                    "success",
                                  );
                                } catch (error) {
                                  setErrorHari((error as any).message);
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ComponentCard>
      </div>


{/* create modal */}
      <dialog ref={createRef} className="modal modal-middle">
        <div className="modal-action">
          <div className="modal-box bg-white dark:bg-black border-white border">
            <div className="flex justify-between">
              <div>
                <h3 className="font-normal text-base">Halo Admin</h3>
              </div>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
            {errorHari !== "" && (
              <Alert
                variant="error"
                title="Pesan Error"
                message={errorHari}
                showLink={false}
              />
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault(); // cegah reload page

                try {
                  await createHari.mutateAsync(dataHari);
                  createRef.current?.close();
                  setErrorHari("");
                  setDataHari({ id: 0, nama: "" });
                  sweetAlert("success", "Hari berhasil ditambahkan", "success");
                } catch (error) {
                  setErrorHari((error as any)?.response?.data?.message);
                }
              }}
            >
              <div className="grid grid-cols-11 gap-x-6 gap-y-5">
                <div className="col-span-10 my-4">
                  <Label>Nama Hari</Label>
                  <Select
                    isRequired={true}
                    isValueSelected={dataHari.nama}
                    options={daysOption}
                    placeholder="Pilih Opsi"
                    onChange={(value: string) => {
                      setDataHari({ ...dataHari, nama: value });
                    }}
                    className="dark:bg-dark-900"
                  />
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
