// utils/pricing.ts
// Satu-satunya tempat rumus harga dihitung di frontend. Backend tetap
// sumber kebenaran (lihat docs/pricing-system.md §7); helper ini hanya untuk
// estimasi UI dan penyesuaian satuan dimensi sebelum dikirim sebagai form data.
import type { CartItem } from "../models/CartItem";
import type { DimensionUnit, PricingMode, Produk, UkuranProduk } from "../models/Produk";

export const PRICING_MODES: PricingMode[] = ["Fixed", "PerArea", "PerLength", "PerUnit", "Custom"];
export const DIMENSION_UNITS: DimensionUnit[] = ["centimeter", "meter"];

export const DEFAULT_PRICING_MODE: PricingMode = "Fixed";
export const DEFAULT_DIMENSION_UNIT: DimensionUnit = "meter";

export const PRICING_MODE_LABELS: Record<PricingMode, string> = {
  Fixed: "Harga tetap / unit",
  PerArea: "Harga per m²",
  PerLength: "Harga per meter",
  PerUnit: "Harga per unit",
  Custom: "Khusus",
};

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function getPricingMode(produk?: Produk | null): PricingMode {
  const mode = produk?.pricingMode;
  return PRICING_MODES.includes(mode as PricingMode) ? (mode as PricingMode) : DEFAULT_PRICING_MODE;
}

export function getDimensionUnit(produk?: Produk | null): DimensionUnit {
  const unit = produk?.dimensionUnit;
  return DIMENSION_UNITS.includes(unit as DimensionUnit) ? (unit as DimensionUnit) : DEFAULT_DIMENSION_UNIT;
}

/** Mode yang membutuhkan input dimensi dari customer. */
export function usesDimensions(produk?: Produk | null): boolean {
  const mode = getPricingMode(produk);
  return mode === "PerArea" || mode === "PerLength";
}

export function dimensionUnitLabel(unit: DimensionUnit): string {
  return unit === "centimeter" ? "cm" : "meter";
}

/** Konversi input customer (satuan product) ke meter. */
export function toMeters(value: number, unit: DimensionUnit): number {
  return unit === "centimeter" ? value / 100 : value;
}

/** Konversi nilai meter dari server kembali ke satuan product. */
export function fromMeters(value: number, unit: DimensionUnit): number {
  return unit === "centimeter" ? value * 100 : value;
}

/** Akhiran tarif untuk katalog, mis. " / m²". */
export function pricingRateSuffix(mode: PricingMode): string {
  switch (mode) {
    case "PerArea":
      return " / m²";
    case "PerLength":
      return " / meter";
    case "PerUnit":
      return " / unit";
    default:
      return "";
  }
}

/** rate = ukuran.harga ?? (produk.harga + ukuran.hargaTambahan) */
export function resolveRate(produk: Produk, ukuran?: UkuranProduk | null): number {
  if (ukuran?.harga !== null && ukuran?.harga !== undefined) {
    return Number(ukuran.harga);
  }
  return Number(produk?.harga ?? 0) + Number(ukuran?.hargaTambahan ?? 0);
}

export interface SubtotalInput {
  pricingMode: PricingMode;
  dimensionUnit: DimensionUnit;
  rate: number;
  qty: number;
  width?: number | null;
  height?: number | null;
  length?: number | null;
}

export function computeSubtotal(input: SubtotalInput): number {
  const { pricingMode, dimensionUnit, rate, qty } = input;

  switch (pricingMode) {
    case "PerArea": {
      const width = toMeters(Number(input.width ?? 0), dimensionUnit);
      const height = toMeters(Number(input.height ?? 0), dimensionUnit);
      return round2(width * height * rate * qty);
    }
    case "PerLength": {
      const length = toMeters(Number(input.length ?? 0), dimensionUnit);
      return round2(length * rate * qty);
    }
    default:
      return round2(rate * qty);
  }
}

/** Estimasi subtotal satu baris keranjang. Server selalu menghitung ulang. */
export function estimateItemSubtotal(item: CartItem): number {
  return computeSubtotal({
    pricingMode: getPricingMode(item.produk),
    dimensionUnit: getDimensionUnit(item.produk),
    rate: resolveRate(item.produk, item.ukuran),
    qty: item.qty,
    width: item.width,
    height: item.height,
    length: item.length,
  });
}

/** Subtotal dari snapshot server, dengan fallback untuk baris pesanan lama. */
export function detailSubtotal(detail: { subtotal?: number | null; hargaSatuan?: number | null; qty: number }): number {
  if (detail.subtotal !== null && detail.subtotal !== undefined) return Number(detail.subtotal);
  return round2(Number(detail.hargaSatuan ?? 0) * detail.qty);
}

/**
 * Dimensi item pesanan dalam satuan aslinya, mis. "3 x 1 meter" atau "60 x 160 cm".
 * Mengembalikan null bila item tidak memakai input dimensi.
 */
export function formatDetailDimensions(detail: {
  pricingMode?: string | null;
  dimensionUnit?: string | null;
  widthMeters?: number | null;
  heightMeters?: number | null;
  lengthMeters?: number | null;
}): string | null {
  const unit: DimensionUnit = detail.dimensionUnit === "centimeter" ? "centimeter" : "meter";
  const format = (meters?: number | null) => {
    if (meters === null || meters === undefined) return null;
    const value = fromMeters(Number(meters), unit);
    return Number(value.toFixed(2)).toLocaleString("id-ID");
  };

  const width = format(detail.widthMeters);
  const height = format(detail.heightMeters);
  const length = format(detail.lengthMeters);

  if (detail.pricingMode === "PerArea" && width && height) {
    return `${width} x ${height} ${dimensionUnitLabel(unit)}`;
  }
  if (detail.pricingMode === "PerLength" && length) {
    return `${length} ${dimensionUnitLabel(unit)}`;
  }
  return null;
}

/** Label tarif dari baris pesanan, mis. "Rp25.000 / m²". */
export function detailRateLabel(detail: { pricingMode?: string | null; hargaSatuan?: number | null }): string {
  const suffix = pricingRateSuffix((detail.pricingMode as PricingMode) ?? "Fixed");
  return `Rp ${Number(detail.hargaSatuan ?? 0).toLocaleString("id-ID")}${suffix}`;
}
