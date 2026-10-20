import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Play,
  BookOpen,
  FileCheck,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { QuizModal } from '../components/learning/QuizModal';
import { AiExplanationModal } from '../components/learning/AiExplanationModal';

export const StudentCatchUpPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { students, missedSubjects, toggleTaskCompletion, showToast } = useAppStore();

  const [activeTab, setActiveTab] = useState<'Missed Topics' | 'Catch-up Plan' | 'Resources'>('Missed Topics');
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAiExplainerOpen, setIsAiExplainerOpen] = useState(false);

  // Content Preview Modal for Watch/Read/Practice buttons
  const [activeContentModal, setActiveContentModal] = useState<{
    type: 'video' | 'notes' | 'practice' | 'quiz';
    title: string;
    description: string;
  } | null>(null);

  const student = students.find((s) => s.id === studentId) || students[0];

  const handleActionClick = (
    subjectId: string,
    task: { id: string; type: string; title: string; completed: boolean }
  ) => {
    if (task.type === 'quiz') {
      setIsQuizOpen(true);
      return;
    }

    if (task.type === 'video') {
      setActiveContentModal({
        type: 'video',
        title: task.title,
        description:
          'Educational video lesson covering core concepts step-by-step with animated diagrams.',
      });
      return;
    }

    if (task.type === 'notes') {
      setActiveContentModal({
        type: 'notes',
        title: task.title,
        description:
          'Structured summary notes with highlighted formulas, key definitions, and worked examples.',
      });
      return;
    }

    setActiveContentModal({
      type: 'practice',
      title: task.title,
      description:
        'Practice worksheets featuring 10 graded problems from beginner to exam-level standard.',
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        title="Missed Topic Mastery Quiz"
        topic="Class 10 Science & Mathematics"
      />

      {/* AI Explanation Modal */}
      <AiExplanationModal
        isOpen={isAiExplainerOpen}
        onClose={() => setIsAiExplainerOpen(false)}
        initialTopic="Quadratic Equations"
        initialSubject="Mathematics"
      />

      {/* Resource Content Viewer Modal */}
      {activeContentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-brand-border rounded-2xl p-5 max-w-lg w-full shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 mb-2 text-brand-emerald">
              {activeContentModal.type === 'video' && <Play className="w-5 h-5" />}
              {activeContentModal.type === 'notes' && <BookOpen className="w-5 h-5" />}
              {activeContentModal.type === 'practice' && <FileCheck className="w-5 h-5" />}
              <span className="text-xs font-bold uppercase tracking-wider">
                {activeContentModal.type} Module
              </span>
            </div>
            <h3 className="font-bold text-brand-textPrimary text-base mb-2">
              {activeContentModal.title}
            </h3>
            <p className="text-xs text-brand-textSecondary mb-4 leading-relaxed">
              {activeContentModal.description}
            </p>

            <div className="bg-brand-cyanBg/60 border border-brand-border rounded-xl p-4 text-xs space-y-2 mb-5">
              <div className="flex items-center justify-between text-brand-textSecondary">
                <span>Estimated completion time:</span>
                <span className="font-semibold text-brand-dark">15 minutes</span>
              </div>
              <div className="flex items-center justify-between text-brand-textSecondary">
                <span>Teacher check-in:</span>
                <span className="font-semibold text-brand-emerald">Mrs. Deshmukh</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  showToast('Completed', 'Task marked as done in student profile.');
                  setActiveContentModal(null);
                }}
                className="px-4 py-2 border border-brand-border text-brand-textPrimary rounded-xl text-xs font-semibold hover:bg-brand-cyanBg"
              >
                Mark as Done
              </button>
              <button
                onClick={() => setActiveContentModal(null)}
                className="px-4 py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emeraldHover"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Back Arrow */}
      <div>
        <button
          onClick={() => navigate('/daily-learning')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-textSecondary hover:text-brand-emerald mb-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Daily Topics</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
          Daily Topics & Missed-class Recovery
        </h1>
        <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
          Track daily topics, view missed classes and personalised catch-up plans.
        </p>
      </div>

      {/* Student Profile Summary Card */}
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
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
            {student.missedClassesThisWeek} classes missed
          </span>

          <button
            onClick={() => navigate(`/learning-gaps/student/${student.id}/support`)}
            className="px-3.5 py-1.5 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>Targeted Support Plan</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-brand-border">
        {(['Missed Topics', 'Catch-up Plan', 'Resources'] as const).map((tab) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Left Column (Span 2): Missed Subjects & Tasks */}
          <div className="lg:col-span-2 space-y-4">
            {missedSubjects.map((sub) => (
              <div
                key={sub.id}
                className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle space-y-3.5"
              >
                {/* Subject Header */}
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-emerald" />
                  <h3 className="font-bold text-brand-textPrimary text-sm sm:text-base">
                    {sub.subject} <span className="font-normal text-brand-textSecondary">({sub.date})</span>
                  </h3>
                </div>

                <div className="text-xs font-semibold text-brand-dark pl-4">
                  Topic: {sub.topicTitle}
                </div>

                {/* Task Checklist */}
                <div className="space-y-2.5 pl-4 pt-1">
                  {sub.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-brand-borderLight hover:border-brand-emerald/40 bg-brand-cyanBg/30 transition-all text-xs"
                    >
                      <button
                        onClick={() => toggleTaskCompletion(sub.id, task.id)}
                        className="flex items-center gap-2.5 text-left flex-1"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-brand-textMuted shrink-0 hover:text-brand-emerald" />
                        )}
                        <span
                          className={`font-medium ${
                            task.completed
                              ? 'line-through text-brand-textMuted'
                              : 'text-brand-textPrimary'
                          }`}
                        >
                          {task.title}
                        </span>
                      </button>

                      <button
                        onClick={() => handleActionClick(sub.id, task)}
                        className="ml-2 px-3 py-1 bg-white border border-brand-border text-brand-dark hover:border-brand-emerald hover:text-brand-emerald rounded-lg text-xs font-semibold transition-colors shrink-0"
                      >
                        {task.linkText || 'Open'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: AI Explanation & Recommended Practice */}
          <div className="space-y-4">
            {/* AI Explanation Card */}
            <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle space-y-3">
              <div className="flex items-center gap-2 text-brand-emerald font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>AI Explanation</span>
              </div>

              <p className="text-xs text-brand-textSecondary leading-relaxed">
                Quadratic equations are equations of the form{' '}
                <span className="font-mono font-semibold text-brand-dark">ax² + bx + c = 0</span>, where{' '}
                <span className="font-mono font-semibold text-brand-dark">a ≠ 0</span>. They have two
                solutions, which can be real, imaginary or equal roots (discriminant D = b² - 4ac).
              </p>

              <button
                onClick={() => setIsAiExplainerOpen(true)}
                className="w-full py-2 px-3 border border-brand-emerald text-brand-dark bg-white hover:bg-emerald-50/50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Explain in simple terms</span>
              </button>
            </div>

            {/* Recommended Practice Card */}
            <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle space-y-3">
              <div className="font-bold text-brand-textPrimary text-xs uppercase tracking-wider">
                Recommended Practice
              </div>
              <p className="text-xs text-brand-textSecondary">
                To strengthen your understanding, try these questions:
              </p>

              <div className="space-y-1.5 text-xs">
                <button
                  onClick={() =>
                    setActiveContentModal({
                      type: 'practice',
                      title: 'Quadratic Equations - Worksheet',
                      description: 'Comprehensive practice set with step-by-step answer key.',
                    })
                  }
                  className="w-full text-left p-2 rounded-lg hover:bg-brand-cyanBg text-brand-emerald font-semibold transition-colors flex items-center justify-between"
                >
                  <span>• Quadratic Equations - Worksheet</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-textMuted" />
                </button>

                <button
                  onClick={() =>
                    setActiveContentModal({
                      type: 'practice',
                      title: 'Algebra Practice Set',
                      description: 'Foundational algebra exercises focused on factorisation speed.',
                    })
                  }
                  className="w-full text-left p-2 rounded-lg hover:bg-brand-cyanBg text-brand-emerald font-semibold transition-colors flex items-center justify-between"
                >
                  <span>• Algebra Practice Set</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-textMuted" />
                </button>
              </div>

              <button
                onClick={() => navigate(`/learning-gaps/student/${student.id}/support`)}
                className="w-full py-2 px-3 bg-brand-cyanBg text-brand-dark border border-brand-border rounded-xl text-xs font-semibold hover:bg-brand-borderLight transition-colors"
              >
                View All Resources
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Catch-up Plan Tab */}
      {activeTab === 'Catch-up Plan' && (
        <div className="bg-white border border-brand-border rounded-2xl p-6 text-center space-y-3">
          <Award className="w-10 h-10 text-brand-emerald mx-auto" />
          <h3 className="font-bold text-base text-brand-textPrimary">Weekly Catch-up Pathway</h3>
          <p className="text-xs text-brand-textSecondary max-w-md mx-auto">
            Rohan is scheduled for 4 structured learning sessions to build conceptual mastery in
            quadratic roots and chemical balancing.
          </p>
          <button
            onClick={() => navigate(`/learning-gaps/student/${student.id}/support`)}
            className="mt-2 px-4 py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emeraldHover"
          >
            Open Interactive Study Plan
          </button>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === 'Resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-brand-border rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-brand-textPrimary text-xs uppercase">Curated Videos</h4>
            <p className="text-xs text-brand-textSecondary">
              NCERT aligned video lectures (average duration: 8-12 min).
            </p>
            <button
              onClick={() => showToast('Opening Video Library', 'Loaded 8 NCERT video tutorials.')}
              className="text-xs font-semibold text-brand-emerald hover:underline"
            >
              Browse 8 Video Lectures →
            </button>
          </div>
          <div className="bg-white border border-brand-border rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-brand-textPrimary text-xs uppercase">Revision PDFs</h4>
            <p className="text-xs text-brand-textSecondary">
              Summary formula charts and memory maps ready for download.
            </p>
            <button
              onClick={() => showToast('Downloading Formula Sheet', 'Saved Class 10 Math Formula Sheet.')}
              className="text-xs font-semibold text-brand-emerald hover:underline"
            >
              Download Formula Sheet PDF →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
