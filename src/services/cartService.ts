// src/services/cartService.ts
import type { AddToCartOptions, CartItem } from "../models/CartItem";
import type { Produk } from "../models/Produk";
import { estimateItemSubtotal } from "../utils/pricing";

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

/** Salin hanya field yang benar-benar dikirim, agar nilai lama tidak terhapus. */
function mergeOptions(target: CartItem, options: AddToCartOptions): void {
  if (options.idUkuranProduk !== undefined) target.idUkuranProduk = options.idUkuranProduk;
  if (options.ukuran !== undefined) target.ukuran = options.ukuran;
  if (options.ukuranCustom !== undefined) target.ukuranCustom = options.ukuranCustom;
  if (options.width !== undefined) target.width = options.width;
  if (options.height !== undefined) target.height = options.height;
  if (options.length !== undefined) target.length = options.length;
  if (options.notes !== undefined) target.notes = options.notes;
  if (options.desainText !== undefined) target.desainText = options.desainText;
  if (options.desainFile !== undefined) target.desainFile = options.desainFile;
}

// Update fungsi ini untuk menerima parameter kustomisasi lengkap
export function addToCart(
  produk: Produk,
  qty: number,
  options: AddToCartOptions = {}
): CartItem[] {
  const cart = getCart();
  const existing = cart.find((item) => item.produk.id === produk.id);

  if (existing) {
    existing.qty += qty;
    mergeOptions(existing, options);
  } else {
    cart.push({ produk, qty, ...options });
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

/** Estimasi total keranjang; server tetap menghitung harga final saat checkout. */
export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + estimateItemSubtotal(item), 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.qty, 0);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}

export { updateQty as updateCartQty };
