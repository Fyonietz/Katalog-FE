// components/Navbar.tsx
import { motion } from "framer-motion";
import { useScrollSpy } from "../hooks/useScrollSpy";

const LINKS = [
  { id: "beranda", label: "Beranda" },
  { id: "tentang", label: "Tentang" },
  { id: "produk", label: "Produk" },
  { id: "kontak", label: "Kontak" },
];

export default function Navbar() {
  const activeId = useScrollSpy(LINKS.map((l) => l.id));

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between"
    >
      <span className="font-bold text-[#1B2A6B] text-lg">Nusantara Mandiri Printing</span>

      <div className="hidden md:flex items-center gap-8">
        {LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            className="relative text-sm font-medium py-1"
          >
            <span className={activeId === link.id ? "text-[#1B2A6B]" : "text-gray-500"}>
              {link.label}
            </span>
            {activeId === link.id && (
              <motion.div
                layoutId="navActive"
                className="absolute left-0 right-0 -bottom-1 h-0.5 bg-[#2E9DF7] rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <a
        href="/login"
        className="rounded-full bg-[#1B2A6B] px-5 py-2 text-sm font-semibold text-white
                   hover:bg-[#15205A] transition-colors"
      >
        Masuk
      </a>
    </motion.nav>
  );
}
