import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { Notice } from '../../types';
import {
  FileText,
  Calendar,
  Bell,
  Search,
  Filter,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ShieldCheck,
  Lock,
  Key,
  ShieldAlert,
  Trash2
} from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user, switchDemoRole } = useAuth();
  
  const [filterAudience, setFilterAudience] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAdminAuthModal, setShowAdminAuthModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Check if currently authenticated as an administrator
  const isAdmin = user && (user.role === 'institution_admin' || user.role === 'super_admin' || user.role === 'principal');

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState<'all' | 'students' | 'guardians' | 'teachers'>('all');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [author, setAuthor] = useState('Academic Head');

  const [noticesList, setNoticesList] = useState<Notice[]>(dataService.getNotices());

  const handlePublishButtonClick = () => {
    if (isAdmin) {
      setShowAddModal(true);
    } else {
      setAuthError('');
      setAdminPasscode('');
      setShowAdminAuthModal(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!noticeToDelete) return;
    dataService.deleteNotice(noticeToDelete.id);
    setNoticesList(dataService.getNotices());
    setNoticeToDelete(null);
    setDeleteSuccess(true);
    setTimeout(() => setDeleteSuccess(false), 4000);
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === 'admin123' || adminPasscode.toLowerCase() === 'admin' || adminPasscode === '2045') {
      switchDemoRole('institution_admin');
      setShowAdminAuthModal(false);
      setAdminPasscode('');
      setAuthError('');
      setShowAddModal(true);
    } else {
      setAuthError(language === 'bn' 
        ? 'ভুল অ্যাডমিন পাসকোড। সঠিক কোড লিখুন (ডিফল্ট: admin123)' 
        : 'Invalid admin passcode. Default security code is admin123.');
    }
  };

  const handleQuickAdminLogin = () => {
    switchDemoRole('institution_admin');
    setShowAdminAuthModal(false);
    setShowAddModal(true);
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newN = dataService.addNotice({
      title,
      content,
      publishDate: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      audience,
      priority,
      author: author || (user?.displayName || 'Academic Administration'),
    });

    setNoticesList(dataService.getNotices());
    setShowAddModal(false);
    setTitle('');
    setContent('');
    setPublishSuccess(true);
    setTimeout(() => setPublishSuccess(false), 4000);
  };

  const filteredNotices = noticesList.filter(n => {
    const matchesAudience = filterAudience === 'all' || n.audience === 'all' || n.audience === filterAudience;
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                          n.content.toLowerCase().includes(search.toLowerCase());
    return matchesAudience && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-royal bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            {language === 'bn' ? 'অফিশিয়াল নোটিশ বোর্ড' : 'Official Notice Board'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-navy-950 mt-2">
            {t('noticesTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted leading-relaxed mt-1">
            {t('noticesSubtitle')}
          </p>
        </div>

        {/* Add Notice Action Button - Restricted strictly to Verified Administrators */}
        {isAdmin ? (
          <button
            type="button"
            onClick={handlePublishButtonClick}
            className="px-5 py-2.5 rounded-xl bg-royal hover:bg-royal-hover text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all self-start sm:self-center shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{t('publishNotice')}</span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-mono">
              {language === 'bn' ? 'অ্যাডমিন' : 'Admin'}
            </span>
          </button>
        ) : !user ? (
          <button
            type="button"
            onClick={handlePublishButtonClick}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-xs transition-all self-start sm:self-center shrink-0 border border-slate-200"
          >
            <Lock className="w-3.5 h-3.5 text-royal" />
            <span>{t('publishNotice')}</span>
            <span className="text-[10px] bg-royal/10 text-royal px-1.5 py-0.5 rounded font-mono font-medium">
              {language === 'bn' ? 'শুধুমাত্র অ্যাডমিন' : 'Admin Only'}
            </span>
          </button>
        ) : null}
      </div>

      {/* SUCCESS BANNER */}
      {publishSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{t('noticePublishedSuccess')}</span>
        </div>
      )}

      {/* DELETE SUCCESS BANNER */}
      {deleteSuccess && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{t('noticeDeletedSuccess')}</span>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'all', label: t('allAudience') },
            { id: 'students', label: t('studentsAudience') },
            { id: 'guardians', label: t('guardiansAudience') },
            { id: 'teachers', label: t('teachersAudience') },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilterAudience(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterAudience === item.id
                  ? 'bg-royal text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* NOTICES LIST */}
      <div className="space-y-4">
        {filteredNotices.length === 0 ? (
          <div className="bg-surface rounded-2xl p-12 text-center border border-slate-border text-slate-400 text-xs">
            {t('noDataFound')}
          </div>
        ) : (
          filteredNotices.map((n) => (
            <div
              key={n.id}
              className={`bg-surface rounded-2xl p-6 border transition-all hover:shadow-card-hover ${
                n.priority === 'urgent' ? 'border-rose-200 bg-rose-50/20' : 'border-slate-border'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    n.priority === 'urgent' ? 'bg-rose-100 text-status-red border border-rose-200' : 'bg-blue-100 text-royal border border-blue-200'
                  }`}
                >
                  {n.priority === 'urgent' ? t('priorityUrgent') : t('priorityNormal')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{n.publishDate}</span>
                  </span>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setNoticeToDelete(n)}
                      title={t('deleteNotice')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold group ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition-colors" />
                      <span className="hidden sm:inline text-[11px] text-slate-500 group-hover:text-rose-600">
                        {t('delete')}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                {n.priority === 'urgent' && <AlertTriangle className="w-4 h-4 text-status-red shrink-0" />}
                <span>{n.title}</span>
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {n.content}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>{t('authorLabel')}: <strong className="text-navy-950 font-semibold">{n.author}</strong></span>
                <span className="capitalize">
                  {t('targetLabel')}: <strong className="text-royal font-semibold">
                    {n.audience === 'all' ? t('allAudience') :
                     n.audience === 'students' ? t('studentsAudience') :
                     n.audience === 'guardians' ? t('guardiansAudience') : t('teachersAudience')}
                  </strong>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADMIN AUTHENTICATION SECURITY MODAL (When non-admin tries to publish) */}
      {showAdminAuthModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-royal flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-navy-950">
                  {language === 'bn' ? 'অ্যাডমিন অনুমোদন আবশ্যক' : 'Administrator Authorization Required'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminAuthModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                {language === 'bn' 
                  ? 'প্রাতিষ্ঠানিক নোটিশ বোর্ডে প্রজ্ঞাপন প্রকাশের অধিকার শুধুমাত্র অনুমোদিত অ্যাডমিনিস্ট্রেটরদের জন্য সংরক্ষিত।'
                  : 'Notice publishing authority is restricted strictly to authorized School & College Administrators and Principals.'}
              </p>

              {user && (user.role === 'student' || user.role === 'guardian') && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-status-orange text-[11px] font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>
                    {language === 'bn' 
                      ? `আপনি বর্তমানে '${user.role === 'student' ? 'শিক্ষার্থী' : 'অভিভাবক'}' হিসেবে লগইন রয়েছেন। নোটিশ প্রকাশ করতে অ্যাডমিন পাসকোড দিয়ে যাচাই করুন।` 
                      : `You are currently browsing as ${user.role}. Please authenticate with administrator access to publish notices.`}
                  </span>
                </div>
              )}

              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-status-red text-[11px] font-semibold">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAdminAuthSubmit} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {language === 'bn' ? 'অ্যাডমিন সিকিউরিটি পাসকোড *' : 'Administrator Security Passcode *'}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="admin123"
                      className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {language === 'bn' ? 'ডেমো অ্যাডমিন পাসকোড: admin123' : 'Demo administrator passcode: admin123'}
                  </span>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-royal hover:bg-royal-hover text-white rounded-lg font-bold shadow-sm transition-all"
                  >
                    {language === 'bn' ? 'যাচাই করুন ও নোটিশ প্রকাশ করুন' : 'Verify & Open Publishing Form'}
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-all"
                  >
                    {language === 'bn' ? '১-ক্লিকে অ্যাডমিন অনুমোদন নিন (Demo)' : 'Quick 1-Click Authenticate as Admin (Demo)'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NOTICE MODAL (Only opens for verified administrators) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-border my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-royal" />
                <h3 className="text-base font-bold text-navy-950">
                  {t('postNoticeModalTitle')}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-status-green border border-emerald-200">
                  {language === 'bn' ? 'অনুমোদিত অ্যাডমিন' : 'Verified Admin'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t('noticeTitleLabel')}
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: বার্ষিক ক্রীড়া প্রতিযোগিতা ২০২৫' : 'e.g. Annual Sports Day & Prize Distribution'}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal text-navy-950 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('noticeAudienceLabel')}
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    <option value="all">{t('allAudience')}</option>
                    <option value="students">{t('studentsAudience')}</option>
                    <option value="guardians">{t('guardiansAudience')}</option>
                    <option value="teachers">{t('teachersAudience')}</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {t('noticePriorityLabel')}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                  >
                    <option value="normal">{t('priorityNormal')}</option>
                    <option value="urgent">{t('priorityUrgent')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t('noticeAuthorLabel')}
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Principal's Secretariat"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {t('noticeContentLabel')}
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={language === 'bn' ? 'বিজ্ঞপ্তির বিস্তারিত বিবরণ এখানে লিখুন...' : 'Write the complete circular details and instructions here...'}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal leading-relaxed"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white font-bold rounded-lg shadow-sm"
                >
                  {t('publishNotice')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {noticeToDelete && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-border">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-navy-950">
                  {t('deleteNoticeConfirmTitle')}
                </h3>
                <p className="text-xs text-slate-500">
                  {language === 'bn' ? 'অ্যাডমিন অধিকার প্রয়োগ' : 'Administrative Authority'}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-600">
              <p className="leading-relaxed">
                {t('deleteNoticeConfirmDesc')}
              </p>
              
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  {language === 'bn' ? 'বিজ্ঞপ্তি' : 'Notice'}
                </span>
                <p className="font-bold text-navy-950 text-sm">
                  {noticeToDelete.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                  <span>{noticeToDelete.publishDate}</span>
                  <span>•</span>
                  <span>{noticeToDelete.author}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setNoticeToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'বিজ্ঞপ্তি অপসারণ করুন' : 'Confirm Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
