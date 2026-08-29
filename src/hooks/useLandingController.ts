// hooks/useLandingController.ts
import { useState, useEffect } from "react";
import type { Produk } from "../models/Produk";
import { getProdukList } from "../services/produkService";

export function useLandingController() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeKategoriId, setActiveKategoriId] = useState<string | number>("semua");

  useEffect(() => {
    async function fetchProduk() {
      try {
        setLoading(true);
        const data = await getProdukList();
        setProdukList(data);
      } catch (err) {
        console.error("Gagal fetch produk:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduk();
  }, []);

  // Kategori List (Bisa statis atau dinamis dari API)
  const kategoriList = [
    { id: "semua", nama: "Semua Produk" },
    { id: 2, nama: "Percetakan" }, // Sesuaikan ID dengan ID Kategori dari Backend Anda (misal ID 2)
  ];

  // LOGIKA FILTER YANG AMAN (Konversi ke String agar '2' === 2 bernilai true)
  const produkTerfilter = produkList.filter((item) => {
    if (activeKategoriId === "semua" || !activeKategoriId) return true;
    return item.idKategoriProduct?.toString() === activeKategoriId.toString();
  });

  const handleBeli = (produk: Produk) => {
    console.log("Membeli produk:", produk);
    // Logika redirect ke login atau keranjang
  };

  return {
    kategoriList,
    activeKategoriId,
    setActiveKategoriId,
    produkTerfilter,
    loading,
    handleBeli,
  };
}
