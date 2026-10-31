import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/brand/Logo';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  LogIn,
  GraduationCap,
  ChevronRight,
  School,
  Clock
} from 'lucide-react';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: t('home'), path: '/' },
    { label: t('aboutUs'), path: '/about' },
    { label: t('schoolDivision'), path: '/school-division' },
    { label: t('collegeDivision'), path: '/college-division' },
    { label: t('admissions'), path: '/admissions' },
    { label: t('facilities'), path: '/facilities' },
    { label: t('newsNotices'), path: '/notices' },
    { label: t('contactUs'), path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-slate-dark">
      {/* TOP INSTITUTIONAL STRIP */}
      <div className="bg-navy-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              <span>Plot 12, Sector 7, Uttara, Dhaka-1230, Bangladesh</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold" />
              <span>+880 2 8991234 • +880 1711 000000</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden lg:inline">
              EIIN: 138240 • Institution Code: 2045
            </span>
            <LanguageSwitcher variant="compact" />
          </div>
        </div>
      </div>

      {/* STICKY MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="shrink-0">
            <Logo variant="horizontal" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-colors duration-150 hover:text-royal py-1 ${
                    isActive ? 'text-royal border-b-2 border-royal font-bold' : 'text-navy-900'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action CTAs: Portal Login */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/admissions"
              className="px-4 py-2 text-xs font-bold text-navy-900 hover:text-royal transition-colors"
            >
              Apply Now
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-semibold bg-royal hover:bg-royal-hover text-white rounded-lg flex items-center gap-2 shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('portalLogin')}</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-navy-900 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-border px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-navy-900 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/admissions"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-bold text-royal bg-blue-50 rounded-lg"
              >
                Apply for Admission
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold bg-royal text-white rounded-lg flex items-center justify-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Portal Login</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* PAGE BODY */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-navy-950 text-white pt-16 pb-8 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Col 1: About & Logo */}
          <div className="space-y-4">
            <Logo variant="horizontal" lightText />
            <p className="text-xs text-slate-300 leading-relaxed">
              Northern Star School & College is a premier institution in Bangladesh fostering academic excellence, integrity, and future leadership through modern curricula and values.
            </p>
            <p className="text-[11px] text-gold font-serif italic">
              Learn • Grow • Achieve
            </p>
          </div>

          {/* Col 2: Divisions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold font-serif">
              Academic Divisions
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/school-division" className="hover:text-gold transition-colors">School Division (Class 1 to 10)</Link></li>
              <li><Link to="/college-division" className="hover:text-gold transition-colors">College Science Stream (HSC)</Link></li>
              <li><Link to="/college-division" className="hover:text-gold transition-colors">College Business Studies (HSC)</Link></li>
              <li><Link to="/college-division" className="hover:text-gold transition-colors">College Humanities Stream (HSC)</Link></li>
              <li><Link to="/admissions" className="hover:text-gold transition-colors">Admissions Guide & Syllabi</Link></li>
            </ul>
          </div>

          {/* Col 3: Portals & Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold font-serif">
              Institutional Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/login" className="hover:text-gold transition-colors">Student & Parent Portal</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Teacher & Staff Portal</Link></li>
              <li><Link to="/login" className="hover:text-gold transition-colors">Administration Control Center</Link></li>
              <li><Link to="/notices" className="hover:text-gold transition-colors">Official Notice Board</Link></li>
              <li><Link to="/facilities" className="hover:text-gold transition-colors">Campus Facilities & STEM Labs</Link></li>
            </ul>
          </div>

          {/* Col 4: Campus Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gold font-serif">
              Campus Address
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Plot 12, Road 4, Sector 7, Uttara Model Town, Dhaka-1230, Bangladesh.
            </p>
            <div className="text-xs text-slate-300 space-y-1">
              <p>Email: info@northernstar.edu.bd</p>
              <p>Admission Desk: +880 1711 000000</p>
              <p>Reception: +880 2 8991234</p>
            </div>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© 2025 Northern Star School & College. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Government Approved & BISE Affiliated</span>
            <span>•</span>
            <Link to="/terms" className="hover:text-white">Privacy & Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
