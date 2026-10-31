import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { formatBDT, toLocaleNumber } from '../../i18n/translations';
import { dataService } from '../../services/dataService';
import { PaymentTransaction, FeeInvoice } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  Receipt,
  Printer,
  Calendar,
  DollarSign,
  Layers,
  Clock,
  X,
  FileCheck,
  Users,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Send,
  Lock
} from 'lucide-react';
import { LogoEmblem } from '../../components/brand/Logo';

export const StudentFeesPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const isParent = user?.role === 'guardian';

  const parentChildren = [
    {
      id: 'child-1',
      studentId: 'stu-samiul',
      name: 'Samiul Rahman',
      classInfo: language === 'bn' ? '৭ম শ্রেণি (বিজ্ঞান)' : 'Class 7 (Science)',
      rollNo: 'NSC-2025-0082',
      avatarBg: 'bg-blue-600',
      monthlyTuition: 3000,
      annualFee: 36000,
    },
    {
      id: 'child-2',
      studentId: 'stu-ayesha',
      name: 'Ayesha Rahman',
      classInfo: language === 'bn' ? '১০ম শ্রেণি (মানবিক)' : 'Class 10 (Arts)',
      rollNo: 'NSC-2025-0015',
      avatarBg: 'bg-emerald-600',
      monthlyTuition: 3800,
      annualFee: 45000,
    }
  ];

  const [selectedChildId, setSelectedChildId] = useState<string>('child-1');
  const activeChild = parentChildren.find(c => c.id === selectedChildId) || parentChildren[0];

  const loggedInStudent = !isParent && user?.metadata?.studentId
    ? dataService.getStudentById(user.metadata.studentId)
    : (!isParent && user?.displayName ? dataService.getStudents().find(s => s.fullName.toLowerCase() === user.displayName.toLowerCase()) : null);

  const studentName = isParent ? activeChild.name : (loggedInStudent?.fullName || user?.displayName || 'Rafiq Hasan');
  const studentId = isParent ? activeChild.studentId : (loggedInStudent?.id || 'stu-rafiq');
  const studentClass = isParent ? activeChild.classInfo : (loggedInStudent ? loggedInStudent.className : (language === 'bn' ? '৯ম শ্রেণি (বিজ্ঞান)' : 'Class 9 (Science)'));
  const studentRoll = isParent ? activeChild.rollNo : (loggedInStudent?.rollNo || 'NSC-2025-0147');

  // Dynamic invoices and payments list from reactive dataService
  const [allInvoices, setAllInvoices] = useState<FeeInvoice[]>(() => dataService.getFeeInvoices());
  const [allPayments, setAllPayments] = useState<PaymentTransaction[]>(() => dataService.getPayments());

  useEffect(() => {
    const handleSync = () => {
      setAllInvoices(dataService.getFeeInvoices());
      setAllPayments(dataService.getPayments());
    };
    window.addEventListener('fee-payments-updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('fee-payments-updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const currentInvoices = allInvoices.filter(i => i.studentId === studentId);
  const studentPayments = allPayments.filter(p => 
    p.studentId === studentId || p.studentName.toLowerCase().includes(studentName.toLowerCase())
  );

  // Modals & Payment Form State
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedInvoiceToPay, setSelectedInvoiceToPay] = useState<FeeInvoice | null>(null);
  const [payMethod, setPayMethod] = useState<'bkash' | 'nagad' | 'bank_transfer'>('bkash');
  const [mobileNumber, setMobileNumber] = useState('01712345678');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [paymentSuccessMessage, setPaymentSuccessMessage] = useState<string | null>(null);

  const dueInvoices = currentInvoices.filter(i => i.status === 'due');
  const pendingInvoices = currentInvoices.filter(i => i.status === 'pending');
  const paidInvoices = currentInvoices.filter(i => i.status === 'paid');
  const totalDueAmount = dueInvoices.reduce((acc, i) => acc + i.amount, 0);
  const totalPendingAmount = pendingInvoices.reduce((acc, i) => acc + i.amount, 0);

  const handleOpenPayModal = (inv?: FeeInvoice) => {
    if (inv) {
      setSelectedInvoiceToPay(inv);
    } else if (dueInvoices.length > 0) {
      setSelectedInvoiceToPay(dueInvoices[0]);
    }
    setShowPayModal(true);
  };

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceToPay) return;

    // Record the payment with status 'pending' (requires Admin Approval before becoming Paid)
    const newTransaction = dataService.recordPayment({
      studentId,
      studentName,
      classInfo: studentClass,
      amount: selectedInvoiceToPay.amount,
      paymentMethod: payMethod,
      paymentDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      transactionRef: `${payMethod.toUpperCase()}-${Math.floor(100000000 + Math.random() * 900000000)}`,
      collectedBy: 'Online Portal Gateway',
      remarks: selectedInvoiceToPay.title,
      invoiceId: selectedInvoiceToPay.id,
      status: 'pending',
    });

    setAllInvoices(dataService.getFeeInvoices());
    setAllPayments(dataService.getPayments());

    setShowPayModal(false);
    setSelectedInvoiceToPay(null);
    setSelectedReceipt(newTransaction);
    setPaymentSuccessMessage(language === 'bn' 
      ? `৳ ${toLocaleNumber(newTransaction.amount, 'bn')} ফি জমা দেওয়া হয়েছে! বর্তমানে এটি অ্যাডমিন অনুমোদনের অপেক্ষায় (পেন্ডিং) রয়েছে। প্রমাণের জন্য সাময়িক মানি রসিদ ইস্যু করা হয়েছে।` 
      : `Payment of ৳ ${newTransaction.amount} submitted successfully! Status is PENDING verification by Admin. Provisional receipt issued as proof.`);
    setTimeout(() => setPaymentSuccessMessage(null), 6000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-navy-950 tracking-tight flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-royal" />
              <span>{isParent ? t('childFeesStatement') : t('myFeesStatement')}</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-50 text-royal border border-blue-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>{isParent ? (language === 'bn' ? 'অভিভাবক পোর্টাল' : 'Guardian Portal') : (language === 'bn' ? 'শিক্ষার্থী খতিয়ান' : 'Student Portal')}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-muted mt-0.5">
            {language === 'bn' 
              ? 'সন্তানের মাসিক বেতন ও পরীক্ষার ফি পরিশোধের অবস্থা দেখুন এবং বিকাশ বা নগদ দিয়ে সরাসরি ফি পরিশোধ করুন।' 
              : 'Review tuition fees payment status and pay upcoming fees securely via bKash, Nagad, or cards.'}
          </p>
        </div>

        {/* Student Identification Pill */}
        <div className="flex items-center gap-3 bg-surface border border-slate-border px-4 py-2 rounded-xl shadow-xs">
          <div className="w-9 h-9 rounded-full bg-navy-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
            {studentName.charAt(0)}
          </div>
          <div className="text-left text-xs">
            <span className="font-bold text-navy-950 block">{studentName}</span>
            <span className="text-[11px] text-slate-500">{studentRoll} • {studentClass}</span>
          </div>
        </div>
      </div>

      {/* GUARDIAN: CHILD SWITCHER TABS */}
      {isParent && (
        <div className="bg-surface rounded-2xl p-4 border border-slate-border shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-royal" />
            <span className="text-xs font-bold text-navy-950 uppercase tracking-wider">
              {language === 'bn' ? 'সন্তান নির্বাচন করুন:' : 'Select Child to View & Pay Fees:'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {parentChildren.map((child) => {
              const isSelected = child.id === selectedChildId;
              return (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-royal text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${child.avatarBg} text-white flex items-center justify-center text-[10px]`}>
                    {child.name.charAt(0)}
                  </div>
                  <span>{child.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SUCCESS PAYMENT BANNER */}
      {paymentSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-status-green text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{paymentSuccessMessage}</span>
        </div>
      )}

      {/* PAYABLE DUES & PENDING VERIFICATION ALERT BANNER */}
      <div className={`rounded-2xl p-5 border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${
        totalDueAmount === 0 
          ? (totalPendingAmount > 0 ? 'bg-amber-50/80 border-amber-300' : 'bg-emerald-50/80 border-emerald-200')
          : 'bg-amber-50/80 border-amber-200'
      }`}>
        <div className="flex items-center gap-3.5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
            totalDueAmount === 0 
              ? (totalPendingAmount > 0 ? 'bg-amber-100 text-status-orange' : 'bg-emerald-100 text-status-green')
              : 'bg-amber-100 text-status-orange'
          }`}>
            {totalDueAmount === 0 && totalPendingAmount === 0 ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
              <span>
                {totalDueAmount === 0 
                  ? (totalPendingAmount > 0 
                      ? (language === 'bn' ? 'ফি যাচাই অপেক্ষমাণ (অ্যাডমিন অনুমোদন বাকি)' : 'Fee Verification Pending Admin Approval')
                      : t('noPendingDues'))
                  : (language === 'bn' ? 'পরিশোধযোগ্য বকেয়া ফি রয়েছে' : 'Pending Fee Invoices Available')}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                totalDueAmount === 0 && totalPendingAmount === 0 
                  ? 'bg-status-green text-white' 
                  : totalPendingAmount > 0 && totalDueAmount === 0
                  ? 'bg-amber-500 text-white'
                  : 'bg-status-orange text-white'
              }`}>
                {totalDueAmount === 0 && totalPendingAmount === 0 
                  ? t('status_paid') 
                  : totalPendingAmount > 0 && totalDueAmount === 0
                  ? (language === 'bn' ? 'যাচাই প্রক্রিয়াধীন' : 'Verification Pending')
                  : (language === 'bn' ? 'পরিশোধযোগ্য' : 'Payable')}
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {totalDueAmount === 0 && totalPendingAmount === 0
                ? `${t('allFeesUpToDate')} ${language === 'bn' ? 'সকল সেশনের ফি সম্পূর্ণরূপে পরিশোধিত।' : 'All enrolled courses are cleared.'}`
                : totalDueAmount === 0 && totalPendingAmount > 0
                ? (language === 'bn' 
                    ? `৳ ${toLocaleNumber(totalPendingAmount, 'bn')} ফি জমা দেওয়া হয়েছে। অ্যাডমিন অনুমোদন দিলে পেইড হিসেবে চূড়ান্ত হবে। সাময়িক ভাউচার প্রমাণের জন্য সংরক্ষিত রয়েছে।`
                    : `৳ ${totalPendingAmount} payment submitted. Awaiting Admin verification before officially marked as Paid. Provisional receipt is ready.`)
                : (language === 'bn' 
                    ? `মোট ${toLocaleNumber(dueInvoices.length, 'bn')} টি ইনভয়েসের জন্য ${formatBDT(totalDueAmount, language)} টাকা পরিশোধ বাকি রয়েছে।` 
                    : `${dueInvoices.length} invoices are pending payment. You can pay securely online.`)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase block font-semibold">
              {totalDueAmount === 0 
                ? (totalPendingAmount > 0 
                    ? (language === 'bn' ? 'যাচাই অপেক্ষমাণ' : 'Pending Approval') 
                    : (language === 'bn' ? 'বকেয়া স্থিতি' : 'Current Dues')) 
                : (language === 'bn' ? 'পরিশোধযোগ্য মোট' : 'Payable Total')}
            </span>
            <span className={`text-2xl font-black font-mono ${
              totalDueAmount === 0 
                ? (totalPendingAmount > 0 ? 'text-amber-600' : 'text-status-green') 
                : 'text-status-orange'
            }`}>
              {formatBDT(totalDueAmount > 0 ? totalDueAmount : totalPendingAmount, language)}
            </span>
          </div>

          {totalDueAmount > 0 && (
            <button
              type="button"
              onClick={() => handleOpenPayModal()}
              className="px-5 py-2.5 rounded-xl bg-status-orange hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>{language === 'bn' ? 'অনলাইনে ফি পরিশোধ করুন' : 'Pay Fee Online'}</span>
            </button>
          )}
        </div>
      </div>

      {/* MONTHLY INVOICE STATUS CARDS: CLEAR VIEW OF PAID VS UNPAID */}
      <div className="bg-surface rounded-2xl p-6 border border-slate-border shadow-card space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
              <Layers className="w-4 h-4 text-royal" />
              <span>{language === 'bn' ? 'মাসভিত্তিক ফি বিবরণী ও পরিশোধের অবস্থা' : 'Monthly Fee Invoices & Payment Status'}</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {language === 'bn' ? 'কোন মাসের ফি পরিশোধিত হয়েছে এবং কোনটি বকেয়া বা অনুমোদনের অপেক্ষায় রয়েছে তা দেখুন।' : 'Inspect paid status for each term and pay any due amounts.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentInvoices.map((inv) => (
            <div
              key={inv.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                inv.status === 'paid' 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : inv.status === 'pending'
                  ? 'border-amber-300 bg-amber-50/40 shadow-xs ring-1 ring-amber-300/50'
                  : 'border-slate-200 bg-slate-50/40 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                    {inv.cycle}
                  </span>
                  {inv.status === 'paid' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 bg-emerald-100 text-status-green border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{language === 'bn' ? 'পরিশোধিত' : 'PAID'}</span>
                    </span>
                  ) : inv.status === 'pending' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                      <Clock className="w-3 h-3 text-status-orange" />
                      <span>{language === 'bn' ? 'যাচাই অপেক্ষমাণ' : 'PENDING APPROVAL'}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200">
                      <AlertCircle className="w-3 h-3 text-status-orange" />
                      <span>{language === 'bn' ? 'বকেয়া' : 'UNPAID / DUE'}</span>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-navy-950 text-xs sm:text-sm">
                  {inv.title}
                </h4>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-black text-navy-950 font-mono">
                    {formatBDT(inv.amount, language)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 mt-1">
                  {inv.status === 'paid' 
                    ? (language === 'bn' ? `পরিশোধিত: ${inv.paidDate}` : `Paid on: ${inv.paidDate}`)
                    : inv.status === 'pending'
                    ? (language === 'bn' ? `জমা হয়েছে: ${inv.paidDate || 'সম্প্রতি'} • অ্যাডমিন অনুমোদনের পর চূড়ান্ত পরিশোধ হবে` : `Submitted: ${inv.paidDate || 'Recently'} • Awaiting Admin Approval`)
                    : (language === 'bn' ? `পরিশোধের শেষ তারিখ: ${inv.dueDate}` : `Due by: ${inv.dueDate}`)}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                {inv.status === 'paid' ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono text-slate-400">
                      {language === 'bn' ? 'ভাউচার:' : 'Voucher:'} <strong className="text-royal">{inv.voucherNo || 'NSC-2025-0011'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const matchingPayment = studentPayments.find(p => p.voucherNo === inv.voucherNo || p.id === inv.paymentId);
                        if (matchingPayment) setSelectedReceipt(matchingPayment);
                      }}
                      className="px-2.5 py-1 rounded-md bg-blue-50 text-royal hover:bg-royal hover:text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                    >
                      <Printer className="w-3 h-3" />
                      <span>{language === 'bn' ? 'রসিদ' : 'Receipt'}</span>
                    </button>
                  </div>
                ) : inv.status === 'pending' ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono text-amber-900 font-semibold">
                      {language === 'bn' ? 'ভাউচার:' : 'Voucher:'} <strong>{inv.voucherNo}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const matchingPayment = studentPayments.find(p => p.voucherNo === inv.voucherNo || p.id === inv.paymentId);
                        if (matchingPayment) setSelectedReceipt(matchingPayment);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center gap-1 transition-all shadow-2xs"
                      title={language === 'bn' ? 'প্রমাণের জন্য রসিদ স্লিপ দেখুন' : 'View provisional receipt proof'}
                    >
                      <Printer className="w-3 h-3" />
                      <span>{language === 'bn' ? 'প্রমাণ স্লিপ দেখুন' : 'Print Slip (Proof)'}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenPayModal(inv)}
                    className="w-full py-1.5 rounded-lg bg-status-orange hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'এখনই পরিশোধ করুন' : 'Pay Now'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAYMENT HISTORY & OFFICIAL VOUCHERS TABLE */}
      <div className="bg-surface rounded-2xl border border-slate-border shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-navy-950 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-status-green" />
            <span>{t('paymentHistoryReceipts')}</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {toLocaleNumber(studentPayments.length, language)} {language === 'bn' ? 'টি অফিসিয়াল রসিদ' : 'Receipts Logged'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 font-semibold">{t('voucherNo')}</th>
                <th className="py-3 px-4 font-semibold">{t('amountBDT')}</th>
                <th className="py-3 px-4 font-semibold">{t('paymentMode')}</th>
                <th className="py-3 px-4 font-semibold">{t('collectionDate')}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="py-3 px-4 font-semibold text-right">{t('receipt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {language === 'bn' ? 'কোনো পূর্ববর্তী পেমেন্ট রসিদ নেই।' : 'No payment records found for this student.'}
                  </td>
                </tr>
              ) : (
                studentPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-royal">
                      {p.voucherNo}
                    </td>
                    <td className="py-3 px-4 font-bold text-navy-950">
                      {formatBDT(p.amount, language)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase bg-slate-100 text-slate-700">
                        {p.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {p.paymentDate}
                    </td>
                    <td className="py-3 px-4">
                      {p.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-status-green flex items-center gap-1 w-max border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'bn' ? 'পরিশোধিত (অনুমোদিত)' : 'Verified & Paid'}</span>
                        </span>
                      ) : p.status === 'rejected' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-status-red flex items-center gap-1 w-max border border-rose-200">
                          <X className="w-3 h-3" />
                          <span>{language === 'bn' ? 'বাতিল' : 'Rejected'}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 w-max animate-pulse">
                          <Clock className="w-3 h-3 text-status-orange" />
                          <span>{language === 'bn' ? 'যাচাই অপেক্ষমাণ' : 'Pending Verification'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                          p.status === 'pending'
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                            : 'bg-blue-50 text-royal hover:bg-royal hover:text-white'
                        }`}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>{p.status === 'pending' ? (language === 'bn' ? 'প্রমাণ স্লিপ' : 'Print Slip') : t('printVoucher')}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONLINE FEE PAYMENT GATEWAY MODAL (Parents can pay fee online!) */}
      {showPayModal && selectedInvoiceToPay && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-border my-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-navy-950 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-status-orange" />
                <span>{language === 'bn' ? 'অনলাইন ফি পেমেন্ট গেটওয়ে' : 'Online Fee Payment Gateway'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecutePayment} className="mt-4 space-y-4 text-xs">
              {/* Payment Target Summary */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'শিক্ষার্থী:' : 'Student:'}</span>
                  <span className="font-bold text-navy-950">{studentName} ({studentRoll})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{language === 'bn' ? 'ফি বিবরণ:' : 'Fee Invoice:'}</span>
                  <span className="font-semibold text-royal">{selectedInvoiceToPay.title}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
                  <span className="text-navy-950">{language === 'bn' ? 'পরিশোধের পরিমাণ:' : 'Payable Amount:'}</span>
                  <span className="text-status-green font-mono text-sm">{formatBDT(selectedInvoiceToPay.amount, language)}</span>
                </div>
              </div>

              {/* Gateway Selection */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম নির্বাচন করুন *' : 'Select Payment Gateway *'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('bkash')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      payMethod === 'bkash' 
                        ? 'border-pink-500 bg-pink-50 text-pink-700 font-bold shadow-xs' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block font-black text-sm">bKash</span>
                    <span className="text-[9px] uppercase tracking-wider">{language === 'bn' ? 'বিকাশ ওয়ালেট' : 'MFS'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod('nagad')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      payMethod === 'nagad' 
                        ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold shadow-xs' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block font-black text-sm">Nagad</span>
                    <span className="text-[9px] uppercase tracking-wider">{language === 'bn' ? 'নগদ ওয়ালেট' : 'MFS'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      payMethod === 'bank_transfer' 
                        ? 'border-royal bg-blue-50 text-royal font-bold shadow-xs' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="block font-black text-sm">Cards</span>
                    <span className="text-[9px] uppercase tracking-wider">VISA / Master</span>
                  </button>
                </div>
              </div>

              {/* Mobile Number / Wallet Input */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {payMethod === 'bank_transfer' 
                    ? (language === 'bn' ? 'কার্ড নম্বর / ব্যাংক অ্যাকাউন্ট' : 'Card Number / Bank Account')
                    : (language === 'bn' ? 'মোবাইল ওয়ালেট নম্বর *' : 'Mobile Wallet Number *')}
                </label>
                <input
                  type="text"
                  required
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-royal font-mono font-bold text-navy-950"
                />
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-status-green" />
                <span>{language === 'bn' ? 'SSL এনক্রিপ্টেড ও তাৎক্ষণিক মানি রসিদ পাওয়ার সুবিধা।' : '256-bit SSL secured online institutional payment.'}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-status-orange hover:bg-amber-600 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {language === 'bn' 
                      ? `${formatBDT(selectedInvoiceToPay.amount, language)} পরিশোধ নিশ্চিত করুন` 
                      : `Confirm & Pay ${formatBDT(selectedInvoiceToPay.amount, language)}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL STUDENT MONEY RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-navy-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col p-6 shadow-2xl border border-slate-border my-6 print:max-h-none print:shadow-none print:border-none print:p-0">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 no-print shrink-0">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                <Receipt className="w-4 h-4 text-royal" />
                <span>{t('moneyReceiptTitle')}</span>
              </span>
              <div className="flex items-center gap-2">
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
                  <LogoEmblem sizeClass="w-12 h-12 mb-1" idSuffix="money-voucher-stu" />
                  <h3 className="font-serif font-black tracking-wider text-base text-navy-950 uppercase">
                    {t('brandName')}
                  </h3>
                  <p className="text-[10px] text-slate-500">{t('dhakaBangladesh')} • {t('tagline')}</p>
                  <span className={`mt-1.5 px-3 py-0.5 text-white text-[10px] font-bold rounded uppercase ${
                    selectedReceipt.status === 'pending' 
                      ? 'bg-amber-600' 
                      : selectedReceipt.status === 'rejected' 
                      ? 'bg-rose-600' 
                      : 'bg-navy-900'
                  }`}>
                    {selectedReceipt.status === 'pending'
                      ? (language === 'bn' ? 'সাময়িক পেমেন্ট স্লিপ (অনুমোদন অপেক্ষমাণ)' : 'PROVISIONAL PAYMENT SLIP (PENDING APPROVAL)')
                      : selectedReceipt.status === 'rejected'
                      ? (language === 'bn' ? 'বাতিলকৃত পেমেন্ট স্লিপ' : 'REJECTED PAYMENT SLIP')
                      : t('moneyReceiptTitle')}
                  </span>
                </div>

                {/* Verification Status Notice Banner inside Voucher */}
                <div className={`mt-2.5 p-2 rounded-lg text-center border ${
                  selectedReceipt.status === 'pending'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : selectedReceipt.status === 'rejected'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-status-green'
                }`}>
                  <div className="flex items-center justify-center gap-1.5 font-bold text-[11px] uppercase tracking-wider">
                    {selectedReceipt.status === 'pending' ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-status-orange" />
                        <span>{language === 'bn' ? 'স্ট্যাটাস: অ্যাডমিন অনুমোদন অপেক্ষমাণ (পেন্ডিং)' : 'STATUS: PENDING ADMIN APPROVAL (SUBMISSION PROOF)'}</span>
                      </>
                    ) : selectedReceipt.status === 'rejected' ? (
                      <>
                        <X className="w-3.5 h-3.5 text-status-red" />
                        <span>{language === 'bn' ? 'স্ট্যাটাস: পেমেন্ট বাতিল করা হয়েছে' : 'STATUS: PAYMENT REJECTED BY ADMIN'}</span>
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
                      ? (language === 'bn' 
                          ? 'এই স্লিপটি ফি জমা দেওয়ার বৈধ প্রমাণপত্র। প্রতিষ্ঠান প্রধান/হিসাব শাখা অনুমোদন করার পর পোর্টালে ফি পেইড দেখানো হবে।' 
                          : 'This receipt serves as valid proof of fee payment submission. The invoice will be officially marked as PAID upon Admin approval.')
                      : selectedReceipt.status === 'rejected'
                      ? (language === 'bn'
                          ? `বাতিলের কারণ: ${selectedReceipt.rejectionReason || 'যাচাই ব্যর্থ হয়েছে। পুনরায় ফি পরিশোধ করুন।'}`
                          : `Reason: ${selectedReceipt.rejectionReason || 'Verification rejected. Please re-submit payment.'}`)
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
                    <span className="text-slate-600">{language === 'bn' ? 'ফি বিবরণী:' : 'Payment Purpose:'}</span>
                    <span className="font-semibold text-navy-950">{selectedReceipt.remarks || (language === 'bn' ? 'মাসিক বেতন' : 'Tuition Fee')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">{language === 'bn' ? 'পেমেন্ট মাধ্যম:' : 'Payment Method:'}</span>
                    <span className="font-semibold uppercase text-navy-950">{selectedReceipt.paymentMethod.replace('_', ' ')}</span>
                  </div>
                  {selectedReceipt.transactionRef && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">{language === 'bn' ? 'ট্রানজ্যাকশন আইডি:' : 'Transaction ID / Ref:'}</span>
                      <span className="font-mono text-navy-950">{selectedReceipt.transactionRef}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 text-sm font-bold border-t border-slate-100">
                    <span className="text-navy-950">{language === 'bn' ? 'পরিশোধিত অর্থ:' : 'Total Amount Paid:'}</span>
                    <span className="text-status-green font-mono font-bold">{formatBDT(selectedReceipt.amount, language)}</span>
                  </div>
                </div>

                <div className="pt-8 flex items-center justify-between text-[11px] font-semibold text-slate-700">
                  <div className="text-center">
                    <div className="w-28 border-t border-slate-800 pt-1" />
                    <span>{language === 'bn' ? 'শিক্ষার্থী / অভিভাবক' : 'Student / Guardian'}</span>
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
