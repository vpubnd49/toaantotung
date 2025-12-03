
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Case, CaseGroup, CaseDetail } from '../types';
import { FIREBASE_CONFIG } from '../firebaseConfig';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

// --- INITIALIZATION ---

const initFirebase = () => {
  try {
    // Prevent "App already exists" error during hot-reloads
    if (getApps().length > 0) {
        app = getApp();
    } else {
        app = initializeApp(FIREBASE_CONFIG);
    }
    
    // Attempt to get Firestore instance
    // This call will fail if the SDKs are mismatched (Service not available)
    try {
        db = getFirestore(app);
        console.log("Firebase initialized successfully with Project ID:", FIREBASE_CONFIG.projectId);
    } catch (fsError) {
        console.warn("Firestore service not available. App will use Local Storage.", fsError);
        // Ensure db is undefined so fallback logic triggers
        db = undefined;
    }
    
  } catch (e) {
    console.error("Failed to initialize Firebase App:", e);
    app = undefined;
    db = undefined;
  }
  return db;
};

// Initialize immediately
initFirebase();

// --- HELPERS ---

export const isCloudEnabled = (): boolean => {
  return !!db;
};

// --- CLOUD OPERATIONS ---

export const cloudService = {
  // Sync Data: Upload local data to cloud (One time migration)
  migrateToCloud: async (cases: Case[], groups: CaseGroup[], details: Record<string, CaseDetail>) => {
    if (!db) throw new Error("Firebase chưa được kết nối");
    
    // 1. Upload Cases
    for (const c of cases) {
      await setDoc(doc(db, "cases", c.id), c);
    }
    
    // 2. Upload Groups
    for (const g of groups) {
      await setDoc(doc(db, "groups", g.id), g);
    }

    // 3. Upload Details
    for (const id in details) {
      await setDoc(doc(db, "case_details", id), details[id]);
    }
  },

  getAllCases: async (): Promise<Case[]> => {
    if (!db) return [];
    try {
        const snapshot = await getDocs(collection(db, "cases"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Case));
    } catch (e) {
        console.error("Error fetching cases from cloud:", e);
        return [];
    }
  },

  getGroups: async (): Promise<CaseGroup[]> => {
    if (!db) return [];
    try {
        const snapshot = await getDocs(collection(db, "groups"));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CaseGroup));
    } catch (e) {
        console.error("Error fetching groups from cloud:", e);
        return [];
    }
  },

  getCaseDetailById: async (id: string): Promise<CaseDetail | null> => {
    if (!db) return null;
    try {
        const snapshot = await getDocs(collection(db, "case_details"));
        const d = snapshot.docs.find(doc => doc.id === id);
        return d ? d.data() as CaseDetail : null;
    } catch (e) {
        console.error("Cloud fetch detail error", e);
        return null;
    }
  },

  saveCaseDetail: async (detail: CaseDetail) => {
    if (!db) return;
    
    // Save detail
    await setDoc(doc(db, "case_details", detail.id), detail);

    // Save summary
    const summary: Case = {
        id: detail.id,
        title: detail.title,
        caseNumber: detail.caseNumber,
        court: detail.court,
        status: detail.status,
        type: detail.type,
        date: detail.date
    };
    await setDoc(doc(db, "cases", detail.id), summary);
  },

  createCase: async (newCase: Case) => {
    if (!db) return;
    await setDoc(doc(db, "cases", newCase.id), newCase);
    
    // Create empty detail as well
    const emptyDetail: CaseDetail = {
        ...newCase,
        judge: 'Chưa cập nhật',
        caseStage: 'Sơ thẩm',
        nextEventDate: '---',
        nextEventDescription: 'Chưa có sự kiện',
        parties: [],
        challengedActions: [],
        timeline: [],
        documents: []
    };
    await setDoc(doc(db, "case_details", newCase.id), emptyDetail);
  },

  deleteCase: async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, "cases", id));
    await deleteDoc(doc(db, "case_details", id));
  }
};
