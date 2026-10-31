import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import {
  Users,
  IdCard,
  CalendarCheck,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CreditCard,
  BookMarked,
  CheckCircle,
  AlertCircle,
  FileText,
  ChevronRight,
  School
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dynamic student record lookup from authenticated user credentials set by administrator
  const student = (user?.metadata?.studentId ? dataService.getStudentById(user.metadata.studentId) : null) ||
                  dataService.getStudents().find(s => s.fullName.toLowerCase() === user?.displayName?.toLowerCase()) ||
                  dataService.getStudentById('stu-rafiq');

  const routine = dataService.getRoutine(student?.classId || 'c-9');
  const notices = dataService.getNotices('students').slice(0, 4);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
          Student Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
          Welcome back, {student?.fullName || user?.displayName || 'Rafiq Hasan'}! Keep up the good work!
        </p>
      </div>

      {/* HERO BANNER (Matching reference image: "Dream Big Achieve More") */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-royal text-white p-6 sm:p-8 shadow-card flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gold text-xs font-semibold backdrop-blur-xs mb-3 border border-white/10">
            <span>Academic Session 2025</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wide leading-tight">
            {t('dreamBigTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mt-2 font-normal leading-relaxed">
            {t('dreamBigSubtitle')}
          </p>
        </div>

        {/* Institution Architectural Motif Graphic */}
        <div className="relative z-10 shrink-0 hidden md:block">
          <div className="w-52 h-28 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 p-3 flex flex-col items-center justify-center text-center">
            <School className="w-10 h-10 text-gold mb-1" />
            <span className="text-[11px] font-serif font-bold tracking-wider uppercase text-white">Northern Star Campus</span>
            <span className="text-[9px] text-blue-200">Main Building & Auditorium</span>
          </div>
        </div>

        {/* Background glow & subtle stars */}
        <div className="absolute right-0 top-0 -bottom-10 w-96 bg-royal/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 STAT METRIC CARDS ROW (From Reference Image) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Class */}
        <div className="bg-surface rounded-xl p-4 sm:p-5 border border-slate-border shadow-card flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-royal flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-muted uppercase">
              {t('class')}
            </p>
            <p className="text-sm sm:text-base font-bold text-navy-950 mt-0.5">
              {student?.className || '9 (Science)'}
            </p>
          </div>
        </div>

        {/* Roll No */}
        <div className="bg-surface rounded-xl p-4 sm:p-5 border border-slate-border shadow-card flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-royal flex items-center justify-center shrink-0">
            <IdCard className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-muted uppercase">
              {t('rollNo')}
            </p>
            <p className="text-xs sm:text-sm font-bold text-navy-950 mt-0.5 font-mono">
              {student?.rollNo || 'NSC-2025-0147'}
            </p>
          </div>
        </div>

        {/* Attendance */}
        <div className="bg-surface rounded-xl p-4 sm:p-5 border border-slate-border shadow-card flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-status-green flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-muted uppercase">
              {t('attendanceRate')}
            </p>
            <p className="text-sm sm:text-base font-bold text-status-green mt-0.5">
              {toLocaleNumber('92%', language)}
            </p>
          </div>
        </div>

        {/* Next Exam */}
        <div className="bg-surface rounded-xl p-4 sm:p-5 border border-slate-border shadow-card flex items-center gap-3 sm:gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-status-orange flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-muted uppercase">
              {t('nextExam')}
            </p>
            <p className="text-xs sm:text-sm font-bold text-navy-950 mt-0.5 leading-tight">
              Final Term <span className="block text-[11px] font-normal text-slate-500">12 May 2025</span>
            </p>
          </div>
        </div>
      </div>

      {/* TWO COLUMN GRID: TODAY'S CLASSES & NOTICES/QUICK LINKS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: TODAY'S CLASSES TABLE (col-span-8) */}
        <div className="lg:col-span-8 bg-surface rounded-xl p-5 sm:p-6 border border-slate-border shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-950">
                {t('todaysClasses')}
              </h3>
              <button
                type="button"
                onClick={() => navigate('/student/routine')}
                className="text-xs font-semibold text-royal hover:underline"
              >
                {t('viewFullRoutine')}
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 font-semibold">Time</th>
                    <th className="py-2.5 font-semibold">Subject</th>
                    <th className="py-2.5 font-semibold">Room</th>
                    <th className="py-2.5 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Class 1: Attended */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-medium text-slate-600">08:30 - 09:20</td>
                    <td className="py-3 font-bold text-navy-950">Mathematics</td>
                    <td className="py-3 text-slate-500">Room 101</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-status-green">
                        Attended
                      </span>
                    </td>
                  </tr>

                  {/* Class 2: Attended */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-medium text-slate-600">09:30 - 10:20</td>
                    <td className="py-3 font-bold text-navy-950">Physics</td>
                    <td className="py-3 text-slate-500">Room 102</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-status-green">
                        Attended
                      </span>
                    </td>
                  </tr>

                  {/* Class 3: Upcoming */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-medium text-slate-600">10:30 - 11:20</td>
                    <td className="py-3 font-bold text-navy-950">English</td>
                    <td className="py-3 text-slate-500">Room 103</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-royal">
                        Upcoming
                      </span>
                    </td>
                  </tr>

                  {/* Class 4: Upcoming */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-medium text-slate-600">11:30 - 12:20</td>
                    <td className="py-3 font-bold text-navy-950">Chemistry</td>
                    <td className="py-3 text-slate-500">Room 104</td>
                    <td className="py-3 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-royal">
                        Upcoming
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT NOTICES & QUICK LINKS (col-span-4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Recent Notices Card */}
          <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-950">
                {t('recentNotices')}
              </h3>
              <button
                type="button"
                onClick={() => navigate('/student/notices')}
                className="text-xs font-semibold text-royal hover:underline"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="space-y-3.5">
              {notices.map((n, i) => {
                const colors = [
                  'bg-purple-100 text-status-violet',
                  'bg-amber-100 text-status-orange',
                  'bg-rose-100 text-status-red',
                  'bg-blue-100 text-royal'
                ];
                return (
                  <div key={n.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${colors[i % colors.length]} flex items-center justify-center shrink-0 mt-0.5`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-navy-950 truncate leading-snug">
                        {n.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Published on {n.publishDate}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links (from reference image) */}
          <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
            <h3 className="text-base font-bold text-navy-950 mb-4">
              {t('quickLinks')}
            </h3>

            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => navigate('/student/assignments')}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-royal hover:bg-blue-50/50 transition-all text-center group"
              >
                <BookMarked className="w-5 h-5 text-royal mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-700">Assignments</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/student/results')}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-status-green hover:bg-green-50/50 transition-all text-center group"
              >
                <Award className="w-5 h-5 text-status-green mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-700">Results</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/student/fees')}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-status-orange hover:bg-amber-50/50 transition-all text-center group"
              >
                <CreditCard className="w-5 h-5 text-status-orange mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-700">Fees</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/student/library')}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-status-violet hover:bg-purple-50/50 transition-all text-center group"
              >
                <BookOpen className="w-5 h-5 text-status-violet mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-semibold text-slate-700">Library</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
