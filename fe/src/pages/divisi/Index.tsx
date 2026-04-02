import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
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
  useCreateDivisi,
  useDeleteDivisi,
  useDivisi,
  useUpdateDivisi,
} from "../../services/API_Query";
import { PencilIcon, TrashBinIcon } from "../../icons";

export default function Divisi() {
  const { data: divisis } = useDivisi();
  const [dataDivisi, setDataDivisi] = useState({
    id: 0,
    nama: "",
  });
  const [errorDivisi, setErrorDivisi] = useState("");

  const createRef = useRef(null);
  const updateRef = useRef(null);

  const createDivisi = useCreateDivisi(); // ⭐ panggil di atas
  const updateDivisi = useUpdateDivisi(); // ⭐ panggil di atas
  const deleteDivisi = useDeleteDivisi(); // ⭐ panggil di atas
  return (
    <>
      <PageMeta title="Divisi - Absensi" description="" />
      <PageBreadcrumb pageTitle="Divisi" />

      <div className="flex items-center justify-end my-4">
        <Button
          onClick={() => {
            createRef.current?.showModal();
            setDataDivisi({ id: 0, nama: "" });
            setErrorDivisi("");
          }}
        >
          Tambah
        </Button>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Divisi">
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
                      Nama Divisi
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
                  {(divisis as any)?.map((divisi: any, index: number) => (
                    <TableRow key={divisi.id}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                        {divisi.nama}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400 space-x-4">
                        <Button
                          onClick={() => {
                            setDataDivisi({ id: divisi.id, nama: divisi.nama });
                            updateRef.current?.showModal();
                          }}
                          variant="warning"
                          size="sm"
                        >
                          <PencilIcon />{" "}
                        </Button>
                        <Button
                          onClick={() => {
                            sweetAlertConfirm(
                              "Apakah Anda yakin ",
                              `ingin menghapus divisi ${(divisi as any)?.nama}?`,
                              async () => {
                                try {
                                  await deleteDivisi.mutateAsync(divisi.id);
                                  sweetAlert(
                                    "success",
                                    "Divisi berhasil dihapus",
                                    "success",
                                  );
                                } catch (error) {
                                  setErrorDivisi((error as any).message);
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

      <dialog ref={updateRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-action">
          <div className="modal-box dark:bg-black border-white border">
            <div className="flex justify-between">
              <div>
                <h3 className="font-normal text-base">Halo Admin</h3>
              </div>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
            {errorDivisi !== "" && (
              <Alert
                variant="error"
                title="Pesan Error"
                message={errorDivisi}
                showLink={false}
              />
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault(); // cegah reload page

                try {
                  await updateDivisi.mutateAsync({
                    id: dataDivisi.id,
                    data: dataDivisi,
                  });
                  updateRef.current?.close();
                  setErrorDivisi("");
                  setDataDivisi({ id: 0, nama: "" });
                  sweetAlert("success", "Divisi berhasil diubah", "success");
                } catch (error) {
                  setErrorDivisi((error as any)?.response?.data?.message);
                }
              }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Nama Divisi</Label>
                  <Input
                    required
                    minLength={5}
                    id="nama"
                    placeholder="Web Desain (CAPICALIZE)"
                    value={dataDivisi.nama}
                    onChange={(e) =>
                      setDataDivisi({
                        ...dataDivisi,
                        nama: e.target.value,
                      })
                    }
                    type="text"
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

      <dialog ref={createRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-action">
          <div className="modal-box dark:bg-black border-white border">
            <div className="flex justify-between">
              <div>
                <h3 className="font-normal text-base">Halo Admin</h3>
              </div>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
            {errorDivisi !== "" && (
              <Alert
                variant="error"
                title="Pesan Error"
                message={errorDivisi}
                showLink={false}
              />
            )}
            <form
              onSubmit={async (e) => {
                e.preventDefault(); // cegah reload page

                try {
                  await createDivisi.mutateAsync(dataDivisi);
                  createRef.current?.close();
                  setErrorDivisi("");
                  setDataDivisi({ id: 0, nama: "" });
                  sweetAlert(
                    "success",
                    "Divisi berhasil ditambahkan",
                    "success",
                  );
                } catch (error) {
                  setErrorDivisi((error as any)?.response?.data?.message);
                }
              }}
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2 lg:col-span-1 my-4">
                  <Label>Nama Divisi</Label>
                  <Input
                    required
                    minLength={5}
                    autoCapitalize="words"
                    id="nama"
                    placeholder="Web Desain (Capitalize)"
                    value={dataDivisi.nama}
                    onChange={(e) =>
                      setDataDivisi({ ...dataDivisi, nama: e.target.value })
                    }
                    type="text"
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
