import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Brain,
  CheckCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';
import { useAppStore } from '../services/store';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

export const PredictionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { students, showToast } = useAppStore();

  const highRiskStudents = students.filter((s) => s.riskLevel === 'High');
  const mediumRiskStudents = students.filter((s) => s.riskLevel === 'Medium');
  const lowRiskStudents = students.filter((s) => s.riskLevel === 'Low');

  // Recharts Pie Data
  const riskPieData = [
    { name: 'High Risk', value: highRiskStudents.length, color: '#F06464' },
    { name: 'Medium Risk', value: mediumRiskStudents.length, color: '#F5A623' },
    { name: 'Low / On Track', value: lowRiskStudents.length, color: '#008A62' },
  ];

  // Subject Gap Distribution
  const subjectGapData = [
    { subject: 'Mathematics', atRisk: 5, improving: 8 },
    { subject: 'Science', atRisk: 3, improving: 6 },
    { subject: 'English', atRisk: 2, improving: 10 },
    { subject: 'Social Studies', atRisk: 2, improving: 7 },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
          Academic Risk Predictions & Early Warning Engine
        </h1>
        <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
          Machine learning indicators forecasting term performance gaps, attendance drop-offs, and board exam readiness.
        </p>
      </div>

      {/* Top 3 Risk Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
              High Intervention Alert
            </div>
            <div className="text-2xl font-bold text-brand-danger mt-1">
              {highRiskStudents.length} Students
            </div>
            <div className="text-[11px] text-brand-textSecondary mt-0.5">
              Score probability &lt; 50%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-brand-danger flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
              Moderate Risk Watchlist
            </div>
            <div className="text-2xl font-bold text-brand-warning mt-1">
              {mediumRiskStudents.length} Students
            </div>
            <div className="text-[11px] text-brand-textSecondary mt-0.5">
              Need peer mentorship
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-brand-warning flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-2xl p-4 sm:p-5 shadow-subtle flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-brand-textSecondary uppercase tracking-wider">
              Early Intervention Success
            </div>
            <div className="text-2xl font-bold text-brand-emerald mt-1">
              78% Accuracy
            </div>
            <div className="text-[11px] text-brand-textSecondary mt-0.5">
              Recovery with catch-up plans
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-emerald flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Visual Charts: Pie Chart and Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Risk Distribution Pie Chart (Span 5) */}
        <div className="lg:col-span-5 bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-3">
          <h2 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider">
            Overall Risk Distribution
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} students`, name]}
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #D5EFF1',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-[11px]">
            {riskPieData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Gap Breakdown (Span 7) */}
        <div className="lg:col-span-7 bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-3">
          <h2 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider">
            Subject-wise Academic Gap Distribution
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectGapData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0FBFC" />
                <XAxis dataKey="subject" tick={{ fontSize: 10, fill: '#718A94' }} />
                <YAxis tick={{ fontSize: 10, fill: '#718A94' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #D5EFF1',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="atRisk" name="At-Risk" fill="#F06464" radius={[4, 4, 0, 0]} />
                <Bar dataKey="improving" name="Improving / Safe" fill="#008A62" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-danger" />
              <span>At Risk</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-emerald" />
              <span>Improving / Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explainable Risk Factors & Priority Remediation Cards */}
      <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-subtle space-y-4">
        <h2 className="text-sm font-bold text-brand-textPrimary uppercase tracking-wider">
          Explainable AI Risk Factors & Targeted Interventions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Rohan Mehta */}
          <div className="p-4 rounded-xl border border-brand-border hover:border-brand-emerald bg-brand-cyanBg/20 space-y-3 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80"
                  alt="Rohan Mehta"
                  className="w-9 h-9 rounded-full object-cover border border-brand-border"
                />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-brand-textPrimary">
                    Rohan Mehta (Class 10-A)
                  </h3>
                  <div className="text-[10px] text-brand-textSecondary">
                    Predicted term score: 44% (Probable fail without intervention)
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                High Risk
              </span>
            </div>

            <div className="text-xs space-y-1 text-brand-textSecondary">
              <div className="font-semibold text-brand-dark">Contributing Risk Factors:</div>
              <ul className="text-[11px] list-disc list-inside space-y-0.5 pl-1">
                <li>Missed 2 foundational classes in Quadratic factorisation.</li>
                <li>Zero submission on Homework Set 1A.</li>
                <li>Attendance dropped 14% below class benchmark.</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-brand-borderLight flex items-center justify-between">
              <span className="text-[11px] font-semibold text-brand-emerald">
                Recommended: 4-Step Support Plan
              </span>
              <button
                onClick={() => navigate('/learning-gaps/student/rohan-mehta/support')}
                className="px-3 py-1 bg-brand-emerald text-white rounded-lg text-xs font-semibold hover:bg-brand-emeraldHover"
              >
                Launch Plan
              </button>
            </div>
          </div>

          {/* Card 2: Karan Verma */}
          <div className="p-4 rounded-xl border border-brand-border hover:border-brand-emerald bg-brand-cyanBg/20 space-y-3 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
                  alt="Karan Verma"
                  className="w-9 h-9 rounded-full object-cover border border-brand-border"
                />
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-brand-textPrimary">
                    Karan Verma (Class 10-A)
                  </h3>
                  <div className="text-[10px] text-brand-textSecondary">
                    Predicted term score: 38% (High absentee correlation)
                  </div>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                High Risk
              </span>
            </div>

            <div className="text-xs space-y-1 text-brand-textSecondary">
              <div className="font-semibold text-brand-dark">Contributing Risk Factors:</div>
              <ul className="text-[11px] list-disc list-inside space-y-0.5 pl-1">
                <li>3 unexcused absences in the past 7 school days.</li>
                <li>Parent communication unresponsive to SMS.</li>
              </ul>
            </div>

            <div className="pt-2 border-t border-brand-borderLight flex items-center justify-between">
              <span className="text-[11px] font-semibold text-brand-warning">
                Recommended: Direct Phone Call & Parent Conference
              </span>
              <button
                onClick={() => navigate('/parent-connect')}
                className="px-3 py-1 bg-brand-emerald text-white rounded-lg text-xs font-semibold hover:bg-brand-emeraldHover"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
