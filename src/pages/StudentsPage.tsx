import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  BookOpen,
  MessageSquare,
  Sparkles,
  TrendingUp,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { Student } from '../types';

export const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { students } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.subjects.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass =
      selectedClass === 'All Classes' || `Class ${s.class}` === selectedClass;

    const matchesRisk =
      selectedRisk === 'All' || s.riskLevel === selectedRisk;

    return matchesSearch && matchesClass && matchesRisk;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
            Student Directory & Academic Profiles
          </h1>
          <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
            Monitor student attendance, subject mastery scores, learning risks, and contact parents.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex bg-white p-1 rounded-xl border border-brand-border">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-brand-emerald text-white shadow-xs'
                  : 'text-brand-textSecondary hover:text-brand-textPrimary'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-brand-emerald text-white shadow-xs'
                  : 'text-brand-textSecondary hover:text-brand-textPrimary'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-brand-textMuted absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or subject..."
            className="w-full pl-9 pr-4 py-2 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-xs sm:text-sm text-brand-textPrimary placeholder:text-brand-textMuted focus:outline-none focus:border-brand-emerald"
          />
        </div>

        {/* Class Filter */}
        <div className="relative w-full md:w-44">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald cursor-pointer"
          >
            <option value="All Classes">All Classes</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary absolute right-2.5 top-3 pointer-events-none" />
        </div>

        {/* Risk Filter */}
        <div className="relative w-full md:w-40">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="w-full appearance-none pl-3 pr-8 py-2 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald cursor-pointer"
          >
            <option value="All">All Risk Levels</option>
            <option value="High">High Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="Low">Low Risk</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary absolute right-2.5 top-3 pointer-events-none" />
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle hover:border-brand-emerald/70 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Top Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-11 h-11 rounded-full object-cover border border-brand-border shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-brand-textPrimary">{st.name}</h3>
                      <div className="text-[11px] text-brand-textSecondary">
                        Class {st.class}-{st.section} • Roll #{st.rollNo}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      st.riskLevel === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : st.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {st.riskLevel}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-brand-cyanBg/40 border border-brand-border rounded-xl text-center">
                  <div>
                    <div className="text-[9px] text-brand-textSecondary font-semibold uppercase">Avg Score</div>
                    <div className="text-xs font-bold text-brand-textPrimary">{st.avgScore}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-brand-textSecondary font-semibold uppercase">Attendance</div>
                    <div className="text-xs font-bold text-brand-textPrimary">{st.attendanceRate}%</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-brand-textSecondary font-semibold uppercase">Missed</div>
                    <div className="text-xs font-bold text-rose-700">{st.missedClassesThisWeek} w/k</div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {st.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-cyanBg text-brand-dark"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-brand-borderLight flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/daily-learning/student/${st.id}`)}
                  className="flex-1 py-1.5 px-2 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-lg text-xs font-semibold transition-colors text-center"
                >
                  Catch-up Plan
                </button>

                <button
                  onClick={() => navigate('/parent-connect')}
                  className="p-1.5 border border-brand-border hover:border-brand-emerald text-brand-dark rounded-lg bg-white transition-colors"
                  title="Message Parent"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white border border-brand-border rounded-2xl shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-brand-cyanBg/60 text-brand-textSecondary font-semibold uppercase text-[10px] tracking-wider border-b border-brand-border">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-4 py-3.5">Class</th>
                  <th className="px-4 py-3.5">Subjects</th>
                  <th className="px-4 py-3.5">Avg Score</th>
                  <th className="px-4 py-3.5">Attendance</th>
                  <th className="px-4 py-3.5">Missed Classes</th>
                  <th className="px-4 py-3.5">Risk Level</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-borderLight">
                {filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-brand-cyanBg/30 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-7 h-7 rounded-full object-cover border border-brand-border"
                      />
                      <div>
                        <div className="font-bold text-brand-textPrimary">{st.name}</div>
                        <div className="text-[10px] text-brand-textSecondary">Roll #{st.rollNo}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-brand-textSecondary">
                      Class {st.class}-{st.section}
                    </td>
                    <td className="px-4 py-3.5 text-brand-dark font-medium">
                      {st.subjects.join(', ')}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-brand-textPrimary">{st.avgScore}%</td>
                    <td className="px-4 py-3.5 font-medium text-brand-textSecondary">
                      {st.attendanceRate}%
                    </td>
                    <td className="px-4 py-3.5 font-bold text-rose-700">
                      {st.missedClassesThisWeek} this week
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          st.riskLevel === 'High'
                            ? 'bg-rose-100 text-rose-700'
                            : st.riskLevel === 'Medium'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {st.riskLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => navigate(`/daily-learning/student/${st.id}`)}
                        className="px-3 py-1 bg-brand-emerald text-white hover:bg-brand-emeraldHover rounded-lg font-semibold text-xs transition-colors"
                      >
                        Catch-up Plan
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
