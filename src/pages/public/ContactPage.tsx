import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-royal bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-navy-950">
          Contact Northern Star School & College
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted leading-relaxed">
          We welcome prospective parents, students, and visitors. Reach out to our campus office.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-royal flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-950">Campus Location</h4>
              <p className="text-xs text-slate-muted mt-1 leading-relaxed">
                Plot 12, Road 4, Sector 7, Uttara Model Town, Dhaka-1230, Bangladesh.
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-status-green flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-950">Phone Numbers</h4>
              <p className="text-xs text-slate-muted mt-1">
                Admission Desk: +880 1711 000000<br />
                Reception: +880 2 8991234
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-status-violet flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-950">Email Communication</h4>
              <p className="text-xs text-slate-muted mt-1">
                info@northernstar.edu.bd<br />
                admissions@northernstar.edu.bd
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-status-orange flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-navy-950">Visiting Hours</h4>
              <p className="text-xs text-slate-muted mt-1">
                Sunday to Thursday: 08:00 AM – 03:30 PM<br />
                Saturday: 09:00 AM – 01:00 PM (Admission office only)
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-6 sm:p-8 border border-slate-border shadow-card">
          <h3 className="text-lg font-bold text-navy-950 mb-4">Send Us a Direct Message</h3>

          {sent ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-status-green mx-auto" />
              <p className="text-xs font-bold text-status-green">Message Delivered!</p>
              <p className="text-[11px] text-slate-600">Our administrative desk will reply within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Your Full Name *</label>
                  <input type="text" required placeholder="Name" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal" />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input type="tel" required placeholder="+880 17XX XXXXXX" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input type="email" placeholder="email@example.com" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal" />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subject / Query Topic</label>
                <input type="text" placeholder="e.g. Admission for Class 9 Science" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal" />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Message *</label>
                <textarea rows={4} required placeholder="Write your message..." className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal" />
              </div>

              <button type="submit" className="px-6 py-2.5 bg-royal hover:bg-royal-hover text-white rounded-lg font-bold flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
