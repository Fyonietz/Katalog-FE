// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import ShoppingPage from "./pages/ShoppingPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import AdminLayout from "./pages/Admin/AdminLayout";
import DashboardAdminPage from "./pages/Admin/DashboardMain";
import ProdukAdmin from "./pages/Admin/ProdukAdminPage";
import PesananAdminPage from "./pages/Admin/PesananAdminPage";
import LaporanAdminPage from "./pages/Admin/LaporanAdminPage";
import KategoriProdukAdmin from "./pages/Admin/KategoriProdukAdminPage";
import LayananAdminPage from "./pages/Admin/LayananAdminPage";

// Pelanggan
import CustomerLayout from "./pages/Pelanggan/CustomerLayout";
import KeranjangPage from "./pages/Pelanggan/KeranjangPage";
import PesananPage from "./pages/Pelanggan/PesananPage";
import RiwayatPage from "./pages/Pelanggan/RiwayatPage";
import SettingsPage from "./pages/Pelanggan/SettingsPage";
import CheckOutPage from "./pages/Pelanggan/CheckOutPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/shopping" element={<ShoppingPage />} />
      <Route path="/shopping/checkout" element={<CheckOutPage />} />
      
      {/* --- ADMIN ROUTES (Nested Routing) --- */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Petugas"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardAdminPage />} />
        <Route path="produk/daftar" element={<ProdukAdmin />} />
        <Route path="produk/kategori" element={<KategoriProdukAdmin />} />
        <Route path="layanan" element={<LayananAdminPage />} />
        <Route path="pesanan" element={<PesananAdminPage />} />
        <Route path="report" element={<LaporanAdminPage />} />
      </Route>

      {/* --- PELANGGAN ROUTES --- */}
      <Route path="/dashboard/pelanggan" element={<CustomerLayout />}>
        <Route index element={<Navigate to="keranjang" replace />} />
        <Route path="keranjang" element={<KeranjangPage />} />
        <Route path="pesanan" element={<PesananPage />} />
        <Route path="riwayat" element={<RiwayatPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
