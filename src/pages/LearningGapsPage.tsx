import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Search,
  Filter,
  ArrowUpDown,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { LearningGapOverviewItem } from '../types';

export const LearningGapsPage: React.FC = () => {
  const navigate = useNavigate();
  const { learningGaps, showToast } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [timeRange, setTimeRange] = useState('Last 30 days');
  const [sortBy, setSortBy] = useState<'avgScore' | 'missedTopicsCount'>('avgScore');
  const [sortAsc, setSortAsc] = useState(true);

  // Filtered and sorted learning gaps
  const filteredGaps = learningGaps
    .filter((item) => {
      const matchSearch =
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSubject =
        selectedSubject === 'All Subjects' || item.subject === selectedSubject;

      return matchSearch && matchSubject;
    })
    .sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      return sortAsc ? valA - valB : valB - valA;
    });

  const toggleSort = (field: 'avgScore' | 'missedTopicsCount') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
            Learning Gap Tracking
          </h1>
          <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
            Identify learning gaps, track progress and get targeted support.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Class selector */}
          <div className="relative">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald shadow-subtle cursor-pointer"
            >
              <option value="All Classes">All Classes</option>
              <option value="Class 9">Class 9</option>
              <option value="Class 10">Class 10</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Subject selector */}
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald shadow-subtle cursor-pointer"
            >
              <option value="All Subjects">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Social Studies">Social Studies</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Date Range selector */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-brand-border rounded-xl text-xs font-semibold text-brand-textPrimary focus:outline-none focus:border-brand-emerald shadow-subtle cursor-pointer"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="This Term">This Term</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-brand-textSecondary absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Students */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] text-brand-textSecondary font-semibold uppercase tracking-wider">
              Total Students
            </div>
            <div className="text-2xl font-bold text-brand-textPrimary mt-0.5">42</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-cyanBg flex items-center justify-center text-brand-textPrimary">
            <Users className="w-5 h-5 text-brand-dark" />
          </div>
        </div>

        {/* At Risk Students */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] text-brand-textSecondary font-semibold uppercase tracking-wider">
              At Risk Students
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-brand-danger">8</span>
              <span className="text-xs font-semibold text-brand-danger bg-red-50 px-2 py-0.5 rounded-full">
                19%
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-brand-danger">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Improving */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] text-brand-textSecondary font-semibold uppercase tracking-wider">
              Improving
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-brand-info">21</span>
              <span className="text-xs font-semibold text-brand-info bg-cyan-50 px-2 py-0.5 rounded-full">
                50%
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-brand-info">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* On Track */}
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] text-brand-textSecondary font-semibold uppercase tracking-wider">
              On Track
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-brand-emerald">13</span>
              <span className="text-xs font-semibold text-brand-emerald bg-emerald-50 px-2 py-0.5 rounded-full">
                31%
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-brand-emerald">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Learning Gap Overview Table Card */}
      <div className="bg-white border border-brand-border rounded-2xl shadow-subtle overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4 border-b border-brand-borderLight flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-brand-textPrimary uppercase tracking-wider">
            Learning Gap Overview
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-brand-textMuted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by student or subject..."
              className="w-full pl-9 pr-3 py-1.5 bg-brand-cyanBg/50 border border-brand-border rounded-xl text-xs text-brand-textPrimary placeholder:text-brand-textMuted focus:outline-none focus:border-brand-emerald"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-cyanBg/60 text-brand-textSecondary font-semibold uppercase text-[10px] tracking-wider border-b border-brand-border">
              <tr>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-4 py-3.5">Class</th>
                <th className="px-4 py-3.5">Subject</th>
                <th
                  onClick={() => toggleSort('missedTopicsCount')}
                  className="px-4 py-3.5 cursor-pointer hover:text-brand-textPrimary"
                >
                  <div className="flex items-center gap-1">
                    <span>Missed Topics</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('avgScore')}
                  className="px-4 py-3.5 cursor-pointer hover:text-brand-textPrimary"
                >
                  <div className="flex items-center gap-1">
                    <span>Avg. Score</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight">
              {filteredGaps.map((row) => (
                <tr key={row.id} className="hover:bg-brand-cyanBg/30 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-brand-textPrimary whitespace-nowrap">
                    {row.studentName}
                  </td>
                  <td className="px-4 py-3.5 text-brand-textSecondary">{row.class}</td>
                  <td className="px-4 py-3.5 text-brand-textPrimary font-medium">{row.subject}</td>
                  <td className="px-4 py-3.5 text-brand-textSecondary font-semibold">
                    {row.missedTopicsCount}
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-brand-textPrimary">
                    {row.avgScore}%
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'High'
                          ? 'bg-rose-100 text-rose-700'
                          : row.status === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => navigate(`/learning-gaps/student/${row.studentId}`)}
                      className="px-3.5 py-1 bg-white border border-brand-border hover:border-brand-emerald hover:text-brand-emerald text-brand-dark rounded-lg font-semibold text-xs transition-colors shadow-2xs"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
