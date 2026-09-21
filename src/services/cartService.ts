// src/services/cartService.ts
import type { CartItem } from "../models/CartItem";
import type { Produk } from "../models/Produk";

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]): void {
  // Catatan: JSON.stringify akan menghilangkan objek File.
  // Idealnya file desain langsung di-upload ke server temp, 
  // namun untuk implementasi ini kita simpan referensinya jika ada.
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Update fungsi ini untuk menerima parameter kustomisasi lengkap
export function addToCart(
  produk: Produk, 
  qty: number, 
  idUkuranProduk?: number,
  ukuranCustom?: string,
  notes?: string, 
  desainText?: string, 
  desainFile?: File | null
): CartItem[] {
  const cart = getCart();
  const existing = cart.find((item) => item.produk.id === produk.id);

  if (existing) {
    existing.qty += qty;
    if (idUkuranProduk) existing.idUkuranProduk = idUkuranProduk;
    if (ukuranCustom !== undefined) existing.ukuranCustom = ukuranCustom;
    if (notes !== undefined) existing.notes = notes;
    if (desainText !== undefined) existing.desainText = desainText;
    if (desainFile !== undefined) existing.desainFile = desainFile;
  } else {
    cart.push({ produk, qty, idUkuranProduk, ukuranCustom, notes, desainText, desainFile });
  }

  saveCart(cart);
  return cart;
}

export function updateQty(produkId: number, qty: number): CartItem[] {
  let cart = getCart();
  if (qty <= 0) {
    cart = cart.filter((item) => item.produk.id !== produkId);
  } else {
    cart = cart.map((item) =>
      item.produk.id === produkId ? { ...item, qty } : item
    );
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(produkId: number): CartItem[] {
  const cart = getCart().filter((item) => item.produk.id !== produkId);
  saveCart(cart);
  return cart;
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.produk.harga * item.qty, 0);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export { updateQty as updateCartQty };
