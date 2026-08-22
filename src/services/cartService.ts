// services/cartService.ts
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
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(produk: Produk, qty: number): CartItem[] {
  const cart = getCart();
  const existing = cart.find((item) => item.produk.id === produk.id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ produk, qty });
  }

  saveCart(cart);
  return cart;
}

export function updateQty(produkId: string, qty: number): CartItem[] {
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

export function removeFromCart(produkId: string): CartItem[] {
  const cart = getCart().filter((item) => item.produk.id !== produkId);
  saveCart(cart);
  return cart;
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.produk.hargaMulai * item.qty, 0);
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
}
