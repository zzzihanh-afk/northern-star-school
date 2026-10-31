import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import {
  Users,
  GraduationCap,
  Layers,
  Briefcase,
  TrendingUp,
  UserPlus,
  BookPlus,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  School,
  FileCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const stats = dataService.getAdminStats();

  const [activeDivisionFilter, setActiveDivisionFilter] = useState<'all' | 'school' | 'college'>('all');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            {t('nav_dashboard')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            Welcome back, Admin! Here's what's happening at Northern Star School & College.
          </p>
        </div>
      </div>

      {/* 4 STAT METRIC CARDS (Matching Reference Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Students (Blue) */}
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-status-green bg-status-green-light px-2 py-0.5 rounded-full">
              {stats.studentsChange}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-muted uppercase tracking-wider">
              {t('totalStudents')}
            </p>
            <h3 className="text-2xl font-bold text-navy-950 mt-1">
              {toLocaleNumber(stats.totalStudents.toLocaleString(), language)}
            </h3>
          </div>
        </div>

        {/* Card 2: Total Teachers (Green) */}
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-status-green text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-status-green bg-status-green-light px-2 py-0.5 rounded-full">
              {stats.teachersChange}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-muted uppercase tracking-wider">
              {t('totalTeachers')}
            </p>
            <h3 className="text-2xl font-bold text-navy-950 mt-1">
              {toLocaleNumber(stats.totalTeachers, language)}
            </h3>
          </div>
        </div>

        {/* Card 3: Total Classes (Purple) */}
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-status-violet text-white flex items-center justify-center shadow-sm">
              <Layers className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {stats.classesChange}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-muted uppercase tracking-wider">
              {t('totalClasses')}
            </p>
            <h3 className="text-2xl font-bold text-navy-950 mt-1">
              {toLocaleNumber(stats.totalClasses, language)}
            </h3>
          </div>
        </div>

        {/* Card 4: Total Staff (Amber/Orange) */}
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-status-orange text-white flex items-center justify-center shadow-sm">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-xs font-semibold text-status-green bg-status-green-light px-2 py-0.5 rounded-full">
              {stats.staffChange}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-slate-muted uppercase tracking-wider">
              {t('totalStaff')}
            </p>
            <h3 className="text-2xl font-bold text-navy-950 mt-1">
              {toLocaleNumber(stats.totalStaff, language)}
            </h3>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID (Matching Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ENROLLMENT CHART & QUICK ACTIONS (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Chart Card */}
          <div className="bg-surface rounded-xl p-5 sm:p-6 border border-slate-border shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-base font-bold text-navy-950">
                  {t('studentEnrollmentOverview')}
                </h3>
                <p className="text-xs text-slate-muted">School vs College annual trends</p>
              </div>

              {/* Chart Legend (from reference image: School = Blue, College = Purple) */}
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-royal" />
                  <span className="text-slate-600">School</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-status-violet" />
                  <span className="text-slate-600">College</span>
                </div>
              </div>
            </div>

            {/* Recharts Line Chart */}
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.enrollmentTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 1200]}
                    ticks={[0, 300, 600, 900, 1200]}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="school"
                    stroke="#1769E8"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#1769E8' }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="college"
                    stroke="#8B5CF6"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#8B5CF6' }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions (from reference image) */}
          <div className="bg-surface rounded-xl p-5 sm:p-6 border border-slate-border shadow-card">
            <h3 className="text-base font-bold text-navy-950 mb-4">
              {t('quickActions')}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {/* Add Student */}
              <button
                type="button"
                onClick={() => navigate('/admin/students?action=new')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-border bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all duration-200 group text-center"
              >
                <div className="w-11 h-11 rounded-full bg-blue-100 text-royal flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <UserPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-navy-900 group-hover:text-royal">
                  {t('addStudent')}
                </span>
              </button>

              {/* Add Teacher */}
              <button
                type="button"
                onClick={() => navigate('/admin/teachers?action=new')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-border bg-slate-50/50 hover:bg-green-50/50 hover:border-green-200 transition-all duration-200 group text-center"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-100 text-status-green flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-navy-900 group-hover:text-status-green">
                  {t('addTeacher')}
                </span>
              </button>

              {/* Create Class */}
              <button
                type="button"
                onClick={() => navigate('/admin/classes?action=new')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-border bg-slate-50/50 hover:bg-purple-50/50 hover:border-purple-200 transition-all duration-200 group text-center"
              >
                <div className="w-11 h-11 rounded-full bg-purple-100 text-status-violet flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <BookPlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-navy-900 group-hover:text-status-violet">
                  {t('createClass')}
                </span>
              </button>

              {/* Fee Collection */}
              <button
                type="button"
                onClick={() => navigate('/admin/fees?action=collect')}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-border bg-slate-50/50 hover:bg-amber-50/50 hover:border-amber-200 transition-all duration-200 group text-center"
              >
                <div className="w-11 h-11 rounded-full bg-amber-100 text-status-orange flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <DollarSign className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-navy-900 group-hover:text-status-orange">
                  {t('feeCollection')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT ACTIVITIES & UPCOMING EVENTS (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Activities Card */}
          <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
            <h3 className="text-base font-bold text-navy-950 mb-4">
              {t('recentActivities')}
            </h3>

            <div className="space-y-4">
              {stats.recentActivities.map((act) => {
                let badgeClass = 'bg-blue-100 text-royal';
                if (act.badgeColor === 'green') badgeClass = 'bg-emerald-100 text-status-green';
                if (act.badgeColor === 'red') badgeClass = 'bg-rose-100 text-status-red';

                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-full ${badgeClass} flex items-center justify-center shrink-0 mt-0.5`}>
                      {act.type === 'student' && <UserPlus className="w-4 h-4" />}
                      {act.type === 'payment' && <CreditCard className="w-4 h-4" />}
                      {act.type === 'attendance' && <CheckCircle2 className="w-4 h-4" />}
                      {act.type === 'exam' && <FileCheck className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-dark leading-tight">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {act.detail}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {act.timeAgo}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events Card */}
          <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-royal" />
                <span>{t('upcomingEvents')}</span>
              </h3>
              <button
                type="button"
                onClick={() => navigate('/admin/events')}
                className="text-xs font-semibold text-royal hover:underline"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-status-green" />
                  <span className="text-xs font-semibold text-slate-dark">
                    Annual Sports Day
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  26 Apr 2025
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/70 border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-royal" />
                  <span className="text-xs font-semibold text-slate-dark">
                    Parent-Teacher Meeting
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500">
                  30 Apr 2025
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
