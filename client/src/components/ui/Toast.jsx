import React, { useState, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast types and their configurations
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 dark:bg-green-900/70 border-green-200 dark:border-green-700 text-green-900 dark:text-green-100',
    iconClassName: 'text-green-500 dark:text-green-300',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 dark:bg-red-900/70 border-red-200 dark:border-red-700 text-red-900 dark:text-red-100',
    iconClassName: 'text-red-500 dark:text-red-300',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 dark:bg-yellow-900/70 border-yellow-200 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100',
    iconClassName: 'text-yellow-500 dark:text-yellow-300',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 dark:bg-blue-900/70 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100',
    iconClassName: 'text-blue-500 dark:text-blue-300',
  },
};

// Individual Toast Component
function Toast({ toast, onRemove }) {
  const { id, type, title, message, duration } = toast;
  const config = TOAST_TYPES[type] || TOAST_TYPES.info;
  const Icon = config.icon;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onRemove]);

  return (
    <div className={`w-full max-w-sm shadow-xl rounded-xl pointer-events-auto border ${config.className} mb-3 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-sm` }>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${config.iconClassName}`} />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            {title && (
              <p className="text-sm font-semibold leading-5">{title}</p>
            )}
            {message && (
              <p className={`text-sm leading-5 ${title ? 'mt-1' : ''}`}>{message}</p>
            )}
          </div>
          <div className="ml-3 flex-shrink-0 flex">
            <button
              className="inline-flex text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
              onClick={() => onRemove(id)}
              aria-label="Close notification"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toast Container Component
function ToastContainer({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed z-50 flex flex-col items-stretch md:items-end gap-3 w-full px-4 md:px-0 bottom-4 left-0 md:left-auto md:right-4 md:top-4 md:bottom-auto">
      <div className="mx-auto w-full max-w-md md:max-w-sm md:mx-0">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </div>
  );
}

// Toast Provider Component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      duration: 5000, // Default 5 seconds
      ...toast,
    };
    
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods for different toast types
  const toast = {
    success: (title, message, options = {}) => 
      addToast({ type: 'success', title, message, ...options }),
    error: (title, message, options = {}) => 
      addToast({ type: 'error', title, message, ...options }),
    warning: (title, message, options = {}) => 
      addToast({ type: 'warning', title, message, ...options }),
    info: (title, message, options = {}) => 
      addToast({ type: 'info', title, message, ...options }),
    custom: (options) => addToast(options),
  };

  const contextValue = {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    toast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default Toast;