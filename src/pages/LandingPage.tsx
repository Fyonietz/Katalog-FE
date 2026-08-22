// pages/LandingPage.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useLandingController } from "../hooks/useLandingController";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import AnimatedCounter from "../components/AnimatedCounter";
import PrinterAnimation from "../components/PrinterAnimation";

export default function LandingPage() {
  const {
    kategoriList,
    activeKategoriId,
    setActiveKategoriId,
    produkTerfilter,
    loading,
    handleBeli,
  } = useLandingController();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
  <div className="min-h-screen bg-[#F4F6FB]">
      <Navbar />

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
              className="text-sm tracking-widest text-[#8FC2FA] font-semibold"
            >
              PRINTING EXPERT NOMOR 1 DI PEKANBARU
            </motion.p>

            {/* Judul dengan efek "tersapu" ala print head */}
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
              onClick={() => scrollTo("produk")}
              className="mt-8 rounded-full bg-[#2E9DF7] px-8 py-3 font-semibold text-white shadow-lg shadow-[#2E9DF7]/30"
            >
              Lihat Katalog
            </motion.button>
          </div>

          {/* Ilustrasi printer mencetak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <PrinterAnimation />
          </motion.div>
        </div>
      </section>

      {/* ===== TENTANG ===== */}
<section id="produk" className="min-h-screen flex flex-col justify-center px-6 py-24 max-w-7xl mx-auto w-full">
      <div className="flex w-full md:px-2">
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

          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
            <AnimatedCounter value={24} suffix="/7" label="Layanan Produksi" />
            <AnimatedCounter value={500} suffix="+" label="Project Selesai" />
            <AnimatedCounter value={4} label="Lini Bisnis" />
            <AnimatedCounter value={1} label="Nomor di Pekanbaru" />
          </div>
        </div>
      </section>

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

        <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
          {kategoriList.map((kategori) => (
            <button
              key={kategori.id}
              onClick={() => setActiveKategoriId(kategori.id)}
              className="relative px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors"
            >
              <span className={activeKategoriId === kategori.id ? "text-[#1B2A6B]" : "text-gray-500"}>
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
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-sm text-gray-400">Memuat produk...</p>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              <AnimatePresence mode="popLayout">
                {produkTerfilter.map((produk) => (
                  <ProductCard key={produk.id} produk={produk} onBeli={handleBeli} />
                ))}
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
    </div>
  );
}
