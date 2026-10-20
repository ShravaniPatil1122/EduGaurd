import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  FileText,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { QuizModal } from '../components/learning/QuizModal';
import { AiExplanationModal } from '../components/learning/AiExplanationModal';

export const DailyLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    dailyTopics,
    selectedClassFilter,
    setSelectedClassFilter,
    activeDate,
    setActiveDate,
    showToast,
  } = useAppStore();

  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAiExplainerOpen, setIsAiExplainerOpen] = useState(false);
  const [selectedNotesModal, setSelectedNotesModal] = useState<string | null>(null);

  const classesList = ['All Classes', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];

  const filteredTopics =
    selectedClassFilter === 'All Classes'
      ? dailyTopics
      : dailyTopics.filter((t) => t.class.toLowerCase().includes(selectedClassFilter.toLowerCase()));

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Modals */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        title="Quadratic Equations Checkpoint"
        topic="Class 10 Mathematics"
      />

      <AiExplanationModal
        isOpen={isAiExplainerOpen}
        onClose={() => setIsAiExplainerOpen(false)}
        initialTopic="Quadratic Equations"
        initialSubject="Mathematics"
      />

      {/* Class Notes Modal */}
      {selectedNotesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-brand-border rounded-2xl p-5 max-w-md w-full shadow-xl">
            <h3 className="font-bold text-brand-textPrimary text-base mb-2">Class Notes & Materials</h3>
            <p className="text-xs text-brand-textSecondary mb-4">
              Access curated lecture summaries, blackboard exports, and reference problem sheets.
            </p>
            <div className="space-y-2 mb-4">
              <div className="p-2.5 bg-brand-cyanBg/60 border border-brand-border rounded-xl text-xs flex items-center justify-between">
                <span className="font-medium text-brand-textPrimary">Handwritten Concept Notes (PDF)</span>
                <button
                  onClick={() => showToast('Download Started', 'Downloading class notes PDF.')}
                  className="px-2.5 py-1 bg-white border border-brand-border text-brand-dark rounded-lg text-[11px] font-medium hover:bg-brand-emerald hover:text-white transition-colors"
                >
                  Download
                </button>
              </div>
              <div className="p-2.5 bg-brand-cyanBg/60 border border-brand-border rounded-xl text-xs flex items-center justify-between">
                <span className="font-medium text-brand-textPrimary">Graphing Calculator Demo Link</span>
                <button
                  onClick={() => showToast('Resource Opened', 'Opening interactive graph simulator.')}
                  className="px-2.5 py-1 bg-white border border-brand-border text-brand-dark rounded-lg text-[11px] font-medium hover:bg-brand-emerald hover:text-white transition-colors"
                >
                  Open
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedNotesModal(null)}
                className="px-4 py-1.5 bg-brand-emerald text-white rounded-xl text-xs font-medium hover:bg-brand-emeraldHover"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
              Daily Topics & Missed-Class Recovery
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
            Track daily topics, view missed classes and help students catch up with personalized plans.
          </p>
        </div>

        {/* Date Selector Badge */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => {
              const newDate = activeDate === 'Mon, 20 Oct 2025' ? 'Tue, 21 Oct 2025' : 'Mon, 20 Oct 2025';
              setActiveDate(newDate);
              showToast('Date Changed', `Viewing topics for ${newDate}`);
            }}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary hover:border-brand-emerald shadow-subtle transition-all"
          >
            <Calendar className="w-4 h-4 text-brand-emerald" />
            <span>{activeDate}</span>
            <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary" />
          </button>
        </div>
      </div>

      {/* Class Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {classesList.map((cls) => {
          const isActive = selectedClassFilter === cls;
          return (
            <button
              key={cls}
              onClick={() => setSelectedClassFilter(cls)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-emerald text-white shadow-sm'
                  : 'bg-white border border-brand-border text-brand-textSecondary hover:border-brand-emerald hover:text-brand-textPrimary'
              }`}
            >
              {cls}
            </button>
          );
        })}
      </div>

      {/* Main 3-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* ============================================================== */}
        {/* COLUMN 1: TODAY'S TOPICS */}
        {/* ============================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-textPrimary uppercase tracking-wider">
              Today's Topics
            </h2>
            <span className="text-[11px] font-medium text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded-full border border-brand-emerald/30">
              {filteredTopics.length} Classes Scheduled
            </span>
          </div>

          <div className="space-y-3.5">
            {filteredTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle hover:border-brand-emerald/60 transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-brand-textPrimary text-sm">
                      {topic.class} - {topic.section}
                    </h3>
                    <div className="text-xs text-brand-textSecondary font-medium">
                      Subject: <span className="text-brand-textPrimary font-semibold">{topic.subject}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-brand-emerald">
                    {topic.status}
                  </span>
                </div>

                {/* Topics Covered */}
                <div className="mt-3 text-xs space-y-1.5">
                  <div className="font-semibold text-brand-dark">Topics:</div>
                  <ul className="space-y-1 text-brand-textSecondary pl-2">
                    {topic.topics.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Important Concepts */}
                <div className="mt-2.5 text-xs">
                  <span className="font-semibold text-brand-dark">Important Concepts: </span>
                  <span className="text-brand-textSecondary">{topic.importantConcepts}</span>
                </div>

                {/* Assignment */}
                <div className="mt-1.5 text-xs">
                  <span className="font-semibold text-brand-dark">Assignment: </span>
                  <span className="text-brand-textSecondary">{topic.assignment}</span>
                </div>

                {/* Bottom Link Action */}
                <div className="mt-4 pt-3 border-t border-brand-borderLight">
                  <button
                    onClick={() => setSelectedNotesModal(topic.id)}
                    className="text-xs font-semibold text-brand-emerald hover:text-brand-emeraldHover flex items-center gap-1.5 group transition-colors"
                  >
                    <span>View class notes & resources</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: MISSED CLASSES & CATCH-UP PLAN */}
        {/* ============================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-textPrimary uppercase tracking-wider">
              Missed Classes & Catch-up Plan
            </h2>
          </div>

          {/* Student Catch-up Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle hover:border-brand-emerald/60 transition-all space-y-4">
            {/* Student Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                  alt="Rohan Mehta"
                  className="w-10 h-10 rounded-full object-cover border border-brand-border shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-brand-textPrimary text-sm">Rohan Mehta</h3>
                  <div className="text-[11px] text-brand-textSecondary">
                    Class 10 • Roll No: 1023
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-700 whitespace-nowrap">
                2 classes missed this week
              </span>
            </div>

            {/* Missed Topics Section */}
            <div className="space-y-3 pt-1">
              <div className="text-xs font-bold text-brand-dark">Missed Topics:</div>

              {/* Subject 1: Mathematics */}
              <div className="bg-brand-cyanBg/50 border border-brand-border rounded-xl p-3 text-xs space-y-1.5">
                <div className="font-bold text-brand-dark flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-danger" />
                  <span>Mathematics (Oct 18)</span>
                </div>
                <ul className="pl-3.5 space-y-1 text-brand-textSecondary text-[11px]">
                  <li>• Quadratic Equations - Introduction & Types</li>
                  <li>• Solving by Factorisation (examples)</li>
                  <li>• Practice questions (Worksheet 1A: Q1-6)</li>
                </ul>
              </div>

              {/* Subject 2: Science */}
              <div className="bg-brand-cyanBg/50 border border-brand-border rounded-xl p-3 text-xs space-y-1.5">
                <div className="font-bold text-brand-dark flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-warning" />
                  <span>Science (Oct 17)</span>
                </div>
                <ul className="pl-3.5 space-y-1 text-brand-textSecondary text-[11px]">
                  <li>• Chemical Reactions - Types and Examples</li>
                  <li>• Balanced Equations</li>
                  <li>• Practice quiz (10 questions)</li>
                </ul>
              </div>
            </div>

            {/* Action Button: Start Catch-up Plan */}
            <button
              onClick={() => navigate('/daily-learning/student/rohan-mehta')}
              className="w-full py-2.5 px-4 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Catch-up Plan</span>
            </button>
          </div>

          {/* Quick Stats Helper */}
          <div className="bg-white border border-brand-border rounded-2xl p-3.5 text-xs flex items-center justify-between text-brand-textSecondary shadow-subtle">
            <span className="text-[11px]">3 additional students have 1 missed class</span>
            <button
              onClick={() => navigate('/learning-gaps')}
              className="text-brand-emerald font-semibold hover:underline text-[11px]"
            >
              View All Gaps
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 3: AI CONCEPT EXPLAINER & PRACTICE QUIZ */}
        {/* ============================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-brand-textPrimary uppercase tracking-wider">
              AI Concept Explainer
            </h2>
          </div>

          {/* Concept Explanation Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle space-y-3.5">
            <div>
              <div className="font-bold text-brand-dark text-sm">
                Quadratic Equations - Simple Explanation
              </div>
              <p className="mt-1.5 text-xs text-brand-textSecondary leading-relaxed">
                A quadratic equation is a second-degree equation in the form{' '}
                <span className="font-mono font-semibold text-brand-dark">ax² + bx + c = 0</span>, where{' '}
                <span className="font-mono font-semibold text-brand-dark">a ≠ 0</span>.
              </p>
            </div>

            {/* Key Points */}
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-brand-dark">Key points:</div>
              <ul className="space-y-1 text-brand-textSecondary pl-2 text-[11px]">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                  <span>Can be solved by factorisation.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                  <span>Can be solved using quadratic formula.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald" />
                  <span>Has two roots (real or imaginary).</span>
                </li>
              </ul>
            </div>

            {/* Button */}
            <button
              onClick={() => setIsAiExplainerOpen(true)}
              className="w-full py-2 px-3 border border-brand-emerald text-brand-dark bg-white hover:bg-emerald-50/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Explain in Simple Language</span>
            </button>
          </div>

          {/* Practice Quiz Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle space-y-3">
            <div>
              <div className="font-bold text-brand-dark text-sm">Practice Quiz</div>
              <p className="mt-1 text-xs text-brand-textSecondary">
                Test your understanding with 5 quick questions.
              </p>
            </div>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full py-2.5 px-4 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-sm transition-all text-center"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
