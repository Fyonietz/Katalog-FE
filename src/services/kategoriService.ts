// services/kategoriService.ts
import api from "./authService";
import type { Kategori } from "../models/Produk";

// Dummy sementara — nanti tinggal diganti pemanggilan nyata di bawah.
// const DUMMY_KATEGORI: Kategori[] = [
//   { id: "adv", nama: "Advertising & Reklame" },
//   { id: "cetak", nama: "Percetakan" },
//   { id: "pack", nama: "Packaging" },
//   { id: "merch", nama: "Merchandise" },
// ];

export async function getKategoriList(): Promise<Kategori[]> {
  // Endpoint asli di backend teman kamu, contoh: GET /kategori
  const { data } = await api.get<Kategori[]>("/api/v1/kategory-product");
  return data;

  // await new Promise((resolve) => setTimeout(resolve, 200));
  // return DUMMY_KATEGORI;
}

// CREATE CATEGORY
export async function createKategori(nama: string): Promise<Kategori> {
  const { data } = await api.post<Kategori>("/api/v1/kategory-product", { nama });
  return data;
}

// UPDATE CATEGORY
export async function updateKategori(id: number, nama: string): Promise<Kategori> {
  const { data } = await api.patch<Kategori>(`/api/v1/kategory-product/${id}`, { nama });
  return data;
}

// DELETE CATEGORY
export async function deleteKategori(id: number): Promise<void> {
  await api.delete(`/api/v1/kategory-product/${id}`);
}
