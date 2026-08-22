// services/kategoriService.ts
import api from "./authService";
import type { Kategori } from "../models/Produk";

// Dummy sementara — nanti tinggal diganti pemanggilan nyata di bawah.
const DUMMY_KATEGORI: Kategori[] = [
  { id: "adv", nama: "Advertising & Reklame" },
  { id: "cetak", nama: "Percetakan" },
  { id: "pack", nama: "Packaging" },
  { id: "merch", nama: "Merchandise" },
];

export async function getKategoriList(): Promise<Kategori[]> {
  // Endpoint asli di backend teman kamu, contoh: GET /kategori
  // const { data } = await api.get<Kategori[]>("/api/v1/kategory-product");
  // return data;

  await new Promise((resolve) => setTimeout(resolve, 200));
  return DUMMY_KATEGORI;
}
