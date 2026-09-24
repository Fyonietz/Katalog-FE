// components/StatCard.tsx
import { ArrowRight, type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  actionLabel?: string;
  onAction?: () => void;
  /** Format angka sebelum ditampilkan, mis. mata uang. */
  format?: (value: number) => string;
  /** Keterangan kecil di bawah angka (mis. rentang tanggal laporan). */
  hint?: string;
  loading?: boolean;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  actionLabel,
  onAction,
  format,
  hint,
  loading = false,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF2FE]">
          <Icon className="h-4 w-4 text-[#2E9DF7]" />
        </div>
        {actionLabel && (
          <button
            onClick={onAction}
            className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-[#1B2A6B]"
          >
            {actionLabel}
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">{label}</p>
      {loading ? (
        <div className="mt-1 h-8 w-24 animate-pulse rounded bg-gray-100" />
      ) : (
        <p className="break-words text-2xl font-bold text-[#1B2A6B]">
          {format ? format(value) : value}
        </p>
      )}
      {hint && !loading && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}
