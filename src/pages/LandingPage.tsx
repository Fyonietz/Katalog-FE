// pages/LandingPage.tsx
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers } from "lucide-react";
import { useLandingController } from "../hooks/useLandingController";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import AnimatedCounter from "../components/AnimatedCounter";
import PrinterAnimation from "../components/PrinterAnimation";
import ProductModal from "../components/ProductModal";
import { getImageUrl } from "../utils/getImageUrl";
import type { Produk } from "../models/Produk";

export default function LandingPage() {
  const {
    kategoriList,
    activeKategoriId,
    setActiveKategoriId,
    produkTerfilter,
    loading,
    handleBeli,
    stats,
    layananList,
  } = useLandingController();

  // Section "Layanan" hanya muncul kalau katalog layanan berhasil dimuat.
  const navLinks = useMemo(() => {
    const links = [
      { id: "beranda", label: "Beranda" },
      { id: "tentang", label: "Tentang" },
    ];
    if (layananList.length > 0) links.push({ id: "layanan", label: "Layanan" });
    links.push({ id: "produk", label: "Produk" });
    links.push({ id: "kontak", label: "Kontak" });
    return links;
  }, [layananList.length]);

  // State untuk modal detail produk
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [modalQty, setModalQty] = useState(1);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const handleCardClick = (produk: Produk) => {
    setSelectedProduk(produk);
    setModalQty(1);
  };

  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      <Navbar links={navLinks} />

      {/* ===== HERO ===== */}
      <section
        id="beranda"
        className="relative flex items-center bg-[#1B2A6B] text-white overflow-hidden px-6 min-h-screen"
      >
        <motion.div
          animate={{ rotate: [45, 55, 45], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-[#2E9DF7] opacity-20 rounded-[3rem]"
        />
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-10 w-24 h-24 border-2 border-[#8FC2FA]/30 rounded-2xl rotate-12"
        />

        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center w-full">
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm tracking-widest text-[#8FC2FA] font-semibold uppercase"
            >
              PRINTING EXPERT NOMOR 1 DI PEKANBARU
            </motion.p>

            <motion.h1
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.1, delay: 0.2, ease: "easeInOut" }}
              className="mt-4 text-4xl md:text-5xl font-bold leading-tight"
            >
              Lengkapi Segala Kebutuhan Percetakan dan Digital Printing
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="mt-4 text-[#AEB9E0] text-lg"
            >
              Solusi cetak tanpa antri. Pesan langsung dari katalog online kami.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => scrollTo("produk")} // Sekarang akan scrol tepat ke katalog produk
              className="mt-8 rounded-full bg-[#2E9DF7] px-8 py-3 font-semibold text-white shadow-lg shadow-[#2E9DF7]/30"
            >
              Lihat Katalog
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PrinterAnimation />
          </motion.div>
        </div>
      </section>

      {/* ===== TENTANG (DIUBAH ID MENJADI "tentang") ===== */}
      <section id="tentang" className="min-h-screen flex flex-col justify-center px-6 py-24 max-w-7xl mx-auto w-full">
        <div className="flex flex-col w-full md:px-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-[#1B2A6B] text-center"
          >
            Tentang Kami
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-gray-600 leading-relaxed text-center max-w-2xl mx-auto"
          >
            Nusantara Mandiri Printing adalah vendor percetakan, digital printing, dan advertising
            yang berpusat di Pekanbaru. Didukung mesin produksi modern dan tim berpengalaman, kami
            menghadirkan kualitas, kecepatan produksi, dan ketepatan deadline sebagai nilai utama
            dalam setiap project.
          </motion.p>

          {/* Angka di bawah ini diambil dari API katalog, bukan hardcode. */}
          <div className="mt-14 flex flex-wrap justify-center gap-x-16 gap-y-10">
            <AnimatedCounter value={stats.totalProduk} label="Produk Siap Cetak" loading={loading} />
            <AnimatedCounter value={stats.totalKategori} label="Lini Bisnis" loading={loading} />
            {stats.totalLayanan > 0 && (
              <AnimatedCounter value={stats.totalLayanan} label="Layanan Katalog" />
            )}
            <AnimatedCounter value={24} suffix="/7" label="Layanan Produksi" />
          </div>
        </div>
      </section>

      {/* ===== LAYANAN (GET /api/v1/layanan) ===== */}
      {layananList.length > 0 && (
        <section id="layanan" className="px-6 py-24 max-w-7xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#1B2A6B]"
          >
            Layanan Kami
          </motion.h2>
          <p className="mt-1 text-sm text-gray-500">
            Layanan percetakan yang tersedia di Nusantara Mandiri Printing.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {layananList.map((layanan) => (
              <motion.article
                key={layanan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <div
                  className="aspect-[16/9] overflow-hidden bg-[#EAF2FE]"
                  style={layanan.backgroundColor ? { backgroundColor: layanan.backgroundColor } : undefined}
                >
                  {layanan.imagePath ? (
                    <img
                      src={getImageUrl(layanan.imagePath)}
                      alt={layanan.nama}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Layers className="h-8 w-8 text-[#2E9DF7]/60" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#1B2A6B]">{layanan.nama}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{layanan.deskripsi}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      )}

      {/* ===== PRODUK ===== */}
      <section id="produk" className="px-6 py-24 max-w-7xl mx-auto w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-[#1B2A6B]"
        >
          Katalog Produk
        </motion.h2>
        <p className="mt-1 text-sm text-gray-500">
          Pilih kategori, lalu klik Beli — kamu akan diminta masuk terlebih dahulu.
        </p>

<div className="mt-6 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
  {kategoriList.map((kategori, index) => {
    // Pastikan key tidak undefined
    const categoryKey = kategori.id ?? `kat-${index}`;
    return (
      <button
        key={categoryKey}
        onClick={() => setActiveKategoriId(kategori.id)}
        className="relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
      >
        <span className={activeKategoriId === kategori.id ? "text-[#1B2A6B] font-bold" : "text-gray-500"}>
          {kategori.nama}
        </span>
        {activeKategoriId === kategori.id && (
          <motion.div
            layoutId="activeTab"
            className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#2E9DF7] rounded-full"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </button>
    );
  })}
</div>

        <div className="mt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A6B]"></div>
            </div>
          ) : (
            <motion.div 
              layout 
              className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5"
            >
<AnimatePresence mode="popLayout">
  {produkTerfilter.map((produk, index) => {
    // Pastikan key tidak undefined
    const itemKey = produk.id ?? `prod-${index}`;
    return (
      <div 
        key={itemKey} 
        onClick={() => handleCardClick(produk)} 
        className="cursor-pointer"
      >
        <ProductCard produk={produk} onBeli={() => handleBeli(produk)} />
      </div>
    );
  })}
</AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== KONTAK ===== */}
      <section id="kontak" className="min-h-screen flex items-center bg-[#1B2A6B] text-white px-6">
        <div className="max-w-3xl mx-auto text-center w-full">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold"
          >
            Siap Mulai Project Cetakmu?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-[#AEB9E0]"
          >
            Jl. Tuanku Tambusi No. 423, Pekanbaru
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="tel:081270769260"
              className="rounded-full bg-[#2E9DF7] px-8 py-3 font-semibold hover:bg-[#268bdc] transition-colors"
            >
              Hubungi via Telepon
            </a>
            <a
              href="/login"
              className="rounded-full border border-white/30 px-8 py-3 font-semibold hover:bg-white/10 transition-colors"
            >
              Masuk ke Akun
            </a>
          </motion.div>
        </div>
      </section>

      {/* Modal Produk Ala Discord */}
      <ProductModal
        produk={selectedProduk}
        isOpen={selectedProduk !== null}
        onClose={() => setSelectedProduk(null)}
        qty={modalQty}
        onQtyChange={setModalQty}
        onAddToCart={() => {
          if (selectedProduk) handleBeli(selectedProduk);
        }}
      />
    </div>
  );
}
