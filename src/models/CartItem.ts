// src/models/CartItem.ts
import type { Produk, UkuranProduk } from "./Produk";

export interface CartItem {
  produk: Produk;
  qty: number;
  idUkuranProduk?: number;
  /** Snapshot varian terpilih — hanya dipakai untuk estimasi harga di UI. */
  ukuran?: UkuranProduk | null;
  ukuranCustom?: string;
  /** Dimensi untuk mode PerArea/PerLength, dalam satuan `produk.dimensionUnit`. */
  width?: number;
  height?: number;
  length?: number;
  notes?: string;
  desainText?: string;
  desainFile?: File | null;
}

export interface AddToCartOptions {
  idUkuranProduk?: number;
  ukuran?: UkuranProduk | null;
  ukuranCustom?: string;
  width?: number;
  height?: number;
  length?: number;
  notes?: string;
  desainText?: string;
  desainFile?: File | null;
}
