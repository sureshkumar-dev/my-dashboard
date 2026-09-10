import React, { useState } from 'react';
import { ChecklistTemplate, ChecklistType, Priority } from '../../types';
import { Modal } from '../common/Modal';
import { Sparkles, Plus, Check, BookOpen, Layers } from 'lucide-react';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: ChecklistTemplate[];
  onInstantiateTemplate: (templateId: string, customName?: string) => void;
  onCreateTemplate: (template: Omit<ChecklistTemplate, 'id' | 'isBuiltIn'>) => void;
  onCreateBlankChecklist: (name: string, type: ChecklistType, dueDate?: string) => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  templates,
  onInstantiateTemplate,
  onCreateTemplate,
  onCreateBlankChecklist,
}) => {
  const [mode, setMode] = useState<'pick' | 'custom-template' | 'blank'>('pick');

  // Blank checklist state
  const [blankName, setBlankName] = useState('');
  const [blankType, setBlankType] = useState<ChecklistType>('Preparation');
  const [blankDueDate, setBlankDueDate] = useState('');

  // Custom template state
  const [tplName, setTplName] = useState('');
  const [tplDesc, setTplDesc] = useState('');
  const [tplCategory, setTplCategory] = useState<ChecklistType>('Technical');
  const [tplRawItems, setTplRawItems] = useState('');

  const handlePickTemplate = (templateId: string) => {
    onInstantiateTemplate(templateId);
    onClose();
  };

  const handleCreateBlank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blankName.trim()) return;
    onCreateBlankChecklist(blankName.trim(), blankType, blankDueDate || undefined);
    setBlankName('');
    onClose();
  };

  const handleCreateCustomTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplName.trim()) return;

    const items = tplRawItems
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((title) => ({
        title,
        priority: 'High' as Priority,
      }));

    onCreateTemplate({
      name: tplName.trim(),
      description: tplDesc.trim() || 'Custom checklist template',
      category: tplCategory,
      defaultItems: items.length > 0 ? items : [{ title: 'First task', priority: 'High' }],
    });

    setTplName('');
    setTplDesc('');
    setTplRawItems('');
    setMode('pick');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'pick'
          ? 'Choose Checklist Template'
          : mode === 'blank'
          ? 'Create Blank Checklist'
          : 'Create Custom Template'
      }
      subtitle={
        mode === 'pick'
          ? 'Select a ready-made template or start from scratch'
          : 'Customize your template tasks'
      }
      maxWidth="3xl"
    >
      {mode === 'pick' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Available Templates ({templates.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMode('blank')}
                className="text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                + Blank Checklist
              </button>
              <button
                type="button"
                onClick={() => setMode('custom-template')}
                className="text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                + New Template
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => handlePickTemplate(tpl.id)}
                className="p-4 rounded-xl border border-rose-100 hover:border-rose-400 hover:shadow-md bg-white hover:bg-rose-50/20 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-rose-100/70 text-rose-700">
                      {tpl.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {tpl.defaultItems.length} items
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-rose-600 transition-colors">
                    {tpl.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600">
                  <span>Use This Template</span>
                  <Plus className="w-3.5 h-3.5 group-hover:scale-125 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'blank' && (
        <form onSubmit={handleCreateBlank} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Checklist Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={blankName}
              onChange={(e) => setBlankName(e.target.value)}
              placeholder="e.g. Next.js & Docker Interview Prep"
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={blankType}
                onChange={(e) => setBlankType(e.target.value as ChecklistType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-500"
              >
                <option value="Preparation">Preparation</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Application">Application</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Due Date (Optional)
              </label>
              <input
                type="date"
                value={blankDueDate}
                onChange={(e) => setBlankDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setMode('pick')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Back to Templates
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200"
            >
              Create Checklist
            </button>
          </div>
        </form>
      )}

      {mode === 'custom-template' && (
        <form onSubmit={handleCreateCustomTemplate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Template Name <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={tplName}
              onChange={(e) => setTplName(e.target.value)}
              placeholder="e.g. AWS & Microservices Interview Prep"
              required
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={tplCategory}
                onChange={(e) => setTplCategory(e.target.value as ChecklistType)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-500"
              >
                <option value="Technical">Technical</option>
                <option value="Preparation">Preparation</option>
                <option value="HR">HR</option>
                <option value="Application">Application</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
              <input
                type="text"
                value={tplDesc}
                onChange={(e) => setTplDesc(e.target.value)}
                placeholder="Brief summary of this template"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tasks (One per line)
            </label>
            <textarea
              rows={5}
              value={tplRawItems}
              onChange={(e) => setTplRawItems(e.target.value)}
              placeholder={`Review S3 & CloudFront\nPrepare IAM & VPC talking points\nRevise ECS and Docker compose\nPractice system design drawing`}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setMode('pick')}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Back to Templates
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200"
            >
              Save Template
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
