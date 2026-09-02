// src/pages/Pelanggan/PesananPage.tsx
export default function PesananPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Pesanan Saya</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Pantau status pengerjaan dan pengiriman produk cetak Anda.
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
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
        <p className="text-sm font-bold text-gray-600">Belum Ada Pesanan Aktif</p>
        <p className="text-xs text-gray-400 mt-1">
          Pesanan yang sedang diproses akan muncul di halaman ini.
        </p>
        <a
          href="/shopping"
          className="mt-4 inline-block bg-[#1B2A6B] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md"
        >
          Pesan Sekarang
        </a>
      </div>
    </div>
  );
}
