import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { dataService } from '../../services/dataService';
import { AdminUserAccount, Guardian, Student, UserRole } from '../../types';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Search,
  Plus,
  Key,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Phone,
  Mail,
  Building,
  GraduationCap,
  BookOpen,
  CreditCard,
  Layers,
  Lock,
  UserCheck,
  Briefcase,
  MapPin,
  Sparkles,
  Database
} from 'lucide-react';

export const UserManagementPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'super_admin';

  // Active Tab: 'admins' | 'guardians'
  const [activeTab, setActiveTab] = useState<'admins' | 'guardians'>('admins');

  // Lists from dataService
  const [adminUsers, setAdminUsers] = useState<AdminUserAccount[]>(() => dataService.getAdminUsers());
  const [guardians, setGuardians] = useState<Guardian[]>(() => dataService.getGuardians());
  const [students, setStudents] = useState<Student[]>(() => dataService.getStudents());

  // Search & Filters
  const [adminSearch, setAdminSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [guardianSearch, setGuardianSearch] = useState('');

  // Password visibility map (id -> boolean)
  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});

  // Modals state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUserAccount | null>(null);

  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [editingGuardian, setEditingGuardian] = useState<Guardian | null>(null);

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [syncingCloud, setSyncingCloud] = useState(false);

  const handleCloudSync = async () => {
    setSyncingCloud(true);
    try {
      const res = await dataService.syncAllToFirestore();
      if (res.success) {
        showToast(`Cloud Firestore Synced: ${res.syncedCount} records pushed successfully!`);
      } else {
        showToast(res.error || 'Firestore sync failed', 'error');
      }
    } catch {
      showToast('Error syncing to Firestore', 'error');
    } finally {
      setSyncingCloud(false);
    }
  };

  // Form states for Admin
  const [adminForm, setAdminForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'institution_admin' as UserRole,
    password: '',
    department: '',
    designation: '',
    notes: '',
    isActive: true,
  });

  // Form states for Guardian
  const [guardianForm, setGuardianForm] = useState({
    fullName: '',
    relation: 'Father' as 'Father' | 'Mother' | 'Guardian',
    email: '',
    phone: '',
    occupation: '',
    address: 'Dhaka, Bangladesh',
    password: '',
    linkedStudentIds: [] as string[],
    isActive: true,
  });

  // Refresh lists
  const refreshData = () => {
    setAdminUsers(dataService.getAdminUsers());
    setGuardians(dataService.getGuardians());
    setStudents(dataService.getStudents());
  };

  useEffect(() => {
    const handleUpdate = () => refreshData();
    window.addEventListener('guardian-children-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('guardian-children-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const togglePasswordVisibility = (id: string) => {
    setRevealedPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Open Admin Add/Edit Modal
  const handleOpenAdminModal = (item?: AdminUserAccount) => {
    if (item) {
      setEditingAdmin(item);
      setAdminForm({
        fullName: item.fullName,
        email: item.email,
        phone: item.phone || '',
        role: item.role,
        password: item.password,
        department: item.department || '',
        designation: item.designation || '',
        notes: item.notes || '',
        isActive: item.isActive,
      });
    } else {
      setEditingAdmin(null);
      setAdminForm({
        fullName: '',
        email: '',
        phone: '',
        role: 'institution_admin',
        password: `admin${Math.floor(100 + Math.random() * 900)}`,
        department: 'Central Administration',
        designation: 'Institutional Officer',
        notes: '',
        isActive: true,
      });
    }
    setShowAdminModal(true);
  };

  // Save Admin Account
  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.fullName.trim() || !adminForm.email.trim() || !adminForm.password.trim()) {
      showToast('Please provide full name, email, and password.', 'error');
      return;
    }

    if (editingAdmin) {
      dataService.updateAdminUser(editingAdmin.id, {
        fullName: adminForm.fullName.trim(),
        email: adminForm.email.trim().toLowerCase(),
        phone: adminForm.phone.trim(),
        role: adminForm.role,
        password: adminForm.password.trim(),
        department: adminForm.department.trim(),
        designation: adminForm.designation.trim(),
        notes: adminForm.notes.trim(),
        isActive: adminForm.isActive,
      });
      showToast(`Updated admin account: ${adminForm.fullName} (${getRoleLabel(adminForm.role)})`);
    } else {
      dataService.addAdminUser({
        fullName: adminForm.fullName.trim(),
        email: adminForm.email.trim().toLowerCase(),
        phone: adminForm.phone.trim(),
        role: adminForm.role,
        password: adminForm.password.trim(),
        department: adminForm.department.trim(),
        designation: adminForm.designation.trim(),
        notes: adminForm.notes.trim(),
        isActive: adminForm.isActive,
      });
      showToast(`Created new admin account for ${adminForm.fullName} with role ${getRoleLabel(adminForm.role)}`);
    }

    refreshData();
    setShowAdminModal(false);
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove administrator account: ${name}?`)) {
      dataService.deleteAdminUser(id);
      showToast(`Removed administrator account: ${name}`);
      refreshData();
    }
  };

  // Open Guardian Add/Edit Modal
  const handleOpenGuardianModal = (item?: Guardian) => {
    if (item) {
      setEditingGuardian(item);
      setGuardianForm({
        fullName: item.fullName,
        relation: item.relation,
        email: item.email,
        phone: item.phone,
        occupation: item.occupation,
        address: item.address,
        password: item.password || 'parent123',
        linkedStudentIds: item.linkedStudentIds || [],
        isActive: item.isActive !== false,
      });
    } else {
      setEditingGuardian(null);
      setGuardianForm({
        fullName: '',
        relation: 'Father',
        email: '',
        phone: '+880 1',
        occupation: 'Professional',
        address: 'Dhaka, Bangladesh',
        password: `par${Math.floor(100 + Math.random() * 900)}`,
        linkedStudentIds: [],
        isActive: true,
      });
    }
    setShowGuardianModal(true);
  };

  // Save Guardian Account
  const handleSaveGuardian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guardianForm.fullName.trim() || !guardianForm.email.trim() || !guardianForm.password.trim()) {
      showToast('Please provide parent full name, email, and password.', 'error');
      return;
    }

    if (editingGuardian) {
      dataService.updateGuardian(editingGuardian.id, {
        fullName: guardianForm.fullName.trim(),
        relation: guardianForm.relation,
        email: guardianForm.email.trim().toLowerCase(),
        phone: guardianForm.phone.trim(),
        occupation: guardianForm.occupation.trim(),
        address: guardianForm.address.trim(),
        password: guardianForm.password.trim(),
        linkedStudentIds: guardianForm.linkedStudentIds,
        isActive: guardianForm.isActive,
      });
      showToast(`Updated parent account for: ${guardianForm.fullName}`);
    } else {
      dataService.addGuardian({
        fullName: guardianForm.fullName.trim(),
        relation: guardianForm.relation,
        email: guardianForm.email.trim().toLowerCase(),
        phone: guardianForm.phone.trim(),
        occupation: guardianForm.occupation.trim(),
        address: guardianForm.address.trim(),
        password: guardianForm.password.trim(),
        linkedStudentIds: guardianForm.linkedStudentIds,
        isActive: guardianForm.isActive,
      });
      showToast(`Successfully created parent account for ${guardianForm.fullName} with password.`);
    }

    refreshData();
    setShowGuardianModal(false);
  };

  const handleDeleteGuardian = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove parent account: ${name}?`)) {
      dataService.deleteGuardian(id);
      showToast(`Removed parent account: ${name}`);
      refreshData();
    }
  };

  const toggleStudentLink = (studentId: string) => {
    setGuardianForm(prev => {
      const exists = prev.linkedStudentIds.includes(studentId);
      if (exists) {
        return { ...prev, linkedStudentIds: prev.linkedStudentIds.filter(id => id !== studentId) };
      } else {
        return { ...prev, linkedStudentIds: [...prev.linkedStudentIds, studentId] };
      }
    });
  };

  // Helper for role badge labels & styles
  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'Super Administrator';
      case 'institution_admin': return 'Institution Admin';
      case 'principal': return 'Principal / Head';
      case 'accountant': return 'Accountant / Finance';
      case 'librarian': return 'Chief Librarian';
      case 'receptionist': return 'Front Desk / Admissions';
      case 'teacher': return 'Senior Faculty';
      case 'guardian': return 'Parent / Guardian';
      case 'student': return 'Student';
      default: return role;
    }
  };

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'institution_admin': return 'bg-blue-100 text-royal border-blue-300';
      case 'principal': return 'bg-purple-100 text-status-violet border-purple-300';
      case 'accountant': return 'bg-emerald-100 text-status-green border-emerald-300';
      case 'librarian': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'receptionist': return 'bg-cyan-100 text-cyan-800 border-cyan-300';
      case 'teacher': return 'bg-teal-100 text-teal-800 border-teal-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  // Filtered lists
  const filteredAdmins = adminUsers.filter(a => {
    const matchesSearch =
      a.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (a.department && a.department.toLowerCase().includes(adminSearch.toLowerCase())) ||
      (a.designation && a.designation.toLowerCase().includes(adminSearch.toLowerCase()));
    const matchesRole = roleFilter === 'all' || a.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredGuardians = guardians.filter(g => {
    const q = guardianSearch.toLowerCase();
    const matchesBasic =
      g.fullName.toLowerCase().includes(q) ||
      g.email.toLowerCase().includes(q) ||
      g.phone.includes(q) ||
      g.occupation.toLowerCase().includes(q);

    // Also match if any of the linked students match
    const linkedNames = (g.linkedStudentIds || [])
      .map(id => students.find(s => s.id === id)?.fullName.toLowerCase() || '')
      .join(' ');

    return matchesBasic || linkedNames.includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 ${
            notification.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 text-white'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
              System User & Role Management
            </h1>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
              Super Admin Authority
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            Create administrators with designated institutional roles, manage parents' accounts, set system passwords, and configure student access linkages.
          </p>
        </div>

        {/* Action Button based on Active Tab */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCloudSync}
            disabled={syncingCloud}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Sync all accounts directly to Cloud Firestore"
          >
            <Database className={`w-3.5 h-3.5 ${syncingCloud ? 'animate-spin' : ''}`} />
            <span>{syncingCloud ? 'Syncing...' : 'Sync to Firestore'}</span>
          </button>

          {activeTab === 'admins' ? (
            <button
              type="button"
              onClick={() => handleOpenAdminModal()}
              className="px-4 py-2 bg-royal hover:bg-royal-hover text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Admin / Staff Account</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleOpenGuardianModal()}
              className="px-4 py-2 bg-royal hover:bg-royal-hover text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Parent Account</span>
            </button>
          )}
        </div>
      </div>

      {/* TOP STAT METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-royal flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Staff & Admins
            </p>
            <p className="text-lg font-bold text-navy-950 mt-0.5 font-mono">
              {adminUsers.length}
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-status-violet flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Parents / Guardians
            </p>
            <p className="text-lg font-bold text-navy-950 mt-0.5 font-mono">
              {guardians.length}
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-status-green flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Enrolled Students
            </p>
            <p className="text-lg font-bold text-navy-950 mt-0.5 font-mono">
              {students.length}
            </p>
          </div>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Security Standard
            </p>
            <p className="text-xs font-bold text-navy-950 mt-1">
              Admin Set Passwords
            </p>
          </div>
        </div>
      </div>

      {/* TABS SWITCHER */}
      <div className="flex border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'admins'
              ? 'border-royal text-royal bg-blue-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-navy-950'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Administrators & Staff Roles ({adminUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guardians')}
          className={`flex items-center gap-2 py-3 px-5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'guardians'
              ? 'border-royal text-royal bg-blue-50/40 rounded-t-lg'
              : 'border-transparent text-slate-500 hover:text-navy-950'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Parents & Guardians Accounts ({guardians.length})</span>
        </button>
      </div>

      {/* ===================== TAB 1: ADMINISTRATORS & STAFF ===================== */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          {/* SEARCH & ROLE FILTER BAR */}
          <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, department..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal font-medium"
              >
                <option value="all">All Roles</option>
                <option value="institution_admin">Institution Admin</option>
                <option value="principal">Principal</option>
                <option value="accountant">Accountant</option>
                <option value="librarian">Chief Librarian</option>
                <option value="receptionist">Receptionist / Front Desk</option>
                <option value="teacher">Senior Teacher</option>
              </select>
            </div>
          </div>

          {/* ADMINS TABLE */}
          <div className="bg-surface rounded-xl border border-slate-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Administrator / Staff</th>
                    <th className="py-3 px-4 font-semibold">Assigned Role</th>
                    <th className="py-3 px-4 font-semibold">Department & Title</th>
                    <th className="py-3 px-4 font-semibold">Contact Email & Phone</th>
                    <th className="py-3 px-4 font-semibold">Set Password</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAdmins.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No administrators found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredAdmins.map((adm) => {
                      const isRevealed = revealedPasswords[adm.id];
                      return (
                        <tr key={adm.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {adm.fullName.charAt(0)}
                              </div>
                              <div>
                                <span className="font-bold text-navy-950 block">
                                  {adm.fullName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {adm.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeClass(adm.role)}`}>
                              {getRoleLabel(adm.role)}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 block">
                              {adm.designation || 'Staff'}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              {adm.department || 'Administration'}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="space-y-0.5 font-mono text-[11px]">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{adm.email}</span>
                              </div>
                              {adm.phone && (
                                <div className="flex items-center gap-1.5 text-slate-500">
                                  <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span>{adm.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-xs">
                              <span className="font-bold text-slate-800">
                                {isRevealed ? adm.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(adm.id)}
                                className="text-slate-400 hover:text-navy-900"
                                title={isRevealed ? 'Hide Password' : 'Show Password'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              adm.isActive
                                ? 'bg-emerald-100 text-status-green'
                                : 'bg-rose-100 text-status-red'
                            }`}>
                              {adm.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenAdminModal(adm)}
                                className="p-1.5 text-slate-500 hover:text-royal hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit Role & Password"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAdmin(adm.id, adm.fullName)}
                                className="p-1.5 text-slate-400 hover:text-status-red hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete Admin"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: PARENTS & GUARDIANS ===================== */}
      {activeTab === 'guardians' && (
        <div className="space-y-4">
          {/* SEARCH BAR */}
          <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by parent name, phone, student name..."
                value={guardianSearch}
                onChange={(e) => setGuardianSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-royal"
              />
            </div>

            <div className="text-xs text-slate-500">
              Showing <strong>{filteredGuardians.length}</strong> registered parent accounts
            </div>
          </div>

          {/* GUARDIANS TABLE */}
          <div className="bg-surface rounded-xl border border-slate-border shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Parent / Guardian</th>
                    <th className="py-3 px-4 font-semibold">Contact Email & Phone</th>
                    <th className="py-3 px-4 font-semibold">Set Password</th>
                    <th className="py-3 px-4 font-semibold">Linked Children (Students)</th>
                    <th className="py-3 px-4 font-semibold">Occupation & Address</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGuardians.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No parent accounts found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredGuardians.map((g) => {
                      const isRevealed = revealedPasswords[g.id];
                      const linkedChildren = (g.linkedStudentIds || [])
                        .map(id => students.find(s => s.id === id))
                        .filter(Boolean) as Student[];

                      return (
                        <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-royal text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                {g.fullName.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-navy-950 block">
                                    {g.fullName}
                                  </span>
                                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                                    {g.relation}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ID: {g.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="space-y-0.5 font-mono text-[11px]">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{g.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{g.phone}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-xs">
                              <span className="font-bold text-slate-800">
                                {isRevealed ? (g.password || 'parent123') : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(g.id)}
                                className="text-slate-400 hover:text-navy-900"
                                title={isRevealed ? 'Hide Password' : 'Show Password'}
                              >
                                {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {linkedChildren.length === 0 ? (
                                <span className="text-[11px] text-slate-400 italic">No linked children</span>
                              ) : (
                                linkedChildren.map(c => (
                                  <span
                                    key={c.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-royal text-[10px] font-semibold"
                                  >
                                    <GraduationCap className="w-3 h-3" />
                                    <span>{c.fullName} ({c.className} • {c.rollNo})</span>
                                  </span>
                                ))
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-medium text-slate-800 block">
                              {g.occupation || 'Guardian'}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-xs">
                              {g.address || 'Dhaka'}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenGuardianModal(g)}
                                className="p-1.5 text-slate-500 hover:text-royal hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit Parent & Password"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteGuardian(g.id, g.fullName)}
                                className="p-1.5 text-slate-400 hover:text-status-red hover:bg-rose-50 rounded-md transition-colors"
                                title="Delete Account"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT ADMIN ACCOUNT ===================== */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-lg w-full border border-slate-border shadow-2xl p-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-royal" />
                <h3 className="text-sm font-bold text-navy-950">
                  {editingAdmin ? 'Edit Administrator / Staff Account' : 'Add New Administrator Account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdmin} className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={adminForm.fullName}
                  onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
                  placeholder="e.g. Md. Habibur Rahman"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    placeholder="e.g. habib.admin@northernstar.edu.bd"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    placeholder="+880 1711 000000"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono"
                  />
                </div>
              </div>

              {/* SPECIFIC ROLE ASSIGNMENT */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Designated Institutional Role *
                </label>
                <select
                  value={adminForm.role}
                  onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as UserRole })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-medium"
                >
                  <option value="institution_admin">Institution Admin (Full Administrative Authority)</option>
                  <option value="principal">Principal (Academic Head & Faculty Leadership)</option>
                  <option value="accountant">Senior Accountant (Fees, Billing & Payment Verification)</option>
                  <option value="librarian">Chief Librarian (Library Books & Resource Desk)</option>
                  <option value="receptionist">Receptionist / Admissions Officer (Applications & Enquiries)</option>
                  <option value="teacher">Faculty / Senior Teacher (Academics, Routine & Attendance)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  The assigned role determines dashboard navigation, permissions, and operational authority.
                </p>
              </div>

              {/* SET PASSWORD */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Account Password (Set by Super Admin) *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    placeholder="Enter login password"
                    className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono font-bold text-royal"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  The user will use this exact password alongside their login email to access the system.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={adminForm.department}
                    onChange={(e) => setAdminForm({ ...adminForm, department: e.target.value })}
                    placeholder="e.g. Accounts & Finance"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={adminForm.designation}
                    onChange={(e) => setAdminForm({ ...adminForm, designation: e.target.value })}
                    placeholder="e.g. Senior Billing Officer"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={adminForm.isActive}
                    onChange={(e) => setAdminForm({ ...adminForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-royal rounded"
                  />
                  <span>Active Account (Permit login access)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white rounded-lg font-bold shadow-sm"
                >
                  {editingAdmin ? 'Save Changes' : 'Create Administrator Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ADD / EDIT PARENT ACCOUNT ===================== */}
      {showGuardianModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-lg w-full border border-slate-border shadow-2xl p-6 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-royal" />
                <h3 className="text-sm font-bold text-navy-950">
                  {editingGuardian ? 'Edit Parent / Guardian Account' : 'Add New Parent Account'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuardianModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuardian} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Parent Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={guardianForm.fullName}
                    onChange={(e) => setGuardianForm({ ...guardianForm, fullName: e.target.value })}
                    placeholder="e.g. Mr. Tariqul Islam"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Relation *
                  </label>
                  <select
                    value={guardianForm.relation}
                    onChange={(e) => setGuardianForm({ ...guardianForm, relation: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-medium"
                  >
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Login Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={guardianForm.email}
                    onChange={(e) => setGuardianForm({ ...guardianForm, email: e.target.value })}
                    placeholder="e.g. tariqul@gmail.com"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={guardianForm.phone}
                    onChange={(e) => setGuardianForm({ ...guardianForm, phone: e.target.value })}
                    placeholder="+880 1711 000000"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono"
                  />
                </div>
              </div>

              {/* SET PARENT PASSWORD */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Parent Account Password (Set by Administrator) *
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={guardianForm.password}
                    onChange={(e) => setGuardianForm({ ...guardianForm, password: e.target.value })}
                    placeholder="e.g. parent123"
                    className="w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono font-bold text-royal"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  The parent can sign in on the portal with their email or phone and this administrator-assigned password.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Occupation
                  </label>
                  <input
                    type="text"
                    value={guardianForm.occupation}
                    onChange={(e) => setGuardianForm({ ...guardianForm, occupation: e.target.value })}
                    placeholder="e.g. Business / Service"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={guardianForm.address}
                    onChange={(e) => setGuardianForm({ ...guardianForm, address: e.target.value })}
                    placeholder="e.g. Uttara, Dhaka"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                  />
                </div>
              </div>

              {/* LINKED CHILDREN SELECTION */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Link Children (Students) to this Parent:
                </label>
                <p className="text-[10px] text-slate-400 mb-2">
                  Select all children belonging to this parent. The parent will be able to review attendance, marks, and pay tuition fees for each linked child.
                </p>

                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1.5 bg-slate-50">
                  {students.map((stu) => {
                    const isChecked = guardianForm.linkedStudentIds.includes(stu.id);
                    return (
                      <label
                        key={stu.id}
                        className={`flex items-center justify-between p-2 rounded-md border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-50 border-royal text-royal font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleStudentLink(stu.id)}
                            className="w-4 h-4 text-royal rounded"
                          />
                          <span>{stu.fullName}</span>
                          <span className="text-[10px] text-slate-400">({stu.className})</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{stu.rollNo}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGuardianModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-royal hover:bg-royal-hover text-white rounded-lg font-bold shadow-sm"
                >
                  {editingGuardian ? 'Save Parent Details' : 'Create Parent Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
