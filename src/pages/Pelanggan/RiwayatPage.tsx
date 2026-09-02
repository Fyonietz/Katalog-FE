// src/pages/Pelanggan/RiwayatPage.tsx
export default function RiwayatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Riwayat Pesanan</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Daftar seluruh transaksi pemesanan yang telah selesai.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center py-12">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm font-bold text-gray-600">Belum Ada Riwayat Transaksi</p>
        <p className="text-xs text-gray-400 mt-1">
          Semua transaksi cetak yang sudah selesai dikerjakan akan tersimpan di sini.
        </p>
      </div>
    </div>
  );
}
