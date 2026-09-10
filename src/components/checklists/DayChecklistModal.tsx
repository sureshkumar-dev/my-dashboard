import React, { useState, useEffect } from 'react';
import { DayChecklist, RecurrenceType } from '../../types';
import { Modal } from '../common/Modal';
import { Plus, Trash2, Check } from 'lucide-react';

interface DayChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayChecklist?: DayChecklist | null;
  onSave: (data: any) => void;
}

export const DayChecklistModal: React.FC<DayChecklistModalProps> = ({
  isOpen,
  onClose,
  dayChecklist,
  onSave,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('one-time');
  const [notes, setNotes] = useState('');
  const [tasksText, setTasksText] = useState('');

  useEffect(() => {
    if (dayChecklist) {
      setDate(dayChecklist.date);
      setTitle(dayChecklist.title);
      setRecurrence(dayChecklist.recurrence);
      setNotes(dayChecklist.notes || '');
      setTasksText(dayChecklist.tasks.map((t) => t.title).join('\n'));
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setTitle('');
      setRecurrence('one-time');
      setNotes('');
      setTasksText(
        `Review company background & tech stack\nReview JD & align talking points\nRevise core technical fundamentals\nReview project architecture, challenges, and solutions\nPrepare questions for interviewer\nCheck laptop, microphone, camera, and internet\nJoin meeting 5 minutes early`
      );
    }
  }, [dayChecklist, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskLines = tasksText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const tasks = taskLines.map((line, idx) => {
      // Retain existing completion status if editing matching task
      const existing = dayChecklist?.tasks.find((t) => t.title.toLowerCase() === line.toLowerCase());
      return {
        id: existing ? existing.id : 'dt_' + Date.now() + '_' + idx,
        title: line,
        completed: existing ? existing.completed : false,
      };
    });

    onSave({
      date,
      title: title.trim(),
      recurrence,
      notes: notes.trim() || undefined,
      tasks: tasks.length > 0 ? tasks : [{ id: 'dt_1', title: 'Preparation task', completed: false }],
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dayChecklist ? 'Edit Day Checklist' : 'Create Custom Day Checklist'}
      subtitle="Organize specific tasks for an interview day or routine"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date <span className="text-rose-600">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Recurrence
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-500"
            >
              <option value="one-time">One-time Checklist</option>
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays (Mon-Fri)</option>
              <option value="weekly">Weekly</option>
              <option value="custom">Custom Recurrence</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Checklist Title <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Technical Interview Day"
            required
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Day Tasks (One task per line)
          </label>
          <textarea
            rows={6}
            value={tasksText}
            onChange={(e) => setTasksText(e.target.value)}
            placeholder="Review company&#10;Revise React&#10;Check laptop"
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Schedule Info
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Round starts at 11:00 AM on Google Meet"
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
            <span>Save Day Checklist</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
