import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  TrendingUp,
  ClipboardCheck,
  BarChart3,
  Settings,
  BookOpen,
  Users2,
  AlertCircle,
  MessageSquare,
  GraduationCap,
  X
} from 'lucide-react';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Home', path: '/home', icon: Home },
  { name: 'Students', path: '/students', icon: Users },
  { name: 'Predictions', path: '/predictions', icon: TrendingUp },
  { name: 'Attendance', path: '/attendance', icon: ClipboardCheck },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'Daily Learning', path: '/daily-learning', icon: BookOpen },
  { name: 'Peer Learning', path: '/peer-learning', icon: Users2 },
  { name: 'Learning Gaps', path: '/learning-gaps', icon: AlertCircle },
  { name: 'Parent Connect', path: '/parent-connect', icon: MessageSquare },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-52 bg-brand-dark text-white flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#004e50] shadow-xl lg:shadow-none`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#005153]">
          <NavLink to="/daily-learning" className="flex items-center gap-2.5 font-bold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-brand-emerald flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-lg text-white font-semibold">EduGuard</span>
          </NavLink>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-300 hover:text-white rounded-md"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-brand-emerald text-white shadow-sm'
                      : 'text-[#96b8be] hover:bg-[#004e50] hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* School Info Footer */}
        <div className="p-4 border-t border-[#005153] bg-[#003839]">
          <div className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
            St. Xavier's High
          </div>
          <div className="text-[10px] text-[#86a8ae] truncate">Academic Year 2025-26</div>
        </div>
      </aside>
    </>
  );
};
