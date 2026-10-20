import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RotateCcw, Award, ChevronRight } from 'lucide-react';
import { MATH_QUIZ_QUESTIONS } from '../../data/mockData';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  topic?: string;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  title = 'Practice Quiz',
  topic = 'Quadratic Equations & Roots',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen) return null;

  const currentQ = MATH_QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < MATH_QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
      if (score >= 3) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-brand-border rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-brand-borderLight flex items-center justify-between bg-brand-cyanBg/60">
          <div>
            <h3 className="font-semibold text-brand-textPrimary text-sm sm:text-base">{title}</h3>
            <p className="text-[11px] text-brand-textSecondary">{topic} • 5 Questions</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-brand-textSecondary hover:text-brand-textPrimary hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {!quizFinished ? (
            <div>
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs text-brand-textSecondary mb-2 font-medium">
                <span>
                  Question {currentIndex + 1} of {MATH_QUIZ_QUESTIONS.length}
                </span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full h-1.5 bg-brand-cyanBg rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-brand-emerald transition-all duration-300"
                  style={{
                    width: `${((currentIndex + 1) / MATH_QUIZ_QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>

              {/* Question Text */}
              <div className="text-sm sm:text-base font-semibold text-brand-textPrimary mb-4">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctAnswerIndex;

                  let borderClass = 'border-brand-border hover:border-brand-emerald hover:bg-emerald-50/30';
                  let bgClass = 'bg-white';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      borderClass = 'border-brand-emerald bg-emerald-50 text-brand-dark font-medium';
                    } else if (isSelected && !isCorrect) {
                      borderClass = 'border-brand-danger bg-red-50 text-red-900';
                    } else {
                      borderClass = 'border-brand-borderLight opacity-60';
                    }
                  } else if (isSelected) {
                    borderClass = 'border-brand-emerald ring-1 ring-brand-emerald bg-emerald-50/50';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${borderClass} ${bgClass}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-brand-emerald shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <AlertCircle className="w-4 h-4 text-brand-danger shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Feedback */}
              {isAnswerSubmitted && (
                <div
                  className={`p-3 rounded-xl text-xs mb-5 animate-in fade-in duration-200 ${
                    selectedOption === currentQ.correctAnswerIndex
                      ? 'bg-emerald-50 text-brand-dark border border-emerald-200'
                      : 'bg-red-50 text-red-900 border border-red-200'
                  }`}
                >
                  <div className="font-semibold mb-0.5">
                    {selectedOption === currentQ.correctAnswerIndex
                      ? '✓ Correct Answer!'
                      : '✗ Incorrect'}
                  </div>
                  <div className="text-[11px] leading-relaxed">{currentQ.explanation}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={selectedOption === null}
                    className="px-4 py-2 bg-brand-emerald text-white rounded-xl text-xs font-medium hover:bg-brand-emeraldHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-brand-emerald text-white rounded-xl text-xs font-medium hover:bg-brand-emeraldHover transition-colors flex items-center gap-1.5"
                  >
                    <span>
                      {currentIndex + 1 < MATH_QUIZ_QUESTIONS.length
                        ? 'Next Question'
                        : 'View Results'}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-emerald">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-brand-textPrimary mb-1">Quiz Completed!</h4>
              <p className="text-xs text-brand-textSecondary mb-4">
                You scored <span className="font-bold text-brand-dark">{score}</span> out of{' '}
                {MATH_QUIZ_QUESTIONS.length}
              </p>

              <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-brand-emerald border border-brand-emerald mb-6">
                {score >= 4
                  ? '🌟 Outstanding conceptual understanding!'
                  : score >= 3
                  ? '👍 Solid grasp. Review the minor gaps.'
                  : '📘 Needs more practice with factorization.'}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="px-4 py-2 border border-brand-border text-brand-textPrimary rounded-xl text-xs font-medium hover:bg-brand-cyanBg flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-brand-emerald text-white rounded-xl text-xs font-medium hover:bg-brand-emeraldHover"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
