 // src/services/reportService.ts
import { getAuthToken } from "./authService";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";

export interface SalesReportSummary {
  totalOrders: number;
  paidOrders: number;
  totalRevenue: number;
}

export interface SalesReportRow {
  period: string;
  totalOrders: number;
  paidOrders: number;
  revenue: number;
}

export interface SalesReportResponse {
  startDate: string;
  endDate: string;
  period: string;
  summary: SalesReportSummary;
  rows: SalesReportRow[];
}

export async function getSalesReport(startDate?: string, endDate?: string, period: string = "day"): Promise<SalesReportResponse> {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  params.append("period", period);

  const res = await fetch(`${API_URL}/api/v1/reports/sales?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal memuat laporan penjualan");
  }

  return res.json();
}
