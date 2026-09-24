// src/pages/Pelanggan/SettingsPage.tsx
import { useState } from "react";
import { MapPin, Phone, User, Plus, Edit3, Trash2, CheckCircle2 } from "lucide-react";

interface Alamat {
  id: number;
  namaPenerima: string;
  telepon: string;
  detailAlamat: string;
  isUtama: boolean;
}

export default function SettingsPage() {
  // Data dummy alamat untuk contoh tampilan (Sesuaikan dengan API Anda nantinya)
  const [alamatList, setAlamatList] = useState<Alamat[]>([
    {
      id: 1,
      namaPenerima: "Habib Herdiansyah",
      telepon: "089765433",
      detailAlamat: "Bukittinggi - Payakumbuh, paritrantang, Payakumbuh, West Sumatra, 26218, Indonesia",
      isUtama: true,
    },
    {
      id: 2,
      namaPenerima: "Habib Herdiansyah",
      telepon: "12313412312",
      detailAlamat: "Koto Tuo, Payakumbuh, West Sumatra, 26218, Indonesia",
      isUtama: false,
    }
  ]);

  const handleSetUtama = (id: number) => {
    const updated = alamatList.map(item => ({
      ...item,
      isUtama: item.id === id
    }));
    setAlamatList(updated);
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
      setAlamatList(alamatList.filter(item => item.id !== id));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Pengaturan Alamat</h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">Kelola lokasi titik pengiriman pesanan cetak Anda.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-[#2E9DF7] hover:bg-[#1B2A6B] text-white px-5 py-3 rounded-2xl text-xs font-extrabold transition-all shadow-md">
          <Plus className="w-4 h-4" /> Tambah dari Peta
        </button>
      </div>

      {/* Grid Alamat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {alamatList.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-[2rem] p-6 border transition-all flex flex-col justify-between shadow-sm relative overflow-hidden ${
              item.isUtama ? "border-[#2E9DF7] ring-2 ring-[#2E9DF7]/10" : "border-gray-100 hover:border-gray-200"
            }`}
          >
            {item.isUtama && (
              <span className="absolute top-0 right-0 bg-[#2E9DF7] text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-sm">
                Alamat Utama
              </span>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#1B2A6B]" />
                  <h3 className="font-extrabold text-[#1B2A6B] text-sm md:text-base">{item.namaPenerima}</h3>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{item.telepon}</span>
                </div>
              </div>

              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#2E9DF7] shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 font-medium leading-relaxed">
                  {item.detailAlamat}
                </p>
              </div>
            </div>

            {/* Tombol Aksi di Bawah Kartu */}
            <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
              {!item.isUtama ? (
                <button 
                  onClick={() => handleSetUtama(item.id)}
                  className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Jadikan Utama
                </button>
              ) : (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                </span>
              )}

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-[#2E9DF7] bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors" title="Edit Alamat">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)} 
                  className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-xl transition-colors" 
                  title="Hapus Alamat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
