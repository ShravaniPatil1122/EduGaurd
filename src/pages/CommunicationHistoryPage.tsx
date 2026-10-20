import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  Users,
  Clock,
  Calendar,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  CalendarCheck,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../services/store';

export const CommunicationHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { parentRecords, scheduleMeeting, showToast } = useAppStore();

  const [dateRange, setDateRange] = useState('Last 30 days');
  const [selectedMeetingSlot, setSelectedMeetingSlot] = useState('Mon 4 PM');
  const [targetStudentForMeeting, setTargetStudentForMeeting] = useState('Rohan Mehta');

  const slots = ['Mon 4 PM', 'Tue 5 PM', 'Wed 4 PM'];

  const handleSchedule = () => {
    scheduleMeeting('rohan-mehta', targetStudentForMeeting, selectedMeetingSlot);
  };

  const handleDraftAllSuggestions = () => {
    showToast(
      'Drafts Generated',
      'Created 5 automated check-in drafts for at-risk student parents.',
      'success'
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => navigate('/parent-connect')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-textSecondary hover:text-brand-emerald mb-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Parent Assistant</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
            Communication History & Insights
          </h1>
        </div>

        {/* Date Range Selector */}
        <div className="relative self-start sm:self-auto">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald shadow-subtle cursor-pointer"
          >
            <option value="Last 7 days">Last 7 days</option>
            <option value="Last 30 days">Last 30 days</option>
            <option value="This Quarter">This Quarter</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary absolute right-2.5 top-3 pointer-events-none" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Messages Sent */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle">
          <div className="text-[11px] text-brand-textSecondary font-semibold uppercase tracking-wider">
            Messages Sent
          </div>
          <div className="text-2xl font-bold text-brand-textPrimary mt-1">64</div>
        </div>

        {/* Parents Replied */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle">
          <div className="text-[11px] text-brand-textSecondary font-semibold uppercase tracking-wider">
            Parents Replied
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-brand-emerald">46</span>
            <span className="text-xs font-semibold text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded-full">
              64%
            </span>
          </div>
        </div>

        {/* Awaiting Reply */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle">
          <div className="text-[11px] text-brand-textSecondary font-semibold uppercase tracking-wider">
            Awaiting Reply
          </div>
          <div className="text-2xl font-bold text-brand-warning mt-1">17</div>
        </div>

        {/* Meetings Booked */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle">
          <div className="text-[11px] text-brand-textSecondary font-semibold uppercase tracking-wider">
            Meetings Booked
          </div>
          <div className="text-2xl font-bold text-brand-info mt-1">6</div>
        </div>
      </div>

      {/* Main Grid: Recent Messages Table (Span 8) & AI Suggestions / Meeting Scheduler (Span 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================== */}
        {/* RECENT MESSAGES TABLE (lg:col-span-8) */}
        {/* ============================================================== */}
        <div className="lg:col-span-8 bg-white border border-brand-border rounded-2xl shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-brand-borderLight">
            <h2 className="text-sm font-bold text-brand-textPrimary uppercase tracking-wider">
              Recent Messages
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-cyanBg/60 text-brand-textSecondary font-semibold uppercase text-[10px] tracking-wider border-b border-brand-border">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Message Type</th>
                  <th className="px-4 py-3.5">Channel</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderLight">
                {parentRecords.map((rec) => {
                  let statusBg = 'bg-gray-100 text-gray-700';
                  if (rec.status === 'Sent') statusBg = 'bg-amber-50 text-amber-800 border border-amber-200';
                  if (rec.status === 'Replied') statusBg = 'bg-emerald-50 text-emerald-800 border border-emerald-200';
                  if (rec.status === 'Read') statusBg = 'bg-blue-50 text-blue-800 border border-blue-200';
                  if (rec.status === 'Booked') statusBg = 'bg-teal-50 text-teal-800 border border-teal-200';
                  if (rec.status === 'No reply') statusBg = 'bg-rose-50 text-rose-800 border border-rose-200';

                  return (
                    <tr key={rec.id} className="hover:bg-brand-cyanBg/30 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-brand-textPrimary whitespace-nowrap">
                        {rec.studentName}
                      </td>
                      <td className="px-4 py-3.5 text-brand-textSecondary">{rec.messageType}</td>
                      <td className="px-4 py-3.5 font-medium text-brand-dark">{rec.channel}</td>
                      <td className="px-4 py-3.5 text-brand-textSecondary">{rec.date}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: AI SUGGESTIONS & MEETING SCHEDULER (lg:col-span-4) */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Suggestions Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3.5">
            <div className="flex items-center gap-2 text-brand-emerald font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>AI Suggestions</span>
            </div>

            <ul className="space-y-2 text-xs text-brand-textSecondary">
              <li className="flex items-start gap-2 bg-brand-cyanBg/40 p-2.5 rounded-xl border border-brand-border">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-1.5 shrink-0" />
                <span>5 parents of at-risk students have not been contacted this month.</span>
              </li>
              <li className="flex items-start gap-2 bg-brand-cyanBg/40 p-2.5 rounded-xl border border-brand-border">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-warning mt-1.5 shrink-0" />
                <span>Karan Verma's parent has not replied. Try a phone call.</span>
              </li>
              <li className="flex items-start gap-2 bg-brand-cyanBg/40 p-2.5 rounded-xl border border-brand-border">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-info mt-1.5 shrink-0" />
                <span>Send appreciation to 3 improving students.</span>
              </li>
            </ul>

            <button
              onClick={handleDraftAllSuggestions}
              className="w-full py-2.5 px-4 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              Draft All Messages
            </button>
          </div>

          {/* Schedule Parent Meeting Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3.5">
            <div className="flex items-center gap-2 text-brand-dark font-bold text-xs uppercase tracking-wider">
              <CalendarCheck className="w-4 h-4 text-brand-emerald" />
              <span>Schedule Parent Meeting</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-brand-textSecondary mb-1.5">
                Target Student
              </label>
              <input
                type="text"
                value={targetStudentForMeeting}
                onChange={(e) => setTargetStudentForMeeting(e.target.value)}
                className="w-full px-3 py-1.5 bg-brand-cyanBg/50 border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-brand-textSecondary mb-1.5">
                Select Time Slot
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {slots.map((slot) => {
                  const isSelected = selectedMeetingSlot === slot;
                  return (
                    <button
                      key={slot}
                      onClick={() => setSelectedMeetingSlot(slot)}
                      className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all ${
                        isSelected
                          ? 'bg-brand-emerald text-white shadow-xs'
                          : 'bg-white border border-brand-border text-brand-textSecondary hover:border-brand-emerald'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSchedule}
              className="w-full py-2.5 px-4 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              Send Meeting Invite
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
