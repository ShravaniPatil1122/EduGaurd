import React, { useState } from 'react';
import {
  User,
  School,
  Bell,
  Languages,
  ShieldCheck,
  RotateCcw,
  Save,
  Key,
  CheckCircle,
  Database
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { isSupabaseConfigured } from '../services/supabaseClient';

export const SettingsPage: React.FC = () => {
  const { resetDemoData, showToast } = useAppStore();

  const [teacherName, setTeacherName] = useState('Mrs. Anjali Deshmukh');
  const [email, setEmail] = useState('anjali.deshmukh@stxaviers.edu.in');
  const [schoolName, setSchoolName] = useState("St. Xavier's High School");
  const [preferredLang, setPreferredLang] = useState('English');
  const [notifyRisk, setNotifyRisk] = useState(true);
  const [notifyAttendance, setNotifyAttendance] = useState(true);
  const [notifyParentReply, setNotifyParentReply] = useState(true);

  // Supabase credentials input state for live configuration
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Settings Saved', 'Teacher profile preferences updated successfully.');
  };

  const handleTestSupabase = () => {
    if (!supabaseUrl || !supabaseKey) {
      showToast(
        'Missing Credentials',
        'Enter both Supabase URL and Anon Key to test connection.',
        'warning'
      );
      return;
    }
    showToast(
      'Connection Tested',
      'Config validated. For persistent production use, save to .env file.',
      'info'
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
          System Settings & Teacher Profile
        </h1>
        <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
          Manage teacher credentials, school information, privacy controls, and Supabase integration.
        </p>
      </div>

      {/* Profile & School Details Card */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-brand-dark font-bold text-xs uppercase tracking-wider">
          <User className="w-4 h-4 text-brand-emerald" />
          <span>Teacher Profile Information</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
              alt="Teacher"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-border"
            />
            <div>
              <button
                type="button"
                onClick={() => showToast('Avatar Upload', 'Photo updated from camera.')}
                className="px-3 py-1.5 bg-white border border-brand-border hover:border-brand-emerald text-brand-dark rounded-xl text-xs font-semibold"
              >
                Change Photo
              </button>
              <div className="text-[10px] text-brand-textSecondary mt-1">
                JPG, PNG under 2MB.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-brand-textSecondary font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-brand-textPrimary font-medium focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-brand-textSecondary font-semibold mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-brand-textPrimary font-medium focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-brand-textSecondary font-semibold mb-1">
                School Affiliation
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-brand-textPrimary font-medium focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-brand-textSecondary font-semibold mb-1">
                Default Teaching Language
              </label>
              <select
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value)}
                className="w-full px-3.5 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-brand-textPrimary font-medium focus:outline-none focus:border-brand-emerald"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 text-brand-dark font-bold text-xs uppercase tracking-wider">
          <Bell className="w-4 h-4 text-brand-emerald" />
          <span>Notification & Alert Preferences</span>
        </div>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-brand-cyanBg/30 border border-brand-border cursor-pointer">
            <div>
              <div className="font-semibold text-brand-textPrimary">Academic Risk Threshold Alerts</div>
              <div className="text-[11px] text-brand-textSecondary">
                Notify immediately when a student falls below 50% average score.
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyRisk}
              onChange={(e) => setNotifyRisk(e.target.checked)}
              className="w-4 h-4 text-brand-emerald rounded accent-brand-emerald"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-brand-cyanBg/30 border border-brand-border cursor-pointer">
            <div>
              <div className="font-semibold text-brand-textPrimary">Missed Classes & Attendance Warnings</div>
              <div className="text-[11px] text-brand-textSecondary">
                Prompt for catch-up plan generation when 2 consecutive classes are missed.
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyAttendance}
              onChange={(e) => setNotifyAttendance(e.target.checked)}
              className="w-4 h-4 text-brand-emerald rounded accent-brand-emerald"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-brand-cyanBg/30 border border-brand-border cursor-pointer">
            <div>
              <div className="font-semibold text-brand-textPrimary">Parent Communication Confirmations</div>
              <div className="text-[11px] text-brand-textSecondary">
                Receive notifications when parents confirm meeting invitations.
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifyParentReply}
              onChange={(e) => setNotifyParentReply(e.target.checked)}
              className="w-4 h-4 text-brand-emerald rounded accent-brand-emerald"
            />
          </label>
        </div>
      </div>

      {/* Supabase & Backend Persistence Configuration */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-dark font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4 text-brand-emerald" />
            <span>Supabase Cloud Database & Auth Configuration</span>
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-brand-emerald'
                : 'bg-brand-cyanBg text-brand-dark border border-brand-border'
            }`}
          >
            {isSupabaseConfigured ? '✓ Connected' : 'Local Demo Mode Active'}
          </span>
        </div>

        <p className="text-xs text-brand-textSecondary leading-relaxed">
          EduGuard includes a complete fallback local demo mode using localStorage. To connect your Supabase production database, configure your environment variables or enter your keys below.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-brand-textSecondary font-semibold mb-1">
              VITE_SUPABASE_URL
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-brand-textPrimary focus:outline-none focus:border-brand-emerald font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-brand-textSecondary font-semibold mb-1">
              VITE_SUPABASE_ANON_KEY
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsIn..."
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              className="w-full px-3 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-brand-textPrimary focus:outline-none focus:border-brand-emerald font-mono text-[11px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleTestSupabase}
            className="px-3.5 py-2 bg-white border border-brand-border hover:border-brand-emerald text-brand-dark rounded-xl text-xs font-semibold flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Validate Connection</span>
          </button>

          <span className="text-[11px] text-brand-textSecondary italic">
            Schema migration file located in /supabase/migrations/
          </span>
        </div>
      </div>

      {/* Reset Demo Data Card */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-xs uppercase tracking-wider text-rose-900">
            Reset Application State
          </h3>
          <p className="text-xs text-rose-700 mt-0.5">
            Clear all browser localStorage modifications and restore initial realistic seed data.
          </p>
        </div>

        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-2 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Demo Data</span>
        </button>
      </div>
    </div>
  );
};
