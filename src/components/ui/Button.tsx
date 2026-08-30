 // components/ui/Button.tsx
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "icon" | "sm";
}

export function Button({ variant = "default", size = "default", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
        variant === "default" && "bg-[#1B2A6B] text-white hover:bg-[#15205A]",
        variant === "outline" && "border border-gray-300 text-gray-700 hover:bg-gray-50",
        variant === "ghost" && "text-gray-500 hover:bg-gray-100",
        size === "default" && "px-4 py-2 text-sm",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "icon" && "h-8 w-8",
        className
      )}
      {...props}
    />
  );
}
