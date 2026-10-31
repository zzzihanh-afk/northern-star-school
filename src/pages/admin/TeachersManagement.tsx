import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { Teacher } from '../../types';
import {
  GraduationCap,
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  Award,
  X,
  CheckCircle2,
  Camera
} from 'lucide-react';

export const TeachersManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>(dataService.getTeachers());
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const [newTeacher, setNewTeacher] = useState({
    employeeId: `NST-2025-${Math.floor(10 + Math.random() * 90)}`,
    fullName: '',
    designation: 'Senior Lecturer',
    division: 'school' as const,
    department: 'Mathematics',
    email: '',
    phone: '',
    joinDate: '2025-01-01',
    qualification: 'M.Sc. in Mathematics',
    photoUrl: '',
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
        setNewTeacher(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.fullName || !newTeacher.email) return;
    const added = dataService.addTeacher(newTeacher);
    setTeachers(dataService.getTeachers());
    setShowAddModal(false);
    setNewTeacher({
      employeeId: `NST-2025-${Math.floor(10 + Math.random() * 90)}`,
      fullName: '',
      designation: 'Senior Lecturer',
      division: 'school',
      department: 'Mathematics',
      email: '',
      phone: '',
      joinDate: '2025-01-01',
      qualification: 'M.Sc. in Mathematics',
      photoUrl: '',
    });
  };

  const filtered = teachers.filter(t =>
    t.fullName.toLowerCase().includes(search.toLowerCase()) ||
    t.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            {language === 'bn' ? 'শিক্ষকমণ্ডলী তালিকা' : `${t('nav_teachers')} Directory`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn' 
              ? 'অনুষদ সদস্য, বিষয় বণ্টন ও শিক্ষক প্রোফাইল ব্যবস্থাপনা।' 
              : 'Manage academic faculty, subject assignments, and professional profiles.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold bg-royal hover:bg-royal-hover text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addTeacher')}</span>
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by teacher name or department..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal"
          />
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total Faculty: {toLocaleNumber(teachers.length, language)}
        </span>
      </div>

      {/* TEACHERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <div key={t.id} className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                {t.photoUrl ? (
                  <img
                    src={t.photoUrl}
                    alt={t.fullName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-white font-bold flex items-center justify-center text-sm uppercase shrink-0">
                    {t.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-bold text-navy-950">{t.fullName}</h4>
                  <p className="text-xs text-royal font-semibold">{t.designation}</p>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {t.employeeId}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Dept: <strong className="text-navy-950">{t.department}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{t.qualification}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{t.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{t.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded font-bold uppercase bg-blue-50 text-royal">
                {t.division}
              </span>
              <span className="text-slate-400">Joined: {t.joinDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD TEACHER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Add New Teacher</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5 text-xs">
              {/* Photo Upload Box */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3">
                <div className="w-14 h-16 rounded-lg border-2 border-dashed border-slate-300 bg-white flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
                  {newTeacher.photoUrl ? (
                    <img src={newTeacher.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-1">
                      <Camera className="w-4 h-4 text-slate-400 mx-auto mb-0.5" />
                      <span className="text-[8px] text-slate-400 block leading-tight">Passport Photo</span>
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
                  <p className="text-[10px] text-slate-400 mt-0.5">JPG, PNG (Max 2MB)</p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newTeacher.fullName}
                  onChange={(e) => setNewTeacher({ ...newTeacher, fullName: e.target.value })}
                  placeholder="e.g. Dr. Kamrul Hasan"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={newTeacher.department}
                    onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                    placeholder="e.g. Physics"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    value={newTeacher.designation}
                    onChange={(e) => setNewTeacher({ ...newTeacher, designation: e.target.value })}
                    placeholder="e.g. Senior Lecturer"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newTeacher.email}
                    onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                    placeholder="teacher@northernstar.edu.bd"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newTeacher.phone}
                    onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                    placeholder="+880 17XX XXXXXX"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Educational Qualification</label>
                <input
                  type="text"
                  value={newTeacher.qualification}
                  onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
                  placeholder="e.g. B.Sc. (Hons), M.Sc. in Physics (DU)"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg"
                >
                  Save Faculty Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
