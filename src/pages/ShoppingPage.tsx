// pages/ShoppingPage.tsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useShoppingController } from "../hooks/useShoppingController";
import Sidebar from "../components/Sidebar";
import ShoppingProductCard from "../components/ShoppingProductCard";
import CartDrawer from "../components/CartDrawer";
import ProductModal from "../components/ProductModal";
import type { Produk } from "../models/Produk";

// Variabel animasi konsisten dengan easeOut
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      ease: "easeOut", 
      duration: 0.4, 
      staggerChildren: 0.04 
    },
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
    cart,
    cartOpen,
    setCartOpen,
    cartTotal,
    cartCount,
    getQty,
    setQty,
    handleAddToCart,
    handleUpdateCartQty,
    handleRemoveFromCart,
  } = useShoppingController();

  // State untuk melacak produk mana yang diklik untuk dibuka modalnya
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);

  return (
    <div className="h-[100dvh] bg-[#F4F6FB] relative w-full overflow-hidden flex flex-col">
      
      {/* 1. TOPBAR UTAMA - Tinggi absolut agar presisi dengan Sidebar */}
      <div className="shrink-0 z-30 h-[70px] md:h-[76px] bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 flex items-center gap-4">
        
        <span className="font-extrabold text-[#1B2A6B] text-xl tracking-tight whitespace-nowrap">
          Nusantara Mandiri
        </span>

        <div className="relative flex-1 w-full max-w-3xl ml-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk cetak (mis: Spanduk, Stiker)..."
            className="w-full rounded-xl bg-gray-50 border border-gray-200 pl-9 pr-4 py-2.5 text-sm focus:bg-white focus:border-[#2E9DF7] focus:ring-2 focus:ring-[#2E9DF7]/30 transition-all shadow-inner"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCartOpen(true)}
          className="hidden md:flex ml-auto relative rounded-xl bg-[#2E9DF7] text-white px-5 py-2.5 font-bold shadow-lg shadow-blue-400/40 hover:bg-[#1B2A6B] hover:shadow-blue-900/30 transition-all items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Keranjang
          {cartCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
            >
              {cartCount}
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Kategori Horizontal Scroll (HANYA MOBILE) */}
      <div className="md:hidden shrink-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 px-4 flex overflow-x-auto gap-2 no-scrollbar">
        {kategoriList.map((kategori) => (
          <button
            key={kategori.id}
            onClick={() => setActiveKategoriId(kategori.id)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              kategori.id === activeKategoriId
                ? "bg-[#1B2A6B] text-white shadow-md shadow-blue-900/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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

        {/* 3. KONTEN PRODUK UTAMA (Scrollable Area) */}
        <main className="flex-1 p-4 md:p-8 min-w-0 overflow-y-auto pb-32 md:pb-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#1B2A6B]">
                {kategoriList.find((k) => k.id === activeKategoriId)?.nama ?? "Semua Produk"}
              </h1>
              <p className="text-sm md:text-base text-gray-500 mt-1">{produkTerfilter.length} produk siap cetak</p>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A6B]"></div>
            </div>
          ) : produkTerfilter.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg text-gray-400 font-medium">Ups, produk tidak ditemukan.</p>
            </div>
          ) : (
            <motion.div 
              key={activeKategoriId}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {produkTerfilter.map((produk) => (
                  <ShoppingProductCard
                    key={produk.id}
                    produk={produk}
                    qty={getQty(produk.id)}
                    onQtyChange={(qty) => setQty(produk.id, qty)}
                    onAddToCart={() => handleAddToCart(produk)}
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
        {cartCount > 0 && (
          <motion.button
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCartOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-40 bg-[#2E9DF7] text-white p-4 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center border-2 border-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -left-1 bg-red-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Komponen Laci Keranjang */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        cartTotal={cartTotal}
        onUpdateQty={handleUpdateCartQty}
        onRemove={handleRemoveFromCart}
      />

      {/* Komponen Modal Produk Ala Discord */}
      <ProductModal
        produk={selectedProduk}
        isOpen={selectedProduk !== null}
        onClose={() => setSelectedProduk(null)}
        qty={selectedProduk ? getQty(selectedProduk.id) : 1}
        onQtyChange={(qty) => {
          if (selectedProduk) setQty(selectedProduk.id, qty);
        }}
        onAddToCart={() => {
          if (selectedProduk) handleAddToCart(selectedProduk);
        }}
      />
      
    </div>
  );
}
