// src/pages/Admin/ProdukAdminPage.tsx
import { useEffect, useState } from "react";
import DataTable from "../../components/ui/DataTable";
import { produkColumns } from "../../config/produkColumns";
import { getProdukList, createProduct, updateProduct, deleteProduct } from "../../services/produkService";
import { getKategoriList, type KategoriProduct } from "../../services/kategoriService";
import { getStatusList, type StatusProduct } from "../../services/statusService";
import { showModal } from "../../lib/showModal";
import type { Produk, PricingMode, DimensionUnit } from "../../models/Produk";
import { PRICING_MODES, DIMENSION_UNITS, PRICING_MODE_LABELS, DEFAULT_PRICING_MODE, DEFAULT_DIMENSION_UNIT } from "../../utils/pricing";
import Modal from "../../components/ui/Modal"; // <-- TAMBAHKAN IMPORT MODAL

export default function ProdukAdminPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<KategoriProduct[]>([]);
  const [statusOptions, setStatusOptions] = useState<StatusProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Semua");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduk, setEditingProduk] = useState<Produk | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // STATE UNTUK MODAL HAPUS
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [idKategoriProduct, setIdKategoriProduct] = useState<number | string>("");
  const [idStatusProduct, setIdStatusProduct] = useState<number | string>("");
  const [nama, setNama] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [harga, setHarga] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [pricingMode, setPricingMode] = useState<PricingMode>(DEFAULT_PRICING_MODE);
  const [dimensionUnit, setDimensionUnit] = useState<DimensionUnit>(DEFAULT_DIMENSION_UNIT);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [dataProduk, dataKategori, dataStatus] = await Promise.all([
        getProdukList().catch(() => []),
        getKategoriList().catch(() => []),
        getStatusList().catch(() => []),
      ]);
      setProdukList(dataProduk);
      setKategoriOptions(dataKategori);
      setStatusOptions(dataStatus);
      if (dataKategori.length > 0 && !idKategoriProduct) setIdKategoriProduct(dataKategori[0].id);
      if (dataStatus.length > 0 && !idStatusProduct) setIdStatusProduct(dataStatus[0].id);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadInitialData(); }, []);

  const TABS = ["Semua", ...Array.from(new Set(kategoriOptions.map(k => k.nama)))];
  const finalProdukList = produkList.filter(p => {
    const searchMatch = (p.nama||"").toLowerCase().includes(searchQuery.toLowerCase());
    const tabMatch = activeTab === "Semua" || p.kategoryProduct?.nama?.toLowerCase() === activeTab.toLowerCase();
    return searchMatch && tabMatch;
  });

  const handleOpenModal = (produk?: Produk) => {
    setEditingProduk(produk || null);
    setNama(produk?.nama || "");
    setDeskripsi(produk?.deskripsi || "");
    setHarga(produk?.harga?.toString() || "");
    setBackgroundColor(produk?.backgroundColor || "#FFFFFF");
    setPricingMode(produk?.pricingMode ?? DEFAULT_PRICING_MODE);
    setDimensionUnit(produk?.dimensionUnit ?? DEFAULT_DIMENSION_UNIT);
    setIdKategoriProduct(produk?.kategoryProduct?.id || produk?.idKategoriProduct || (kategoriOptions[0]?.id ?? ""));
    setIdStatusProduct(produk?.statusProduct?.id || produk?.idStatusProduct || (statusOptions[0]?.id ?? ""));
    setImageFile(null);
    setIsModalOpen(true);
  };

  // TRIGGER UNTUK MEMBUKA MODAL HAPUS
  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  // FUNGSI EKSEKUSI HAPUS (DIPANGGIL DARI MODAL)
  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteConfirmId);
      showModal("Dihapus!");
      loadInitialData();
    } catch (e: any) { 
      showModal(e.message); 
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingProduk) {
        await updateProduct(editingProduk.id, { idKategoriProduct: Number(idKategoriProduct), idStatusProduct: Number(idStatusProduct), nama, deskripsi, harga: Number(harga), pricingMode, dimensionUnit, backgroundColor, imagePath: editingProduk.imagePath });
      } else {
        const fd = new FormData();
        fd.append("IdKategoriProduct", idKategoriProduct.toString());
        fd.append("IdStatusProduct", idStatusProduct.toString());
        fd.append("Nama", nama); fd.append("Deskripsi", deskripsi); fd.append("Harga", harga); fd.append("BackgroundColor", backgroundColor);
        fd.append("PricingMode", pricingMode); fd.append("DimensionUnit", dimensionUnit);
        if (imageFile) fd.append("Image", imageFile);
        await createProduct(fd);
      }
      setIsModalOpen(false);
      loadInitialData();
    } finally { setSubmitting(false); }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full bg-[#F4F6FB]">
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 hidden sm:flex justify-between items-center z-10">
        <div><h1 className="text-lg font-bold text-[#1B2A6B]">Katalog Produk</h1></div>
        <button onClick={() => handleOpenModal()} className="bg-[#1B2A6B] text-white px-4 py-2 rounded-xl font-bold text-sm">
          + Tambah Produk
        </button>
      </div>

      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-4">
          <div className="shrink-0 space-y-3">
            <input type="text" placeholder="Cari..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full sm:max-w-md px-4 py-2 text-sm rounded-xl border focus:border-[#2E9DF7] outline-none" />
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {TABS.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-full text-xs font-bold border ${activeTab === tab ? "bg-[#1B2A6B] text-white" : "bg-white text-gray-500"}`}>{tab}</button>
              ))}
            </div>
            {/* Tombol Mobile Add */}
            <button onClick={() => handleOpenModal()} className="sm:hidden w-full bg-[#1B2A6B] text-white px-4 py-2 rounded-xl font-bold text-sm mb-2">
              + Tambah Produk
            </button>
          </div>
          <div className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col relative overflow-hidden">
             <div className="flex-1 overflow-y-auto">
               <DataTable columns={produkColumns} data={finalProdukList} getRowId={r => r.id.toString()} isLoading={loading} onEdit={r => handleOpenModal(r)} onDelete={r => handleDelete(r.id)} />
             </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b flex justify-between shrink-0"><h3 className="font-bold">{editingProduk ? "Edit" : "Tambah"}</h3><button onClick={() => setIsModalOpen(false)}>✕</button></div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div><label className="block text-xs font-bold mb-1">Nama</label><input required value={nama} onChange={e=>setNama(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold mb-1">Kategori</label><select value={idKategoriProduct} onChange={e=>setIdKategoriProduct(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm">{kategoriOptions.map(k=><option key={k.id} value={k.id}>{k.nama}</option>)}</select></div>
                <div><label className="block text-xs font-bold mb-1">Status</label><select value={idStatusProduct} onChange={e=>setIdStatusProduct(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm">{statusOptions.map(s=><option key={s.id} value={s.id}>{s.nama}</option>)}</select></div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Harga <span className="font-normal text-gray-400">({PRICING_MODE_LABELS[pricingMode]})</span></label>
                <input type="number" required value={harga} onChange={e=>setHarga(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-bold mb-1">Mode Harga</label><select value={pricingMode} onChange={e=>setPricingMode(e.target.value as PricingMode)} className="w-full border rounded-xl px-3 py-2 text-sm">{PRICING_MODES.map(m=><option key={m} value={m}>{PRICING_MODE_LABELS[m]}</option>)}</select></div>
                <div><label className="block text-xs font-bold mb-1">Satuan Dimensi</label><select value={dimensionUnit} onChange={e=>setDimensionUnit(e.target.value as DimensionUnit)} className="w-full border rounded-xl px-3 py-2 text-sm">{DIMENSION_UNITS.map(u=><option key={u} value={u}>{u === "centimeter" ? "centimeter (cm)" : "meter (m)"}</option>)}</select></div>
              </div>
              <p className="-mt-2 text-[10px] text-gray-400"><b>PerArea</b> memakai panjang x tinggi (mis. spanduk/banner), <b>PerLength</b> memakai panjang saja (mis. kain). Satuan dimensi hanya berpengaruh untuk kedua mode itu.</p>
              <div><label className="block text-xs font-bold mb-1">Deskripsi</label><textarea value={deskripsi} onChange={e=>setDeskripsi(e.target.value)} className="w-full border rounded-xl px-3 py-2 text-sm" /></div>
              {!editingProduk && <div><label className="block text-xs font-bold mb-1">Gambar</label><input type="file" onChange={e=>setImageFile(e.target.files?.[0]||null)} /></div>}
              <div className="pt-4 flex gap-3"><button type="button" onClick={()=>setIsModalOpen(false)} className="flex-1 border rounded-xl py-2">Batal</button><button type="submit" disabled={submitting} className="flex-1 bg-[#1B2A6B] text-white rounded-xl py-2">Simpan</button></div>
            </form>
          </div>
        </div>
      )}

      {/* KOMPONEN MODAL KONFIRMASI HAPUS */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan."
        variant="warning"
        confirmLabel="Hapus Produk"
        cancelLabel="Batal"
        onConfirm={executeDelete}
        danger={true}
        isProcessing={isDeleting}
      />
    </div>
  );
}
