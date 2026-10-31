import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { dataService } from '../src/services/dataService';

describe('AuthContext Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  it('authenticates super admin with supernadmin.@gmail.com and password supernadmin', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success = false;
    await act(async () => {
      success = await result.current.signIn('supernadmin.@gmail.com', 'supernadmin');
    });

    expect(success).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.role).toBe('super_admin');
    expect(result.current.user?.email).toBe('supernadmin.@gmail.com');
    expect(result.current.hasRole('institution_admin')).toBe(true);
    expect(result.current.hasRole('teacher')).toBe(true);
    expect(result.current.hasRole('student')).toBe(true);
  });

  it('authenticates super admin with normalized supernadmin@gmail.com and password supernadmin', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success = false;
    await act(async () => {
      success = await result.current.signIn('supernadmin@gmail.com', 'supernadmin');
    });

    expect(success).toBe(true);
    expect(result.current.user?.role).toBe('super_admin');
  });

  it('rejects incorrect password for super admin', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success = true;
    await act(async () => {
      success = await result.current.signIn('supernadmin.@gmail.com', 'wrongpassword');
    });

    expect(success).toBe(false);
  });

  it('authenticates student using student name and administrator-assigned ID number', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success = false;
    await act(async () => {
      success = await result.current.signInStudent('Rafiq Hasan', 'NSC-2025-0147');
    });

    expect(success).toBe(true);
    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.role).toBe('student');
    expect(result.current.user?.displayName).toBe('Rafiq Hasan');
    expect(result.current.user?.metadata?.studentId).toBe('stu-rafiq');
    expect(result.current.user?.metadata?.rollNo).toBe('NSC-2025-0147');
  });

  it('authenticates newly added student created by administrator with custom ID and name', async () => {
    const createdStudent = dataService.addStudent({
      admissionNo: 'NSC-2025-99991',
      rollNo: 'NSC-2025-999',
      fullName: 'Tanvir Chowdhury',
      division: 'school',
      classId: 'c-8',
      className: 'Class 8',
      sectionId: 'sec-8a',
      sectionName: 'A',
      sessionId: 'sess-2025',
      dateOfBirth: '2010-06-15',
      gender: 'male',
      guardianId: 'g-1',
      guardianName: 'Mr. Chowdhury',
      guardianPhone: '+880 1700 112233',
      address: 'Dhaka, Bangladesh',
      status: 'active'
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let success = false;
    await act(async () => {
      success = await result.current.signInStudent('Tanvir Chowdhury', 'NSC-2025-999');
    });

    expect(success).toBe(true);
    expect(result.current.user?.displayName).toBe('Tanvir Chowdhury');
    expect(result.current.user?.role).toBe('student');
    expect(result.current.user?.metadata?.rollNo).toBe('NSC-2025-999');
    expect(result.current.user?.metadata?.studentId).toBe(createdStudent.id);
  });

  it('allows super admin to create an admin with a specific role and password, and sign in', async () => {
    // Super admin creates a new accountant admin
    const newAdmin = dataService.addAdminUser({
      fullName: 'Mahmudur Rahman',
      email: 'mahmud.accounts@northernstar.edu.bd',
      phone: '+880 1711 556677',
      role: 'accountant',
      password: 'financepass2025',
      department: 'Finance & Accounts',
      designation: 'Senior Accountant',
      isActive: true,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let success = false;
    await act(async () => {
      success = await result.current.signIn('mahmud.accounts@northernstar.edu.bd', 'financepass2025');
    });

    expect(success).toBe(true);
    expect(result.current.user?.displayName).toBe('Mahmudur Rahman');
    expect(result.current.user?.role).toBe('accountant');
    expect(result.current.user?.email).toBe('mahmud.accounts@northernstar.edu.bd');

    // Reject wrong password
    let failedLogin = true;
    await act(async () => {
      failedLogin = await result.current.signIn('mahmud.accounts@northernstar.edu.bd', 'wrongpass');
    });
    expect(failedLogin).toBe(false);
  });

  it('allows super admin to create a parent account with set password and linked children, and sign in', async () => {
    // Super admin creates a new parent account linked to a student
    const newParent = dataService.addGuardian({
      fullName: 'Mrs. Selina Akhter',
      relation: 'Mother',
      email: 'selina.parent@gmail.com',
      phone: '+880 1799 443322',
      occupation: 'Architect',
      address: 'Dhanmondi, Dhaka',
      password: 'parentpass2025',
      linkedStudentIds: ['stu-rafiq'],
      isActive: true,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let success = false;
    await act(async () => {
      success = await result.current.signIn('selina.parent@gmail.com', 'parentpass2025');
    });

    expect(success).toBe(true);
    expect(result.current.user?.displayName).toBe('Mrs. Selina Akhter');
    expect(result.current.user?.role).toBe('guardian');
    expect(result.current.user?.metadata?.guardianId).toBe(newParent.id);
    expect(result.current.user?.metadata?.linkedStudentIds).toContain('stu-rafiq');

    // Reject wrong password
    let failedLogin = true;
    await act(async () => {
      failedLogin = await result.current.signIn('selina.parent@gmail.com', 'wrongpassword');
    });
    expect(failedLogin).toBe(false);
  });

  it('rejects student login when name and ID do not match', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success = true;
    await act(async () => {
      success = await result.current.signInStudent('Rafiq Hasan', 'NSC-2025-WRONG');
    });

    expect(success).toBe(false);

    let nameMismatch = true;
    await act(async () => {
      nameMismatch = await result.current.signInStudent('Unknown Student', 'NSC-2025-0147');
    });

    expect(nameMismatch).toBe(false);
  });
});
