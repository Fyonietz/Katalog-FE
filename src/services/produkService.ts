// services/produkService.ts
import type { Produk } from "../models/Produk";

const DUMMY_PRODUK: Produk[] = [
  // ==================== ADVERTISING ====================
  { id: "1", nama: "X-Banner + Kaki", kategoriId: "adv", hargaMulai: 85000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=X-Banner" },
  { id: "2", nama: "Roll Up Banner + Mesin", kategoriId: "adv", hargaMulai: 350000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Roll+Up" },
  { id: "3", nama: "Umbul-umbul Full Print", kategoriId: "adv", hargaMulai: 50000, satuan: "m", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Umbul-umbul" },
  { id: "4", nama: "Neonbox Backlite 1 Set", kategoriId: "adv", hargaMulai: 2500000, satuan: "m", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Neonbox" },
  { id: "5", nama: "Spanduk Flexi Korea", kategoriId: "adv", hargaMulai: 35000, satuan: "m", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Spanduk" },
  { id: "6", nama: "Banner Flexi Outdoor", kategoriId: "adv", hargaMulai: 45000, satuan: "m", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Banner" },
  { id: "7", nama: "Backdrop Event", kategoriId: "adv", hargaMulai: 750000, satuan: "set", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Backdrop" },
  { id: "8", nama: "Billboard Outdoor", kategoriId: "adv", hargaMulai: 3500000, satuan: "m", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Billboard" },
  { id: "9", nama: "Sign Board Acrylic", kategoriId: "adv", hargaMulai: 450000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Sign+Board" },
  { id: "10", nama: "Papan Nama Toko", kategoriId: "adv", hargaMulai: 850000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Papan+Nama" },
  { id: "11", nama: "Neon Flex Custom", kategoriId: "adv", hargaMulai: 1250000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Neon+Flex" },
  { id: "12", nama: "Letter Sign Stainless", kategoriId: "adv", hargaMulai: 650000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Letter+Sign" },
  { id: "13", nama: "Acrylic Box Display", kategoriId: "adv", hargaMulai: 275000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Acrylic+Display" },
  { id: "14", nama: "Poster A2 Full Color", kategoriId: "adv", hargaMulai: 35000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Poster+A2" },
  { id: "15", nama: "Poster A3 Full Color", kategoriId: "adv", hargaMulai: 20000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Poster+A3" },

  // ==================== CETAK ====================
  { id: "16", nama: "Brosur A4 1 Rim 2 Sisi", kategoriId: "cetak", hargaMulai: 1375000, satuan: "rim", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Brosur" },
  { id: "17", nama: "Undangan + Amplop A5", kategoriId: "cetak", hargaMulai: 6500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Undangan" },
  { id: "18", nama: "Kartu Nama 1 Sisi", kategoriId: "cetak", hargaMulai: 45000, satuan: "kotak", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Kartu+Nama" },
  { id: "19", nama: "Kartu Nama 2 Sisi", kategoriId: "cetak", hargaMulai: 65000, satuan: "kotak", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Kartu+Nama+2" },
  { id: "20", nama: "Flyer A5 Full Color", kategoriId: "cetak", hargaMulai: 450000, satuan: "rim", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Flyer" },
  { id: "21", nama: "Flyer A6 Full Color", kategoriId: "cetak", hargaMulai: 350000, satuan: "rim", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Flyer+A6" },
  { id: "22", nama: "Buku Softcover A5", kategoriId: "cetak", hargaMulai: 12500, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Buku+A5" },
  { id: "23", nama: "Buku Hardcover A5", kategoriId: "cetak", hargaMulai: 35000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Hardcover" },
  { id: "24", nama: "Kalender Dinding", kategoriId: "cetak", hargaMulai: 15000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Kalender" },
  { id: "25", nama: "Kalender Meja", kategoriId: "cetak", hargaMulai: 18000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Kalender+Meja" },
  { id: "26", nama: "Nota NCR 2 Ply", kategoriId: "cetak", hargaMulai: 45000, satuan: "buku", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Nota+NCR" },
  { id: "27", nama: "Nota NCR 3 Ply", kategoriId: "cetak", hargaMulai: 65000, satuan: "buku", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Nota+3+Ply" },
  { id: "28", nama: "Stiker Vinyl Cutting", kategoriId: "cetak", hargaMulai: 75000, satuan: "m", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Stiker" },
  { id: "29", nama: "Stiker Label Produk", kategoriId: "cetak", hargaMulai: 25000, satuan: "lembar", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Label" },
  { id: "30", nama: "Print Foto 4R", kategoriId: "cetak", hargaMulai: 5000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Foto+4R" },

  // ==================== PACKAGING ====================
  { id: "31", nama: "Custom Packaging Box", kategoriId: "pack", hargaMulai: 2500000, satuan: "batch", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Packaging" },
  { id: "32", nama: "Paper Bag", kategoriId: "pack", hargaMulai: 25000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Paper+Bag" },
  { id: "33", nama: "Box Makanan Custom", kategoriId: "pack", hargaMulai: 1500, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Food+Box" },
  { id: "34", nama: "Box Pizza Custom", kategoriId: "pack", hargaMulai: 3500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Pizza+Box" },
  { id: "35", nama: "Box Hampers", kategoriId: "pack", hargaMulai: 15000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Hampers" },
  { id: "36", nama: "Sleeve Packaging", kategoriId: "pack", hargaMulai: 2500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Sleeve" },
  { id: "37", nama: "Standing Pouch Custom", kategoriId: "pack", hargaMulai: 3500, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Pouch" },
  { id: "38", nama: "Ziplock Packaging", kategoriId: "pack", hargaMulai: 2500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Ziplock" },
  { id: "39", nama: "Cup Sleeve Custom", kategoriId: "pack", hargaMulai: 1500, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Cup+Sleeve" },
  { id: "40", nama: "Sticker Seal Packaging", kategoriId: "pack", hargaMulai: 15000, satuan: "lembar", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Seal" },

  // ==================== MERCHANDISE ====================
  { id: "41", nama: "Mug", kategoriId: "merch", hargaMulai: 30000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Mug" },
  { id: "42", nama: "Sablon Baju", kategoriId: "merch", hargaMulai: 90000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Sablon+Baju" },
  { id: "43", nama: "Kaos Cotton Combed", kategoriId: "merch", hargaMulai: 75000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Kaos" },
  { id: "44", nama: "Hoodie Custom", kategoriId: "merch", hargaMulai: 175000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Hoodie" },
  { id: "45", nama: "Totebag Kanvas", kategoriId: "merch", hargaMulai: 45000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Totebag" },
  { id: "46", nama: "Tumbler Stainless", kategoriId: "merch", hargaMulai: 85000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Tumbler" },
  { id: "47", nama: "Botol Minum Custom", kategoriId: "merch", hargaMulai: 65000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Botol" },
  { id: "48", nama: "Gantungan Kunci Acrylic", kategoriId: "merch", hargaMulai: 12000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Keychain" },
  { id: "49", nama: "Pin Button Custom", kategoriId: "merch", hargaMulai: 5000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Pin" },
  { id: "50", nama: "Lanyard Custom", kategoriId: "merch", hargaMulai: 15000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Lanyard" },
  { id: "51", nama: "Notebook Custom", kategoriId: "merch", hargaMulai: 35000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Notebook" },
  { id: "52", nama: "Pulpen Custom", kategoriId: "merch", hargaMulai: 7500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Pulpen" },
  { id: "53", nama: "Payung Custom", kategoriId: "merch", hargaMulai: 85000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Payung" },
  { id: "54", nama: "Topi Custom", kategoriId: "merch", hargaMulai: 55000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Topi" },
  { id: "55", nama: "Mousepad Custom", kategoriId: "merch", hargaMulai: 25000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Mousepad" },

  // ==================== TAMBAHAN ====================
  { id: "56", nama: "Banner Mini Meja", kategoriId: "adv", hargaMulai: 45000, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Mini+Banner" },
  { id: "57", nama: "Flag Banner", kategoriId: "adv", hargaMulai: 35000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Flag" },
  { id: "58", nama: "Spanduk Jumbo", kategoriId: "adv", hargaMulai: 65000, satuan: "m", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Spanduk+Jumbo" },
  { id: "59", nama: "Backdrop Portable", kategoriId: "adv", hargaMulai: 1250000, satuan: "set", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Backdrop+Portable" },
  { id: "60", nama: "Pylon Sign", kategoriId: "adv", hargaMulai: 5500000, satuan: "set", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Pylon" },
  { id: "61", nama: "Brosur A5 1 Sisi", kategoriId: "cetak", hargaMulai: 650000, satuan: "rim", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Brosur+A5" },
  { id: "62", nama: "Leaflet DL", kategoriId: "cetak", hargaMulai: 550000, satuan: "rim", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Leaflet" },
  { id: "63", nama: "Menu Restoran", kategoriId: "cetak", hargaMulai: 25000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Menu" },
  { id: "64", nama: "Voucher Custom", kategoriId: "cetak", hargaMulai: 350000, satuan: "rim", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Voucher" },
  { id: "65", nama: "Kop Surat", kategoriId: "cetak", hargaMulai: 250000, satuan: "rim", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Kop+Surat" },
  { id: "66", nama: "Map Folder Custom", kategoriId: "cetak", hargaMulai: 4500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Map+Folder" },
  { id: "67", nama: "Dus Cake Custom", kategoriId: "pack", hargaMulai: 3500, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Dus+Cake" },
  { id: "68", nama: "Dus Donat Custom", kategoriId: "pack", hargaMulai: 2500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Dus+Donat" },
  { id: "69", nama: "Kantong Kertas Custom", kategoriId: "pack", hargaMulai: 18000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Kantong+Kertas" },
  { id: "70", nama: "Packaging Frozen Food", kategoriId: "pack", hargaMulai: 4500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Frozen+Food" },
  { id: "71", nama: "Kipas Custom", kategoriId: "merch", hargaMulai: 8500, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Kipas" },
  { id: "72", nama: "Sticker Pack Custom", kategoriId: "merch", hargaMulai: 15000, satuan: "pack", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Sticker+Pack" },
  { id: "73", nama: "Magnet Kulkas Custom", kategoriId: "merch", hargaMulai: 7500, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Magnet" },
  { id: "74", nama: "Gelang Karet Custom", kategoriId: "merch", hargaMulai: 3500, satuan: "pcs", gambar: "https://placehold.co/500x500/2E9DF7/FFF?text=Gelang" },
  { id: "75", nama: "Jaket Custom", kategoriId: "merch", hargaMulai: 225000, satuan: "pcs", gambar: "https://placehold.co/500x500/1B2A6B/FFF?text=Jaket" },
];

export async function getProdukList(): Promise<Produk[]> {
  // Endpoint asli: const { data } = await api.get<Produk[]>("/produk"); return data;
  await new Promise((resolve) => setTimeout(resolve, 300));
  return DUMMY_PRODUK;
}

