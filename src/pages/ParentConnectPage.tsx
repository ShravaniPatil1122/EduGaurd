import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare,
  Sparkles,
  Send,
  History,
  Languages,
  CheckCircle,
  Copy,
  Link,
  Scissors,
  RotateCw,
  Phone,
  User,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { aiService } from '../services/aiService';
import { ParentCommunicationRecord } from '../types';

export const ParentConnectPage: React.FC = () => {
  const navigate = useNavigate();
  const { students, sendParentMessage, showToast } = useAppStore();

  const [selectedStudentId, setSelectedStudentId] = useState('rohan-mehta');
  const [messageType, setMessageType] = useState<ParentCommunicationRecord['messageType']>('Missed class alert');
  const [tone, setTone] = useState<'Friendly' | 'Formal' | 'Urgent'>('Friendly');
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [channel, setChannel] = useState<ParentCommunicationRecord['channel']>('WhatsApp');
  const [messageContent, setMessageContent] = useState('');

  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  // Generate initial draft on student or options change
  useEffect(() => {
    generateDraft();
  }, [selectedStudentId, messageType, tone, language]);

  const generateDraft = () => {
    const draft = aiService.draftParentMessage({
      studentName: selectedStudent.name,
      parentName: selectedStudent.parent.name,
      missedClassesCount: selectedStudent.missedClassesThisWeek || 2,
      missedSubjects: selectedStudent.subjects,
      messageType,
      tone,
      language,
    });
    setMessageContent(draft);
  };

  const handleMakeShorter = () => {
    const shorter = aiService.shortenMessage(messageContent);
    setMessageContent(shorter);
    showToast('Message Shortened', 'Condensed draft to 2 concise sentences.');
  };

  const handleAddCatchupLink = () => {
    if (messageContent.includes('eduguard.school/catchup')) {
      showToast('Link Exists', 'Catch-up link is already in this message.', 'info');
      return;
    }
    const link = `\n\n📌 Student Catch-up Link: https://eduguard.school/catchup/${selectedStudent.id}`;
    setMessageContent((prev) => prev + link);
    showToast('Link Appended', 'Secure catch-up module URL added to draft.');
  };

  const handleSend = () => {
    sendParentMessage({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      messageType,
      channel,
      messageText: messageContent,
    });
  };

  const messageTypes: ParentCommunicationRecord['messageType'][] = [
    'Missed class alert',
    'Progress update',
    'Meeting request',
    'Appreciation',
    'Fee reminder',
  ];

  const tones: ('Friendly' | 'Formal' | 'Urgent')[] = ['Friendly', 'Formal', 'Urgent'];
  const channels: ParentCommunicationRecord['channel'][] = ['WhatsApp', 'SMS', 'Email'];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
            Parent Communication Assistant
          </h1>
          <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
            Generate clear, concise messages for parents in their preferred language and send them in one tap.
          </p>
        </div>

        <button
          onClick={() => navigate('/parent-connect/history')}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary hover:border-brand-emerald shadow-subtle transition-all"
        >
          <History className="w-4 h-4 text-brand-emerald" />
          <span>Communication History</span>
        </button>
      </div>

      {/* Main Grid: Left Panel Form, Right Panel Draft Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================== */}
        {/* LEFT PANEL: SELECT STUDENT & OPTIONS (lg:col-span-5) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
            {/* Select Student */}
            <div>
              <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-2">
                Select Student
              </label>
              <div className="relative">
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 bg-brand-cyanBg/50 border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} (Class {st.class}-{st.section} • Roll #{st.rollNo})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-brand-textSecondary absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Student & Parent Info Box */}
            <div className="p-3 rounded-xl bg-brand-cyanBg/40 border border-brand-border space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-8 h-8 rounded-full object-cover border border-brand-border"
                />
                <div>
                  <div className="font-bold text-brand-textPrimary">{selectedStudent.name}</div>
                  <div className="text-[10px] text-brand-textSecondary">
                    Class {selectedStudent.class} • Roll No: {selectedStudent.rollNo}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-brand-borderLight text-[11px] space-y-1 text-brand-textSecondary">
                <div>
                  <span className="font-medium text-brand-dark">Parent: </span>
                  {selectedStudent.parent.name}
                </div>
                <div>
                  <span className="font-medium text-brand-dark">Language: </span>
                  {selectedStudent.parent.preferredLanguage}
                </div>
                <div>
                  <span className="font-medium text-brand-dark">Preferred: </span>
                  <span className="font-semibold text-brand-emerald">
                    {selectedStudent.parent.preferredChannel}
                  </span>
                </div>
              </div>
            </div>

            {/* Message Type Selector */}
            <div>
              <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-2">
                Message Type
              </label>
              <div className="flex flex-wrap gap-1.5">
                {messageTypes.map((type) => {
                  const isSelected = messageType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setMessageType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-emerald text-white shadow-xs'
                          : 'bg-white border border-brand-border text-brand-textSecondary hover:border-brand-emerald hover:text-brand-textPrimary'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-bold text-brand-textPrimary uppercase tracking-wider mb-2">
                Tone
              </label>
              <div className="flex gap-2">
                {tones.map((t) => {
                  const isSelected = tone === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-brand-emerald text-white shadow-xs'
                          : 'bg-white border border-brand-border text-brand-textSecondary hover:border-brand-emerald'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: AI DRAFTED MESSAGE (lg:col-span-7) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
            {/* Header with Language Tabs */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-emerald" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-brand-textPrimary">
                  AI Drafted Message
                </h3>
              </div>

              {/* Language Switcher */}
              <div className="flex bg-brand-cyanBg/60 p-1 rounded-xl border border-brand-border text-xs">
                {(
                  [
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिंदी' },
                    { code: 'mr', label: 'मराठी' },
                  ] as const
                ).map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      language === lang.code
                        ? 'bg-brand-emerald text-white shadow-xs'
                        : 'text-brand-textSecondary hover:text-brand-textPrimary'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Textarea */}
            <div className="relative">
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={8}
                className="w-full p-4 bg-brand-cyanBg/30 border border-brand-border rounded-xl text-xs sm:text-sm text-brand-textPrimary leading-relaxed focus:outline-none focus:border-brand-emerald resize-y font-sans shadow-2xs"
              />
            </div>

            {/* Editing Helper Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={generateDraft}
                className="px-3 py-1.5 border border-brand-border hover:border-brand-emerald text-brand-dark rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Regenerate</span>
              </button>

              <button
                onClick={handleMakeShorter}
                className="px-3 py-1.5 border border-brand-border hover:border-brand-emerald text-brand-dark rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white transition-colors"
              >
                <Scissors className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Make Shorter</span>
              </button>

              <button
                onClick={handleAddCatchupLink}
                className="px-3 py-1.5 border border-brand-border hover:border-brand-emerald text-brand-dark rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white transition-colors"
              >
                <Link className="w-3.5 h-3.5 text-brand-emerald" />
                <span>Add Catch-up Link</span>
              </button>
            </div>

            {/* Send Via Channels */}
            <div className="pt-2 border-t border-brand-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-dark uppercase tracking-wider">
                  Send Via:
                </span>
                <div className="flex gap-1.5">
                  {channels.map((ch) => {
                    const isSelected = channel === ch;
                    return (
                      <button
                        key={ch}
                        onClick={() => setChannel(ch)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-brand-dark text-white'
                            : 'bg-white border border-brand-border text-brand-textSecondary hover:border-brand-dark'
                        }`}
                      >
                        {ch}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleSend}
                className="py-2.5 px-6 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all hover:shadow"
              >
                <Send className="w-4 h-4" />
                <span>Send to Parent</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
