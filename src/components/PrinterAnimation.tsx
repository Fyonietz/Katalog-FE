// components/PrinterAnimation.tsx
import { motion } from "framer-motion";

export default function PrinterAnimation() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <svg viewBox="0 0 320 220" className="w-full h-auto overflow-visible">
        {/* Body printer */}
        <rect x="60" y="90" width="200" height="70" rx="10" fill="#2E9DF7" opacity="0.9" />
        <rect x="60" y="90" width="200" height="14" rx="7" fill="#8FC2FA" />

        {/* Slot output */}
        <rect x="80" y="86" width="160" height="8" rx="4" fill="#0F1B4D" />

        {/* Kertas keluar - looping animasi naik lalu reset */}
        <motion.rect
          x="95"
          width="130"
          height="90"
          rx="2"
          fill="white"
          stroke="#D6DEEC"
          initial={{ y: 90 }}
          animate={{ y: [90, 10, 10, 90] }}
          transition={{
            duration: 3.2,
            times: [0, 0.4, 0.85, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Garis teks tercetak, muncul bertahap seiring kertas naik */}
        {[24, 40, 56, 72].map((y, i) => (
          <motion.rect
            key={y}
            x="108"
            y={y}
            height="4"
            rx="2"
            fill="#1B2A6B"
            initial={{ width: 0 }}
            animate={{ width: [0, 0, 104, 104, 0] }}
            transition={{
              duration: 3.2,
              times: [0, 0.35 + i * 0.05, 0.5 + i * 0.05, 0.85, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Lampu indikator berkedip */}
        <motion.circle
          cx="248"
          cy="108"
          r="4"
          fill="#7CF29C"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />

        {/* Kaki printer */}
        <rect x="70" y="160" width="180" height="10" rx="4" fill="#15205A" />
      </svg>
    </div>
  );
}
