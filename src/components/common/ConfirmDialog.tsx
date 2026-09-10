import React, { useState } from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  requireTypingWord?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  requireTypingWord,
  isDestructive = true,
}) => {
  const [typedInput, setTypedInput] = useState('');

  const canConfirm = !requireTypingWord || typedInput.trim() === requireTypingWord;

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
      setTypedInput('');
      onClose();
    }
  };

  const handleClose = () => {
    setTypedInput('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} maxWidth="md">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              isDestructive ? 'bg-red-50 text-red-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>

        {requireTypingWord && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-medium text-slate-700 block">
              Type <span className="font-mono font-semibold text-red-600">{requireTypingWord}</span> to proceed:
            </label>
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder={requireTypingWord}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-red-200'
                : 'bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-rose-200'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
