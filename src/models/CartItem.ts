// models/CartItem.ts
import type { Produk } from "./Produk";

export interface CartItem {
  produk: Produk;
  qty: number;
}
