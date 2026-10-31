import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { Student } from '../../types';
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  Users,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface ChildRecord {
  id: string;
  name: string;
  classInfo: string;
  rollNo: string;
  attendancePct: number;
  presentDays: number;
  totalDays: number;
  absentDays: number;
  lateDays: number;
  avatarBg: string;
  subjects: { name: string; present: number; total: number; rate: number }[];
}

export const StudentAttendancePage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const isParent = user?.role === 'guardian';

  // Dynamic Guardian's children data
  const [rawChildren, setRawChildren] = useState<Student[]>(() => dataService.getGuardianChildren('g-1'));

  useEffect(() => {
    const handleUpdate = () => {
      setRawChildren(dataService.getGuardianChildren('g-1'));
    };
    window.addEventListener('guardian-children-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('guardian-children-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const parentChildren: ChildRecord[] = rawChildren.map((c, idx) => {
    const isSamiul = c.id === 'stu-samiul';
    const isAyesha = c.id === 'stu-ayesha';
    const pct = isSamiul ? 94 : isAyesha ? 96 : 95;
    const present = isSamiul ? 47 : isAyesha ? 48 : 47;
    const absent = isSamiul ? 2 : isAyesha ? 1 : 2;
    const bgColors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600'];

    return {
      id: c.id,
      name: c.fullName,
      classInfo: c.className,
      rollNo: c.rollNo,
      attendancePct: pct,
      presentDays: present,
      totalDays: 50,
      absentDays: absent,
      lateDays: 1,
      avatarBg: bgColors[idx % bgColors.length],
      subjects: isAyesha ? [
        { name: 'Economics', present: 25, total: 25, rate: 100 },
        { name: 'Civics', present: 24, total: 25, rate: 96 },
        { name: 'History', present: 23, total: 25, rate: 92 },
        { name: 'English', present: 24, total: 25, rate: 96 },
        { name: 'Bangla', present: 25, total: 25, rate: 100 },
        { name: 'ICT', present: 24, total: 25, rate: 96 },
      ] : [
        { name: 'Mathematics', present: 24, total: 25, rate: 96 },
        { name: 'General Science', present: 24, total: 25, rate: 96 },
        { name: 'English', present: 23, total: 25, rate: 92 },
        { name: 'Bangla', present: 24, total: 25, rate: 96 },
        { name: 'Social Science', present: 23, total: 25, rate: 92 },
        { name: 'ICT', present: 24, total: 25, rate: 96 },
      ]
    };
  });

  const [selectedChildId, setSelectedChildId] = useState<string>(() => rawChildren[0]?.id || 'stu-samiul');
  const activeChild = parentChildren.find(c => c.id === selectedChildId) || parentChildren[0];

  // Dynamic student info from auth
  const loggedInStudent = user?.metadata?.studentId
    ? dataService.getStudentById(user.metadata.studentId)
    : (user?.displayName ? dataService.getStudents().find(s => s.fullName.toLowerCase() === user.displayName.toLowerCase()) : null);

  const currentStudent = {
    name: loggedInStudent?.fullName || user?.displayName || 'Rafiq Hasan',
    classInfo: loggedInStudent ? loggedInStudent.className : (language === 'bn' ? '৯ম শ্রেণি (বিজ্ঞান)' : 'Class 9 (Science)'),
    rollNo: loggedInStudent?.rollNo || 'NSC-2025-0147',
    attendancePct: 92,
    presentDays: 46,
    totalDays: 50,
    absentDays: 3,
    lateDays: 1,
    subjects: [
      { name: 'Mathematics', present: 24, total: 25, rate: 96 },
      { name: 'Physics', present: 23, total: 25, rate: 92 },
      { name: 'Chemistry', present: 22, total: 25, rate: 88 },
      { name: 'English', present: 24, total: 25, rate: 96 },
      { name: 'Bangla', present: 23, total: 25, rate: 92 },
      { name: 'Biology', present: 22, total: 25, rate: 88 },
    ]
  };

  const currentData = isParent ? activeChild : currentStudent;

  // Calendar dates for April 2025 (1-30)
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const isWeekend = day % 7 === 5 || day % 7 === 6;
    let status: 'present' | 'absent' | 'late' | 'weekend' = 'present';
    if (isWeekend) status = 'weekend';
    else if (day === 8 || (day === 21 && currentData.absentDays > 1)) status = 'absent';
    else if (day === 14) status = 'late';
    return { day, status };
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
              <CalendarCheck className="w-6 h-6 text-royal" />
              <span>{isParent ? t('childAttendanceRecord') : t('myAttendanceRecord')}</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-status-green border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{language === 'bn' ? 'শুধুমাত্র পর্যালোচনা' : 'Read-Only Record'}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {t('studentAttendanceSubtitle')}
          </p>
        </div>

        {/* Student Identification Pill */}
        <div className="flex items-center gap-3 bg-surface border border-slate-border px-4 py-2 rounded-xl shadow-xs">
          <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
            {currentData.name.charAt(0)}
          </div>
          <div className="text-left text-xs">
            <span className="font-bold text-navy-950 block">{currentData.name}</span>
            <span className="text-[11px] text-slate-500">{currentData.rollNo} • {currentData.classInfo}</span>
          </div>
        </div>
      </div>

      {/* GUARDIAN: CHILD SWITCHER (When logged in as Parent) */}
      {isParent && (
        <div className="bg-surface rounded-2xl p-4 border border-slate-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-royal" />
            <span className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              {language === 'bn' ? 'সন্তান নির্বাচন করুন:' : 'Select Child to View Attendance:'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {parentChildren.map((child) => {
              const isSelected = child.id === selectedChildId;
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-royal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${child.avatarBg} text-white flex items-center justify-center text-[10px]`}>
                    {child.name.charAt(0)}
                  </div>
                  <span>{child.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {child.attendancePct}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* METRIC CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-muted uppercase">{t('attendanceRate')}</span>
            <h3 className="text-2xl font-black text-status-green mt-1">
              {toLocaleNumber(`${currentData.attendancePct}%`, language)}
            </h3>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-0.5 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সন্তোষজনক রেকর্ড' : 'Satisfactory Record'}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-status-green flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-muted uppercase">{t('totalAcademicDays')}</span>
            <h3 className="text-2xl font-bold text-navy-950 mt-1">
              {toLocaleNumber(currentData.totalDays, language)}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{language === 'bn' ? 'চলতি শিক্ষাবর্ষ' : 'Current Session'}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-royal flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-muted uppercase">{t('daysPresent')}</span>
            <h3 className="text-2xl font-bold text-status-green mt-1">
              {toLocaleNumber(currentData.presentDays, language)}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{language === 'bn' ? 'কার্যদিবসে সক্রিয়' : 'Active Presence'}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-status-green flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-muted uppercase">{t('daysAbsent')}</span>
            <h3 className="text-2xl font-bold text-status-red mt-1">
              {toLocaleNumber(currentData.absentDays, language)}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5 block">{language === 'bn' ? 'অনুমোদিত ছুটি সহ' : 'With Excused Notes'}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-status-red flex items-center justify-center">
            <XCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* MONTHLY CALENDAR & SUBJECT BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monthly Calendar View */}
        <div className="lg:col-span-7 bg-surface rounded-xl p-6 border border-slate-border shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-royal" />
              <span>{t('monthlyAttendanceCalendar')}</span>
            </h3>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
              {language === 'bn' ? 'এপ্রিল ২০২৫' : 'April 2025'}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, idx) => (
              <span key={d} className={`font-semibold py-1 ${idx >= 5 ? 'text-status-red' : 'text-slate-400'}`}>
                {language === 'bn' ? ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'][idx] : d}
              </span>
            ))}

            {calendarDays.map((cd) => {
              let bg = 'bg-emerald-50 text-status-green border-emerald-200';
              if (cd.status === 'weekend') bg = 'bg-slate-100 text-slate-400 border-slate-200';
              if (cd.status === 'absent') bg = 'bg-rose-100 text-status-red border-rose-300 font-bold';
              if (cd.status === 'late') bg = 'bg-amber-100 text-amber-700 border-amber-300 font-bold';

              return (
                <div
                  key={cd.day}
                  className={`h-11 rounded-lg border flex flex-col items-center justify-center transition-all ${bg}`}
                >
                  <span className="text-xs font-bold">{toLocaleNumber(cd.day, language)}</span>
                  <span className="text-[9px] uppercase tracking-tighter">
                    {cd.status === 'weekend' ? (language === 'bn' ? 'ছুটি' : 'Off') : 
                     cd.status === 'absent' ? (language === 'bn' ? 'অনুপস্থিত' : 'Abs') : 
                     cd.status === 'late' ? (language === 'bn' ? 'দেরি' : 'Late') : (language === 'bn' ? 'উপস্থিত' : 'P')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>{t('status_present')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>{t('status_absent')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>{t('status_late')}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span>{language === 'bn' ? 'সাপ্তাহিক ছুটি' : 'Weekend'}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Subject-wise breakdown */}
        <div className="lg:col-span-5 bg-surface rounded-xl p-6 border border-slate-border shadow-card space-y-4">
          <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-royal" />
            <span>{t('subjectWiseAttendance')}</span>
          </h3>

          <div className="space-y-3.5 pt-1">
            {currentData.subjects.map((sub) => (
              <div key={sub.name} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-navy-950">
                    {language === 'bn' ? (
                      sub.name === 'Mathematics' ? 'গণিত' :
                      sub.name === 'Physics' ? 'পদার্থবিজ্ঞান' :
                      sub.name === 'Chemistry' ? 'রসায়ন' :
                      sub.name === 'English' ? 'ইংরেজি' :
                      sub.name === 'Bangla' ? 'বাংলা' :
                      sub.name === 'General Science' ? 'সাধারণ বিজ্ঞান' :
                      sub.name === 'Social Science' ? 'বাংলাদেশ ও বিশ্বপরিচয়' :
                      sub.name === 'Economics' ? 'অর্থনীতি' :
                      sub.name === 'Civics' ? 'পৌরনীতি' :
                      sub.name === 'History' ? 'ইতিহাস' :
                      sub.name === 'ICT' ? 'তথ্য ও যোগাযোগ প্রযুক্তি' : sub.name
                    ) : sub.name}
                  </span>
                  <span className="text-royal font-mono font-bold">
                    {toLocaleNumber(`${sub.rate}%`, language)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-royal h-full rounded-full transition-all duration-500"
                    style={{ width: `${sub.rate}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{language === 'bn' ? `উপস্থিত: ${toLocaleNumber(sub.present, language)} দিন` : `Present: ${sub.present} days`}</span>
                  <span>{language === 'bn' ? `মোট: ${toLocaleNumber(sub.total, language)} ক্লাস` : `Total: ${sub.total} classes`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
