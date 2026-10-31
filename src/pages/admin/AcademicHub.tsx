import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { dataService } from '../../services/dataService';
import {
  MasterSchedulePeriod,
  AcademicSessionCard,
  AcademicTermItem,
  DivisionRulesData,
  GradeScaleRow,
  AssessmentPolicyItem
} from '../../types';
import {
  Calendar,
  Layers,
  Clock,
  Award,
  CheckCircle2,
  School,
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  X,
  Shield,
  Lock,
  ArrowUpDown,
  Check
} from 'lucide-react';

export const AcademicHub: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const role = user?.role || 'institution_admin';
  const isAdmin = role === 'institution_admin' || role === 'super_admin' || role === 'principal';

  const [activeTab, setActiveTab] = useState<'sessions' | 'divisions' | 'routine' | 'curriculum'>('routine');

  // Reactive Data States from dataService
  const [masterSchedule, setMasterSchedule] = useState<MasterSchedulePeriod[]>(dataService.getMasterSchedule());
  const [scheduleMeta, setScheduleMeta] = useState(dataService.getMasterScheduleMeta());
  const [academicSessions, setAcademicSessions] = useState<AcademicSessionCard[]>(dataService.getAcademicSessions());
  const [academicTerms, setAcademicTerms] = useState<AcademicTermItem[]>(dataService.getAcademicTerms());
  const [divisionRules, setDivisionRules] = useState<DivisionRulesData>(dataService.getDivisionRules());
  const [gradingScales, setGradingScales] = useState<GradeScaleRow[]>(dataService.getGradingScales());
  const [assessmentPolicies, setAssessmentPolicies] = useState<AssessmentPolicyItem[]>(dataService.getAssessmentPolicies());

  // Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const reloadData = () => {
    setMasterSchedule([...dataService.getMasterSchedule()]);
    setScheduleMeta({ ...dataService.getMasterScheduleMeta() });
    setAcademicSessions([...dataService.getAcademicSessions()]);
    setAcademicTerms([...dataService.getAcademicTerms()]);
    setDivisionRules({ ...dataService.getDivisionRules() });
    setGradingScales([...dataService.getGradingScales()]);
    setAssessmentPolicies([...dataService.getAssessmentPolicies()]);
  };

  useEffect(() => {
    const handleUpdate = () => reloadData();
    window.addEventListener('academic-hub-updated', handleUpdate);
    return () => window.removeEventListener('academic-hub-updated', handleUpdate);
  }, []);

  // Active Session display name
  const currentActiveSession = academicSessions.find(s => s.status === 'active')?.name || 'Academic Session 2025–2026';

  // --- MODAL STATES ---
  // Routine Modals
  const [showSchedulePeriodModal, setShowSchedulePeriodModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<MasterSchedulePeriod | null>(null);
  const [periodForm, setPeriodForm] = useState<Omit<MasterSchedulePeriod, 'id'>>({
    periodName: 'Period 5',
    timeSlot: '12:45 - 01:35',
    isBreak: false,
    class9Subject: 'General Science (Room 105)',
    class11ScienceSubject: 'ICT Theory (Room 205)',
    class11CommerceSubject: 'Business Studies (Room 305)',
  });
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [metaForm, setMetaForm] = useState(scheduleMeta.timetableHours);

  // Sessions & Terms Modals
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [editingSession, setEditingSession] = useState<AcademicSessionCard | null>(null);
  const [sessionForm, setSessionForm] = useState<Omit<AcademicSessionCard, 'id'>>({
    name: 'Academic Session 2026–2027',
    duration: 'Jan 01, 2026 – Dec 31, 2026',
    workingDays: '220 Days',
    status: 'upcoming',
    statusLabel: 'Upcoming',
  });

  const [showTermModal, setShowTermModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState<AcademicTermItem | null>(null);
  const [termForm, setTermForm] = useState<Omit<AcademicTermItem, 'id'>>({
    termKey: 'Term 4',
    title: 'Remedial / Supplementary Term',
    dateRange: 'Nov 01, 2025 – Dec 10, 2025',
    statusBadge: 'Upcoming',
    statusColor: 'blue',
  });

  // Division Rules Modals
  const [showSchoolRulesModal, setShowSchoolRulesModal] = useState(false);
  const [schoolRulesForm, setSchoolRulesForm] = useState(divisionRules.school);
  const [showCollegeRulesModal, setShowCollegeRulesModal] = useState(false);
  const [collegeRulesForm, setCollegeRulesForm] = useState(divisionRules.college);

  // Curriculum & Policies Modals
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [gradingForm, setGradingForm] = useState<GradeScaleRow[]>(gradingScales);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<AssessmentPolicyItem | null>(null);
  const [policyForm, setPolicyForm] = useState<Omit<AssessmentPolicyItem, 'id'>>({
    title: 'Continuous Assessment (CA)',
    description: '20% marks evaluated through continuous classroom engagement and quiz tests.',
  });

  // --- ACTIONS: ROUTINE ---
  const handleOpenAddPeriod = () => {
    setEditingPeriod(null);
    setPeriodForm({
      periodName: `Period ${masterSchedule.filter(p => !p.isBreak).length + 1}`,
      timeSlot: '12:45 - 01:35',
      isBreak: false,
      class9Subject: 'General Science (Room 105)',
      class11ScienceSubject: 'ICT Practical (STEM Lab)',
      class11CommerceSubject: 'Marketing 1st (Room 305)',
    });
    setShowSchedulePeriodModal(true);
  };

  const handleOpenEditPeriod = (period: MasterSchedulePeriod) => {
    setEditingPeriod(period);
    setPeriodForm({
      periodName: period.periodName,
      timeSlot: period.timeSlot,
      isBreak: !!period.isBreak,
      class9Subject: period.class9Subject,
      class11ScienceSubject: period.class11ScienceSubject,
      class11CommerceSubject: period.class11CommerceSubject,
    });
    setShowSchedulePeriodModal(true);
  };

  const handleSavePeriod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (editingPeriod) {
      dataService.updateMasterSchedulePeriod(editingPeriod.id, periodForm);
      showToast(language === 'bn' ? 'পিরিয়ড রুটিন সফলভাবে আপডেট করা হয়েছে।' : 'Schedule period updated successfully.');
    } else {
      dataService.addMasterSchedulePeriod(periodForm);
      showToast(language === 'bn' ? 'নতুন রুটিন পিরিয়ড সফলভাবে যুক্ত করা হয়েছে।' : 'New schedule period added successfully.');
    }
    setShowSchedulePeriodModal(false);
    reloadData();
  };

  const handleDeletePeriod = (id: string, name: string) => {
    if (!isAdmin) return;
    if (window.confirm(language === 'bn' ? `আপনি কি ${name} মুছে ফেলতে চান?` : `Are you sure you want to remove ${name}?`)) {
      dataService.deleteMasterSchedulePeriod(id);
      showToast(language === 'bn' ? `${name} রুটিন থেকে মুছে ফেলা হয়েছে।` : `${name} removed from master schedule.`);
      reloadData();
    }
  };

  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    dataService.updateMasterScheduleMeta({ timetableHours: metaForm });
    setShowMetaModal(false);
    showToast(language === 'bn' ? 'রুটিনের সময়সূচি পরিবর্তিত হয়েছে।' : 'Timetable hours updated.');
    reloadData();
  };

  // --- ACTIONS: SESSIONS & TERMS ---
  const handleOpenAddSession = () => {
    setEditingSession(null);
    setSessionForm({
      name: 'Academic Session 2026–2027',
      duration: 'Jan 01, 2026 – Dec 31, 2026',
      workingDays: '220 Days',
      status: 'upcoming',
      statusLabel: 'Upcoming',
    });
    setShowSessionModal(true);
  };

  const handleOpenEditSession = (sess: AcademicSessionCard) => {
    setEditingSession(sess);
    setSessionForm({
      name: sess.name,
      duration: sess.duration,
      workingDays: sess.workingDays,
      status: sess.status,
      statusLabel: sess.statusLabel,
    });
    setShowSessionModal(true);
  };

  const handleSaveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (editingSession) {
      dataService.updateAcademicSession(editingSession.id, sessionForm);
      showToast(language === 'bn' ? 'শিক্ষাবর্ষের তথ্য আপডেট করা হয়েছে।' : 'Academic session updated.');
    } else {
      dataService.addAcademicSession(sessionForm);
      showToast(language === 'bn' ? 'নতুন শিক্ষাবর্ষ যুক্ত করা হয়েছে।' : 'New academic session added.');
    }
    setShowSessionModal(false);
    reloadData();
  };

  const handleSetActiveSession = (id: string, name: string) => {
    if (!isAdmin) return;
    dataService.setActiveAcademicSession(id);
    showToast(language === 'bn' ? `${name} সক্রিয় সেশন হিসেবে নির্ধারণ করা হয়েছে।` : `${name} set as current active session.`);
    reloadData();
  };

  const handleDeleteSession = (id: string, name: string) => {
    if (!isAdmin) return;
    if (window.confirm(language === 'bn' ? `আপনি কি ${name} মুছে ফেলতে চান?` : `Are you sure you want to delete ${name}?`)) {
      dataService.deleteAcademicSession(id);
      showToast(language === 'bn' ? 'সেশন মুছে ফেলা হয়েছে।' : 'Academic session deleted.');
      reloadData();
    }
  };

  const handleOpenAddTerm = () => {
    setEditingTerm(null);
    setTermForm({
      termKey: `Term ${academicTerms.length + 1}`,
      title: 'New Evaluation Term',
      dateRange: 'Oct 01, 2025 – Nov 20, 2025',
      statusBadge: 'Upcoming',
      statusColor: 'violet',
    });
    setShowTermModal(true);
  };

  const handleOpenEditTerm = (term: AcademicTermItem) => {
    setEditingTerm(term);
    setTermForm({
      termKey: term.termKey,
      title: term.title,
      dateRange: term.dateRange,
      statusBadge: term.statusBadge,
      statusColor: term.statusColor,
    });
    setShowTermModal(true);
  };

  const handleSaveTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (editingTerm) {
      dataService.updateAcademicTerm(editingTerm.id, termForm);
      showToast(language === 'bn' ? 'টার্মের তথ্য আপডেট করা হয়েছে।' : 'Academic term updated.');
    } else {
      dataService.addAcademicTerm(termForm);
      showToast(language === 'bn' ? 'নতুন টার্ম যুক্ত করা হয়েছে।' : 'New academic term added.');
    }
    setShowTermModal(false);
    reloadData();
  };

  const handleDeleteTerm = (id: string, title: string) => {
    if (!isAdmin) return;
    if (window.confirm(language === 'bn' ? `আপনি কি ${title} মুছে ফেলতে চান?` : `Are you sure you want to delete ${title}?`)) {
      dataService.deleteAcademicTerm(id);
      showToast(language === 'bn' ? 'টার্ম মুছে ফেলা হয়েছে।' : 'Term deleted.');
      reloadData();
    }
  };

  // --- ACTIONS: DIVISION RULES ---
  const handleSaveSchoolRules = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    dataService.updateDivisionRules({ ...divisionRules, school: schoolRulesForm });
    setShowSchoolRulesModal(false);
    showToast(language === 'bn' ? 'স্কুল শাখার নিয়মাবলী সংরক্ষিত হয়েছে।' : 'School division rules updated.');
    reloadData();
  };

  const handleSaveCollegeRules = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    dataService.updateDivisionRules({ ...divisionRules, college: collegeRulesForm });
    setShowCollegeRulesModal(false);
    showToast(language === 'bn' ? 'কলেজ শাখার নিয়মাবলী সংরক্ষিত হয়েছে।' : 'College division rules updated.');
    reloadData();
  };

  // --- ACTIONS: GRADING & POLICIES ---
  const handleSaveGrading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    dataService.updateGradingScales(gradingForm);
    setShowGradingModal(false);
    showToast(language === 'bn' ? 'মূল্যায়ন গ্রেডিং স্কেল সফলভাবে সংরক্ষিত হয়েছে।' : 'Grading scale updated successfully.');
    reloadData();
  };

  const handleOpenAddPolicy = () => {
    setEditingPolicy(null);
    setPolicyForm({
      title: 'Class Attendance & Discipline Evaluation',
      description: 'Minimum 75% attendance mandatory for qualifying to appear in final board examinations.',
    });
    setShowPolicyModal(true);
  };

  const handleOpenEditPolicy = (policy: AssessmentPolicyItem) => {
    setEditingPolicy(policy);
    setPolicyForm({
      title: policy.title,
      description: policy.description,
    });
    setShowPolicyModal(true);
  };

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;

    if (editingPolicy) {
      dataService.updateAssessmentPolicy(editingPolicy.id, policyForm);
      showToast(language === 'bn' ? 'নীতিমালা সফলভাবে হালনাগাদ করা হয়েছে।' : 'Assessment policy updated.');
    } else {
      dataService.addAssessmentPolicy(policyForm);
      showToast(language === 'bn' ? 'নতুন মূল্যায়ন নীতিমালা যুক্ত করা হয়েছে।' : 'New assessment policy added.');
    }
    setShowPolicyModal(false);
    reloadData();
  };

  const handleDeletePolicy = (id: string, title: string) => {
    if (!isAdmin) return;
    if (window.confirm(language === 'bn' ? `আপনি কি "${title}" নীতিমালা মুছে ফেলতে চান?` : `Are you sure you want to delete "${title}"?`)) {
      dataService.deleteAssessmentPolicy(id);
      showToast(language === 'bn' ? 'নীতিমালা মুছে ফেলা হয়েছে।' : 'Policy deleted.');
      reloadData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
              {language === 'bn' ? 'একাডেমিক ব্যবস্থাপনা কেন্দ্র' : 'Academic Management Center'}
            </h1>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-royal border border-blue-200">
                <Shield className="w-3 h-3 text-royal" />
                <span>Admin Editable</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Read-Only</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn'
              ? 'শিক্ষাবর্ষ, স্কুল ও কলেজ শাখার বিভাগ, শ্রেণি রুটিন এবং মূল্যায়ন নীতিমালা পরিচালনা করুন।'
              : 'Manage academic sessions, school & college division streams, class routines, and curriculum policies.'}
          </p>
        </div>

        <span className="px-3.5 py-1.5 bg-blue-50 text-royal border border-blue-200 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? `সক্রিয় সেশন: ${currentActiveSession}` : `Active Session: ${currentActiveSession}`}</span>
        </span>
      </div>

      {/* Role permission info banner */}
      {!isAdmin && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            {language === 'bn'
              ? '🔒 শুধুমাত্র প্রাতিষ্ঠানিক অ্যাডমিন অ্যাকাউন্ট থেকে রুটিন, টার্ম এবং কারিকুলাম নিয়মাবলী পরিবর্তন বা যুক্ত করা সম্ভব।'
              : '🔒 Read-Only Academic Center: Only institution administrators have the ability to add or modify routines, sessions, and academic policies.'}
          </span>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('sessions')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'sessions'
              ? 'bg-royal text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{language === 'bn' ? 'শিক্ষাবর্ষ ও টার্ম' : 'Academic Sessions & Terms'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('divisions')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'divisions'
              ? 'bg-royal text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{language === 'bn' ? 'শাখা ও বিভাগীয় নিয়মাবলী' : 'Divisions & Stream Rules'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('routine')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'routine'
              ? 'bg-royal text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>{language === 'bn' ? 'শ্রেণি রুটিন মাস্টার' : 'Class Routine Master'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('curriculum')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'curriculum'
              ? 'bg-royal text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{language === 'bn' ? 'কারিকুলাম ও মূল্যায়ন নিয়ম' : 'Curriculum & Grading Rules'}</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: SESSIONS & TERMS */}
      {/* ============================================================ */}
      {activeTab === 'sessions' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-navy-950">
              {language === 'bn' ? 'প্রাতিষ্ঠানিক শিক্ষাবর্ষ তালিকা' : 'Academic Sessions Roster'}
            </h2>
            {isAdmin && (
              <button
                type="button"
                onClick={handleOpenAddSession}
                className="px-3.5 py-1.5 bg-royal hover:bg-royal-hover text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? '+ নতুন সেশন যুক্ত করুন' : '+ Add Academic Session'}</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {academicSessions.map((sess) => (
              <div
                key={sess.id}
                className={`bg-surface rounded-2xl p-5 border shadow-card flex flex-col justify-between transition-all ${
                  sess.status === 'active' ? 'border-royal/50 ring-1 ring-royal/20' : 'border-slate-border'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                        sess.status === 'active'
                          ? 'text-status-green bg-emerald-50 border border-emerald-200'
                          : sess.status === 'upcoming'
                          ? 'text-royal bg-blue-50 border border-blue-200'
                          : 'text-slate-500 bg-slate-100'
                      }`}
                    >
                      {sess.statusLabel}
                    </span>
                    {sess.status === 'active' && (
                      <span className="text-[10px] text-royal font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-status-green" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-navy-950 mt-2.5">{sess.name}</h3>
                  <p className="text-xs text-slate-muted mt-1">Duration: {sess.duration}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span>Working Days: <strong>{sess.workingDays}</strong></span>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-50">
                      {sess.status !== 'active' && (
                        <button
                          type="button"
                          onClick={() => handleSetActiveSession(sess.id, sess.name)}
                          className="px-2 py-1 text-[11px] font-semibold text-royal hover:bg-blue-50 rounded"
                        >
                          Set Active
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEditSession(sess)}
                        className="p-1 text-slate-500 hover:text-royal hover:bg-slate-100 rounded"
                        title="Edit Session"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {sess.status !== 'active' && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(sess.id, sess.name)}
                          className="p-1 text-slate-400 hover:text-status-red hover:bg-rose-50 rounded"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Academic Terms Breakdown */}
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-navy-950">
                  {language === 'bn' ? 'একাডেমিক টার্ম চক্র (সেশন ২০২৫)' : 'Academic Term Cycles (Session 2025)'}
                </h3>
                <p className="text-xs text-slate-400">Quarterly examination terms and continuous evaluation timeline</p>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={handleOpenAddTerm}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-950 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? '+ টার্ম যুক্ত করুন' : '+ Add Term'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {academicTerms.map((term) => (
                <div key={term.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-royal">{term.termKey}</span>
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditTerm(term)}
                            className="p-1 text-slate-400 hover:text-royal rounded"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTerm(term.id, term.title)}
                            className="p-1 text-slate-400 hover:text-status-red rounded"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-navy-950 mt-1">{term.title}</h4>
                    <p className="text-slate-500 mt-1">{term.dateRange}</p>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        term.statusColor === 'green'
                          ? 'bg-emerald-100 text-status-green'
                          : term.statusColor === 'orange'
                          ? 'bg-amber-100 text-status-orange'
                          : 'bg-purple-100 text-status-violet'
                      }`}
                    >
                      {term.statusBadge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: DIVISIONS & STREAM RULES */}
      {/* ============================================================ */}
      {activeTab === 'divisions' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School Division Rules */}
            <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-royal flex items-center justify-center">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-950">School Division Structure</h3>
                    <p className="text-xs text-slate-400">Class 1 to Class 10 (SSC)</p>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setSchoolRulesForm(divisionRules.school);
                      setShowSchoolRulesModal(true);
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-royal hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{language === 'bn' ? 'নিয়ম পরিবর্তন' : 'Edit Rules'}</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>Class 1 – 8 Curriculum:</span>
                  <strong className="text-navy-950">{divisionRules.school.curriculum}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>Class 9 – 10 Stream Splitting:</span>
                  <strong className="text-navy-950">{divisionRules.school.streams}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>Class 9 Science Eligibility:</span>
                  <strong className="text-status-green">{divisionRules.school.scienceEligibility}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>Class 9 Commerce / Humanities:</span>
                  <strong className="text-royal">{divisionRules.school.otherEligibility}</strong>
                </div>
              </div>
            </div>

            {/* College Division Rules */}
            <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-status-violet flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-950">College Division (HSC)</h3>
                    <p className="text-xs text-slate-400">Class 11 & Class 12</p>
                  </div>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setCollegeRulesForm(divisionRules.college);
                      setShowCollegeRulesModal(true);
                    }}
                    className="px-3 py-1.5 bg-purple-50 text-status-violet hover:bg-purple-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{language === 'bn' ? 'আসন ও নিয়ম পরিবর্তন' : 'Edit Seats & Rules'}</span>
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>HSC Science Stream Seats:</span>
                  <strong className="text-navy-950">{divisionRules.college.scienceSeats}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>HSC Business Studies Seats:</span>
                  <strong className="text-navy-950">{divisionRules.college.businessSeats}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>HSC Humanities Stream Seats:</span>
                  <strong className="text-navy-950">{divisionRules.college.humanitiesSeats}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <span>Board Affiliation:</span>
                  <strong className="text-status-violet">{divisionRules.college.boardAffiliation}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: MASTER ROUTINE (Exact Screen from User Image) */}
      {/* ============================================================ */}
      {activeTab === 'routine' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-surface rounded-2xl border border-slate-border shadow-card overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-navy-950">Master Daily Schedule</h3>
                <p className="text-xs text-slate-400">School & College daily timetable grid</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-royal font-semibold">
                  {scheduleMeta.timetableHours}
                </span>

                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMetaForm(scheduleMeta.timetableHours);
                        setShowMetaModal(true);
                      }}
                      className="p-1.5 text-slate-500 hover:text-royal hover:bg-slate-100 rounded-lg text-xs"
                      title="Edit Timetable Hours"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleOpenAddPeriod}
                      className="px-3.5 py-1.5 bg-royal hover:bg-royal-hover text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{language === 'bn' ? '+ পিরিয়ড যোগ করুন' : '+ Add Period Slot'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Period</th>
                    <th className="py-3 px-4 font-semibold">Time Slot</th>
                    <th className="py-3 px-4 font-semibold">Class 9 (Science)</th>
                    <th className="py-3 px-4 font-semibold">Class 11 (HSC Science)</th>
                    <th className="py-3 px-4 font-semibold">Class 11 (HSC Commerce)</th>
                    {isAdmin && <th className="py-3 px-4 font-semibold text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {masterSchedule.map((per) => (
                    <tr key={per.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-navy-950">
                        {per.periodName}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-royal">
                        {per.timeSlot}
                      </td>
                      {per.isBreak ? (
                        <td colSpan={3} className="py-3 px-4 text-center text-slate-400 font-semibold italic bg-slate-50/50">
                          {per.class9Subject || 'Tiffin & Refreshment Interval'}
                        </td>
                      ) : (
                        <>
                          <td className="py-3 px-4 text-slate-700 font-medium">{per.class9Subject}</td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{per.class11ScienceSubject}</td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{per.class11CommerceSubject}</td>
                        </>
                      )}
                      {isAdmin && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditPeriod(per)}
                              className="p-1 text-slate-500 hover:text-royal hover:bg-slate-100 rounded"
                              title="Edit Period"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeletePeriod(per.id, per.periodName)}
                              className="p-1 text-slate-400 hover:text-status-red hover:bg-rose-50 rounded"
                              title="Delete Period"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: CURRICULUM & GRADING */}
      {/* ============================================================ */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Grading Scale */}
            <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-navy-950">
                  {language === 'bn' ? 'গ্রেডিং স্কেল (জাতীয় কারিকুলাম)' : 'Grading Scale (Bangladesh National Curriculum)'}
                </h3>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setGradingForm([...gradingScales]);
                      setShowGradingModal(true);
                    }}
                    className="px-3 py-1.5 bg-blue-50 text-royal hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{language === 'bn' ? 'স্কেল সম্পাদন' : 'Edit Scales'}</span>
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Mark Range</th>
                      <th className="py-2 px-3">Letter Grade</th>
                      <th className="py-2 px-3">Grade Point (GPA)</th>
                      <th className="py-2 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {gradingScales.map((scale) => (
                      <tr key={scale.id}>
                        <td className="py-2 px-3">{scale.markRange}</td>
                        <td className={`py-2 px-3 font-bold ${scale.colorClass}`}>{scale.letterGrade}</td>
                        <td className="py-2 px-3 font-bold">{scale.gradePoint.toFixed(1)}</td>
                        <td className="py-2 px-3 text-slate-600">{scale.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Assessment Policies */}
            <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-bold text-navy-950">
                  {language === 'bn' ? 'মূল্যায়ন নীতিমালা' : 'Assessment Policy'}
                </h3>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleOpenAddPolicy}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-navy-950 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? '+ নীতিমালা যোগ' : '+ Add Policy'}</span>
                  </button>
                )}
              </div>

              <ul className="space-y-3 text-xs text-slate-600">
                {assessmentPolicies.map((pol) => (
                  <li key={pol.id} className="p-3 bg-slate-50 rounded-xl flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-status-green shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-navy-950">{pol.title}:</strong>
                        <span className="ml-1 text-slate-600">{pol.description}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditPolicy(pol)}
                          className="p-1 text-slate-400 hover:text-royal rounded"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePolicy(pol.id, pol.title)}
                          className="p-1 text-slate-400 hover:text-status-red rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ADMIN EDIT MODALS */}
      {/* ============================================================ */}

      {/* 1. ROUTINE PERIOD MODAL */}
      {showSchedulePeriodModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-modal border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">
                {editingPeriod ? 'Edit Routine Period Slot' : 'Add New Routine Period Slot'}
              </h3>
              <button onClick={() => setShowSchedulePeriodModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePeriod} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Period Name *</label>
                  <input
                    type="text"
                    required
                    value={periodForm.periodName}
                    onChange={(e) => setPeriodForm({ ...periodForm, periodName: e.target.value })}
                    placeholder="e.g. Period 1 or Break"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={periodForm.timeSlot}
                    onChange={(e) => setPeriodForm({ ...periodForm, timeSlot: e.target.value })}
                    placeholder="e.g. 08:30 - 09:20"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isBreakCheck"
                  checked={periodForm.isBreak}
                  onChange={(e) => setPeriodForm({ ...periodForm, isBreak: e.target.checked })}
                  className="rounded text-royal focus:ring-royal"
                />
                <label htmlFor="isBreakCheck" className="text-slate-700 font-semibold cursor-pointer select-none">
                  Mark as Break / Tiffin Interval
                </label>
              </div>

              {!periodForm.isBreak && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Class 9 (Science) Subject & Room *</label>
                    <input
                      type="text"
                      required
                      value={periodForm.class9Subject}
                      onChange={(e) => setPeriodForm({ ...periodForm, class9Subject: e.target.value })}
                      placeholder="e.g. Mathematics (Room 101)"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Class 11 (HSC Science) Subject & Room *</label>
                    <input
                      type="text"
                      required
                      value={periodForm.class11ScienceSubject}
                      onChange={(e) => setPeriodForm({ ...periodForm, class11ScienceSubject: e.target.value })}
                      placeholder="e.g. Physics 1st (Room 201)"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Class 11 (HSC Commerce) Subject & Room *</label>
                    <input
                      type="text"
                      required
                      value={periodForm.class11CommerceSubject}
                      onChange={(e) => setPeriodForm({ ...periodForm, class11CommerceSubject: e.target.value })}
                      placeholder="e.g. Accounting 1st (Room 301)"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                    />
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSchedulePeriodModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. TIMETABLE HOURS META MODAL */}
      {showMetaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 shadow-modal border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Edit Timetable Schedule Hours</h3>
              <button onClick={() => setShowMetaModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeta} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Working Days & Hours Text *</label>
                <input
                  type="text"
                  required
                  value={metaForm}
                  onChange={(e) => setMetaForm(e.target.value)}
                  placeholder="e.g. Sunday – Thursday (08:30 AM – 02:00 PM)"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMetaModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Timing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ACADEMIC SESSION MODAL */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-modal border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">
                {editingSession ? 'Edit Academic Session' : 'Add New Academic Session'}
              </h3>
              <button onClick={() => setShowSessionModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={sessionForm.name}
                  onChange={(e) => setSessionForm({ ...sessionForm, name: e.target.value })}
                  placeholder="Academic Session 2026–2027"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Duration Dates *</label>
                <input
                  type="text"
                  required
                  value={sessionForm.duration}
                  onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                  placeholder="Jan 01, 2026 – Dec 31, 2026"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Total Academic Working Days *</label>
                <input
                  type="text"
                  required
                  value={sessionForm.workingDays}
                  onChange={(e) => setSessionForm({ ...sessionForm, workingDays: e.target.value })}
                  placeholder="e.g. 220 Days"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Session Status *</label>
                <select
                  value={sessionForm.status}
                  onChange={(e) => {
                    const st = e.target.value as any;
                    const lbl = st === 'active' ? 'Current Active' : st === 'upcoming' ? 'Upcoming' : 'Archived';
                    setSessionForm({ ...sessionForm, status: st, statusLabel: lbl });
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="active">Current Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ACADEMIC TERM MODAL */}
      {showTermModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-modal border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">
                {editingTerm ? 'Edit Academic Term' : 'Add New Academic Term'}
              </h3>
              <button onClick={() => setShowTermModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTerm} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Term Key *</label>
                  <input
                    type="text"
                    required
                    value={termForm.termKey}
                    onChange={(e) => setTermForm({ ...termForm, termKey: e.target.value })}
                    placeholder="e.g. Term 1"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Term Badge Color</label>
                  <select
                    value={termForm.statusColor}
                    onChange={(e) => setTermForm({ ...termForm, statusColor: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="green">Green (Finished)</option>
                    <option value="orange">Orange (Ongoing)</option>
                    <option value="violet">Violet (Upcoming)</option>
                    <option value="blue">Blue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Term Name *</label>
                <input
                  type="text"
                  required
                  value={termForm.title}
                  onChange={(e) => setTermForm({ ...termForm, title: e.target.value })}
                  placeholder="e.g. Mid Term / Half-Yearly"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Date Range *</label>
                <input
                  type="text"
                  required
                  value={termForm.dateRange}
                  onChange={(e) => setTermForm({ ...termForm, dateRange: e.target.value })}
                  placeholder="May 02, 2025 – Aug 20, 2025"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Status Badge Text *</label>
                <input
                  type="text"
                  required
                  value={termForm.statusBadge}
                  onChange={(e) => setTermForm({ ...termForm, statusBadge: e.target.value })}
                  placeholder="Ongoing Academic Term"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTermModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. SCHOOL DIVISION RULES MODAL */}
      {showSchoolRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-modal border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Edit School Division Structure & Rules</h3>
              <button onClick={() => setShowSchoolRulesModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchoolRules} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Class 1 – 8 Curriculum Description *</label>
                <input
                  type="text"
                  required
                  value={schoolRulesForm.curriculum}
                  onChange={(e) => setSchoolRulesForm({ ...schoolRulesForm, curriculum: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Class 9 – 10 Stream Splitting *</label>
                <input
                  type="text"
                  required
                  value={schoolRulesForm.streams}
                  onChange={(e) => setSchoolRulesForm({ ...schoolRulesForm, streams: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Class 9 Science Eligibility Rule *</label>
                <input
                  type="text"
                  required
                  value={schoolRulesForm.scienceEligibility}
                  onChange={(e) => setSchoolRulesForm({ ...schoolRulesForm, scienceEligibility: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-medium text-navy-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Class 9 Commerce / Humanities Eligibility *</label>
                <input
                  type="text"
                  required
                  value={schoolRulesForm.otherEligibility}
                  onChange={(e) => setSchoolRulesForm({ ...schoolRulesForm, otherEligibility: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-medium text-navy-950"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSchoolRulesModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. COLLEGE DIVISION RULES MODAL */}
      {showCollegeRulesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-modal border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Edit College Division (HSC) Rules & Seats</h3>
              <button onClick={() => setShowCollegeRulesModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollegeRules} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">HSC Science Stream Seats & Min GPA *</label>
                <input
                  type="text"
                  required
                  value={collegeRulesForm.scienceSeats}
                  onChange={(e) => setCollegeRulesForm({ ...collegeRulesForm, scienceSeats: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-medium text-navy-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">HSC Business Studies Seats & Min GPA *</label>
                <input
                  type="text"
                  required
                  value={collegeRulesForm.businessSeats}
                  onChange={(e) => setCollegeRulesForm({ ...collegeRulesForm, businessSeats: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-medium text-navy-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">HSC Humanities Stream Seats & Min GPA *</label>
                <input
                  type="text"
                  required
                  value={collegeRulesForm.humanitiesSeats}
                  onChange={(e) => setCollegeRulesForm({ ...collegeRulesForm, humanitiesSeats: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-medium text-navy-950"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Board Affiliation Authority *</label>
                <input
                  type="text"
                  required
                  value={collegeRulesForm.boardAffiliation}
                  onChange={(e) => setCollegeRulesForm({ ...collegeRulesForm, boardAffiliation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-medium text-navy-950"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCollegeRulesModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save College Rules
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. GRADING SCALE MODAL */}
      {showGradingModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 shadow-modal border border-slate-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Edit National Curriculum Grading Scale</h3>
              <button onClick={() => setShowGradingModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrading} className="mt-4 space-y-3 text-xs">
              <div className="space-y-2">
                {gradingForm.map((g, idx) => (
                  <div key={g.id} className="grid grid-cols-4 gap-2 p-2 bg-slate-50 rounded-lg items-center">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Mark Range</label>
                      <input
                        type="text"
                        value={g.markRange}
                        onChange={(e) => {
                          const updated = [...gradingForm];
                          updated[idx] = { ...g, markRange: e.target.value };
                          setGradingForm(updated);
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Grade</label>
                      <input
                        type="text"
                        value={g.letterGrade}
                        onChange={(e) => {
                          const updated = [...gradingForm];
                          updated[idx] = { ...g, letterGrade: e.target.value };
                          setGradingForm(updated);
                        }}
                        className="w-full px-2 py-1 border rounded bg-white font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">GPA Point</label>
                      <input
                        type="number"
                        step="0.1"
                        value={g.gradePoint}
                        onChange={(e) => {
                          const updated = [...gradingForm];
                          updated[idx] = { ...g, gradePoint: parseFloat(e.target.value) || 0 };
                          setGradingForm(updated);
                        }}
                        className="w-full px-2 py-1 border rounded bg-white font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Remarks</label>
                      <input
                        type="text"
                        value={g.remarks}
                        onChange={(e) => {
                          const updated = [...gradingForm];
                          updated[idx] = { ...g, remarks: e.target.value };
                          setGradingForm(updated);
                        }}
                        className="w-full px-2 py-1 border rounded bg-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGradingModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Grading Scales
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. ASSESSMENT POLICY MODAL */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-modal border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">
                {editingPolicy ? 'Edit Assessment Policy Rule' : 'Add New Assessment Policy'}
              </h3>
              <button onClick={() => setShowPolicyModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Policy Title *</label>
                <input
                  type="text"
                  required
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  placeholder="e.g. Science Practicals or Attendance Threshold"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Policy Description & Regulations *</label>
                <textarea
                  rows={3}
                  required
                  value={policyForm.description}
                  onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                  placeholder="Detailed breakdown of rules, percentage weights, or prerequisites..."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
