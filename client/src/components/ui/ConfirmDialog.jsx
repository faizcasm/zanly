import React, { createContext, useContext, useState } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { Button } from './Button';

// Confirmation Dialog Context
const ConfirmDialogContext = createContext();

// Dialog types and their configurations
const DIALOG_TYPES = {
  danger: {
    icon: AlertTriangle,
    iconClassName: 'text-red-500',
    confirmClassName: 'bg-red-600 hover:bg-red-700 text-white',
  },
  warning: {
    icon: AlertTriangle,
    iconClassName: 'text-yellow-500',
    confirmClassName: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  },
  info: {
    icon: Info,
    iconClassName: 'text-blue-500',
    confirmClassName: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  success: {
    icon: CheckCircle,
    iconClassName: 'text-green-500',
    confirmClassName: 'bg-green-600 hover:bg-green-700 text-white',
  },
};

// Confirmation Dialog Component
function ConfirmDialog({ dialog, onConfirm, onCancel }) {
  if (!dialog) return null;

  const {
    type = 'info',
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showCancel = true,
  } = dialog;

  const config = DIALOG_TYPES[type] || DIALOG_TYPES.info;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <Icon className={`h-6 w-6 ${config.iconClassName}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            {message && (
              <p className="text-sm text-gray-600 mb-4">{message}</p>
            )}
            <div className="flex justify-end space-x-3">
              {showCancel && (
                <Button variant="secondary" onClick={onCancel}>
                  {cancelText}
                </Button>
              )}
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${config.confirmClassName}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Confirmation Dialog Provider
export function ConfirmDialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const showConfirmDialog = (options) => {
    return new Promise((resolve) => {
      setDialog({
        ...options,
        onConfirm: () => {
          setDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setDialog(null);
          resolve(false);
        },
      });
    });
  };

  const hideConfirmDialog = () => {
    setDialog(null);
  };

  // Convenience methods for different dialog types
  const confirm = {
    danger: (title, message, options = {}) =>
      showConfirmDialog({ type: 'danger', title, message, ...options }),
    warning: (title, message, options = {}) =>
      showConfirmDialog({ type: 'warning', title, message, ...options }),
    info: (title, message, options = {}) =>
      showConfirmDialog({ type: 'info', title, message, ...options }),
    success: (title, message, options = {}) =>
      showConfirmDialog({ type: 'success', title, message, ...options }),
    custom: (options) => showConfirmDialog(options),
  };

  const contextValue = {
    showConfirmDialog,
    hideConfirmDialog,
    confirm,
  };

  const handleConfirm = () => {
    if (dialog?.onConfirm) {
      dialog.onConfirm();
    }
  };

  const handleCancel = () => {
    if (dialog?.onCancel) {
      dialog.onCancel();
    }
  };

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}
      <ConfirmDialog 
        dialog={dialog} 
        onConfirm={handleConfirm} 
        onCancel={handleCancel} 
      />
    </ConfirmDialogContext.Provider>
  );
}

// Hook to use confirmation dialog
export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error('useConfirmDialog must be used within a ConfirmDialogProvider');
  }
  return context;
};

export default ConfirmDialog;