// models/Produk.ts
export interface Kategori {
  id: number;
  nama: string;
}

export interface StatusProduct {
  id: number;
  nama: string;
}

export interface Produk {
  id: number;
  idKategoriProduct: number;
  idStatusProduct: number;
  nama: string;
  deskripsi: string;
  imagePath: string; // Path gambar dari API
  harga: number;     // Menggantikan hargaMulai
  diskon: number;
  backgroundColor: string;
  kategoryProduct: Kategori;
  statusProduct: StatusProduct;
}
