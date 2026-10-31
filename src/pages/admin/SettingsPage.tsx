import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  Settings,
  Save,
  CheckCircle2,
  Shield,
  Globe,
  Clock,
  DollarSign,
  Upload,
  RotateCcw,
  Image as ImageIcon,
  ShieldCheck,
  Database,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { LogoEmblem } from '../../components/brand/Logo';
import { dataService } from '../../services/dataService';

export const SettingsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // Role Security Guard: Only Institutional Administrators, Principals, or Super Admins
  const isAdmin = user && (user.role === 'institution_admin' || user.role === 'super_admin' || user.role === 'principal');

  if (!isAdmin) {
    if (user?.role === 'student') return <Navigate to="/student/dashboard" replace />;
    if (user?.role === 'guardian') return <Navigate to="/parent/dashboard" replace />;
    if (user?.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  const [saved, setSaved] = useState(false);
  const [logoUpdated, setLogoUpdated] = useState(false);
  const [customLogoPreview, setCustomLogoPreview] = useState<string | null>(null);

  const [syncingCloud, setSyncingCloud] = useState(false);
  const [cloudSyncResult, setCloudSyncResult] = useState<{ success: boolean; message: string } | null>(null);
  const [cloudStatus, setCloudStatus] = useState(() => dataService.getFirestoreStatus());

  const [settings, setSettings] = useState({
    institutionName: 'Northern Star School & College',
    tagline: 'Learn • Grow • Achieve',
    timezone: 'Asia/Dhaka',
    currency: 'BDT (৳)',
    primaryLanguage: 'English',
    secondaryLanguage: 'Bangla',
    eiin: '138240',
    institutionCode: '2045',
    activeSession: '2025–2026',
    schoolDivisionEnabled: true,
    collegeDivisionEnabled: true,
    gpaScale: '5.0 (National Curriculum of Bangladesh)',
  });

  useEffect(() => {
    const savedCustomLogo = localStorage.getItem('ns_custom_logo');
    if (savedCustomLogo) setCustomLogoPreview(savedCustomLogo);

    const savedSettings = localStorage.getItem('ns_settings');
    if (savedSettings) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCustomLogoPreview(base64);
        localStorage.setItem('ns_custom_logo', base64);
        window.dispatchEvent(new Event('logo-updated'));
        setLogoUpdated(true);
        setTimeout(() => setLogoUpdated(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetLogo = () => {
    localStorage.removeItem('ns_custom_logo');
    setCustomLogoPreview(null);
    window.dispatchEvent(new Event('logo-updated'));
    setLogoUpdated(true);
    setTimeout(() => setLogoUpdated(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ns_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSyncToCloud = async () => {
    setSyncingCloud(true);
    setCloudSyncResult(null);
    try {
      const res = await dataService.syncAllToFirestore();
      if (res.success) {
        setCloudSyncResult({
          success: true,
          message: `Successfully synchronized ${res.syncedCount} school records (Students, Teachers, Guardians, Staff & Admins, Notices) to Cloud Firestore!`
        });
        setCloudStatus(dataService.getFirestoreStatus());
      } else {
        setCloudSyncResult({
          success: false,
          message: res.error || 'Failed to sync to Cloud Firestore.'
        });
      }
    } catch (err: any) {
      setCloudSyncResult({
        success: false,
        message: err?.message || 'Sync error occurred.'
      });
    } finally {
      setSyncingCloud(false);
    }
  };

  const handlePullFromCloud = async () => {
    setSyncingCloud(true);
    setCloudSyncResult(null);
    try {
      const updated = await dataService.hydrateFromFirestore();
      if (updated) {
        setCloudSyncResult({
          success: true,
          message: 'Local dataset successfully refreshed with latest records from Cloud Firestore!'
        });
      } else {
        setCloudSyncResult({
          success: true,
          message: 'Cloud Firestore is reachable. Local records are already consistent.'
        });
      }
    } catch (err: any) {
      setCloudSyncResult({
        success: false,
        message: 'Failed to pull data from cloud.'
      });
    } finally {
      setSyncingCloud(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
          {t('settingsTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
          {t('settingsSubtitle')}
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{language === 'bn' ? 'প্রতিষ্ঠানের সকল সেটিংস সফলভাবে সংরক্ষিত ও সিঙ্ক করা হয়েছে!' : 'Institution settings have been updated and synced successfully!'}</span>
        </div>
      )}

      {logoUpdated && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-royal text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{t('logoUploadedSuccess')}</span>
        </div>
      )}

      {/* Super Admin User & Role Management Quick Link */}
      {(user?.role === 'super_admin' || user?.role === 'institution_admin') && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-navy-900 via-navy-800 to-royal text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">System Users & Role Authority</h4>
              <p className="text-xs text-blue-100 mt-0.5">
                Add administrators with specific roles, set passwords, and manage parent/guardian portal credentials.
              </p>
            </div>
          </div>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-white text-navy-950 hover:bg-blue-50 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 text-center"
          >
            Manage Users & Roles →
          </Link>
        </div>
      )}

      {/* CLOUD FIRESTORE DATABASE STATUS & SYNC PANEL */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-navy-950 via-slate-900 to-navy-900 border border-slate-700 text-white shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">Google Cloud Firestore Database</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Project: <code className="bg-white/10 px-1.5 py-0.5 rounded text-amber-300 font-mono text-[11px]">{cloudStatus.projectId}</code> • Database: <code className="bg-white/10 px-1.5 py-0.5 rounded text-slate-200 font-mono text-[11px]">(default)</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleSyncToCloud}
              disabled={syncingCloud}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-spin' : ''}`} />
              <span>{syncingCloud ? 'Syncing to Firestore...' : 'Sync All Data to Firestore'}</span>
            </button>
            <button
              type="button"
              onClick={handlePullFromCloud}
              disabled={syncingCloud}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Pull latest data from Cloud Firestore"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Pull Data</span>
            </button>
          </div>
        </div>

        {cloudSyncResult && (
          <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
            cloudSyncResult.success ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-200' : 'bg-rose-500/10 border border-rose-500/30 text-rose-200'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <div className="flex-1">
              <p className="font-semibold">{cloudSyncResult.message}</p>
              {cloudSyncResult.success && (
                <p className="text-[11px] text-emerald-300/80 mt-1">
                  💡 In your Firebase Web Console tab, click <b>Refresh</b> and you will see your collections (<code className="font-mono text-white">students</code>, <code className="font-mono text-white">teachers</code>, <code className="font-mono text-white">admin_users</code>, <code className="font-mono text-white">guardians</code>, <code className="font-mono text-white">notices</code>) populated with all live documents!
                </p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="text-slate-400 block text-[10px]">Cloud Connection</span>
            <span className="font-semibold text-emerald-400">Live Active</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="text-slate-400 block text-[10px]">Security Rules</span>
            <span className="font-semibold text-amber-300">Test Mode (Read/Write)</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="text-slate-400 block text-[10px]">Realtime Mirror</span>
            <span className="font-semibold text-blue-300">Auto-push Enabled</span>
          </div>
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
            <span className="text-slate-400 block text-[10px]">Last Cloud Sync</span>
            <span className="font-semibold text-slate-200 truncate block">{cloudStatus.lastSyncedAt || 'Click Sync to upload'}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-surface rounded-2xl p-6 sm:p-8 border border-slate-border shadow-card space-y-6 text-xs">
        {/* LOGO & BRANDING CUSTOMIZATION SECTION */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-royal" />
            <span>{t('institutionLogo')}</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">{t('currentLogo')}</span>
              <div className="w-20 h-20 p-2 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-center">
                <LogoEmblem sizeClass="w-16 h-16" idSuffix="settings-preview" customLogoUrl={customLogoPreview || undefined} />
              </div>
            </div>

            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h4 className="font-bold text-navy-950 text-xs">
                  {language === 'bn' ? 'প্রতিষ্ঠানের অফিসিয়াল লোগো আপলোড' : 'Upload Official Institution Brand Emblem'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {language === 'bn' 
                    ? 'পিএনজি, জেপিজি বা এসভিজি ফরম্যাটের লোগো নির্বাচন করুন। এই লোগোটি ড্যাশবোর্ড, মার্কশিট ও ভাউচারে প্রদর্শিত হবে।' 
                    : 'Select a PNG, JPG, or SVG emblem. This custom logo will automatically appear in sidebars, progress cards, and fee receipts.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <label className="px-4 py-2 bg-royal hover:bg-royal-hover text-white rounded-lg font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t('uploadNewLogo')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>

                {customLogoPreview && (
                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('resetDefaultLogo')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* INSTITUTION IDENTITY */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-royal" />
            <span>{t('institutionIdentity')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">{t('institutionName')}</label>
              <input
                type="text"
                value={settings.institutionName}
                onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal text-navy-950 font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">{t('brandTagline')}</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">{t('eiinNumber')}</label>
              <input
                type="text"
                value={settings.eiin}
                onChange={(e) => setSettings({ ...settings, eiin: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono font-semibold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">{t('institutionCode')}</label>
              <input
                type="text"
                value={settings.institutionCode}
                onChange={(e) => setSettings({ ...settings, institutionCode: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono font-semibold"
              />
            </div>
          </div>
        </div>

        {/* LOCALIZATION, TIMEZONE & CURRENCY (Now completely editable!) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-status-green" />
            <span>{t('localizationAndCurrency')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">{t('defaultTimezone')}</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white font-mono"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6:00)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="UTC">UTC (GMT+0:00)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (BST)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">{t('operatingCurrency')}</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white font-bold"
              >
                <option value="BDT (৳)">Bangladeshi Taka (BDT / ৳)</option>
                <option value="USD ($)">US Dollar (USD / $)</option>
                <option value="EUR (€)">Euro (EUR / €)</option>
                <option value="GBP (£)">British Pound (GBP / £)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">{t('academicSessionLabel')}</label>
              <input
                type="text"
                value={settings.activeSession}
                onChange={(e) => setSettings({ ...settings, activeSession: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-bold text-navy-950"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-royal hover:bg-royal-hover text-white rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{t('saveInstitutionConfig')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
