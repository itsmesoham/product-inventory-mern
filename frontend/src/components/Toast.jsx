import React, { useEffect } from 'react';

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      role="status"
      className={`fixed top-5 right-5 z-[200] flex items-center gap-3.5 px-4 py-3.5 rounded text-[13.5px] font-medium shadow-lg border max-w-[360px] animate-[fadeIn_0.18s_ease-out] ${
        isSuccess
          ? 'bg-green-50 text-green-900 border-green-200'
          : 'bg-red-50 text-rose-900 border-rose-200'
      }`}
    >
      <span>{toast.message}</span>
      <button
        className="bg-transparent border-none text-lg leading-none opacity-60 hover:opacity-100 p-0"
        onClick={onClose}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
