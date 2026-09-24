// src/pages/Pelanggan/SettingsPage.tsx
import { useEffect, useState } from "react";
import { getAlamatUser, deleteAlamat, type AlamatGetResponse } from "../../services/alamatService";
import { getMe } from "../../services/authService";
import MapPickerModal from "../../components/MapPickerModal";
import { Map, Phone } from "lucide-react";

export default function SettingsPage() {
  const [alamatList, setAlamatList] = useState<AlamatGetResponse[]>([]);
  const [loadingAlamat, setLoadingAlamat] = useState<boolean>(true);
  const [userId, setUserId] = useState<number>(0);
  
  // State Modal Map
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [editingAlamat, setEditingAlamat] = useState<AlamatGetResponse | null>(null);

  // State Modal Konfirmasi Delete
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchInitialData = async () => {
    try {
      setLoadingAlamat(true);
      const userData = await getMe();
      if (userData?.id) setUserId(userData.id);

      const alamatData = await getAlamatUser();
      setAlamatList(alamatData || []);
    } catch (err) {
      console.error("Gagal memuat data pengaturan:", err);
    } finally {
      setLoadingAlamat(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenAdd = () => {
    setEditingAlamat(null);
    setIsMapOpen(true);
  };

  const handleOpenEdit = (item: AlamatGetResponse) => {
    setEditingAlamat(item);
    setIsMapOpen(true);
  };

  // Mengeksekusi penghapusan setelah dikonfirmasi via Custom Modal
  const executeDelete = async () => {
    if (deleteId === null) return;
    try {
      setIsDeleting(true);
      await deleteAlamat(deleteId);
      setDeleteId(null); // Tutup modal konfirmasi
      fetchInitialData(); // Refresh list alamat
    } catch (err) {
      console.error("Gagal menghapus alamat:", err);
      // Anda bisa mengganti ini dengan Toast/Notification system nantinya
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl relative">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Pengaturan Alamat</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Kelola lokasi pengiriman pesanan cetak Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-sm font-bold text-[#1B2A6B]">Daftar Alamat Pengiriman</h2>
          <button
            onClick={handleOpenAdd}
            className="bg-[#2E9DF7] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-[#1B2A6B] transition-colors shadow-md"
          >
            <Map className="w-4 h-4" />
            Tambah dari Peta
          </button>
        </div>

        {loadingAlamat ? (
          <div className="flex flex-col gap-3 py-4">
            <div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
            <div className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
        ) : alamatList.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-xl bg-gray-50/50">
            <p className="text-sm text-gray-400 font-medium">Belum ada alamat yang tersimpan.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {alamatList.map((item) => (
              <div 
                key={item.id} 
                className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between hover:border-blue-200 transition-colors"
              >
                <div>
                  <h3 className="text-xs font-extrabold text-[#1B2A6B] uppercase mb-1">
                    {item.namaUser}
                  </h3>
                  {item.noTelepon && item.noTelepon.trim() !== "" && (
                    <p className="flex items-center gap-1.5 text-xs font-bold text-gray-600 mb-1">
                      <Phone className="w-3.5 h-3.5" />
                      {item.noTelepon}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 leading-relaxed mt-1">{item.content}</p>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end gap-3">
                  <button 
                    onClick={() => handleOpenEdit(item)} 
                    className="text-xs font-semibold text-[#2E9DF7] hover:text-[#1B2A6B] hover:underline"
                  >
                    Edit Alamat
                  </button>
                  <button 
                    onClick={() => setDeleteId(item.id)} // Tampilkan Modal Konfirmasi
                    className="text-xs font-semibold text-red-500 hover:text-red-700 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- CUSTOM MODAL KONFIRMASI HAPUS --- */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-2">Hapus Alamat?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Alamat ini akan dihapus secara permanen dari daftar pengiriman Anda. Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={executeDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 shadow-md disabled:opacity-50"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Render Modal Peta */}
      {userId > 0 && (
        <MapPickerModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          userId={userId}
          editData={editingAlamat}
          onSuccess={fetchInitialData} 
        />
      )}
    </div>
  );
}
