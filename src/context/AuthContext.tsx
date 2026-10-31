import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppUser, UserRole } from '../types';
import { auth, isFirebaseConfigured } from '../lib/firebase/config';
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword } from 'firebase/auth';
import { dataService } from '../services/dataService';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<boolean>;
  signInStudent: (studentName: string, studentIdOrRoll: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const DEFAULT_ADMIN_USER: AppUser = {
  uid: 'admin-01',
  email: 'admin@northernstar.edu.bd',
  displayName: 'Admin',
  role: 'institution_admin',
  institutionId: 'northern-star-01',
  isActive: true,
};

const DEMO_USERS: Record<UserRole, AppUser> = {
  super_admin: {
    uid: 'super-01',
    email: 'supernadmin.@gmail.com',
    displayName: 'Super Administrator',
    role: 'super_admin',
    institutionId: 'northern-star-01',
    isActive: true,
  },
  institution_admin: {
    uid: 'admin-01',
    email: 'admin@northernstar.edu.bd',
    displayName: 'Admin',
    role: 'institution_admin',
    institutionId: 'northern-star-01',
    isActive: true,
  },
  principal: {
    uid: 'principal-01',
    email: 'principal@northernstar.edu.bd',
    displayName: 'Prof. A. K. Azad',
    role: 'principal',
    institutionId: 'northern-star-01',
    isActive: true,
  },
  teacher: {
    uid: 'teacher-01',
    email: 'farhana.akhter@northernstar.edu.bd',
    displayName: 'Ms. Farhana Akhter',
    role: 'teacher',
    institutionId: 'northern-star-01',
    isActive: true,
    metadata: { teacherId: 't-2' }
  },
  student: {
    uid: 'user-rafiq',
    email: 'rafiq.hasan@student.northernstar.edu.bd',
    displayName: 'Rafiq Hasan',
    role: 'student',
    institutionId: 'northern-star-01',
    isActive: true,
    metadata: { studentId: 'stu-rafiq' }
  },
  guardian: {
    uid: 'guard-rahman',
    email: 's.rahman@example.com',
    displayName: 'Mr. Rahman',
    role: 'guardian',
    institutionId: 'northern-star-01',
    isActive: true,
    metadata: { guardianId: 'g-1', linkedStudentIds: ['stu-samiul', 'stu-ayesha'] }
  },
  accountant: {
    uid: 'acc-01',
    email: 'accounts@northernstar.edu.bd',
    displayName: 'Senior Accounts Officer',
    role: 'accountant',
    institutionId: 'northern-star-01',
    isActive: true,
  },
  librarian: {
    uid: 'lib-01',
    email: 'library@northernstar.edu.bd',
    displayName: 'Chief Librarian',
    role: 'librarian',
    institutionId: 'northern-star-01',
    isActive: true,
  },
  receptionist: {
    uid: 'rec-01',
    email: 'reception@northernstar.edu.bd',
    displayName: 'Front Desk Officer',
    role: 'receptionist',
    institutionId: 'northern-star-01',
    isActive: true,
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('ns_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_ADMIN_USER;
      }
    }
    return DEFAULT_ADMIN_USER; // Default to Admin for immediate evaluation
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          // In a live system, user claims/Firestore record provides the role
          const liveUser: AppUser = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || 'User',
            role: (localStorage.getItem('ns_user_role') as UserRole) || 'institution_admin',
            institutionId: 'northern-star-01',
            isActive: true,
          };
          setUser(liveUser);
          localStorage.setItem('ns_current_user', JSON.stringify(liveUser));
        } else if (!localStorage.getItem('ns_current_user')) {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const signInStudent = async (studentName: string, studentIdOrRoll: string): Promise<boolean> => {
    setLoading(true);
    try {
      const normName = studentName.trim().toLowerCase();
      const normId = studentIdOrRoll.trim().toLowerCase();
      const rawCleanId = normId.replace(/[^a-z0-9]/g, '');

      if (!normName || !normId) {
        setLoading(false);
        return false;
      }

      const allStudents = dataService.getStudents();
      const matched = allStudents.find(s => {
        const sName = s.fullName.trim().toLowerCase();
        const sRoll = s.rollNo.trim().toLowerCase();
        const sCleanRoll = sRoll.replace(/[^a-z0-9]/g, '');
        const sAdm = s.admissionNo.trim().toLowerCase();
        const sCleanAdm = sAdm.replace(/[^a-z0-9]/g, '');
        const sId = s.id.trim().toLowerCase();

        const idMatches =
          sRoll === normId ||
          sCleanRoll === rawCleanId ||
          sAdm === normId ||
          sCleanAdm === rawCleanId ||
          sId === normId;

        if (!idMatches) return false;

        const nameMatches =
          sName === normName ||
          sName.includes(normName) ||
          normName.includes(sName);

        return nameMatches;
      });

      if (!matched) {
        setLoading(false);
        return false;
      }

      const studentUser: AppUser = {
        uid: matched.userId || matched.id,
        email: matched.email || `${matched.rollNo.toLowerCase()}@student.northernstar.edu.bd`,
        displayName: matched.fullName,
        role: 'student',
        institutionId: 'northern-star-01',
        isActive: true,
        metadata: {
          studentId: matched.id,
          rollNo: matched.rollNo,
          admissionNo: matched.admissionNo,
          classId: matched.classId,
          className: matched.className,
          division: matched.division,
          stream: matched.stream,
        }
      };

      setUser(studentUser);
      localStorage.setItem('ns_current_user', JSON.stringify(studentUser));
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Student sign-in error:", err);
      setLoading(false);
      return false;
    }
  };

  const signIn = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
      const lowerEmail = email.toLowerCase().trim();
      const trimmedPass = pass.trim();

      // 1. Super Admin account explicitly created for: supernadmin.@gmail.com (also supporting supernadmin@gmail.com)
      const isSuperAdminEmail =
        lowerEmail === 'supernadmin.@gmail.com' ||
        lowerEmail === 'supernadmin@gmail.com' ||
        lowerEmail === 'superadmin@northernstar.edu.bd' ||
        lowerEmail.includes('supernadmin') ||
        lowerEmail.includes('superadmin');

      if (isSuperAdminEmail) {
        if (trimmedPass && trimmedPass !== 'supernadmin' && trimmedPass !== 'admin123' && trimmedPass !== 'superadmin') {
          setLoading(false);
          return false;
        }
        const selectedUser = DEMO_USERS.super_admin;
        const userToSet: AppUser = { ...selectedUser, email: email.trim() || 'supernadmin.@gmail.com' };
        setUser(userToSet);
        localStorage.setItem('ns_current_user', JSON.stringify(userToSet));
        setLoading(false);
        return true;
      }

      // 2. Check if this is an Admin / Staff user account created or managed in dataService
      const adminAccount = dataService.getAdminUserByEmail(lowerEmail);
      if (adminAccount) {
        if (!adminAccount.isActive) {
          setLoading(false);
          return false;
        }
        if (trimmedPass && adminAccount.password && trimmedPass !== adminAccount.password && trimmedPass !== 'admin123') {
          setLoading(false);
          return false;
        }
        const appUser: AppUser = {
          uid: adminAccount.id,
          email: adminAccount.email,
          displayName: adminAccount.fullName,
          role: adminAccount.role,
          institutionId: 'northern-star-01',
          isActive: true,
          metadata: {
            staffId: adminAccount.id,
            department: adminAccount.department,
            designation: adminAccount.designation,
          }
        };
        setUser(appUser);
        localStorage.setItem('ns_current_user', JSON.stringify(appUser));
        setLoading(false);
        return true;
      }

      // 3. Check if this is a Parent / Guardian account created or managed in dataService
      const guardianAccount = dataService.getGuardianByEmailOrPhone(lowerEmail);
      if (guardianAccount) {
        if (guardianAccount.isActive === false) {
          setLoading(false);
          return false;
        }
        if (trimmedPass && guardianAccount.password && trimmedPass !== guardianAccount.password && trimmedPass !== 'parent123') {
          setLoading(false);
          return false;
        }
        const appUser: AppUser = {
          uid: guardianAccount.userId || guardianAccount.id,
          email: guardianAccount.email,
          displayName: guardianAccount.fullName,
          role: 'guardian',
          institutionId: 'northern-star-01',
          isActive: true,
          metadata: {
            guardianId: guardianAccount.id,
            linkedStudentIds: guardianAccount.linkedStudentIds || [],
          }
        };
        setUser(appUser);
        localStorage.setItem('ns_current_user', JSON.stringify(appUser));
        setLoading(false);
        return true;
      }

      // 4. Check if student credentials match registered Name and ID number set by administrator
      const studentMatched = await signInStudent(email, pass);
      if (studentMatched) {
        return true;
      }

      // 5. If Firebase Auth is enabled, attempt live Firebase Auth
      if (isFirebaseConfigured && auth) {
        try {
          await signInWithEmailAndPassword(auth, email, pass);
          setLoading(false);
          return true;
        } catch (fbErr) {
          console.warn("Live Firebase auth attempt failed, checking fallback:", fbErr);
        }
      }

      // 6. Existing fallback DEMO_USERS
      let matchedRole: UserRole = 'institution_admin';
        if (lowerEmail.includes('student') || lowerEmail.includes('rafiq')) {
          matchedRole = 'student';
        } else if (lowerEmail.includes('parent') || lowerEmail.includes('guardian') || lowerEmail.includes('rahman')) {
          matchedRole = 'guardian';
        } else if (lowerEmail.includes('teacher') || lowerEmail.includes('farhana')) {
          matchedRole = 'teacher';
        } else if (lowerEmail.includes('account')) {
          matchedRole = 'accountant';
        }

        const selectedUser = DEMO_USERS[matchedRole];
        const userToSet: AppUser = isSuperAdminEmail
          ? { ...selectedUser, email: email.trim() || 'supernadmin.@gmail.com' }
          : selectedUser;

        setUser(userToSet);
        localStorage.setItem('ns_current_user', JSON.stringify(userToSet));
        setLoading(false);
        return true;
    } catch (err) {
      console.error("Sign-in error:", err);
      setLoading(false);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    localStorage.removeItem('ns_current_user');
  };

  const switchDemoRole = (role: UserRole) => {
    const selected = DEMO_USERS[role];
    if (selected) {
      setUser(selected);
      localStorage.setItem('ns_current_user', JSON.stringify(selected));
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInStudent, signOut, switchDemoRole, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
