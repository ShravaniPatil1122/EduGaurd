import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Menu, Sparkles, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { useAppStore } from '../../services/store';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onToggleSidebar }) => {
  const { students, resetDemoData, showToast } = useAppStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Search filtering
  const filteredStudents = searchQuery.trim()
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.subjects.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase())) ||
          s.rollNo.includes(searchQuery)
      )
    : [];

  const handleSelectStudent = (studentId: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    navigate(`/daily-learning/student/${studentId}`);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-brand-border px-4 lg:px-6 flex items-center justify-between shadow-subtle">
      {/* Left: Mobile hamburger & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-cyanBg rounded-lg"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-brand-textMuted" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search students, topics, or resources..."
            className="w-full pl-9 pr-4 py-2 bg-brand-cyanBg/60 border border-brand-border rounded-xl text-xs sm:text-sm text-brand-textPrimary placeholder:text-brand-textMuted focus:outline-none focus:ring-1 focus:ring-brand-emerald focus:border-brand-emerald focus:bg-white transition-all"
          />

          {/* Quick Search Dropdown */}
          {showSearchResults && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-brand-border rounded-xl shadow-dropdown py-2 z-50">
              <div className="px-3 py-1 text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
                Matching Students & Records
              </div>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelectStudent(st.id)}
                    className="w-full px-3 py-2 text-left hover:bg-brand-cyanBg flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-brand-textPrimary">{st.name}</div>
                        <div className="text-[11px] text-brand-textSecondary">
                          Class {st.class}-{st.section} • Roll #{st.rollNo} • {st.subjects.join(', ')}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        st.riskLevel === 'High'
                          ? 'bg-red-50 text-brand-danger'
                          : st.riskLevel === 'Medium'
                          ? 'bg-amber-50 text-brand-warning'
                          : 'bg-emerald-50 text-brand-emerald'
                      }`}
                    >
                      {st.riskLevel} Risk
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-center text-brand-textSecondary">
                  No matching students or topics found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right controls: Demo Tag, Notifications, User Profile */}
      <div className="flex items-center gap-3">
        {/* Backend mode pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-brand-cyanBg/80 border-brand-border text-brand-textSecondary">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-emerald" />
          <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Demo Mode'}</span>
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-brand-textSecondary hover:text-brand-textPrimary hover:bg-brand-cyanBg rounded-xl transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-danger rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-brand-border rounded-xl shadow-dropdown py-2 z-50">
              <div className="px-3 py-2 border-b border-brand-borderLight flex items-center justify-between">
                <span className="text-xs font-semibold text-brand-textPrimary">Notifications (3)</span>
                <span className="text-[11px] text-brand-emerald cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-brand-borderLight max-h-72 overflow-y-auto">
                <div className="p-3 text-xs hover:bg-brand-cyanBg/50 cursor-pointer">
                  <div className="flex items-center gap-1.5 text-brand-danger font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-danger"></span>
                    High Academic Risk Detected
                  </div>
                  <div className="mt-1 text-brand-textSecondary text-[11px]">
                    Rohan Mehta missed 2 classes this week. Catch-up intervention required.
                  </div>
                  <div className="mt-1 text-[10px] text-gray-400">10 mins ago</div>
                </div>

                <div className="p-3 text-xs hover:bg-brand-cyanBg/50 cursor-pointer">
                  <div className="flex items-center gap-1.5 text-brand-emerald font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald"></span>
                    Peer Study Match Connected
                  </div>
                  <div className="mt-1 text-brand-textSecondary text-[11px]">
                    Aarav Sharma accepted study session invitation for Mathematics.
                  </div>
                  <div className="mt-1 text-[10px] text-gray-400">1 hour ago</div>
                </div>

                <div className="p-3 text-xs hover:bg-brand-cyanBg/50 cursor-pointer">
                  <div className="flex items-center gap-1.5 text-brand-info font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-info"></span>
                    Parent Meeting Confirmed
                  </div>
                  <div className="mt-1 text-brand-textSecondary text-[11px]">
                    Mrs. Sneha Gupta confirmed appointment for Monday 4:00 PM.
                  </div>
                  <div className="mt-1 text-[10px] text-gray-400">3 hours ago</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Teacher Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-2 py-1 hover:bg-brand-cyanBg rounded-xl transition-colors"
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Teacher profile"
              className="w-8 h-8 rounded-full object-cover border border-brand-border"
            />
            <span className="hidden sm:inline-block text-xs font-semibold text-brand-textPrimary">
              Teacher
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary hidden sm:inline-block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-brand-border rounded-xl shadow-dropdown py-1 z-50">
              <div className="px-3 py-2 border-b border-brand-borderLight">
                <div className="text-xs font-semibold text-brand-textPrimary">Mrs. Anjali Deshmukh</div>
                <div className="text-[11px] text-brand-textSecondary">Senior Mathematics Teacher</div>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  navigate('/settings');
                }}
                className="w-full px-3 py-2 text-left text-xs text-brand-textPrimary hover:bg-brand-cyanBg flex items-center gap-2"
              >
                Teacher Settings
              </button>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  resetDemoData();
                }}
                className="w-full px-3 py-2 text-left text-xs text-brand-textSecondary hover:bg-brand-cyanBg flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Data
              </button>

              <div className="border-t border-brand-borderLight mt-1 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    showToast('Logged Out', 'Signed out of session safely.', 'info');
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-brand-danger hover:bg-red-50 flex items-center gap-2"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
