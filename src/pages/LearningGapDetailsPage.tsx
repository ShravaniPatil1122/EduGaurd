import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertCircle,
  Clock,
  BookOpen,
  Users2,
  Sparkles,
  HelpCircle,
  FileCheck,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { ROHAN_MISSED_TOPIC_DETAILS } from '../data/mockData';

export const LearningGapDetailsPage: React.FC = () => {
  const { studentId = 'rohan-mehta' } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { students, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'Missed Topics' | 'Quiz Performance' | 'Support Plan'>('Missed Topics');

  const student = students.find((s) => s.id === studentId) || students[0];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/learning-gaps')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-textSecondary hover:text-brand-emerald mb-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Gaps</span>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
          Learning Gap Details
        </h1>
      </div>

      {/* Student Profile Card with Risk Badge */}
      <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-brand-border"
          />
          <div>
            <h2 className="text-base font-bold text-brand-textPrimary">{student.name}</h2>
            <div className="text-xs text-brand-textSecondary">
              Class {student.class} • Roll No: {student.rollNo}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-bold ${
              student.riskLevel === 'High'
                ? 'bg-rose-100 text-rose-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {student.riskLevel} Risk
          </span>

          <button
            onClick={() => navigate(`/learning-gaps/student/${student.id}/support`)}
            className="px-3.5 py-1.5 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Targeted Support Plan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-border">
        {(['Missed Topics', 'Quiz Performance', 'Support Plan'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-xs font-semibold transition-all relative ${
              activeTab === tab
                ? 'text-brand-emerald'
                : 'text-brand-textSecondary hover:text-brand-textPrimary'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-emerald rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Main Tab Content */}
      {activeTab === 'Missed Topics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          {/* Left Column: Missed Topics List */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-brand-textPrimary uppercase tracking-wider">
              Missed Topics
            </h3>

            <div className="divide-y divide-brand-borderLight">
              {ROHAN_MISSED_TOPIC_DETAILS.map((topic) => (
                <div
                  key={topic.id}
                  className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0"
                >
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-brand-textPrimary">
                      {topic.name}
                    </h4>
                    <div className="text-[11px] text-brand-textSecondary mt-0.5">
                      Last activity: {topic.lastActivity}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      topic.status === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : topic.status === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {topic.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Recommended Support Actions */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-brand-textPrimary uppercase tracking-wider">
              Recommended Support
            </h3>

            <div className="space-y-3">
              {/* Option 1 */}
              <div className="p-3.5 rounded-xl border border-brand-borderLight hover:border-brand-emerald/50 bg-brand-cyanBg/20 flex items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-brand-emerald flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-brand-textPrimary">
                      Personalized study plan
                    </div>
                    <div className="text-[11px] text-brand-textSecondary">Focus on weak topics</div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/learning-gaps/student/${student.id}/support`)}
                  className="px-3 py-1.5 bg-brand-emerald text-white rounded-lg text-xs font-semibold hover:bg-brand-emeraldHover"
                >
                  Open Plan
                </button>
              </div>

              {/* Option 2 */}
              <div className="p-3.5 rounded-xl border border-brand-borderLight hover:border-brand-emerald/50 bg-brand-cyanBg/20 flex items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-brand-info flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-brand-textPrimary">
                      Additional practice questions
                    </div>
                    <div className="text-[11px] text-brand-textSecondary">
                      Weekly step-by-step lessons
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Practice Pack Loaded', '15 quadratic factorization questions queued.')}
                  className="px-3 py-1.5 bg-white border border-brand-border text-brand-dark rounded-lg text-xs font-semibold hover:border-brand-emerald"
                >
                  Practice
                </button>
              </div>

              {/* Option 3 */}
              <div className="p-3.5 rounded-xl border border-brand-borderLight hover:border-brand-emerald/50 bg-brand-cyanBg/20 flex items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-brand-textPrimary">Teacher support</div>
                    <div className="text-[11px] text-brand-textSecondary">
                      1-on-1 scheduled office hours
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => showToast('Consultation Booked', 'Added to teacher zero-period doubt roster.')}
                  className="px-3 py-1.5 bg-white border border-brand-border text-brand-dark rounded-lg text-xs font-semibold hover:border-brand-emerald"
                >
                  Schedule
                </button>
              </div>

              {/* Option 4 */}
              <div className="p-3.5 rounded-xl border border-brand-borderLight hover:border-brand-emerald/50 bg-brand-cyanBg/20 flex items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-brand-textPrimary">Peer learning</div>
                    <div className="text-[11px] text-brand-textSecondary">
                      Find a suitable study group
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/peer-learning')}
                  className="px-3 py-1.5 bg-brand-emerald text-white rounded-lg text-xs font-semibold hover:bg-brand-emeraldHover"
                >
                  Find Partners
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Performance Tab */}
      {activeTab === 'Quiz Performance' && (
        <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
          <h3 className="font-bold text-sm text-brand-textPrimary uppercase tracking-wider">
            Diagnostic Assessment History
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-brand-cyanBg/40 border border-brand-border rounded-xl">
              <div className="text-xs text-brand-textSecondary">Quadratic Equations Quiz</div>
              <div className="text-xl font-bold text-brand-danger mt-1">42%</div>
              <div className="text-[11px] text-brand-textSecondary mt-1">Struggles with factoring negative roots</div>
            </div>
            <div className="p-4 bg-brand-cyanBg/40 border border-brand-border rounded-xl">
              <div className="text-xs text-brand-textSecondary">Linear Equations Mid-Term</div>
              <div className="text-xl font-bold text-brand-warning mt-1">58%</div>
              <div className="text-[11px] text-brand-textSecondary mt-1">Good graphical plots, needs algebra speed</div>
            </div>
            <div className="p-4 bg-brand-cyanBg/40 border border-brand-border rounded-xl">
              <div className="text-xs text-brand-textSecondary">Chemical Reactions Unit</div>
              <div className="text-xl font-bold text-brand-emerald mt-1">74%</div>
              <div className="text-[11px] text-brand-textSecondary mt-1">Solid grasp of balanced equations</div>
            </div>
          </div>
        </div>
      )}

      {/* Support Plan Tab */}
      {activeTab === 'Support Plan' && (
        <div className="bg-white border border-brand-border rounded-2xl p-6 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-brand-emerald mx-auto" />
          <h3 className="font-bold text-base text-brand-textPrimary">Weekly Remediation Schedule</h3>
          <p className="text-xs text-brand-textSecondary max-w-md mx-auto">
            View the 4-step actionable study plan designed to bring Rohan's math score above 75%.
          </p>
          <button
            onClick={() => navigate(`/learning-gaps/student/${student.id}/support`)}
            className="mt-2 px-4 py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emeraldHover"
          >
            Launch Targeted Support Plan Page
          </button>
        </div>
      )}
    </div>
  );
};
