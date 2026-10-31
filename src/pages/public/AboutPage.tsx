import React from 'react';
import { ShieldCheck, Target, Heart, Award, Globe, Users } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-royal bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          About Northern Star
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-navy-950">
          History, Vision & Educational Values
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
          Founded with a commitment to academic rigour and moral uprightness, Northern Star School & College stands as an emblem of modern education in Bangladesh.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-royal flex items-center justify-center mb-3">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-950">Our Vision</h3>
          <p className="text-xs text-slate-muted mt-2 leading-relaxed">
            To emerge as the premier educational institution in South Asia producing ethical, innovative, and intellectually disciplined global citizens.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-status-green flex items-center justify-center mb-3">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-950">Our Mission</h3>
          <p className="text-xs text-slate-muted mt-2 leading-relaxed">
            To deliver an inspiring curriculum blending science, arts, character development, and technological mastery supported by dedicated educators.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-status-orange flex items-center justify-center mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-navy-950">Core Values</h3>
          <p className="text-xs text-slate-muted mt-2 leading-relaxed">
            Integrity, Inclusivity, Continuous Curiosity, Compassion, and Uncompromising Dedication to Excellence.
          </p>
        </div>
      </div>
    </div>
  );
};
