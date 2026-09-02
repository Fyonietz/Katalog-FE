// src/components/UserProfileCard.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMe } from "../services/authService";
import type { UserProfile } from "../models/AuthModel";

interface UserProfileCardProps {
  onClose?: () => void;
}

export default function UserProfileCard({ onClose }: UserProfileCardProps) {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchMe() {
      try {
        setLoading(true);
        const data = await getMe();
        setUserData(data);
      } catch (err: any) {
        console.error("Gagal memuat profil /me:", err);
        setError(true);
        
        // Jika token tidak valid / expired (401), paksa re-login
        if (err.response?.status === 401) {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  // Handler Logout: Hapus semua token & kembalikan ke /login
  const handleLogout = () => {
    if (onClose) onClose();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const handlePesananClick = () => {
    if (onClose) onClose();
    window.location.href = "/dashboard/pelanggan/pesanan";
  };

  const handleSettingsClick = () => {
    if (onClose) onClose();
    window.location.href = "/dashboard/pelanggan/settings";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="absolute bottom-[75px] left-3 w-[290px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden z-50 flex flex-col"
    >
      {/* Banner Header */}
      <div className="h-20 bg-gradient-to-r from-[#1B2A6B] to-[#2E9DF7] w-full relative">
        <div className="absolute -bottom-7 left-4 p-1.5 bg-white rounded-full">
          <div className="relative flex items-center justify-center w-16 h-16 bg-gray-100 text-gray-400 rounded-full shadow-inner">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full" />
          </div>
        </div>
      </div>

      <div className="h-9 w-full" />

      {/* Profil Details */}
      <div className="px-5 pb-3">
        {loading ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-200 rounded w-3/4" />
          </div>
        ) : error ? (
          <p className="text-xs text-red-500 font-medium">Gagal memuat profil user</p>
        ) : (
          <>
            <h3 className="text-xl font-black text-[#1B2A6B] leading-none">
              {userData?.nama ?? "Pengguna"}
            </h3>
            <p className="text-sm font-medium text-gray-500 mt-1 truncate">
              {userData?.email ?? "email@domain.com"}
            </p>
          </>
        )}
      </div>

      <div className="h-px bg-gray-100 w-full" />

      {/* Menu Aksi */}
      <div className="p-2 flex flex-col gap-1">
        <button
          onClick={handlePesananClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors group text-left w-full"
        >
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-[#1B2A6B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span className="text-sm font-bold text-gray-600 group-hover:text-[#1B2A6B]">
            Pesanan Saya
          </span>
        </button>

        <button
          onClick={handleSettingsClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 transition-colors group text-left w-full"
        >
          <svg
            className="w-5 h-5 text-gray-400 group-hover:text-[#1B2A6B]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94 summit 826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm font-bold text-gray-600 group-hover:text-[#1B2A6B]">
            Pengaturan
          </span>
        </button>

        <div className="h-px bg-gray-100 my-1 mx-2" />

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors group text-left w-full"
        >
          <svg
            className="w-5 h-5 text-red-400 group-hover:text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-sm font-bold text-red-500 group-hover:text-red-600">
            Logout
          </span>
        </button>
      </div>
    </motion.div>
  );
}
