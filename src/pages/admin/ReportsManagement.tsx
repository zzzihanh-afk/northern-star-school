import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber, formatBDT } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import {
  BarChart3,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  Award,
  Users,
  CreditCard,
  CheckCircle2,
  PieChart as PieChartIcon,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building,
  School
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { LogoEmblem } from '../../components/brand/Logo';

export const ReportsManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'academic' | 'attendance' | 'financial' | 'demographics'>('academic');

  // Academic data (Class 1 to 12)
  const classPerformanceData = [
    { class: 'Class 1', passRate: 100, gpa5: 36, avgScore: 92 },
    { class: 'Class 2', passRate: 99, gpa5: 34, avgScore: 89 },
    { class: 'Class 3', passRate: 99, gpa5: 35, avgScore: 87 },
    { class: 'Class 4', passRate: 98, gpa5: 30, avgScore: 84 },
    { class: 'Class 5', passRate: 99, gpa5: 38, avgScore: 86 },
    { class: 'Class 6', passRate: 98, gpa5: 28, avgScore: 82 },
    { class: 'Class 7', passRate: 97, gpa5: 24, avgScore: 79 },
    { class: 'Class 8', passRate: 99, gpa5: 35, avgScore: 85 },
    { class: 'Class 9', passRate: 96, gpa5: 32, avgScore: 81 },
    { class: 'Class 10', passRate: 100, gpa5: 42, avgScore: 88 },
    { class: 'Class 11', passRate: 95, gpa5: 38, avgScore: 78 },
    { class: 'Class 12', passRate: 99, gpa5: 46, avgScore: 86 },
  ];

  // Attendance data (Class 1 to 12)
  const classAttendanceData = [
    { class: 'Class 1', rate: 96 },
    { class: 'Class 2', rate: 97 },
    { class: 'Class 3', rate: 95 },
    { class: 'Class 4', rate: 94 },
    { class: 'Class 5', rate: 96 },
    { class: 'Class 6', rate: 95 },
    { class: 'Class 7', rate: 94 },
    { class: 'Class 8', rate: 93 },
    { class: 'Class 9', rate: 92 },
    { class: 'Class 10', rate: 96 },
    { class: 'Class 11', rate: 91 },
    { class: 'Class 12', rate: 94 },
  ];

  // Payment gateway distribution
  const paymentMethodData = [
    { name: 'bKash', value: 45, color: '#EC4899' },
    { name: 'Cash Counter', value: 35, color: '#10B981' },
    { name: 'Nagad', value: 15, color: '#F97316' },
    { name: 'Bank Transfer', value: 5, color: '#1769E8' },
  ];

  // Division breakdown
  const divisionData = [
    { name: language === 'bn' ? 'স্কুল শাখা (১ম - ১০ম)' : 'School Division (Class 1 - 10)', count: 740, color: '#1769E8' },
    { name: language === 'bn' ? 'কলেজ শাখা (একাদশ - দ্বাদশ)' : 'College Division (Class 11 - 12)', count: 508, color: '#8B5CF6' },
  ];

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + [
      "Report Category,Metric,Value",
      "Institutional Overview,Total Students,1248",
      "Institutional Overview,Total Faculty,86",
      "Institutional Overview,Total Classes,42",
      "Academic Performance,Overall Pass Rate,98.4%",
      "Academic Performance,GPA 5.0 (A+) Total Achievers,245",
      "Attendance,Institution Average Attendance Rate,94.2%",
      "Finance,Total Annual Collections (BDT),৳ 10000",
      "Finance,Dominant Gateway,bKash (45%)",
      "Enrollment,School Division Students,740",
      "Enrollment,College Division Students,508"
    ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Northern_Star_Institution_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-royal" />
            <span>{t('reportsTitle')}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {t('reportsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{t('exportAllReports')}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2 text-xs font-semibold bg-royal hover:bg-royal-hover text-white rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printInstitutionalReport')}</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted uppercase">{t('overallPassRate')}</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-status-green flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-status-green mt-1">
            {toLocaleNumber('98.4%', language)}
          </h3>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{language === 'bn' ? 'জাতীয় শিক্ষাক্রম পরীক্ষা' : 'Board Exam Standard'}</span>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted uppercase">{t('gpa5Achievers')}</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-royal flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-navy-950 mt-1">
            {toLocaleNumber(245, language)}
          </h3>
          <span className="text-[11px] text-royal font-medium mt-0.5 block">{language === 'bn' ? 'গোল্ডেন এ+ সহ' : 'Incl. Golden A+'}</span>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted uppercase">{t('averageAttendance')}</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-status-violet flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-status-violet mt-1">
            {toLocaleNumber('94.2%', language)}
          </h3>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{language === 'bn' ? 'দৈনিক গড় উপস্থিতি' : 'Daily Academic Avg'}</span>
        </div>

        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-muted uppercase">{t('totalStudents')}</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-status-orange flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-navy-950 mt-1">
            {toLocaleNumber(1248, language)}
          </h3>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block">{language === 'bn' ? '১২% বার্ষিক প্রবৃদ্ধি' : '+12% Annual Growth'}</span>
        </div>
      </div>

      {/* REPORT TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'academic'
              ? 'bg-royal text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{t('academicReports')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'attendance'
              ? 'bg-royal text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t('attendanceReports')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'financial'
              ? 'bg-royal text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{t('financialReports')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('demographics')}
          className={`px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'demographics'
              ? 'bg-royal text-white shadow-sm'
              : 'text-slate-600 hover:text-navy-950 hover:bg-slate-100'
          }`}
        >
          <PieChartIcon className="w-4 h-4" />
          <span>{t('enrollmentReports')}</span>
        </button>
      </div>

      {/* TAB CONTENT: ACADEMIC */}
      {activeTab === 'academic' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
            <h3 className="text-sm font-bold text-navy-950 mb-1">
              {language === 'bn' ? 'শ্রেণিভিত্তিক পাস ও জিপিএ ৫.০ অর্জন পর্যালোচনা' : 'Class-by-Class Pass Rate & GPA 5.0 Achievers'}
            </h3>
            <p className="text-xs text-slate-muted mb-6">
              {language === 'bn' ? 'সকল শ্রেণির সাম্প্রতিক পরীক্ষার ফলাফলের তুলনামূলক গ্রাফ।' : 'Comparative analytical metrics across School and College divisions.'}
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="class" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#061B3A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="passRate" name={language === 'bn' ? 'পাসের হার (%)' : 'Pass Rate (%)'} fill="#1769E8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="gpa5" name={language === 'bn' ? 'জিপিএ ৫.০ সংখ্যা' : 'GPA 5.0 Count'} fill="#F4B323" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-slate-border shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h4 className="text-sm font-bold text-navy-950">
                {language === 'bn' ? 'শ্রেণিভিত্তিক বিস্তারিত ফলাফল তালিকা' : 'Detailed Class Academic Breakdown Table'}
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 font-semibold">{t('class')}</th>
                    <th className="py-3 px-4 font-semibold text-center">{language === 'bn' ? 'পাসের হার' : 'Pass Rate'}</th>
                    <th className="py-3 px-4 font-semibold text-center">{language === 'bn' ? 'জিপিএ ৫.০ শিক্ষার্থী' : 'GPA 5.0 Count'}</th>
                    <th className="py-3 px-4 font-semibold text-center">{language === 'bn' ? 'গড় নম্বর' : 'Avg Score'}</th>
                    <th className="py-3 px-4 font-semibold text-right">{language === 'bn' ? 'স্ট্যাটাস' : 'Academic Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {classPerformanceData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-bold text-navy-950">{row.class}</td>
                      <td className="py-3 px-4 text-center font-bold text-status-green">{toLocaleNumber(`${row.passRate}%`, language)}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-royal">{toLocaleNumber(row.gpa5, language)}</td>
                      <td className="py-3 px-4 text-center font-mono">{toLocaleNumber(`${row.avgScore}/100`, language)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-status-green border border-emerald-200">
                          {language === 'bn' ? 'উচ্চ মানদণ্ড' : 'High Performance'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
            <h3 className="text-sm font-bold text-navy-950 mb-1">
              {language === 'bn' ? 'শ্রেণিভিত্তিক উপস্থিতির হার বিশ্লেষণ' : 'Class-by-Class Attendance Rate Analytics'}
            </h3>
            <p className="text-xs text-slate-muted mb-6">
              {language === 'bn' ? 'চলতি শিক্ষাবর্ষের সকল শ্রেণির উপস্থিতির নিয়মিত পর্যালোচনা।' : 'Consistent attendance records maintained through digital RFID & manual registers.'}
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classAttendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="class" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#061B3A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="rate" name={language === 'bn' ? 'উপস্থিতি (%)' : 'Attendance Rate (%)'} fill="#16A878" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: FINANCIAL */}
      {activeTab === 'financial' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
            <h3 className="text-sm font-bold text-navy-950 mb-1">
              {language === 'bn' ? 'পেমেন্ট মাধ্যমভিত্তিক ফি আদায় বণ্টন' : 'Collections by Payment Gateway'}
            </h3>
            <p className="text-xs text-slate-muted mb-4">
              {language === 'bn' ? 'বিকাশ, নগদ ও ক্যাশ কাউন্টারের সমন্বিত অনুপাত।' : 'Breakdown between Mobile Financial Services and Cash Counter.'}
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#061B3A', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-6 bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4">
            <h3 className="text-sm font-bold text-navy-950 mb-1">
              {language === 'bn' ? 'আর্থিক সারসংক্ষেপ ও তহবিল' : 'Financial Revenue & Audit Summary'}
            </h3>
            
            <div className="divide-y divide-slate-100 text-xs">
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">{language === 'bn' ? 'লগকৃত মোট লেনদেন সংখ্যা:' : 'Total Transactions Logged:'}</span>
                <span className="font-bold text-navy-950 font-mono">{toLocaleNumber(3, language)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">{language === 'bn' ? 'বর্তমান যাচাইকৃত আদায়:' : 'Verified Collected Revenue:'}</span>
                <span className="font-bold text-status-green font-mono">{formatBDT(10000, language)}</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">{language === 'bn' ? 'ডিফল্ট অডিট অ্যাকাউন্টিং:' : 'Operating Currency Standard:'}</span>
                <span className="font-bold text-royal">BDT (৳)</span>
              </div>
              <div className="py-3 flex justify-between">
                <span className="text-slate-600">{language === 'bn' ? 'আদায়কারী প্রধান শাখা:' : 'Accounts Management Hub:'}</span>
                <span className="font-semibold text-navy-950">Accounts Counter & Online MFS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEMOGRAPHICS */}
      {activeTab === 'demographics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
            <h3 className="text-sm font-bold text-navy-950 mb-1">
              {language === 'bn' ? 'স্কুল ও কলেজ শাখার শিক্ষার্থী বণ্টন' : 'School vs College Division Enrollment'}
            </h3>
            <p className="text-xs text-slate-muted mb-4">
              {language === 'bn' ? 'মোট ১,২৪৮ জন শিক্ষার্থীর সমন্বিত বিভাজন।' : 'Current institutional ratio across primary school and intermediate college.'}
            </p>

            <div className="space-y-4 pt-2 text-xs">
              {divisionData.map((div, i) => {
                const pct = Math.round((div.count / 1248) * 100);
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-navy-950">{div.name}</span>
                      <span className="text-royal font-mono">{toLocaleNumber(div.count, language)} ({toLocaleNumber(`${pct}%`, language)})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: div.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4 text-xs">
            <h3 className="text-sm font-bold text-navy-950 mb-1">
              {language === 'bn' ? 'লিঙ্গ অনুপাত ও পরিসংখ্যান' : 'Gender Parity & Faculty Ratio'}
            </h3>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">{language === 'bn' ? 'ছাত্র অনুপাত:' : 'Male Students:'}</span>
                <span className="font-bold text-navy-950">54% ({toLocaleNumber(674, language)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">{language === 'bn' ? 'ছাত্রী অনুপাত:' : 'Female Students:'}</span>
                <span className="font-bold text-navy-950">46% ({toLocaleNumber(574, language)})</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-600">{language === 'bn' ? 'শিক্ষক-শিক্ষার্থী অনুপাত:' : 'Teacher-to-Student Ratio:'}</span>
                <span className="font-bold text-status-green">1 : {toLocaleNumber(15, language)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
