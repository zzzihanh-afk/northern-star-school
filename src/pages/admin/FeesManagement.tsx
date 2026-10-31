import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { formatBDT, toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { PaymentTransaction, Student } from '../../types';
import {
  CreditCard,
  DollarSign,
  Plus,
  Printer,
  Search,
  CheckCircle2,
  Calendar,
  X,
  Receipt,
  FileCheck,
  Building,
  Clock,
  AlertCircle,
  Check
} from 'lucide-react';
import { LogoEmblem } from '../../components/brand/Logo';

export const FeesManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  // Role guard: Students, Guardians, and Teachers must not access the admin accountant desk
  if (user?.role === 'student') {
    return <Navigate to="/student/fees" replace />;
  }
  if (user?.role === 'guardian') {
    return <Navigate to="/parent/fees" replace />;
  }
  if (user?.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  }

  const students = dataService.getStudents();
  const [payments, setPayments] = useState<PaymentTransaction[]>(dataService.getPayments());
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Tabs & Search State
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync payments when event fires or storage changes
  useEffect(() => {
    const handleSync = () => {
      setPayments(dataService.getPayments());
    };
    window.addEventListener('fee-payments-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('fee-payments-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Form State
  const [studentId, setStudentId] = useState<string>('stu-rafiq');
  const [amount, setAmount] = useState<number>(3500);
  const [method, setMethod] = useState<'cash' | 'bank_transfer' | 'bkash' | 'nagad'>('cash');
  const [transRef, setTransRef] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('Monthly Tuition Fee');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === studentId);
    if (!st) return;

    // Manually collected payments at cash desk are directly marked approved
    const newPayment = dataService.recordPayment({
      studentId: st.id,
      studentName: st.fullName,
      classInfo: st.className,
      amount,
      paymentMethod: method,
      paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      transactionRef: transRef || undefined,
      collectedBy: 'Accounts Officer',
      remarks,
      status: 'approved',
      approvedBy: user?.displayName || 'Accounts Officer',
      approvedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    setPayments(dataService.getPayments());
    setShowCollectModal(false);
    setSelectedReceipt(newPayment);
    setActionAlert({
      type: 'success',
      message: language === 'bn' 
        ? `৳ ${toLocaleNumber(newPayment.amount, 'bn')} ফি সরাসরি আদায় ও অনুমোদন সম্পন্ন হয়েছে (ভাউচার: ${newPayment.voucherNo})।`
        : `Fee payment of ৳ ${newPayment.amount} collected & verified (Voucher: ${newPayment.voucherNo}).`
    });
    setTimeout(() => setActionAlert(null), 5000);
  };

  const handleApprovePayment = (paymentId: string) => {
    const approved = dataService.approvePayment(paymentId, user?.displayName || 'Accounts Admin');
    if (approved) {
      setPayments(dataService.getPayments());
      setActionAlert({
        type: 'success',
        message: language === 'bn' 
          ? `ভাউচার ${approved.voucherNo} (${approved.studentName}) সফলভাবে অনুমোদিত হয়েছে! শিক্ষার্থী ও অভিভাবক পোর্টালে স্ট্যাটাস এখন পরিশোধিত (PAID)।` 
          : `Payment ${approved.voucherNo} for ${approved.studentName} approved! Marked as PAID in student and parent portals.`
      });
      setTimeout(() => setActionAlert(null), 6000);
    }
  };

  const handleRejectPayment = (paymentId: string) => {
    const p = payments.find(item => item.id === paymentId);
    const reason = window.prompt(
      language === 'bn' ? 'বাতিল করার কারণ লিখুন (ঐচ্ছিক):' : 'Enter rejection reason (optional):', 
      language === 'bn' ? 'এমএফএস ট্রানজ্যাকশন আইডি ও অর্থের পরিমাণ মেলেনি' : 'MFS transaction ID verification failed'
    );
    if (reason === null) return; // User cancelled prompt

    const rejected = dataService.rejectPayment(paymentId, reason || 'Payment Verification Rejected');
    if (rejected) {
      setPayments(dataService.getPayments());
      setActionAlert({
        type: 'error',
        message: language === 'bn' 
          ? `পেমেন্ট ভাউচার ${rejected.voucherNo} বাতিল করা হয়েছে। সংশ্লিষ্ট ইনভয়েস বকেয়া অবস্থায় ফিরিয়ে দেওয়া হয়েছে।` 
          : `Payment ${rejected.voucherNo} was rejected. Invoice reverted to Due status.`
      });
      setTimeout(() => setActionAlert(null), 6000);
    }
  };

  const approvedPayments = payments.filter(p => p.status === 'approved');
  const pendingPayments = payments.filter(p => p.status === 'pending');
  const totalCollected = approvedPayments.reduce((acc, p) => acc + p.amount, 0);
  const totalPending = pendingPayments.reduce((acc, p) => acc + p.amount, 0);

  const filteredPayments = payments.filter(p => {
    if (activeTab === 'pending' && p.status !== 'pending') return false;
    if (activeTab === 'approved' && p.status !== 'approved') return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.studentName.toLowerCase().includes(term) ||
        p.voucherNo.toLowerCase().includes(term) ||
        p.classInfo.toLowerCase().includes(term) ||
        (p.transactionRef && p.transactionRef.toLowerCase().includes(term))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-950 tracking-tight">
            {t('feesManagementTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn' 
              ? 'শিক্ষার্থী ও অভিভাবকদের অনলাইন ফি যাচাই, অনুমোদন এবং ক্যাশ কাউন্টার ভাউচার পরিচালনা করুন।' 
              : 'Review online fee payments, confirm pending submissions, and manage official BDT money receipts.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCollectModal(true)}
          className="px-4 py-2 text-xs font-semibold bg-status-orange hover:bg-amber-600 text-white rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t('collectFeePayment')}</span>
        </button>
      </div>

      {/* ACTION ALERT NOTIFICATION */}
      {actionAlert && (
        <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in ${
          actionAlert.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-300 text-status-green' 
            : 'bg-rose-50 border border-rose-300 text-status-red'
        }`}>
          {actionAlert.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{actionAlert.message}</span>
        </div>
      )}

      {/* FINANCIAL SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Verified Collections */}
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-muted uppercase">{t('totalCollections')}</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-status-green flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-navy-950 mt-2">
            {formatBDT(totalCollected, language)}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === 'bn' 
              ? `${toLocaleNumber(approvedPayments.length, 'bn')} টি অনুমোদিত ও পরিশোধিত লেনদেন` 
              : `${approvedPayments.length} verified & cleared transactions`}
          </p>
        </div>

        {/* Pending Approval Requests */}
        <div className={`rounded-xl p-5 border shadow-card transition-all ${
          pendingPayments.length > 0 
            ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300/60' 
            : 'bg-surface border-slate-border'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-900 uppercase">
                {language === 'bn' ? 'অনুমোদন অপেক্ষমাণ (পেন্ডিং)' : 'Pending Verification'}
              </span>
              {pendingPayments.length > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  {pendingPayments.length} Action
                </span>
              )}
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-status-orange flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-amber-950 mt-2">
            {formatBDT(totalPending, language)}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <p className="text-[11px] text-amber-800">
              {language === 'bn' 
                ? `${toLocaleNumber(pendingPayments.length, 'bn')} টি পেমেন্ট অ্যাডমিন অনুমোদনের অপেক্ষায়` 
                : `${pendingPayments.length} submissions awaiting admin approval`}
            </p>
            {pendingPayments.length > 0 && activeTab !== 'pending' && (
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className="text-[11px] font-bold text-royal hover:underline"
              >
                {language === 'bn' ? 'দেখুন' : 'Review'} &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Active Vouchers & Gateways */}
        <div className="bg-surface rounded-xl p-5 border border-slate-border shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-muted uppercase">{t('paymentGateways')}</span>
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-status-violet flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-pink-100 text-pink-700">bKash</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-700">Nagad</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">Cash / Bank</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {language === 'bn' ? 'ম্যানুয়াল ও অনলাইন দ্বি-স্তরীয় ভেরিফিকেশন' : 'Two-step institutional verification system'}
          </p>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div className="bg-surface rounded-xl p-4 border border-slate-border shadow-card flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'bn' ? 'শিক্ষার্থী, ভাউচার বা ট্রানজ্যাকশন আইডি খুঁজুন...' : 'Search by student, voucher, or TrxID...'}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-royal/20 focus:border-royal"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold w-full md:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'all' 
                ? 'bg-white text-navy-950 shadow-xs font-bold' 
                : 'text-slate-600 hover:text-navy-950'
            }`}
          >
            <span>{language === 'bn' ? 'সকল লেনদেন' : 'All Transactions'}</span>
            <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700">
              {payments.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'pending' 
                ? 'bg-amber-500 text-white shadow-xs font-bold' 
                : 'text-slate-600 hover:text-amber-800'
            }`}
          >
            <span>{language === 'bn' ? 'অনুমোদন অপেক্ষমাণ' : 'Pending Approval'}</span>
            {pendingPayments.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                activeTab === 'pending' ? 'bg-white text-amber-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {pendingPayments.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'approved' 
                ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            <span>{language === 'bn' ? 'অনুমোদিত ও পরিশোধিত' : 'Verified & Paid'}</span>
            <span className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] ${
              activeTab === 'approved' ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-700'
            }`}>
              {approvedPayments.length}
            </span>
          </button>
        </div>
      </div>

      {/* RECENT TRANSACTIONS TABLE */}
      <div className="bg-surface rounded-xl border border-slate-border shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-navy-950">
              {activeTab === 'pending' 
                ? (language === 'bn' ? 'অনুমোদনের জন্য অপেক্ষমাণ পেমেন্ট তালিকা' : 'Payments Awaiting Admin Approval')
                : t('paymentTransactionsAndVouchers')}
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-bold">
              {filteredPayments.length} {language === 'bn' ? 'টি' : 'records'}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            {language === 'bn' ? 'পেন্ডিং পেমেন্টগুলো অনুমোদন করলে শিক্ষার্থী ও অভিভাবক পোর্টালে পেইড দেখাবে।' : 'Approving payments confirms fee clearance across student and parent portals.'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">{t('voucherNo')}</th>
                <th className="py-3 px-4 font-semibold">{t('studentName')}</th>
                <th className="py-3 px-4 font-semibold">{t('classOrSection')}</th>
                <th className="py-3 px-4 font-semibold">{t('amountBDT')}</th>
                <th className="py-3 px-4 font-semibold">{t('paymentMode')}</th>
                <th className="py-3 px-4 font-semibold">{t('collectionDate')}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="py-3 px-4 font-semibold text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    {language === 'bn' ? 'কোনো লেনদেন রেকর্ড পাওয়া যায়নি।' : 'No payment records match the filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-royal">
                      {p.voucherNo}
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-950">
                      {p.studentName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {language === 'bn' ? p.classInfo.replace('Class', 'শ্রেণি').replace('Science', 'বিজ্ঞান').replace('Arts', 'মানবিক') : p.classInfo}
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-950 font-mono">
                      {formatBDT(p.amount, language)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-slate-100 text-slate-700">
                        {p.paymentMethod.replace('_', ' ')}
                      </span>
                      {p.transactionRef && (
                        <span className="block text-[10px] text-slate-500 font-mono mt-0.5">Ref: {p.transactionRef}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {p.paymentDate}
                    </td>
                    <td className="py-3 px-4">
                      {p.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-status-green flex items-center gap-1 w-max border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'bn' ? 'অনুমোদিত ও পরিশোধিত' : 'Verified & Paid'}</span>
                        </span>
                      ) : p.status === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-status-red flex items-center gap-1 w-max border border-rose-200">
                          <X className="w-3 h-3" />
                          <span>{language === 'bn' ? 'বাতিল' : 'Rejected'}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 w-max animate-pulse">
                          <Clock className="w-3 h-3 text-status-orange" />
                          <span>{language === 'bn' ? 'অনুমোদন অপেক্ষমাণ' : 'Pending Approval'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprovePayment(p.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-xs transition-all"
                              title={language === 'bn' ? 'পেমেন্ট অনুমোদন করুন' : 'Approve payment'}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'অনুমোদন করুন' : 'Approve'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRejectPayment(p.id)}
                              className="px-2 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-status-red border border-rose-200 flex items-center gap-1 transition-all"
                              title={language === 'bn' ? 'পেমেন্ট বাতিল করুন' : 'Reject payment'}
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>{language === 'bn' ? 'বাতিল' : 'Reject'}</span>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(p)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-royal hover:bg-royal hover:text-white transition-all inline-flex items-center gap-1"
                          title="Print Official Money Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{t('printVoucher')}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COLLECT FEE MODAL */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-border">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <Plus className="w-4 h-4 text-status-orange" />
                <span>{t('collectFeePayment')}</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setShowCollectModal(false)} 
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'শিক্ষার্থী নির্বাচন করুন *' : 'Select Student *'}
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.fullName} ({s.rollNo} • {s.className})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'আদায়ের পরিমাণ (টাকা / ৳) *' : 'Collection Amount (BDT / ৳) *'}
                </label>
                <input
                  type="number"
                  required
                  min="100"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-bold text-navy-950 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম *' : 'Payment Method *'}
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal bg-white"
                >
                  <option value="cash">{language === 'bn' ? 'ক্যাশ কাউন্টার' : 'Cash Counter'}</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="bank_transfer">{language === 'bn' ? 'ব্যাংক ট্রান্সফার / পে অর্ডার' : 'Bank Transfer / Pay Order'}</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'ট্রানজ্যাকশন আইডি / স্লিপ নং' : 'Transaction Ref / Slip No'}
                </label>
                <input
                  type="text"
                  value={transRef}
                  onChange={(e) => setTransRef(e.target.value)}
                  placeholder="e.g. BK-991208123 or Bank Slip #44"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {language === 'bn' ? 'ফি বিবরণী / মন্তব্য' : 'Fee Purpose / Remarks'}
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Monthly Tuition Fee (April 2025)"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-status-orange hover:bg-amber-600 text-white font-bold rounded-lg shadow-sm"
                >
                  {language === 'bn' ? 'আদায় ও অনুমোদন সংরক্ষণ করুন' : 'Confirm & Collect Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL MONEY RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col p-6 shadow-2xl border border-slate-border my-6 print:max-h-none print:shadow-none print:border-none print:p-0">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print shrink-0">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-royal" />
                <span>{t('moneyReceiptTitle')}</span>
              </span>
              <div className="flex items-center gap-2">
                {selectedReceipt.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => {
                      handleApprovePayment(selectedReceipt.id);
                      setSelectedReceipt({ ...selectedReceipt, status: 'approved' });
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 shadow-xs transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'অনুমোদন করুন' : 'Approve Now'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-royal text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-royal-hover shadow-xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('printVoucher')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE VOUCHER LAYOUT */}
            <div className="overflow-y-auto mt-4 print:overflow-visible">
              <div id="printable-document" className="p-5 border-2 border-navy-900 rounded-xl bg-white text-xs print:border-none print:p-0">
                <div className="text-center pb-3 border-b-2 border-navy-900 flex flex-col items-center">
                  <LogoEmblem sizeClass="w-12 h-12 mb-1" idSuffix="money-voucher" />
                  <h3 className="font-serif font-black tracking-wider text-base text-navy-950 uppercase">
                    {t('brandName')}
                  </h3>
                  <p className="text-[10px] text-slate-500">{t('dhakaBangladesh')} • {t('tagline')}</p>
                  <span className={`mt-1.5 px-3 py-0.5 text-white text-[10px] font-bold rounded uppercase ${
                    selectedReceipt.status === 'pending' ? 'bg-amber-600' : 'bg-navy-900'
                  }`}>
                    {selectedReceipt.status === 'pending'
                      ? (language === 'bn' ? 'সাময়িক পেমেন্ট স্লিপ (অনুমোদন অপেক্ষমাণ)' : 'PROVISIONAL PAYMENT SLIP (PENDING APPROVAL)')
                      : t('moneyReceiptTitle')}
                  </span>
                </div>

                {/* Status Notice inside Voucher */}
                <div className={`mt-2.5 p-2 rounded-lg text-center border ${
                  selectedReceipt.status === 'pending'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-status-green'
                }`}>
                  <div className="flex items-center justify-center gap-1.5 font-bold text-[11px] uppercase tracking-wider">
                    {selectedReceipt.status === 'pending' ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-status-orange" />
                        <span>{language === 'bn' ? 'স্ট্যাটাস: অ্যাডমিন অনুমোদন অপেক্ষমাণ (পেন্ডিং)' : 'STATUS: PENDING ADMIN APPROVAL'}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-status-green" />
                        <span>{language === 'bn' ? 'স্ট্যাটাস: অনুমোদিত ও সম্পূর্ণ পরিশোধিত' : 'STATUS: VERIFIED & OFFICIALLY PAID'}</span>
                      </>
                    )}
                  </div>
                  <p className="text-[10px] opacity-90 mt-0.5">
                    {selectedReceipt.status === 'pending'
                      ? (language === 'bn' ? 'অনলাইন ফি জমাদান রসিদ। অ্যাডমিন অনুমোদন সাপেক্ষে চূড়ান্ত পরিশোধ হবে।' : 'Online fee submission receipt. Marked as Paid upon administrator confirmation.')
                      : (language === 'bn' 
                          ? `হিসাব শাখা কর্তৃক অনুমোদিত (${selectedReceipt.approvedBy || 'Accounts Officer'} • ${selectedReceipt.approvedDate || selectedReceipt.paymentDate})` 
                          : `Verified and officially cleared by Accounts Administration (${selectedReceipt.approvedBy || 'Accounts Officer'} • ${selectedReceipt.approvedDate || selectedReceipt.paymentDate})`)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">{t('voucherNo')}</span>
                    <span className="font-mono font-bold text-royal">{selectedReceipt.voucherNo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px] uppercase">{t('collectionDate')}</span>
                    <span className="font-medium text-navy-950">{selectedReceipt.paymentDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">{t('studentName')}</span>
                    <span className="font-bold text-navy-950">{selectedReceipt.studentName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px] uppercase">{t('classOrSection')}</span>
                    <span className="font-medium text-navy-950">{selectedReceipt.classInfo}</span>
                  </div>
                </div>

                <div className="py-3 border-b border-slate-200 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">{language === 'bn' ? 'ফি উদ্দেশ্য:' : 'Payment Purpose:'}</span>
                    <span className="font-semibold text-navy-950">{selectedReceipt.remarks || (language === 'bn' ? 'মাসিক বেতন' : 'Tuition Fee')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{language === 'bn' ? 'পদ্ধতি:' : 'Payment Method:'}</span>
                    <span className="font-semibold uppercase text-navy-950">{selectedReceipt.paymentMethod.replace('_', ' ')}</span>
                  </div>
                  {selectedReceipt.transactionRef && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">{language === 'bn' ? 'ট্রানজ্যাকশন আইডি:' : 'Transaction ID / Ref:'}</span>
                      <span className="font-mono text-navy-950">{selectedReceipt.transactionRef}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-sm font-bold border-t border-slate-100">
                    <span className="text-navy-950">{language === 'bn' ? 'মোট প্রাপ্ত অর্থ:' : 'Total Amount Received:'}</span>
                    <span className="text-status-green font-mono font-bold">{formatBDT(selectedReceipt.amount, language)}</span>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <div className="text-center">
                    <div className="w-28 border-t border-slate-800 pt-1" />
                    <span>{language === 'bn' ? 'জমাদানকারীর স্বাক্ষর' : 'Depositor Signature'}</span>
                  </div>
                  <div className="text-center">
                    <div className="w-28 border-t border-slate-800 pt-1" />
                    <span>{t('authorizedCashier')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
