import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ChecklistCard } from '../components/checklists/ChecklistCard';
import { ChecklistDetailModal } from '../components/checklists/ChecklistDetailModal';
import { TemplateSelectorModal } from '../components/checklists/TemplateSelectorModal';
import { DayChecklistSection } from '../components/checklists/DayChecklistSection';
import { DayChecklistModal } from '../components/checklists/DayChecklistModal';
import { Checklist, DayChecklist } from '../types';
import { Plus, CheckSquare, Sparkles, Layers } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export const ChecklistsPage: React.FC = () => {
  const {
    data,
    addChecklist,
    deleteChecklist,
    toggleChecklistItem,
    addChecklistItem,
    deleteChecklistItem,
    updateChecklistItem,
    createChecklistFromTemplate,
    addTemplate,
    addDayChecklist,
    updateDayChecklist,
    deleteDayChecklist,
    toggleDayTask,
    addDayTask,
  } = useDashboard();

  // Modals state
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingDayChecklist, setEditingDayChecklist] = useState<DayChecklist | null>(null);
  const [isDayChecklistModalOpen, setIsDayChecklistModalOpen] = useState(false);

  // When an item inside a checklist is updated, keep selectedChecklist in sync
  const currentActiveChecklist = selectedChecklist
    ? data.checklists.find((c) => c.id === selectedChecklist.id) || null
    : null;

  return (
    <div className="space-y-10 pb-12">
      {/* SECTION 1: Standard & Reusable Checklists */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-rose-100/90 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Preparation & Application Checklists
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-semibold">
                {data.checklists.length}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Systematic pre-interview readiness, technical reviews, and company research lists
            </p>
          </div>

          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm shadow-rose-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Checklist / Template</span>
          </button>
        </div>

        {/* Checklists Grid */}
        {data.checklists.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="No Checklists Active"
            description="Create your first checklist from our curated MERN interview templates or create your own custom tasks."
            actionText="Browse Checklist Templates"
            onAction={() => setIsTemplateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.checklists.map((chk) => (
              <ChecklistCard
                key={chk.id}
                checklist={chk}
                onClick={(c) => setSelectedChecklist(c)}
                onDelete={(id) => deleteChecklist(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Custom Day Checklists */}
      <div className="pt-4 border-t border-rose-100/80">
        <DayChecklistSection
          dayChecklists={data.dayChecklists}
          onToggleTask={toggleDayTask}
          onAddTask={addDayTask}
          onDeleteDayChecklist={deleteDayChecklist}
          onEditDayChecklist={(day) => {
            setEditingDayChecklist(day);
            setIsDayChecklistModalOpen(true);
          }}
          onCreateNew={() => {
            setEditingDayChecklist(null);
            setIsDayChecklistModalOpen(true);
          }}
        />
      </div>

      {/* Checklist Detail Modal */}
      {currentActiveChecklist && (
        <ChecklistDetailModal
          isOpen={true}
          onClose={() => setSelectedChecklist(null)}
          checklist={currentActiveChecklist}
          onToggleItem={toggleChecklistItem}
          onAddItem={addChecklistItem}
          onDeleteItem={deleteChecklistItem}
          onUpdateItem={updateChecklistItem}
          onDeleteChecklist={(id) => {
            deleteChecklist(id);
            setSelectedChecklist(null);
          }}
        />
      )}

      {/* Template Selector Modal */}
      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        templates={data.checklistTemplates}
        onInstantiateTemplate={(tplId, customName) => {
          const created = createChecklistFromTemplate(tplId, customName);
          if (created) setSelectedChecklist(created);
        }}
        onCreateTemplate={(tpl) => addTemplate(tpl)}
        onCreateBlankChecklist={(name, type, dueDate) => {
          const created = addChecklist({
            name,
            type,
            dueDate,
            items: [],
          });
          setSelectedChecklist(created);
        }}
      />

      {/* Day Checklist Modal */}
      {isDayChecklistModalOpen && (
        <DayChecklistModal
          isOpen={true}
          onClose={() => setIsDayChecklistModalOpen(false)}
          dayChecklist={editingDayChecklist}
          onSave={(dayData) => {
            if (editingDayChecklist) {
              updateDayChecklist(editingDayChecklist.id, dayData);
            } else {
              addDayChecklist(dayData);
            }
          }}
        />
      )}
    </div>
  );
};
