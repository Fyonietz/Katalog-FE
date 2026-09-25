// src/services/pesananService.ts
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";

export interface PesananDetail {
  id: number;
  idPesanan?: number;
  idProduct: number;
  namaProduct: string;
  idUkuranProduk?: number | null;
  namaUkuran?: string | null;
  ukuranCustom?: string | null;
  qty: number;
  /** Rate snapshot dari server: per unit / per m² / per meter. */
  hargaSatuan: number;
  pricingMode?: string | null;
  widthMeters?: number | null;
  heightMeters?: number | null;
  lengthMeters?: number | null;
  dimensionUnit?: string | null;
  areaM2?: number | null;
  /** Subtotal snapshot baris; null untuk pesanan lama sebelum migrasi. */
  subtotal?: number | null;
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

// GET: Ambil daftar pesanan milik user
export async function getPesananUser(): Promise<PesananResponse[]> {
  const res = await fetch(`${API_URL}/api/v1/pesanan`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  if (!res.ok) throw new Error("Gagal mengambil data pesanan");
  return res.json();
}

// POST: Buat pesanan baru (multipart/form-data)
export async function createPesanan(formData: FormData): Promise<PesananResponse> {
  const res = await fetch(`${API_URL}/api/v1/pesanan`, {
    method: "POST",
    headers: {
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

// PUT: Update pesanan (HANYA jika belum ada transaksi Midtrans - status unpaid)
export async function updatePesanan(idPesanan: number, formData: FormData): Promise<PesananResponse> {
  const res = await fetch(`${API_URL}/api/v1/pesanan/${idPesanan}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: formData,
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengupdate pesanan");
  }
  return res.json();
}

// DELETE: Hapus pesanan (HANYA jika belum ada transaksi Midtrans - status unpaid)
export async function deletePesanan(idPesanan: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/pesanan/${idPesanan}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal membatalkan pesanan");
  }
}

 // Tambahkan di bagian bawah src/services/pesananService.ts

// GET: Ambil SEMUA pesanan (Khusus Admin/Petugas)
export async function getAllPesanan(): Promise<PesananResponse[]> {
  const res = await fetch(`${API_URL}/api/v1/pesanan/all`, {
    headers: { Authorization: `Bearer ${getAuthToken()}` },
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengambil semua data pesanan");
  }
  return res.json();
}

 export async function updateStatusPengerjaan(idPesanan: number, idStatusPengerjaan: number): Promise<PesananResponse> {
  const res = await fetch(`${API_URL}/api/v1/pesanan/${idPesanan}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify({ idStatusPengerjaan }),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengubah status pengerjaan");
  }
  return res.json();
}
