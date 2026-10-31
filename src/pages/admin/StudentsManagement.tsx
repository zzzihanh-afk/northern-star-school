import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { Student, DivisionType } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  School,
  CheckCircle,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileSpreadsheet,
  AlertCircle,
  Camera,
  Image as ImageIcon,
  Award
} from 'lucide-react';

export const StudentsManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Import State
  const [importRows, setImportRows] = useState<any[]>([]);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');
  const [pastedCsv, setPastedCsv] = useState('');

  // Form State
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    admissionNo: `NSC-2025-${Math.floor(1000 + Math.random() * 9000)}`,
    rollNo: `NSC-2025-${Math.floor(100 + Math.random() * 900)}`,
    division: 'school' as DivisionType,
    classId: 'c-9',
    className: 'Class 9 (Science)',
    sectionId: 'sec-9s',
    sectionName: 'Science',
    stream: 'Science' as const,
    sessionId: 'sess-2025',
    dateOfBirth: '2009-05-15',
    gender: 'male' as const,
    guardianId: 'g-1',
    guardianName: '',
    guardianPhone: '',
    address: 'Dhaka, Bangladesh',
    status: 'active' as const,
    enrollmentDate: '2025-01-10',
    photoUrl: '',
    sscGpa: '' as string | number,
    previousGpa: '' as string | number,
    previousBoard: 'Dhaka',
    passingYear: '2024',
  });

  const classes = dataService.getClasses();
  const students = dataService.getStudents({
    division: selectedDivision === 'all' ? undefined : selectedDivision,
    classId: selectedClass === 'all' ? undefined : selectedClass,
    search: search || undefined,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Passport photo size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStudent(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.fullName || !newStudent.guardianName || !newStudent.guardianPhone) {
      alert(language === 'bn' ? 'অনুগ্রহ করে শিক্ষার্থীর নাম ও অভিভাবকের বিস্তারিত তথ্য পূরণ করুন।' : 'Please fill in student full name and guardian details.');
      return;
    }

    const isCollege = newStudent.division === 'college' || newStudent.classId === 'c-11' || newStudent.classId === 'c-12';
    const isSsc = newStudent.classId === 'c-9' || newStudent.classId === 'c-10';

    if (isCollege) {
      const gpa = parseFloat(String(newStudent.sscGpa));
      if (!newStudent.sscGpa || isNaN(gpa) || gpa < 1.0 || gpa > 5.0) {
        alert(language === 'bn' ? 'কলেজ শাখার শিক্ষার্থীদের জন্য এস.এস.সি জিপিএ (১.০০ - ৫.০০) আবশ্যক।' : 'For College division admission, SSC GPA (1.00 - 5.00) is required.');
        return;
      }
    }

    if (isSsc) {
      const gpa = parseFloat(String(newStudent.previousGpa));
      if (!newStudent.previousGpa || isNaN(gpa) || gpa < 1.0 || gpa > 5.0) {
        alert(language === 'bn' ? 'এস.এস.সি লেভেল (৯ম-১০ম শ্রেণি) শিক্ষার্থীর জন্য পূর্ববর্তী শ্রেণি / জেএসসি জিপিএ আবশ্যক।' : 'For SSC level students (Class 9-10), Previous Class / JSC GPA (1.00 - 5.00) is required.');
        return;
      }
    }

    dataService.addStudent({
      ...newStudent,
      sscGpa: newStudent.sscGpa ? parseFloat(String(newStudent.sscGpa)) : undefined,
      previousGpa: newStudent.previousGpa ? parseFloat(String(newStudent.previousGpa)) : undefined,
      previousBoard: newStudent.previousBoard || undefined,
      passingYear: newStudent.passingYear || undefined,
    });

    setShowAddModal(false);
    // Reset
    setNewStudent({
      ...newStudent,
      fullName: '',
      guardianName: '',
      guardianPhone: '',
      photoUrl: '',
      sscGpa: '',
      previousGpa: '',
      admissionNo: `NSC-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      rollNo: `NSC-2025-${Math.floor(100 + Math.random() * 900)}`,
    });
  };

  const handleExportCsv = () => {
    const headers = ['Admission No', 'Roll No', 'Full Name', 'Division', 'Class', 'Guardian', 'Phone', 'Gender', 'Status'];
    const rows = students.map(s => [
      s.admissionNo,
      s.rollNo,
      s.fullName,
      s.division,
      s.className,
      s.guardianName,
      s.guardianPhone,
      s.gender,
      s.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NorthernStar_Students_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleTemplate = () => {
    const templateContent = [
      'Full Name,Division,Class Name,Roll No,Guardian Name,Guardian Phone,Gender,Date of Birth,Address,Stream',
      'Tanvir Ahmed,school,Class 9,NSC-2025-0501,Mr. Ahmed Hossain,+880 1711 123456,male,2009-03-12,Uttara Dhaka,Science',
      'Sadia Afrin,college,Class 11 (HSC 1st Year),NSC-2025-0502,Mrs. Nasreen Begum,+880 1819 654321,female,2007-08-20,Mirpur Dhaka,Commerce',
      'Abrar Karim,school,Class 7,NSC-2025-0503,Mr. Abdul Karim,+880 1912 345678,male,2011-11-05,Dhanmondi Dhaka,General',
    ].join('\n');

    const blob = new Blob([templateContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'NorthernStar_Student_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const parseCsvText = (text: string) => {
    const lines = text.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) {
      setImportErrors(['CSV file is empty or contains only headers.']);
      setImportRows([]);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const parsed: any[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length < 3) continue;

      const fullName = cols[0] || '';
      const division = (cols[1]?.toLowerCase() === 'college' ? 'college' : 'school') as DivisionType;
      const className = cols[2] || (division === 'college' ? 'Class 11 (HSC 1st Year)' : 'Class 9');
      const rollNo = cols[3] || `NSC-2025-${Math.floor(1000 + Math.random() * 9000)}`;
      const guardianName = cols[4] || 'Guardian';
      const guardianPhone = cols[5] || '+880 1700 000000';
      const gender = (cols[6]?.toLowerCase() === 'female' ? 'female' : 'male') as 'male' | 'female';
      const dateOfBirth = cols[7] || '2009-01-01';
      const address = cols[8] || 'Dhaka, Bangladesh';
      const stream = (cols[9] as any) || 'General';

      if (!fullName) {
        errors.push(`Row ${i}: Student full name is missing.`);
        continue;
      }

      parsed.push({
        fullName,
        division,
        className,
        classId: division === 'college' ? 'c-11' : 'c-9',
        sectionId: division === 'college' ? 'sec-11s' : 'sec-9s',
        sectionName: 'General',
        rollNo,
        admissionNo: `NSC-2025-${Math.floor(10000 + Math.random() * 90000)}`,
        guardianId: `g-${Date.now()}-${i}`,
        guardianName,
        guardianPhone,
        gender,
        dateOfBirth,
        address,
        stream,
        sessionId: 'sess-2025',
        enrollmentDate: '2025-01-10',
        status: 'active' as const,
      });
    }

    setImportErrors(errors);
    setImportRows(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      parseCsvText(content);
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importRows.length === 0) return;
    const res = dataService.importStudents(importRows);
    setImportSuccessMsg(`Successfully imported ${res.successCount} student records!`);
    setTimeout(() => {
      setImportSuccessMsg('');
      setShowImportModal(false);
      setImportRows([]);
      setPastedCsv('');
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            {t('nav_students')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn' 
              ? 'শিক্ষার্থীদের বিস্তারিত প্রোফাইল, ভর্তি তথ্য ও একাডেমিক রেকর্ড ব্যবস্থাপনা।' 
              : 'Manage comprehensive student profiles, enrollment status, and academic records.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{t('exportCsv')}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-50 border border-emerald-300 text-status-green hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Upload className="w-4 h-4 text-status-green" />
            <span>{language === 'bn' ? 'এক্সেল / সিএসভি ইম্পোর্ট' : 'Import Excel / CSV'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-semibold bg-royal hover:bg-royal-hover text-white rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addStudent')}</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, roll, or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Division Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium border border-slate-200">
            <button
              onClick={() => setSelectedDivision('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedDivision === 'all' ? 'bg-white text-navy-950 font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedDivision('school')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedDivision === 'school' ? 'bg-royal text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              School
            </button>
            <button
              onClick={() => setSelectedDivision('college')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                selectedDivision === 'college' ? 'bg-status-violet text-white font-bold shadow-xs' : 'text-slate-600'
              }`}
            >
              College
            </button>
          </div>

          {/* Class Filter */}
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-royal"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* STUDENT RECORDS TABLE */}
      <div className="bg-surface rounded-xl border border-slate-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'শিক্ষার্থী আইডি / রোল' : 'Student ID / Roll'}</th>
                <th className="py-3 px-4 font-semibold">{t('studentName')}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'শাখা ও শ্রেণি' : 'Division & Class'}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'অভিভাবকের তথ্য' : 'Guardian Info'}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'অবস্থা' : 'Status'}</th>
                <th className="py-3 px-4 font-semibold text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-navy-950 block">
                        {student.rollNo}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {student.admissionNo}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {student.photoUrl ? (
                          <img
                            src={student.photoUrl}
                            alt={student.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-navy-800 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                            {student.fullName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-navy-950 text-xs">
                            {student.fullName}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            DOB: {student.dateOfBirth} {student.bloodGroup ? `• ${student.bloodGroup}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-navy-900 block">
                        {student.className}
                      </span>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          student.division === 'college' ? 'bg-purple-100 text-status-violet' : 'bg-blue-100 text-royal'
                        }`}>
                          {student.division}
                        </span>
                        {(student.sscGpa !== undefined || student.previousGpa !== undefined) && (
                          <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            GPA {Number(student.sscGpa || student.previousGpa).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-700">{student.guardianName}</p>
                      <p className="text-[10px] text-slate-400">{student.guardianPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-status-green capitalize">
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 rounded text-slate-500 hover:text-royal hover:bg-blue-50 transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {students.length} student records</span>
          <span className="font-medium">Academic Year 2025</span>
        </div>
      </div>

      {/* IMPORT EXCEL / CSV MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-status-green" />
                <h3 className="text-base font-bold text-navy-950">Import Students from Excel / CSV</h3>
              </div>
              <button onClick={() => setShowImportModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {importSuccessMsg ? (
              <div className="p-6 my-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-status-green mx-auto" />
                <p className="text-sm font-bold text-status-green">{importSuccessMsg}</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4 text-xs">
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-navy-950 text-xs">Download Standard Template</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Use our pre-configured CSV/Excel format for error-free bulk upload.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadSampleTemplate}
                    className="px-3.5 py-1.5 bg-royal text-white rounded-lg font-semibold flex items-center gap-1.5 hover:bg-royal-hover shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Template</span>
                  </button>
                </div>

                {/* File Upload Zone */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Choose Excel or CSV File (.csv, .xlsx, .xls)
                  </label>
                  <input
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-royal file:text-white hover:file:bg-royal-hover cursor-pointer"
                  />
                </div>

                {/* Or Paste CSV text */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Or Paste CSV Data Directly
                  </label>
                  <textarea
                    rows={4}
                    value={pastedCsv}
                    onChange={(e) => {
                      setPastedCsv(e.target.value);
                      parseCsvText(e.target.value);
                    }}
                    placeholder="Full Name,Division,Class Name,Roll No,Guardian Name,Guardian Phone..."
                    className="w-full px-3 py-2 border rounded-xl font-mono text-[11px] focus:outline-none focus:border-royal"
                  />
                </div>

                {/* Validation Errors */}
                {importErrors.length > 0 && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-status-red text-[11px] space-y-1 max-h-24 overflow-y-auto">
                    <p className="font-bold">Validation Warnings:</p>
                    {importErrors.map((err, idx) => (
                      <p key={idx}>• {err}</p>
                    ))}
                  </div>
                )}

                {/* Preview Table */}
                {importRows.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy-950">
                        Preview ({importRows.length} valid students ready)
                      </span>
                      <span className="text-[10px] text-slate-400">Showing first 5 rows</span>
                    </div>
                    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-100 text-slate-600">
                          <tr>
                            <th className="p-2">Name</th>
                            <th className="p-2">Division</th>
                            <th className="p-2">Class</th>
                            <th className="p-2">Roll</th>
                            <th className="p-2">Guardian</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {importRows.slice(0, 5).map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 font-bold text-navy-950">{row.fullName}</td>
                              <td className="p-2 uppercase text-[10px] font-semibold">{row.division}</td>
                              <td className="p-2">{row.className}</td>
                              <td className="p-2 font-mono font-bold text-royal">{row.rollNo}</td>
                              <td className="p-2">{row.guardianName}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={importRows.length === 0}
                    onClick={handleConfirmImport}
                    className="px-5 py-2 bg-royal hover:bg-royal-hover disabled:bg-slate-300 text-white font-semibold rounded-lg shadow-sm"
                  >
                    Confirm Import ({importRows.length} Students)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW STUDENT PROFILE MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-border animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {selectedStudent.photoUrl ? (
                  <img
                    src={selectedStudent.photoUrl}
                    alt={selectedStudent.fullName}
                    className="w-14 h-16 rounded-lg object-cover border border-slate-200 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-14 h-16 rounded-lg bg-royal text-white flex items-center justify-center font-bold text-xl uppercase shrink-0">
                    {selectedStudent.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-bold text-navy-950">{selectedStudent.fullName}</h3>
                  <p className="text-xs text-slate-400">ID: {selectedStudent.admissionNo} • Roll: {selectedStudent.rollNo}</p>
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1 ${
                    selectedStudent.division === 'college' ? 'bg-purple-100 text-status-violet' : 'bg-blue-100 text-royal'
                  }`}>
                    {selectedStudent.division} division
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Class & Section</span>
                  <span className="font-bold text-navy-950">{selectedStudent.className}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Division</span>
                  <span className="font-bold text-navy-950 capitalize">{selectedStudent.division}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Guardian</span>
                  <span className="font-bold text-navy-950">{selectedStudent.guardianName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Guardian Phone</span>
                  <span className="font-bold text-navy-950">{selectedStudent.guardianPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Date of Birth</span>
                  <span className="font-bold text-navy-950">{selectedStudent.dateOfBirth}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Address</span>
                  <span className="font-bold text-navy-950">{selectedStudent.address}</span>
                </div>
                {(selectedStudent.sscGpa !== undefined || selectedStudent.previousGpa !== undefined) && (
                  <div className="col-span-2 p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-amber-900 font-bold block text-xs">
                        {selectedStudent.division === 'college' ? 'SSC Examination Official Record' : 'Previous Academic Record'}
                      </span>
                      <span className="text-slate-600 text-[11px]">
                        Education Board: <strong>{selectedStudent.previousBoard || 'Dhaka Board'}</strong> {selectedStudent.passingYear ? `• Year: ${selectedStudent.passingYear}` : ''}
                      </span>
                    </div>
                    <span className="px-3 py-1 bg-amber-500 text-white rounded-lg font-bold text-xs shadow-xs">
                      GPA {Number(selectedStudent.sscGpa || selectedStudent.previousGpa).toFixed(2)} / 5.00
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Add New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs">
              {/* Passport Photo Upload Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                <div className="w-16 h-20 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
                  {newStudent.photoUrl ? (
                    <img src={newStudent.photoUrl} alt="Passport photo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-1">
                      <Camera className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                      <span className="text-[9px] text-slate-400 block leading-tight">Passport Photo</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Upload Passport Size Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-royal hover:file:bg-blue-100 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Supported: JPG, PNG, WebP (Max 2MB)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.fullName}
                    onChange={(e) => setNewStudent({ ...newStudent, fullName: e.target.value })}
                    placeholder="e.g. Tanvir Ahmed"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Division *</label>
                  <select
                    value={newStudent.division}
                    onChange={(e) => {
                      const div = e.target.value as DivisionType;
                      const defaultClass = div === 'college' ? classes.find(c => c.division === 'college') : classes.find(c => c.division === 'school');
                      setNewStudent({
                        ...newStudent,
                        division: div,
                        classId: defaultClass?.id || 'c-9',
                        className: defaultClass?.name || 'Class 9'
                      });
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    <option value="school">School Division</option>
                    <option value="college">College Division</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class *</label>
                  <select
                    value={newStudent.classId}
                    onChange={(e) => {
                      const c = classes.find(cl => cl.id === e.target.value);
                      setNewStudent({ ...newStudent, classId: e.target.value, className: c?.name || '' });
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    {classes.filter(c => c.division === newStudent.division).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStudent.rollNo}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={newStudent.dateOfBirth}
                    onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={newStudent.guardianName}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                    placeholder="e.g. Mr. Rafiqul Islam"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Guardian Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newStudent.guardianPhone}
                    onChange={(e) => setNewStudent({ ...newStudent, guardianPhone: e.target.value })}
                    placeholder="+880 17XX XXXXXX"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Stream / Group</label>
                  <select
                    value={newStudent.stream}
                    onChange={(e) => setNewStudent({ ...newStudent, stream: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce / Business Studies</option>
                    <option value="Humanities">Humanities / Arts</option>
                  </select>
                </div>

                {/* College Division HSC SSC GPA Input */}
                {(newStudent.division === 'college' || newStudent.classId === 'c-11' || newStudent.classId === 'c-12') && (
                  <div className="sm:col-span-2 bg-gradient-to-r from-purple-50/80 to-blue-50/80 p-3 rounded-xl border border-purple-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-status-violet font-bold text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4" />
                      <span>{language === 'bn' ? 'এসএসসি ফলাফল ও বোর্ড তথ্য (আবশ্যক)' : 'SSC Examination GPA & Board (Required)'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'এসএসসি জিপিএ (৫.০০ স্কেল) *' : 'SSC GPA (Scale 5.00) *'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="1.00"
                          max="5.00"
                          required
                          value={newStudent.sscGpa}
                          onChange={(e) => setNewStudent({ ...newStudent, sscGpa: e.target.value })}
                          placeholder="e.g. 5.00"
                          className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:border-royal font-bold text-navy-950"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'শিক্ষা বোর্ড *' : 'Education Board *'}
                        </label>
                        <select
                          value={newStudent.previousBoard}
                          onChange={(e) => setNewStudent({ ...newStudent, previousBoard: e.target.value })}
                          className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:border-royal"
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
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'পাসের বছর *' : 'Passing Year *'}
                        </label>
                        <select
                          value={newStudent.passingYear}
                          onChange={(e) => setNewStudent({ ...newStudent, passingYear: e.target.value })}
                          className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:border-royal"
                        >
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* School Division SSC Level (Class 9 & 10) GPA Input */}
                {(newStudent.division === 'school' && (newStudent.classId === 'c-9' || newStudent.classId === 'c-10')) && (
                  <div className="sm:col-span-2 bg-gradient-to-r from-amber-50/80 to-blue-50/80 p-3 rounded-xl border border-amber-200/80 space-y-2">
                    <div className="flex items-center gap-2 text-navy-950 font-bold text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>{language === 'bn' ? 'এসএসসি স্তর প্রাতিষ্ঠানিক তথ্য (আবশ্যক)' : 'SSC Level Previous Academic Record (Required)'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'পূর্ববর্তী শ্রেণি / জেএসসি জিপিএ (৫.০০ স্কেল) *' : 'Previous Class / JSC GPA (Scale 5.00) *'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="1.00"
                          max="5.00"
                          required
                          value={newStudent.previousGpa}
                          onChange={(e) => setNewStudent({ ...newStudent, previousGpa: e.target.value })}
                          placeholder="e.g. 5.00 or 4.80"
                          className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:border-royal font-bold text-navy-950"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'বোর্ড / পূর্ববর্তী বিদ্যালয়' : 'Board / Previous School'}
                        </label>
                        <input
                          type="text"
                          value={newStudent.previousBoard}
                          onChange={(e) => setNewStudent({ ...newStudent, previousBoard: e.target.value })}
                          placeholder="e.g. Dhaka Board / Ideal School"
                          className="w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:border-royal"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Residential Address</label>
                <input
                  type="text"
                  value={newStudent.address}
                  onChange={(e) => setNewStudent({ ...newStudent, address: e.target.value })}
                  placeholder="Street, Sector, City"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg shadow-sm"
                >
                  Save Student Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
