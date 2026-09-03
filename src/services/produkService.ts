// services/produkService.ts
import type { Produk } from "../models/Produk";
import api from "../services/authService"

export async function getProdukList(): Promise<Produk[]> {
  try {
    const { data } = await api.get<Produk[]>("/api/v1/products");
    return data;
  } catch (error) {
    return [];
  }
}
export async function createProduct(formData: FormData): Promise<Produk> {
  // Hapus manual Content-Type agar browser menambahkan boundary WebKitFormBoundary otomatis
  const { data } = await api.post<Produk>("/api/v1/products", formData);
  return data;
}

 // Tambahkan fungsi Update/Patch Produk
export async function updateProduct(id: number | string, formData: FormData): Promise<Produk> {
  const { data } = await api.patch<Produk>(`/api/v1/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
