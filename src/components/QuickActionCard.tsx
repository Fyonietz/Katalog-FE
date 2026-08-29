 // components/QuickActionCard.tsx
import { ArrowRight, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

export default function QuickActionCard({ icon: Icon, title, description, to }: QuickActionCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 text-left
                 transition-colors hover:border-[#2E9DF7] hover:bg-[#F8FBFF]"
    >
      <div className="flex gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF2FE] shrink-0">
          <Icon className="h-4 w-4 text-[#2E9DF7]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1B2A6B]">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
    </button>
  );
}
