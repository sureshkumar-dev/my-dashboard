import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Plus } from 'lucide-react';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (name: string) => void;
  existingRoleNames: string[];
}

export const AddRoleModal: React.FC<AddRoleModalProps> = ({
  isOpen,
  onClose,
  onAddRole,
  existingRoleNames,
}) => {
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = roleName.trim();
    if (!trimmed) {
      setError('Please enter a role title');
      return;
    }
    if (existingRoleNames.some((r) => r.toLowerCase() === trimmed.toLowerCase())) {
      setError('A role with this name already exists');
      return;
    }

    onAddRole(trimmed);
    setRoleName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setRoleName('');
    setError('');
    onClose();
  };

  const roleSuggestions = [
    'Frontend Developer',
    'Full Stack Developer',
    'Backend Engineer',
    'React Developer',
    'Node.js Developer',
    'Software Development Engineer (SDE)',
    'DevOps Engineer',
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Role Category" maxWidth="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Role Name <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Lead Backend Engineer"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            autoFocus
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Quick Suggestions */}
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
            Suggestions:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {roleSuggestions
              .filter((s) => !existingRoleNames.some((r) => r.toLowerCase() === s.toLowerCase()))
              .map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setRoleName(s)}
                  className="px-2.5 py-1 text-xs bg-slate-50 hover:bg-rose-50 hover:text-rose-700 border border-slate-200/80 rounded-md transition-colors text-slate-600"
                >
                  + {s}
                </button>
              ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Role</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
