import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { dataService } from '../../services/dataService';
import { Student } from '../../types';
import {
  Users,
  Award,
  CalendarCheck,
  CreditCard,
  ChevronRight,
  Plus,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ParentChildrenPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [rawChildren, setRawChildren] = useState<Student[]>(() => dataService.getGuardianChildren('g-1'));
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildClass, setNewChildClass] = useState('Class 8 (General)');
  const [newChildRoll, setNewChildRoll] = useState('');

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

  const bgColors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600'];

  const children = rawChildren.map((c, idx) => {
    const isSamiul = c.id === 'stu-samiul';
    const isAyesha = c.id === 'stu-ayesha';

    return {
      id: c.id,
      name: c.fullName,
      rollNo: c.rollNo,
      classInfo: c.className,
      attendancePct: isSamiul ? '94%' : isAyesha ? '96%' : '95%',
      latestGpa: isSamiul ? '5.00 (A+)' : isAyesha ? '4.80 (A)' : '5.00 (A+)',
      feeStatus: 'No Pending Dues',
      avatarBg: bgColors[idx % bgColors.length],
    };
  });

  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    dataService.addChildToGuardian('g-1', {
      fullName: newChildName.trim(),
      className: newChildClass,
      rollNo: newChildRoll.trim() || undefined
    });

    const updated = dataService.getGuardianChildren('g-1');
    setRawChildren(updated);
    setShowAddModal(false);
    setNewChildName('');
    setNewChildRoll('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            {t('nav_myChildren')} Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            Verified academic records and institutional access for linked wards under Guardian Mr. Shafiqur Rahman.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-royal hover:bg-royal-hover text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন সন্তান সংযুক্ত করুন' : 'Add / Link Child'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div key={child.id} className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-14 h-14 rounded-2xl ${child.avatarBg} text-white font-bold text-lg flex items-center justify-center shadow-sm`}>
                {child.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-950">{child.name}</h3>
                <p className="text-xs text-royal font-semibold">{child.classInfo}</p>
                <p className="text-[10px] text-slate-400 font-mono">Roll: {child.rollNo}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl text-center text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attendance</span>
                <span className="font-bold text-status-green">{child.attendancePct}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Latest GPA</span>
                <span className="font-bold text-navy-950">{child.latestGpa}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee Status</span>
                <span className="font-bold text-status-green">{child.feeStatus}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/parent/attendance')}
                className="flex-1 py-2 text-xs font-semibold bg-blue-50 text-royal hover:bg-blue-100 rounded-lg text-center"
              >
                Attendance
              </button>
              <button
                type="button"
                onClick={() => navigate('/parent/results')}
                className="flex-1 py-2 text-xs font-semibold bg-emerald-50 text-status-green hover:bg-emerald-100 rounded-lg text-center"
              >
                Exam Results
              </button>
              <button
                type="button"
                onClick={() => navigate('/parent/fees')}
                className="flex-1 py-2 text-xs font-semibold bg-amber-50 text-status-orange hover:bg-amber-100 rounded-lg text-center"
              >
                Fee Ledger
              </button>
            </div>
          </div>
        ))}
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
