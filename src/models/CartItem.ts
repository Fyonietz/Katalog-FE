// src/models/CartItem.ts
import type { Produk } from "./Produk";

export interface CartItem {
  produk: Produk;
  qty: number;
  idUkuranProduk?: number;
  ukuranCustom?: string;
  notes?: string;
  desainText?: string;
  desainFile?: File | null;
}
