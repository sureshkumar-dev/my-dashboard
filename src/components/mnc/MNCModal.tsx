import React, { useState, useEffect } from 'react';
import { MNCCompany, MNCStatus, Priority } from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Building2,
  MapPin,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  Globe,
  Briefcase,
} from 'lucide-react';

interface MNCModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: MNCCompany | null;
  isNew?: boolean;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: MNCStatus) => void;
}

export const MNCModal: React.FC<MNCModalProps> = ({
  isOpen,
  onClose,
  company,
  isNew = false,
  onSave,
  onDelete,
  onStatusChange,
}) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    locations: '',
    website: '',
    careersUrl: '',
    targetRoles: '',
    priority: 'High' as 'Top Priority' | 'High' | 'Medium' | 'Low',
    status: 'Target' as MNCStatus,
    notes: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName,
        locations: company.locations.join(', '),
        website: company.website || '',
        careersUrl: company.careersUrl || '',
        targetRoles: company.targetRoles.join(', '),
        priority: company.priority,
        status: company.status,
        notes: company.notes || '',
      });
      setIsEditing(isNew);
    } else {
      setFormData({
        companyName: '',
        locations: '',
        website: '',
        careersUrl: '',
        targetRoles: '',
        priority: 'High',
        status: 'Target',
        notes: '',
      });
      setIsEditing(true);
    }
  }, [company, isNew]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim()) {
      alert('Please provide a company name.');
      return;
    }

    const locationsArray = formData.locations
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    const rolesArray = formData.targetRoles
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    onSave({
      companyName: formData.companyName.trim(),
      locations: locationsArray.length > 0 ? locationsArray : ['Pan India'],
      website: formData.website.trim() || undefined,
      careersUrl: formData.careersUrl.trim() || undefined,
      targetRoles: rolesArray.length > 0 ? rolesArray : ['Software Engineer'],
      priority: formData.priority,
      status: formData.status,
      notes: formData.notes.trim() || undefined,
    });

    if (!isNew) setIsEditing(false);
    else onClose();
  };

  const statuses: MNCStatus[] = [
    'Target',
    'Researching',
    'Ready to Apply',
    'Applied',
    'Interview',
    'Offer',
    'Rejected',
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          isNew
            ? 'Add Target MNC'
            : isEditing
            ? `Edit: ${formData.companyName}`
            : (formData.companyName || 'MNC Company Details')
        }
        subtitle="Independent target company tracking"
        maxWidth="2xl"
      >
        {!isEditing && company ? (
          <div className="space-y-6">
            {/* Header pill */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50/70 to-pink-50/40 border border-rose-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={company.status} size="md" />
                <PriorityBadge priority={company.priority} />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 font-medium">Change Status:</label>
                <select
                  value={company.status}
                  onChange={(e) => {
                    const next = e.target.value as MNCStatus;
                    if (onStatusChange) onStatusChange(company.id, next);
                    setFormData((prev) => ({ ...prev, status: next }));
                  }}
                  className="text-xs font-medium bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-700"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Locations & Roles</div>
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Offices:</strong> {company.locations.join(', ')}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <Briefcase className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>
                    <strong>Target Roles:</strong> {company.targetRoles.join(', ')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2.5">
                <div className="text-xs font-semibold uppercase text-slate-400">Portals & Links</div>
                {company.careersUrl ? (
                  <div>
                    <a
                      href={company.careersUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Official Careers Portal
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No careers URL added</p>
                )}

                {company.website && (
                  <div>
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-rose-600"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Company Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {company.notes && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-xs font-semibold uppercase text-slate-400">Preparation & Notes</div>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                  {company.notes}
                </p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-rose-100">
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete MNC</span>
                </button>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Edit/Add Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Target Company"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Locations (comma separated) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="locations"
                  value={formData.locations}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Bangalore, Hyderabad, Chennai"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-500"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Top Priority">🔥 Top Priority</option>
                  <option value="High">⚡ High</option>
                  <option value="Medium">🌱 Medium</option>
                  <option value="Low">💤 Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Careers Portal URL
                </label>
                <input
                  type="url"
                  name="careersUrl"
                  value={formData.careersUrl}
                  onChange={handleInputChange}
                  placeholder="https://careers.company.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://company.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Roles (comma separated)
              </label>
              <input
                type="text"
                name="targetRoles"
                value={formData.targetRoles}
                onChange={handleInputChange}
                placeholder="e.g. Full Stack Developer, SDE I, Frontend Engineer"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preparation Notes & Strategy
              </label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Key rounds, referral contacts, hiring freeze info, interview rounds pattern..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rose-100">
              <button
                type="button"
                onClick={() => {
                  if (isNew) onClose();
                  else setIsEditing(false);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200"
              >
                <Check className="w-4 h-4" />
                <span>Save MNC Record</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {company && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            if (onDelete) onDelete(company.id);
            onClose();
          }}
          title="Delete Target MNC"
          message={`Are you sure you want to delete ${company.companyName}?`}
          confirmText="Delete"
          isDestructive={true}
        />
      )}
    </>
  );
};
