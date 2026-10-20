import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  FileSpreadsheet,
  CheckCircle,
  TrendingUp,
  FileText,
  Filter
} from 'lucide-react';
import { useAppStore } from '../services/store';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export const ReportsPage: React.FC = () => {
  const { students, learningGaps, parentRecords, showToast } = useAppStore();
  const [reportType, setReportType] = useState<'academic' | 'attendance' | 'parent'>('academic');

  // Trend line chart data
  const trendData = [
    { week: 'Week 1', avgScore: 62, attendance: 95 },
    { week: 'Week 2', avgScore: 66, attendance: 91 },
    { week: 'Week 3', avgScore: 69, attendance: 88 },
    { week: 'Week 4', avgScore: 74, attendance: 93 },
    { week: 'Week 5', avgScore: 78, attendance: 96 },
  ];

  // Real CSV export generator
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'academic') {
      csvContent += 'Student Name,Class,Section,Roll No,Avg Score,Risk Level,Missed Classes\n';
      students.forEach((s) => {
        csvContent += `"${s.name}","${s.class}","${s.section}","${s.rollNo}",${s.avgScore},"${s.riskLevel}",${s.missedClassesThisWeek}\n`;
      });
    } else if (reportType === 'parent') {
      csvContent += 'Student Name,Message Type,Channel,Date,Status,Message Text\n';
      parentRecords.forEach((p) => {
        csvContent += `"${p.studentName}","${p.messageType}","${p.channel}","${p.date}","${p.status}","${p.messageText.replace(/"/g, '""')}"\n`;
      });
    } else {
      csvContent += 'Week,Average Score %,Attendance %\n';
      trendData.forEach((t) => {
        csvContent += `"${t.week}",${t.avgScore},${t.attendance}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EduGuard_${reportType}_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', `Generated EduGuard ${reportType} CSV spreadsheet.`, 'success');
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
            Academic Performance & Intervention Reports
          </h1>
          <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
            Audit learning trends, track remediation efficacy, and export verified records to CSV.
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-brand-emerald hover:bg-brand-emeraldHover text-white rounded-xl text-xs font-semibold shadow-xs self-start sm:self-auto transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export {reportType.toUpperCase()} to CSV</span>
        </button>
      </div>

      {/* Report Categories Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-brand-border text-xs max-w-md">
        {(
          [
            { id: 'academic', label: 'Academic & Learning Gaps' },
            { id: 'attendance', label: 'Term Attendance Analytics' },
            { id: 'parent', label: 'Parent Engagement Records' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id)}
            className={`flex-1 py-2 rounded-xl font-semibold transition-all ${
              reportType === tab.id
                ? 'bg-brand-emerald text-white shadow-xs'
                : 'text-brand-textSecondary hover:text-brand-textPrimary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Progress Line Chart */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider">
            5-Week Remediation Score Trajectory vs Attendance
          </h2>
          <span className="text-xs font-medium text-brand-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full">
            +16% Score Growth
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0FBFC" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#718A94' }} />
              <YAxis tick={{ fontSize: 11, fill: '#718A94' }} domain={[50, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #D5EFF1',
                  fontSize: '11px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="avgScore"
                name="Average Student Score %"
                stroke="#008A62"
                strokeWidth={3}
                dot={{ r: 4, fill: '#008A62' }}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance Rate %"
                stroke="#38A9D8"
                strokeWidth={2}
                dot={{ r: 3, fill: '#38A9D8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Audit Records Table */}
      <div className="bg-white border border-brand-border rounded-2xl shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-brand-borderLight flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-brand-textPrimary">
            Generated Report Data Preview
          </h3>
          <span className="text-[11px] text-brand-textSecondary">
            {students.length} verified student records ready for board submission
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-cyanBg/60 text-brand-textSecondary font-semibold uppercase text-[10px] tracking-wider border-b border-brand-border">
              <tr>
                <th className="px-5 py-3">Student Name</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Avg Score</th>
                <th className="px-4 py-3">Attendance Rate</th>
                <th className="px-4 py-3">Risk Assessment</th>
                <th className="px-5 py-3 text-right">Intervention Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-borderLight">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-brand-cyanBg/30 transition-colors">
                  <td className="px-5 py-3 font-bold text-brand-textPrimary">{st.name}</td>
                  <td className="px-4 py-3 text-brand-textSecondary">Class {st.class}-{st.section}</td>
                  <td className="px-4 py-3 font-semibold text-brand-dark">{st.avgScore}%</td>
                  <td className="px-4 py-3 text-brand-textSecondary">{st.attendanceRate}%</td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-brand-emerald">
                    {st.missedClassesThisWeek > 0 ? 'Catch-up Active' : 'Regular Pathway'}
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
