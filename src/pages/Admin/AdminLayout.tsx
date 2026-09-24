 // src/pages/Admin/AdminLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] bg-[#F4F6FB] overflow-hidden">
      
      {/* Sidebar Desktop & Mobile Drawer */}
      <AdminSidebar 
        isOpenMobile={isMobileOpen} 
        setIsOpenMobile={setIsMobileOpen} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header Mobile Khusus untuk Toggle Sidebar (Hanya muncul di HP) */}
        <div className="lg:hidden shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-20 shadow-sm">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-gray-600 hover:text-[#2E9DF7] bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <span className="font-extrabold text-[#1B2A6B] text-lg">Admin Panel</span>
        </div>

        {/* Area Konten Dinamis (Inner Scroll aman disini) */}
        {/* Konten dari halaman-halaman seperti PesananAdminPage akan dirender di sini */}
        <Outlet />
        
      </div>
    </div>
  );
}
