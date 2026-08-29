import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage"
import ShoppingPage from "./pages/ShoppingPage"

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardAdminPage from "./pages/Admin/DashboardMain";
function App(){
   return(

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
</Routes>
   )
}
 
export default App;
