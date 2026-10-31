export type UserRole =
  | 'super_admin'
  | 'institution_admin'
  | 'principal'
  | 'teacher'
  | 'student'
  | 'guardian'
  | 'accountant'
  | 'librarian'
  | 'receptionist';

export type DivisionType = 'school' | 'college';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phoneNumber?: string;
  institutionId: string;
  isActive: boolean;
  metadata?: {
    studentId?: string;
    teacherId?: string;
    guardianId?: string;
    staffId?: string;
    linkedStudentIds?: string[];
    rollNo?: string;
    admissionNo?: string;
    classId?: string;
    className?: string;
    division?: string;
    stream?: string;
    department?: string;
    designation?: string;
  };
}

export interface AcademicSession {
  id: string;
  name: string; // e.g. "2025" or "2025-2026"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface AcademicClass {
  id: string;
  name: string; // e.g. "Class 9", "Class 11"
  division: DivisionType; // 'school' | 'college'
  level: number; // numeric order, e.g. 9, 11
  streams?: ('Science' | 'Commerce' | 'Humanities' | 'General')[];
}

export interface Section {
  id: string;
  classId: string;
  name: string; // "A", "B", "Science-A", "Padma", "Meghna"
  capacity: number;
  classTeacherId?: string;
}

export interface Subject {
  id: string;
  code: string; // e.g. "101", "PHY-1"
  name: string; // "Bangla", "Physics", "Higher Mathematics"
  division: DivisionType;
  classId: string;
  isOptional?: boolean;
  fullMarks: number;
  passMarks: number;
}

export interface Teacher {
  id: string;
  userId?: string;
  employeeId: string;
  fullName: string;
  designation: string; // "Senior Lecturer", "Assistant Teacher", "Head of Dept"
  division: DivisionType | 'both';
  department: string; // "Mathematics", "Science", "English"
  email: string;
  phone: string;
  joinDate: string;
  qualification: string;
  photoUrl?: string;
  assignedClasses?: { classId: string; sectionId: string; subjectId: string }[];
}

export interface Student {
  id: string;
  userId?: string;
  admissionNo: string;
  rollNo: string;
  fullName: string;
  division: DivisionType;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  stream?: 'Science' | 'Commerce' | 'Humanities' | 'General';
  sessionId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  guardianId: string;
  guardianName: string;
  guardianPhone: string;
  address: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  enrollmentDate: string;
  status: 'active' | 'applicant' | 'transferred' | 'graduated' | 'archived';
  emergencyContact?: string;
  previousGpa?: number;
  sscGpa?: number;
  previousBoard?: string;
  passingYear?: string;
}

export interface Guardian {
  id: string;
  userId?: string;
  fullName: string;
  relation: 'Father' | 'Mother' | 'Guardian';
  email: string;
  phone: string;
  occupation: string;
  address: string;
  linkedStudentIds: string[];
  password?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface AdminUserAccount {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  password: string;
  department?: string;
  designation?: string;
  createdAt: string;
  isActive: boolean;
  notes?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  classId: string;
  sectionId: string;
  status: AttendanceStatus;
  remarks?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface ClassRoutinePeriod {
  id: string;
  classId: string;
  sectionId: string;
  dayOfWeek: 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  startTime: string; // "08:30"
  endTime: string;   // "09:20"
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  roomNumber: string;
}

export interface Examination {
  id: string;
  title: string; // "Final Term Examination 2025"
  examType: 'first_term' | 'mid_term' | 'final_term' | 'test_exam';
  division: DivisionType | 'both';
  sessionId: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'scheduled' | 'grading' | 'published';
  maxGpa: number; // usually 5.0 in Bangladesh
}

export interface ExamMark {
  id: string;
  examId: string;
  studentId: string;
  subjectId: string;
  marksObtained: number;
  totalMarks: number;
  isAbsent?: boolean;
  grade: string; // "A+", "A", "A-", "B", "C", "D", "F"
  gradePoint: number; // 5.0, 4.0, 3.5, 3.0, 2.0, 1.0, 0.0
  remarks?: string;
}

export interface FeeCategory {
  id: string;
  name: string; // "Monthly Tuition", "Admission Fee", "Exam Fee", "Lab Fee"
  division: DivisionType | 'both';
  defaultAmount: number;
  frequency: 'monthly' | 'term' | 'annual' | 'one_time';
}

export interface StudentCharge {
  id: string;
  studentId: string;
  feeCategoryId: string;
  categoryName: string;
  amount: number;
  dueDate: string;
  paidAmount: number;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  sessionId: string;
  month?: string; // e.g. "April 2025"
}

export interface PaymentTransaction {
  id: string;
  voucherNo: string; // "NSC-PAY-2025-0012"
  studentId: string;
  studentName: string;
  classInfo: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'bkash' | 'nagad';
  paymentDate: string;
  transactionRef?: string;
  collectedBy: string;
  remarks?: string;
  chargeIds?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  invoiceId?: string;
  mobileWallet?: string;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  title: string;
  cycle: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'due' | 'pending';
  paidDate?: string;
  voucherNo?: string;
  paymentId?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  audience: 'all' | 'school' | 'college' | 'teachers' | 'students' | 'guardians';
  author: string;
  publishDate: string;
  expiryDate?: string;
  priority: 'normal' | 'urgent';
  isPinned?: boolean;
}

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  category: 'academic' | 'sports' | 'cultural' | 'holiday' | 'meeting';
  location: string;
  isPublic: boolean;
}

export interface AdmissionEnquiry {
  id: string;
  applicantName: string;
  guardianName: string;
  phone: string;
  email?: string;
  division: DivisionType;
  desiredClass: string;
  desiredStream?: string;
  previousSchool?: string;
  message?: string;
  photoUrl?: string;
  status: 'new' | 'reviewed' | 'interview_scheduled' | 'approved' | 'enrolled' | 'rejected';
  submittedAt: string;
  notes?: string;
  sscGpa?: number;
  previousGpa?: number;
  board?: string;
  passingYear?: string;
}

export interface LibraryBook {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export interface TransportRoute {
  id: string;
  routeName: string;
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
  stops: string[];
  monthlyFee: number;
}

export interface HomeworkTask {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  assignedDate: string;
  dueDate: string; // "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm"
  totalMarks: number;
  instructions: string;
  attachmentName?: string;
}

export interface HomeworkSubmission {
  id: string;
  taskId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  submittedAt?: string;
  status: 'submitted' | 'absent' | 'graded';
  obtainedMarks?: number;
  feedback?: string;
  submissionNote?: string;
}

export interface MasterSchedulePeriod {
  id: string;
  periodName: string;
  timeSlot: string;
  isBreak?: boolean;
  class9Subject: string;
  class11ScienceSubject: string;
  class11CommerceSubject: string;
}

export interface AcademicSessionCard {
  id: string;
  name: string;
  duration: string;
  workingDays: string;
  status: 'active' | 'upcoming' | 'archived';
  statusLabel: string;
}

export interface AcademicTermItem {
  id: string;
  termKey: string;
  title: string;
  dateRange: string;
  statusBadge: string;
  statusColor: 'green' | 'orange' | 'violet' | 'blue';
}

export interface DivisionRulesData {
  school: {
    curriculum: string;
    streams: string;
    scienceEligibility: string;
    otherEligibility: string;
  };
  college: {
    scienceSeats: string;
    businessSeats: string;
    humanitiesSeats: string;
    boardAffiliation: string;
  };
}

export interface GradeScaleRow {
  id: string;
  markRange: string;
  letterGrade: string;
  gradePoint: number;
  remarks: string;
  colorClass: string;
}

export interface AssessmentPolicyItem {
  id: string;
  title: string;
  description: string;
}
