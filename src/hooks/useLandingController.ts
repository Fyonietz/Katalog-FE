// hooks/useLandingController.ts
import { useState, useEffect, useMemo } from "react";
import type { Produk } from "../models/Produk";
import { getProdukList } from "../services/produkService";
import { getKategoriList } from "../services/kategoriService";
import { getLayananList, type Layanan } from "../services/layananService";

export interface LandingStats {
  totalProduk: number;
  totalKategori: number;
  totalLayanan: number;
}

export function useLandingController() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategoriTotal, setKategoriTotal] = useState<number>(0);
  const [layananList, setLayananList] = useState<Layanan[]>([]);
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

  // Jumlah lini bisnis langsung dari master data kategori (endpoint publik).
  useEffect(() => {
    let active = true;
    getKategoriList()
      .then((list) => {
        if (active) setKategoriTotal(list?.length ?? 0);
      })
      .catch((err) => {
        console.error("Gagal fetch kategori:", err);
      });
    return () => {
      active = false;
    };
  }, []);

  // Layanan katalog butuh Bearer token; tamu (401) cukup disembunyikan.
  useEffect(() => {
    let active = true;
    getLayananList()
      .then((data) => {
        if (active) setLayananList(data ?? []);
      })
      .catch(() => {
        if (active) setLayananList([]);
      });
    return () => {
      active = false;
    };
  }, []);

  // Generate daftar kategori secara dinamis dari data API asli
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

  const stats: LandingStats = useMemo(
    () => ({
      totalProduk: produkList.length,
      // fallback ke kategori yang terlihat di katalog bila request gagal
      totalKategori: kategoriTotal || Math.max(kategoriList.length - 1, 0),
      totalLayanan: layananList.length,
    }),
    [produkList.length, kategoriTotal, kategoriList.length, layananList.length]
  );

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
    stats,
    layananList,
  };
}
