import {
  Student,
  Teacher,
  AcademicClass,
  Section,
  Subject,
  AttendanceRecord,
  ClassRoutinePeriod,
  Examination,
  ExamMark,
  StudentCharge,
  PaymentTransaction,
  FeeInvoice,
  Notice,
  SchoolEvent,
  AdmissionEnquiry,
  Guardian,
  LibraryBook,
  TransportRoute,
  HomeworkTask,
  HomeworkSubmission,
  MasterSchedulePeriod,
  AcademicSessionCard,
  AcademicTermItem,
  DivisionRulesData,
  GradeScaleRow,
  AssessmentPolicyItem,
  AdminUserAccount
} from '../types';
import { firestoreService } from './firestoreService';

// Mock initial data seeded faithfully from the reference screenshot & real Bangladesh school/college structures
const INITIAL_CLASSES: AcademicClass[] = [
  { id: 'c-1', name: 'Class 1', division: 'school', level: 1 },
  { id: 'c-2', name: 'Class 2', division: 'school', level: 2 },
  { id: 'c-3', name: 'Class 3', division: 'school', level: 3 },
  { id: 'c-4', name: 'Class 4', division: 'school', level: 4 },
  { id: 'c-5', name: 'Class 5', division: 'school', level: 5 },
  { id: 'c-6', name: 'Class 6', division: 'school', level: 6 },
  { id: 'c-7', name: 'Class 7', division: 'school', level: 7 },
  { id: 'c-8', name: 'Class 8', division: 'school', level: 8 },
  { id: 'c-9', name: 'Class 9', division: 'school', level: 9, streams: ['Science', 'Commerce', 'Humanities'] },
  { id: 'c-10', name: 'Class 10', division: 'school', level: 10, streams: ['Science', 'Commerce', 'Humanities'] },
  { id: 'c-11', name: 'Class 11 (HSC 1st Year)', division: 'college', level: 11, streams: ['Science', 'Commerce', 'Humanities'] },
  { id: 'c-12', name: 'Class 12 (HSC 2nd Year)', division: 'college', level: 12, streams: ['Science', 'Commerce', 'Humanities'] },
];

const INITIAL_SECTIONS: Section[] = [
  // Class 1
  { id: 'sec-1a', classId: 'c-1', name: 'Section A (Rose)', capacity: 35 },
  { id: 'sec-1b', classId: 'c-1', name: 'Section B (Tulip)', capacity: 35 },
  // Class 2
  { id: 'sec-2a', classId: 'c-2', name: 'Section A (Lotus)', capacity: 35 },
  { id: 'sec-2b', classId: 'c-2', name: 'Section B (Lily)', capacity: 35 },
  // Class 3
  { id: 'sec-3a', classId: 'c-3', name: 'Section A (Shapla)', capacity: 35 },
  { id: 'sec-3b', classId: 'c-3', name: 'Section B (Bakul)', capacity: 35 },
  // Class 4
  { id: 'sec-4a', classId: 'c-4', name: 'Section A (Chameli)', capacity: 35 },
  { id: 'sec-4b', classId: 'c-4', name: 'Section B (Hasnahena)', capacity: 35 },
  // Class 5
  { id: 'sec-5a', classId: 'c-5', name: 'Section A (Dahlia)', capacity: 40 },
  { id: 'sec-5b', classId: 'c-5', name: 'Section B (Beli)', capacity: 40 },
  // Class 6
  { id: 'sec-6a', classId: 'c-6', name: 'Section A (Padma)', capacity: 40 },
  { id: 'sec-6b', classId: 'c-6', name: 'Section B (Meghna)', capacity: 40 },
  // Class 7
  { id: 'sec-7a', classId: 'c-7', name: 'Science-A', capacity: 40 },
  { id: 'sec-7b', classId: 'c-7', name: 'Section B (Jamuna)', capacity: 40 },
  // Class 8
  { id: 'sec-8a', classId: 'c-8', name: 'Section A (Surma)', capacity: 45 },
  { id: 'sec-8b', classId: 'c-8', name: 'Section B (Karnafuli)', capacity: 45 },
  // Class 9
  { id: 'sec-9s', classId: 'c-9', name: 'Science', capacity: 45 },
  { id: 'sec-9c', classId: 'c-9', name: 'Commerce', capacity: 40 },
  { id: 'sec-9h', classId: 'c-9', name: 'Humanities', capacity: 35 },
  // Class 10
  { id: 'sec-10s', classId: 'c-10', name: 'Science', capacity: 45 },
  { id: 'sec-10c', classId: 'c-10', name: 'Commerce', capacity: 40 },
  { id: 'sec-10a', classId: 'c-10', name: 'Arts', capacity: 38 },
  // Class 11 (College HSC 1st Year)
  { id: 'sec-11s', classId: 'c-11', name: 'Science Section 1', capacity: 50 },
  { id: 'sec-11b', classId: 'c-11', name: 'Business Studies Section 1', capacity: 50 },
  { id: 'sec-11h', classId: 'c-11', name: 'Humanities Section 1', capacity: 40 },
  // Class 12 (College HSC 2nd Year)
  { id: 'sec-12s', classId: 'c-12', name: 'Science Section 2', capacity: 50 },
  { id: 'sec-12b', classId: 'c-12', name: 'Business Studies Section 2', capacity: 50 },
  { id: 'sec-12h', classId: 'c-12', name: 'Humanities Section 2', capacity: 40 },
];

const INITIAL_SUBJECTS: Subject[] = [
  // Class 1-5 Core Primary Subjects
  { id: 'sub-pri-ban', code: 'BAN-100', name: 'Amar Bangla Boi', division: 'school', classId: 'c-1', fullMarks: 100, passMarks: 33 },
  { id: 'sub-pri-eng', code: 'ENG-100', name: 'English For Today', division: 'school', classId: 'c-1', fullMarks: 100, passMarks: 33 },
  { id: 'sub-pri-math', code: 'MATH-100', name: 'Elementary Mathematics', division: 'school', classId: 'c-1', fullMarks: 100, passMarks: 33 },
  { id: 'sub-pri-sci', code: 'SCI-300', name: 'Elementary Science', division: 'school', classId: 'c-3', fullMarks: 100, passMarks: 33 },
  { id: 'sub-pri-bgs', code: 'BGS-300', name: 'Bangladesh & Global Studies', division: 'school', classId: 'c-3', fullMarks: 100, passMarks: 33 },
  // Class 6 (School)
  { id: 'sub-6-ban1', code: 'BAN-601', name: 'Bangla 1st Paper', division: 'school', classId: 'c-6', fullMarks: 100, passMarks: 33 },
  { id: 'sub-6-ban2', code: 'BAN-602', name: 'Bangla 2nd Paper', division: 'school', classId: 'c-6', fullMarks: 50, passMarks: 17 },
  { id: 'sub-6-eng1', code: 'ENG-601', name: 'English 1st Paper', division: 'school', classId: 'c-6', fullMarks: 100, passMarks: 33 },
  { id: 'sub-6-eng2', code: 'ENG-602', name: 'English 2nd Paper', division: 'school', classId: 'c-6', fullMarks: 50, passMarks: 17 },
  { id: 'sub-6-math', code: 'MATH-601', name: 'Mathematics', division: 'school', classId: 'c-6', fullMarks: 100, passMarks: 33 },
  { id: 'sub-6-sci', code: 'SCI-601', name: 'General Science', division: 'school', classId: 'c-6', fullMarks: 100, passMarks: 33 },
  { id: 'sub-6-bgs', code: 'BGS-601', name: 'Bangladesh & Global Studies', division: 'school', classId: 'c-6', fullMarks: 100, passMarks: 33 },
  { id: 'sub-6-ict', code: 'ICT-601', name: 'Information & Comm. Technology', division: 'school', classId: 'c-6', fullMarks: 50, passMarks: 17 },
  { id: 'sub-6-rel', code: 'REL-601', name: 'Islam & Moral Education', division: 'school', classId: 'c-6', fullMarks: 100, passMarks: 33 },

  // Class 7 (School)
  { id: 'sub-7-ban', code: 'BAN-701', name: 'Bangla', division: 'school', classId: 'c-7', fullMarks: 100, passMarks: 33 },
  { id: 'sub-7-eng', code: 'ENG-701', name: 'English', division: 'school', classId: 'c-7', fullMarks: 100, passMarks: 33 },
  { id: 'sub-7-math', code: 'MATH-701', name: 'Mathematics', division: 'school', classId: 'c-7', fullMarks: 100, passMarks: 33 },
  { id: 'sub-7-sci', code: 'SCI-701', name: 'General Science', division: 'school', classId: 'c-7', fullMarks: 100, passMarks: 33 },
  { id: 'sub-7-bgs', code: 'BGS-701', name: 'Bangladesh & Global Studies', division: 'school', classId: 'c-7', fullMarks: 100, passMarks: 33 },
  { id: 'sub-7-ict', code: 'ICT-701', name: 'ICT', division: 'school', classId: 'c-7', fullMarks: 50, passMarks: 17 },
  { id: 'sub-7-agr', code: 'AGR-701', name: 'Agriculture Studies', division: 'school', classId: 'c-7', isOptional: true, fullMarks: 100, passMarks: 33 },

  // Class 8 (School)
  { id: 'sub-8-ban', code: 'BAN-801', name: 'Bangla', division: 'school', classId: 'c-8', fullMarks: 100, passMarks: 33 },
  { id: 'sub-8-eng', code: 'ENG-801', name: 'English', division: 'school', classId: 'c-8', fullMarks: 100, passMarks: 33 },
  { id: 'sub-8-math', code: 'MATH-801', name: 'Mathematics', division: 'school', classId: 'c-8', fullMarks: 100, passMarks: 33 },
  { id: 'sub-8-sci', code: 'SCI-801', name: 'General Science', division: 'school', classId: 'c-8', fullMarks: 100, passMarks: 33 },
  { id: 'sub-8-bgs', code: 'BGS-801', name: 'Bangladesh & Global Studies', division: 'school', classId: 'c-8', fullMarks: 100, passMarks: 33 },
  { id: 'sub-8-ict', code: 'ICT-801', name: 'ICT', division: 'school', classId: 'c-8', fullMarks: 50, passMarks: 17 },
  { id: 'sub-8-rel', code: 'REL-801', name: 'Moral Education', division: 'school', classId: 'c-8', fullMarks: 100, passMarks: 33 },

  // Class 9 (School)
  { id: 'sub-math', code: 'MATH-101', name: 'Mathematics', division: 'school', classId: 'c-9', fullMarks: 100, passMarks: 33 },
  { id: 'sub-phy', code: 'PHY-102', name: 'Physics', division: 'school', classId: 'c-9', fullMarks: 100, passMarks: 33 },
  { id: 'sub-chem', code: 'CHEM-103', name: 'Chemistry', division: 'school', classId: 'c-9', fullMarks: 100, passMarks: 33 },
  { id: 'sub-eng', code: 'ENG-104', name: 'English', division: 'school', classId: 'c-9', fullMarks: 100, passMarks: 33 },
  { id: 'sub-ban', code: 'BAN-105', name: 'Bangla', division: 'school', classId: 'c-9', fullMarks: 100, passMarks: 33 },
  { id: 'sub-bio', code: 'BIO-106', name: 'Biology', division: 'school', classId: 'c-9', isOptional: true, fullMarks: 100, passMarks: 33 },
  { id: 'sub-9-hmath', code: 'HMATH-109', name: 'Higher Mathematics', division: 'school', classId: 'c-9', isOptional: true, fullMarks: 100, passMarks: 33 },
  { id: 'sub-9-acc', code: 'ACC-146', name: 'Accounting', division: 'school', classId: 'c-9', fullMarks: 100, passMarks: 33 },
  { id: 'sub-9-bentr', code: 'BENTR-143', name: 'Business Entrepreneurship', division: 'school', classId: 'c-9', fullMarks: 100, passMarks: 33 },
  { id: 'sub-9-fin', code: 'FIN-152', name: 'Finance & Banking', division: 'school', classId: 'c-9', fullMarks: 100, passMarks: 33 },

  // Class 10 (School)
  { id: 'sub-10-ban', code: 'BAN-101', name: 'Bangla', division: 'school', classId: 'c-10', fullMarks: 100, passMarks: 33 },
  { id: 'sub-10-eng', code: 'ENG-107', name: 'English', division: 'school', classId: 'c-10', fullMarks: 100, passMarks: 33 },
  { id: 'sub-10-math', code: 'MATH-109', name: 'Mathematics', division: 'school', classId: 'c-10', fullMarks: 100, passMarks: 33 },
  { id: 'sub-10-phy', code: 'PHY-136', name: 'Physics', division: 'school', classId: 'c-10', fullMarks: 100, passMarks: 33 },
  { id: 'sub-10-chem', code: 'CHEM-137', name: 'Chemistry', division: 'school', classId: 'c-10', fullMarks: 100, passMarks: 33 },
  { id: 'sub-10-bio', code: 'BIO-138', name: 'Biology', division: 'school', classId: 'c-10', isOptional: true, fullMarks: 100, passMarks: 33 },
  { id: 'sub-10-acc', code: 'ACC-146', name: 'Accounting', division: 'school', classId: 'c-10', fullMarks: 100, passMarks: 33 },
  { id: 'sub-10-fin', code: 'FIN-152', name: 'Finance & Banking', division: 'school', classId: 'c-10', fullMarks: 100, passMarks: 33 },

  // Class 11 (College HSC 1st Year)
  { id: 'sub-11-ban1', code: 'BAN-101', name: 'Bangla 1st Paper', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-eng1', code: 'ENG-107', name: 'English 1st Paper', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-ict', code: 'ICT-275', name: 'Information & Comm. Technology', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-phy1', code: 'PHY-174', name: 'Physics 1st Paper', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-chem1', code: 'CHEM-176', name: 'Chemistry 1st Paper', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-hmath1', code: 'HMATH-265', name: 'Higher Mathematics 1st Paper', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-bio1', code: 'BIO-178', name: 'Biology 1st Paper', division: 'college', classId: 'c-11', isOptional: true, fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-acc1', code: 'ACC-253', name: 'Principles of Accounting 1st Paper', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-bom1', code: 'BOM-277', name: 'Business Organization & Mgmt 1st', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-fin1', code: 'FIN-292', name: 'Finance, Banking & Insurance 1st', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-econ1', code: 'ECON-109', name: 'Economics 1st Paper', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },
  { id: 'sub-11-civ1', code: 'CIV-269', name: 'Civics & Good Governance 1st', division: 'college', classId: 'c-11', fullMarks: 100, passMarks: 33 },

  // Class 12 (College HSC 2nd Year)
  { id: 'sub-12-ban2', code: 'BAN-102', name: 'Bangla 2nd Paper', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-eng2', code: 'ENG-108', name: 'English 2nd Paper', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-phy2', code: 'PHY-175', name: 'Physics 2nd Paper', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-chem2', code: 'CHEM-177', name: 'Chemistry 2nd Paper', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-hmath2', code: 'HMATH-266', name: 'Higher Mathematics 2nd Paper', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-bio2', code: 'BIO-179', name: 'Biology 2nd Paper', division: 'college', classId: 'c-12', isOptional: true, fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-acc2', code: 'ACC-254', name: 'Principles of Accounting 2nd Paper', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-bom2', code: 'BOM-278', name: 'Business Organization & Mgmt 2nd', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-fin2', code: 'FIN-293', name: 'Finance, Banking & Insurance 2nd', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
  { id: 'sub-12-econ2', code: 'ECON-110', name: 'Economics 2nd Paper', division: 'college', classId: 'c-12', fullMarks: 100, passMarks: 33 },
];

const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    employeeId: 'NST-2018-04',
    fullName: 'Mr. Anisur Rahman',
    designation: 'Senior Teacher & Head of Science',
    division: 'school',
    department: 'Physics',
    email: 'anisur.rahman@northernstar.edu.bd',
    phone: '+880 1711 000111',
    joinDate: '2018-01-15',
    qualification: 'M.Sc. in Physics (DU)',
  },
  {
    id: 't-2',
    employeeId: 'NST-2019-12',
    fullName: 'Ms. Farhana Akhter',
    designation: 'Assistant Teacher',
    division: 'school',
    department: 'Mathematics',
    email: 'farhana.akhter@northernstar.edu.bd',
    phone: '+880 1819 222333',
    joinDate: '2019-03-01',
    qualification: 'B.Sc. (Hons), M.Sc. in Applied Math (JU)',
  },
  {
    id: 't-3',
    employeeId: 'NST-2021-08',
    fullName: 'Dr. Mahmudul Hasan',
    designation: 'Associate Professor & Academic Coordinator',
    division: 'college',
    department: 'Chemistry',
    email: 'mahmudul.hasan@northernstar.edu.bd',
    phone: '+880 1912 345678',
    joinDate: '2021-07-01',
    qualification: 'Ph.D. in Chemistry (BUET)',
  },
];

const INITIAL_GUARDIANS: Guardian[] = [
  {
    id: 'g-1',
    userId: 'guard-rahman',
    fullName: 'Mr. Shafiqur Rahman',
    relation: 'Father',
    email: 's.rahman@example.com',
    phone: '+880 1712 998877',
    occupation: 'Civil Engineer',
    address: 'House 42, Road 11, Sector 4, Uttara, Dhaka',
    linkedStudentIds: ['stu-samiul', 'stu-ayesha'],
    password: 'parent123',
    isActive: true,
    createdAt: '2025-01-01',
  },
  {
    id: 'g-2',
    userId: 'guard-hasan',
    fullName: 'Mr. Zahirul Hasan',
    relation: 'Father',
    email: 'zahirul.hasan@example.com',
    phone: '+880 1817 665544',
    occupation: 'Banker',
    address: 'Plot 18, Block D, Bashundhara R/A, Dhaka',
    linkedStudentIds: ['stu-rafiq'],
    password: 'parent123',
    isActive: true,
    createdAt: '2025-01-01',
  }
];

const INITIAL_ADMIN_USERS: AdminUserAccount[] = [
  {
    id: 'usr-admin-01',
    fullName: 'System Administrator',
    email: 'admin@northernstar.edu.bd',
    phone: '+880 1711 000001',
    role: 'institution_admin',
    password: 'admin',
    department: 'Central Administration',
    designation: 'Institution Administrator',
    createdAt: '2025-01-01',
    isActive: true,
  },
  {
    id: 'usr-prin-01',
    fullName: 'Prof. A. K. Azad',
    email: 'principal@northernstar.edu.bd',
    phone: '+880 1711 000002',
    role: 'principal',
    password: 'principal123',
    department: 'Principal Office',
    designation: 'Head of Institution',
    createdAt: '2025-01-01',
    isActive: true,
  },
  {
    id: 'usr-acc-01',
    fullName: 'Senior Accounts Officer',
    email: 'accounts@northernstar.edu.bd',
    phone: '+880 1711 000003',
    role: 'accountant',
    password: 'accounts123',
    department: 'Finance & Accounts',
    designation: 'Senior Accounts Head',
    createdAt: '2025-01-01',
    isActive: true,
  },
  {
    id: 'usr-lib-01',
    fullName: 'Chief Librarian',
    email: 'library@northernstar.edu.bd',
    phone: '+880 1711 000004',
    role: 'librarian',
    password: 'library123',
    department: 'Central Library',
    designation: 'Head Librarian',
    createdAt: '2025-01-01',
    isActive: true,
  },
  {
    id: 'usr-rec-01',
    fullName: 'Front Desk Officer',
    email: 'reception@northernstar.edu.bd',
    phone: '+880 1711 000005',
    role: 'receptionist',
    password: 'reception123',
    department: 'Public Relations & Admissions',
    designation: 'Front Desk In-Charge',
    createdAt: '2025-01-01',
    isActive: true,
  },
  {
    id: 'usr-teach-01',
    fullName: 'Ms. Farhana Akhter',
    email: 'farhana.akhter@northernstar.edu.bd',
    phone: '+880 1711 000006',
    role: 'teacher',
    password: 'teacher123',
    department: 'Science & Mathematics',
    designation: 'Senior Faculty',
    createdAt: '2025-01-01',
    isActive: true,
  }
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-rafiq',
    userId: 'user-rafiq',
    admissionNo: 'NSC-2022-0418',
    rollNo: 'NSC-2025-0147',
    fullName: 'Rafiq Hasan',
    division: 'school',
    classId: 'c-9',
    className: '9 (Science)',
    sectionId: 'sec-9s',
    sectionName: 'Science',
    stream: 'Science',
    sessionId: 'sess-2025',
    dateOfBirth: '2009-08-14',
    gender: 'male',
    bloodGroup: 'B+',
    guardianId: 'g-2',
    guardianName: 'Mr. Zahirul Hasan',
    guardianPhone: '+880 1817 665544',
    address: 'Plot 18, Block D, Bashundhara R/A, Dhaka',
    email: 'rafiq.hasan@student.northernstar.edu.bd',
    phone: '+880 1817 665544',
    enrollmentDate: '2022-01-10',
    status: 'active',
  },
  {
    id: 'stu-samiul',
    userId: 'user-samiul',
    admissionNo: 'NSC-2023-0105',
    rollNo: 'NSC-2025-0082',
    fullName: 'Samiul Rahman',
    division: 'school',
    classId: 'c-7',
    className: 'Class 7 (Science)',
    sectionId: 'sec-7a',
    sectionName: 'Science-A',
    stream: 'General',
    sessionId: 'sess-2025',
    dateOfBirth: '2011-04-19',
    gender: 'male',
    bloodGroup: 'O+',
    guardianId: 'g-1',
    guardianName: 'Mr. Shafiqur Rahman',
    guardianPhone: '+880 1712 998877',
    address: 'House 42, Road 11, Sector 4, Uttara, Dhaka',
    enrollmentDate: '2023-01-05',
    status: 'active',
  },
  {
    id: 'stu-ayesha',
    userId: 'user-ayesha',
    admissionNo: 'NSC-2021-0091',
    rollNo: 'NSC-2025-0015',
    fullName: 'Ayesha Rahman',
    division: 'school',
    classId: 'c-10',
    className: 'Class 10 (Arts)',
    sectionId: 'sec-10a',
    sectionName: 'Arts',
    stream: 'Humanities',
    sessionId: 'sess-2025',
    dateOfBirth: '2008-11-02',
    gender: 'female',
    bloodGroup: 'A+',
    guardianId: 'g-1',
    guardianName: 'Mr. Shafiqur Rahman',
    guardianPhone: '+880 1712 998877',
    address: 'House 42, Road 11, Sector 4, Uttara, Dhaka',
    enrollmentDate: '2021-01-08',
    status: 'active',
  },
  {
    id: 'stu-rahim',
    admissionNo: 'NSC-2025-0612',
    rollNo: 'NSC-2025-0210',
    fullName: 'Rahim Ahmed',
    division: 'school',
    classId: 'c-6',
    className: 'Class 6 (A)',
    sectionId: 'sec-6a',
    sectionName: 'A',
    stream: 'General',
    sessionId: 'sess-2025',
    dateOfBirth: '2012-05-20',
    gender: 'male',
    bloodGroup: 'AB+',
    guardianId: 'g-rahim',
    guardianName: 'Mr. Faruq Ahmed',
    guardianPhone: '+880 1722 334455',
    address: 'Mirpur DOHS, Dhaka',
    enrollmentDate: '2025-04-25',
    status: 'active',
  },
  {
    id: 'stu-sadia',
    admissionNo: 'NSC-2025-0502',
    rollNo: 'NSC-2025-80177',
    fullName: 'Sadia Afrin',
    division: 'college',
    classId: 'c-11',
    className: 'Class 11 (HSC 1st Year)',
    sectionId: 'sec-11b',
    sectionName: 'Business Studies Section 1',
    stream: 'Commerce',
    sessionId: 'sess-2025',
    dateOfBirth: '2007-08-20',
    gender: 'female',
    bloodGroup: 'B+',
    guardianId: 'g-sadia',
    guardianName: 'Mrs. Nasreen Begum',
    guardianPhone: '+880 1819 654321',
    address: 'Mirpur, Dhaka',
    enrollmentDate: '2024-07-01',
    status: 'active',
    sscGpa: 4.94,
    previousBoard: 'Dhaka',
    passingYear: '2024',
  },
  {
    id: 'stu-tanvir',
    admissionNo: 'NSC-2025-0501',
    rollNo: 'NSC-2025-27545',
    fullName: 'Tanvir Ahmed',
    division: 'college',
    classId: 'c-11',
    className: 'Class 11 (HSC 1st Year)',
    sectionId: 'sec-11s',
    sectionName: 'Science Section 1',
    stream: 'Science',
    sessionId: 'sess-2025',
    dateOfBirth: '2007-03-12',
    gender: 'male',
    bloodGroup: 'A+',
    guardianId: 'g-tanvir',
    guardianName: 'Mr. Ahmed Hossain',
    guardianPhone: '+880 1711 123456',
    address: 'Uttara, Dhaka',
    enrollmentDate: '2024-07-01',
    status: 'active',
    sscGpa: 5.00,
    previousBoard: 'Dhaka',
    passingYear: '2024',
  },
  {
    id: 'stu-nabila',
    admissionNo: 'NSC-2025-0309',
    rollNo: 'NSC-2025-0033',
    fullName: 'Nabila Haque',
    division: 'school',
    classId: 'c-3',
    className: 'Class 3 (Shapla)',
    sectionId: 'sec-3a',
    sectionName: 'Section A (Shapla)',
    stream: 'General',
    sessionId: 'sess-2025',
    dateOfBirth: '2015-09-12',
    gender: 'female',
    bloodGroup: 'O+',
    guardianId: 'g-nabila',
    guardianName: 'Dr. Aminul Haque',
    guardianPhone: '+880 1713 556677',
    address: 'Gulshan 2, Dhaka',
    enrollmentDate: '2023-01-15',
    status: 'active',
  },
  {
    id: 'stu-tasnim',
    admissionNo: 'NSC-2025-0101',
    rollNo: 'NSC-2025-0012',
    fullName: 'Tasnim Jarif',
    division: 'school',
    classId: 'c-1',
    className: 'Class 1 (Rose)',
    sectionId: 'sec-1a',
    sectionName: 'Section A (Rose)',
    stream: 'General',
    sessionId: 'sess-2025',
    dateOfBirth: '2018-02-14',
    gender: 'male',
    bloodGroup: 'A+',
    guardianId: 'g-tasnim',
    guardianName: 'Mr. Jahidul Islam',
    guardianPhone: '+880 1718 112233',
    address: 'Dhanmondi, Dhaka',
    enrollmentDate: '2025-01-10',
    status: 'active',
  }
];

const INITIAL_ROUTINE: ClassRoutinePeriod[] = [
  {
    id: 'rt-1',
    classId: 'c-9',
    sectionId: 'sec-9s',
    dayOfWeek: 'Sunday',
    startTime: '08:30',
    endTime: '09:20',
    subjectId: 'sub-math',
    subjectName: 'Mathematics',
    teacherId: 't-2',
    teacherName: 'Ms. Farhana Akhter',
    roomNumber: 'Room 101',
  },
  {
    id: 'rt-2',
    classId: 'c-9',
    sectionId: 'sec-9s',
    dayOfWeek: 'Sunday',
    startTime: '09:30',
    endTime: '10:20',
    subjectId: 'sub-phy',
    subjectName: 'Physics',
    teacherId: 't-1',
    teacherName: 'Mr. Anisur Rahman',
    roomNumber: 'Room 102',
  },
  {
    id: 'rt-3',
    classId: 'c-9',
    sectionId: 'sec-9s',
    dayOfWeek: 'Sunday',
    startTime: '10:30',
    endTime: '11:20',
    subjectId: 'sub-eng',
    subjectName: 'English',
    teacherId: 't-eng',
    teacherName: 'Mr. John Davies',
    roomNumber: 'Room 103',
  },
  {
    id: 'rt-4',
    classId: 'c-9',
    sectionId: 'sec-9s',
    dayOfWeek: 'Sunday',
    startTime: '11:30',
    endTime: '12:20',
    subjectId: 'sub-chem',
    subjectName: 'Chemistry',
    teacherId: 't-3',
    teacherName: 'Dr. Mahmudul Hasan',
    roomNumber: 'Room 104',
  },
];

const INITIAL_EXAMINATIONS: Examination[] = [
  {
    id: 'exam-final-2025',
    title: 'Final Term Examination 2025',
    examType: 'final_term',
    division: 'school',
    sessionId: 'sess-2025',
    startDate: '2025-05-12',
    endDate: '2025-05-28',
    status: 'published',
    maxGpa: 5.0,
  },
  {
    id: 'exam-mid-2025',
    title: 'Mid Term Examination 2025',
    examType: 'mid_term',
    division: 'both',
    sessionId: 'sess-2025',
    startDate: '2025-03-01',
    endDate: '2025-03-15',
    status: 'published',
    maxGpa: 5.0,
  }
];

const INITIAL_MARKS: ExamMark[] = [
  // Samiul Rahman (Class 7)
  {
    id: 'm-1',
    examId: 'exam-final-2025',
    studentId: 'stu-samiul',
    subjectId: 'sub-math',
    marksObtained: 94,
    totalMarks: 100,
    grade: 'A+',
    gradePoint: 5.0,
    remarks: 'Outstanding performance',
  },
  {
    id: 'm-2',
    examId: 'exam-final-2025',
    studentId: 'stu-samiul',
    subjectId: 'sub-eng',
    marksObtained: 78,
    totalMarks: 100,
    grade: 'A',
    gradePoint: 4.0,
    remarks: 'Very Good',
  },
  {
    id: 'm-3',
    examId: 'exam-final-2025',
    studentId: 'stu-samiul',
    subjectId: 'sub-phy',
    marksObtained: 76,
    totalMarks: 100,
    grade: 'A',
    gradePoint: 4.0,
    remarks: 'Consistent work',
  },
  // Rafiq Hasan (Class 9)
  {
    id: 'm-4',
    examId: 'exam-mid-2025',
    studentId: 'stu-rafiq',
    subjectId: 'sub-math',
    marksObtained: 91,
    totalMarks: 100,
    grade: 'A+',
    gradePoint: 5.0,
  },
  {
    id: 'm-5',
    examId: 'exam-mid-2025',
    studentId: 'stu-rafiq',
    subjectId: 'sub-phy',
    marksObtained: 86,
    totalMarks: 100,
    grade: 'A+',
    gradePoint: 5.0,
  },
  {
    id: 'm-6',
    examId: 'exam-mid-2025',
    studentId: 'stu-rafiq',
    subjectId: 'sub-chem',
    marksObtained: 82,
    totalMarks: 100,
    grade: 'A+',
    gradePoint: 5.0,
  },
  {
    id: 'm-7',
    examId: 'exam-mid-2025',
    studentId: 'stu-rafiq',
    subjectId: 'sub-eng',
    marksObtained: 79,
    totalMarks: 100,
    grade: 'A',
    gradePoint: 4.0,
  },
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Final Term Exam Schedule 2025',
    content: 'The finalized schedule for Final Term Examinations for Class 1 to 10 has been published. Exams commence from May 12, 2025. Students are requested to collect their admit cards by May 8.',
    audience: 'all',
    author: 'Academic Head',
    publishDate: '22 Apr 2025',
    priority: 'urgent',
    isPinned: true,
  },
  {
    id: 'not-2',
    title: 'School Picnic & Field Trip Notice',
    content: 'Annual educational field excursion to the National Botanical Garden & Museum is organized for Classes 7, 8 and 9. Consent forms must be submitted to class teachers.',
    audience: 'students',
    author: 'Principal Office',
    publishDate: '18 Apr 2025',
    priority: 'normal',
  },
  {
    id: 'not-3',
    title: 'Fee Payment Reminder for Term 2',
    content: 'All guardians are kindly reminded to clear outstanding tuition fees before the upcoming examination cycle to avoid late processing charges.',
    audience: 'guardians',
    author: 'Accounts Department',
    publishDate: '15 Apr 2025',
    priority: 'normal',
  },
  {
    id: 'not-4',
    title: 'New Library Books Added',
    content: 'Over 250 new books across STEM, English Literature, and Higher Mathematics have been cataloged in the Central Library.',
    audience: 'all',
    author: 'Chief Librarian',
    publishDate: '10 Apr 2025',
    priority: 'normal',
  },
  {
    id: 'not-5',
    title: 'Parent-Teacher Meeting Schedule',
    content: 'Parent-Teacher meeting for secondary and college sections will be held on April 30 from 09:30 AM to 01:30 PM.',
    audience: 'guardians',
    author: 'Administration',
    publishDate: '20 Apr 2025',
    priority: 'urgent',
  }
];

const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-1',
    title: 'Annual Sports Day 2025',
    description: 'Track and field tournaments, inter-house relays, and prize ceremony.',
    startDate: '26 Apr 2025',
    category: 'sports',
    location: 'Main School Grounds',
    isPublic: true,
  },
  {
    id: 'ev-2',
    title: 'Parent-Teacher Meeting',
    description: 'Quarterly review of academic progress, attendance, and feedback.',
    startDate: '30 Apr 2025',
    category: 'meeting',
    location: 'Auditorium & Classrooms',
    isPublic: true,
  },
  {
    id: 'ev-3',
    title: 'Inter-College Science Fair',
    description: 'Robotics, environmental science, and software project displays.',
    startDate: '15 May 2025',
    category: 'academic',
    location: 'Science Complex',
    isPublic: true,
  }
];

const INITIAL_CHARGES: StudentCharge[] = [
  {
    id: 'chg-1',
    studentId: 'stu-rafiq',
    feeCategoryId: 'cat-tuit',
    categoryName: 'Monthly Tuition (April 2025)',
    amount: 3500,
    dueDate: '2025-04-15',
    paidAmount: 3500,
    status: 'paid',
    sessionId: 'sess-2025',
    month: 'April 2025',
  },
  {
    id: 'chg-2',
    studentId: 'stu-samiul',
    feeCategoryId: 'cat-tuit',
    categoryName: 'Monthly Tuition (April 2025)',
    amount: 3000,
    dueDate: '2025-04-15',
    paidAmount: 3000,
    status: 'paid',
    sessionId: 'sess-2025',
    month: 'April 2025',
  },
  {
    id: 'chg-3',
    studentId: 'stu-ayesha',
    feeCategoryId: 'cat-tuit',
    categoryName: 'Monthly Tuition (April 2025)',
    amount: 3500,
    dueDate: '2025-04-15',
    paidAmount: 3500,
    status: 'paid',
    sessionId: 'sess-2025',
    month: 'April 2025',
  }
];

const INITIAL_FEE_INVOICES: FeeInvoice[] = [
  // Child 1 (Samiul - stu-samiul)
  {
    id: 'inv-sam-1',
    studentId: 'stu-samiul',
    title: 'Monthly Tuition - April 2025',
    cycle: 'April 2025',
    amount: 3000,
    dueDate: '2025-04-10',
    status: 'paid',
    paidDate: '2025-04-10 10:15',
    voucherNo: 'NSC-2025-0011',
    paymentId: 'pay-0011'
  },
  {
    id: 'inv-sam-2',
    studentId: 'stu-samiul',
    title: 'Monthly Tuition - May 2025',
    cycle: 'May 2025',
    amount: 3000,
    dueDate: '2025-05-10',
    status: 'due',
  },
  {
    id: 'inv-sam-3',
    studentId: 'stu-samiul',
    title: 'Final Term Examination Fee',
    cycle: 'Term 2',
    amount: 1500,
    dueDate: '2025-05-15',
    status: 'due',
  },
  // Child 2 (Ayesha - stu-ayesha)
  {
    id: 'inv-aye-1',
    studentId: 'stu-ayesha',
    title: 'Monthly Tuition - April 2025',
    cycle: 'April 2025',
    amount: 3800,
    dueDate: '2025-04-10',
    status: 'paid',
    paidDate: '2025-04-09 14:20',
    voucherNo: 'NSC-2025-0008',
    paymentId: 'pay-0008'
  },
  {
    id: 'inv-aye-2',
    studentId: 'stu-ayesha',
    title: 'Monthly Tuition - May 2025',
    cycle: 'May 2025',
    amount: 3800,
    dueDate: '2025-05-10',
    status: 'due',
  },
  // Rafiq Hasan (student-self - stu-rafiq)
  {
    id: 'inv-raf-1',
    studentId: 'stu-rafiq',
    title: 'Monthly Tuition - April 2025',
    cycle: 'April 2025',
    amount: 3500,
    dueDate: '2025-04-12',
    status: 'paid',
    paidDate: '2025-04-12 11:30',
    voucherNo: 'NSC-2025-0012',
    paymentId: 'pay-0012'
  },
  {
    id: 'inv-raf-2',
    studentId: 'stu-rafiq',
    title: 'Monthly Tuition - May 2025',
    cycle: 'May 2025',
    amount: 3500,
    dueDate: '2025-05-10',
    status: 'due',
  }
];

const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-0012',
    voucherNo: 'NSC-2025-0012',
    studentId: 'stu-rafiq',
    studentName: 'Rafiq Hasan',
    classInfo: 'Class 9 (Science)',
    amount: 3500,
    paymentMethod: 'bkash',
    paymentDate: '2025-04-12 11:30',
    transactionRef: 'BK-991208123',
    collectedBy: 'Accounts Officer',
    remarks: 'Monthly Tuition - April 2025',
    status: 'approved',
    approvedBy: 'Accounts Officer',
    approvedDate: '2025-04-12 11:35',
    invoiceId: 'inv-raf-1'
  },
  {
    id: 'pay-0011',
    voucherNo: 'NSC-2025-0011',
    studentId: 'stu-samiul',
    studentName: 'Samiul Rahman',
    classInfo: 'Class 7 (Science)',
    amount: 3000,
    paymentMethod: 'cash',
    paymentDate: '2025-04-10 10:15',
    collectedBy: 'Cash Counter 1',
    remarks: 'Monthly Tuition - April 2025',
    status: 'approved',
    approvedBy: 'Accounts Officer',
    approvedDate: '2025-04-10 10:20',
    invoiceId: 'inv-sam-1'
  },
  {
    id: 'pay-0008',
    voucherNo: 'NSC-2025-0008',
    studentId: 'stu-ayesha',
    studentName: 'Ayesha Rahman',
    classInfo: 'Class 10 (Arts)',
    amount: 3800,
    paymentMethod: 'bkash',
    paymentDate: '2025-04-09 14:20',
    transactionRef: 'BK-882319401',
    collectedBy: 'Accounts Officer',
    remarks: 'Monthly Tuition - April 2025',
    status: 'approved',
    approvedBy: 'Accounts Officer',
    approvedDate: '2025-04-09 14:25',
    invoiceId: 'inv-aye-1'
  }
];

const INITIAL_BOOKS: LibraryBook[] = [
  { id: 'b-1', accessionNo: 'LIB-0101', title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', category: 'Physics', totalCopies: 12, availableCopies: 9, shelfLocation: 'Rack B-3' },
  { id: 'b-2', accessionNo: 'LIB-0102', title: 'Higher Algebra', author: 'Hall & Knight', category: 'Mathematics', totalCopies: 15, availableCopies: 12, shelfLocation: 'Rack A-2' },
  { id: 'b-3', accessionNo: 'LIB-0103', title: 'Introduction to Algorithms', author: 'Cormen et al.', category: 'Computer Science', totalCopies: 6, availableCopies: 4, shelfLocation: 'Rack C-1' },
];

const INITIAL_ROUTES: TransportRoute[] = [
  { id: 'tr-1', routeName: 'Route 1: Uttara - Mirpur - Campus', vehicleNo: 'DHK-METRO-KA-1122', driverName: 'Abdul Karim', driverPhone: '+880 1711 889900', stops: ['Uttara House Building', 'Mirpur 10', 'Dhanmondi', 'Campus Gate'], monthlyFee: 2200 },
  { id: 'tr-2', routeName: 'Route 2: Bashundhara - Badda - Campus', vehicleNo: 'DHK-METRO-KA-3344', driverName: 'Mohammad Rafiq', driverPhone: '+880 1819 556677', stops: ['Bashundhara Gate', 'Natun Bazar', 'Rampura', 'Campus Gate'], monthlyFee: 2000 },
];

const INITIAL_HOMEWORK: HomeworkTask[] = [
  {
    id: 'hw-1',
    title: 'Quadratic Equations & Graphical Analysis',
    subject: 'Higher Mathematics',
    classId: 'c-9',
    className: 'Class 9 (Science)',
    teacherId: 't-2',
    teacherName: 'Ms. Farhana Akhter',
    assignedDate: '2025-04-18',
    dueDate: '2025-05-10', // Open future due date -> PENDING
    totalMarks: 25,
    instructions: 'Complete problems 1 to 10 from Chapter 5.2. Plot the parabola vertices on standard millimetric graph paper.',
    attachmentName: 'Chapter-5-Parabola-Problems.pdf',
  },
  {
    id: 'hw-2',
    title: 'Newtonian Mechanics & Practical Friction',
    subject: 'Physics',
    classId: 'c-9',
    className: 'Class 9 (Science)',
    teacherId: 't-1',
    teacherName: 'Mr. Anisur Rahman',
    assignedDate: '2025-04-15',
    dueDate: '2025-04-20', // Due date expired! Unsubmitted students are automatically listed as ABSENT
    totalMarks: 30,
    instructions: 'Prepare a 3-page formal laboratory experiment report determining coefficient of static and dynamic friction.',
    attachmentName: 'Lab-Manual-Friction-Apparatus.pdf',
  },
  {
    id: 'hw-3',
    title: 'Periodic Trends & Ionization Energy Gradients',
    subject: 'Chemistry',
    classId: 'c-9',
    className: 'Class 9 (Science)',
    teacherId: 't-3',
    teacherName: 'Dr. Mahmudul Hasan',
    assignedDate: '2025-04-10',
    dueDate: '2025-04-18', // Graded
    totalMarks: 25,
    instructions: 'Construct comparison graph for Period 3 ionization potentials with anomalies explained.',
    attachmentName: 'Periodic-Trends-Table.xlsx',
  },
  {
    id: 'hw-4',
    title: 'Trigonometric Ratio Proofs & Heights and Distances',
    subject: 'Higher Mathematics',
    classId: 'c-9',
    className: 'Class 9 (Science)',
    teacherId: 't-2',
    teacherName: 'Ms. Farhana Akhter',
    assignedDate: '2025-04-12',
    dueDate: '2025-04-22', // Overdue! Unsubmitted students are listed as ABSENT
    totalMarks: 20,
    instructions: 'Solve exercise 9.2 problems 11 to 20 with clean geometrical proofs and step-by-step elevations.',
  },
  {
    id: 'hw-5',
    title: 'Bangla Grammar: Orthographic Phonology Rules',
    subject: 'Bangla 2nd Paper',
    classId: 'c-7',
    className: 'Class 7 (Science)',
    teacherId: 't-2',
    teacherName: 'Ms. Farhana Akhter',
    assignedDate: '2025-04-20',
    dueDate: '2025-05-08',
    totalMarks: 20,
    instructions: 'Write 5 core rules and exceptions with original contextual sentence examples for Natwa and Shatwa Bidhan.',
  }
];

const INITIAL_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'subm-1',
    taskId: 'hw-2',
    studentId: 'stu-rafiq',
    studentName: 'Rafiq Hasan',
    rollNo: 'NSC-2025-0147',
    submittedAt: '2025-04-19 16:30',
    status: 'submitted',
    submissionNote: 'Attached handwritten laboratory observations and friction coefficient slope calculation.',
  },
  {
    id: 'subm-2',
    taskId: 'hw-3',
    studentId: 'stu-rafiq',
    studentName: 'Rafiq Hasan',
    rollNo: 'NSC-2025-0147',
    submittedAt: '2025-04-16 11:20',
    status: 'graded',
    obtainedMarks: 24,
    feedback: 'Outstanding clarity on screening effect and subshell electron transitions. Excellent diagrams!',
    submissionNote: 'Graph plotted with electronegativity anomalies highlighted.',
  },
  {
    id: 'subm-3',
    taskId: 'hw-1',
    studentId: 'stu-samiul',
    studentName: 'Samiul Rahman',
    rollNo: 'NSC-2025-0082',
    submittedAt: '2025-04-22 14:10',
    status: 'submitted',
    submissionNote: 'Chapter 5 graph plotting completed.',
  }
];

const INITIAL_ENQUIRIES: AdmissionEnquiry[] = [
  {
    id: 'enq-1',
    applicantName: 'Nusrat Jahan',
    guardianName: 'Mr. Jahangir Alam',
    phone: '+880 1712 345678',
    email: 'jahangir.alam@gmail.com',
    division: 'college',
    desiredClass: 'Class 11 (HSC 1st Year)',
    desiredStream: 'Science',
    sscGpa: 5.00,
    board: 'Dhaka',
    passingYear: '2024',
    previousSchool: 'Viqarunnisa Noon School & College',
    message: 'Seeking admission in HSC Science division. Achieved GPA 5.00 (Golden A+) in SSC 2024.',
    status: 'new',
    submittedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: 'enq-2',
    applicantName: 'Farhan Tanvir',
    guardianName: 'Mrs. Rehana Parvin',
    phone: '+880 1819 876543',
    email: 'rehana.p@yahoo.com',
    division: 'college',
    desiredClass: 'Class 11 (HSC 1st Year)',
    desiredStream: 'Commerce',
    sscGpa: 4.89,
    board: 'Dhaka',
    passingYear: '2024',
    previousSchool: 'Dhaka Residential Model College',
    message: 'Applying for Business Studies group in HSC 1st year.',
    status: 'reviewed',
    submittedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 'enq-3',
    applicantName: 'Mehedi Hasan',
    guardianName: 'Mr. Kamrul Hasan',
    phone: '+880 1911 223344',
    email: 'kamrul.hasan@hotmail.com',
    division: 'school',
    desiredClass: 'Class 9',
    desiredStream: 'Science',
    previousGpa: 4.85,
    board: 'Cumilla',
    passingYear: '2024',
    previousSchool: 'Comilla Zilla School',
    message: 'Transferring to Dhaka due to family relocation. Outstanding academic performance.',
    status: 'interview_scheduled',
    submittedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
  },
  {
    id: 'enq-4',
    applicantName: 'Anika Tabassum',
    guardianName: 'Dr. Mahbubur Rahman',
    phone: '+880 1715 998877',
    division: 'school',
    desiredClass: 'Class 6',
    desiredStream: 'General',
    previousGpa: 5.00,
    previousSchool: 'Ideal Preparatory School',
    message: 'Primary school graduate looking for Class 6 enrollment in secondary school.',
    status: 'new',
    submittedAt: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
  },
  {
    id: 'enq-5',
    applicantName: 'Zidan Al Mamun',
    guardianName: 'Engr. Abdullah Al Mamun',
    phone: '+880 1823 445566',
    division: 'school',
    desiredClass: 'Class 3',
    desiredStream: 'General',
    previousSchool: 'Sunnydale Junior Section',
    status: 'approved',
    submittedAt: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
  }
];

const INITIAL_MASTER_SCHEDULE: MasterSchedulePeriod[] = [
  {
    id: 'per-1',
    periodName: 'Period 1',
    timeSlot: '08:30 - 09:20',
    class9Subject: 'Mathematics (Room 101)',
    class11ScienceSubject: 'Physics 1st (Room 201)',
    class11CommerceSubject: 'Accounting 1st (Room 301)',
  },
  {
    id: 'per-2',
    periodName: 'Period 2',
    timeSlot: '09:30 - 10:20',
    class9Subject: 'Physics (Room 102)',
    class11ScienceSubject: 'Chemistry 1st (Room 202)',
    class11CommerceSubject: 'Business Org 1st (Room 302)',
  },
  {
    id: 'per-brk',
    periodName: 'Break',
    timeSlot: '10:20 - 10:45',
    isBreak: true,
    class9Subject: 'Tiffin & Refreshment Interval',
    class11ScienceSubject: 'Tiffin & Refreshment Interval',
    class11CommerceSubject: 'Tiffin & Refreshment Interval',
  },
  {
    id: 'per-3',
    periodName: 'Period 3',
    timeSlot: '10:45 - 11:35',
    class9Subject: 'English (Room 103)',
    class11ScienceSubject: 'Higher Math 1st (Room 203)',
    class11CommerceSubject: 'Finance & Banking 1st (Room 303)',
  },
  {
    id: 'per-4',
    periodName: 'Period 4',
    timeSlot: '11:45 - 12:35',
    class9Subject: 'Chemistry (Room 104)',
    class11ScienceSubject: 'Biology Practical (STEM Lab)',
    class11CommerceSubject: 'Economics 1st (Room 304)',
  },
];

const INITIAL_ACADEMIC_SESSIONS: AcademicSessionCard[] = [
  {
    id: 'sess-curr',
    name: 'Academic Session 2025–2026',
    duration: 'Jan 01, 2025 – Dec 31, 2025',
    workingDays: '224 Days',
    status: 'active',
    statusLabel: 'Current Active',
  },
  {
    id: 'sess-up',
    name: 'Academic Session 2026–2027',
    duration: 'Jan 01, 2026 – Dec 31, 2026',
    workingDays: '220 Days',
    status: 'upcoming',
    statusLabel: 'Upcoming',
  },
  {
    id: 'sess-arch',
    name: 'Academic Session 2024–2025',
    duration: 'Jan 01, 2024 – Dec 31, 2024',
    workingDays: '222 Days',
    status: 'archived',
    statusLabel: 'Archived',
  },
];

const INITIAL_ACADEMIC_TERMS: AcademicTermItem[] = [
  {
    id: 'term-1',
    termKey: 'Term 1',
    title: 'First Term',
    dateRange: 'Jan 01, 2025 – Apr 25, 2025',
    statusBadge: 'Evaluation Finished',
    statusColor: 'green',
  },
  {
    id: 'term-2',
    termKey: 'Term 2',
    title: 'Mid Term / Half-Yearly',
    dateRange: 'May 02, 2025 – Aug 20, 2025',
    statusBadge: 'Ongoing Academic Term',
    statusColor: 'orange',
  },
  {
    id: 'term-3',
    termKey: 'Term 3',
    title: 'Final Term & Promotion',
    dateRange: 'Sep 01, 2025 – Dec 15, 2025',
    statusBadge: 'Upcoming',
    statusColor: 'violet',
  },
];

const INITIAL_DIVISION_RULES: DivisionRulesData = {
  school: {
    curriculum: 'General Unified National Curriculum',
    streams: 'Science, Commerce, Humanities',
    scienceEligibility: 'Class 8 Math & Science ≥ 70%',
    otherEligibility: 'Class 8 GPA ≥ 3.00',
  },
  college: {
    scienceSeats: '180 Seats (Min SSC GPA: 4.80)',
    businessSeats: '150 Seats (Min SSC GPA: 4.00)',
    humanitiesSeats: '120 Seats (Min SSC GPA: 3.50)',
    boardAffiliation: 'BISE Dhaka Approved',
  },
};

const INITIAL_GRADING_SCALES: GradeScaleRow[] = [
  { id: 'gr-1', markRange: '80% – 100%', letterGrade: 'A+', gradePoint: 5.0, remarks: 'Outstanding', colorClass: 'text-status-green' },
  { id: 'gr-2', markRange: '70% – 79%', letterGrade: 'A', gradePoint: 4.0, remarks: 'Excellent', colorClass: 'text-status-green' },
  { id: 'gr-3', markRange: '60% – 69%', letterGrade: 'A-', gradePoint: 3.5, remarks: 'Very Good', colorClass: 'text-royal' },
  { id: 'gr-4', markRange: '50% – 59%', letterGrade: 'B', gradePoint: 3.0, remarks: 'Good', colorClass: 'text-status-orange' },
  { id: 'gr-5', markRange: '40% – 49%', letterGrade: 'C', gradePoint: 2.0, remarks: 'Satisfactory', colorClass: 'text-slate-700' },
  { id: 'gr-6', markRange: '33% – 39%', letterGrade: 'D', gradePoint: 1.0, remarks: 'Pass', colorClass: 'text-slate-700' },
  { id: 'gr-7', markRange: '0% – 32%', letterGrade: 'F', gradePoint: 0.0, remarks: 'Fail', colorClass: 'text-status-red' },
];

const INITIAL_ASSESSMENT_POLICIES: AssessmentPolicyItem[] = [
  {
    id: 'pol-1',
    title: 'Creative Questions (CQ)',
    description: '70% of total subject marks with analytical problem-solving prompts.',
  },
  {
    id: 'pol-2',
    title: 'Multiple Choice Questions (MCQ)',
    description: '30% of total marks evaluated via standard OMR systems.',
  },
  {
    id: 'pol-3',
    title: 'Science Practicals',
    description: '25 marks hands-on laboratory evaluation for Physics, Chemistry, Biology, and ICT.',
  },
  {
    id: 'pol-4',
    title: 'Optional 4th Subject Rule',
    description: 'All grade points above 2.0 contribute directly to overall GPA elevation.',
  },
];

// Data service class with reactive storage in localStorage / memory
class DataService {
  private students: Student[] = INITIAL_STUDENTS;
  private teachers: Teacher[] = INITIAL_TEACHERS;
  private guardians: Guardian[] = INITIAL_GUARDIANS;
  private adminUsers: AdminUserAccount[] = INITIAL_ADMIN_USERS;
  private classes: AcademicClass[] = INITIAL_CLASSES;
  private sections: Section[] = INITIAL_SECTIONS;
  private subjects: Subject[] = INITIAL_SUBJECTS;
  private routine: ClassRoutinePeriod[] = INITIAL_ROUTINE;
  private examinations: Examination[] = INITIAL_EXAMINATIONS;
  private marks: ExamMark[] = INITIAL_MARKS;
  private charges: StudentCharge[] = INITIAL_CHARGES;
  private feeInvoices: FeeInvoice[] = INITIAL_FEE_INVOICES;
  private payments: PaymentTransaction[] = INITIAL_PAYMENTS;
  private notices: Notice[] = INITIAL_NOTICES;
  private events: SchoolEvent[] = INITIAL_EVENTS;
  private books: LibraryBook[] = INITIAL_BOOKS;
  private routes: TransportRoute[] = INITIAL_ROUTES;
  private homeworkTasks: HomeworkTask[] = INITIAL_HOMEWORK;
  private homeworkSubmissions: HomeworkSubmission[] = INITIAL_SUBMISSIONS;
  private enquiries: AdmissionEnquiry[] = INITIAL_ENQUIRIES;
  private masterSchedule: MasterSchedulePeriod[] = INITIAL_MASTER_SCHEDULE;
  private masterScheduleMeta: { timetableHours: string } = { timetableHours: 'Sunday – Thursday (08:30 AM – 02:00 PM)' };
  private academicSessions: AcademicSessionCard[] = INITIAL_ACADEMIC_SESSIONS;
  private academicTerms: AcademicTermItem[] = INITIAL_ACADEMIC_TERMS;
  private divisionRules: DivisionRulesData = INITIAL_DIVISION_RULES;
  private gradingScales: GradeScaleRow[] = INITIAL_GRADING_SCALES;
  private assessmentPolicies: AssessmentPolicyItem[] = INITIAL_ASSESSMENT_POLICIES;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const s = localStorage.getItem('ns_students');
      if (s) {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          ['stu-nabila', 'stu-tasnim'].forEach(seedId => {
            const foundSeed = INITIAL_STUDENTS.find(st => st.id === seedId);
            if (foundSeed && !parsed.some((p: any) => p.id === seedId)) {
              parsed.push(foundSeed);
            }
          });
          this.students = parsed;
        }
      }

      const t = localStorage.getItem('ns_teachers');
      if (t) this.teachers = JSON.parse(t);

      const fi = localStorage.getItem('ns_fee_invoices');
      if (fi) {
        this.feeInvoices = JSON.parse(fi);
      } else {
        this.feeInvoices = INITIAL_FEE_INVOICES;
        this.saveToStorage('fee_invoices', this.feeInvoices);
      }

      const p = localStorage.getItem('ns_payments');
      if (p) {
        const parsedP = JSON.parse(p);
        if (Array.isArray(parsedP)) {
          this.payments = parsedP.map((pay: any) => ({
            ...pay,
            status: pay.status || 'approved'
          }));
        }
      }

      const n = localStorage.getItem('ns_notices');
      if (n) {
        this.notices = JSON.parse(n);
        let updatedNotices = false;
        this.notices = this.notices.map(item => {
          if (item.content && item.content.includes('Class 6 to 10')) {
            updatedNotices = true;
            return { ...item, content: item.content.replace('Class 6 to 10', 'Class 1 to 10') };
          }
          return item;
        });
        if (updatedNotices) {
          this.saveToStorage('notices', this.notices);
        }
      }

      const eq = localStorage.getItem('ns_enquiries');
      if (eq) {
        const parsedEq = JSON.parse(eq);
        if (Array.isArray(parsedEq) && parsedEq.length > 0) {
          this.enquiries = parsedEq;
        } else {
          this.enquiries = INITIAL_ENQUIRIES;
          this.saveToStorage('enquiries', this.enquiries);
        }
      } else {
        this.enquiries = INITIAL_ENQUIRIES;
        this.saveToStorage('enquiries', this.enquiries);
      }

      const g = localStorage.getItem('ns_guardians');
      if (g) {
        const parsedG = JSON.parse(g);
        if (Array.isArray(parsedG) && parsedG.length > 0) {
          this.guardians = parsedG;
        }
      }

      const adm = localStorage.getItem('ns_admin_users');
      if (adm) {
        const parsedAdm = JSON.parse(adm);
        if (Array.isArray(parsedAdm) && parsedAdm.length > 0) {
          this.adminUsers = parsedAdm;
        }
      }

      const hw = localStorage.getItem('ns_homework');
      if (hw) this.homeworkTasks = JSON.parse(hw);

      const hws = localStorage.getItem('ns_submissions');
      if (hws) this.homeworkSubmissions = JSON.parse(hws);

      const sec = localStorage.getItem('ns_sections');
      if (sec) {
        const parsedSec = JSON.parse(sec);
        if (Array.isArray(parsedSec) && parsedSec.length >= INITIAL_SECTIONS.length) {
          this.sections = parsedSec;
        } else {
          this.sections = INITIAL_SECTIONS;
          this.saveToStorage('sections', this.sections);
        }
      }

      const sub = localStorage.getItem('ns_subjects');
      if (sub) {
        const parsedSub = JSON.parse(sub);
        if (Array.isArray(parsedSub) && parsedSub.length >= 25) {
          this.subjects = parsedSub;
        } else {
          this.subjects = INITIAL_SUBJECTS;
          this.saveToStorage('subjects', this.subjects);
        }
      }

      const ms = localStorage.getItem('ns_master_schedule');
      if (ms) this.masterSchedule = JSON.parse(ms);

      const msm = localStorage.getItem('ns_master_schedule_meta');
      if (msm) this.masterScheduleMeta = JSON.parse(msm);

      const as = localStorage.getItem('ns_academic_sessions');
      if (as) this.academicSessions = JSON.parse(as);

      const at = localStorage.getItem('ns_academic_terms');
      if (at) this.academicTerms = JSON.parse(at);

      const dr = localStorage.getItem('ns_division_rules');
      if (dr) this.divisionRules = JSON.parse(dr);

      const gs = localStorage.getItem('ns_grading_scales');
      if (gs) this.gradingScales = JSON.parse(gs);

      const ap = localStorage.getItem('ns_assessment_policies');
      if (ap) this.assessmentPolicies = JSON.parse(ap);
    } catch {
      // Keep defaults
    }
  }

  private saveToStorage(key: string, data: unknown) {
    try {
      localStorage.setItem(`ns_${key}`, JSON.stringify(data));
    } catch {
      // Storage full or unavailable
    }
    // Background cloud replication if Firestore is online
    if (Array.isArray(data) && firestoreService.isAvailable()) {
      if (['students', 'teachers', 'guardians', 'admin_users', 'notices', 'fee_invoices'].includes(key)) {
        data.forEach((item: any) => {
          if (item && item.id) {
            firestoreService.saveDocument(key, item.id, item).catch(() => {});
          }
        });
      }
    }
  }

  /**
   * Sync all local school records (students, teachers, admins, guardians, etc.) directly into Cloud Firestore
   */
  public async syncAllToFirestore() {
    return firestoreService.syncAllToCloud({
      students: this.students,
      teachers: this.teachers,
      guardians: this.guardians,
      adminUsers: this.adminUsers,
      classes: this.classes,
      sections: this.sections,
      notices: this.notices,
      feeInvoices: this.feeInvoices,
    });
  }

  /**
   * Check connection status of Cloud Firestore
   */
  public getFirestoreStatus() {
    return firestoreService.getStatus();
  }

  /**
   * Pull latest data from Cloud Firestore if available
   */
  public async hydrateFromFirestore(): Promise<boolean> {
    try {
      const cloudData = await firestoreService.fetchCloudDataset();
      let updated = false;
      if (cloudData.students && cloudData.students.length > 0) {
        this.students = cloudData.students;
        this.saveToStorage('students', this.students);
        updated = true;
      }
      if (cloudData.teachers && cloudData.teachers.length > 0) {
        this.teachers = cloudData.teachers;
        this.saveToStorage('teachers', this.teachers);
        updated = true;
      }
      if (cloudData.guardians && cloudData.guardians.length > 0) {
        this.guardians = cloudData.guardians;
        this.saveToStorage('guardians', this.guardians);
        updated = true;
      }
      if (cloudData.adminUsers && cloudData.adminUsers.length > 0) {
        this.adminUsers = cloudData.adminUsers;
        this.saveToStorage('admin_users', this.adminUsers);
        updated = true;
      }
      if (cloudData.notices && cloudData.notices.length > 0) {
        this.notices = cloudData.notices;
        this.saveToStorage('notices', this.notices);
        updated = true;
      }
      return updated;
    } catch {
      return false;
    }
  }

  // Dashboard Aggregates (matching the exact reference screenshot)
  getAdminStats() {
    return {
      totalStudents: 1248, // Live baseline
      studentsChange: '+12%',
      totalTeachers: 86,
      teachersChange: '+6%',
      totalClasses: 42,
      classesChange: '- 0%',
      totalStaff: 28,
      staffChange: '+3%',
      schoolStudents: 780,
      collegeStudents: 468,
      recentActivities: [
        {
          id: 'act-1',
          type: 'student',
          title: 'New student admitted',
          detail: 'Rahim Ahmed (Class 6)',
          timeAgo: '2 hours ago',
          badgeColor: 'blue',
        },
        {
          id: 'act-2',
          type: 'payment',
          title: 'Fee payment received',
          detail: 'ID: NSC-2025-0012',
          timeAgo: '3 hours ago',
          badgeColor: 'green',
        },
        {
          id: 'act-3',
          type: 'attendance',
          title: 'Teacher attendance updated',
          detail: 'Ms. Farhana Akhter',
          timeAgo: '5 hours ago',
          badgeColor: 'blue',
        },
        {
          id: 'act-4',
          type: 'exam',
          title: 'Exam schedule published',
          detail: 'Final Term - Class 9 & 10',
          timeAgo: '6 hours ago',
          badgeColor: 'red',
        },
      ],
      enrollmentTrend: [
        { month: 'Jan', school: 360, college: 220 },
        { month: 'Feb', school: 430, college: 260 },
        { month: 'Mar', school: 520, college: 310 },
        { month: 'Apr', school: 610, college: 380 },
        { month: 'May', school: 680, college: 420 },
        { month: 'Jun', school: 750, college: 460 },
        { month: 'Jul', school: 780, college: 510 },
        { month: 'Aug', school: 840, college: 560 },
        { month: 'Sep', school: 890, college: 600 },
        { month: 'Oct', school: 950, college: 640 },
        { month: 'Nov', school: 1060, college: 690 },
        { month: 'Dec', school: 1120, college: 720 },
      ]
    };
  }

  // Students
  getStudents(filter?: { division?: string; classId?: string; search?: string }): Student[] {
    let list = [...this.students];
    if (filter?.division) {
      list = list.filter(s => s.division === filter.division);
    }
    if (filter?.classId) {
      list = list.filter(s => s.classId === filter.classId);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(s => 
        s.fullName.toLowerCase().includes(q) || 
        s.admissionNo.toLowerCase().includes(q) || 
        s.rollNo.toLowerCase().includes(q)
      );
    }
    return list;
  }

  getStudentById(id: string): Student | undefined {
    return this.students.find(s => s.id === id || s.userId === id);
  }

  addStudent(student: Omit<Student, 'id'>): Student {
    const newStudent: Student = {
      ...student,
      id: `stu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };
    this.students.unshift(newStudent);
    this.saveToStorage('students', this.students);
    return newStudent;
  }

  importStudents(records: Omit<Student, 'id'>[]): { successCount: number; errors: string[] } {
    const errors: string[] = [];
    let successCount = 0;

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      if (!row.fullName || !row.rollNo) {
        errors.push(`Row ${i + 1}: Missing student name or roll number.`);
        continue;
      }
      // Check for duplicate roll within same class
      const exists = this.students.some(s => s.rollNo.toLowerCase() === row.rollNo.toLowerCase() && s.classId === row.classId);
      if (exists) {
        errors.push(`Row ${i + 1} (${row.fullName}): Roll ${row.rollNo} already exists in ${row.className}.`);
        continue;
      }
      const newStudent: Student = {
        ...row,
        id: `stu-${Date.now()}-${i}-${Math.floor(Math.random() * 1000)}`,
      };
      this.students.unshift(newStudent);
      successCount++;
    }

    if (successCount > 0) {
      this.saveToStorage('students', this.students);
    }
    return { successCount, errors };
  }

  addSection(section: Omit<Section, 'id'>): Section {
    const newSec: Section = {
      ...section,
      id: `sec-${Date.now()}`,
    };
    this.sections.push(newSec);
    this.saveToStorage('sections', this.sections);
    return newSec;
  }

  addSubject(subject: Omit<Subject, 'id'>): Subject {
    const newSub: Subject = {
      ...subject,
      id: `sub-${Date.now()}`,
    };
    this.subjects.push(newSub);
    this.saveToStorage('subjects', this.subjects);
    return newSub;
  }

  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.students[idx] = { ...this.students[idx], ...updates };
    this.saveToStorage('students', this.students);
    return this.students[idx];
  }

  // Teachers
  getTeachers(): Teacher[] {
    return this.teachers;
  }

  addTeacher(teacher: Omit<Teacher, 'id'>): Teacher {
    const newTeacher: Teacher = {
      ...teacher,
      id: `t-${Date.now()}`,
    };
    this.teachers.unshift(newTeacher);
    this.saveToStorage('teachers', this.teachers);
    return newTeacher;
  }

  // Academic Structure
  getClasses(): AcademicClass[] {
    return this.classes;
  }

  getSections(classId?: string): Section[] {
    if (classId) return this.sections.filter(s => s.classId === classId);
    return this.sections;
  }

  getSubjects(classId?: string): Subject[] {
    if (classId) return this.subjects.filter(s => s.classId === classId);
    return this.subjects;
  }

  getRoutine(classId?: string): ClassRoutinePeriod[] {
    if (classId) return this.routine.filter(r => r.classId === classId);
    return this.routine;
  }

  // Examinations & Results
  getExaminations(): Examination[] {
    return this.examinations;
  }

  getStudentMarks(studentId: string, examId?: string): ExamMark[] {
    const existing = this.marks.filter(m => m.studentId === studentId && (!examId || m.examId === examId));
    if (existing.length > 0) return existing;
    return this.generateDefaultMarksForStudent(studentId, examId || 'exam-mid-2025');
  }

  generateDefaultMarksForStudent(studentId: string, examId: string = 'exam-mid-2025'): ExamMark[] {
    if (studentId === 'stu-ayesha') {
      return [
        { id: `m-ay-1`, examId, studentId, subjectId: 'sub-econ', marksObtained: 88, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Excellent analytical understanding' },
        { id: `m-ay-2`, examId, studentId, subjectId: 'sub-civ', marksObtained: 85, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Outstanding work' },
        { id: `m-ay-3`, examId, studentId, subjectId: 'sub-his', marksObtained: 82, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Very Good' },
        { id: `m-ay-4`, examId, studentId, subjectId: 'sub-eng', marksObtained: 80, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Fluent presentation' },
        { id: `m-ay-5`, examId, studentId, subjectId: 'sub-ban', marksObtained: 90, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Exemplary' },
        { id: `m-ay-6`, examId, studentId, subjectId: 'sub-ict', marksObtained: 86, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Proficient' },
      ];
    }
    
    // Default curriculum marks for any linked student
    return [
      { id: `m-def-${studentId}-1`, examId, studentId, subjectId: 'sub-math', marksObtained: 85, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Strong mathematical aptitude' },
      { id: `m-def-${studentId}-2`, examId, studentId, subjectId: 'sub-sci', marksObtained: 88, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Outstanding scientific enquiry' },
      { id: `m-def-${studentId}-3`, examId, studentId, subjectId: 'sub-eng', marksObtained: 82, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Very Good comprehension' },
      { id: `m-def-${studentId}-4`, examId, studentId, subjectId: 'sub-ban', marksObtained: 84, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Clear language skills' },
      { id: `m-def-${studentId}-5`, examId, studentId, subjectId: 'sub-ict', marksObtained: 90, totalMarks: 100, grade: 'A+', gradePoint: 5.0, remarks: 'Excellent computational thinking' },
    ];
  }

  saveExamMark(mark: ExamMark): void {
    const idx = this.marks.findIndex(m => m.id === mark.id || (m.examId === mark.examId && m.studentId === mark.studentId && m.subjectId === mark.subjectId));
    if (idx >= 0) {
      this.marks[idx] = mark;
    } else {
      this.marks.push({ ...mark, id: mark.id || `m-${Date.now()}` });
    }
  }

  // Fees & Payments
  getStudentCharges(studentId: string): StudentCharge[] {
    return this.charges.filter(c => c.studentId === studentId);
  }

  getFeeInvoices(studentId?: string): FeeInvoice[] {
    if (studentId) return this.feeInvoices.filter(i => i.studentId === studentId);
    return this.feeInvoices;
  }

  getPayments(studentId?: string): PaymentTransaction[] {
    if (studentId) return this.payments.filter(p => p.studentId === studentId);
    return this.payments;
  }

  recordPayment(payment: Omit<PaymentTransaction, 'id' | 'voucherNo'>): PaymentTransaction {
    const voucherNo = `NSC-2025-${String(this.payments.length + 14).padStart(4, '0')}`;
    const newPayment: PaymentTransaction = {
      ...payment,
      id: `pay-${Date.now()}`,
      voucherNo,
      status: payment.status || 'pending',
    };
    this.payments.unshift(newPayment);
    this.saveToStorage('payments', this.payments);

    // If an invoice is referenced, link and set to pending/paid
    if (newPayment.invoiceId) {
      const idx = this.feeInvoices.findIndex(inv => inv.id === newPayment.invoiceId);
      if (idx >= 0) {
        this.feeInvoices[idx] = {
          ...this.feeInvoices[idx],
          status: newPayment.status === 'approved' ? 'paid' : 'pending',
          paidDate: newPayment.paymentDate,
          voucherNo: newPayment.voucherNo,
          paymentId: newPayment.id,
        };
        this.saveToStorage('fee_invoices', this.feeInvoices);
      }
    }

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fee-payments-updated', { detail: newPayment }));
      }
    } catch {
      // safe fallback
    }

    return newPayment;
  }

  approvePayment(paymentId: string, approvedBy: string = 'Accounts Admin'): PaymentTransaction | null {
    const pIdx = this.payments.findIndex(p => p.id === paymentId);
    if (pIdx < 0) return null;

    const approvalDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    this.payments[pIdx] = {
      ...this.payments[pIdx],
      status: 'approved',
      approvedBy,
      approvedDate: approvalDate,
    };
    this.saveToStorage('payments', this.payments);

    const payment = this.payments[pIdx];

    // Find and update linked invoice
    let invIdx = this.feeInvoices.findIndex(inv => 
      (payment.invoiceId && inv.id === payment.invoiceId) ||
      inv.paymentId === payment.id ||
      (inv.voucherNo && inv.voucherNo === payment.voucherNo)
    );

    // Fallback: match by studentId, amount, and pending status
    if (invIdx < 0) {
      invIdx = this.feeInvoices.findIndex(inv => 
        inv.studentId === payment.studentId && 
        inv.amount === payment.amount && 
        inv.status === 'pending'
      );
    }

    if (invIdx >= 0) {
      this.feeInvoices[invIdx] = {
        ...this.feeInvoices[invIdx],
        status: 'paid',
        paidDate: payment.paymentDate,
        voucherNo: payment.voucherNo,
        paymentId: payment.id,
      };
      this.saveToStorage('fee_invoices', this.feeInvoices);
    }

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fee-payments-updated', { detail: payment }));
      }
    } catch {
      // safe fallback
    }

    return payment;
  }

  rejectPayment(paymentId: string, reason: string = 'Payment verification rejected'): PaymentTransaction | null {
    const pIdx = this.payments.findIndex(p => p.id === paymentId);
    if (pIdx < 0) return null;

    this.payments[pIdx] = {
      ...this.payments[pIdx],
      status: 'rejected',
      rejectionReason: reason,
    };
    this.saveToStorage('payments', this.payments);

    const payment = this.payments[pIdx];

    // Revert associated invoice back to due
    let invIdx = this.feeInvoices.findIndex(inv => 
      (payment.invoiceId && inv.id === payment.invoiceId) ||
      inv.paymentId === payment.id ||
      (inv.voucherNo && inv.voucherNo === payment.voucherNo)
    );

    if (invIdx >= 0) {
      this.feeInvoices[invIdx] = {
        ...this.feeInvoices[invIdx],
        status: 'due',
        paidDate: undefined,
        voucherNo: undefined,
        paymentId: undefined,
      };
      this.saveToStorage('fee_invoices', this.feeInvoices);
    }

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fee-payments-updated', { detail: payment }));
      }
    } catch {
      // safe fallback
    }

    return payment;
  }

  // Notices & Events
  getNotices(audience?: string): Notice[] {
    if (!audience || audience === 'all') return this.notices;
    return this.notices.filter(n => n.audience === 'all' || n.audience === audience);
  }

  addNotice(notice: Omit<Notice, 'id'>): Notice {
    const newNotice: Notice = {
      ...notice,
      id: `not-${Date.now()}`,
    };
    this.notices.unshift(newNotice);
    this.saveToStorage('notices', this.notices);
    return newNotice;
  }

  deleteNotice(id: string): boolean {
    const initialLen = this.notices.length;
    this.notices = this.notices.filter(n => n.id !== id);
    if (this.notices.length !== initialLen) {
      this.saveToStorage('notices', this.notices);
      firestoreService.deleteDocument('notices', id).catch(() => {});
      return true;
    }
    return false;
  }

  getEvents(): SchoolEvent[] {
    return this.events;
  }

  // Guardians
  getGuardianById(id: string): Guardian | undefined {
    return this.guardians.find(g => g.id === id || g.userId === id);
  }

  getGuardianChildren(guardianIdOrUserId: string = 'g-1'): Student[] {
    const guardian = this.guardians.find(g => g.id === guardianIdOrUserId || g.userId === guardianIdOrUserId) || this.guardians[0];
    if (guardian && guardian.linkedStudentIds && guardian.linkedStudentIds.length > 0) {
      const found = this.students.filter(s => guardian.linkedStudentIds.includes(s.id));
      if (found.length > 0) return found;
    }
    // Fallback: students matching guardianId or default g-1 children
    const byId = this.students.filter(s => s.guardianId === guardian?.id || s.guardianId === 'g-1');
    if (byId.length > 0) return byId;
    return this.students.filter(s => s.id === 'stu-samiul' || s.id === 'stu-ayesha');
  }

  addChildToGuardian(guardianId: string = 'g-1', childData: { fullName: string; className: string; rollNo?: string; admissionNo?: string; division?: 'school' | 'college' }): Student {
    const guardian = this.guardians.find(g => g.id === guardianId || g.userId === guardianId) || this.guardians[0];
    const newStudentId = `stu-child-${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      fullName: childData.fullName,
      className: childData.className,
      classId: childData.className.toLowerCase().includes('11') || childData.className.toLowerCase().includes('12') ? 'c-11' : 'c-8',
      division: childData.division || (childData.className.toLowerCase().includes('11') || childData.className.toLowerCase().includes('12') ? 'college' : 'school'),
      rollNo: childData.rollNo || `NSC-2025-${String(Math.floor(100 + Math.random() * 900))}`,
      admissionNo: childData.admissionNo || `NSC-2025-${String(Math.floor(1000 + Math.random() * 9000))}`,
      gender: 'male',
      sectionId: 'sec-8a',
      sectionName: 'A',
      address: guardian.address || 'Dhaka, Bangladesh',
      enrollmentDate: '2025-01-10',
      guardianId: guardian.id,
      guardianName: guardian.fullName,
      guardianPhone: guardian.phone,
      sessionId: 'sess-2025',
      dateOfBirth: '2012-05-15',
      status: 'active',
    };

    this.students.push(newStudent);
    if (!guardian.linkedStudentIds.includes(newStudentId)) {
      guardian.linkedStudentIds.push(newStudentId);
    }

    this.saveToStorage('students', this.students);
    this.saveToStorage('guardians', this.guardians);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('guardian-children-updated'));
    }

    return newStudent;
  }

  linkExistingStudentToGuardian(studentIdOrQuery: string, guardianId: string = 'g-1'): Student | null {
    const guardian = this.guardians.find(g => g.id === guardianId || g.userId === guardianId) || this.guardians[0];
    const query = studentIdOrQuery.trim().toLowerCase();
    const student = this.students.find(s => 
      s.id.toLowerCase() === query ||
      s.rollNo.toLowerCase() === query ||
      s.admissionNo.toLowerCase() === query ||
      s.fullName.toLowerCase().includes(query)
    );

    if (student && guardian) {
      if (!guardian.linkedStudentIds.includes(student.id)) {
        guardian.linkedStudentIds.push(student.id);
        student.guardianId = guardian.id;
        student.guardianName = guardian.fullName;
        this.saveToStorage('guardians', this.guardians);
        this.saveToStorage('students', this.students);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('guardian-children-updated'));
        }
      }
      return student;
    }
    return null;
  }

  // Guardians Management
  getGuardians(): Guardian[] {
    return this.guardians;
  }

  addGuardian(data: Omit<Guardian, 'id'>): Guardian {
    const newId = `g-${Date.now()}`;
    const newGuardian: Guardian = {
      ...data,
      id: newId,
      userId: data.userId || `guard-${Date.now()}`,
      linkedStudentIds: data.linkedStudentIds || [],
      password: data.password || 'parent123',
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: data.createdAt || new Date().toISOString().substring(0, 10),
    };

    // Update students' guardian fields for newly linked students
    newGuardian.linkedStudentIds.forEach(stuId => {
      const student = this.students.find(s => s.id === stuId);
      if (student) {
        student.guardianId = newId;
        student.guardianName = newGuardian.fullName;
        student.guardianPhone = newGuardian.phone;
      }
    });

    this.guardians.push(newGuardian);
    this.saveToStorage('guardians', this.guardians);
    this.saveToStorage('students', this.students);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('guardian-children-updated'));
    }
    return newGuardian;
  }

  updateGuardian(id: string, updates: Partial<Guardian>): Guardian | null {
    const idx = this.guardians.findIndex(g => g.id === id || g.userId === id);
    if (idx === -1) return null;
    this.guardians[idx] = { ...this.guardians[idx], ...updates };

    if (updates.fullName || updates.phone) {
      this.students.forEach(s => {
        if (s.guardianId === id || this.guardians[idx].linkedStudentIds.includes(s.id)) {
          if (updates.fullName) s.guardianName = updates.fullName;
          if (updates.phone) s.guardianPhone = updates.phone;
        }
      });
      this.saveToStorage('students', this.students);
    }

    this.saveToStorage('guardians', this.guardians);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('guardian-children-updated'));
    }
    return this.guardians[idx];
  }

  deleteGuardian(id: string): boolean {
    const initialLen = this.guardians.length;
    this.guardians = this.guardians.filter(g => g.id !== id && g.userId !== id);
    if (this.guardians.length !== initialLen) {
      this.saveToStorage('guardians', this.guardians);
      firestoreService.deleteDocument('guardians', id).catch(() => {});
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('guardian-children-updated'));
      }
      return true;
    }
    return false;
  }

  getGuardianByEmailOrPhone(query: string): Guardian | undefined {
    const q = query.trim().toLowerCase();
    const cleanQ = q.replace(/[^0-9]/g, '');
    return this.guardians.find(g => {
      const gEmail = g.email.toLowerCase().trim();
      const gPhone = g.phone.replace(/[^0-9]/g, '');
      const gName = g.fullName.toLowerCase().trim();
      return gEmail === q || (cleanQ.length > 5 && gPhone.includes(cleanQ)) || gName === q;
    });
  }

  // Admin & Staff User Accounts Management
  getAdminUsers(): AdminUserAccount[] {
    return this.adminUsers;
  }

  addAdminUser(data: Omit<AdminUserAccount, 'id' | 'createdAt'>): AdminUserAccount {
    const newId = `usr-${Date.now()}`;
    const newUser: AdminUserAccount = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString().substring(0, 10),
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
    this.adminUsers.unshift(newUser);
    this.saveToStorage('admin_users', this.adminUsers);
    return newUser;
  }

  updateAdminUser(id: string, updates: Partial<AdminUserAccount>): AdminUserAccount | null {
    const idx = this.adminUsers.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.adminUsers[idx] = { ...this.adminUsers[idx], ...updates };
    this.saveToStorage('admin_users', this.adminUsers);
    return this.adminUsers[idx];
  }

  deleteAdminUser(id: string): boolean {
    const initialLen = this.adminUsers.length;
    this.adminUsers = this.adminUsers.filter(u => u.id !== id);
    if (this.adminUsers.length !== initialLen) {
      this.saveToStorage('admin_users', this.adminUsers);
      firestoreService.deleteDocument('admin_users', id).catch(() => {});
      return true;
    }
    return false;
  }

  getAdminUserByEmail(email: string): AdminUserAccount | undefined {
    const q = email.trim().toLowerCase();
    return this.adminUsers.find(u => u.email.toLowerCase() === q);
  }

  // Library & Transport
  getBooks(): LibraryBook[] {
    return this.books;
  }

  getRoutes(): TransportRoute[] {
    return this.routes;
  }

  // Admissions Enquiries
  getEnquiries(): AdmissionEnquiry[] {
    return this.enquiries;
  }

  submitEnquiry(enquiry: Omit<AdmissionEnquiry, 'id' | 'status' | 'submittedAt'>): AdmissionEnquiry {
    const newEnquiry: AdmissionEnquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'new',
      submittedAt: new Date().toISOString(),
    };
    this.enquiries.unshift(newEnquiry);
    this.saveToStorage('enquiries', this.enquiries);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('enquiries-updated'));
    }
    return newEnquiry;
  }

  updateEnquiryStatus(id: string, status: AdmissionEnquiry['status'], notes?: string): boolean {
    const enq = this.enquiries.find(e => e.id === id);
    if (!enq) return false;
    enq.status = status;
    if (notes !== undefined) enq.notes = notes;
    this.saveToStorage('enquiries', this.enquiries);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('enquiries-updated'));
    }
    return true;
  }

  deleteEnquiry(id: string): boolean {
    const initialLen = this.enquiries.length;
    this.enquiries = this.enquiries.filter(e => e.id !== id);
    if (this.enquiries.length !== initialLen) {
      this.saveToStorage('enquiries', this.enquiries);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('enquiries-updated'));
      }
      return true;
    }
    return false;
  }

  // Homework & Coursework Tasks
  getHomeworkTasks(classId?: string, teacherId?: string): HomeworkTask[] {
    let result = this.homeworkTasks;
    if (classId) {
      result = result.filter(t => t.classId === classId);
    }
    if (teacherId) {
      result = result.filter(t => t.teacherId === teacherId);
    }
    return result;
  }

  getHomeworkById(id: string): HomeworkTask | undefined {
    return this.homeworkTasks.find(t => t.id === id);
  }

  createHomeworkTask(task: Omit<HomeworkTask, 'id' | 'assignedDate'>): HomeworkTask {
    const newTask: HomeworkTask = {
      ...task,
      id: `hw-${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0],
    };
    this.homeworkTasks.unshift(newTask);
    this.saveToStorage('homework', this.homeworkTasks);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('homework-updated'));
    }
    return newTask;
  }

  deleteHomeworkTask(id: string): boolean {
    const initialLen = this.homeworkTasks.length;
    this.homeworkTasks = this.homeworkTasks.filter(t => t.id !== id);
    if (this.homeworkTasks.length !== initialLen) {
      this.saveToStorage('homework', this.homeworkTasks);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('homework-updated'));
      }
      return true;
    }
    return false;
  }

  getStudentHomeworkStatus(taskId: string, studentId: string): {
    status: 'pending' | 'submitted' | 'graded' | 'absent';
    submission?: HomeworkSubmission;
    isOverdue: boolean;
  } {
    const task = this.homeworkTasks.find(t => t.id === taskId);
    const submission = this.homeworkSubmissions.find(s => s.taskId === taskId && s.studentId === studentId);

    if (submission) {
      return { status: submission.status, submission, isOverdue: false };
    }

    if (!task) return { status: 'pending', isOverdue: false };

    // Check if due date is in the past
    const dueTime = new Date(task.dueDate.includes('T') ? task.dueDate : `${task.dueDate}T23:59:59`).getTime();
    const now = new Date().getTime();
    const isOverdue = dueTime < now;

    if (isOverdue) {
      return { status: 'absent', isOverdue: true };
    }

    return { status: 'pending', isOverdue: false };
  }

  submitHomework(taskId: string, studentId: string, submissionNote: string): HomeworkSubmission {
    const student = this.students.find(s => s.id === studentId) || {
      fullName: 'Rafiq Hasan',
      rollNo: 'NSC-2025-0147'
    };

    const newSubm: HomeworkSubmission = {
      id: `subm-${Date.now()}`,
      taskId,
      studentId,
      studentName: student.fullName,
      rollNo: student.rollNo,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'submitted',
      submissionNote,
    };

    const existingIdx = this.homeworkSubmissions.findIndex(s => s.taskId === taskId && s.studentId === studentId);
    if (existingIdx >= 0) {
      this.homeworkSubmissions[existingIdx] = newSubm;
    } else {
      this.homeworkSubmissions.push(newSubm);
    }

    this.saveToStorage('submissions', this.homeworkSubmissions);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('homework-updated'));
    }
    return newSubm;
  }

  getTaskRoster(taskId: string): {
    student: Student;
    status: 'pending' | 'submitted' | 'graded' | 'absent';
    submission?: HomeworkSubmission;
  }[] {
    const task = this.homeworkTasks.find(t => t.id === taskId);
    if (!task) return [];

    const enrolledStudents = this.students.filter(s => s.classId === task.classId);
    const targetStudents = enrolledStudents.length > 0 ? enrolledStudents : this.students.slice(0, 5);

    return targetStudents.map(student => {
      const evalStatus = this.getStudentHomeworkStatus(taskId, student.id);
      return {
        student,
        status: evalStatus.status,
        submission: evalStatus.submission,
      };
    });
  }

  // Master Daily Timetable / Schedule (Academic Hub)
  getMasterSchedule(): MasterSchedulePeriod[] {
    return this.masterSchedule;
  }

  getMasterScheduleMeta(): { timetableHours: string } {
    return this.masterScheduleMeta;
  }

  updateMasterScheduleMeta(meta: { timetableHours: string }) {
    this.masterScheduleMeta = meta;
    this.saveToStorage('master_schedule_meta', this.masterScheduleMeta);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
  }

  addMasterSchedulePeriod(period: Omit<MasterSchedulePeriod, 'id'>): MasterSchedulePeriod {
    const newPer: MasterSchedulePeriod = {
      ...period,
      id: `per-${Date.now()}`,
    };
    this.masterSchedule.push(newPer);
    this.saveToStorage('master_schedule', this.masterSchedule);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
    return newPer;
  }

  updateMasterSchedulePeriod(id: string, updated: Partial<MasterSchedulePeriod>): boolean {
    const idx = this.masterSchedule.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.masterSchedule[idx] = { ...this.masterSchedule[idx], ...updated };
    this.saveToStorage('master_schedule', this.masterSchedule);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
    return true;
  }

  deleteMasterSchedulePeriod(id: string): boolean {
    const prevLen = this.masterSchedule.length;
    this.masterSchedule = this.masterSchedule.filter(p => p.id !== id);
    if (this.masterSchedule.length !== prevLen) {
      this.saveToStorage('master_schedule', this.masterSchedule);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
      return true;
    }
    return false;
  }

  // Academic Sessions
  getAcademicSessions(): AcademicSessionCard[] {
    return this.academicSessions;
  }

  addAcademicSession(session: Omit<AcademicSessionCard, 'id'>): AcademicSessionCard {
    const newSess: AcademicSessionCard = {
      ...session,
      id: `sess-${Date.now()}`,
    };
    this.academicSessions.unshift(newSess);
    this.saveToStorage('academic_sessions', this.academicSessions);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
    return newSess;
  }

  updateAcademicSession(id: string, updated: Partial<AcademicSessionCard>): boolean {
    const idx = this.academicSessions.findIndex(s => s.id === id);
    if (idx === -1) return false;
    this.academicSessions[idx] = { ...this.academicSessions[idx], ...updated };
    this.saveToStorage('academic_sessions', this.academicSessions);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
    return true;
  }

  deleteAcademicSession(id: string): boolean {
    const prevLen = this.academicSessions.length;
    this.academicSessions = this.academicSessions.filter(s => s.id !== id);
    if (this.academicSessions.length !== prevLen) {
      this.saveToStorage('academic_sessions', this.academicSessions);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
      return true;
    }
    return false;
  }

  setActiveAcademicSession(id: string): boolean {
    let found = false;
    this.academicSessions = this.academicSessions.map(s => {
      if (s.id === id) {
        found = true;
        return { ...s, status: 'active', statusLabel: 'Current Active' };
      } else if (s.status === 'active') {
        return { ...s, status: 'archived', statusLabel: 'Archived' };
      }
      return s;
    });
    if (found) {
      this.saveToStorage('academic_sessions', this.academicSessions);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
      return true;
    }
    return false;
  }

  // Academic Terms
  getAcademicTerms(): AcademicTermItem[] {
    return this.academicTerms;
  }

  addAcademicTerm(term: Omit<AcademicTermItem, 'id'>): AcademicTermItem {
    const newTerm: AcademicTermItem = {
      ...term,
      id: `term-${Date.now()}`,
    };
    this.academicTerms.push(newTerm);
    this.saveToStorage('academic_terms', this.academicTerms);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
    return newTerm;
  }

  updateAcademicTerm(id: string, updated: Partial<AcademicTermItem>): boolean {
    const idx = this.academicTerms.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.academicTerms[idx] = { ...this.academicTerms[idx], ...updated };
    this.saveToStorage('academic_terms', this.academicTerms);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
    return true;
  }

  deleteAcademicTerm(id: string): boolean {
    const prevLen = this.academicTerms.length;
    this.academicTerms = this.academicTerms.filter(t => t.id !== id);
    if (this.academicTerms.length !== prevLen) {
      this.saveToStorage('academic_terms', this.academicTerms);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
      return true;
    }
    return false;
  }

  // Division & Stream Rules
  getDivisionRules(): DivisionRulesData {
    return this.divisionRules;
  }

  updateDivisionRules(rules: DivisionRulesData) {
    this.divisionRules = rules;
    this.saveToStorage('division_rules', this.divisionRules);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
  }

  // Grading Scales
  getGradingScales(): GradeScaleRow[] {
    return this.gradingScales;
  }

  updateGradingScales(scales: GradeScaleRow[]) {
    this.gradingScales = scales;
    this.saveToStorage('grading_scales', this.gradingScales);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
  }

  // Assessment Policies
  getAssessmentPolicies(): AssessmentPolicyItem[] {
    return this.assessmentPolicies;
  }

  addAssessmentPolicy(policy: Omit<AssessmentPolicyItem, 'id'>): AssessmentPolicyItem {
    const newPol: AssessmentPolicyItem = {
      ...policy,
      id: `pol-${Date.now()}`,
    };
    this.assessmentPolicies.push(newPol);
    this.saveToStorage('assessment_policies', this.assessmentPolicies);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
    return newPol;
  }

  updateAssessmentPolicy(id: string, updated: Partial<AssessmentPolicyItem>): boolean {
    const idx = this.assessmentPolicies.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.assessmentPolicies[idx] = { ...this.assessmentPolicies[idx], ...updated };
    this.saveToStorage('assessment_policies', this.assessmentPolicies);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
    return true;
  }

  deleteAssessmentPolicy(id: string): boolean {
    const prevLen = this.assessmentPolicies.length;
    this.assessmentPolicies = this.assessmentPolicies.filter(p => p.id !== id);
    if (this.assessmentPolicies.length !== prevLen) {
      this.saveToStorage('assessment_policies', this.assessmentPolicies);
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('academic-hub-updated'));
      return true;
    }
    return false;
  }
}

export const dataService = new DataService();
