import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";

type Props = {
  message: string;
  onClose: () => void;
};

function Modal({ message, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl z-10">
        <h3 className="font-extrabold text-[#1B2A6B] text-base">Pemberitahuan</h3>
        <p className="text-sm text-gray-600 mt-3">{message}</p>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1B2A6B] text-white rounded-xl text-sm font-bold hover:bg-[#111A42]"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export function showModal(message: string) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  function cleanup() {
    try {
      root.unmount();
    } catch {}
    if (container.parentNode) container.parentNode.removeChild(container);
  }

  root.render(<Modal message={message} onClose={cleanup} />);
}

export default showModal;
