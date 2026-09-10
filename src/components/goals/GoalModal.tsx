import React, { useState, useEffect } from 'react';
import { Goal, GoalCategory, GoalStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Check } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  isNew?: boolean;
  onSave: (data: any) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goal,
  isNew = false,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Applications' as GoalCategory,
    targetValue: 10,
    currentValue: 0,
    unit: 'jobs',
    deadline: '',
    status: 'In Progress' as GoalStatus,
    notes: '',
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        category: goal.category,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        unit: goal.unit,
        deadline: goal.deadline || '',
        status: goal.status,
        notes: goal.notes || '',
      });
    } else {
      setFormData({
        name: '',
        category: 'Applications',
        targetValue: 10,
        currentValue: 0,
        unit: 'jobs',
        deadline: '',
        status: 'In Progress',
        notes: '',
      });
    }
  }, [goal, isNew, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name.trim(),
      category: formData.category,
      targetValue: Number(formData.targetValue) || 1,
      currentValue: Number(formData.currentValue) || 0,
      unit: formData.unit.trim() || 'units',
      deadline: formData.deadline.trim() || undefined,
      status: formData.status,
      notes: formData.notes.trim() || undefined,
    });

    onClose();
  };

  const categories: GoalCategory[] = [
    'Applications',
    'Interviews',
    'Skill Prep',
    'MNC',
    'Other',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isNew ? 'Create Career Goal' : `Edit Goal: ${formData.name}`}
      subtitle="Set target metrics for your job search productivity"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Goal Description <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Apply to 10 jobs this week"
            required
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            autoFocus
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value as GoalCategory }))
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current</label>
            <input
              type="number"
              min="0"
              value={formData.currentValue}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, currentValue: Number(e.target.value) }))
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target</label>
            <input
              type="number"
              min="1"
              value={formData.targetValue}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, targetValue: Number(e.target.value) }))
              }
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Unit</label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
              placeholder="e.g. jobs, %"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notes (Optional)</label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional context or strategy..."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200"
          >
            <Check className="w-4 h-4" />
            <span>Save Goal</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
