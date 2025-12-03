
import { User, Case, CaseGroup, CaseDetail, CaseStatus, CaseType } from '../types';
import { DB } from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'legal_app_users',
  CASES: 'legal_app_cases',
  GROUPS: 'legal_app_groups',
  CASE_DETAILS: 'legal_app_case_details'
};

// Initial Seed Data
const INITIAL_ADMIN: User = {
  id: 'admin_01',
  username: 'admin',
  fullName: 'Quản Trị Viên Hệ Thống',
  role: 'ADMIN',
  avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=4338ca&color=fff'
};

const INITIAL_USERS: User[] = [INITIAL_ADMIN];

export const storageService = {
  // --- USER MANAGEMENT ---
  getUsers: (): User[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(stored);
  },

  saveUser: (user: User) => {
    const users = storageService.getUsers();
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  // --- DATA MANAGEMENT (CASES) ---
  getCases: (): Case[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.CASES);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(DB.cases));
      return DB.cases;
    }
    return JSON.parse(stored);
  },

  getGroups: (): CaseGroup[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.GROUPS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(DB.groups));
      return DB.groups;
    }
    return JSON.parse(stored);
  },

  getCaseDetails: (): Record<string, CaseDetail> => {
    const stored = localStorage.getItem(STORAGE_KEYS.CASE_DETAILS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.CASE_DETAILS, JSON.stringify(DB.caseDetails));
      return DB.caseDetails;
    }
    return JSON.parse(stored);
  },

  saveCaseDetail: (detail: CaseDetail) => {
    const details = storageService.getCaseDetails();
    details[detail.id] = detail;
    localStorage.setItem(STORAGE_KEYS.CASE_DETAILS, JSON.stringify(details));

    // Update summary list as well
    const cases = storageService.getCases();
    const idx = cases.findIndex(c => c.id === detail.id);
    if (idx !== -1) {
      cases[idx] = {
        ...cases[idx],
        title: detail.title,
        caseNumber: detail.caseNumber,
        court: detail.court,
        status: detail.status,
      };
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    }
  },

  createCase: (newCase: Case) => {
    const cases = storageService.getCases();
    // Prevent duplicate ID insertion if logic allows
    if (!cases.some(c => c.id === newCase.id)) {
        cases.push(newCase);
        localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    }

    // Initialize default details for the new case
    const details = storageService.getCaseDetails();
    if (!details[newCase.id]) {
        details[newCase.id] = {
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
        localStorage.setItem(STORAGE_KEYS.CASE_DETAILS, JSON.stringify(details));
    }
  },

  deleteCase: (id: string) => {
    // 1. Remove from Summary List
    const cases = storageService.getCases();
    const newCases = cases.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(newCases));

    // 2. Remove from Details
    const details = storageService.getCaseDetails();
    if (details[id]) {
      delete details[id];
      localStorage.setItem(STORAGE_KEYS.CASE_DETAILS, JSON.stringify(details));
    }
  },

  // --- IMPORT / EXPORT ---
  exportData: () => {
    const data = {
      users: storageService.getUsers(),
      cases: storageService.getCases(),
      groups: storageService.getGroups(),
      caseDetails: storageService.getCaseDetails(),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `du_lieu_to_tung_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  },

  importData: async (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (json.users) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(json.users));
          if (json.cases) localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(json.cases));
          if (json.groups) localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(json.groups));
          if (json.caseDetails) localStorage.setItem(STORAGE_KEYS.CASE_DETAILS, JSON.stringify(json.caseDetails));
          resolve(true);
        } catch (err) {
          console.error("Import failed", err);
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  }
};
