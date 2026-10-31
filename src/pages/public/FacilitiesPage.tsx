import React from 'react';
import { Microscope, BookOpen, Monitor, Award, Activity, HeartPulse } from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const facilities = [
    { title: 'STEM & Robotics Labs', desc: 'State-of-the-art laboratory for experiments in IoT, robotics, and physics.', icon: Microscope },
    { title: 'Central Knowledge Library', desc: 'Over 15,000 reference books, journals, and a high-speed digital research terminal.', icon: BookOpen },
    { title: 'Advanced Computer & ICT Labs', desc: 'Equipped with modern high-performance workstations for coding and multimedia.', icon: Monitor },
    { title: 'Sports Arena & Indoor Gymnasium', desc: 'Football field, basketball court, badminton courts, and table tennis facilities.', icon: Activity },
    { title: 'Auditorium & Cultural Hall', desc: '750-seat fully air-conditioned auditorium for seminars, debates, and drama.', icon: Award },
    { title: 'Campus Medical & First Aid Unit', desc: 'Full-time registered nurse and doctor on call with emergency medical supplies.', icon: HeartPulse },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-royal bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          World-Class Infrastructure
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-navy-950">
          Campus Facilities & Learning Spaces
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
          Designed to encourage academic immersion, athletic prowess, and holistic student well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card hover:shadow-card-hover transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-royal flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-navy-950">{f.title}</h3>
              <p className="text-xs text-slate-muted mt-2 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
