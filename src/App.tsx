import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './i18n/LanguageContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { SchoolDivisionPage } from './pages/public/SchoolDivisionPage';
import { CollegeDivisionPage } from './pages/public/CollegeDivisionPage';
import { FacilitiesPage } from './pages/public/FacilitiesPage';
import { NoticesPage } from './pages/public/NoticesPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { StudentsManagement } from './pages/admin/StudentsManagement';
import { TeachersManagement } from './pages/admin/TeachersManagement';
import { ClassesManagement } from './pages/admin/ClassesManagement';
import { AcademicHub } from './pages/admin/AcademicHub';
import { AttendanceManagement } from './pages/admin/AttendanceManagement';
import { ExaminationsManagement } from './pages/admin/ExaminationsManagement';
import { FeesManagement } from './pages/admin/FeesManagement';
import { AdmissionsManagement } from './pages/admin/AdmissionsManagement';
import { ReportsManagement } from './pages/admin/ReportsManagement';
import { SettingsPage } from './pages/admin/SettingsPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentRoutinePage } from './pages/student/StudentRoutinePage';
import { StudentResultsPage } from './pages/student/StudentResultsPage';
import { StudentAttendancePage } from './pages/student/StudentAttendancePage';
import { StudentFeesPage } from './pages/student/StudentFeesPage';
import { StudentAssignmentsPage } from './pages/student/StudentAssignmentsPage';
import { StudentLibraryPage } from './pages/student/StudentLibraryPage';

// Guardian Pages
import { ParentDashboard } from './pages/guardian/ParentDashboard';
import { ParentChildrenPage } from './pages/guardian/ParentChildrenPage';

// Teacher Pages
import { TeacherDashboard } from './pages/teacher/TeacherDashboard';
import { TeacherAssignmentsPage } from './pages/teacher/TeacherAssignmentsPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC WEBSITE ROUTES */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/school-division" element={<PublicLayout><SchoolDivisionPage /></PublicLayout>} />
            <Route path="/college-division" element={<PublicLayout><CollegeDivisionPage /></PublicLayout>} />
            <Route path="/admissions" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/facilities" element={<PublicLayout><FacilitiesPage /></PublicLayout>} />
            <Route path="/notices" element={<PublicLayout><NoticesPage /></PublicLayout>} />
            <Route path="/events" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/login" element={<LoginPage />} />

            {/* ADMIN PORTAL ROUTES */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
            <Route path="/admin/students" element={<DashboardLayout><StudentsManagement /></DashboardLayout>} />
            <Route path="/admin/teachers" element={<DashboardLayout><TeachersManagement /></DashboardLayout>} />
            <Route path="/admin/classes" element={<DashboardLayout><ClassesManagement /></DashboardLayout>} />
            <Route path="/admin/academic" element={<DashboardLayout><AcademicHub /></DashboardLayout>} />
            <Route path="/admin/attendance" element={<DashboardLayout><AttendanceManagement /></DashboardLayout>} />
            <Route path="/admin/examinations" element={<DashboardLayout><ExaminationsManagement /></DashboardLayout>} />
            <Route path="/admin/fees" element={<DashboardLayout><FeesManagement /></DashboardLayout>} />
            <Route path="/admin/reports" element={<DashboardLayout><ReportsManagement /></DashboardLayout>} />
            <Route path="/admin/notices" element={<DashboardLayout><NoticesPage /></DashboardLayout>} />
            <Route path="/admin/events" element={<DashboardLayout><AdminDashboard /></DashboardLayout>} />
            <Route path="/admin/admissions" element={<DashboardLayout><AdmissionsManagement /></DashboardLayout>} />
            <Route path="/admin/users" element={<DashboardLayout><UserManagementPage /></DashboardLayout>} />
            <Route path="/admin/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />

            {/* STUDENT PORTAL ROUTES */}
            <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
            <Route path="/student/dashboard" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
            <Route path="/student/profile" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
            <Route path="/student/routine" element={<DashboardLayout><StudentRoutinePage /></DashboardLayout>} />
            <Route path="/student/assignments" element={<DashboardLayout><StudentAssignmentsPage /></DashboardLayout>} />
            <Route path="/student/results" element={<DashboardLayout><StudentResultsPage /></DashboardLayout>} />
            <Route path="/student/attendance" element={<DashboardLayout><StudentAttendancePage /></DashboardLayout>} />
            <Route path="/student/fees" element={<DashboardLayout><StudentFeesPage /></DashboardLayout>} />
            <Route path="/student/notices" element={<DashboardLayout><NoticesPage /></DashboardLayout>} />
            <Route path="/student/messages" element={<DashboardLayout><StudentDashboard /></DashboardLayout>} />
            <Route path="/student/library" element={<DashboardLayout><StudentLibraryPage /></DashboardLayout>} />
            <Route path="/student/settings" element={<Navigate to="/student/dashboard" replace />} />

            {/* GUARDIAN / PARENT PORTAL ROUTES */}
            <Route path="/parent" element={<Navigate to="/parent/dashboard" replace />} />
            <Route path="/parent/dashboard" element={<DashboardLayout><ParentDashboard /></DashboardLayout>} />
            <Route path="/parent/children" element={<DashboardLayout><ParentChildrenPage /></DashboardLayout>} />
            <Route path="/parent/attendance" element={<DashboardLayout><StudentAttendancePage /></DashboardLayout>} />
            <Route path="/parent/results" element={<DashboardLayout><StudentResultsPage /></DashboardLayout>} />
            <Route path="/parent/fees" element={<DashboardLayout><StudentFeesPage /></DashboardLayout>} />
            <Route path="/parent/notices" element={<DashboardLayout><NoticesPage /></DashboardLayout>} />
            <Route path="/parent/messages" element={<DashboardLayout><ParentDashboard /></DashboardLayout>} />
            <Route path="/parent/profile" element={<DashboardLayout><ParentChildrenPage /></DashboardLayout>} />
            <Route path="/parent/settings" element={<Navigate to="/parent/dashboard" replace />} />

            {/* TEACHER PORTAL ROUTES */}
            <Route path="/teacher" element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="/teacher/dashboard" element={<DashboardLayout><TeacherDashboard /></DashboardLayout>} />
            <Route path="/teacher/classes" element={<DashboardLayout><ClassesManagement /></DashboardLayout>} />
            <Route path="/teacher/routine" element={<DashboardLayout><StudentRoutinePage /></DashboardLayout>} />
            <Route path="/teacher/attendance" element={<DashboardLayout><AttendanceManagement /></DashboardLayout>} />
            <Route path="/teacher/marks" element={<DashboardLayout><ExaminationsManagement /></DashboardLayout>} />
            <Route path="/teacher/assignments" element={<DashboardLayout><TeacherAssignmentsPage /></DashboardLayout>} />
            <Route path="/teacher/fees" element={<Navigate to="/teacher/dashboard" replace />} />
            <Route path="/teacher/notices" element={<DashboardLayout><NoticesPage /></DashboardLayout>} />
            <Route path="/teacher/settings" element={<Navigate to="/teacher/dashboard" replace />} />

            {/* FALLBACK REDIRECT */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
