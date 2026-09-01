 // src/services/statusService.ts
import api from "./authService";

export interface StatusProduct {
  id: number;
  nama: string;
}

export async function getStatusList(): Promise<StatusProduct[]> {
  const { data } = await api.get<StatusProduct[]>("/api/v1/status-product");
  return data;
}
