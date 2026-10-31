import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Logo } from '../components/brand/Logo';
import { LanguageSwitcher } from '../components/common/LanguageSwitcher';
import { dataService } from '../services/dataService';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Layers,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  CreditCard,
  BarChart3,
  MessageSquare,
  Settings,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  LogOut,
  UserCheck,
  BookMarked,
  FileText,
  Clock,
  Award,
  DollarSign,
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut, switchDemoRole } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const [pendingEnquiriesCount, setPendingEnquiriesCount] = useState(() => {
    try {
      return dataService.getEnquiries().filter(e => e.status === 'new').length;
    } catch {
      return 2;
    }
  });

  React.useEffect(() => {
    const handleUpdate = () => {
      try {
        setPendingEnquiriesCount(dataService.getEnquiries().filter(e => e.status === 'new').length);
      } catch {
        // Safe fallback
      }
    };
    window.addEventListener('enquiries-updated', handleUpdate);
    return () => window.removeEventListener('enquiries-updated', handleUpdate);
  }, []);

  const role = user?.role || 'institution_admin';

  // Format today's date (matching the screenshot e.g. "Friday, 25 April 2025")
  const formattedDate = new Intl.DateTimeFormat(language === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(2025, 3, 25)); // Reference date Friday, 25 April 2025

  // Navigation Items according to current role
  const getNavItems = () => {
    if (role === 'student') {
      return [
        { label: t('nav_dashboard'), path: '/student/dashboard', icon: LayoutDashboard },
        { label: t('nav_myProfile'), path: '/student/profile', icon: Users },
        { label: t('nav_classRoutine'), path: '/student/routine', icon: Clock },
        { label: t('nav_assignments'), path: '/student/assignments', icon: BookMarked },
        { label: t('nav_examResults'), path: '/student/results', icon: Award },
        { label: t('nav_attendance'), path: '/student/attendance', icon: CalendarCheck },
        { label: t('nav_feesPayments'), path: '/student/fees', icon: CreditCard },
        { label: t('recentNotices'), path: '/student/notices', icon: MessageSquare },
        { label: t('nav_messages'), path: '/student/messages', icon: MessageSquare },
      ];
    }

    if (role === 'guardian') {
      return [
        { label: t('nav_dashboard'), path: '/parent/dashboard', icon: LayoutDashboard },
        { label: t('nav_myChildren'), path: '/parent/children', icon: Users },
        { label: t('nav_attendance'), path: '/parent/attendance', icon: CalendarCheck },
        { label: t('nav_examResults'), path: '/parent/results', icon: Award },
        { label: t('nav_feesPayments'), path: '/parent/fees', icon: CreditCard },
        { label: t('recentNotices'), path: '/parent/notices', icon: Bell },
        { label: t('nav_messages'), path: '/parent/messages', icon: MessageSquare },
        { label: t('nav_myProfile'), path: '/parent/profile', icon: Users },
      ];
    }

    if (role === 'teacher') {
      return [
        { label: t('nav_dashboard'), path: '/teacher/dashboard', icon: LayoutDashboard },
        { label: language === 'bn' ? 'আমার শ্রেণিসমূহ' : 'My Classes', path: '/teacher/classes', icon: Layers },
        { label: t('nav_classRoutine'), path: '/teacher/routine', icon: Clock },
        { label: language === 'bn' ? 'উপস্থিতি গ্রহণ' : 'Take Attendance', path: '/teacher/attendance', icon: CalendarCheck },
        { label: language === 'bn' ? 'নম্বর এন্ট্রি' : 'Marks Entry', path: '/teacher/marks', icon: Award },
        { label: t('nav_assignments'), path: '/teacher/assignments', icon: BookMarked },
        { label: t('recentNotices'), path: '/teacher/notices', icon: MessageSquare },
      ];
    }

    // Default: Admin & Principal navigation (matching screenshot)
    return [
      { label: t('nav_dashboard'), path: '/admin/dashboard', icon: LayoutDashboard },
      { label: t('nav_students'), path: '/admin/students', icon: Users },
      {
        label: language === 'bn' ? 'ভর্তি আবেদন' : 'Admissions Desk',
        path: '/admin/admissions',
        icon: UserCheck,
        badge: pendingEnquiriesCount > 0 ? pendingEnquiriesCount : undefined
      },
      { label: t('nav_teachers'), path: '/admin/teachers', icon: GraduationCap },
      { label: t('nav_classesSections'), path: '/admin/classes', icon: Layers },
      { label: t('nav_academic'), path: '/admin/academic', icon: BookOpen, hasSub: true },
      { label: t('nav_examinations'), path: '/admin/examinations', icon: ClipboardList, hasSub: true },
      { label: t('nav_attendance'), path: '/admin/attendance', icon: CalendarCheck, hasSub: true },
      { label: t('nav_feesPayments'), path: '/admin/fees', icon: CreditCard },
      { label: t('nav_reports'), path: '/admin/reports', icon: BarChart3, hasSub: true },
      { label: t('nav_communication'), path: '/admin/notices', icon: MessageSquare, hasSub: true },
      {
        label: language === 'bn' ? 'ব্যবহারকারী ও রোল' : 'Users & Roles',
        path: '/admin/users',
        icon: ShieldCheck,
        badge: role === 'super_admin' ? 'Super' : undefined
      },
      { label: t('nav_settings'), path: '/admin/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const handleRoleChange = (newRole: UserRole) => {
    switchDemoRole(newRole);
    setRoleSwitcherOpen(false);
    if (newRole === 'student') navigate('/student/dashboard');
    else if (newRole === 'guardian') navigate('/parent/dashboard');
    else if (newRole === 'teacher') navigate('/teacher/dashboard');
    else navigate('/admin/dashboard');
  };

  const getUserSubtitle = () => {
    if (role === 'student') {
      const stu = (user?.metadata?.studentId ? dataService.getStudentById(user.metadata.studentId) : null) ||
                  dataService.getStudents().find(s => s.fullName.toLowerCase() === user?.displayName?.toLowerCase());
      if (stu) return `${stu.className} • ${stu.rollNo}`;
      return language === 'bn' ? '৯ম শ্রেণি (বিজ্ঞান)' : 'Class 9 (Science)';
    }
    if (role === 'guardian') return language === 'bn' ? 'অভিভাবক' : 'Parent';
    if (role === 'teacher') return language === 'bn' ? 'সিনিয়র শিক্ষক' : 'Senior Teacher';
    if (role === 'super_admin') return language === 'bn' ? 'সুপার অ্যাডমিনিস্ট্রেটর' : 'Super Administrator';
    return t('role_super_admin');
  };

  const getNotifications = () => {
    if (role === 'student') {
      return [
        {
          id: 'notif-1',
          title: language === 'bn' ? 'বার্ষিক পরীক্ষার সময়সূচি প্রকাশিত হয়েছে' : 'Final Term Exam Schedule Published',
          desc: language === 'bn' ? '৯ম শ্রেণির চূড়ান্ত পরীক্ষার সময়সূচি ও প্রবেশপত্র দেখুন।' : 'Routine and admit cards for Class 9 now published.',
          time: language === 'bn' ? '২ ঘণ্টা আগে' : '2 hours ago',
          path: '/student/results',
          unread: true,
          icon: Award,
          iconColor: 'bg-purple-100 text-status-violet'
        },
        {
          id: 'notif-2',
          title: language === 'bn' ? 'টিউশন ফি মানি রসিদ ইস্যু করা হয়েছে' : 'Tuition Fee Receipt Voucher Issued',
          desc: language === 'bn' ? 'ভাউচার #NSC-2025-0015 (৳ ৩,৫০০) সফলভাবে সংরক্ষিত।' : 'Voucher #NSC-2025-0015 for ৳ 3,500 recorded.',
          time: language === 'bn' ? '৫ ঘণ্টা আগে' : '5 hours ago',
          path: '/student/fees',
          unread: true,
          icon: CreditCard,
          iconColor: 'bg-emerald-100 text-status-green'
        },
        {
          id: 'notif-3',
          title: language === 'bn' ? 'উচ্চতর গণিত অ্যাসাইনমেন্ট নির্ধারিত' : 'Higher Mathematics Assignment Due',
          desc: language === 'bn' ? 'দ্বিঘাত সমীকরণ সমাধানের শেষ তারিখ ২৮ এপ্রিল।' : 'Quadratic Equations assignment due on 28 April.',
          time: language === 'bn' ? 'গতকাল' : 'Yesterday',
          path: '/student/assignments',
          unread: false,
          icon: BookMarked,
          iconColor: 'bg-blue-100 text-royal'
        }
      ];
    }

    if (role === 'guardian') {
      return [
        {
          id: 'notif-1',
          title: language === 'bn' ? 'সামিউল রহমানের বার্ষিক পরীক্ষার রুটিন' : 'Samiul Rahman Final Exam Schedule',
          desc: language === 'bn' ? '৭ম শ্রেণির চূড়ান্ত পরীক্ষা আগামী ১২ মে থেকে শুরু হবে।' : 'Class 7 final exams commence from 12 May 2025.',
          time: language === 'bn' ? '১ ঘণ্টা আগে' : '1 hour ago',
          path: '/parent/results',
          unread: true,
          icon: Award,
          iconColor: 'bg-purple-100 text-status-violet'
        },
        {
          id: 'notif-2',
          title: language === 'bn' ? 'অভিভাবক-শিক্ষক মতবিনিময় সভা (PTM)' : 'Parent-Teacher Meeting (PTM) Notice',
          desc: language === 'bn' ? '৩০ এপ্রিল সকাল ১০টায় কলেজ মিলনায়তনে সভা অনুষ্ঠিত হবে।' : 'Scheduled for 30 Apr 2025 at Central Auditorium.',
          time: language === 'bn' ? '৪ ঘণ্টা আগে' : '4 hours ago',
          path: '/parent/notices',
          unread: true,
          icon: MessageSquare,
          iconColor: 'bg-blue-100 text-royal'
        },
        {
          id: 'notif-3',
          title: language === 'bn' ? 'মাসিক বেতন পরিশোধ নিশ্চিতকরণ' : 'Monthly Fee Cleared: No Dues',
          desc: language === 'bn' ? 'এপ্রিল মাসের সকল ফি সম্পূর্ণরূপে পরিশোধিত রয়েছে।' : 'All tuition fees for April 2025 up to date.',
          time: language === 'bn' ? 'গতকাল' : 'Yesterday',
          path: '/parent/fees',
          unread: false,
          icon: CreditCard,
          iconColor: 'bg-emerald-100 text-status-green'
        }
      ];
    }

    if (role === 'teacher') {
      return [
        {
          id: 'notif-1',
          title: language === 'bn' ? '৯ম শ্রেণির নম্বর এন্ট্রি পোর্টাল উন্মুক্ত' : 'Class 9 Marks Entry Portal Open',
          desc: language === 'bn' ? 'গণিত ও পদার্থবিজ্ঞান বিষয়ের প্রাপ্ত নম্বর ইনপুট করুন।' : 'Submit term marks by 5 May 2025.',
          time: language === 'bn' ? '৩০ মিনিট আগে' : '30 mins ago',
          path: '/teacher/marks',
          unread: true,
          icon: Award,
          iconColor: 'bg-purple-100 text-status-violet'
        },
        {
          id: 'notif-2',
          title: language === 'bn' ? 'একাডেমিক কাউন্সিল জরুরি সভা' : 'Academic Council Meeting Notice',
          desc: language === 'bn' ? 'আজ দুপুর ২টায় অধ্যক্ষের সভাকক্ষে জরুরি সভা।' : 'Emergency faculty briefing in Conference Room 1.',
          time: language === 'bn' ? '৩ ঘণ্টা আগে' : '3 hours ago',
          path: '/teacher/notices',
          unread: true,
          icon: CalendarCheck,
          iconColor: 'bg-blue-100 text-royal'
        }
      ];
    }

    // Default: Admin
    return [
      {
        id: 'notif-1',
        title: language === 'bn' ? 'নতুন ভর্তি আবেদন জমা পড়েছে' : 'New Admission Enquiry Submitted',
        desc: language === 'bn' ? 'আবেদনকারী: রহিম আহমেদ (৬ষ্ঠ শ্রেণি, স্কুল শাখা)।' : 'Applicant: Rahim Ahmed (Class 6, School Division).',
        time: language === 'bn' ? '১০ মিনিট আগে' : '10 mins ago',
        path: '/admin/admissions',
        unread: true,
        icon: Users,
        iconColor: 'bg-blue-100 text-royal'
      },
      {
        id: 'notif-2',
        title: language === 'bn' ? 'ফি আদায় রেকর্ড করা হয়েছে (৳ ৩,৫০০)' : 'Fee Payment Logged (৳ 3,500)',
        desc: language === 'bn' ? 'বিকাশের মাধ্যমে শিক্ষার্থী রফিক হাসানের ফি গৃহীত।' : 'Received via bKash from Rafiq Hasan (Class 9).',
        time: language === 'bn' ? '১ ঘণ্টা আগে' : '1 hour ago',
        path: '/admin/fees',
        unread: true,
        icon: CreditCard,
        iconColor: 'bg-emerald-100 text-status-green'
      },
      {
        id: 'notif-3',
        title: language === 'bn' ? 'শিক্ষক উপস্থিতি আপডেট সম্পন্ন' : 'Teacher Attendance Updated',
        desc: language === 'bn' ? '৮৬ জন শিক্ষকের দৈনিক উপস্থিতি সফলভাবে সংরক্ষিত।' : '86 faculty attendance verified by Principal Office.',
        time: language === 'bn' ? '৪ ঘণ্টা আগে' : '4 hours ago',
        path: '/admin/teachers',
        unread: false,
        icon: CalendarCheck,
        iconColor: 'bg-purple-100 text-status-violet'
      }
    ];
  };

  const notifications = getNotifications();

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-navy-950/60 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR: Deep Navy Sidebar (#061B3A) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 text-white flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-100'
        }`}
      >
        {/* Sidebar Logo Header */}
        <div className="border-b border-navy-800/80">
          <Logo variant="sidebar" />
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-royal text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-navy-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-royal' : 'bg-royal text-white shadow-xs'
                  }`}>
                    {item.badge}
                  </span>
                ) : item.hasSub ? (
                  <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                ) : null}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Bottom User Profile Card */}
        <div className="p-3 border-t border-navy-800/80 bg-navy-950/40">
          <div className="flex items-center justify-between p-2 rounded-lg bg-navy-800/40 hover:bg-navy-800 transition-colors cursor-pointer"
               onClick={() => setUserDropdownOpen(!userDropdownOpen)}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-royal text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 border border-blue-400/30">
                {user?.displayName ? user.displayName.charAt(0) : 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate">
                  {user?.displayName || 'User'}
                </span>
                <span className="text-[10px] text-slate-300 truncate">
                  {getUserSubtitle()}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-surface border-b border-slate-border px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
          {/* Left: Mobile Toggle & Search */}
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('search')}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Date Display (from reference) */}
            <span className="hidden md:inline-block text-xs font-medium text-slate-500">
              {formattedDate}
            </span>

            {/* Quick Demo Role Switcher (Allows instant switching to experience Admin, Student, Parent dashboards) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-blue-50 text-royal hover:bg-blue-100 rounded-md border border-blue-200/60 transition-colors"
                title="Switch portal perspective"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline capitalize">Role: {role.replace('_', ' ')}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-xl border border-slate-border py-1 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 font-semibold text-slate-400 border-b border-slate-100 text-[10px] uppercase tracking-wider">
                    Switch Active Portal
                  </div>
                  <button
                    onClick={() => handleRoleChange('super_admin')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      role === 'super_admin' ? 'font-bold text-royal bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Super Admin (supernadmin)</span>
                    {role === 'super_admin' && <span className="text-[10px] bg-royal text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('institution_admin')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      role === 'institution_admin' ? 'font-bold text-royal bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Administrator Portal</span>
                    {role === 'institution_admin' && <span className="text-[10px] bg-royal text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('student')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      role === 'student' ? 'font-bold text-royal bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Student Portal (Rafiq Hasan)</span>
                    {role === 'student' && <span className="text-[10px] bg-royal text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('guardian')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      role === 'guardian' ? 'font-bold text-royal bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Parent Portal (Mr. Rahman)</span>
                    {role === 'guardian' && <span className="text-[10px] bg-royal text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                  <button
                    onClick={() => handleRoleChange('teacher')}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between ${
                      role === 'teacher' ? 'font-bold text-royal bg-blue-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>Teacher Portal (Ms. Farhana)</span>
                    {role === 'teacher' && <span className="text-[10px] bg-royal text-white px-1.5 py-0.5 rounded">Active</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher variant="compact" />

            {/* Notification Bell with Badge & Interactive Panel */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserDropdownOpen(false);
                  setRoleSwitcherOpen(false);
                }}
                className="relative p-2 rounded-full text-slate-500 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                title={language === 'bn' ? 'বিজ্ঞপ্তি' : 'Notifications'}
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-status-red text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl shadow-2xl border border-slate-border py-2 z-50 text-xs animate-in fade-in zoom-in-95">
                    {/* Header */}
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy-950 text-sm">
                          {language === 'bn' ? 'বিজ্ঞপ্তি সমূহ' : 'Notifications'}
                        </span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-status-red font-mono">
                            {unreadCount} {language === 'bn' ? 'নতুন' : 'new'}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setUnreadCount(0)}
                          className="text-[11px] font-semibold text-royal hover:underline"
                        >
                          {language === 'bn' ? 'সব পড়া হয়েছে' : 'Mark all read'}
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map((n) => {
                        const IconComponent = n.icon;
                        const isUnread = n.unread && unreadCount > 0;
                        return (
                          <div
                            key={n.id}
                            onClick={() => {
                              navigate(n.path);
                              setNotificationsOpen(false);
                            }}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                              isUnread ? 'bg-blue-50/40' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${n.iconColor}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="flex-1 space-y-0.5">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-bold text-navy-950 text-xs leading-snug">{n.title}</h4>
                                {isUnread && (
                                  <span className="w-2 h-2 rounded-full bg-royal shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 leading-relaxed">{n.desc}</p>
                              <span className="text-[10px] text-slate-400 block pt-0.5 font-mono">{n.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-slate-100 text-center bg-slate-50/60">
                      <button
                        type="button"
                        onClick={() => {
                          const targetNoticeRoute = role === 'student' ? '/student/notices' : role === 'guardian' ? '/parent/notices' : role === 'teacher' ? '/teacher/notices' : '/admin/notices';
                          navigate(targetNoticeRoute);
                          setNotificationsOpen(false);
                        }}
                        className="text-xs font-bold text-royal hover:underline"
                      >
                        {language === 'bn' ? 'সকল প্রাতিষ্ঠানিক নোটিশ দেখুন →' : 'View All Notices & Circulars →'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* User Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase border border-slate-200">
                  {user?.displayName ? user.displayName.charAt(0) : 'A'}
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-dark">
                  {user?.displayName || 'Admin'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-xl border border-slate-border py-1 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-semibold text-slate-dark truncate">{user?.displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>
                  <NavLink
                    to="/"
                    className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    Public Website
                  </NavLink>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      signOut();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-status-red hover:bg-status-red-light flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
