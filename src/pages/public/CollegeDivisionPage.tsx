import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Microscope, Briefcase, BookOpen, CheckCircle2 } from 'lucide-react';

export const CollegeDivisionPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-status-violet bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Higher Secondary Education (HSC)
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-navy-950">
          College Division (Class 11 & 12)
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
          Preparing students for the Higher Secondary Certificate (HSC) examination and entrance to top engineering, medical, and general universities.
        </p>
      </div>

      {/* College Streams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Science */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-royal flex items-center justify-center mb-3">
              <Microscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Science Stream</h3>
            <p className="text-xs text-slate-muted mt-2 leading-relaxed">
              Physics, Chemistry, Higher Mathematics, and Biology with high-frequency laboratory practicals and engineering/medical prep.
            </p>
          </div>
          <span className="mt-4 text-[11px] font-semibold text-royal">Seats: 180 • Minimum GPA: 4.80</span>
        </div>

        {/* Commerce */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-status-green flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Business Studies</h3>
            <p className="text-xs text-slate-muted mt-2 leading-relaxed">
              Accounting, Finance & Banking, Business Organization, and Economics targeting BBA and corporate leadership.
            </p>
          </div>
          <span className="mt-4 text-[11px] font-semibold text-status-green">Seats: 150 • Minimum GPA: 4.00</span>
        </div>

        {/* Humanities */}
        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-status-violet flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-navy-950">Humanities</h3>
            <p className="text-xs text-slate-muted mt-2 leading-relaxed">
              Political Science, Economics, History, and Social Work targeting Law, Civil Services, and Social Sciences.
            </p>
          </div>
          <span className="mt-4 text-[11px] font-semibold text-status-violet">Seats: 120 • Minimum GPA: 3.50</span>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-status-violet rounded-2xl p-8 text-white text-center flex flex-col items-center">
        <h3 className="text-xl sm:text-2xl font-serif font-bold">HSC College Admission Notice</h3>
        <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-xl">
          Online admission confirmation via the Ministry of Education XI Class Admission portal and direct counseling at campus.
        </p>
        <Link to="/#enquiry-section" className="mt-6 px-6 py-3 bg-gold hover:bg-gold-hover text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all">
          Enquire for College Admission
        </Link>
      </div>
    </div>
  );
};
