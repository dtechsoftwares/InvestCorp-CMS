import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const styles = {
    success: {
      bg: 'bg-white',
      border: 'border-l-4 border-green-500',
      icon: <CheckCircle size={20} className="text-green-500" />
    },
    error: {
      bg: 'bg-white',
      border: 'border-l-4 border-red-500',
      icon: <AlertCircle size={20} className="text-red-500" />
    },
    info: {
      bg: 'bg-white',
      border: 'border-l-4 border-blue-500',
      icon: <Info size={20} className="text-blue-500" />
    }
  };

  const style = styles[toast.type];

  return (
    <div className={`${style.bg} ${style.border} shadow-lg rounded-r-lg p-4 mb-3 w-80 transform transition-all duration-500 ease-in-out animate-slide-in-right flex items-start gap-3`}>
      <div className="flex-shrink-0 mt-0.5">
        {style.icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-gray-900">{toast.title}</h4>
        <p className="text-sm text-gray-500 mt-1">{toast.message}</p>
      </div>
      <button onClick={() => onClose(toast.id)} className="text-gray-400 hover:text-gray-600">
        <X size={16} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-end">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
