// src/lib/showModal.tsx
import { createRoot } from "react-dom/client";
import Modal, { type ModalVariant } from "../components/ui/Modal";

type ShowModalOptions = {
  title?: string;
  variant?: ModalVariant;
};

type ConfirmOptions = ShowModalOptions & {
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

/** Drop-in replacement for the browser `alert()` using the app's Modal. */
export function showModal(message: string, options: ShowModalOptions = {}) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  function cleanup() {
    try {
      root.unmount();
    } catch {
      /* noop */
    }
    if (container.parentNode) container.parentNode.removeChild(container);
  }

  root.render(
    <Modal
      isOpen
      message={message}
      title={options.title}
      variant={options.variant ?? "info"}
      onClose={cleanup}
    />
  );
}

/** Drop-in replacement for the browser `confirm()`. Resolves `true` when confirmed. */
export function showConfirm(message: string, options: ConfirmOptions = {}): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    function cleanup(result: boolean) {
      try {
        root.unmount();
      } catch {
        /* noop */
      }
      if (container.parentNode) container.parentNode.removeChild(container);
      resolve(result);
    }

    root.render(
      <Modal
        isOpen
        message={message}
        title={options.title ?? "Konfirmasi"}
        variant={options.variant ?? "confirm"}
        confirmLabel={options.confirmLabel ?? "Ya, Lanjutkan"}
        cancelLabel={options.cancelLabel}
        danger={options.danger}
        onConfirm={() => cleanup(true)}
        onClose={() => cleanup(false)}
      />
    );
  });
}

export default showModal;
