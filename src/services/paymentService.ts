// src/services/paymentService.ts
import api from "./authService";

export interface PaymentResponse {
  idPesanan: number;
  midtransOrderId: string;
  grossAmount: number;
  snapToken: string;
  paymentStatus: string;
}

// POST /api/v1/payment/{idPesanan}
export async function createPaymentSnap(idPesanan: number): Promise<PaymentResponse> {
  const { data } = await api.post<PaymentResponse>(`/api/v1/payment/${idPesanan}`);
  return data;
}

// GET /api/v1/payment/pesanan/{idPesanan}
export async function checkPaymentStatus(idPesanan: number): Promise<PaymentResponse> {
  const { data } = await api.get<PaymentResponse>(`/api/v1/payment/pesanan/${idPesanan}`);
  return data;
}
