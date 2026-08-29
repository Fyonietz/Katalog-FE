 // components/StatCard.tsx
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  actionLabel?: string;
  onAction?: () => void;
}

export default function StatCard({ icon: Icon, label, value, actionLabel, onAction }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF2FE]">
          <Icon className="h-4 w-4 text-[#2E9DF7]" />
        </div>
        {actionLabel && (
          <button onClick={onAction} className="text-xs font-medium text-gray-400 hover:text-[#1B2A6B]">
            {actionLabel} →
          </button>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-[#1B2A6B]">{value}</p>
    </div>
  );
}
