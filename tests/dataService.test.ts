import { describe, it, expect } from 'vitest';
import { dataService } from '../src/services/dataService';
import { toLocaleNumber, formatBDT } from '../src/i18n/translations';

describe('Data Service & Aggregations', () => {
  it('loads baseline institutional statistics matching reference image', () => {
    const stats = dataService.getAdminStats();
    expect(stats.totalStudents).toBe(1248);
    expect(stats.totalTeachers).toBe(86);
    expect(stats.totalClasses).toBe(42);
    expect(stats.totalStaff).toBe(28);
    expect(stats.recentActivities.length).toBeGreaterThan(0);
  });

  it('filters students by division, class, and search query', () => {
    const schoolStudents = dataService.getStudents({ division: 'school' });
    expect(schoolStudents.length).toBeGreaterThan(0);
    schoolStudents.forEach(s => expect(s.division).toBe('school'));

    const searchResult = dataService.getStudents({ search: 'Rafiq' });
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].fullName).toBe('Rafiq Hasan');
    expect(searchResult[0].rollNo).toBe('NSC-2025-0147');
  });

  it('records fee payments and issues unique sequential voucher numbers', () => {
    const payment = dataService.recordPayment({
      studentId: 'stu-rafiq',
      studentName: 'Rafiq Hasan',
      classInfo: 'Class 9 (Science)',
      amount: 3500,
      paymentMethod: 'bkash',
      paymentDate: '2025-04-25 10:00',
      collectedBy: 'Accounts Officer',
      remarks: 'Tuition Fee April 2025',
    });

    expect(payment.id).toBeDefined();
    expect(payment.voucherNo).toMatch(/^NSC-2025-\d{4}$/);
    expect(payment.amount).toBe(3500);

    const allPayments = dataService.getPayments('stu-rafiq');
    expect(allPayments.some(p => p.voucherNo === payment.voucherNo)).toBe(true);
  });

  it('accepts and stores public admission enquiries', () => {
    const enquiry = dataService.submitEnquiry({
      applicantName: 'Fahim Morshed',
      guardianName: 'Morshed Alam',
      phone: '+880 1711 999888',
      division: 'school',
      desiredClass: 'Class 6',
      message: 'Looking for science group admission',
    });

    expect(enquiry.id).toBeDefined();
    expect(enquiry.status).toBe('new');
    expect(enquiry.submittedAt).toBeDefined();

    const enquiries = dataService.getEnquiries();
    expect(enquiries.some(e => e.applicantName === 'Fahim Morshed')).toBe(true);
  });

  it('allows administrators to publish and delete notices', () => {
    const newNotice = dataService.addNotice({
      title: 'Annual Sports Notice Test',
      content: 'Track and field events begin next week.',
      publishDate: '25 Apr 2025',
      audience: 'all',
      priority: 'normal',
      author: 'Principal Office',
    });

    expect(newNotice.id).toBeDefined();
    const noticesAfterAdd = dataService.getNotices();
    expect(noticesAfterAdd.some(n => n.id === newNotice.id)).toBe(true);

    const deleted = dataService.deleteNotice(newNotice.id);
    expect(deleted).toBe(true);
    const noticesAfterDelete = dataService.getNotices();
    expect(noticesAfterDelete.some(n => n.id === newNotice.id)).toBe(false);
  });

  it('automatically lists unsubmitted homework tasks as absent when due date has passed', () => {
    // Create an expired homework task
    const expiredTask = dataService.createHomeworkTask({
      title: 'Expired Matrix Algebra Task',
      subject: 'Higher Mathematics',
      classId: 'c-9',
      className: 'Class 9 (Science)',
      teacherId: 't-2',
      teacherName: 'Ms. Farhana Akhter',
      dueDate: '2020-01-01T23:59:00', // Past date
      totalMarks: 20,
      instructions: 'Solve matrix multiplication.'
    });

    const statusUnsubmitted = dataService.getStudentHomeworkStatus(expiredTask.id, 'stu-unsubmitted-student');
    expect(statusUnsubmitted.status).toBe('absent');
    expect(statusUnsubmitted.isOverdue).toBe(true);

    // Create an active future task
    const futureTask = dataService.createHomeworkTask({
      title: 'Active Probability Task',
      subject: 'Higher Mathematics',
      classId: 'c-9',
      className: 'Class 9 (Science)',
      teacherId: 't-2',
      teacherName: 'Ms. Farhana Akhter',
      dueDate: '2099-12-31T23:59:00', // Far future date
      totalMarks: 20,
      instructions: 'Solve probability distribution problems.'
    });

    const statusPending = dataService.getStudentHomeworkStatus(futureTask.id, 'stu-new-student');
    expect(statusPending.status).toBe('pending');
    expect(statusPending.isOverdue).toBe(false);
  });

  it('provides academic classes 1 through 12 across school and college divisions', () => {
    const classes = dataService.getClasses();
    expect(classes.length).toBeGreaterThanOrEqual(12);

    const schoolClasses = classes.filter(c => c.division === 'school');
    const classLevels = schoolClasses.map(c => c.level);
    expect(classLevels).toContain(1);
    expect(classLevels).toContain(2);
    expect(classLevels).toContain(3);
    expect(classLevels).toContain(4);
    expect(classLevels).toContain(5);
    expect(classLevels).toContain(6);
    expect(classLevels).toContain(10);

    const collegeClasses = classes.filter(c => c.division === 'college');
    expect(collegeClasses.some(c => c.name.includes('11'))).toBe(true);
    expect(collegeClasses.some(c => c.name.includes('12'))).toBe(true);
  });

  it('captures and updates SSC GPA for college admission applications', () => {
    const collegeApp = dataService.submitEnquiry({
      applicantName: 'Nusrat Test',
      guardianName: 'Test Guardian',
      phone: '+880 1711 000111',
      division: 'college',
      desiredClass: 'Class 11 (HSC 1st Year)',
      desiredStream: 'Science',
      sscGpa: 5.00,
      board: 'Dhaka',
      passingYear: '2024',
    });

    expect(collegeApp.id).toBeDefined();
    expect(collegeApp.sscGpa).toBe(5.00);
    expect(collegeApp.board).toBe('Dhaka');

    const updated = dataService.updateEnquiryStatus(collegeApp.id, 'reviewed', 'Verified GPA 5.00');
    expect(updated).toBe(true);

    const found = dataService.getEnquiries().find(e => e.id === collegeApp.id);
    expect(found?.status).toBe('reviewed');
    expect(found?.notes).toBe('Verified GPA 5.00');

    const deleted = dataService.deleteEnquiry(collegeApp.id);
    expect(deleted).toBe(true);
    expect(dataService.getEnquiries().some(e => e.id === collegeApp.id)).toBe(false);
  });

  it('allows administrators to manage master schedule routine periods', () => {
    const initialSchedule = dataService.getMasterSchedule();
    expect(initialSchedule.length).toBeGreaterThan(0);

    const newPeriod = dataService.addMasterSchedulePeriod({
      periodName: 'Period 5 Test',
      timeSlot: '12:45 - 01:35',
      class9Subject: 'Higher Math (Room 105)',
      class11ScienceSubject: 'Botany Practical (Lab 2)',
      class11CommerceSubject: 'Banking 2nd (Room 305)',
    });

    expect(newPeriod.id).toBeDefined();
    expect(newPeriod.periodName).toBe('Period 5 Test');

    const updated = dataService.updateMasterSchedulePeriod(newPeriod.id, {
      timeSlot: '01:00 - 01:50',
    });
    expect(updated).toBe(true);

    const found = dataService.getMasterSchedule().find(p => p.id === newPeriod.id);
    expect(found?.timeSlot).toBe('01:00 - 01:50');

    const deleted = dataService.deleteMasterSchedulePeriod(newPeriod.id);
    expect(deleted).toBe(true);
    expect(dataService.getMasterSchedule().some(p => p.id === newPeriod.id)).toBe(false);
  });

  it('allows administrators to manage academic sessions, terms, and rules', () => {
    const sessions = dataService.getAcademicSessions();
    expect(sessions.length).toBeGreaterThan(0);

    const newSession = dataService.addAcademicSession({
      name: 'Academic Session 2027–2028',
      duration: 'Jan 01, 2027 – Dec 31, 2027',
      workingDays: '225 Days',
      status: 'upcoming',
      statusLabel: 'Upcoming',
    });

    expect(newSession.id).toBeDefined();
    dataService.setActiveAcademicSession(newSession.id);
    const activeSession = dataService.getAcademicSessions().find(s => s.id === newSession.id);
    expect(activeSession?.status).toBe('active');

    // Clean up
    dataService.deleteAcademicSession(newSession.id);

    // Division rules
    const rules = dataService.getDivisionRules();
    expect(rules.school.curriculum).toBeDefined();
    expect(rules.college.scienceSeats).toBeDefined();

    dataService.updateDivisionRules({
      ...rules,
      college: {
        ...rules.college,
        scienceSeats: '200 Seats (Min SSC GPA: 4.85)',
      },
    });

    const updatedRules = dataService.getDivisionRules();
    expect(updatedRules.college.scienceSeats).toBe('200 Seats (Min SSC GPA: 4.85)');
  });

  it('keeps online fee payment in pending status until confirmed and approved by admin', () => {
    // 1. Initially student has May 2025 invoice due
    const invoicesBefore = dataService.getFeeInvoices('stu-rafiq');
    const mayInvoice = invoicesBefore.find(i => i.id === 'inv-raf-2');
    expect(mayInvoice).toBeDefined();
    expect(mayInvoice?.status).toBe('due');

    // 2. Student pays online -> status is 'pending'
    const pendingPayment = dataService.recordPayment({
      studentId: 'stu-rafiq',
      studentName: 'Rafiq Hasan',
      classInfo: 'Class 9 (Science)',
      amount: 3500,
      paymentMethod: 'bkash',
      paymentDate: '2025-05-02 14:00',
      transactionRef: 'BK-77889900',
      collectedBy: 'Online Portal Gateway',
      remarks: 'Monthly Tuition - May 2025',
      invoiceId: 'inv-raf-2',
      status: 'pending',
    });

    expect(pendingPayment.status).toBe('pending');
    expect(pendingPayment.voucherNo).toMatch(/^NSC-2025-\d{4}$/);

    // Invoice status is pending (NOT yet paid)
    const invoicesAfterSubmit = dataService.getFeeInvoices('stu-rafiq');
    const mayInvoiceAfterSubmit = invoicesAfterSubmit.find(i => i.id === 'inv-raf-2');
    expect(mayInvoiceAfterSubmit?.status).toBe('pending');

    // 3. Admin verifies and approves payment
    const approved = dataService.approvePayment(pendingPayment.id, 'Accounts Administrator');
    expect(approved).not.toBeNull();
    expect(approved?.status).toBe('approved');

    // Invoice is now officially marked as 'paid'
    const invoicesAfterApproval = dataService.getFeeInvoices('stu-rafiq');
    const mayInvoiceAfterApproval = invoicesAfterApproval.find(i => i.id === 'inv-raf-2');
    expect(mayInvoiceAfterApproval?.status).toBe('paid');
    expect(mayInvoiceAfterApproval?.voucherNo).toBe(pendingPayment.voucherNo);
  });
});

describe('Localization & Bengali Formatters', () => {
  it('converts numbers to Bengali digits when language is bn', () => {
    expect(toLocaleNumber(1248, 'en')).toBe('1248');
    expect(toLocaleNumber(1248, 'bn')).toBe('১২৪৮');
    expect(toLocaleNumber('92%', 'bn')).toBe('৯২%');
  });

  it('formats Bangladeshi Taka (BDT) correctly in English and Bengali', () => {
    expect(formatBDT(3500, 'en')).toBe('৳ 3,500');
    expect(formatBDT(3500, 'bn')).toBe('৳ ৩,৫০০');
  });
});
