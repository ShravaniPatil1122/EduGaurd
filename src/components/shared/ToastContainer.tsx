import React from 'react';
import { useAppStore } from '../../services/store';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur bg-white transition-all transform translate-y-0 opacity-100 ${
              isSuccess
                ? 'border-brand-emerald text-brand-dark'
                : isError
                ? 'border-brand-danger text-red-900'
                : isWarning
                ? 'border-brand-warning text-amber-900'
                : 'border-brand-info text-brand-textPrimary'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-brand-emerald" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-brand-warning" />}
              {isError && <AlertCircle className="w-5 h-5 text-brand-danger" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-5 h-5 text-brand-info" />}
            </div>

            <div className="flex-1 text-xs">
              <div className="font-semibold text-sm leading-tight text-brand-textPrimary">
                {toast.title}
              </div>
              <div className="mt-0.5 text-brand-textSecondary leading-snug">{toast.message}</div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-md"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
