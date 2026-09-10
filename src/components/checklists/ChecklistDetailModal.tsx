import React, { useState } from 'react';
import { Checklist, ChecklistItem, Priority } from '../../types';
import { Modal } from '../common/Modal';
import { PriorityBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Check,
  Plus,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface ChecklistDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: Checklist | null;
  onToggleItem: (checklistId: string, itemId: string) => void;
  onAddItem: (checklistId: string, item: Omit<ChecklistItem, 'id'>) => void;
  onDeleteItem: (checklistId: string, itemId: string) => void;
  onUpdateItem: (checklistId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
  onDeleteChecklist: (checklistId: string) => void;
}

export const ChecklistDetailModal: React.FC<ChecklistDetailModalProps> = ({
  isOpen,
  onClose,
  checklist,
  onToggleItem,
  onAddItem,
  onDeleteItem,
  onUpdateItem,
  onDeleteChecklist,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // New item draft
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<Priority>('High');

  if (!checklist) return null;

  const total = checklist.items.length;
  const completed = checklist.items.filter((i) => i.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    onAddItem(checklist.id, {
      title: newItemTitle.trim(),
      description: newItemDesc.trim() || undefined,
      completed: false,
      priority: newItemPriority,
    });

    setNewItemTitle('');
    setNewItemDesc('');
    setIsAddingItem(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={checklist.name}
        subtitle={`${checklist.type} Checklist • ${completed} of ${total} Completed (${percent}%)`}
        maxWidth="3xl"
      >
        <div className="space-y-6">
          {/* Progress Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50/70 to-pink-50/40 border border-rose-100">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-700">Overall Completion</span>
              <span className="text-rose-600 font-bold">{percent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-rose-100/80">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
            {checklist.dueDate && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
                <Calendar className="w-3.5 h-3.5 text-rose-500" />
                <span>Target Due Date: {checklist.dueDate}</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Checklist Items ({total})
              </h4>
              {!isAddingItem && (
                <button
                  onClick={() => setIsAddingItem(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Task Item
                </button>
              )}
            </div>

            {/* Quick Add Form */}
            {isAddingItem && (
              <form
                onSubmit={handleCreateItem}
                className="p-3.5 bg-rose-50/40 border border-rose-200/80 rounded-xl space-y-3 animate-fadeIn"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemTitle}
                    onChange={(e) => setNewItemTitle(e.target.value)}
                    placeholder="Task item title..."
                    className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    autoFocus
                  />
                  <select
                    value={newItemPriority}
                    onChange={(e) => setNewItemPriority(e.target.value as Priority)}
                    className="text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="High">🔥 High</option>
                    <option value="Medium">⚡ Medium</option>
                    <option value="Low">🌱 Low</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Optional brief description or key notes..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingItem(false)}
                    className="px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            )}

            {/* Items */}
            {checklist.items.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No tasks in this checklist yet.</p>
            ) : (
              <div className="space-y-2">
                {checklist.items.map((item) => {
                  const isExpanded = expandedItemId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-3 rounded-xl border transition-all ${
                        item.completed
                          ? 'bg-slate-50/60 border-slate-200/60'
                          : 'bg-white border-rose-100/80 shadow-sm hover:border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={() => onToggleItem(checklist.id, item.id)}
                            className={`w-5 h-5 mt-0.5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                              item.completed
                                ? 'bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-200'
                                : 'border-slate-300 hover:border-rose-400 bg-white'
                            }`}
                          >
                            {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          {/* Content */}
                          <div
                            className="flex-1 min-w-0 cursor-pointer"
                            onClick={() => onToggleItem(checklist.id, item.id)}
                          >
                            <span
                              className={`text-sm font-medium block leading-snug ${
                                item.completed
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-800 hover:text-rose-600'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.description && (
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Priority Badge & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <PriorityBadge priority={item.priority} />

                          <button
                            type="button"
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded"
                            title="Notes & details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteItem(checklist.id, item.id)}
                            className="p-1 text-slate-300 hover:text-red-600 rounded transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Notes Drawer */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-100/80 space-y-2 text-xs">
                          <label className="block text-[11px] font-semibold text-slate-400 uppercase">
                            Item Notes
                          </label>
                          <textarea
                            rows={2}
                            value={item.notes || ''}
                            onChange={(e) =>
                              onUpdateItem(checklist.id, item.id, { notes: e.target.value })
                            }
                            placeholder="Add study notes, links, or reminders for this specific task..."
                            className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-rose-100">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Checklist</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDeleteChecklist(checklist.id);
          onClose();
        }}
        title="Delete Checklist"
        message={`Are you sure you want to delete the checklist "${checklist.name}" and all its task items?`}
        confirmText="Delete Checklist"
        isDestructive={true}
      />
    </>
  );
};
