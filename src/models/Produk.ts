// models/Produk.ts
export interface Kategori {
  id: number;
  nama: string;
}

export interface StatusProduct {
  id: number;
  nama: string;
}

/**
 * Cara harga sebuah product dihitung. Gunakan nilai ini, jangan menebak
 * perilaku dari `produk.nama` (lihat docs/pricing-system.md §1).
 */
export type PricingMode = "Fixed" | "PerArea" | "PerLength" | "PerUnit" | "Custom";

/** Satuan angka dimensi yang dikirim customer. Satuan internal server = meter. */
export type DimensionUnit = "centimeter" | "meter";

/** Varian product (`Ukuran_Produk`), mis. Standing Banner 60x160 cm. */
export interface UkuranProduk {
  id: number;
  idProduct: number;
  nama: string;
  hargaTambahan: number;
  harga: number | null;
  panjangCm: number | null;
  lebarCm: number | null;
}

export interface Produk {
  id: number;
  idKategoriProduct: number;
  idStatusProduct: number;
  nama: string;
  deskripsi: string;
  imagePath: string; // Path gambar dari API
  harga: number;     // Arti tergantung pricingMode: satuan / per m² / per meter
  diskon: number;
  pricingMode?: PricingMode;
  dimensionUnit?: DimensionUnit;
  backgroundColor: string;
  kategoryProduct: Kategori;
  statusProduct: StatusProduct;
}
