import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Sparkles,
  Sprout,
  Check,
  ChevronRight,
  ExternalLink,
  Award
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { MATH_QUIZ_QUESTIONS } from '../data/mockData';
import confetti from 'canvas-confetti';

export const SupportPlanPage: React.FC = () => {
  const { studentId = 'rohan-mehta' } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const {
    students,
    supportPlan,
    toggleSupportPlanTask,
    markSupportPlanCompleted,
    showToast,
  } = useAppStore();

  const student = students.find((s) => s.id === studentId) || students[0];

  // Quick Quiz Preview State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const currentQuiz = MATH_QUIZ_QUESTIONS[quizIndex];

  // Calculate completion percentage
  const completedCount = supportPlan.tasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedCount / supportPlan.tasks.length) * 100);

  const handleQuizAnswer = () => {
    if (selectedQuizOption === null) return;
    setIsAnswerChecked(true);
    if (selectedQuizOption === currentQuiz.correctAnswerIndex) {
      showToast('Correct!', 'Great job on factorizing the roots.', 'success');
    }
  };

  const handleNextQuizQ = () => {
    if (quizIndex + 1 < MATH_QUIZ_QUESTIONS.length) {
      setQuizIndex((prev) => prev + 1);
      setSelectedQuizOption(null);
      setIsAnswerChecked(false);
    } else {
      setQuizIndex(0);
      setSelectedQuizOption(null);
      setIsAnswerChecked(false);
      showToast('Quiz Restarted', 'Cycling through practice questions.');
    }
  };

  const handleMarkAllCompleted = () => {
    markSupportPlanCompleted();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`/learning-gaps/student/${student.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-textSecondary hover:text-brand-emerald mb-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Learning Gap Details</span>
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
          Targeted Support Plan
        </h1>
      </div>

      {/* Student Badge Card */}
      <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-11 h-11 rounded-full object-cover border-2 border-brand-border"
          />
          <div>
            <h2 className="text-base font-bold text-brand-textPrimary">
              {student.name} - <span className="text-brand-emerald">Mathematics</span>
            </h2>
            <div className="text-xs text-brand-textSecondary">
              Class {student.class} • Roll No: {student.rollNo}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[11px] text-brand-textSecondary font-medium">Plan Progress</div>
          <div className="text-base font-bold text-brand-dark flex items-center gap-2">
            <span>{progressPercent}%</span>
            <div className="w-20 h-2 bg-brand-cyanBg rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-brand-emerald transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Study Plan, Right Quick Quiz & Inspiration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================== */}
        {/* LEFT PANEL: At a Study Plan (lg:col-span-7) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
            <div>
              <div className="flex items-center gap-2 text-brand-emerald font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>At a Study Plan</span>
              </div>
              <p className="text-xs text-brand-textSecondary mt-1">
                This weekly plan helps recover learning gaps and build conceptual clarity.
              </p>
            </div>

            {/* Step Checklists */}
            <div className="space-y-3 pt-1">
              {supportPlan.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-brand-border hover:border-brand-emerald/50'
                  }`}
                >
                  <button
                    onClick={() => toggleSupportPlanTask(task.id)}
                    className="flex items-start gap-3 text-left flex-1"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-emerald shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-brand-textMuted shrink-0 mt-0.5 hover:text-brand-emerald" />
                    )}
                    <div>
                      <div
                        className={`font-semibold ${
                          task.completed
                            ? 'line-through text-brand-textMuted'
                            : 'text-brand-textPrimary'
                        }`}
                      >
                        {task.stepNumber}. {task.title}
                      </div>
                      <div className="text-[11px] text-brand-textSecondary mt-0.5">
                        {task.description}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      showToast(
                        'Resource Library',
                        `Opening curriculum repository for step ${task.stepNumber}.`
                      )
                    }
                    className="px-3 py-1 bg-white border border-brand-border text-brand-emerald hover:border-brand-emerald rounded-lg text-xs font-semibold shrink-0 transition-colors"
                  >
                    {task.resourceLabel}
                  </button>
                </div>
              ))}
            </div>

            {/* Primary Action Button */}
            <div className="pt-3">
              <button
                onClick={handleMarkAllCompleted}
                className="w-full py-2.5 px-4 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
              >
                <Check className="w-4 h-4" />
                <span>Mark as Completed</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: Quick Quiz Preview & Motivational Card (lg:col-span-5) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Quiz Preview Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-brand-textPrimary">
                Quick Quiz Preview
              </h3>
              <span className="text-[10px] text-brand-textSecondary font-semibold">
                Question {quizIndex + 1} of {MATH_QUIZ_QUESTIONS.length}
              </span>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-brand-textPrimary">
              {currentQuiz.question}
            </div>

            {/* Answer Options */}
            <div className="space-y-2">
              {currentQuiz.options.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === currentQuiz.correctAnswerIndex;

                let borderStyle = 'border-brand-border hover:border-brand-emerald hover:bg-brand-cyanBg/30';
                if (isAnswerChecked) {
                  if (isCorrect) borderStyle = 'border-brand-emerald bg-emerald-50 text-brand-dark font-medium';
                  else if (isSelected && !isCorrect) borderStyle = 'border-brand-danger bg-red-50 text-red-900';
                  else borderStyle = 'border-brand-borderLight opacity-50';
                } else if (isSelected) {
                  borderStyle = 'border-brand-emerald ring-1 ring-brand-emerald bg-emerald-50/50';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!isAnswerChecked) setSelectedQuizOption(idx);
                    }}
                    disabled={isAnswerChecked}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${borderStyle} bg-white`}
                  >
                    <span>{opt}</span>
                    {isAnswerChecked && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback box */}
            {isAnswerChecked && (
              <div
                className={`p-2.5 rounded-xl text-xs animate-in fade-in duration-200 ${
                  selectedQuizOption === currentQuiz.correctAnswerIndex
                    ? 'bg-emerald-50 text-brand-dark border border-emerald-200'
                    : 'bg-red-50 text-red-900 border border-red-200'
                }`}
              >
                <div className="font-semibold text-[11px]">
                  {selectedQuizOption === currentQuiz.correctAnswerIndex
                    ? '✓ Correct factorization:'
                    : '✗ Review factorization:'}
                </div>
                <div className="text-[11px] mt-0.5 leading-snug">{currentQuiz.explanation}</div>
              </div>
            )}

            {/* Buttons */}
            <div className="pt-1">
              {!isAnswerChecked ? (
                <button
                  onClick={handleQuizAnswer}
                  disabled={selectedQuizOption === null}
                  className="w-full py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emeraldHover disabled:opacity-50 transition-colors"
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuizQ}
                  className="w-full py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emeraldHover flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Motivational Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-brand-textPrimary">
                "Small steps make big progress."
              </p>
              <div className="text-[11px] text-brand-textSecondary mt-0.5">
                Consistent 15-minute daily practice yields 2x higher retention.
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-brand-emerald flex items-center justify-center shrink-0 border border-emerald-200">
              <Sprout className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
