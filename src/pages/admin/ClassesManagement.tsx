import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { Layers, Plus, BookOpen, Users, CheckCircle, X, Shield } from 'lucide-react';
import { Section, Subject } from '../../types';

export const ClassesManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const classes = dataService.getClasses();
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'c-9');
  const [activeStreamFilter, setActiveStreamFilter] = useState<string>('all');

  // Modals state
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);

  // New section form
  const [newSection, setNewSection] = useState({
    name: '',
    capacity: 45,
  });

  // New subject form
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    fullMarks: 100,
    passMarks: 33,
    isOptional: false,
  });

  const selectedClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const [sections, setSections] = useState<Section[]>(dataService.getSections(selectedClassId));
  const [subjects, setSubjects] = useState<Subject[]>(dataService.getSubjects(selectedClassId));

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setSections(dataService.getSections(classId));
    setSubjects(dataService.getSubjects(classId));
    setActiveStreamFilter('all');
  };

  const handleAddSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.name) return;
    const added = dataService.addSection({
      classId: selectedClassId,
      name: newSection.name,
      capacity: Number(newSection.capacity) || 40,
    });
    setSections(dataService.getSections(selectedClassId));
    setShowAddSectionModal(false);
    setNewSection({ name: '', capacity: 45 });
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.code) return;
    const added = dataService.addSubject({
      classId: selectedClassId,
      division: selectedClass.division,
      code: newSubject.code,
      name: newSubject.name,
      fullMarks: Number(newSubject.fullMarks) || 100,
      passMarks: Number(newSubject.passMarks) || 33,
      isOptional: newSubject.isOptional,
    });
    setSubjects(dataService.getSubjects(selectedClassId));
    setShowAddSubjectModal(false);
    setNewSubject({ code: '', name: '', fullMarks: 100, passMarks: 33, isOptional: false });
  };

  // Filter subjects by stream keyword if applicable
  const filteredSubjects = subjects.filter(s => {
    if (activeStreamFilter === 'all') return true;
    const q = activeStreamFilter.toLowerCase();
    if (q === 'science') {
      return s.name.toLowerCase().includes('physics') ||
             s.name.toLowerCase().includes('chemistry') ||
             s.name.toLowerCase().includes('bio') ||
             s.name.toLowerCase().includes('math') ||
             s.name.toLowerCase().includes('bangla') ||
             s.name.toLowerCase().includes('english') ||
             s.name.toLowerCase().includes('ict');
    }
    if (q === 'commerce') {
      return s.name.toLowerCase().includes('accounting') ||
             s.name.toLowerCase().includes('business') ||
             s.name.toLowerCase().includes('finance') ||
             s.name.toLowerCase().includes('bangla') ||
             s.name.toLowerCase().includes('english') ||
             s.name.toLowerCase().includes('ict');
    }
    if (q === 'humanities') {
      return s.name.toLowerCase().includes('civics') ||
             s.name.toLowerCase().includes('econ') ||
             s.name.toLowerCase().includes('social') ||
             s.name.toLowerCase().includes('history') ||
             s.name.toLowerCase().includes('bangla') ||
             s.name.toLowerCase().includes('english') ||
             s.name.toLowerCase().includes('ict');
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            {language === 'bn' ? 'শ্রেণি, শাখা ও একাডেমিক কাঠামো' : `${t('nav_classesSections')} & Academic Structure`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn' ? 'স্কুল ও কলেজ শাখা, শ্রেণি, সেকশন এবং পাঠ্যসূচির বিষয়সমূহ পরিচালনা করুন।' : 'Configure School and College divisions, class grades, sections, and subject syllabi.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddSectionModal(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-royal" />
            <span>{language === 'bn' ? 'নতুন শাখা যোগ' : 'Add Section'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAddSubjectModal(true)}
            className="px-3.5 py-1.5 text-xs font-semibold bg-royal text-white hover:bg-royal-hover rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন বিষয় যোগ' : 'Add Subject'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Classes List (col-span-4) */}
        <div className="lg:col-span-4 bg-surface rounded-2xl p-5 border border-slate-border shadow-card space-y-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
            <h3 className="text-sm font-bold text-navy-950">Academic Classes</h3>
            <span className="text-[10px] font-bold text-royal bg-blue-50 px-2 py-0.5 rounded">
              {classes.length} Total
            </span>
          </div>

          {classes.map(c => {
            const isSelected = c.id === selectedClassId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectClass(c.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-royal text-white border-royal shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold leading-tight">{c.name}</h4>
                  <span className={`text-[10px] uppercase font-semibold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {c.division} Division
                  </span>
                </div>
                {c.streams && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {c.streams.length} Streams
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column: Class Details, Sections, and Subjects (col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Class Header Card */}
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card flex items-center justify-between">
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider ${
                selectedClass.division === 'college' ? 'text-status-violet' : 'text-royal'
              }`}>
                {selectedClass.division} Division
              </span>
              <h2 className="text-xl font-bold text-navy-950 mt-1">
                {selectedClass.name}
              </h2>
              {selectedClass.streams && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-xs text-slate-400">Available Streams:</span>
                  {selectedClass.streams.map(st => (
                    <span key={st} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-royal border border-blue-200">
                      {st}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Class Level</span>
              <span className="text-2xl font-bold text-navy-950">Level {selectedClass.level}</span>
            </div>
          </div>

          {/* Sections List */}
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-navy-950">Sections & Capacities ({sections.length})</h3>
              <button
                type="button"
                onClick={() => setShowAddSectionModal(true)}
                className="text-xs font-semibold text-royal hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sections.length === 0 ? (
                <div className="col-span-3 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-400">
                  No sections configured yet. Click "Add Section" above to create one.
                </div>
              ) : (
                sections.map(sec => (
                  <div key={sec.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <h5 className="text-xs font-bold text-navy-950">Section: {sec.name}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">Capacity: {sec.capacity} students</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Subjects Table */}
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="text-sm font-bold text-navy-950">Enrolled Subjects & Full Marks ({filteredSubjects.length})</h3>
                <p className="text-xs text-slate-400">Curriculum grading standards & pass thresholds</p>
              </div>

              {/* Stream filter tabs if multi-stream class */}
              {selectedClass.streams && (
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                  <button
                    onClick={() => setActiveStreamFilter('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeStreamFilter === 'all' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveStreamFilter('science')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeStreamFilter === 'science' ? 'bg-royal text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Science
                  </button>
                  <button
                    onClick={() => setActiveStreamFilter('commerce')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeStreamFilter === 'commerce' ? 'bg-status-green text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Commerce
                  </button>
                  <button
                    onClick={() => setActiveStreamFilter('humanities')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      activeStreamFilter === 'humanities' ? 'bg-status-violet text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Humanities
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Subject Code</th>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3 text-center">Full Marks</th>
                    <th className="py-2.5 px-3 text-center">Pass Marks</th>
                    <th className="py-2.5 px-3 text-right">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No subjects match the selected filter. Click "Add Subject" to configure one.
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map(sub => (
                      <tr key={sub.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 font-mono font-bold text-royal">{sub.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-navy-950">{sub.name}</td>
                        <td className="py-2.5 px-3 text-center">{sub.fullMarks}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-status-green">{sub.passMarks}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sub.isOptional ? 'bg-amber-100 text-status-orange' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {sub.isOptional ? 'Optional 4th' : 'Compulsory'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ADD SECTION MODAL */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Add Section to {selectedClass.name}</h3>
              <button onClick={() => setShowAddSectionModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSectionSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Section Name *</label>
                <input
                  type="text"
                  required
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  placeholder="e.g. Science Section 3 or Section C"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Max Student Capacity *</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  required
                  value={newSection.capacity}
                  onChange={(e) => setNewSection({ ...newSection, capacity: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SUBJECT MODAL */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950">Add Subject to {selectedClass.name}</h3>
              <button onClick={() => setShowAddSubjectModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubjectSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="e.g. Statistics 1st Paper"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  placeholder="e.g. STAT-129"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Marks</label>
                  <input
                    type="number"
                    required
                    value={newSubject.fullMarks}
                    onChange={(e) => setNewSubject({ ...newSubject, fullMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pass Marks</label>
                  <input
                    type="number"
                    required
                    value={newSubject.passMarks}
                    onChange={(e) => setNewSubject({ ...newSubject, passMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="optCheck"
                  checked={newSubject.isOptional}
                  onChange={(e) => setNewSubject({ ...newSubject, isOptional: e.target.checked })}
                  className="rounded text-royal"
                />
                <label htmlFor="optCheck" className="text-slate-700 font-medium">
                  This is an optional / 4th subject
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-semibold rounded-lg"
                >
                  Add Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
