// src/components/ui/Modal.tsx
import { useEffect, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export type ModalVariant = "info" | "success" | "error" | "warning" | "confirm";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: ReactNode;
  variant?: ModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  /** Use a red confirm button for destructive confirmations. */
  danger?: boolean;
  isProcessing?: boolean;
  children?: ReactNode;
}

const VARIANT_STYLES: Record<
  ModalVariant,
  { icon: typeof Info; wrap: string; icon_color: string }
> = {
  info: { icon: Info, wrap: "bg-blue-50", icon_color: "text-blue-500" },
  success: { icon: CheckCircle2, wrap: "bg-emerald-50", icon_color: "text-emerald-500" },
  error: { icon: XCircle, wrap: "bg-red-50", icon_color: "text-red-500" },
  warning: { icon: AlertTriangle, wrap: "bg-amber-50", icon_color: "text-amber-500" },
  confirm: { icon: AlertTriangle, wrap: "bg-amber-50", icon_color: "text-amber-500" },
};

export default function Modal({
  isOpen,
  onClose,
  title = "Pemberitahuan",
  message,
  variant = "info",
  confirmLabel,
  cancelLabel = "Batal",
  onConfirm,
  danger = false,
  isProcessing = false,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !isProcessing) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const { icon: Icon, wrap, icon_color } = VARIANT_STYLES[variant];
  const isConfirm = Boolean(onConfirm);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !isProcessing && onClose()}
      />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          disabled={isProcessing}
          aria-label="Tutup"
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", wrap)}>
          <Icon className={cn("h-6 w-6", danger ? "text-red-500" : icon_color)} />
        </div>

        <h3 className="mt-4 text-base font-extrabold text-[#1B2A6B]">{title}</h3>

        {message && <div className="mt-2 text-sm text-gray-600">{message}</div>}
        {children && <div className="mt-2">{children}</div>}

        <div className="mt-6 flex justify-end gap-3">
          {isConfirm && (
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {cancelLabel}
            </button>
          )}
          <button
            onClick={onConfirm ?? onClose}
            disabled={isProcessing}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              danger
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#1B2A6B] hover:bg-[#111A42]"
            )}
          >
            {isProcessing ? "Memproses..." : (confirmLabel ?? (isConfirm ? "Ya" : "Tutup"))}
          </button>
        </div>
      </div>
    </div>
  );
}
