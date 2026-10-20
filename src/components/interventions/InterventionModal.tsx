import React, { useState } from 'react';
import { X, ShieldAlert, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../services/store';
import { Student, InterventionRecord } from '../../types';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudent?: Student | null;
}

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  defaultStudent,
}) => {
  const { students, recordIntervention } = useAppStore();

  const [studentId, setStudentId] = useState(defaultStudent?.id || students[0]?.id || 'rohan-mehta');
  const [type, setType] = useState<InterventionRecord['type']>('Check-in & Counseling');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().slice(0, 10);
  });
  const [status, setStatus] = useState<InterventionRecord['status']>('In Progress');

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === studentId) || students[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    recordIntervention({
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      date: new Date().toISOString().slice(0, 10),
      type,
      status,
      notes: notes.trim(),
      followUpDate,
      riskScoreBefore: currentStudent.riskScore,
      riskScoreAfter: Math.max(10, currentStudent.riskScore - 6),
      outcome: `Intervention initiated: ${type}. Next evaluation on ${followUpDate}.`,
    });

    setNotes('');
    onClose();
  };

  const interventionTypes: InterventionRecord['type'][] = [
    'Check-in & Counseling',
    'Catch-Up Study Plan',
    'Parent Meeting',
    'Peer Mentor Assignment',
    'Financial/Fee Counseling',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-brand-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-brand-borderLight flex items-center justify-between bg-brand-cyanBg/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-brand-emerald flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-brand-textPrimary">Log Teacher Intervention</h3>
              <p className="text-[11px] text-brand-textSecondary">
                PS 03 Early Warning Response & Student Recovery Record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Student Selector */}
          <div>
            <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-1.5">
              Target Student
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3.5 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} (Class {st.class}-{st.section} • {st.riskScore}% Dropout Risk)
                </option>
              ))}
            </select>
          </div>

          {/* Student Quick Snapshot */}
          <div className="p-3 bg-brand-cyanBg/30 border border-brand-border rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStudent.avatar}
                alt={currentStudent.name}
                className="w-8 h-8 rounded-full object-cover border border-brand-border"
              />
              <div>
                <div className="font-bold text-brand-textPrimary">{currentStudent.name}</div>
                <div className="text-[10px] text-brand-textSecondary">
                  Attendance: {currentStudent.attendanceRate}% • Avg Score: {currentStudent.avgScore}%
                </div>
              </div>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                currentStudent.riskLevel === 'High'
                  ? 'bg-rose-100 text-rose-700'
                  : currentStudent.riskLevel === 'Medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {currentStudent.riskScore}% Dropout Probability
            </span>
          </div>

          {/* Intervention Type */}
          <div>
            <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-1.5">
              Intervention Action
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as InterventionRecord['type'])}
              className="w-full px-3.5 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald"
            >
              {interventionTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Qualitative Notes */}
          <div>
            <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-1.5">
              Counseling Notes & Action Items
            </label>
            <textarea
              required
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Conducted 1-on-1 check-in. Student explained absence was due to illness and family commute issues. Assigned 4-step math recovery module..."
              className="w-full p-3 bg-brand-cyanBg/30 border border-brand-border rounded-xl text-xs text-brand-textPrimary focus:outline-none focus:border-brand-emerald leading-relaxed placeholder:text-brand-textMuted"
            />
          </div>

          {/* Follow-up Date & Status */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-brand-textSecondary mb-1">
                Follow-up Check Date
              </label>
              <input
                type="date"
                required
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-brand-textPrimary font-medium focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block font-semibold text-brand-textSecondary mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InterventionRecord['status'])}
                className="w-full px-3 py-1.5 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-brand-textPrimary font-medium focus:outline-none focus:border-brand-emerald"
              >
                <option value="In Progress">In Progress</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Follow-up Needed">Follow-up Needed</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-brand-borderLight">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-brand-border text-brand-textSecondary rounded-xl text-xs font-semibold hover:bg-brand-cyanBg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record & Update Risk Score</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
