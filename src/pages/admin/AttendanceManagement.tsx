import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Calendar,
  Layers,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Users
} from 'lucide-react';

export const AttendanceManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  // Guard against students or parents accidentally viewing admin attendance taking tools
  if (user?.role === 'student') {
    return <Navigate to="/student/attendance" replace />;
  }
  if (user?.role === 'guardian') {
    return <Navigate to="/parent/attendance" replace />;
  }

  const classes = dataService.getClasses();
  
  const [selectedClassId, setSelectedClassId] = useState<string>('c-9');
  const [selectedDate, setSelectedDate] = useState<string>('2025-04-25');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const students = dataService.getStudents({ classId: selectedClassId });

  // Initial attendance status map for students in this class
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({
    'stu-rafiq': 'present',
    'stu-samiul': 'present',
    'stu-ayesha': 'present',
    'stu-rahim': 'present',
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: AttendanceStatus) => {
    const updated: Record<string, AttendanceStatus> = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Metrics
  const total = students.length || 1;
  const presentCount = students.filter(s => (attendanceMap[s.id] || 'present') === 'present').length;
  const absentCount = students.filter(s => attendanceMap[s.id] === 'absent').length;
  const lateCount = students.filter(s => attendanceMap[s.id] === 'late').length;
  const attendanceRate = Math.round((presentCount / total) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            {t('attendanceManagementTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {t('attendanceManagementSubtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAttendance}
          className="px-4 py-2 text-xs font-semibold bg-royal hover:bg-royal-hover text-white rounded-lg flex items-center gap-2 shadow-sm transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{t('saveAttendance')}</span>
        </button>
      </div>

      {/* SUCCESS BANNER */}
      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{t('attendanceSavedSuccess')}</span>
        </div>
      )}

      {/* FILTER BAR: CLASS & DATE SELECTOR */}
      <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              {t('selectClass')}
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-navy-950 focus:outline-none focus:border-royal"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {language === 'bn' ? c.name.replace('Class', 'শ্রেণি').replace('HSC 1st Year', 'একাদশ শ্রেণি').replace('HSC 2nd Year', 'দ্বাদশ শ্রেণি') : c.name} ({language === 'bn' ? (c.division === 'school' ? 'স্কুল' : 'কলেজ') : c.division})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              {t('attendanceDate')}
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-navy-950 focus:outline-none focus:border-royal"
            />
          </div>
        </div>

        {/* Quick Batch Selectors */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">{t('quickMark')}</span>
          <button
            type="button"
            onClick={() => handleMarkAll('present')}
            className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-status-green border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
          >
            {t('allPresent')}
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('absent')}
            className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-status-red border border-rose-200 rounded-md hover:bg-rose-100 transition-colors"
          >
            {t('allAbsent')}
          </button>
        </div>
      </div>

      {/* SUMMARY STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card">
          <span className="text-xs text-slate-muted uppercase font-semibold">{t('totalStudents')}</span>
          <p className="text-xl font-bold text-navy-950 mt-1">{toLocaleNumber(students.length, language)}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card">
          <span className="text-xs text-slate-muted uppercase font-semibold">{t('status_present')}</span>
          <p className="text-xl font-bold text-status-green mt-1">{toLocaleNumber(presentCount, language)}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card">
          <span className="text-xs text-slate-muted uppercase font-semibold">{t('status_absent')}</span>
          <p className="text-xl font-bold text-status-red mt-1">{toLocaleNumber(absentCount, language)}</p>
        </div>
        <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card">
          <span className="text-xs text-slate-muted uppercase font-semibold">{t('classAttendanceRate')}</span>
          <p className="text-xl font-bold text-royal mt-1">{toLocaleNumber(`${attendanceRate}%`, language)}</p>
        </div>
      </div>

      {/* ATTENDANCE ROSTER SHEET */}
      <div className="bg-surface rounded-xl border border-slate-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">{t('rollNo')}</th>
                <th className="py-3 px-4 font-semibold">{t('studentName')}</th>
                <th className="py-3 px-4 font-semibold">{t('section')}</th>
                <th className="py-3 px-4 font-semibold text-center">{t('attendanceStatus')}</th>
                <th className="py-3 px-4 font-semibold text-right">{t('remarks')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((stu) => {
                const currentStatus = attendanceMap[stu.id] || 'present';
                return (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-navy-950">
                      {stu.rollNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                          {stu.fullName.charAt(0)}
                        </div>
                        <span className="font-bold text-navy-950">{stu.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {language === 'bn' ? stu.sectionName.replace('Science', 'বিজ্ঞান').replace('Section', 'শাখা') : stu.sectionName}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'present')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            currentStatus === 'present'
                              ? 'bg-status-green text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t('status_present')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'absent')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            currentStatus === 'absent'
                              ? 'bg-status-red text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t('status_absent')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'late')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            currentStatus === 'late'
                              ? 'bg-status-orange text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t('status_late')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(stu.id, 'excused')}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            currentStatus === 'excused'
                              ? 'bg-status-violet text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {t('status_excused')}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <input
                        type="text"
                        placeholder={t('optionalNote')}
                        className="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:border-royal text-right w-28"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
