import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { toLocaleNumber } from '../../i18n/translations';
import { HomeworkTask, Student } from '../../types';
import {
  BookMarked,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Users,
  Search,
  Filter,
  Trash2,
  X,
  FileText,
  Paperclip,
  Check,
  Award,
  AlertCircle
} from 'lucide-react';

export const TeacherAssignmentsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // Role Security Guard: Only Teacher or Administrators
  const isTeacherOrAdmin = user && (user.role === 'teacher' || user.role === 'institution_admin' || user.role === 'super_admin' || user.role === 'principal');

  if (!isTeacherOrAdmin) {
    if (user?.role === 'student') return <Navigate to="/student/assignments" replace />;
    if (user?.role === 'guardian') return <Navigate to="/parent/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  const [tasks, setTasks] = useState<HomeworkTask[]>(() => dataService.getHomeworkTasks());
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [selectedRosterTask, setSelectedRosterTask] = useState<HomeworkTask | null>(null);

  // Form State for creating Homework
  const [title, setTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('c-9');
  const [subject, setSubject] = useState('Higher Mathematics');
  const [dueDate, setDueDate] = useState('2025-05-15');
  const [dueTime, setDueTime] = useState('23:59');
  const [totalMarks, setTotalMarks] = useState(25);
  const [instructions, setInstructions] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  const classes = dataService.getClasses();
  const subjects = dataService.getSubjects(selectedClassId);

  useEffect(() => {
    const handleUpdate = () => {
      setTasks(dataService.getHomeworkTasks());
    };
    window.addEventListener('homework-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('homework-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !instructions.trim()) return;

    const classObj = classes.find(c => c.id === selectedClassId);
    const fullDueString = `${dueDate}T${dueTime}:00`;

    dataService.createHomeworkTask({
      title: title.trim(),
      subject,
      classId: selectedClassId,
      className: classObj?.name ? `${classObj.name} (Science)` : 'Class 9 (Science)',
      teacherId: user?.uid || 't-2',
      teacherName: user?.displayName || 'Ms. Farhana Akhter',
      dueDate: fullDueString,
      totalMarks: Number(totalMarks),
      instructions: instructions.trim(),
      attachmentName: attachmentName.trim() || undefined,
    });

    setTasks(dataService.getHomeworkTasks());
    setShowCreateModal(false);
    setTitle('');
    setInstructions('');
    setAttachmentName('');
    setCreateSuccess(true);
    setTimeout(() => setCreateSuccess(false), 4000);
  };

  const handleDeleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিতভাবে এই হোমওয়ার্ক অ্যাসাইনমেন্টটি মুছে ফেলতে চান?' : 'Are you sure you want to remove this homework assignment?')) {
      dataService.deleteHomeworkTask(id);
      setTasks(dataService.getHomeworkTasks());
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesClass = filterClass === 'all' || t.classId === filterClass;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.subject.toLowerCase().includes(search.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
              {language === 'bn' ? 'হোমওয়ার্ক ও অ্যাসাইনমেন্ট ব্যবস্থাপনা' : 'Homework & Coursework Management'}
            </h1>
            <span className="text-xs bg-royal/10 text-royal font-bold px-2 py-0.5 rounded-full border border-royal/20">
              {language === 'bn' ? 'শিক্ষক পোর্টাল' : 'Teacher Portal'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn' 
              ? 'শিক্ষার্থীদের জন্য হোমওয়ার্ক অ্যাসাইন করুন, নির্ধারিত তারিখ সেট করুন এবং অ-জমা দেওয়া শিক্ষার্থীদের স্বয়ংক্রিয় অনুপস্থিত তালিকা দেখুন।'
              : 'Create homework tasks, configure strict due dates, and monitor automated absent listings for expired deadlines.'}
          </p>
        </div>

        {/* ONLY TEACHER CAN ADD TASK AS HOMEWORK */}
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-royal hover:bg-royal-hover text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন হোমওয়ার্ক অ্যাসাইন করুন' : '+ Assign New Homework'}</span>
        </button>
      </div>

      {/* SUCCESS BANNER */}
      {createSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {language === 'bn'
              ? 'নতুন হোমওয়ার্ক সফলভাবে অ্যাসাইন করা হয়েছে এবং সংশ্লিষ্ট শ্রেণির সকল শিক্ষার্থীর পোর্টালে দৃশ্যমান করা হয়েছে।'
              : 'New homework task published successfully and dispatched to students with automated due-date policy.'}
          </span>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'অ্যাসাইনমেন্ট বা বিষয় খুঁজুন...' : 'Search tasks or subjects...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            {language === 'bn' ? 'শ্রেণি:' : 'Class:'}
          </span>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal font-medium"
          >
            <option value="all">{language === 'bn' ? 'সকল শ্রেণি' : 'All Classes'}</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* HOMEWORK TASKS LISTING */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTasks.length === 0 ? (
          <div className="col-span-2 bg-surface rounded-2xl p-12 text-center border border-slate-border text-slate-400 text-xs">
            {language === 'bn' ? 'কোনো হোমওয়ার্ক পাওয়া যায়নি।' : 'No homework tasks assigned yet. Click "+ Assign New Homework" to create one.'}
          </div>
        ) : (
          filteredTasks.map((task) => {
            const dueTime = new Date(task.dueDate.includes('T') ? task.dueDate : `${task.dueDate}T23:59:59`).getTime();
            const isOverdue = dueTime < new Date().getTime();
            const roster = dataService.getTaskRoster(task.id);
            const totalStudents = roster.length || 45;
            const submittedCount = roster.filter(r => r.status === 'submitted' || r.status === 'graded').length;
            const absentCount = isOverdue ? (totalStudents - submittedCount) : 0;

            return (
              <div
                key={task.id}
                className={`bg-surface rounded-2xl p-6 border transition-all hover:shadow-card-hover flex flex-col justify-between ${
                  isOverdue ? 'border-amber-200 bg-amber-50/10' : 'border-slate-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-royal border border-blue-200">
                        {task.subject}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {task.className}
                      </span>
                    </div>

                    {isOverdue ? (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-status-red border border-rose-200 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{language === 'bn' ? 'সময় শেষ (অনুপস্থিত সক্রিয়)' : 'Expired (Absent Policy)'}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-status-green border border-emerald-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{language === 'bn' ? 'চলমান' : 'Active'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-navy-950 mb-2">
                    {task.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {task.instructions}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-royal" />
                        <span>{language === 'bn' ? 'জমা দেওয়ার শেষ সময়:' : 'Due Date & Time:'}</span>
                      </span>
                      <span className={`font-mono font-bold ${isOverdue ? 'text-status-red' : 'text-navy-950'}`}>
                        {task.dueDate.replace('T', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-royal" />
                        <span>{language === 'bn' ? 'পূর্ণমান:' : 'Full Marks:'}</span>
                      </span>
                      <span className="font-bold text-navy-950">
                        {toLocaleNumber(task.totalMarks, language)}
                      </span>
                    </div>

                    {task.attachmentName && (
                      <div className="flex items-center gap-1.5 text-royal text-[11px] font-medium pt-1 border-t border-slate-200">
                        <Paperclip className="w-3 h-3" />
                        <span>{task.attachmentName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* SUBMISSION & ABSENT METRICS */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-status-green font-semibold">
                      {toLocaleNumber(submittedCount, language)} {language === 'bn' ? 'জমা দিয়েছে' : 'Submitted'}
                    </span>
                    {absentCount > 0 && (
                      <span className="text-status-red font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{toLocaleNumber(absentCount, language)} {language === 'bn' ? 'অনুপস্থিত' : 'Absent'}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedRosterTask(task)}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-royal text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? 'শিক্ষার্থী তালিকা' : 'View Roster'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTask(task.id, e)}
                      title="Delete assignment"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* COMPREHENSIVE CREATE HOMEWORK MODAL (TEACHER EXCLUSIVE) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-border my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-royal" />
                <h3 className="text-base font-bold text-navy-950">
                  {language === 'bn' ? 'নতুন হোমওয়ার্ক তৈরি করুন' : 'Assign New Homework Task'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateHomework} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'হোমওয়ার্ক / টাস্কের শিরোনাম *' : 'Homework Task Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Quadratic Equations Practice Set & Graphing"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal text-navy-950 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'bn' ? 'শ্রেণি নির্বাচন *' : 'Target Class *'}
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'bn' ? 'বিষয় *' : 'Subject *'}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    {subjects.length > 0 ? (
                      subjects.map(s => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="Higher Mathematics">Higher Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Bangla">Bangla</option>
                        <option value="English">English</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* COMPREHENSIVE DUE DATE & TIME WITH AUTOMATIC ABSENT POLICY */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-status-orange text-[11px] font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{language === 'bn' ? 'স্বয়ংক্রিয় অনুপস্থিতি নীতি (Due Date Policy)' : 'Automated Overdue & Absent Policy'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {language === 'bn'
                    ? 'নির্ধারিত তারিখ ও সময় অতিক্রান্ত হওয়ার পর যেসকল শিক্ষার্থী জমা দেয়নি, তাদের স্বয়ংক্রিয়ভাবে অনুপস্থিত (Absent) হিসেবে তালিকাভুক্ত করা হবে।'
                    : 'Once the specified due date and time expires, students who have not submitted will automatically be marked as ABSENT.'}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'bn' ? 'জমা দেওয়ার শেষ তারিখ *' : 'Due Date *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {language === 'bn' ? 'জমা দেওয়ার শেষ সময় *' : 'Due Time *'}
                    </label>
                    <input
                      type="time"
                      required
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'bn' ? 'পূর্ণমান / নম্বর *' : 'Total Marks *'}
                  </label>
                  <input
                    type="number"
                    required
                    min={5}
                    max={100}
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'bn' ? 'সংযুক্তি / ফাইল রেফারেন্স' : 'Attachment Reference'}
                  </label>
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    placeholder="e.g. Chapter-5-Problems.pdf"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'টাস্কের বিস্তারিত নির্দেশনা *' : 'Task Instructions & Problem Set *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder={language === 'bn' ? 'শিক্ষার্থীদের জন্য বিস্তারিত নির্দেশনা লিখুন...' : 'Provide specific problem numbers, page references, and submission criteria...'}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-bold rounded-lg shadow-sm"
                >
                  {language === 'bn' ? 'হোমওয়ার্ক প্রকাশ করুন' : 'Assign & Dispatch to Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STUDENT SUBMISSION ROSTER MODAL (Shows who submitted vs who is ABSENT) */}
      {selectedRosterTask && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-border my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-navy-950">
                  {selectedRosterTask.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRosterTask.className} • {selectedRosterTask.subject} • Due: {selectedRosterTask.dueDate.replace('T', ' ')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRosterTask(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Roll No</th>
                      <th className="py-2.5 px-3">Submission Status</th>
                      <th className="py-2.5 px-3 text-right">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dataService.getTaskRoster(selectedRosterTask.id).map(({ student, status, submission }) => (
                      <tr key={student.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3 font-bold text-navy-950">
                          {student.fullName}
                        </td>
                        <td className="py-3 px-3 text-slate-500 font-mono">
                          {student.rollNo}
                        </td>
                        <td className="py-3 px-3">
                          {status === 'submitted' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-status-green flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Submitted</span>
                            </span>
                          ) : status === 'graded' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-royal flex items-center gap-1 w-max">
                              <Award className="w-3 h-3" />
                              <span>Graded ({submission?.obtainedMarks}/{selectedRosterTask.totalMarks})</span>
                            </span>
                          ) : status === 'absent' ? (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-status-red flex items-center gap-1 w-max">
                              <XCircle className="w-3 h-3" />
                              <span>ABSENT (Overdue)</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-status-orange flex items-center gap-1 w-max">
                              <Clock className="w-3 h-3" />
                              <span>Pending (Open)</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-500 text-[11px]">
                          {status === 'absent' ? (
                            <span className="text-status-red font-semibold">Overdue — Zero Marks</span>
                          ) : submission?.submissionNote ? (
                            <span className="truncate max-w-[150px] inline-block">{submission.submissionNote}</span>
                          ) : (
                            <span>Awaiting submission</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedRosterTask(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
