import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { Student } from '../../types';
import {
  Users,
  CheckCircle2,
  CalendarCheck,
  Award,
  CreditCard,
  Bell,
  ChevronRight,
  Plus,
  BookOpen,
  CheckCircle,
  FileText,
  X,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ParentDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Dynamic list of linked children
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

  // Active child state (defaults to first child in list)
  const [activeChildId, setActiveChildId] = useState<string>(() => rawChildren[0]?.id || 'stu-samiul');

  // Modal State for Adding / Linking another child
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildClass, setNewChildClass] = useState('Class 8 (General)');
  const [newChildRoll, setNewChildRoll] = useState('');

  const activeChild = dataService.getStudentById(activeChildId) || rawChildren.find(c => c.id === activeChildId);
  const examMarks = dataService.getStudentMarks(activeChildId, 'exam-final-2025');
  const notices = dataService.getNotices('guardians').slice(0, 3);

  // Child data for the switcher with colors and rates
  const bgColors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600'];
  const childrenList = rawChildren.map((c, idx) => {
    const isSamiul = c.id === 'stu-samiul';
    const isAyesha = c.id === 'stu-ayesha';
    return {
      id: c.id,
      name: c.fullName,
      classInfo: c.className,
      attendancePct: isSamiul ? 94 : isAyesha ? 96 : 95,
      presentDays: isSamiul ? 47 : isAyesha ? 48 : 47,
      totalDays: 50,
      avatarBg: bgColors[idx % bgColors.length],
    };
  });

  const currentChildStats = childrenList.find(c => c.id === activeChildId) || childrenList[0] || {
    id: 'stu-samiul',
    name: 'Samiul Rahman',
    classInfo: 'Class 7 (Science)',
    attendancePct: 94,
    presentDays: 47,
    totalDays: 50,
    avatarBg: 'bg-blue-600',
  };

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const newChild = dataService.addChildToGuardian('g-1', {
      fullName: newChildName.trim(),
      className: newChildClass,
      rollNo: newChildRoll.trim() || undefined
    });

    const updated = dataService.getGuardianChildren('g-1');
    setRawChildren(updated);
    setActiveChildId(newChild.id);
    setShowAddModal(false);
    setNewChildName('');
    setNewChildRoll('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
          Parent Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
          Welcome back, Mr. Rahman! Stay connected with your child's progress.
        </p>
      </div>

      {/* CHILDREN SELECTOR CARDS (Matching Reference Image) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {childrenList.map((child) => {
          const isSelected = activeChildId === child.id;
          return (
            <div
              key={child.id}
              onClick={() => setActiveChildId(child.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-surface border-royal ring-2 ring-royal/20 shadow-sm'
                  : 'bg-surface/80 border-slate-border hover:bg-surface hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-full ${child.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy-950">
                    {child.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {child.classInfo}
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-royal' : 'text-slate-400'}`} />
            </div>
          );
        })}

        {/* Add Child Action */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="p-4 rounded-xl border border-dashed border-slate-300 hover:border-royal hover:bg-blue-50/40 transition-all flex items-center justify-center gap-2 text-royal text-xs font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Child</span>
        </button>
      </div>

      {/* TWO COLUMN GRID (Matching Reference Image) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ATTENDANCE OVERVIEW & LATEST NOTICES (col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Attendance Overview Card */}
          <div className="bg-surface rounded-xl p-5 sm:p-6 border border-slate-border shadow-card">
            <h3 className="text-base font-bold text-navy-950 mb-5">
              {t('attendanceOverview')}
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Radial Progress Gauge (as shown in reference screenshot) */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#E2E8F0"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#16A878"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - currentChildStats.attendancePct / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-navy-950">
                    {toLocaleNumber(`${currentChildStats.attendancePct}%`, language)}
                  </span>
                </div>
              </div>

              {/* Attendance Details */}
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-navy-950">
                  {currentChildStats.name}
                </h4>
                <p className="text-xs text-slate-500 mb-2">
                  {currentChildStats.classInfo}
                </p>
                <p className="text-xs text-slate-muted">
                  {t('presentDays')}:{' '}
                  <span className="font-bold text-navy-950">
                    {toLocaleNumber(currentChildStats.presentDays, language)} / {toLocaleNumber(currentChildStats.totalDays, language)}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/parent/attendance')}
                  className="mt-3 text-xs font-semibold text-royal hover:underline inline-flex items-center gap-1"
                >
                  <span>{t('viewDetails')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Latest Notices Card */}
          <div className="bg-surface rounded-xl p-5 sm:p-6 border border-slate-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-950">
                Latest Notices
              </h3>
              <button
                type="button"
                onClick={() => navigate('/parent/notices')}
                className="text-xs font-semibold text-royal hover:underline"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-status-red flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-navy-950 truncate">
                    Parent-Teacher Meeting Schedule
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Published on 20 Apr 2025
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-status-orange flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-navy-950 truncate">
                    Fee Payment Reminder
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Published on 15 Apr 2025
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-status-orange flex items-center justify-center shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-navy-950 truncate">
                    School Annual Function
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Published on 10 Apr 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RECENT EXAM RESULTS & FEE STATUS (col-span-6) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Recent Exam Results Card */}
          <div className="bg-surface rounded-xl p-5 sm:p-6 border border-slate-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-950">
                Recent Exam Results
              </h3>
              <button
                type="button"
                onClick={() => navigate('/parent/results')}
                className="text-xs font-semibold text-royal hover:underline"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Mathematics: Grade A+ */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-royal flex items-center justify-center font-bold text-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-navy-950">Mathematics</h5>
                    <p className="text-[10px] text-slate-500">
                      Grade: <span className="font-bold text-status-green">A+</span>
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Final Term (2025)
                </span>
              </div>

              {/* English: Grade A */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-status-green flex items-center justify-center font-bold text-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-navy-950">English</h5>
                    <p className="text-[10px] text-slate-500">
                      Grade: <span className="font-bold text-status-green">A</span>
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Final Term (2025)
                </span>
              </div>

              {/* Science: Grade A */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50/80 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-status-orange flex items-center justify-center font-bold text-xs">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-navy-950">Science</h5>
                    <p className="text-[10px] text-slate-500">
                      Grade: <span className="font-bold text-status-green">A</span>
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Final Term (2025)
                </span>
              </div>
            </div>
          </div>

          {/* Fee Payment Status Card (From Reference Screenshot: Big Green Checkmark, No Pending Dues) */}
          <div className="bg-surface rounded-xl p-5 sm:p-6 border border-slate-border shadow-card flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-navy-950">
                {language === 'bn' ? 'ফি পরিশোধের অবস্থা' : 'Fee Payment Status'}
              </h3>
              <button
                type="button"
                onClick={() => navigate('/parent/fees')}
                className="text-xs font-semibold text-royal hover:underline"
              >
                {t('viewDetails')}
              </button>
            </div>

            {(() => {
              const childInvoices = dataService.getFeeInvoices(activeChildId);
              const hasPending = childInvoices.some(i => i.status === 'pending');
              const hasDue = childInvoices.some(i => i.status === 'due');

              if (hasPending) {
                return (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-amber-100 text-status-orange flex items-center justify-center mb-3 shadow-xs animate-pulse">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-navy-950">
                      {language === 'bn' ? 'ফি যাচাই অপেক্ষমাণ (পেন্ডিং)' : 'Payment Pending Approval'}
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      {language === 'bn' ? 'ফি জমা দেওয়া হয়েছে, অ্যাডমিন অনুমোদনের পর পেইড হবে।' : 'Fee submitted. Clearance pending admin approval.'}
                    </p>
                  </div>
                );
              }

              if (hasDue) {
                return (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-orange-100 text-status-orange flex items-center justify-center mb-3 shadow-xs">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-navy-950">
                      {language === 'bn' ? 'পরিশোধযোগ্য বকেয়া ফি রয়েছে' : 'Tuition Fees Due'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {language === 'bn' ? 'অনলাইনে নিরাপদে ফি পরিশোধ করুন।' : 'Pay child tuition fees online securely.'}
                    </p>
                  </div>
                );
              }

              return (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-status-green flex items-center justify-center mb-3 shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-navy-950">
                    {t('noPendingDues')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {t('allFeesUpToDate')}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ADD / LINK CHILD MODAL FOR GUARDIAN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-royal flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-navy-950">
                  {language === 'bn' ? 'সন্তান সংযুক্ত করুন' : 'Link / Register Child'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChild} className="mt-4 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                {language === 'bn'
                  ? 'আপনার পারিবারিক অ্যাকাউন্টের সাথে আরও সন্তান যোগ করতে শিক্ষার্থীর নাম ও শ্রেণি নির্বাচন করুন।'
                  : 'Add or link another student profile under Guardian Mr. Shafiqur Rahman to monitor attendance, marks, and fees.'}
              </p>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'শিক্ষার্থীর পূর্ণ নাম *' : "Student Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={newChildName}
                  onChange={(e) => setNewChildName(e.target.value)}
                  placeholder="e.g. Tanvir Rahman"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal text-navy-950 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'bn' ? 'শ্রেণি ও বিভাগ *' : 'Class & Stream *'}
                  </label>
                  <select
                    value={newChildClass}
                    onChange={(e) => setNewChildClass(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    <option value="Class 1 (General)">Class 1 (General)</option>
                    <option value="Class 2 (General)">Class 2 (General)</option>
                    <option value="Class 3 (General)">Class 3 (General)</option>
                    <option value="Class 4 (General)">Class 4 (General)</option>
                    <option value="Class 5 (General)">Class 5 (General)</option>
                    <option value="Class 6 (General)">Class 6 (General)</option>
                    <option value="Class 7 (Science)">Class 7 (Science)</option>
                    <option value="Class 8 (General)">Class 8 (General)</option>
                    <option value="Class 9 (Science)">Class 9 (Science)</option>
                    <option value="Class 10 (Arts)">Class 10 (Arts)</option>
                    <option value="Class 11 (Science)">Class 11 (Science)</option>
                    <option value="Class 12 (Commerce)">Class 12 (Commerce)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'bn' ? 'রোল নম্বর (ঐচ্ছিক)' : 'Roll No (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={newChildRoll}
                    onChange={(e) => setNewChildRoll(e.target.value)}
                    placeholder="e.g. NSC-2025-0210"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-bold rounded-lg shadow-sm"
                >
                  {language === 'bn' ? 'সন্তান সংযুক্ত করুন' : 'Confirm & Link Child'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
