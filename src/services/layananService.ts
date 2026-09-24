// services/layananService.ts
import api from "./authService";

export interface Layanan {
  id: number;
  nama: string;
  deskripsi: string;
  imagePath: string | null;
  backgroundColor: string | null;
}

/**
 * GET /api/v1/layanan — katalog layanan percetakan.
 * Endpoint ini butuh Bearer token, jadi tamu (belum login) akan mendapat 401.
 * Pemanggil sebaiknya menangani kegagalan dengan menyembunyikan sectionnya.
 */
export async function getLayananList(): Promise<Layanan[]> {
  const { data } = await api.get<Layanan[]>("/api/v1/layanan");
  return data ?? [];
}

// POST /api/v1/layanan — multipart/form-data (field: Nama, Deskripsi, BackgroundColor, Image)
export async function createLayanan(formData: FormData): Promise<Layanan> {
  const { data } = await api.post<Layanan>("/api/v1/layanan", formData);
  return data;
}

// PATCH /api/v1/layanan/{id} — multipart/form-data (field sama seperti POST)
export async function updateLayanan(id: number, formData: FormData): Promise<Layanan> {
  const { data } = await api.patch<Layanan>(`/api/v1/layanan/${id}`, formData);
  return data;
}

// DELETE /api/v1/layanan/{id}
export async function deleteLayanan(id: number): Promise<void> {
  await api.delete(`/api/v1/layanan/${id}`);
}
