import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { dataService } from '../../services/dataService';
import { AdmissionEnquiry, DivisionType } from '../../types';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Mail,
  FileText,
  UserPlus,
  Award,
  Eye,
  Trash2,
  Plus,
  GraduationCap,
  School,
  X,
  Calendar,
  Sparkles,
  Building
} from 'lucide-react';

export const AdmissionsManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>(dataService.getEnquiries());
  const [admittedSuccess, setAdmittedSuccess] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState<'all' | 'school' | 'college'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals
  const [viewingEnquiry, setViewingEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);

  // Form State for Manual Walk-in Application
  const [manualForm, setManualForm] = useState({
    applicantName: '',
    guardianName: '',
    phone: '',
    email: '',
    division: 'college' as DivisionType,
    desiredClass: 'Class 11 (HSC 1st Year)',
    desiredStream: 'Science',
    sscGpa: '5.00',
    previousGpa: '',
    board: 'Dhaka',
    passingYear: '2024',
    previousSchool: '',
    message: '',
  });

  const reloadEnquiries = () => {
    setEnquiries([...dataService.getEnquiries()]);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setEnquiries([...dataService.getEnquiries()]);
    };
    window.addEventListener('enquiries-updated', handleUpdate);
    return () => window.removeEventListener('enquiries-updated', handleUpdate);
  }, []);

  const handleUpdateStatus = (id: string, status: AdmissionEnquiry['status']) => {
    dataService.updateEnquiryStatus(id, status);
    reloadEnquiries();
  };

  const handleDeleteEnquiry = (id: string, name: string) => {
    if (window.confirm(language === 'bn' ? `আপনি কি ${name}-এর ভর্তি আবেদনটি মুছে ফেলতে চান?` : `Are you sure you want to remove the admission application for ${name}?`)) {
      dataService.deleteEnquiry(id);
      reloadEnquiries();
      if (viewingEnquiry?.id === id) setViewingEnquiry(null);
    }
  };

  const handleAdmitStudent = (enq: AdmissionEnquiry) => {
    const isCollege = enq.division === 'college' || enq.desiredClass.includes('11') || enq.desiredClass.includes('12');
    const classes = dataService.getClasses();
    const matchedClass = classes.find(c => c.name.toLowerCase() === enq.desiredClass.toLowerCase() || enq.desiredClass.includes(c.name)) || (isCollege ? classes.find(c => c.id === 'c-11') : classes.find(c => c.id === 'c-9'));
    const sections = dataService.getSections(matchedClass?.id);
    const matchedSection = sections[0];

    dataService.addStudent({
      fullName: enq.applicantName,
      division: enq.division,
      className: enq.desiredClass,
      classId: matchedClass?.id || (isCollege ? 'c-11' : 'c-9'),
      sectionId: matchedSection?.id || (isCollege ? 'sec-11s' : 'sec-9s'),
      sectionName: matchedSection?.name || 'Section 1',
      rollNo: `NSC-2025-${Math.floor(100 + Math.random() * 900)}`,
      admissionNo: `NSC-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      guardianId: `g-${Date.now()}`,
      guardianName: enq.guardianName,
      guardianPhone: enq.phone,
      gender: 'male',
      dateOfBirth: isCollege ? '2008-01-01' : '2010-01-01',
      address: 'Dhaka, Bangladesh',
      stream: (enq.desiredStream as any) || 'General',
      sessionId: 'sess-2025',
      enrollmentDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      sscGpa: enq.sscGpa,
      previousGpa: enq.previousGpa,
      previousBoard: enq.board,
      passingYear: enq.passingYear,
      photoUrl: enq.photoUrl,
    });

    dataService.updateEnquiryStatus(enq.id, 'approved', 'Officially admitted and registered');
    reloadEnquiries();
    if (viewingEnquiry?.id === enq.id) {
      setViewingEnquiry(null);
    }
    setAdmittedSuccess(
      language === 'bn'
        ? `${enq.applicantName}-কে সফলভাবে ভর্তি করা হয়েছে এবং শিক্ষার্থী তালিকায় যুক্ত করা হয়েছে!`
        : `${enq.applicantName} has been officially admitted and added to the student roster!`
    );
    setTimeout(() => setAdmittedSuccess(null), 4500);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.applicantName || !manualForm.guardianName || !manualForm.phone) {
      alert(language === 'bn' ? 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য পূরণ করুন।' : 'Please fill in all required fields.');
      return;
    }

    const isCollege = manualForm.division === 'college';
    const isSsc = manualForm.desiredClass.includes('9') || manualForm.desiredClass.includes('10');

    if (isCollege) {
      const gpa = parseFloat(manualForm.sscGpa);
      if (!manualForm.sscGpa || isNaN(gpa) || gpa < 1.0 || gpa > 5.0) {
        alert(language === 'bn' ? 'কলেজ শাখার জন্য এসএসসি জিপিএ (১.০০-৫.০০) প্রদান বাধ্যতামূলক।' : 'SSC GPA (1.00 - 5.00) is mandatory for College level admission.');
        return;
      }
    }

    if (isSsc) {
      const gpa = parseFloat(manualForm.previousGpa);
      if (!manualForm.previousGpa || isNaN(gpa) || gpa < 1.0 || gpa > 5.0) {
        alert(language === 'bn' ? 'এসএসসি স্তর (৯ম-১০ম) এর জন্য পূর্ববর্তী শ্রেণি/জেএসসি জিপিএ আবশ্যক।' : 'Previous Class / JSC GPA is required for SSC level admission.');
        return;
      }
    }

    dataService.submitEnquiry({
      applicantName: manualForm.applicantName,
      guardianName: manualForm.guardianName,
      phone: manualForm.phone,
      email: manualForm.email || undefined,
      division: manualForm.division,
      desiredClass: manualForm.desiredClass,
      desiredStream: manualForm.desiredStream,
      sscGpa: manualForm.sscGpa ? parseFloat(manualForm.sscGpa) : undefined,
      previousGpa: manualForm.previousGpa ? parseFloat(manualForm.previousGpa) : undefined,
      board: manualForm.board,
      passingYear: manualForm.passingYear,
      previousSchool: manualForm.previousSchool || undefined,
      message: manualForm.message || undefined,
    });

    setShowManualModal(false);
    reloadEnquiries();
    setManualForm({
      applicantName: '',
      guardianName: '',
      phone: '',
      email: '',
      division: 'college',
      desiredClass: 'Class 11 (HSC 1st Year)',
      desiredStream: 'Science',
      sscGpa: '5.00',
      previousGpa: '',
      board: 'Dhaka',
      passingYear: '2024',
      previousSchool: '',
      message: '',
    });
  };

  // Filtered enquiries
  const filteredEnquiries = enquiries.filter(enq => {
    if (divisionFilter !== 'all' && enq.division !== divisionFilter) return false;
    if (statusFilter !== 'all' && enq.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = enq.applicantName.toLowerCase().includes(q);
      const matchPhone = enq.phone.includes(q);
      const matchGuardian = enq.guardianName.toLowerCase().includes(q);
      const matchClass = enq.desiredClass.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchGuardian && !matchClass) return false;
    }
    return true;
  });

  // Analytics Metrics
  const totalEnquiries = enquiries.length;
  const newCount = enquiries.filter(e => e.status === 'new').length;
  const approvedCount = enquiries.filter(e => e.status === 'approved' || e.status === 'enrolled').length;
  const collegeEnquiries = enquiries.filter(e => e.division === 'college');
  const avgSscGpa = collegeEnquiries.length > 0
    ? (collegeEnquiries.reduce((acc, curr) => acc + (curr.sscGpa || 5.0), 0) / collegeEnquiries.length).toFixed(2)
    : '5.00';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-royal" />
            <span>{language === 'bn' ? 'অনলাইন ভর্তি আবেদন ডেস্ক' : 'Admissions Applications Desk'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn'
              ? 'শিক্ষার্থীদের অনলাইন আবেদন পর্যালোচনা, এসএসসি/এইচএসসি জিপিএ যাচাই ও শিক্ষার্থী রোস্টারে সরাসরি ভর্তি নিশ্চিত করুন।'
              : 'Review online admission applications, verify SSC/HSC exam GPAs, and convert applicants into active students.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowManualModal(true)}
          className="px-4 py-2 text-xs font-semibold bg-royal hover:bg-royal-hover text-white rounded-xl flex items-center gap-1.5 transition-all shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? '+ নতুন আবেদন যুক্ত করুন' : '+ Log Walk-in Application'}</span>
        </button>
      </div>

      {/* Confirmation Toast */}
      {admittedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{admittedSuccess}</span>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-slate-border shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-semibold uppercase">{language === 'bn' ? 'মোট আবেদন' : 'Total Applications'}</span>
            <FileText className="w-4 h-4 text-royal" />
          </div>
          <p className="text-2xl font-black text-navy-950 font-mono">{totalEnquiries}</p>
          <span className="text-[10px] text-slate-400">{language === 'bn' ? 'চলতি শিক্ষাবর্ষ ২০২৫' : 'Academic Session 2025'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-1">
            <span className="text-[11px] font-semibold uppercase">{language === 'bn' ? 'নতুন ও অপেক্ষমাণ' : 'Pending Review'}</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-900 font-mono">{newCount}</p>
          <span className="text-[10px] text-amber-700/80">{language === 'bn' ? 'পর্যালোচনা প্রয়োজন' : 'Action required'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-[11px] font-semibold uppercase">{language === 'bn' ? 'অনুমোদিত / ভর্তি' : 'Approved / Enrolled'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-900 font-mono">{approvedCount}</p>
          <span className="text-[10px] text-emerald-700/80">{language === 'bn' ? 'ভর্তি সম্পন্ন' : 'Registered as active students'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 shadow-xs">
          <div className="flex items-center justify-between text-purple-800 mb-1">
            <span className="text-[11px] font-semibold uppercase">{language === 'bn' ? 'কলেজ জিপিএ গড়' : 'College Avg SSC GPA'}</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-900 font-mono">{avgSscGpa} / 5.00</p>
          <span className="text-[10px] text-purple-700/80">{collegeEnquiries.length} {language === 'bn' ? 'জন কলেজ আবেদনকারী' : 'College applicants'}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface rounded-xl p-3 sm:p-4 border border-slate-border shadow-card flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'আবেদনকারী, মোবাইল বা শ্রেণি খুঁজুন...' : 'Search applicant, phone, or class...'}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
          {/* Division Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium border border-slate-200">
            <button
              onClick={() => setDivisionFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                divisionFilter === 'all' ? 'bg-royal text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDivisionFilter('school')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                divisionFilter === 'school' ? 'bg-royal text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              School
            </button>
            <button
              onClick={() => setDivisionFilter('college')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                divisionFilter === 'college' ? 'bg-status-violet text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              College
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-royal font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="new">New / Unreviewed</option>
            <option value="reviewed">Reviewed</option>
            <option value="interview_scheduled">Interview</option>
            <option value="approved">Approved / Admitted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Roster */}
      <div className="bg-surface rounded-2xl border border-slate-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-navy-950">
              {language === 'bn' ? 'ভর্তি আবেদনকারীদের বিস্তারিত তালিকা' : 'Online Admission Applications'}
            </h3>
            <span className="px-2 py-0.5 bg-blue-50 text-royal font-bold text-[10px] rounded-full">
              {filteredEnquiries.length} {language === 'bn' ? 'টি আবেদন' : 'Logged'}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Northern Star Admissions Portal
          </span>
        </div>

        {filteredEnquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p>{language === 'bn' ? 'কোনো ভর্তি আবেদন পাওয়া যায়নি।' : 'No admission applications match your current filters.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {filteredEnquiries.map((enq) => {
              const isCollege = enq.division === 'college' || enq.desiredClass.includes('11') || enq.desiredClass.includes('12');
              const isSsc = enq.desiredClass.includes('9') || enq.desiredClass.includes('10');

              return (
                <div
                  key={enq.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                >
                  {/* Left: Applicant Profile & GPA Highlights */}
                  <div className="flex items-start gap-3.5">
                    {enq.photoUrl ? (
                      <img
                        src={enq.photoUrl}
                        alt={enq.applicantName}
                        className="w-12 h-14 rounded-lg object-cover border border-slate-200 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-14 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-base uppercase shrink-0 border border-slate-300 shadow-xs">
                        {enq.applicantName.charAt(0)}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-navy-950 text-sm sm:text-base">
                          {enq.applicantName}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isCollege ? 'bg-purple-100 text-status-violet' : 'bg-blue-100 text-royal'
                        }`}>
                          {enq.division === 'school' ? (language === 'bn' ? 'স্কুল শাখা' : 'School') : (language === 'bn' ? 'কলেজ শাখা' : 'College')} • {enq.desiredClass}
                        </span>
                        {enq.desiredStream && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {enq.desiredStream}
                          </span>
                        )}
                      </div>

                      {/* Prominent GPA Badge for SSC & HSC Applicants */}
                      <div className="flex flex-wrap items-center gap-2">
                        {enq.sscGpa !== undefined && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400 text-amber-900 font-bold text-[11px]">
                            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>SSC GPA: <strong>{Number(enq.sscGpa).toFixed(2)}</strong> / 5.00</span>
                            {enq.board && <span className="font-normal text-slate-600">({enq.board} Board {enq.passingYear ? `• ${enq.passingYear}` : ''})</span>}
                          </div>
                        )}

                        {enq.previousGpa !== undefined && enq.sscGpa === undefined && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-300 text-royal font-bold text-[11px]">
                            <Award className="w-3.5 h-3.5 text-royal shrink-0" />
                            <span>Previous GPA: <strong>{Number(enq.previousGpa).toFixed(2)}</strong> / 5.00</span>
                            {enq.board && <span className="font-normal text-slate-600">({enq.board})</span>}
                          </div>
                        )}

                        {enq.previousSchool && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <School className="w-3 h-3 text-slate-400" />
                            <span>{enq.previousSchool}</span>
                          </span>
                        )}
                      </div>

                      {/* Guardian & Contact Info */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600 text-xs">
                        <span>{language === 'bn' ? 'অভিভাবক:' : 'Guardian:'} <strong>{enq.guardianName}</strong></span>
                        <a href={`tel:${enq.phone}`} className="flex items-center gap-1 text-royal font-semibold hover:underline">
                          <Phone className="w-3 h-3" />
                          <span>{enq.phone}</span>
                        </a>
                        {enq.email && (
                          <span className="text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{enq.email}</span>
                          </span>
                        )}
                      </div>

                      {enq.message && (
                        <p className="text-slate-500 italic text-[11px] max-w-2xl bg-slate-50 p-2 rounded-lg border border-slate-100">
                          "{enq.message}"
                        </p>
                      )}

                      <span className="text-[10px] text-slate-400 block font-mono">
                        {language === 'bn' ? 'আবেদনের সময়:' : 'Submitted:'} {new Date(enq.submittedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Right: Status selector and Quick Actions */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      enq.status === 'approved' ? 'bg-emerald-100 text-status-green' :
                      enq.status === 'rejected' ? 'bg-rose-100 text-status-red' :
                      enq.status === 'interview_scheduled' ? 'bg-blue-100 text-royal' :
                      enq.status === 'reviewed' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-amber-100 text-status-orange'
                    }`}>
                      {enq.status}
                    </span>

                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq.id, e.target.value as any)}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-royal font-medium"
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="interview_scheduled">Interview</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setViewingEnquiry(enq)}
                      title="View Full Application Dossier"
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Details</span>
                    </button>

                    {enq.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => handleAdmitStudent(enq)}
                        className="px-3.5 py-1.5 bg-royal hover:bg-royal-hover text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{language === 'bn' ? 'ভর্তি নিশ্চিত করুন' : 'Admit Student'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteEnquiry(enq.id, enq.applicantName)}
                      title="Remove Application"
                      className="p-1.5 text-slate-400 hover:text-status-red hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW APPLICATION DOSSIER MODAL */}
      {viewingEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-modal border border-slate-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-royal" />
                <h3 className="text-base font-bold text-navy-950">
                  {language === 'bn' ? 'ভর্তি আবেদনের পূর্ণাঙ্গ বিবরণ' : 'Admission Application Dossier'}
                </h3>
              </div>
              <button onClick={() => setViewingEnquiry(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="flex items-center gap-3.5 p-3.5 bg-slate-50 rounded-xl">
                {viewingEnquiry.photoUrl ? (
                  <img
                    src={viewingEnquiry.photoUrl}
                    alt={viewingEnquiry.applicantName}
                    className="w-16 h-20 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-20 rounded-lg bg-navy-900 text-white flex items-center justify-center font-bold text-xl uppercase shrink-0">
                    {viewingEnquiry.applicantName.charAt(0)}
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-navy-950">{viewingEnquiry.applicantName}</h4>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    viewingEnquiry.division === 'college' ? 'bg-purple-100 text-status-violet' : 'bg-blue-100 text-royal'
                  }`}>
                    {viewingEnquiry.division} Division • {viewingEnquiry.desiredClass}
                  </span>
                  {viewingEnquiry.desiredStream && (
                    <p className="text-slate-500 font-medium">Stream / Group: {viewingEnquiry.desiredStream}</p>
                  )}
                </div>
              </div>

              {/* GPA Highlight Box */}
              {(viewingEnquiry.sscGpa !== undefined || viewingEnquiry.previousGpa !== undefined) && (
                <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl space-y-1">
                  <span className="font-bold text-amber-900 block text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Official GPA Credential</span>
                  </span>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-navy-950 font-bold text-sm">
                        GPA: {Number(viewingEnquiry.sscGpa || viewingEnquiry.previousGpa).toFixed(2)} / 5.00
                      </p>
                      <p className="text-slate-600 text-[11px]">
                        Board: <strong>{viewingEnquiry.board || 'Dhaka'}</strong> {viewingEnquiry.passingYear ? `• Year: ${viewingEnquiry.passingYear}` : ''}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-amber-500 text-white font-bold rounded-lg text-xs">
                      Verified
                    </span>
                  </div>
                </div>
              )}

              {/* Detailed Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Guardian Name</span>
                  <span className="font-bold text-navy-950">{viewingEnquiry.guardianName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Guardian Contact</span>
                  <span className="font-bold text-navy-950">{viewingEnquiry.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
                  <span className="font-bold text-navy-950">{viewingEnquiry.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Previous School</span>
                  <span className="font-bold text-navy-950">{viewingEnquiry.previousSchool || 'N/A'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Submitted Date & Time</span>
                  <span className="font-mono text-slate-700">{new Date(viewingEnquiry.submittedAt).toLocaleString()}</span>
                </div>
              </div>

              {viewingEnquiry.message && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Applicant's Statement</span>
                  <p className="p-3 bg-slate-50 rounded-lg text-slate-700 italic border border-slate-100">
                    "{viewingEnquiry.message}"
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleDeleteEnquiry(viewingEnquiry.id, viewingEnquiry.applicantName)}
                className="px-3 py-2 text-status-red hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingEnquiry(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
                >
                  Close
                </button>
                {viewingEnquiry.status !== 'approved' && (
                  <button
                    type="button"
                    onClick={() => handleAdmitStudent(viewingEnquiry)}
                    className="px-4 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Admit Student</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD WALK-IN APPLICATION MODAL */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-modal border border-slate-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-royal" />
                <h3 className="text-base font-bold text-navy-950">
                  {language === 'bn' ? 'সরাসরি ভর্তি আবেদন গ্রহণ (Walk-in Form)' : 'Record Walk-in Admission Application'}
                </h3>
              </div>
              <button onClick={() => setShowManualModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleManualSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.applicantName}
                    onChange={(e) => setManualForm({ ...manualForm, applicantName: e.target.value })}
                    placeholder="e.g. Mahir Faisal"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.guardianName}
                    onChange={(e) => setManualForm({ ...manualForm, guardianName: e.target.value })}
                    placeholder="e.g. Mr. Faisal Hossain"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={manualForm.phone}
                    onChange={(e) => setManualForm({ ...manualForm, phone: e.target.value })}
                    placeholder="+880 17XX XXXXXX"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Division *</label>
                  <select
                    value={manualForm.division}
                    onChange={(e) => {
                      const div = e.target.value as DivisionType;
                      setManualForm({
                        ...manualForm,
                        division: div,
                        desiredClass: div === 'college' ? 'Class 11 (HSC 1st Year)' : 'Class 9'
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    <option value="school">School Division (Class 1-10)</option>
                    <option value="college">College Division (HSC 11-12)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Desired Class *</label>
                  <select
                    value={manualForm.desiredClass}
                    onChange={(e) => setManualForm({ ...manualForm, desiredClass: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    {manualForm.division === 'school' ? (
                      <>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                      </>
                    ) : (
                      <>
                        <option value="Class 11 (HSC 1st Year)">Class 11 (HSC 1st Year)</option>
                        <option value="Class 12 (HSC 2nd Year)">Class 12 (HSC 2nd Year)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stream / Group</label>
                  <select
                    value={manualForm.desiredStream}
                    onChange={(e) => setManualForm({ ...manualForm, desiredStream: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce / Business Studies</option>
                    <option value="Humanities">Humanities / Arts</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Previous School / College</label>
                  <input
                    type="text"
                    value={manualForm.previousSchool}
                    onChange={(e) => setManualForm({ ...manualForm, previousSchool: e.target.value })}
                    placeholder="e.g. Government Laboratory High School"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>
              </div>

              {/* College SSC GPA Fields */}
              {manualForm.division === 'college' && (
                <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200/80 space-y-2">
                  <span className="font-bold text-status-violet block text-xs uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    <span>SSC Examination Record (Required)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">SSC GPA (Scale 5.00) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1.00"
                        max="5.00"
                        required
                        value={manualForm.sscGpa}
                        onChange={(e) => setManualForm({ ...manualForm, sscGpa: e.target.value })}
                        placeholder="5.00"
                        className="w-full px-3 py-2 bg-white border rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Board *</label>
                      <select
                        value={manualForm.board}
                        onChange={(e) => setManualForm({ ...manualForm, board: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded-lg"
                      >
                        <option value="Dhaka">Dhaka Board</option>
                        <option value="Chattogram">Chattogram Board</option>
                        <option value="Rajshahi">Rajshahi Board</option>
                        <option value="Cumilla">Cumilla Board</option>
                        <option value="Barishal">Barishal Board</option>
                        <option value="Sylhet">Sylhet Board</option>
                        <option value="Dinajpur">Dinajpur Board</option>
                        <option value="Mymensingh">Mymensingh Board</option>
                        <option value="Madrasah">Madrasah Board</option>
                        <option value="Technical">Technical Board</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Passing Year *</label>
                      <select
                        value={manualForm.passingYear}
                        onChange={(e) => setManualForm({ ...manualForm, passingYear: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded-lg"
                      >
                        <option value="2025">2025</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* School SSC Level GPA Fields */}
              {manualForm.division === 'school' && (manualForm.desiredClass.includes('9') || manualForm.desiredClass.includes('10')) && (
                <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 space-y-2">
                  <span className="font-bold text-amber-900 block text-xs uppercase flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Previous Class / JSC Record (Required)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Previous GPA (Scale 5.00) *</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1.00"
                        max="5.00"
                        required
                        value={manualForm.previousGpa}
                        onChange={(e) => setManualForm({ ...manualForm, previousGpa: e.target.value })}
                        placeholder="e.g. 5.00 or 4.80"
                        className="w-full px-3 py-2 bg-white border rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Board / Institution</label>
                      <input
                        type="text"
                        value={manualForm.board}
                        onChange={(e) => setManualForm({ ...manualForm, board: e.target.value })}
                        placeholder="Dhaka Board"
                        className="w-full px-3 py-2 bg-white border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Internal Admission Office Notes</label>
                <textarea
                  rows={2}
                  value={manualForm.message}
                  onChange={(e) => setManualForm({ ...manualForm, message: e.target.value })}
                  placeholder="e.g. Verified original mark sheet and birth registration certificate."
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Record Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
