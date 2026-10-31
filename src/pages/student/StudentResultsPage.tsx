import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { toLocaleNumber } from '../../i18n/translations';
import { Student } from '../../types';
import {
  Award,
  Printer,
  CheckCircle,
  Users,
  Plus,
  X,
  CheckCircle2,
  Calendar,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export const StudentResultsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const isParent = user?.role === 'guardian';

  // Dynamic Guardian Children from central dataService
  const [childrenList, setChildrenList] = useState<Student[]>(() => {
    return dataService.getGuardianChildren('g-1');
  });

  const [selectedChildId, setSelectedChildId] = useState<string>(() => {
    const initialChildren = dataService.getGuardianChildren('g-1');
    return initialChildren[0]?.id || 'stu-samiul';
  });

  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildClass, setNewChildClass] = useState('Class 8 (General)');
  const [newChildRoll, setNewChildRoll] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  // Sync children when storage or custom event fires
  useEffect(() => {
    const handleUpdate = () => {
      const updated = dataService.getGuardianChildren('g-1');
      setChildrenList(updated);
    };

    window.addEventListener('guardian-children-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('guardian-children-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Determine active student
  const defaultSamiul = dataService.getStudentById('stu-samiul')!;
  const defaultRafiq = dataService.getStudentById('stu-rafiq')!;
  const loggedInStudent = !isParent && user?.metadata?.studentId
    ? dataService.getStudentById(user.metadata.studentId)
    : (!isParent && user?.displayName ? dataService.getStudents().find(s => s.fullName.toLowerCase() === user.displayName.toLowerCase()) : null);

  const activeStudent: Student = isParent
    ? childrenList.find(c => c.id === selectedChildId) || childrenList[0] || defaultSamiul
    : loggedInStudent || defaultRafiq;

  // Get marks for active student
  const marks = dataService.getStudentMarks(activeStudent.id, 'exam-mid-2025');
  const subjects = dataService.getSubjects(activeStudent.classId || 'c-9');

  // Calculate aggregations
  const totalMarksObtained = marks.reduce((sum, m) => sum + m.marksObtained, 0);
  const totalMaxMarks = marks.reduce((sum, m) => sum + m.totalMarks, 0);
  const averageGpa = marks.length > 0 
    ? (marks.reduce((sum, m) => sum + m.gradePoint, 0) / marks.length).toFixed(2)
    : '5.00';

  const overallGrade = parseFloat(averageGpa) >= 5.0 ? 'A+' : parseFloat(averageGpa) >= 4.0 ? 'A' : 'B';

  const handleAddChildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const added = dataService.addChildToGuardian('g-1', {
      fullName: newChildName.trim(),
      className: newChildClass,
      rollNo: newChildRoll.trim() || undefined
    });

    const updated = dataService.getGuardianChildren('g-1');
    setChildrenList(updated);
    setSelectedChildId(added.id);
    setShowAddChildModal(false);
    setNewChildName('');
    setNewChildRoll('');
    setAddSuccess(true);
    setTimeout(() => setAddSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
              {language === 'bn' ? 'অ্যাকাডেমিক পরীক্ষার ফলাফল' : 'Academic Examination Results'}
            </h1>
            <span className="text-xs bg-emerald-50 text-status-green font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              {language === 'bn' ? 'সেশন ২০২৫–২০২৬' : 'Session 2025–2026'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted">
            {language === 'bn' ? 'শিক্ষার্থী' : 'Student'}: <strong className="text-navy-950 font-semibold">{activeStudent.fullName}</strong> • {language === 'bn' ? 'রোল' : 'Roll'}: <span className="font-mono">{toLocaleNumber(activeStudent.rollNo, language)}</span> • {language === 'bn' ? 'শ্রেণি' : 'Class'}: <span className="font-semibold text-royal">{activeStudent.className}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-royal hover:bg-royal-hover text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>{language === 'bn' ? 'ফলাফল প্রিন্ট করুন' : 'Print Results'}</span>
        </button>
      </div>

      {/* SUCCESS BANNER WHEN NEW CHILD LINKED */}
      {addSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {language === 'bn' 
              ? 'নতুন সন্তানের প্রোফাইল সফলভাবে সংযুক্ত করা হয়েছে এবং ফলাফল লোড করা হয়েছে।' 
              : 'New child profile linked successfully. Academic examination results loaded.'}
          </span>
        </div>
      )}

      {/* GUARDIAN'S DYNAMIC CHILDREN SELECTOR (Identical layout to Attendance, supporting all added children) */}
      {isParent && (
        <div className="bg-surface rounded-2xl p-4 border border-slate-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-navy-950 uppercase tracking-wide">
            <Users className="w-4 h-4 text-royal" />
            <span>{language === 'bn' ? 'সন্তান নির্বাচন করুন:' : 'SELECT CHILD TO VIEW RESULTS:'}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {childrenList.map((child, idx) => {
              const isSelected = selectedChildId === child.id;
              const childMarks = dataService.getStudentMarks(child.id, 'exam-mid-2025');
              const childGpa = childMarks.length > 0 
                ? (childMarks.reduce((sum, m) => sum + m.gradePoint, 0) / childMarks.length).toFixed(2)
                : '5.00';

              const initial = child.fullName ? child.fullName.charAt(0).toUpperCase() : 'S';
              const bgColors = ['bg-blue-600', 'bg-emerald-600', 'bg-violet-600', 'bg-amber-600', 'bg-rose-600'];
              const avatarColor = bgColors[idx % bgColors.length];

              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-royal text-white shadow-sm ring-2 ring-royal/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full ${isSelected ? 'bg-white/20 text-white' : `${avatarColor} text-white`} flex items-center justify-center text-[10px] font-bold`}>
                    {initial}
                  </div>
                  <span>{child.fullName}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {toLocaleNumber(childGpa, language)} GPA
                  </span>
                </button>
              );
            })}

            {/* Interactive Add Child Button */}
            <button
              type="button"
              onClick={() => setShowAddChildModal(true)}
              className="px-3 py-2 rounded-xl border border-dashed border-slate-300 hover:border-royal hover:bg-blue-50/50 text-royal text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Add or link an additional child"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সন্তান যোগ করুন' : 'Add Child'}</span>
            </button>
          </div>
        </div>
      )}

      {/* RESULTS CARD & PRINTABLE DOCUMENT */}
      <div id="printable-document" className="bg-surface rounded-2xl border border-slate-border shadow-card overflow-hidden">
        {/* Progress Report Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-navy-950">
                {language === 'bn' ? 'অর্ধ-বার্ষিক পরীক্ষা ২০২৫' : 'Mid Term Examination 2025'}
              </h3>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-status-green border border-emerald-200">
                {language === 'bn' ? 'ফলাফল প্রকাশিত' : 'Published'} • GPA: {toLocaleNumber(averageGpa, language)} ({overallGrade})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'bn' ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড গ্রেডিং স্কেল ৫.০ অনুসারে প্রস্তুতকৃত' : 'Grading standard computed as per National Curriculum GPA 5.0 scale'}
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">{language === 'bn' ? 'প্রকাশনার তারিখ' : 'Published Date'}</span>
            <span className="text-xs font-semibold text-navy-950">
              {language === 'bn' ? '২৫ এপ্রিল, ২০২৫' : '25 April 2025'}
            </span>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-5 font-bold">{language === 'bn' ? 'বিষয়' : 'Subject'}</th>
                <th className="py-3 px-4 font-bold text-center">{language === 'bn' ? 'পূর্ণমান' : 'Full Marks'}</th>
                <th className="py-3 px-4 font-bold text-center">{language === 'bn' ? 'প্রাপ্ত নম্বর' : 'Marks Obtained'}</th>
                <th className="py-3 px-4 font-bold text-center">{language === 'bn' ? 'লেটার গ্রেড' : 'Letter Grade'}</th>
                <th className="py-3 px-4 font-bold text-center">{language === 'bn' ? 'গ্রেড পয়েন্ট' : 'Grade Point'}</th>
                <th className="py-3 px-5 font-bold text-right">{language === 'bn' ? 'মন্তব্য' : 'Remarks'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marks.map((m) => {
                const sub = subjects.find(s => s.id === m.subjectId);
                const subjectDisplayName = sub?.name || m.subjectId.replace('sub-', '').toUpperCase();

                return (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-navy-950 flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-royal shrink-0" />
                      <span>{subjectDisplayName}</span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-600 font-mono">
                      {toLocaleNumber(m.totalMarks, language)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-navy-950 font-mono text-sm">
                      {toLocaleNumber(m.marksObtained, language)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        m.grade === 'A+' ? 'bg-emerald-50 text-status-green border border-emerald-200' :
                        m.grade === 'A' ? 'bg-blue-50 text-royal border border-blue-200' :
                        'bg-amber-50 text-status-orange border border-amber-200'
                      }`}>
                        {m.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-navy-950 font-mono">
                      {toLocaleNumber(m.gradePoint.toFixed(1), language)}
                    </td>
                    <td className="py-3.5 px-5 text-right text-slate-500 font-medium">
                      {m.remarks || (language === 'bn' ? 'কৃতিত্বের সাথে উত্তীর্ণ' : 'Passed with Distinction')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SUMMARY STATS FOOTER */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                {language === 'bn' ? 'মোট প্রাপ্ত নম্বর' : 'Total Marks Obtained'}
              </span>
              <span className="text-navy-950 font-bold font-mono text-sm">
                {toLocaleNumber(totalMarksObtained, language)} / {toLocaleNumber(totalMaxMarks, language)}
              </span>
            </div>
            <div className="border-l border-slate-200 pl-6">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                {language === 'bn' ? 'গ্রেড পয়েন্ট গড় (GPA)' : 'Grade Point Average (GPA)'}
              </span>
              <span className="text-royal font-black font-mono text-sm">
                {toLocaleNumber(averageGpa, language)} / {toLocaleNumber('5.00', language)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">{language === 'bn' ? 'সার্বিক ফলাফল:' : 'Final Standing:'}</span>
            <span className="px-3 py-1 rounded-lg bg-emerald-100 text-status-green font-bold text-xs flex items-center gap-1.5 border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'জিপিএ ৫.০০ (এ+) - উত্তীর্ণ' : `Passed with ${overallGrade}`}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ADD / LINK CHILD MODAL FOR GUARDIAN */}
      {showAddChildModal && (
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
                onClick={() => setShowAddChildModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddChildSubmit} className="mt-4 space-y-4 text-xs">
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
                  onClick={() => setShowAddChildModal(false)}
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
