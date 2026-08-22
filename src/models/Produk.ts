// models/Produk.ts

export interface Kategori {
  id: string;
  nama: string;
}

export interface Produk {
  id: string;
  nama: string;
  kategoriId: string; // relasi ke Kategori.id
  hargaMulai: number;
  satuan: string;
  gambar: string;
}
