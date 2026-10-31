import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { toLocaleNumber } from '../../i18n/translations';
import { HomeworkTask } from '../../types';
import {
  BookMarked,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  Calendar,
  Award,
  Search,
  Filter,
  Check,
  X,
  XCircle,
  AlertTriangle,
  Paperclip
} from 'lucide-react';

export const StudentAssignmentsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const studentId = user?.uid || 'stu-rafiq';

  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'absent' | 'submitted' | 'graded'>('all');
  const [search, setSearch] = useState('');
  const [selectedTask, setSelectedTask] = useState<HomeworkTask | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [tasks, setTasks] = useState<HomeworkTask[]>(() => dataService.getHomeworkTasks());

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

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    dataService.submitHomework(selectedTask.id, studentId, submissionNote || 'Completed homework solution attached.');
    setTasks(dataService.getHomeworkTasks());
    setSelectedTask(null);
    setSubmissionNote('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3500);
  };

  const tasksWithStatus = tasks.map(task => {
    const statusData = dataService.getStudentHomeworkStatus(task.id, studentId);
    return {
      task,
      status: statusData.status,
      submission: statusData.submission,
      isOverdue: statusData.isOverdue
    };
  });

  const filtered = tasksWithStatus.filter(({ task, status }) => {
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                          task.subject.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-royal" />
            <span>{language === 'bn' ? 'অ্যাসাইনমেন্ট ও হোমওয়ার্ক পোর্টাল' : 'Assignments & Coursework Portal'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn' 
              ? 'বিষয়ভিত্তিক ক্লাস অ্যাসাইনমেন্ট, জমা দেওয়ার শেষ সময় ও মূল্যায়িত গ্রেড দেখুন।' 
              : 'Review weekly coursework, upload submissions, and track teacher marks & feedback.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-royal border border-blue-200">
            {language === 'bn' ? 'মোট কাজ:' : 'Total Tasks:'} <strong>{toLocaleNumber(tasks.length, language)}</strong>
          </span>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{language === 'bn' ? 'আপনার অ্যাসাইনমেন্ট সফলভাবে জমা নেওয়া হয়েছে!' : 'Assignment submitted successfully for teacher review!'}</span>
        </div>
      )}

      {/* FILTER & SEARCH */}
      <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'অ্যাসাইনমেন্ট বা বিষয় খুঁজুন...' : 'Search assignments or subjects...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: language === 'bn' ? 'সকল' : 'All' },
            { id: 'pending', label: language === 'bn' ? 'বকেয়া' : 'Pending' },
            { id: 'absent', label: language === 'bn' ? 'অনুপস্থিত (সময় শেষ)' : 'Absent (Overdue)' },
            { id: 'submitted', label: language === 'bn' ? 'জমা দেওয়া' : 'Submitted' },
            { id: 'graded', label: language === 'bn' ? 'মূল্যায়িত' : 'Graded' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === tab.id
                  ? 'bg-royal text-white shadow-xs'
                  : tab.id === 'absent'
                  ? 'bg-rose-50 text-status-red hover:bg-rose-100 border border-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ASSIGNMENTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-surface rounded-2xl p-12 text-center border border-slate-border text-slate-400 text-xs">
            {language === 'bn' ? 'এই ক্যাটাগরিতে কোনো অ্যাসাইনমেন্ট নেই।' : 'No assignments found in this view.'}
          </div>
        ) : (
          filtered.map(({ task, status, submission, isOverdue }) => (
            <div
              key={task.id}
              className={`bg-surface rounded-2xl p-6 border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between ${
                status === 'absent' ? 'border-rose-200 bg-rose-50/15' : 'border-slate-border'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-royal border border-blue-200">
                    {task.subject}
                  </span>

                  {status === 'graded' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-royal border border-blue-200 flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      <span>{language === 'bn' ? 'মূল্যায়িত' : 'Graded'}</span>
                    </span>
                  ) : status === 'submitted' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-status-green border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'bn' ? 'জমা দেওয়া হয়েছে' : 'Submitted'}</span>
                    </span>
                  ) : status === 'absent' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-status-red border border-rose-200 flex items-center gap-1 animate-pulse">
                      <XCircle className="w-3 h-3" />
                      <span>{language === 'bn' ? 'অনুপস্থিত (সময়সীমা উত্তীর্ণ)' : 'ABSENT (Overdue)'}</span>
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-status-orange border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{language === 'bn' ? 'বকেয়া' : 'Pending'}</span>
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-navy-950 mt-1">
                  {task.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {task.instructions}
                </p>

                {/* OVERDUE NOTICE FOR ABSENT TASKS */}
                {status === 'absent' && (
                  <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-status-red text-[11px] font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'bn'
                        ? 'জমা দেওয়ার নির্ধারিত সময় শেষ হয়ে গেছে। প্রাতিষ্ঠানিক নীতি অনুসারে এই টাস্কের জন্য শিক্ষার্থীকে অনুপস্থিত (Absent) হিসেবে তালিকাভুক্ত করা হয়েছে।'
                        : 'Submission deadline expired without a submission. System policy automatically listed this record as ABSENT.'}
                    </span>
                  </div>
                )}

                {status === 'graded' && submission && (
                  <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-status-green flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        <span>{language === 'bn' ? 'প্রাপ্ত নম্বর:' : 'Score:'}</span>
                      </span>
                      <span className="font-mono font-black text-status-green text-sm">
                        {toLocaleNumber(submission.obtainedMarks || 0, language)} / {toLocaleNumber(task.totalMarks, language)}
                      </span>
                    </div>
                    {submission.feedback && (
                      <p className="text-[11px] text-slate-600 italic">"{submission.feedback}"</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-400">
                  <span className="block">{language === 'bn' ? 'শিক্ষক:' : 'Instructor:'} <strong className="text-navy-950">{task.teacherName}</strong></span>
                  <span className="flex items-center gap-1 text-slate-500 font-medium mt-0.5">
                    <Clock className="w-3 h-3 text-status-orange" />
                    <span>{language === 'bn' ? 'জমা দেওয়ার শেষ সময়:' : 'Due:'} {task.dueDate.replace('T', ' ')}</span>
                  </span>
                </div>

                {status === 'pending' ? (
                  <button
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-royal hover:bg-royal-hover text-white flex items-center gap-1.5 shadow-2xs transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'জমা দিন' : 'Submit Task'}</span>
                  </button>
                ) : status === 'absent' ? (
                  <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-50 text-status-red border border-rose-200">
                    {language === 'bn' ? 'জমা বন্ধ (অনুপস্থিত)' : 'Closed (Absent)'}
                  </span>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-500">
                    {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* SUBMISSION MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Upload className="w-4 h-4 text-royal" />
                <span>{language === 'bn' ? 'অ্যাসাইনমেন্ট জমা দিন' : 'Submit Homework Task'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">{selectedTask.subject}</span>
                <h4 className="font-bold text-navy-950 text-sm mt-0.5">{selectedTask.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Due: {selectedTask.dueDate.replace('T', ' ')} • Max Marks: {selectedTask.totalMarks}</p>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'সমাধান ফাইল বা ডকুমেন্ট আপলোড (PDF/DOCX/JPG)' : 'Upload Homework Solution File (PDF/DOCX/JPG)'}
                </label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center hover:border-royal transition-colors cursor-pointer bg-slate-50/50">
                  <Upload className="w-6 h-6 text-royal mx-auto mb-1" />
                  <span className="text-xs font-semibold text-navy-950 block">{language === 'bn' ? 'ফাইল নির্বাচন করতে ক্লিক করুন' : 'Click to attach assignment document'}</span>
                  <span className="text-[10px] text-slate-400">{language === 'bn' ? 'সর্বোচ্চ সাইজ: ১০ মেগাবাইট' : 'Max file size: 10MB'}</span>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'শিক্ষকের উদ্দেশ্যে মন্তব্য বা নোট' : 'Submission Note for Instructor'}
                </label>
                <textarea
                  rows={2}
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder={language === 'bn' ? 'কোনো বিশেষ নির্দেশনা বা নোট থাকলে লিখুন...' : 'e.g. Chapter 5 problems solved with graphs attached.'}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-bold rounded-lg shadow-sm"
                >
                  {language === 'bn' ? 'নিশ্চিত করুন ও জমা দিন' : 'Confirm & Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
