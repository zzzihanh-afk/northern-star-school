import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { Logo, LogoEmblem } from '../../components/brand/Logo';
import { LanguageSwitcher } from '../../components/common/LanguageSwitcher';
import {
  Lock,
  Mail,
  LogIn,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  School,
  AlertCircle,
  GraduationCap,
  IdCard,
  User,
  Info
} from 'lucide-react';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { signIn, signInStudent, switchDemoRole, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Portal mode: 'student' or 'staff'
  const [portalMode, setPortalMode] = useState<'student' | 'staff'>('student');

  // Student portal credentials (Name and Administrator-set ID number)
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');

  // Staff / Admin credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (portalMode === 'student') {
      if (!studentName.trim() || !studentId.trim()) {
        setErrorMsg('Please enter both your Student Name and administrator-assigned ID number.');
        return;
      }
      const success = await signInStudent(studentName, studentId);
      if (success) {
        navigate('/student/dashboard');
      } else {
        setErrorMsg('Student record not found. Please verify your full name and official ID/Roll number assigned by the administrator.');
      }
    } else {
      // Staff / Administration login
      const success = await signIn(email, password);
      if (success) {
        let userRole = 'institution_admin';
        try {
          const saved = localStorage.getItem('ns_current_user');
          if (saved) {
            userRole = JSON.parse(saved).role || 'institution_admin';
          }
        } catch {}

        if (userRole === 'student') {
          navigate('/student/dashboard');
        } else if (userRole === 'guardian') {
          navigate('/parent/dashboard');
        } else if (userRole === 'teacher') {
          navigate('/teacher/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      } else {
        // Fallback: check if they entered student credentials into the staff form
        const studentSuccess = await signInStudent(email, password);
        if (studentSuccess) {
          navigate('/student/dashboard');
          return;
        }
        setErrorMsg('Invalid credentials. Super Admin: supernadmin.@gmail.com (pass: supernadmin) or switch to Student Portal.');
      }
    }
  };

  const handleQuickRole = (role: UserRole) => {
    switchDemoRole(role);
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'guardian') navigate('/parent/dashboard');
    else if (role === 'teacher') navigate('/teacher/dashboard');
    else navigate('/admin/dashboard');
  };

  const handleQuickStudentLogin = async (name: string, roll: string) => {
    setPortalMode('student');
    setStudentName(name);
    setStudentId(roll);
    setErrorMsg('');
    const success = await signInStudent(name, roll);
    if (success) {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar with Language Switcher & Home link */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-navy-950 flex items-center gap-1.5">
          <span>← Back to Website</span>
        </Link>
        <LanguageSwitcher variant="compact" />
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-8 bg-surface rounded-2xl shadow-xl border border-slate-border p-6 sm:p-8">
        <div className="text-center flex flex-col items-center">
          <LogoEmblem sizeClass="w-16 h-16 mb-3" idSuffix="login-card" />
          <h2 className="font-serif font-black tracking-wider text-xl text-navy-950 uppercase">
            Northern Star
          </h2>
          <span className="text-[10px] tracking-widest font-semibold text-slate-400 uppercase">
            School & College Portal
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your institutional records
          </p>
        </div>

        {/* Portal Selection Tabs (Student vs Staff/Admin) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mt-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setPortalMode('student');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              portalMode === 'student'
                ? 'bg-white text-royal shadow-sm font-bold'
                : 'text-slate-500 hover:text-navy-950'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setPortalMode('staff');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              portalMode === 'staff'
                ? 'bg-white text-navy-950 shadow-sm font-bold'
                : 'text-slate-500 hover:text-navy-950'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Staff & Admin</span>
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-status-red text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STUDENT PORTAL FORM (Name & Administrator-Set ID Number) */}
        {portalMode === 'student' ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-royal flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Students must log in using their <strong>full name</strong> and <strong>ID / Roll number</strong> assigned by the school administrator.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Student Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rafiq Hasan"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal text-navy-950 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Student ID / Roll Number (Set by Administrator)
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. NSC-2025-0147"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal text-navy-950 font-mono font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-royal hover:bg-royal-hover text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Verifying Student Record...' : 'Sign In to Student Portal'}</span>
            </button>
          </form>
        ) : (
          /* STAFF / ADMIN LOGIN FORM */
          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Institution Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="supernadmin.@gmail.com or admin@northernstar.edu.bd"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal text-navy-950 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Password</label>
                <button type="button" onClick={() => alert('Password recovery: Please contact the system administrator or check the setup guide.')} className="text-royal hover:underline text-[11px]">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal text-navy-950"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-royal hover:bg-royal-hover text-white rounded-lg font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
            </button>
          </form>
        )}

        {/* 1-CLICK DEMO ROLE LOGIN BUTTONS (Allows immediate exploration of all reference screens) */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
            Quick 1-Click Evaluation Logins
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setPortalMode('staff');
                setEmail('supernadmin.@gmail.com');
                setPassword('supernadmin');
                handleQuickRole('super_admin');
              }}
              className="col-span-2 p-2.5 rounded-lg border border-amber-200 bg-amber-50/80 hover:bg-amber-100 hover:border-amber-400 text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-amber-950 block text-[11px] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  Super Administrator Access
                </span>
                <span className="text-[10px] text-amber-700 font-mono">supernadmin.@gmail.com • pass: supernadmin</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded shadow-xs">1-Click</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickStudentLogin('Rafiq Hasan', 'NSC-2025-0147')}
              className="col-span-2 p-2.5 rounded-lg border border-blue-200 bg-blue-50/60 hover:bg-blue-100 hover:border-royal text-left transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-royal block text-[11px] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-royal" />
                  Student Portal (Name & ID)
                </span>
                <span className="text-[10px] text-slate-600 font-mono">Rafiq Hasan • ID: NSC-2025-0147</span>
              </div>
              <span className="text-[10px] font-bold bg-royal text-white px-2 py-0.5 rounded shadow-xs">1-Click</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('institution_admin')}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-royal text-left transition-colors"
            >
              <span className="font-bold text-navy-950 block text-[11px]">Admin Control</span>
              <span className="text-[9px] text-slate-400">Total 1,248 students</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('guardian')}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-royal text-left transition-colors"
            >
              <span className="font-bold text-navy-950 block text-[11px]">Parent Portal</span>
              <span className="text-[9px] text-slate-400">Mr. Rahman (2 Children)</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickRole('teacher')}
              className="col-span-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-royal text-left transition-colors"
            >
              <span className="font-bold text-navy-950 block text-[11px]">Teacher Portal</span>
              <span className="text-[9px] text-slate-400">Ms. Farhana (Math Senior Faculty)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-slate-400 py-2">
        <p>© 2025 Northern Star School & College. Powered by Cloud Firestore & Firebase Auth.</p>
      </div>
    </div>
  );
};
