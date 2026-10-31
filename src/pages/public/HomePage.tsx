import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  School,
  ArrowRight,
  ShieldCheck,
  Send,
  Building,
  Microscope,
  Cpu,
  Globe
} from 'lucide-react';
import { Logo, LogoEmblem } from '../../components/brand/Logo';

export const HomePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const notices = dataService.getNotices('all').slice(0, 3);
  const events = dataService.getEvents().slice(0, 3);

  // Admissions Enquiry State
  const [enquiry, setEnquiry] = useState({
    applicantName: '',
    guardianName: '',
    phone: '',
    email: '',
    division: 'school' as 'school' | 'college',
    desiredClass: 'Class 9',
    desiredStream: 'Science',
    sscGpa: '',
    previousGpa: '',
    board: 'Dhaka',
    passingYear: '2024',
    previousSchool: '',
    message: '',
    photoUrl: '' as string,
  });

  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (window.location.pathname === '/admissions' || window.location.hash === '#enquiry-section') {
      const el = document.getElementById('enquiry-section');
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a passport-size photo under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEnquiry(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDivisionChange = (newDivision: 'school' | 'college') => {
    setEnquiry(prev => ({
      ...prev,
      division: newDivision,
      desiredClass: newDivision === 'college' ? 'Class 11 (HSC 1st Year)' : 'Class 9',
    }));
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiry.applicantName || !enquiry.guardianName || !enquiry.phone) {
      alert(language === 'bn' ? 'অনুগ্রহ করে আবেদনকারীর নাম, অভিভাবকের নাম এবং মোবাইল নম্বর পূরণ করুন।' : 'Please fill in applicant name, guardian name, and contact phone.');
      return;
    }

    const isCollege = enquiry.division === 'college' || enquiry.desiredClass.includes('11') || enquiry.desiredClass.includes('12');
    const isSsc = enquiry.desiredClass.includes('9') || enquiry.desiredClass.includes('10');

    if (isCollege) {
      const gpa = parseFloat(enquiry.sscGpa);
      if (!enquiry.sscGpa || isNaN(gpa) || gpa < 1.0 || gpa > 5.0) {
        alert(language === 'bn' ? 'কলেজ/এইচএসসি ভর্তির জন্য এস.এস.সি জিপিএ (১.০০ - ৫.০০ স্কেলে) আবশ্যক।' : 'For College (HSC) admission, a valid SSC GPA between 1.00 and 5.00 is required.');
        return;
      }
    }

    if (isSsc) {
      const gpa = parseFloat(enquiry.previousGpa);
      if (!enquiry.previousGpa || isNaN(gpa) || gpa < 1.0 || gpa > 5.0) {
        alert(language === 'bn' ? 'এস.এস.সি লেভেল (৯ম-১০ম শ্রেণি) ভর্তির জন্য পূর্ববর্তী শ্রেণি/জেএসসি জিপিএ আবশ্যক।' : 'For SSC level admission (Class 9-10), a valid Previous Class / JSC GPA (1.00 - 5.00) is required.');
        return;
      }
    }

    dataService.submitEnquiry({
      applicantName: enquiry.applicantName,
      guardianName: enquiry.guardianName,
      phone: enquiry.phone,
      email: enquiry.email || undefined,
      division: enquiry.division,
      desiredClass: enquiry.desiredClass,
      desiredStream: enquiry.desiredStream,
      sscGpa: enquiry.sscGpa ? parseFloat(enquiry.sscGpa) : undefined,
      previousGpa: enquiry.previousGpa ? parseFloat(enquiry.previousGpa) : undefined,
      board: enquiry.board || undefined,
      passingYear: enquiry.passingYear || undefined,
      previousSchool: enquiry.previousSchool || undefined,
      message: enquiry.message || undefined,
      photoUrl: enquiry.photoUrl || undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEnquiry({
        applicantName: '',
        guardianName: '',
        phone: '',
        email: '',
        division: 'school',
        desiredClass: 'Class 9',
        desiredStream: 'Science',
        sscGpa: '',
        previousGpa: '',
        board: 'Dhaka',
        passingYear: '2024',
        previousSchool: '',
        message: '',
        photoUrl: '',
      });
    }, 4000);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-950 text-white pt-12 pb-24 sm:pt-20 sm:pb-32 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-gold text-xs font-semibold backdrop-blur-md border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Admissions Open for Session 2025–2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-wide leading-tight">
              Shaping Tomorrow's <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-gold">
                Leaders & Scholars
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Northern Star School & College provides a world-class academic environment blending rigorous national curricula with modern science, technology, ethics, and character development.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <a
                href="#enquiry-section"
                className="w-full sm:w-auto px-6 py-3.5 bg-royal hover:bg-royal-hover text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Apply for Admission</span>
                <ChevronRight className="w-4 h-4" />
              </a>
              <Link
                to="/login"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 backdrop-blur-sm transition-all"
              >
                <span>Portal Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Badges */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-black font-serif text-gold">100%</p>
                <p className="text-[11px] text-slate-300">Board Pass Rate</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black font-serif text-white">1,248+</p>
                <p className="text-[11px] text-slate-300">Active Students</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black font-serif text-white">86+</p>
                <p className="text-[11px] text-slate-300">Expert Educators</p>
              </div>
            </div>
          </div>

          {/* Right Visual Card Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl text-center flex flex-col items-center">
              <LogoEmblem sizeClass="w-24 h-24 sm:w-28 sm:h-28" idSuffix="hero-public" />
              <div className="mt-6">
                <h3 className="font-serif font-black tracking-wider text-2xl text-white">
                  NORTHERN STAR
                </h3>
                <h4 className="text-xs tracking-[0.25em] font-semibold text-gold uppercase mt-1">
                  School & College
                </h4>
                <p className="text-xs italic text-blue-200 mt-2">
                  Learn • Grow • Achieve
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-white/15 w-full grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                  <span className="text-[10px] uppercase font-bold text-blue-300 block">School</span>
                  <span className="font-semibold text-white">Class 1 to 10</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left">
                  <span className="text-[10px] uppercase font-bold text-gold block">College</span>
                  <span className="font-semibold text-white">HSC (Class 11 & 12)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Curved bottom background separator */}
        <div className="absolute -bottom-1 left-0 right-0 h-10 bg-canvas [clip-path:polygon(0_100%,100%_100%,100%_0)]" />
      </section>

      {/* 2. DUAL DIVISION HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-royal uppercase tracking-wider block mb-1">
            Integrated Academic Structure
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-navy-950">
            Nurturing Excellence from Primary to College
          </h2>
          <p className="text-xs sm:text-sm text-slate-muted mt-2">
            Structured learning environments customized to each developmental stage under one accredited institution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* School Division Card */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-slate-border shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-royal flex items-center justify-center mb-4">
              <School className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-royal uppercase tracking-wider block">Foundational & Secondary</span>
            <h3 className="text-xl font-bold text-navy-950 mt-1">School Division (Class 1 – 10)</h3>
            <p className="text-xs sm:text-sm text-slate-muted mt-2 leading-relaxed">
              Focuses on literacy, mathematical mastery, exploratory science, English proficiency, and national values preparing students for the SSC examinations.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-green shrink-0" />
                <span>Modern interactive classrooms and English language clubs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-green shrink-0" />
                <span>Science stream, Business Studies & Humanities streams in Class 9-10</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-green shrink-0" />
                <span>Dedicated co-curricular activities, debating, and athletics</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link to="/school-division" className="text-xs font-bold text-royal hover:underline inline-flex items-center gap-1">
                <span>Explore School Programs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* College Division Card */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-slate-border shadow-card hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-status-violet flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-status-violet uppercase tracking-wider block">Higher Secondary</span>
            <h3 className="text-xl font-bold text-navy-950 mt-1">College Division (HSC Class 11 & 12)</h3>
            <p className="text-xs sm:text-sm text-slate-muted mt-2 leading-relaxed">
              Advanced college-level instruction designed for university admission success (BUET, Medical, Dhaka University, and leading global universities).
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-green shrink-0" />
                <span>Specialized faculty with doctorates and master's degrees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-green shrink-0" />
                <span>Fully equipped Physics, Chemistry, Biology & ICT research labs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-status-green shrink-0" />
                <span>Comprehensive admission coaching alongside HSC syllabus</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link to="/college-division" className="text-xs font-bold text-royal hover:underline inline-flex items-center gap-1">
                <span>Explore College Programs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRINCIPAL'S MESSAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-slate-border shadow-card grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-navy-900 text-white font-bold text-3xl flex items-center justify-center shadow-lg border-4 border-white mb-3">
              P
            </div>
            <h4 className="text-base font-bold text-navy-950">Prof. A. K. Azad</h4>
            <p className="text-xs text-royal font-semibold">Principal & Academic Head</p>
            <p className="text-[11px] text-slate-400">Former Faculty, University of Dhaka</p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <span className="text-xs font-bold text-gold uppercase tracking-widest font-serif block">
              Leadership & Vision
            </span>
            <h3 className="text-2xl font-serif font-black text-navy-950">
              "Fostering Wisdom, Character, and Innovation"
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "At Northern Star School & College, we recognize that true education goes beyond textbooks and examinations. Our mission is to ignite curiosity, instill unwavering integrity, and provide our students with the technological fluency and intellectual discipline required to thrive in a rapidly advancing global society. We welcome parents and students to join our vibrant academic community."
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-navy-900">
              <span>Dhaka, Bangladesh</span>
              <span>•</span>
              <span className="text-slate-500">Academic Year 2025–2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NOTICES & UPCOMING EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Public Notices */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-slate-border shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-navy-950">Institutional Notices</h3>
                  <p className="text-xs text-slate-400">Official circulars and announcements</p>
                </div>
                <Link to="/notices" className="text-xs font-semibold text-royal hover:underline">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {notices.map((n) => (
                  <div key={n.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-royal/30 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-status-green bg-emerald-50 px-2 py-0.5 rounded">
                        Published
                      </span>
                      <span className="text-[10px] text-slate-400">{n.publishDate}</span>
                    </div>
                    <h5 className="text-xs font-bold text-navy-950">{n.title}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-surface rounded-2xl p-6 sm:p-8 border border-slate-border shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-navy-950">Events & Academic Calendar</h3>
                  <p className="text-xs text-slate-400">Upcoming seminars, meets, and activities</p>
                </div>
                <Link to="/events" className="text-xs font-semibold text-royal hover:underline">
                  Full Calendar
                </Link>
              </div>

              <div className="space-y-4">
                {events.map((ev) => (
                  <div key={ev.id} className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-royal flex flex-col items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 mb-0.5" />
                      <span className="text-[9px] font-bold">{ev.startDate.split(' ')[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-navy-950">{ev.title}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ev.description}</p>
                      <span className="text-[10px] text-royal font-medium mt-1 block">Venue: {ev.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ONLINE ADMISSIONS ENQUIRY FORM */}
      <section id="enquiry-section" className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-slate-border shadow-card">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-royal uppercase tracking-wider block mb-1">
              Apply Online
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-navy-950">
              Online Admission Enquiry
            </h2>
            <p className="text-xs sm:text-sm text-slate-muted mt-2">
              Submit your preliminary admission application. Our admissions office will contact you with admission test schedules and instructions.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-status-green text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-status-green">
                Enquiry Submitted Successfully!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for applying to Northern Star School & College. Your enquiry has been received and routed to our admissions desk.
              </p>
            </div>
          ) : (
            <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Applicant Full Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiry.applicantName}
                    onChange={(e) => setEnquiry({ ...enquiry, applicantName: e.target.value })}
                    placeholder="Student full name"
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Guardian / Father Name *</label>
                  <input
                    type="text"
                    required
                    value={enquiry.guardianName}
                    onChange={(e) => setEnquiry({ ...enquiry, guardianName: e.target.value })}
                    placeholder="Guardian full name"
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Primary Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={enquiry.phone}
                    onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })}
                    placeholder="+880 17XX XXXXXX"
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={enquiry.email}
                    onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                    placeholder="contact@example.com"
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Desired Division *</label>
                  <select
                    value={enquiry.division}
                    onChange={(e) => handleDivisionChange(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-royal bg-white"
                  >
                    <option value="school">School Division (Class 1 - 10)</option>
                    <option value="college">College Division (HSC Class 11 - 12)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Desired Class *</label>
                  <select
                    value={enquiry.desiredClass}
                    onChange={(e) => setEnquiry({ ...enquiry, desiredClass: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-royal bg-white"
                  >
                    {enquiry.division === 'school' ? (
                      <>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                      </>
                    ) : (
                      <>
                        <option value="Class 11 (HSC 1st Year)">Class 11 (HSC 1st Year)</option>
                        <option value="Class 12 (HSC 2nd Year)">Class 12 (HSC 2nd Year)</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Stream / Group selection for Class 9, 10, 11, 12 */}
                {(enquiry.desiredClass.includes('9') || enquiry.desiredClass.includes('10') || enquiry.desiredClass.includes('11') || enquiry.desiredClass.includes('12')) && (
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Academic Stream / Group *</label>
                    <select
                      value={enquiry.desiredStream}
                      onChange={(e) => setEnquiry({ ...enquiry, desiredStream: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-royal bg-white font-medium text-navy-950"
                    >
                      <option value="Science">Science Group</option>
                      <option value="Business Studies">Business Studies (Commerce)</option>
                      <option value="Humanities">Humanities (Arts)</option>
                    </select>
                  </div>
                )}

                {/* College (HSC) Level SSC GPA Credentials */}
                {(enquiry.division === 'college' || enquiry.desiredClass.includes('11') || enquiry.desiredClass.includes('12')) && (
                  <div className="sm:col-span-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-4 rounded-xl border border-blue-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-royal font-bold text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4" />
                      <span>{language === 'bn' ? 'এসএসসি পরীক্ষার ফলাফল ও বোর্ড তথ্য (আবশ্যক)' : 'SSC Examination Credentials & Board (Required)'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'এস.এস.সি জিপিএ (স্কেল ৫.০০) *' : 'SSC GPA (Scale 5.00) *'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="1.00"
                          max="5.00"
                          required
                          value={enquiry.sscGpa}
                          onChange={(e) => setEnquiry({ ...enquiry, sscGpa: e.target.value })}
                          placeholder="e.g. 5.00"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-royal font-bold text-navy-950"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'শিক্ষা বোর্ড *' : 'Education Board *'}
                        </label>
                        <select
                          value={enquiry.board}
                          onChange={(e) => setEnquiry({ ...enquiry, board: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-royal"
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
                          {language === 'bn' ? 'পাসের সন *' : 'Passing Year *'}
                        </label>
                        <select
                          value={enquiry.passingYear}
                          onChange={(e) => setEnquiry({ ...enquiry, passingYear: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-royal"
                        >
                          <option value="2025">2025</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* School (SSC) Level Previous / JSC GPA */}
                {(enquiry.division === 'school' && (enquiry.desiredClass.includes('9') || enquiry.desiredClass.includes('10'))) && (
                  <div className="sm:col-span-2 bg-gradient-to-r from-blue-50/80 to-amber-50/80 p-4 rounded-xl border border-amber-200/80 space-y-3">
                    <div className="flex items-center gap-2 text-navy-950 font-bold text-xs uppercase tracking-wider">
                      <Award className="w-4 h-4 text-amber-600" />
                      <span>{language === 'bn' ? 'এস.এস.সি লেভেল একাডেমিক তথ্য (৯ম-১০ম শ্রেণি)' : 'SSC Level Academic Record (Class 9 - 10)'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'পূর্ববর্তী শ্রেণি / জেএসসি জিপিএ (স্কেল ৫.০০) *' : 'Previous Class / JSC GPA (Scale 5.00) *'}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="1.00"
                          max="5.00"
                          required
                          value={enquiry.previousGpa}
                          onChange={(e) => setEnquiry({ ...enquiry, previousGpa: e.target.value })}
                          placeholder="e.g. 5.00 or 4.80"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-royal font-bold text-navy-950"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {language === 'bn' ? 'পূর্ববর্তী বিদ্যালয় / বোর্ড' : 'Previous School / Board'}
                        </label>
                        <input
                          type="text"
                          value={enquiry.previousSchool}
                          onChange={(e) => setEnquiry({ ...enquiry, previousSchool: e.target.value })}
                          placeholder="e.g. Dhaka Board / Ideal School"
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-royal"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Passport Size Photo Upload */}
                <div className={(enquiry.desiredClass.includes('9') || enquiry.desiredClass.includes('10') || enquiry.desiredClass.includes('11') || enquiry.desiredClass.includes('12')) ? '' : 'sm:col-span-2'}>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Student Passport Size Photo <span className="text-slate-400 font-normal">(Optional, max 2MB)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                      {enquiry.photoUrl ? (
                        <img src={enquiry.photoUrl} alt="Passport preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-center text-slate-400 leading-tight">Passport Photo</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-royal hover:file:bg-blue-100 cursor-pointer"
                      />
                      {enquiry.photoUrl && (
                        <button
                          type="button"
                          onClick={() => setEnquiry({ ...enquiry, photoUrl: '' })}
                          className="text-[11px] text-status-red hover:underline block mt-1"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Additional Information / Previous School</label>
                <textarea
                  rows={3}
                  value={enquiry.message}
                  onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                  placeholder="Mention previous institution or special interests..."
                  className="w-full px-3.5 py-2.5 border rounded-xl focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-royal hover:bg-royal-hover text-white rounded-xl font-bold shadow-md transition-all inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Admission Enquiry</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
