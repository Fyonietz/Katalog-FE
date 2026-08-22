// components/Sidebar.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Kategori } from "../models/Produk";

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

  // --- DUMMY DATA AKUN (Silakan ganti/fetch dari backend nantinya) ---
  const [user] = useState({
    name: "Pengguna",
    username: "User_NM",
    email: "user@nusantaramandiri.com",
    role: "Member Area",
    badge: "PRO",
    status: "online", // online, offline, busy, dsb.
  });

  const handlePesananClick = () => {
    console.log("Navigasi ke Pesanan Saya");
    // TODO: Tambahkan router navigasi ke halaman pesanan
  };

  const handleSettingsClick = () => {
    console.log("Buka Pengaturan Akun");
    // TODO: Buka modal settings atau navigasi
  };

  const handleLogoutClick = () => {
    console.log("Proses Logout Akun");
    // TODO: Hapus token auth dan redirect ke login
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

      {/* 3. BAGIAN BAWAH: Bottom Bar Akun ala Discord */}
      <div className="shrink-0 bg-gray-50 flex items-center justify-between p-3 border-t border-gray-200">
        
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center gap-3 text-left hover:bg-gray-200 p-1.5 rounded-lg transition-colors flex-1 group"
        >
          <div className="relative shrink-0 flex items-center justify-center w-9 h-9 bg-gray-200 text-gray-400 rounded-full shadow-inner">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-gray-50 rounded-full group-hover:border-gray-200 transition-colors ${
              user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
          </div>
          <div className="flex flex-col max-w-[140px]">
            <span className="text-sm font-bold text-[#1B2A6B] leading-tight truncate">{user.name}</span>
            <span className="text-[11px] text-gray-500 leading-tight truncate">{user.username}</span>
          </div>
        </button>

        <div className="flex items-center gap-1 shrink-0 pl-1">
          <button 
            onClick={handleSettingsClick}
            className="p-2 text-gray-500 hover:bg-gray-200 hover:text-[#1B2A6B] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* --- POPOUT MENU (Profile Card ala Discord) --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
            
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-[75px] left-3 w-[290px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-50 flex flex-col"
            >
              {/* Banner Profile */}
              <div className="h-20 bg-gradient-to-r from-[#1B2A6B] to-[#2E9DF7] w-full relative">
                <div className="absolute -bottom-7 left-4 p-1.5 bg-white rounded-full">
                  <div className="relative flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full shadow-inner">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-[3px] border-white rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="h-9 w-full"></div>
              
              {/* Profile Details (Data terikat pada state user) */}
              <div className="px-5 pb-3">
                <h3 className="text-xl font-black text-[#1B2A6B] leading-none">{user.name}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">{user.email}</p>
                <div className="mt-3 py-2 px-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
                   <span className="text-xs font-bold text-[#1B2A6B]">{user.role}</span>
                   <span className="ml-auto bg-[#2E9DF7] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{user.badge}</span>
                </div>
              </div>
              
              <div className="h-px bg-gray-100 w-full"></div>
              
              {/* Menu Actions */}
              <div className="p-2 flex flex-col gap-1">
                <button 
                  onClick={() => { setIsProfileOpen(false); handlePesananClick(); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors group text-left w-full"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1B2A6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  <span className="text-sm font-bold text-gray-600 group-hover:text-[#1B2A6B]">Pesanan Saya</span>
                </button>
                
                <button 
                  onClick={() => { setIsProfileOpen(false); handleSettingsClick(); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors group text-left w-full"
                >
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-[#1B2A6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm font-bold text-gray-600 group-hover:text-[#1B2A6B]">Pengaturan</span>
                </button>
                
                <div className="h-px bg-gray-100 my-1 mx-2"></div>
                
                <button 
                  onClick={() => { setIsProfileOpen(false); handleLogoutClick(); }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group text-left w-full"
                >
                  <svg className="w-5 h-5 text-red-400 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  <span className="text-sm font-bold text-red-500 group-hover:text-red-600">Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </aside>
  );
}
