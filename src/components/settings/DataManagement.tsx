import React, { useState, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Download,
  Upload,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  FileJson,
} from 'lucide-react';

export const DataManagement: React.FC = () => {
  const { data, exportData, importData, clearAll, resetToDefault, showToast } = useDashboard();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [importPreview, setImportPreview] = useState<any | null>(null);
  const [rawImportString, setRawImportString] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Export JSON
  const handleExport = () => {
    try {
      const json = exportData();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `careerhub-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Export successful', 'Downloaded full dashboard JSON backup');
    } catch (e: any) {
      showToast('Export failed', e?.message, 'error');
    }
  };

  // 2. Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Basic verification
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('Invalid JSON structure');
        }

        setRawImportString(text);
        setImportPreview({
          roles: Array.isArray(parsed.roles) ? parsed.roles.length : 0,
          applications: Array.isArray(parsed.applications) ? parsed.applications.length : 0,
          interviews: Array.isArray(parsed.interviews) ? parsed.interviews.length : 0,
          checklists: Array.isArray(parsed.checklists) ? parsed.checklists.length : 0,
          dayChecklists: Array.isArray(parsed.dayChecklists) ? parsed.dayChecklists.length : 0,
          mncCompanies: Array.isArray(parsed.mncCompanies) ? parsed.mncCompanies.length : 0,
          goals: Array.isArray(parsed.goals) ? parsed.goals.length : 0,
          lastUpdated: parsed.lastUpdated || 'Unknown',
        });
      } catch (err: any) {
        showToast('Invalid backup file', err?.message || 'Cannot parse JSON', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 3. Confirm import execution
  const executeImport = () => {
    if (!rawImportString) return;
    const res = importData(rawImportString, importMode);
    if (res.success) {
      setImportPreview(null);
      setRawImportString(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-5 rounded-2xl bg-white border border-rose-100/90 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base">Persistent Browser Storage</h3>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            All your job applications, interviews, checklists, MNCs, and goals are stored in your browser's persistent <span className="font-mono text-rose-600">localStorage</span> (<span className="font-mono text-xs">job_dashboard_data_v1</span>). It safely survives page reloads, browser restarts, and system reboots.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
              {data.applications.length} Applications
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {data.interviews.length} Interviews
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {data.checklists.length} Checklists
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {data.dayChecklists.length} Day Plans
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {data.mncCompanies.length} MNCs
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {data.goals.length} Goals
            </span>
          </div>
        </div>
      </div>

      {/* Export & Import Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Card */}
        <div className="p-5 rounded-2xl bg-white border border-rose-100/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Export Complete Backup</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Download a complete JSON snapshot containing every application, interview round, checklist item, notes, and custom goal.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-rose-200 hover:shadow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Backup</span>
          </button>
        </div>

        {/* Import Card */}
        <div className="p-5 rounded-2xl bg-white border border-rose-100/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Upload className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Import from Backup</h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Upload a previously exported <span className="font-mono">.json</span> file. Data will be safely verified before applying.
            </p>
          </div>

          <input
            type="file"
            accept=".json,application/json"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-semibold transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Select Backup File (.json)</span>
          </button>
        </div>
      </div>

      {/* Import Verification Preview Modal/Box */}
      {importPreview && (
        <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 shadow-sm animate-fadeIn space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-sky-600" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Backup Verified & Ready to Import</h4>
                <p className="text-xs text-slate-500">File exported on: {importPreview.lastUpdated}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setImportPreview(null);
                setRawImportString(null);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-white rounded-lg border border-sky-100">
              <span className="text-slate-400 block text-[10px]">Roles</span>
              <span className="font-bold text-slate-800">{importPreview.roles}</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-sky-100">
              <span className="text-slate-400 block text-[10px]">Applications</span>
              <span className="font-bold text-slate-800">{importPreview.applications}</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-sky-100">
              <span className="text-slate-400 block text-[10px]">Interviews</span>
              <span className="font-bold text-slate-800">{importPreview.interviews}</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-sky-100">
              <span className="text-slate-400 block text-[10px]">Checklists</span>
              <span className="font-bold text-slate-800">{importPreview.checklists}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-4 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="font-medium text-slate-700">Replace current data</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span className="font-medium text-slate-700">Merge with existing</span>
              </label>
            </div>

            <button
              onClick={executeImport}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              Confirm Import
            </button>
          </div>
        </div>
      )}

      {/* Maintenance & Dangerous Actions */}
      <div className="p-5 rounded-2xl bg-white border border-rose-100/90 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-800 text-sm">Storage Reset & Maintenance</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between">
            <div>
              <span className="font-semibold text-xs text-slate-800 block mb-1">
                Restore Sample MERN Data
              </span>
              <p className="text-[11px] text-slate-500 mb-3">
                Reload the default curated sample dataset tailored to your Full Stack (MERN) developer profile.
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 self-start transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Data</span>
            </button>
          </div>

          <div className="p-4 rounded-xl border border-red-200 bg-red-50/30 flex flex-col justify-between">
            <div>
              <span className="font-semibold text-xs text-red-800 block mb-1">
                Wipe All Dashboard Data
              </span>
              <p className="text-[11px] text-red-600/80 mb-3">
                Permanently erase all stored applications, interviews, checklists, and goals. Requires text confirmation.
              </p>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 self-start transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Clear Everything</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearAll}
        title="Wipe Entire Local Storage"
        message="This action will delete every single application, interview, checklist, and goal record from your browser storage. You cannot undo this without a backup."
        confirmText="Erase All Data"
        requireTypingWord="CONFIRM"
        isDestructive={true}
      />

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetToDefault}
        title="Reset to Sample MERN Data"
        message="This will replace current entries with the default sample MERN stack application tracking data."
        confirmText="Reset Now"
        isDestructive={false}
      />
    </div>
  );
};
