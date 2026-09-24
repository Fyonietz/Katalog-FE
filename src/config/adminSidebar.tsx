 // config/adminSidebar.ts
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Layers,
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
      { label: "Kategori Produk", path: "/dashboard/admin/produk/kategori", icon: Tags },
      { label: "Daftar Produk", path: "/dashboard/admin/produk/daftar", icon: Package },
    ],
  },
  { label: "Layanan", path: "/dashboard/admin/layanan", icon: Layers },
  { label: "Pesanan", path: "/dashboard/admin/pesanan", icon: ShoppingCart },
  { label: "Laporan Penjualan", path: "/dashboard/admin/report", icon: BarChart3 },
];
