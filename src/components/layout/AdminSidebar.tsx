// src/components/layout/AdminSidebar.tsx
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X, LayoutDashboard, Package, Tags, Wrench, ShoppingCart, FileText, LogOut } from "lucide-react";

interface AdminSidebarProps {
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export default function AdminSidebar({ isOpenMobile, setIsOpenMobile }: AdminSidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard/admin", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { path: "/dashboard/admin/pesanan", label: "Manajemen Pesanan", icon: <ShoppingCart className="w-5 h-5" /> },
    { path: "/dashboard/admin/produk/daftar", label: "Katalog Produk", icon: <Package className="w-5 h-5" /> },
    { path: "/dashboard/admin/produk/kategori", label: "Kategori Produk", icon: <Tags className="w-5 h-5" /> },
    { path: "/dashboard/admin/layanan", label: "Layanan Cetak", icon: <Wrench className="w-5 h-5" /> },
    { path: "/dashboard/admin/report", label: "Laporan Penjualan", icon: <FileText className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-xl bg-[#2E9DF7] flex items-center justify-center font-extrabold text-white">
          A
        </div>
        <div>
          <h2 className="font-extrabold text-sm leading-tight text-white">Nusantara Admin</h2>
          <p className="text-[10px] text-blue-200">Panel Manajemen</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 no-scrollbar">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            onClick={() => setIsOpenMobile(false)}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#2E9DF7] text-white shadow-lg shadow-[#2E9DF7]/30"
                  : "text-blue-100/70 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 w-full"
      >
        <LogOut className="w-5 h-5" />
        Logout System
      </button>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1B2A6B] text-white p-6 shrink-0 h-full shadow-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpenMobile(false)} />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="fixed top-0 left-0 bottom-0 w-64 bg-[#1B2A6B] text-white p-6 shadow-2xl flex flex-col z-50"
          >
            <div className="absolute top-4 right-4">
              <button onClick={() => setIsOpenMobile(false)} className="p-1 text-white/70 hover:text-white bg-white/10 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent />
          </motion.aside>
        </div>
      )}
    </>
  );
}
