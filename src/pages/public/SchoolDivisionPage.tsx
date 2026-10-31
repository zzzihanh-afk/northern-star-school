import React from 'react';
import { Link } from 'react-router-dom';
import { School, CheckCircle2, BookOpen, Award, Users, ChevronRight } from 'lucide-react';

export const SchoolDivisionPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-royal bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Secondary & Foundational Education
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-navy-950">
          School Division (Class 1 to 10)
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
          Developing intellectual curiosity, sound moral foundations, and high academic standards in accordance with the national curriculum.
        </p>
      </div>

      {/* Curriculum Levels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
          <h3 className="text-base font-bold text-navy-950">Primary Stage (Class 1 - 5)</h3>
          <p className="text-xs text-slate-muted mt-2 leading-relaxed">
            Foundational literacy, phonetics, mental arithmetic, moral science, and exploratory arts fostering joyful learning.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
          <h3 className="text-base font-bold text-navy-950">Junior Stage (Class 6 - 8)</h3>
          <p className="text-xs text-slate-muted mt-2 leading-relaxed">
            Introduction to analytical sciences, English literature, computational thinking, and social geography.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
          <h3 className="text-base font-bold text-navy-950">Secondary Stage (Class 9 - 10)</h3>
          <p className="text-xs text-slate-muted mt-2 leading-relaxed">
            Rigorous SSC board examination preparation with specialized streams: Science, Business Studies, and Humanities.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-navy-900 to-royal rounded-2xl p-8 text-white text-center flex flex-col items-center">
        <h3 className="text-xl sm:text-2xl font-serif font-bold">Apply for School Admission Today</h3>
        <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-xl">
          Join Northern Star School & College for the upcoming academic year.
        </p>
        <Link to="/#enquiry-section" className="mt-6 px-6 py-3 bg-gold hover:bg-gold-hover text-navy-950 font-bold text-xs rounded-xl shadow-md transition-all">
          Submit School Admission Form
        </Link>
      </div>
    </div>
  );
};
