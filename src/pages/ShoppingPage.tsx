// src/pages/ShoppingPage.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useShoppingController } from "../hooks/useShoppingController";
import Sidebar from "../components/Sidebar";
import ShoppingProductCard from "../components/ShoppingProductCard";
import CartDrawer from "../components/CartDrawer";
import ProductModal from "../components/ProductModal";
import UserProfileCard from "../components/UserProfileCard";
import type { Produk } from "../models/Produk";

// IMPORT cartService secara langsung agar data selalu real-time
import { getCart, getCartTotal, updateCartQty, removeFromCart } from "../services/cartService";

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeOut", duration: 0.4, staggerChildren: 0.04 },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { ease: "easeOut", duration: 0.2 }
  }
};

export default function ShoppingPage() {
  const {
    kategoriList,
    activeKategoriId,
    setActiveKategoriId,
    produkTerfilter,
    loading,
    search,
    setSearch,
    cartOpen,
    setCartOpen,
    getQty,
    setQty,
  } = useShoppingController();

  // STATE LOKAL KERANJANG
  const [localCart, setLocalCart] = useState(getCart());
  const localCartTotal = getCartTotal(localCart);
  const localCartCount = localCart.reduce((sum, item) => sum + item.qty, 0);

  // State untuk Dropdown Profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);

  const refreshLocalCart = () => {
    setLocalCart(getCart());
  };

  useEffect(() => {
    const handleStorageChange = () => refreshLocalCart();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Cek apakah user sudah login (Opsional: sesuaikan dengan auth service Anda)
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="h-[100dvh] bg-[#F4F6FB] relative w-full overflow-hidden flex flex-col">
      
      {/* 1. TOPBAR UTAMA (Responsif) */}
      <div className="shrink-0 z-30 h-[70px] md:h-[76px] bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 flex items-center justify-between gap-3 md:gap-6">
        
        {/* Brand */}
        <Link to="/" className="font-extrabold text-[#1B2A6B] text-lg md:text-xl tracking-tight whitespace-nowrap shrink-0">
          Nusantara <span className="hidden sm:inline">Mandiri</span>
        </Link>

        {/* Search Bar (Tersembunyi di layar sangat kecil, muncul di layar menengah ke atas) */}
        <div className="relative flex-1 w-full max-w-2xl hidden sm:block">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk cetak..."
            className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-[#2E9DF7] focus:ring-2 focus:ring-[#2E9DF7]/30 transition-all shadow-inner outline-none"
          />
        </div>

        {/* Aksi Kanan (Cart & User Profile) */}
        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          
          {/* Tombol Cart Mobile (Ikon saja) */}
          <button 
            onClick={() => setCartOpen(true)}
            className="md:hidden relative p-2 text-gray-600 hover:text-[#2E9DF7] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {localCartCount > 0 && (
              <span className="absolute top-1 right-0 bg-red-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {localCartCount}
              </span>
            )}
          </button>

          {/* Tombol Cart Desktop (Teks + Ikon) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCartOpen(true)}
            className="hidden md:flex relative rounded-xl bg-blue-50 text-[#2E9DF7] px-4 py-2.5 font-bold hover:bg-[#2E9DF7] hover:text-white transition-colors items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Keranjang
            {localCartCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-1 shadow-sm">
                {localCartCount}
              </span>
            )}
          </motion.button>

          <div className="w-px h-6 bg-gray-200 hidden md:block"></div>

          {/* User Profile Card / Avatar dengan Dropdown */}
          <div className="relative">
            {isLoggedIn ? (
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)} 
                className="flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full md:rounded-xl transition-colors border border-transparent hover:border-gray-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1B2A6B] to-[#2E9DF7] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  U
                </div>
                <div className="hidden md:block text-left mr-2">
                  <p className="text-xs font-extrabold text-[#1B2A6B] leading-tight">Dashboard</p>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight">Pesanan Saya</p>
                </div>
              </button>
            ) : (
              <Link to="/login" className="bg-[#1B2A6B] text-white text-xs md:text-sm font-bold px-4 md:px-5 py-2 md:py-2.5 rounded-xl hover:bg-[#111A42] transition-colors shadow-md whitespace-nowrap">
                Masuk
              </Link>
            )}

            {/* Render komponen dropdown profil */}
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <UserProfileCard onClose={() => setIsProfileOpen(false)} />
                </>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Search Bar khusus Mobile (Muncul di bawah header jika layar sangat kecil) */}
      <div className="sm:hidden px-4 pt-3 bg-white border-b border-gray-100 pb-3 shrink-0">
        <div className="relative w-full">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk cetak..."
            className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:border-[#2E9DF7] outline-none"
          />
        </div>
      </div>

      {/* Kategori Horizontal Scroll (HANYA MOBILE) */}
      <div className="md:hidden shrink-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 px-4 flex overflow-x-auto gap-2 no-scrollbar">
        {kategoriList.map((kategori) => (
          <button
            key={kategori.id}
            onClick={() => setActiveKategoriId(kategori.id)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              kategori.id === activeKategoriId
                ? "bg-[#1B2A6B] text-white border-[#1B2A6B] shadow-md shadow-blue-900/20"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            {kategori.nama}
          </button>
        ))}
      </div>

      {/* 2. BUNGKUSAN BODY UTAMA */}
      <div className="flex flex-1 w-full overflow-hidden">
        
        <Sidebar
          kategoriList={kategoriList}
          activeKategoriId={activeKategoriId}
          onSelectKategori={setActiveKategoriId}
          search={search}
          onSearchChange={setSearch}
        />

        {/* 3. KONTEN PRODUK UTAMA */}
        <main className="flex-1 p-4 md:p-8 min-w-0 overflow-y-auto pb-24 md:pb-8 relative">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-[#1B2A6B]">
                {kategoriList.find((k) => k.id === activeKategoriId)?.nama ?? "Semua Produk"}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-1">{produkTerfilter.length} produk siap cetak</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A6B]"></div>
            </div>
          ) : produkTerfilter.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-base font-bold text-gray-700">Produk tidak ditemukan</p>
              <p className="text-xs text-gray-500 mt-1">Coba gunakan kata kunci pencarian yang lain.</p>
            </div>
          ) : (
          <motion.div 
            key={activeKategoriId}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            // PERBAIKAN GRID: Menambahkan sm:grid-cols-3 agar di layar kecil tidak memaksakan kartu menjadi terlalu kecil
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full"
          >
            <AnimatePresence mode="popLayout">
              {produkTerfilter.map((produk) => (
                <ShoppingProductCard
                  key={produk.id}
                  produk={produk}
                  qty={getQty(produk.id.toString())}
                  onQtyChange={(qty) => setQty(produk.id.toString(), qty)}
                  onAddToCart={() => setSelectedProduk(produk)} 
                  onClickCard={() => setSelectedProduk(produk)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
          )}
        </main>
      </div>

      {/* Floating Action Button (FAB) Keranjang Khusus Mobile */}
      <AnimatePresence>
        {localCartCount > 0 && (
          <motion.button
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCartOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-30 bg-[#2E9DF7] text-white p-3.5 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center border-2 border-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1.5 -left-1.5 bg-red-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              {localCartCount}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Laci Keranjang disinkronisasi dengan localCart */}
      <CartDrawer
        open={cartOpen}
       onClose={() => setCartOpen(false)}
        cart={localCart}
        cartTotal={localCartTotal}
        onUpdateQty={(id: number, qty: number) => {
          updateCartQty(id, qty);
          refreshLocalCart();
        }}
        onRemove={(id: number) => {
          removeFromCart(id);
          refreshLocalCart();
        }}
      />

      <ProductModal
        produk={selectedProduk}
        isOpen={selectedProduk !== null}
        onClose={() => setSelectedProduk(null)}
        qty={selectedProduk ? getQty(selectedProduk.id.toString()) : 1}
        onQtyChange={(qty) => {
          if (selectedProduk) setQty(selectedProduk.id.toString(), qty);
        }}
        onAddToCart={() => {
          refreshLocalCart(); 
          setCartOpen(true);  
        }}
      />
      
    </div>
  );
}
