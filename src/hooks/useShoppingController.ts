// hooks/useShoppingController.ts
import { useEffect, useMemo, useState } from "react";
import type { Kategori, Produk } from "../models/Produk";
import type { CartItem } from "../models/CartItem";
import { getKategoriList } from "../services/kategoriService";
import { getProdukList } from "../services/produkService";
import { addToCart, getCart, getCartTotal, updateQty, removeFromCart } from "../services/cartService";

export function useShoppingController() {
  const [kategoriList, setKategoriList] = useState<Kategori[]>([]);
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [activeKategoriId, setActiveKategoriId] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // qty yang sedang dipilih per produk di grid, sebelum ditekan "tambah ke cart"
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([getKategoriList(), getProdukList()])
      .then(([kategori, produk]) => {
        setKategoriList(kategori);
        setProdukList(produk);
        if (kategori.length > 0) setActiveKategoriId(kategori[0].id);
      })
      .finally(() => setLoading(false));

    setCart(getCart());
  }, []);

  const produkTerfilter = useMemo(() => {
    return produkList.filter((p) => {
      const cocokKategori = p.kategoriId === activeKategoriId;
      const cocokSearch = p.nama.toLowerCase().includes(search.toLowerCase());
      return cocokKategori && cocokSearch;
    });
  }, [produkList, activeKategoriId, search]);

  const cartTotal = useMemo(() => getCartTotal(cart), [cart]);
  const cartCount = useMemo(() => cart.reduce((n, item) => n + item.qty, 0), [cart]);

  function getQty(produkId: string): number {
    return qtyMap[produkId] ?? 1;
  }

  function setQty(produkId: string, qty: number) {
    setQtyMap((prev) => ({ ...prev, [produkId]: Math.max(1, qty) }));
  }

  function handleAddToCart(produk: Produk) {
    const qty = getQty(produk.id);
    const updated = addToCart(produk, qty);
    setCart(updated);
    setQtyMap((prev) => ({ ...prev, [produk.id]: 1 })); // reset qty setelah ditambahkan
  }

  function handleUpdateCartQty(produkId: string, qty: number) {
    setCart(updateQty(produkId, qty));
  }

  function handleRemoveFromCart(produkId: string) {
    setCart(removeFromCart(produkId));
  }

  return {
    kategoriList,
    activeKategoriId,
    setActiveKategoriId,
    produkTerfilter,
    loading,
    search,
    setSearch,

    cart,
    cartOpen,
    setCartOpen,
    cartTotal,
    cartCount,

    getQty,
    setQty,
    handleAddToCart,
    handleUpdateCartQty,
    handleRemoveFromCart,
  };
}
