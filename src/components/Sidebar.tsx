// components/Sidebar.tsx
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import type { Kategori } from "../models/Produk";
import UserProfileCard from "./UserProfileCard";
import { getMe } from "../services/authService";
import type { UserProfile } from "../models/AuthModel";

interface SidebarProps {
  kategoriList: Kategori[];
  activeKategoriId: string;
  onSelectKategori: (id: string) => void;
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // State untuk menyimpan data user asli dari API /api/v1/auth/me
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Fetch data profil user saat sidebar dimuat
  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch((err) => console.error("Gagal memuat profil /me di sidebar:", err))
      .finally(() => setLoadingUser(false));
  }, []);

  const handleSettingsClick = () => {
    window.location.href = "/dashboard/customer?tab=settings";
  };

  return (
    <aside className="hidden md:flex flex-col w-80 shrink-0 bg-white border-r border-gray-200 sticky top-[76px] h-[calc(100vh-76px)] relative">
      
      {/* 1. BAGIAN ATAS: Pencarian */}
      <div className="p-6 pb-4 shrink-0">
        <label className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
          Pencarian Cepat
        </label>
        <div className="relative mt-3">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari disini..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7] focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 2. BAGIAN TENGAH: Kategori */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
        <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 pl-2">
          Kategori Produk
        </p>
        <div className="flex flex-col gap-1.5">
          {kategoriList.map((kategori) => {
            const active = kategori.id === activeKategoriId;
            return (
              <button
                key={kategori.id}
                onClick={() => onSelectKategori(kategori.id)}
                className={`text-left px-5 py-3.5 rounded-xl text-base font-bold transition-all duration-300 ${
                  active
                    ? "bg-[#1B2A6B] text-white shadow-md shadow-blue-900/20 translate-x-1"
                    : "text-gray-600 hover:bg-gray-100 hover:text-[#1B2A6B] hover:translate-x-1"
                }`}
              >
                {kategori.nama}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. BAGIAN BAWAH: Bottom Bar Akun DYNAMIC dari API /me */}
      <div className="shrink-0 bg-gray-50 flex items-center justify-between p-3 border-t border-gray-200">
        
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 text-left hover:bg-gray-200 p-1.5 rounded-lg transition-colors flex-1 group min-w-0"
        >
          <div className="relative shrink-0 flex items-center justify-center w-9 h-9 bg-gray-200 text-gray-400 rounded-full shadow-inner">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-gray-50 rounded-full bg-green-500 group-hover:border-gray-200 transition-colors"></div>
          </div>

          <div className="flex flex-col max-w-[140px] truncate">
            {loadingUser ? (
              <div className="space-y-1 animate-pulse">
                <div className="h-3.5 bg-gray-300 rounded w-20"></div>
                <div className="h-2.5 bg-gray-200 rounded w-24"></div>
              </div>
            ) : (
              <>
                <span className="text-sm font-bold text-[#1B2A6B] leading-tight truncate">
                  {user?.nama ?? "Pengguna"}
                </span>
                <span className="text-[11px] text-gray-500 leading-tight truncate">
                  {user?.email ?? "user@nusantaramandiri.com"}
                </span>
              </>
            )}
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0 pl-1">
          <button 
            onClick={handleSettingsClick}
            className="p-2 text-gray-500 hover:bg-gray-200 hover:text-[#1B2A6B] rounded-lg transition-colors"
            title="Pengaturan"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- POPOUT CARD MEMOIZASI PROFIL --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
            <UserProfileCard onClose={() => setIsProfileOpen(false)} />
          </>
        )}
      </AnimatePresence>

    </aside>
  );
}
