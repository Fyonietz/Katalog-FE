// src/services/pesananService.ts
import api from "./authService";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";

export interface PesananDetail {
  id: number;
  idProduct: number;
  namaProduct: string;
  qty: number;
  hargaSatuan: number;
  notes?: string;
  desainFilePath?: string;
  desainText?: string;
}

export interface PesananResponse {
  id: number;
  idUser: number;
  namaUser: string;
  idAlamat: number;
  alamat: string;
  idStatusPengerjaan: number;
  statusPengerjaan: string;
  totalHarga: number;
  paymentStatus: string;
  createdAt: string;
  details: PesananDetail[];
}

const getAuthToken = () => localStorage.getItem("token") || "";

// Mengambil daftar pesanan milik user
export async function getPesananUser(): Promise<PesananResponse[]> {
  const res = await fetch(`${API_URL}/api/v1/pesanan`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  if (!res.ok) throw new Error("Gagal mengambil data pesanan");
  return res.json();
}

// Mengirim pesanan baru menggunakan multipart/form-data
export async function createPesanan(formData: FormData): Promise<PesananResponse> {
  const res = await fetch(`${API_URL}/api/v1/pesanan`, {
    method: "POST",
    headers: {
      // JANGAN set Content-Type di sini agar browser membuat boundary multipart otomatis
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal membuat pesanan");
  }
  return res.json();
}
