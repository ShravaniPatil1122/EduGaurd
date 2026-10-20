import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Send,
  Paperclip,
  Smile,
  ShieldAlert,
  Calendar,
  MapPin,
  Clock,
  BookOpen,
  CheckCheck
} from 'lucide-react';
import { useAppStore } from '../services/store';

export const PeerChatPage: React.FC = () => {
  const { studentId = 'ananya-sharma' } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { peerClassmates, chatMessages, sendChatMessage, showToast } = useAppStore();

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const peer =
    peerClassmates.find((p) => p.id === studentId) ||
    peerClassmates.find((p) => p.id === 'ananya-sharma') ||
    peerClassmates[0];

  const currentMessages = chatMessages[peer.id] || chatMessages['ananya-sharma'] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    sendChatMessage(peer.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleReportConversation = () => {
    showToast('Report Logged', 'Conversation flagged for administrator review.', 'warning');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/peer-learning')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-textSecondary hover:text-brand-emerald mb-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Peer Learning</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
            Peer Learning Chat
          </h1>
        </div>

        <button
          onClick={handleReportConversation}
          className="flex items-center gap-1.5 text-xs text-brand-textSecondary hover:text-brand-danger px-3 py-1.5 rounded-xl border border-brand-border hover:border-brand-danger/40 bg-white transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Report Chat</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Chat Window (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-brand-border rounded-2xl shadow-subtle flex flex-col h-[600px] overflow-hidden">
          {/* Partner Header */}
          <div className="px-5 py-3.5 border-b border-brand-borderLight flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={peer.avatar}
                  alt={peer.name}
                  className="w-10 h-10 rounded-full object-cover border border-brand-border"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-brand-textPrimary">{peer.name}</h2>
                <div className="text-[11px] text-brand-textSecondary flex items-center gap-1.5">
                  <span>{peer.class} • {peer.distance}</span>
                  <span className="text-brand-emerald font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-brand-textSecondary font-medium hidden sm:block">
              Peer Learning ID: #{peer.id.substring(0, 6)}
            </div>
          </div>

          {/* Messages Timeline */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-brand-cyanBg/20">
            {/* Encryption notice */}
            <div className="text-center">
              <span className="px-3 py-1 bg-white border border-brand-border rounded-full text-[10px] text-brand-textSecondary inline-block shadow-2xs">
                🔒 Safe Peer Study Channel • Monitored for student safety
              </span>
            </div>

            {currentMessages.map((msg) => {
              const isTeacher = msg.sender === 'teacher';

              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2.5 ${isTeacher ? 'justify-end' : 'justify-start'}`}
                >
                  {!isTeacher && (
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="w-7 h-7 rounded-full object-cover border border-brand-border shrink-0 mb-1"
                    />
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isTeacher
                        ? 'bg-brand-emerald text-white rounded-br-none'
                        : 'bg-white text-brand-textPrimary border border-brand-border rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <div
                      className={`mt-1 text-[10px] flex items-center justify-end gap-1 ${
                        isTeacher ? 'text-emerald-100' : 'text-brand-textSecondary'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {isTeacher && <CheckCheck className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {isTeacher && (
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                      alt="Teacher"
                      className="w-7 h-7 rounded-full object-cover border border-brand-border shrink-0 mb-1"
                    />
                  )}
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {/* Composer Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white border-t border-brand-borderLight flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => showToast('Attachment', 'Attach practice worksheet or formula pdf.')}
              className="p-2 text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-cyanBg rounded-xl transition-colors"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 bg-brand-cyanBg/60 border border-brand-border rounded-xl text-xs sm:text-sm text-brand-textPrimary placeholder:text-brand-textMuted focus:outline-none focus:border-brand-emerald focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Sidebar: Shared Study Details (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
            <h3 className="font-bold text-sm text-brand-textPrimary uppercase tracking-wider">
              Shared Study Details
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-cyanBg/40 border border-brand-border">
                <BookOpen className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-brand-textSecondary uppercase font-semibold">Subject</div>
                  <div className="font-semibold text-brand-textPrimary">Mathematics</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-cyanBg/40 border border-brand-border">
                <Clock className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-brand-textSecondary uppercase font-semibold">Preferred Mode</div>
                  <div className="font-semibold text-brand-textPrimary">Online / In-person</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-cyanBg/40 border border-brand-border">
                <MapPin className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-brand-textSecondary uppercase font-semibold">Location</div>
                  <div className="font-semibold text-brand-textPrimary">Near Library (0.8 km)</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-cyanBg/40 border border-brand-border">
                <Calendar className="w-4 h-4 text-brand-emerald shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-brand-textSecondary uppercase font-semibold">Time Slot</div>
                  <div className="font-semibold text-brand-textPrimary">Today, 5:00 PM - 6:30 PM</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Study Session Active', 'Opened collaborative whiteboard & shared notes.')}
              className="w-full py-2.5 px-4 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
            >
              View Study Session
            </button>
          </div>

          {/* Quick Study Safety Notice */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-brand-dark space-y-1">
            <div className="font-bold">Peer Mentorship Tip</div>
            <p className="text-[11px] text-brand-textSecondary leading-relaxed">
              Encourage students to exchange sample questions first and work out steps aloud to
              reinforce problem-solving speed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
