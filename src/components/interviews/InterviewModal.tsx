import React, { useState, useEffect } from 'react';
import {
  Interview,
  InterviewStage,
  InterviewType,
  InterviewResult,
  PrepStatus,
  JobApplication,
} from '../../types';
import { Modal } from '../common/Modal';
import { StatusBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Calendar,
  Clock,
  Video,
  User,
  ExternalLink,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  MessageSquare,
  Award,
  ArrowRight,
} from 'lucide-react';

interface InterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview | null;
  applications: JobApplication[];
  isNew?: boolean;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
}

export const InterviewModal: React.FC<InterviewModalProps> = ({
  isOpen,
  onClose,
  interview,
  applications,
  isNew = false,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState<Partial<Interview>>({
    company: '',
    role: '',
    applicationId: '',
    interviewDate: new Date().toISOString().split('T')[0],
    interviewTime: '10:00 AM',
    interviewStage: 'Technical',
    interviewType: 'Video',
    interviewer: '',
    meetingLink: '',
    recruiter: '',
    preparationStatus: 'In Progress',
    questionsAsked: '',
    myAnswers: '',
    mistakes: '',
    feedback: '',
    result: 'Upcoming',
    nextRound: '',
    nextAction: '',
    notes: '',
  });

  useEffect(() => {
    if (interview) {
      setFormData(interview);
      setIsEditing(isNew);
    } else {
      setFormData({
        company: '',
        role: '',
        applicationId: '',
        interviewDate: new Date().toISOString().split('T')[0],
        interviewTime: '10:00 AM',
        interviewStage: 'Technical',
        interviewType: 'Video',
        interviewer: '',
        meetingLink: '',
        recruiter: '',
        preparationStatus: 'In Progress',
        questionsAsked: '',
        myAnswers: '',
        mistakes: '',
        feedback: '',
        result: 'Upcoming',
        nextRound: '',
        nextAction: '',
        notes: '',
      });
      setIsEditing(true);
    }
  }, [interview, isNew]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // If application reference changed, auto-populate company & role if blank
    if (name === 'applicationId' && value) {
      const matched = applications.find((a) => a.id === value);
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          applicationId: value,
          company: prev.company || matched.company,
          role: prev.role || matched.jobTitle,
          recruiter: prev.recruiter || matched.recruiterName,
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company?.trim()) {
      alert('Please specify a company name.');
      return;
    }
    if (!formData.role?.trim()) {
      alert('Please specify the role.');
      return;
    }

    onSave(formData);
    if (!isNew) {
      setIsEditing(false);
    } else {
      onClose();
    }
  };

  const stages: InterviewStage[] = [
    'Screening',
    'Technical',
    'Coding',
    'System Design',
    'Managerial',
    'HR',
    'Final Round',
    'Other',
  ];

  const types: InterviewType[] = ['Video', 'Phone', 'In-Person', 'Take-Home'];

  const results: InterviewResult[] = [
    'Upcoming',
    'Completed',
    'Passed',
    'Rejected',
    'Rescheduled',
    'Cancelled',
    'Waiting for Result',
  ];

  const prepStatuses: PrepStatus[] = [
    'Not Started',
    'In Progress',
    'Well Prepared',
    'Completed',
  ];

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
          isNew
            ? 'Schedule Interview'
            : isEditing
            ? `Edit Interview: ${formData.company}`
            : `${formData.company} (${formData.interviewStage} Round)`
        }
        subtitle={isNew ? 'Track interview details and feedback' : formData.role}
        maxWidth="3xl"
      >
        {!isEditing && interview ? (
          /* View Mode */
          <div className="space-y-6">
            {/* Top Bar */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50/70 to-pink-50/40 border border-rose-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <StatusBadge status={interview.result} size="md" />
                <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-rose-100 text-slate-700 font-medium">
                  {interview.interviewStage} Stage
                </span>
                <span className="text-xs px-2.5 py-1 rounded-md bg-white border border-rose-100 text-slate-700 font-medium">
                  {interview.interviewType}
                </span>
              </div>

              {interview.meetingLink && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-rose-200 transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Meeting</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Schedule & People</div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <Calendar className="w-4 h-4 text-rose-500" />
                  <span>{interview.interviewDate} at {interview.interviewTime || 'TBD'}</span>
                </div>
                {interview.interviewer && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Interviewer: {interview.interviewer}</span>
                  </div>
                )}
                {interview.recruiter && (
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recruiter: {interview.recruiter}</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Preparation & Progress</div>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span className="text-slate-400">Prep Status:</span>
                  <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                    {interview.preparationStatus}
                  </span>
                </div>
                {interview.nextRound && (
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span className="text-slate-400">Next Round:</span>
                    <span className="font-medium text-slate-800">{interview.nextRound}</span>
                  </div>
                )}
                {interview.nextAction && (
                  <div className="flex items-start gap-1.5 text-xs text-slate-700 pt-1">
                    <ArrowRight className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>Next: {interview.nextAction}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Questions Asked & Answers */}
            {(interview.questionsAsked || interview.myAnswers) && (
              <div className="p-4 rounded-xl bg-white border border-rose-100/90 shadow-sm space-y-3">
                <div className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-rose-500" />
                  Interview Discussion & Questions
                </div>
                {interview.questionsAsked && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                      Questions Asked:
                    </span>
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {interview.questionsAsked}
                    </p>
                  </div>
                )}
                {interview.myAnswers && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-0.5">
                      My Answers / Solutions:
                    </span>
                    <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {interview.myAnswers}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Mistakes & Feedback */}
            {(interview.mistakes || interview.feedback) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interview.mistakes && (
                  <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                    <div className="text-xs font-bold uppercase text-amber-800 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Mistakes & Areas to Improve
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-1">
                      {interview.mistakes}
                    </p>
                  </div>
                )}
                {interview.feedback && (
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60 space-y-1">
                    <div className="text-xs font-bold uppercase text-emerald-800 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Interviewer / Recruiter Feedback
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line pt-1">
                      {interview.feedback}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {interview.notes && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="text-xs font-semibold uppercase text-slate-400">Additional Notes</div>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                  {interview.notes}
                </p>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-rose-100">
              {onDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Interview</span>
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
          /* Form Mode */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company <span className="text-rose-600">*</span>
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
                  Role Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role || ''}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Full Stack Developer"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link to Application (Optional)
                </label>
                <select
                  name="applicationId"
                  value={formData.applicationId || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  <option value="">-- Standalone Interview --</option>
                  {applications.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.company} ({a.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interview Stage
                </label>
                <select
                  name="interviewStage"
                  value={formData.interviewStage || 'Technical'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  {stages.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  name="interviewDate"
                  value={formData.interviewDate || ''}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
                <input
                  type="text"
                  name="interviewTime"
                  value={formData.interviewTime || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. 11:00 AM"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type</label>
                <select
                  name="interviewType"
                  value={formData.interviewType || 'Video'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  {types.map((tp) => (
                    <option key={tp} value={tp}>
                      {tp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Result / Status
                </label>
                <select
                  name="result"
                  value={formData.result || 'Upcoming'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  {results.map((res) => (
                    <option key={res} value={res}>
                      {res}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preparation Status
                </label>
                <select
                  name="preparationStatus"
                  value={formData.preparationStatus || 'In Progress'}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  {prepStatuses.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink || ''}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interviewer(s)
                </label>
                <input
                  type="text"
                  name="interviewer"
                  value={formData.interviewer || ''}
                  onChange={handleInputChange}
                  placeholder="e.g. Siddharth Mehta (Engineering Lead)"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recruiter</label>
                <input
                  type="text"
                  name="recruiter"
                  value={formData.recruiter || ''}
                  onChange={handleInputChange}
                  placeholder="Recruiter contact"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Questions & Feedback */}
            <div className="pt-2 border-t border-rose-100 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Questions Asked
                </label>
                <textarea
                  name="questionsAsked"
                  rows={2}
                  value={formData.questionsAsked || ''}
                  onChange={handleInputChange}
                  placeholder="What coding questions, system design problems, or behavioral queries were asked?"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  My Answers & Approach
                </label>
                <textarea
                  name="myAnswers"
                  rows={2}
                  value={formData.myAnswers || ''}
                  onChange={handleInputChange}
                  placeholder="How did you solve the problem? What trade-offs did you mention?"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-amber-700 mb-1">
                    Mistakes / What To Review
                  </label>
                  <textarea
                    name="mistakes"
                    rows={2}
                    value={formData.mistakes || ''}
                    onChange={handleInputChange}
                    placeholder="Things I stumbled on or should review..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-700 mb-1">
                    Interviewer Feedback
                  </label>
                  <textarea
                    name="feedback"
                    rows={2}
                    value={formData.feedback || ''}
                    onChange={handleInputChange}
                    placeholder="Feedback provided during or after the call..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Next Round (if applicable)
                  </label>
                  <input
                    type="text"
                    name="nextRound"
                    value={formData.nextRound || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Managerial & Cultural Fit"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Next Action
                  </label>
                  <input
                    type="text"
                    name="nextAction"
                    value={formData.nextAction || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Send thank you note; revise BullMQ"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  placeholder="Additional notes..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            {/* Footer Buttons */}
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
                <span>Save Interview</span>
              </button>
            </div>
          </form>
        )}
      </Modal>

      {interview && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={() => {
            if (onDelete) onDelete(interview.id);
            onClose();
          }}
          title="Delete Interview Record"
          message={`Are you sure you want to delete the interview record for ${interview.company}?`}
          confirmText="Delete Interview"
          isDestructive={true}
        />
      )}
    </>
  );
};
