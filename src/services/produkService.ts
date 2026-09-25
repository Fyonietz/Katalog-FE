// services/produkService.ts
import type { Produk, PricingMode, DimensionUnit, UkuranProduk } from "../models/Produk";
import api from "../services/authService"
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";
const getAuthToken = () => localStorage.getItem("token") || "";

export async function getProdukList(): Promise<Produk[]> {
  try {
    const { data } = await api.get<Produk[]>("/api/v1/products");
    return data;
  } catch (error) {
    return [];
  }
}

/** Daftar varian (`Ukuran_Produk`) sebuah product. `[]` bila tidak punya varian. */
export async function getUkuranProduk(idProduct: number | string): Promise<UkuranProduk[]> {
  try {
    const { data } = await api.get<UkuranProduk[]>(`/api/v1/products/${idProduct}/ukuran`);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function createProduct(formData: FormData): Promise<Produk> {
  // Hapus manual Content-Type agar browser menambahkan boundary WebKitFormBoundary otomatis
  const { data } = await api.post<Produk>("/api/v1/products", formData);
  return data;
}

/** Body PATCH /api/v1/products/{id} — JSON, bukan multipart. */
export interface UpdateProductPayload {
  idKategoriProduct: number;
  idStatusProduct: number;
  nama: string;
  deskripsi: string;
  harga: number;
  pricingMode?: PricingMode;
  dimensionUnit?: DimensionUnit;
  imagePath?: string;
  backgroundColor?: string;
}

// Tambahkan fungsi Update/Patch Produk
export async function updateProduct(id: number | string, payload: UpdateProductPayload): Promise<Produk> {
  const { data } = await api.patch<Produk>(`/api/v1/products/${id}`, payload);
  return data;
}


export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!res.ok) {
    let errorMessage = "Gagal menghapus produk";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorMessage;
    } catch (err) {
      // Abaikan jika body error tidak berformat JSON
    }
    throw new Error(errorMessage);
  }
}
