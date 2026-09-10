import React, { useState, useEffect } from 'react';
import {
  JobApplication,
  Role,
  ApplicationStatus,
  AppliedThrough,
  LocationType,
  Priority,
} from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  Linkedin,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: JobApplication | null;
  roles: Role[];
  initialRoleId?: string;
  isNew?: boolean;
  onSave: (app: any) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: ApplicationStatus) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  application,
  roles,
  initialRoleId,
  isNew = false,
  onSave,
  onDelete,
  onStatusChange,
}) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    company: '',
    jobTitle: '',
    roleId: initialRoleId || (roles[0]?.id ?? ''),
    location: '',
    locationType: 'Hybrid',
    appliedDate: new Date().toISOString().split('T')[0],
    appliedThrough: 'LinkedIn',
    jobUrl: '',
    status: 'Applied',
    interviewDate: '',
    interviewStage: '',
    recruiterName: '',
    recruiterContact: '',
    recruiterLinkedIn: '',
    salary: '',
    priority: 'High',
    nextAction: '',
    followUpDate: '',
    notes: '',
  });

  useEffect(() => {
    if (application) {
      setFormData(application);
      setIsEditing(isNew);
    } else {
      setFormData({
        company: '',
        jobTitle: '',
        roleId: initialRoleId || (roles[0]?.id ?? ''),
        location: '',
        locationType: 'Hybrid',
        appliedDate: new Date().toISOString().split('T')[0],
        appliedThrough: 'LinkedIn',
        jobUrl: '',
        status: 'Applied',
        interviewDate: '',
        interviewStage: '',
        recruiterName: '',
        recruiterContact: '',
        recruiterLinkedIn: '',
        salary: '',
        priority: 'High',
        nextAction: '',
        followUpDate: '',
        notes: '',
      });
      setIsEditing(true);
    }
  }, [application, isNew, initialRoleId, roles]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickStatusChange = (newStatus: ApplicationStatus) => {
    if (application && onStatusChange) {
      onStatusChange(application.id, newStatus);
    }
    setFormData((prev) => ({ ...prev, status: newStatus }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company?.trim()) {
      alert('Please enter a company name.');
      return;
    }
    if (!formData.roleId) {
      alert('Please select a role.');
      return;
    }

    onSave(formData);
    if (!isNew) {
      setIsEditing(false);
    } else {
      onClose();
    }
  };

  const currentRole = roles.find((r) => r.id === (formData.roleId || application?.roleId));

  const statusOptions: ApplicationStatus[] = [
    'Saved',
    'Applied',
    'Interview Call',
    'Interview',
    'Final Round',
    'Offer',
    'Rejected',
    'Withdrawn',
    'No Response',
  ];

  const appliedThroughOptions: AppliedThrough[] = [
    'LinkedIn',
    'Naukri',
    'Indeed',
    'Company Website',
    'Referral',
    'Recruiter',
    'Other',
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          isNew
            ? 'Add Job Application'
            : isEditing
            ? `Edit Application: ${formData.company}`
            : (formData.company || 'Application Details')
        }
        subtitle={isNew ? 'Track a new opportunity' : `${formData.jobTitle || 'Role'} • ${currentRole?.name || 'General'}`}
        maxWidth="3xl"
      >
        {/* Quick Status Bar when viewing existing application */}
        {!isNew && !isEditing && application && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-rose-50/70 to-pink-50/40 border border-rose-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Status:
              </span>
              <StatusBadge status={application.status} size="md" />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">Update Status:</label>
              <select
                value={application.status}
                onChange={(e) => handleQuickStatusChange(e.target.value as ApplicationStatus)}
                className="text-xs font-medium bg-white border border-rose-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-700"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* View Mode */}
        {!isEditing && application ? (
          <div className="space-y-6">
            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Position Details</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Building className="w-4 h-4 text-rose-500" />
                  <span>{application.company}</span>
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {application.jobTitle || 'No title specified'} ({currentRole?.name})
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {application.location} • {application.locationType}
                  </span>
                </div>
                {application.salary && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{application.salary}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Application Info</div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="text-slate-400">Applied Date:</span>
                  <span className="font-medium">{application.appliedDate || 'Not specified'}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="text-slate-400">Applied Via:</span>
                  <span className="font-medium px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                    {application.appliedThrough}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="text-slate-400">Priority:</span>
                  <PriorityBadge priority={application.priority} />
                </div>
                {application.jobUrl && (
                  <div className="pt-1">
                    <a
                      href={application.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Original Job Posting
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Recruiter Details */}
            {(application.recruiterName || application.recruiterContact || application.recruiterLinkedIn) && (
              <div className="p-4 rounded-xl bg-white border border-rose-100/80 space-y-2 shadow-sm">
                <div className="text-xs font-semibold uppercase text-slate-400">Recruiter Contact</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {application.recruiterName && (
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <User className="w-3.5 h-3.5 text-rose-500" />
                      <span className="font-medium">{application.recruiterName}</span>
                    </div>
                  )}
                  {application.recruiterContact && (
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-rose-500" />
                      <span>{application.recruiterContact}</span>
                    </div>
                  )}
                  {application.recruiterLinkedIn && (
                    <div className="flex items-center gap-2 text-xs">
                      <Linkedin className="w-3.5 h-3.5 text-sky-600" />
                      <a
                        href={application.recruiterLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-600 hover:underline truncate"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Interview & Next Actions */}
            {(application.interviewDate || application.nextAction || application.followUpDate) && (
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100 space-y-2">
                <div className="text-xs font-semibold uppercase text-rose-800">Interview & Next Action</div>
                {application.interviewDate && (
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Calendar className="w-4 h-4 text-rose-600" />
                    <span>
                      Interview Date: <strong>{application.interviewDate}</strong>
                      {application.interviewStage ? ` (${application.interviewStage} Round)` : ''}
                    </span>
                  </div>
                )}
                {application.nextAction && (
                  <div className="flex items-start gap-2 text-xs text-slate-700 pt-1">
                    <ArrowRight className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Next Action: </span>
                      {application.nextAction}
                    </div>
                  </div>
                )}
                {application.followUpDate && (
                  <div className="flex items-center gap-2 text-xs text-amber-700 pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Follow-up scheduled for: {application.followUpDate}</span>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {application.notes && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-xs font-semibold uppercase text-slate-400">Notes & History</div>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                  {application.notes}
                </p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-rose-100">
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Application</span>
                </button>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Form Mode (Add or Edit) */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. BE Engineer"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Category <span className="text-rose-600">*</span>
                </label>
                <select
                  name="roleId"
                  value={formData.roleId || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Full Stack Developer"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Location & Work Mode
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Chennai, Bangalore"
                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                  <select
                    name="locationType"
                    value={formData.locationType || 'Hybrid'}
                    onChange={handleInputChange}
                    className="w-28 px-2 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || 'Applied'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applied Through
                </label>
                <select
                  name="appliedThrough"
                  value={formData.appliedThrough || 'LinkedIn'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  {appliedThroughOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applied Date
                </label>
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority || 'High'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  <option value="High">🔥 High</option>
                  <option value="Medium">⚡ Medium</option>
                  <option value="Low">🌱 Low</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Salary / Package
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. ₹12 - 16 LPA"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job URL / Portal Link
                </label>
                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Recruiter Details Group */}
            <div className="pt-2 border-t border-rose-100">
              <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Recruiter Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  name="recruiterName"
                  value={formData.recruiterName || ''}
                  onChange={handleInputChange}
                  placeholder="Recruiter Name"
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
                <input
                  type="text"
                  name="recruiterContact"
                  value={formData.recruiterContact || ''}
                  onChange={handleInputChange}
                  placeholder="Phone or Email"
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
                <input
                  type="url"
                  name="recruiterLinkedIn"
                  value={formData.recruiterLinkedIn || ''}
                  onChange={handleInputChange}
                  placeholder="LinkedIn Profile URL"
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Interview & Next Action */}
            <div className="pt-2 border-t border-rose-100">
              <h4 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Interview & Follow-up Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Interview Date</label>
                  <input
                    type="date"
                    name="interviewDate"
                    value={formData.interviewDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Interview Stage</label>
                  <input
                    type="text"
                    name="interviewStage"
                    value={formData.interviewStage || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Technical, Coding"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    name="followUpDate"
                    value={formData.followUpDate || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-[11px] text-slate-500 mb-1">Next Action Required</label>
                <input
                  type="text"
                  name="nextAction"
                  value={formData.nextAction || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Revise Redis and prepare 3 project questions"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="pt-2 border-t border-rose-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
              <textarea
                name="notes"
                rows={3}
                value={formData.notes || ''}
                onChange={handleInputChange}
                placeholder="Key talking points, salary negotiation notes, company impressions..."
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-rose-100">
              <button
                type="button"
                onClick={() => {
                  if (isNew) onClose();
                  else setIsEditing(false);
                }}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm shadow-rose-200 hover:shadow transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save Application</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation */}
      {application && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            if (onDelete) onDelete(application.id);
            onClose();
          }}
          title="Delete Job Application"
          message={`Are you sure you want to permanently delete your application record for "${application.company}"? This cannot be undone.`}
          confirmText="Delete Application"
          isDestructive={true}
        />
      )}
    </>
  );
};
