import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber, getLocalizedSubjectName } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { calculateGrade, calculateOverallGpa } from '../../utils/grading';
import { Student } from '../../types';
import {
  Award,
  ClipboardList,
  Printer,
  CheckCircle,
  FileText,
  Search,
  Filter,
  X,
  Download
} from 'lucide-react';
import { LogoEmblem } from '../../components/brand/Logo';

export const ExaminationsManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const exams = dataService.getExaminations();
  const classes = dataService.getClasses();

  const [selectedExamId, setSelectedExamId] = useState<string>('exam-final-2025');
  const [selectedClassId, setSelectedClassId] = useState<string>('c-9');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);

  const students = dataService.getStudents({ classId: selectedClassId });
  const subjects = dataService.getSubjects(selectedClassId);

  // Mock marks state for rapid testing & live evaluation
  const [marksState, setMarksState] = useState<Record<string, number>>({
    'stu-rafiq_sub-math': 91,
    'stu-rafiq_sub-phy': 86,
    'stu-rafiq_sub-chem': 82,
    'stu-rafiq_sub-eng': 79,
    'stu-rafiq_sub-ban': 88,
    'stu-rafiq_sub-bio': 85,
    'stu-samiul_sub-math': 94,
    'stu-samiul_sub-eng': 78,
    'stu-samiul_sub-phy': 76,
  });

  const handleMarkChange = (studentId: string, subjectId: string, val: number) => {
    setMarksState(prev => ({
      ...prev,
      [`${studentId}_${subjectId}`]: val,
    }));
  };

  // Generate Report Card Data for Student
  const getStudentReportData = (student: Student) => {
    const studentSubjects = subjects.map(sub => {
      const marksObtained = marksState[`${student.id}_${sub.id}`] ?? 80;
      const { grade, gradePoint, remarks } = calculateGrade(marksObtained, sub.fullMarks);
      return {
        ...sub,
        totalMarks: sub.fullMarks,
        marksObtained,
        grade,
        gradePoint,
        remarks,
      };
    });

    const summary = calculateOverallGpa(studentSubjects);
    return {
      student,
      subjects: studentSubjects,
      summary,
    };
  };

  const reportData = selectedStudentForReport ? getStudentReportData(selectedStudentForReport) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            {t('examResultsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {t('examResultsSubtitle')}
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              {t('selectExamTerm')}
            </label>
            <select
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-navy-950 focus:outline-none focus:border-royal"
            >
              {exams.map(e => (
                <option key={e.id} value={e.id}>
                  {language === 'bn' && e.title.includes('Final Term') ? 'বার্ষিক পরীক্ষা ২০২৫' : e.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 block mb-1">
              {t('class')}
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium text-navy-950 focus:outline-none focus:border-royal"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {language === 'bn' ? c.name.replace('Class', 'শ্রেণি').replace('HSC 1st Year', 'একাদশ শ্রেণি').replace('HSC 2nd Year', 'দ্বাদশ শ্রেণি') : c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{t('gradingScaleLabel')}</span>
          <span className="px-2.5 py-1 text-xs font-bold bg-blue-50 text-royal border border-blue-200 rounded-md">
            {t('nationalCurriculumGPA')}
          </span>
        </div>
      </div>

      {/* MARKS ENTRY & STUDENT ROSTER */}
      <div className="bg-surface rounded-xl border border-slate-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-navy-950">
            {t('studentMarksSheetTitle')}
          </h3>
          <span className="text-xs text-slate-400">
            {t('clickPrintReportHint')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">{t('roll')}</th>
                <th className="py-3 px-4 font-semibold">{t('studentName')}</th>
                {subjects.map(s => (
                  <th key={s.id} className="py-3 px-3 font-semibold text-center">
                    {getLocalizedSubjectName(s.name, language)} ({toLocaleNumber(s.fullMarks, language)})
                  </th>
                ))}
                <th className="py-3 px-4 font-semibold text-center">{t('gpaScale5')}</th>
                <th className="py-3 px-4 font-semibold text-center">{t('grade')}</th>
                <th className="py-3 px-4 font-semibold text-right">{t('reportCard')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map(st => {
                const rep = getStudentReportData(st);
                return (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">
                      {st.rollNo}
                    </td>
                    <td className="py-3 px-4 font-semibold text-navy-950">
                      {st.fullName}
                    </td>
                    {subjects.map(sub => {
                      const currentVal = marksState[`${st.id}_${sub.id}`] ?? 80;
                      return (
                        <td key={sub.id} className="py-2 px-2 text-center">
                          <input
                            type="number"
                            min="0"
                            max={sub.fullMarks}
                            value={currentVal}
                            onChange={(e) => handleMarkChange(st.id, sub.id, parseInt(e.target.value) || 0)}
                            className="w-14 text-center py-1 text-xs font-semibold bg-slate-50 border border-slate-200 rounded focus:border-royal focus:outline-none"
                          />
                        </td>
                      );
                    })}
                    <td className="py-3 px-4 text-center font-bold text-status-green">
                      {toLocaleNumber(rep.summary.gpa.toFixed(2), language)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded font-bold text-xs bg-emerald-50 text-status-green border border-emerald-200">
                        {rep.summary.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForReport(st)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-royal hover:bg-royal hover:text-white transition-all inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{t('printReport')}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* OFFICIAL PRINTABLE REPORT CARD MODAL */}
      {selectedStudentForReport && reportData && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-border print:max-h-none print:shadow-none print:border-none print:p-0">
            {/* Modal Actions Bar (hidden when printing) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 no-print shrink-0">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-royal" />
                <span>{t('officialTranscriptPreview')}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-royal text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-royal-hover shadow-sm transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>{t('printDocument')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForReport(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Container for Modal Viewing */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1 print:overflow-visible print:p-0">
              {/* PRINTABLE REPORT CARD CONTAINER */}
              <div id="printable-document" className="p-6 border-2 border-navy-900 rounded-xl bg-white shadow-xs print:border-none print:p-0 print:shadow-none">
                {/* Institution Header */}
                <div className="text-center pb-4 border-b-2 border-navy-900 flex flex-col items-center">
                  <LogoEmblem sizeClass="w-16 h-16 mb-2" idSuffix="report-card" />
                  <h2 className="text-2xl font-serif font-black tracking-wider text-navy-950 uppercase">
                    {t('brandName')}
                  </h2>
                  <p className="text-xs font-medium text-slate-600">
                    {t('dhakaBangladesh')} • {t('tagline')}
                  </p>
                  <div className="mt-2 inline-block px-4 py-1 rounded bg-navy-900 text-white text-xs font-bold uppercase tracking-widest">
                    {t('academicProgressReport')} • {t('finalTerm2025')}
                  </div>
                </div>

                {/* Student Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 text-xs border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t('studentName')}</span>
                    <span className="font-bold text-navy-950 text-sm">{reportData.student.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t('roll')}</span>
                    <span className="font-mono font-bold text-navy-950">{reportData.student.rollNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t('classAndStream')}</span>
                    <span className="font-bold text-navy-950">
                      {language === 'bn' ? reportData.student.className.replace('Class', 'শ্রেণি').replace('Science', 'বিজ্ঞান').replace('Arts', 'মানবিক') : reportData.student.className}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">{t('academicSession')}</span>
                    <span className="font-bold text-navy-950">{language === 'bn' ? '২০২৫ - ২০২৬' : '2025 - 2026'}</span>
                  </div>
                </div>

                {/* Subject Scores Table */}
                <div className="py-4">
                  <table className="w-full text-left text-xs border border-slate-300">
                    <thead className="bg-slate-100 border-b border-slate-300 font-bold text-navy-950">
                      <tr>
                        <th className="py-2.5 px-3 border-r border-slate-300">{t('subjectName')}</th>
                        <th className="py-2.5 px-3 border-r border-slate-300 text-center">{t('fullMarks')}</th>
                        <th className="py-2.5 px-3 border-r border-slate-300 text-center">{t('passMarks')}</th>
                        <th className="py-2.5 px-3 border-r border-slate-300 text-center">{t('marksObtained')}</th>
                        <th className="py-2.5 px-3 border-r border-slate-300 text-center">{t('letterGrade')}</th>
                        <th className="py-2.5 px-3 text-center">{t('gradePoint')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {reportData.subjects.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 border-r border-slate-200 font-medium text-navy-950">
                            {getLocalizedSubjectName(s.name, language)} {s.isOptional ? `(${language === 'bn' ? '৪র্থ ঐচ্ছিক' : '4th Optional'})` : ''}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center">{toLocaleNumber(s.fullMarks, language)}</td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center">{toLocaleNumber(s.passMarks, language)}</td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold text-navy-950">
                            {toLocaleNumber(s.marksObtained, language)}
                          </td>
                          <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">
                            {s.grade}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold">
                            {toLocaleNumber(s.gradePoint.toFixed(1), language)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Results Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">{t('totalMarksObtained')}: </span>
                    <span className="font-bold text-navy-950">
                      {toLocaleNumber(reportData.summary.totalMarksObtained, language)} / {toLocaleNumber(reportData.summary.maxTotalMarks, language)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('gpaAverage')}: </span>
                    <span className="font-bold text-status-green text-sm">
                      {toLocaleNumber(reportData.summary.gpa.toFixed(2), language)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('overallGrade')}: </span>
                    <span className="font-bold text-navy-950 text-sm px-2.5 py-0.5 bg-emerald-100 text-status-green rounded border border-emerald-200">
                      {reportData.summary.grade}
                    </span>
                  </div>
                </div>

                {/* Signatures Footer */}
                <div className="pt-12 mt-6 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <div className="text-center">
                    <div className="w-32 sm:w-36 border-t-2 border-slate-800 pt-1.5" />
                    <span>{t('classTeacherSignature')}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-32 sm:w-36 border-t-2 border-slate-800 pt-1.5" />
                    <span>{t('examControllerSignature')}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-32 sm:w-36 border-t-2 border-slate-800 pt-1.5" />
                    <span>{t('principalSignature')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
