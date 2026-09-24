import { Routes, Route,Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import ShoppingPage from "./pages/ShoppingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardAdminPage from "./pages/Admin/DashboardMain";
import ProdukAdmin from "./pages/Admin/ProdukAdminPage";
import PesananAdminPage from "./pages/Admin/PesananAdminPage";
import LaporanAdminPage from "./pages/Admin/LaporanAdminPage";
import KategoriProdukAdmin from "./pages/Admin/KategoriProdukAdminPage";
import LayananAdminPage from "./pages/Admin/LayananAdminPage";
import CustomerLayout from "./pages/Pelanggan/CustomerLayout";
import KeranjangPage from "./pages/Pelanggan/KeranjangPage";
import PesananPage from "./pages/Pelanggan/PesananPage";
import RiwayatPage from "./pages/Pelanggan/RiwayatPage";
import SettingsPage from "./pages/Pelanggan/SettingsPage"
import CheckOutPage from "./pages/Pelanggan/CheckOutPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/shopping" element={<ShoppingPage />} />
      
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DashboardAdminPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/produk/daftar"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ProdukAdmin />
          </ProtectedRoute>
        }
      />

      <Route
      path="/dashboard/admin/produk/kategori"
      element={
        <ProtectedRoute allowedRoles={["Admin"]}>
        <KategoriProdukAdmin />
        </ProtectedRoute>
      }
      />

      <Route
        path="/dashboard/admin/layanan"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <LayananAdminPage />
          </ProtectedRoute>
        }
      />
 <Route
        path="/dashboard/admin/pesanan"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Petugas"]}>
            <PesananAdminPage />
          </ProtectedRoute>
        }
      />

 <Route
        path="/dashboard/admin/report"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Petugas"]}>
            <LaporanAdminPage />
          </ProtectedRoute>
        }
      />
 //Pelanggan   
<Route path="/dashboard/pelanggan" element={<CustomerLayout />}>
        {/* Redirect default /dashboard/pelanggan ke /dashboard/pelanggan/keranjang */}
        <Route index element={<Navigate to="keranjang" replace />} />
        
        <Route path="keranjang" element={<KeranjangPage />} />
        <Route path="pesanan" element={<PesananPage />} />
        <Route path="riwayat" element={<RiwayatPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="/shopping/checkout" element={<CheckOutPage/>}/>
    </Routes>
  );
}

export default App;
