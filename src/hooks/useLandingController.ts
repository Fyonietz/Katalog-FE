// hooks/useLandingController.ts
import { useState, useEffect, useMemo } from "react";
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
        setProdukList(data || []);
      } catch (err) {
        console.error("Gagal fetch produk:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduk();
  }, []);

  // Generate daftar kategori secara dinamis dari data API asli
// Di dalam hooks/useLandingController.ts
const kategoriList = useMemo(() => {
  const list: { id: string | number; nama: string }[] = [
    { id: "semua", nama: "Semua Produk" }
  ];
  
  const mapKategori = new Map<string | number, string>();
  produkList.forEach((item) => {
    const kat = item.kategoryProduct;
    if (kat && kat.id !== undefined && kat.id !== null) {
      mapKategori.set(kat.id, kat.nama ?? "Percetakan");
    }
  });

  mapKategori.forEach((nama, id) => {
    list.push({ id, nama });
  });

  return list;
}, [produkList]);

  // Filter produk dengan akses kategoryProduct.id yang aman
  const produkTerfilter = useMemo(() => {
    return produkList.filter((item) => {
      if (activeKategoriId === "semua" || !activeKategoriId) return true;

      // Ambil ID dari objek kategoryProduct atau idKategoriProduct sebagai fallback
      const katId = item.kategoryProduct?.id ?? (item as any).idKategoriProduct;
      
      return katId?.toString() === activeKategoriId.toString();
    });
  }, [produkList, activeKategoriId]);

  const handleBeli = (produk: Produk) => {
    console.log("Membeli produk:", produk);
    window.location.href = "/login";
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
