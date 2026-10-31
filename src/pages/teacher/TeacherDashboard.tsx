import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import {
  Layers,
  CalendarCheck,
  Award,
  BookMarked,
  Clock,
  Users,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TeacherDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const routine = dataService.getRoutine().filter(r => r.teacherName.includes('Farhana') || r.teacherName.includes('Anisur'));
  const classes = dataService.getClasses();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
          Teacher Workspace
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
          Welcome back, Ms. Farhana Akhter! Manage your classes, student attendance, and grades.
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-royal flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-muted uppercase font-semibold">Assigned Classes</p>
            <p className="text-xl font-bold text-navy-950 mt-0.5">{toLocaleNumber(4, language)}</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-status-green flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-muted uppercase font-semibold">Total Students</p>
            <p className="text-xl font-bold text-navy-950 mt-0.5">{toLocaleNumber(168, language)}</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-status-orange flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-muted uppercase font-semibold">Today's Periods</p>
            <p className="text-xl font-bold text-navy-950 mt-0.5">{toLocaleNumber(3, language)}</p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-status-violet flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-muted uppercase font-semibold">Pending Grades</p>
            <p className="text-xl font-bold text-navy-950 mt-0.5">{toLocaleNumber(1, language)} Class</p>
          </div>
        </div>
      </div>

      {/* WORKSPACE ACTIONS & ROUTINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Actions & Today's Schedule */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-slate-border shadow-card">
            <h3 className="text-base font-bold text-navy-950 mb-4">
              Quick Teaching Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => navigate('/teacher/attendance')}
                className="p-4 rounded-xl border border-slate-200 hover:border-royal hover:bg-blue-50/40 transition-all flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-status-green flex items-center justify-center shrink-0">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy-950">Take Attendance</h4>
                  <p className="text-[11px] text-slate-500">Record daily class presence</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/teacher/marks')}
                className="p-4 rounded-xl border border-slate-200 hover:border-royal hover:bg-blue-50/40 transition-all flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-royal flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy-950">Enter Exam Marks</h4>
                  <p className="text-[11px] text-slate-500">Term examinations grading</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate('/teacher/assignments')}
                className="p-4 rounded-xl border border-slate-200 hover:border-royal hover:bg-blue-50/40 transition-all flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-status-violet flex items-center justify-center shrink-0">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy-950">New Assignment</h4>
                  <p className="text-[11px] text-slate-500">Post homework & tasks</p>
                </div>
              </button>
            </div>
          </div>

          {/* Today's Teaching Schedule */}
          <div className="bg-surface rounded-xl p-6 border border-slate-border shadow-card">
            <h3 className="text-base font-bold text-navy-950 mb-4">
              Today's Teaching Schedule
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-royal bg-blue-100 px-2.5 py-1 rounded-md">
                    08:30 - 09:20
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-navy-950">Class 9 (Science) — Mathematics</h5>
                    <p className="text-[11px] text-slate-500">Room 101 • 45 Students</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-status-green bg-emerald-50 px-2 py-0.5 rounded">
                  Completed
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-royal bg-blue-100 px-2.5 py-1 rounded-md">
                    10:30 - 11:20
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-navy-950">Class 7 (Science-A) — General Mathematics</h5>
                    <p className="text-[11px] text-slate-500">Room 204 • 40 Students</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-royal bg-blue-50 px-2 py-0.5 rounded">
                  Upcoming
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Classes List */}
        <div className="lg:col-span-4 bg-surface rounded-xl p-6 border border-slate-border shadow-card">
          <h3 className="text-base font-bold text-navy-950 mb-4">
            My Assigned Classes
          </h3>
          <div className="space-y-3">
            {classes.slice(0, 4).map(c => (
              <div key={c.id} className="p-3 rounded-lg border border-slate-200 hover:border-royal transition-all flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-navy-950">{c.name}</h4>
                  <p className="text-[11px] text-slate-400 capitalize">{c.division} Division</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
