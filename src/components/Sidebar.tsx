// src/components/Sidebar.tsx
interface Kategori {
  id: number;
  nama: string;
}

interface SidebarProps {
  kategoriList: Kategori[];
  activeKategoriId: number | "";
  onSelectKategori: (id: number | "") => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Sidebar({
  kategoriList,
  activeKategoriId,
  onSelectKategori,
  search,
  onSearchChange,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-gray-100 shrink-0 h-full overflow-y-auto">
      <div className="p-6 flex flex-col gap-8">
        
        {/* PENCARIAN CEPAT */}
        <div>
          <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
            Pencarian Cepat
          </h3>
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari disini..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#2E9DF7] focus:ring-1 focus:ring-[#2E9DF7] transition-all"
            />
          </div>
        </div>

        {/* KATEGORI PRODUK */}
        <div>
          <h3 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">
            Kategori Produk
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onSelectKategori("")}
              className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeKategoriId === ""
                  ? "bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Semua Produk
            </button>
            {kategoriList.map((kat) => (
              <button
                key={kat.id}
                onClick={() => onSelectKategori(kat.id)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeKategoriId === kat.id
                    ? "bg-[#1B2A6B] text-white shadow-md shadow-[#1B2A6B]/20"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {kat.nama}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 
        Footer Profil (Habib Herdiansyah) telah dihapus dari sini.
        Ruang kosong di bawah akan dibiarkan bersih.
      */}
    </aside>
  );
}
