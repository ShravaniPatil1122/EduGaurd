import React, { useState, useEffect } from 'react';
import { X, Sparkles, BookOpen, Lightbulb, Check, RefreshCw } from 'lucide-react';
import { aiService, ExplanationOptions } from '../../services/aiService';

interface AiExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
  initialSubject?: string;
}

export const AiExplanationModal: React.FC<AiExplanationModalProps> = ({
  isOpen,
  onClose,
  initialTopic = 'Quadratic Equations',
  initialSubject = 'Mathematics',
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [level, setLevel] = useState<ExplanationOptions['level']>('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [explanationData, setExplanationData] = useState<{
    title: string;
    summary: string;
    keyPoints: string[];
    realWorldAnalogy: string;
    formula?: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadExplanation();
    }
  }, [isOpen, topic, level]);

  const loadExplanation = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.explainConcept({
        subject,
        topic,
        level,
      });
      setExplanationData(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white border border-brand-border rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-4 border-b border-brand-borderLight flex items-center justify-between bg-brand-cyanBg/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-brand-emerald">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-brand-textPrimary text-sm sm:text-base">
                AI Pedagogical Concept Explainer
              </h3>
              <p className="text-[11px] text-brand-textSecondary">
                Instant intuitive breakdowns for struggling students
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

        {/* Level Controls */}
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-cyanBg/50 p-2.5 rounded-xl border border-brand-border">
            <div className="text-xs font-semibold text-brand-textPrimary">Explanation Style:</div>
            <div className="flex gap-1.5">
              {(['simple', 'standard', 'advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    level === lvl
                      ? 'bg-brand-emerald text-white shadow-xs'
                      : 'bg-white border border-brand-border text-brand-textSecondary hover:text-brand-textPrimary'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Explanation Content */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-6 h-6 text-brand-emerald animate-spin mb-2" />
              <div className="text-xs text-brand-textSecondary">
                Generating simplified pedagogical explanation...
              </div>
            </div>
          ) : explanationData ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h4 className="font-bold text-brand-dark text-base">{explanationData.title}</h4>
                <p className="mt-1 text-xs text-brand-textPrimary leading-relaxed bg-brand-cyanBg/40 p-3 rounded-xl border border-brand-border">
                  {explanationData.summary}
                </p>
              </div>

              {explanationData.formula && (
                <div className="bg-emerald-50/60 border border-brand-emerald/40 p-3 rounded-xl font-mono text-xs text-brand-dark font-medium text-center">
                  {explanationData.formula}
                </div>
              )}

              <div>
                <div className="text-xs font-bold text-brand-textPrimary mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand-emerald" />
                  Key Takeaways for Students
                </div>
                <ul className="space-y-1.5">
                  {explanationData.keyPoints.map((pt, i) => (
                    <li
                      key={i}
                      className="text-xs text-brand-textSecondary flex items-start gap-2 bg-white p-2 rounded-lg border border-brand-borderLight"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-brand-warning shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-amber-900">Real-World Analogy</div>
                  <div className="text-xs text-amber-800 mt-0.5">
                    {explanationData.realWorldAnalogy}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-brand-textMuted text-right">
                Engine: EduGuard Pedagogical AI Core (Deterministic Local Engine)
              </div>
            </div>
          ) : null}

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-brand-borderLight">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-brand-emerald text-white rounded-xl text-xs font-medium hover:bg-brand-emeraldHover"
            >
              Done & Share with Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
