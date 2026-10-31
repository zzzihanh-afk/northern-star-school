import { db, isFirebaseConfigured } from '../lib/firebase/config';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import type {
  Student,
  Teacher,
  Guardian,
  AdminUserAccount,
  Notice,
  FeeInvoice,
  AcademicClass,
  Section
} from '../types';

export interface SyncStatus {
  isConfigured: boolean;
  isReady: boolean;
  projectId: string;
  lastSyncedAt?: string;
  totalSyncedItems?: number;
}

class FirestoreService {
  /**
   * Check if Cloud Firestore is active and configured
   */
  public isAvailable(): boolean {
    return isFirebaseConfigured && db !== null;
  }

  /**
   * Get current connection status metadata
   */
  public getStatus(): SyncStatus {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'northern-star-school';
    const lastSynced = localStorage.getItem('ns_firestore_last_synced') || undefined;
    const count = Number(localStorage.getItem('ns_firestore_synced_count')) || undefined;

    return {
      isConfigured: isFirebaseConfigured,
      isReady: this.isAvailable(),
      projectId,
      lastSyncedAt: lastSynced,
      totalSyncedItems: count,
    };
  }

  /**
   * Save or update a single document in a Firestore collection
   */
  public async saveDocument(colName: string, docId: string, data: any): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    try {
      const docRef = doc(db, colName, docId);
      await setDoc(docRef, JSON.parse(JSON.stringify(data)), { merge: true });
      return true;
    } catch (err) {
      console.warn(`[Firestore] Failed to save document ${colName}/${docId}:`, err);
      return false;
    }
  }

  /**
   * Delete a single document from a Firestore collection
   */
  public async deleteDocument(colName: string, docId: string): Promise<boolean> {
    if (!this.isAvailable() || !db) return false;
    try {
      const docRef = doc(db, colName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn(`[Firestore] Failed to delete document ${colName}/${docId}:`, err);
      return false;
    }
  }

  /**
   * Load all documents from a specific Firestore collection
   */
  public async loadCollection<T>(colName: string): Promise<T[]> {
    if (!this.isAvailable() || !db) return [];
    try {
      const querySnapshot = await getDocs(collection(db, colName));
      const items: T[] = [];
      querySnapshot.forEach(docSnap => {
        items.push(docSnap.data() as T);
      });
      return items;
    } catch (err) {
      console.warn(`[Firestore] Failed to read collection ${colName}:`, err);
      return [];
    }
  }

  /**
   * Upload all initial/current school dataset directly to Cloud Firestore.
   * This immediately populates collections visible in the Firebase Web Console!
   */
  public async syncAllToCloud(data: {
    students: Student[];
    teachers: Teacher[];
    guardians: Guardian[];
    adminUsers: AdminUserAccount[];
    classes: AcademicClass[];
    sections: Section[];
    notices: Notice[];
    feeInvoices: FeeInvoice[];
  }): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    if (!this.isAvailable() || !db) {
      return {
        success: false,
        syncedCount: 0,
        error: 'Firestore is not initialized. Please verify Firebase project connection in .env',
      };
    }

    try {
      let total = 0;
      const batch = writeBatch(db);

      // 1. Students
      data.students.forEach(s => {
        batch.set(doc(db!, 'students', s.id), JSON.parse(JSON.stringify(s)), { merge: true });
        total++;
      });

      // 2. Teachers
      data.teachers.forEach(t => {
        batch.set(doc(db!, 'teachers', t.id), JSON.parse(JSON.stringify(t)), { merge: true });
        total++;
      });

      // 3. Guardians / Parents
      data.guardians.forEach(g => {
        batch.set(doc(db!, 'guardians', g.id), JSON.parse(JSON.stringify(g)), { merge: true });
        total++;
      });

      // 4. Admin and Staff User Accounts
      data.adminUsers.forEach(a => {
        batch.set(doc(db!, 'admin_users', a.id), JSON.parse(JSON.stringify(a)), { merge: true });
        total++;
      });

      // 5. Classes
      data.classes.forEach(c => {
        batch.set(doc(db!, 'academic_classes', c.id), JSON.parse(JSON.stringify(c)), { merge: true });
        total++;
      });

      // 6. Sections
      data.sections.forEach(sec => {
        batch.set(doc(db!, 'sections', sec.id), JSON.parse(JSON.stringify(sec)), { merge: true });
        total++;
      });

      // 7. Notices
      data.notices.forEach(n => {
        batch.set(doc(db!, 'notices', n.id), JSON.parse(JSON.stringify(n)), { merge: true });
        total++;
      });

      // 8. Fee Invoices
      data.feeInvoices.forEach(inv => {
        batch.set(doc(db!, 'fee_invoices', inv.id), JSON.parse(JSON.stringify(inv)), { merge: true });
        total++;
      });

      // Commit write batch to Cloud Firestore
      await batch.commit();

      const timestamp = new Date().toLocaleString();
      localStorage.setItem('ns_firestore_last_synced', timestamp);
      localStorage.setItem('ns_firestore_synced_count', String(total));

      return {
        success: true,
        syncedCount: total,
      };
    } catch (err: any) {
      console.error('[Firestore] Batch upload error:', err);
      return {
        success: false,
        syncedCount: 0,
        error: err?.message || 'Failed to write data batch to Cloud Firestore',
      };
    }
  }

  /**
   * Fetch all cloud records to hydrate local store if cloud records exist
   */
  public async fetchCloudDataset(): Promise<{
    students?: Student[];
    teachers?: Teacher[];
    guardians?: Guardian[];
    adminUsers?: AdminUserAccount[];
    notices?: Notice[];
  }> {
    if (!this.isAvailable()) return {};

    const [students, teachers, guardians, adminUsers, notices] = await Promise.all([
      this.loadCollection<Student>('students'),
      this.loadCollection<Teacher>('teachers'),
      this.loadCollection<Guardian>('guardians'),
      this.loadCollection<AdminUserAccount>('admin_users'),
      this.loadCollection<Notice>('notices'),
    ]);

    return {
      ...(students.length > 0 ? { students } : {}),
      ...(teachers.length > 0 ? { teachers } : {}),
      ...(guardians.length > 0 ? { guardians } : {}),
      ...(adminUsers.length > 0 ? { adminUsers } : {}),
      ...(notices.length > 0 ? { notices } : {}),
    };
  }
}

export const firestoreService = new FirestoreService();
