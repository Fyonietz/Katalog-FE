 // config/adminSidebar.ts
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  BarChart3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  path?: string; // omit if this item only expands children
  icon: LucideIcon;
  children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
  {
    label: "Produk",
    icon: Package,
    children: [
      { label: "Kategori Produk", path: "/admin/dashboard/produk/kategori", icon: Tags },
      { label: "Daftar Produk", path: "/admin/dashboard/produk/daftar", icon: Package },
    ],
  },
  { label: "Pesanan", path: "/admin/dashboard/pesanan", icon: ShoppingCart },
  { label: "Pelanggan", path: "/admin/dashboard/pelanggan", icon: Users },
  { label: "Laporan Penjualan", path: "/admin/dashboard/laporan", icon: BarChart3 },
];
