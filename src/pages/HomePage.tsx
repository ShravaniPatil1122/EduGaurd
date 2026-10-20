import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users2,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Calendar,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Award
} from 'lucide-react';
import { useAppStore } from '../services/store';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { students, dailyTopics, parentMeetings } = useAppStore();

  const atRiskCount = students.filter((s) => s.riskLevel === 'High').length;
  const improvingCount = students.filter((s) => s.improving).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-dark via-[#004e50] to-brand-emerald rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-xs text-emerald-300 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Term 2025-26 • Class 10 Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, Mrs. Deshmukh
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            EduGuard learning analytics detected <span className="font-bold text-white">8 students</span> with missed foundational topics this week. Early catch-up plans and peer sessions are ready for deployment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => navigate('/daily-learning')}
            className="px-4 py-2.5 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Daily Topics & Catch-up</span>
          </button>
          <button
            onClick={() => navigate('/parent-connect')}
            className="px-4 py-2.5 bg-white text-brand-dark hover:bg-brand-cyanBg rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-brand-emerald" />
            <span>Parent Assistant</span>
          </button>
        </div>
      </div>

      {/* 4 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div
          onClick={() => navigate('/students')}
          className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-brand-emerald/60 cursor-pointer transition-all"
        >
          <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
            Total Enrolled
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-brand-textPrimary mt-1">
            {students.length}
          </div>
          <div className="text-[11px] text-brand-textSecondary mt-1 flex items-center gap-1">
            <span>Across 4 grade levels</span>
          </div>
        </div>

        {/* At Risk Alert */}
        <div
          onClick={() => navigate('/learning-gaps')}
          className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-brand-danger/60 cursor-pointer transition-all"
        >
          <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
            At-Risk Students
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-brand-danger">{atRiskCount}</span>
            <span className="text-xs font-semibold text-brand-danger bg-red-50 px-2 py-0.5 rounded-full">
              Needs Plan
            </span>
          </div>
          <div className="text-[11px] text-brand-danger font-medium mt-1">
            Requires catch-up modules
          </div>
        </div>

        {/* Improving */}
        <div
          onClick={() => navigate('/predictions')}
          className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-brand-emerald/60 cursor-pointer transition-all"
        >
          <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
            Improving Learners
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-brand-emerald">{improvingCount}</span>
            <span className="text-xs font-semibold text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded-full">
              +15% avg
            </span>
          </div>
          <div className="text-[11px] text-brand-textSecondary mt-1">
            Active in peer study circles
          </div>
        </div>

        {/* Attendance Rate */}
        <div
          onClick={() => navigate('/attendance')}
          className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle hover:border-brand-info/60 cursor-pointer transition-all"
        >
          <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
            Today's Attendance
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-brand-info mt-1">92.4%</div>
          <div className="text-[11px] text-brand-textSecondary mt-1">
            3 absent • 1 late recorded
          </div>
        </div>
      </div>

      {/* Grid: Left Column Quick Navigation Modules, Right Column Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Today's Classes & Learning Gaps Overview (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Today's Teaching Schedule */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-brand-textPrimary uppercase tracking-wider">
                Today's Teaching Schedule
              </h2>
              <button
                onClick={() => navigate('/daily-learning')}
                className="text-xs font-semibold text-brand-emerald hover:underline flex items-center gap-1"
              >
                <span>View Daily Learning Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {dailyTopics.slice(0, 2).map((dt) => (
                <div
                  key={dt.id}
                  className="p-3.5 bg-brand-cyanBg/40 border border-brand-border rounded-xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-brand-textPrimary">
                      {dt.class} - {dt.section}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-brand-emerald">
                      {dt.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-brand-dark">{dt.subject}</div>
                  <div className="text-[11px] text-brand-textSecondary truncate">
                    {dt.topics.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div
              onClick={() => navigate('/peer-learning')}
              className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle hover:border-brand-emerald cursor-pointer transition-all space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-brand-emerald flex items-center justify-center">
                <Users2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-brand-textPrimary">Peer Learning Connect</h3>
              <p className="text-[11px] text-brand-textSecondary leading-snug">
                Pair struggling learners with nearby student mentors.
              </p>
            </div>

            <div
              onClick={() => navigate('/learning-gaps')}
              className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle hover:border-brand-emerald cursor-pointer transition-all space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-brand-textPrimary">Learning Gap Diagnostic</h3>
              <p className="text-[11px] text-brand-textSecondary leading-snug">
                Track conceptual weaknesses & 4-step remediation plans.
              </p>
            </div>

            <div
              onClick={() => navigate('/parent-connect')}
              className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle hover:border-brand-emerald cursor-pointer transition-all space-y-2"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-xs text-brand-textPrimary">Parent AI Assistant</h3>
              <p className="text-[11px] text-brand-textSecondary leading-snug">
                Multi-lingual WhatsApp & SMS notification drafts in 1 tap.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Parent Meetings & AI Insights (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Confirmed Parent Meetings */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-brand-textPrimary">
                Upcoming Parent Consultations
              </h3>
              <Calendar className="w-4 h-4 text-brand-emerald" />
            </div>

            <div className="space-y-2.5">
              {parentMeetings.map((m) => (
                <div
                  key={m.id}
                  className="p-3 bg-brand-cyanBg/30 border border-brand-border rounded-xl text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-brand-textPrimary">
                    <span>{m.studentName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-brand-emerald">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-brand-textSecondary">
                    Slot: <span className="font-medium text-brand-dark">{m.slot}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/parent-connect/history')}
              className="w-full py-2 bg-brand-cyanBg hover:bg-brand-borderLight text-brand-dark font-semibold rounded-xl text-xs transition-colors"
            >
              View Full Schedule →
            </button>
          </div>

          {/* Motivational Thought */}
          <div className="p-4 rounded-2xl bg-white border border-brand-border text-xs text-brand-textSecondary space-y-1.5 shadow-subtle">
            <div className="flex items-center gap-1.5 font-bold text-brand-dark">
              <Award className="w-4 h-4 text-brand-emerald" />
              <span>Teaching Highlight</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Targeted support plans generated by EduGuard have helped reduce math learning gaps by 38%
              across Class 10 sections over the last 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
