import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage"
import ShoppingPage from "./pages/ShoppingPage"
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/shopping" element={<ShoppingPage />} />

    </Routes>
  );
}

export default App;
