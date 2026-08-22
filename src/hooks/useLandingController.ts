// hooks/useLandingController.ts
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Kategori, Produk } from "../models/Produk";
import { getProdukList } from "../services/produkService";
import { getKategoriList } from "../services/kategoriService";

export function useLandingController() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [activeKategoriId, setActiveKategoriId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getKategoriList(), getProdukList()])
      .then(([kategori, produk]) => {
        setKategoriList(kategori);
        setProdukList(produk);
        if (kategori.length > 0) setActiveKategoriId(kategori[0].id); // default: kategori pertama dari backend
      })
      .finally(() => setLoading(false));
  }, []);

  const produkTerfilter = useMemo(
    () => produkList.filter((p) => p.kategoriId === activeKategoriId),
    [produkList, activeKategoriId]
  );

  function isLoggedIn(): boolean {
    return Boolean(localStorage.getItem("accessToken"));
  }

  function handleBeli(produk: Produk) {
    if (!isLoggedIn()) {
      navigate("/login", { state: { redirectTo: "/shopping" } });
      return;
    }
    navigate("/shopping");
  }

  return {
    kategoriList,
    activeKategoriId,
    setActiveKategoriId,
    produkTerfilter,
    loading,
    handleBeli,
  };
}
