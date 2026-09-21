// src/services/alamatService.ts
import api from "./authService";

export interface AlamatGetResponse {
  id: number;
  idUser: number;
  namaUser: string;
  noTelepon: string;
  content: string;
}

// UPDATE: Hapus IdUser sesuai dokumen alamat.md terbaru
export interface AlamatPostPayload {
  noTelepon: string;
  content: string;
}

export async function getAlamatUser(): Promise<AlamatGetResponse[]> {
  const { data } = await api.get<AlamatGetResponse[]>("/api/v1/alamat");
  return data;
}

export async function createAlamat(payload: AlamatPostPayload): Promise<any> {
  const { data } = await api.post("/api/v1/alamat", payload);
  return data;
}

export async function updateAlamat(id: number, payload: Partial<AlamatPostPayload>): Promise<any> {
  const { data } = await api.patch(`/api/v1/alamat/${id}`, payload);
  return data;
}

export async function deleteAlamat(id: number): Promise<void> {
  await api.delete(`/api/v1/alamat/${id}`);
}

export async function getAddressFromLatLng(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    return data.display_name || `${lat}, ${lng}`;
  } catch (err) {
    return `${lat}, ${lng}`;
  }
}
