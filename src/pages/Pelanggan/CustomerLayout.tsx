// src/pages/Pelanggan/CustomerLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import CustomerSidebar from "../../components/layout/CustomerSidebar";

export default function CustomerLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col lg:flex-row">
      <CustomerSidebar
        isOpenMobile={isMobileSidebarOpen}
        setIsOpenMobile={setIsMobileSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar Mobile */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-extrabold text-[#1B2A6B] text-sm uppercase">Portal Pelanggan</span>
          <div className="w-8" />
        </div>

        {/* Dynamic Nested Routes Page Rendered Here */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
