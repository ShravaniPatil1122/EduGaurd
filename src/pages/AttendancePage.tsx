import React, { useState } from 'react';
import {
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Save,
  Check,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../services/store';

export const AttendancePage: React.FC = () => {
  const { attendance, updateAttendance, showToast } = useAppStore();
  const [selectedDate, setSelectedDate] = useState('2025-10-20');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

  const filteredRecords = attendance.filter((rec) => {
    if (selectedClassFilter === 'All') return true;
    return rec.class.includes(selectedClassFilter);
  });

  const presentCount = filteredRecords.filter((r) => r.status === 'Present').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'Absent').length;
  const lateCount = filteredRecords.filter((r) => r.status === 'Late').length;
  const total = filteredRecords.length;
  const rate = total > 0 ? Math.round(((presentCount + lateCount * 0.5) / total) * 100) : 100;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
            Daily Attendance & Missed-Class Registry
          </h1>
          <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
            Record student presence, track absence patterns, and trigger automated catch-up plans.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              showToast('Date Updated', `Attendance sheet updated for ${e.target.value}`);
            }}
            className="px-3 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary shadow-subtle focus:outline-none focus:border-brand-emerald"
          />

          <button
            onClick={() => showToast('Attendance Submitted', 'Class attendance synced with school database.')}
            className="px-4 py-2 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Register</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
              Present Today
            </div>
            <div className="text-2xl font-bold text-brand-emerald mt-1">{presentCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-emerald flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
              Absent Today
            </div>
            <div className="text-2xl font-bold text-brand-danger mt-1">{absentCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-danger flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
              Late Arrivals
            </div>
            <div className="text-2xl font-bold text-brand-warning mt-1">{lateCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-warning flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
              Attendance Rate
            </div>
            <div className="text-2xl font-bold text-brand-info mt-1">{rate}%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-brand-info flex items-center justify-center">
            <ClipboardCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-brand-border rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-brand-borderLight flex items-center justify-between">
          <h2 className="text-sm font-bold text-brand-textPrimary uppercase tracking-wider">
            Student Attendance Sheet
          </h2>

          <div className="relative w-44">
            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-1.5 bg-brand-cyanBg/50 border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald cursor-pointer"
            >
              <option value="All">All Sections</option>
              <option value="10-A">Class 10-A</option>
              <option value="10-B">Class 10-B</option>
              <option value="9-A">Class 9-A</option>
              <option value="11-B">Class 11-B</option>
              <option value="12-A">Class 12-A</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-cyanBg/60 text-brand-textSecondary font-semibold uppercase text-[10px] tracking-wider border-b border-brand-border">
              <tr>
                <th className="px-5 py-3.5">Roll No</th>
                <th className="px-4 py-3.5">Student</th>
                <th className="px-4 py-3.5">Class</th>
                <th className="px-4 py-3.5">Reason / Remark</th>
                <th className="px-5 py-3.5 text-right">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-brand-cyanBg/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-brand-textSecondary">#{rec.rollNo}</td>
                  <td className="px-4 py-3.5 font-bold text-brand-textPrimary">{rec.studentName}</td>
                  <td className="px-4 py-3.5 text-brand-textSecondary">{rec.class}</td>
                  <td className="px-4 py-3.5 text-brand-textSecondary italic">
                    {rec.reason || '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="inline-flex gap-1 bg-brand-cyanBg/60 p-1 rounded-xl border border-brand-border">
                      <button
                        onClick={() => updateAttendance(rec.id, 'Present')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          rec.status === 'Present'
                            ? 'bg-brand-emerald text-white shadow-xs'
                            : 'text-brand-textSecondary hover:text-brand-textPrimary'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => updateAttendance(rec.id, 'Late')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          rec.status === 'Late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-brand-textSecondary hover:text-brand-textPrimary'
                        }`}
                      >
                        Late
                      </button>
                      <button
                        onClick={() => updateAttendance(rec.id, 'Absent')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          rec.status === 'Absent'
                            ? 'bg-rose-500 text-white shadow-xs'
                            : 'text-brand-textSecondary hover:text-brand-textPrimary'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
