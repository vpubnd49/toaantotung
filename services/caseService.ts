
import { Case, CaseGroup, CaseDetail } from '../types';
import { storageService } from './storageService';
import { cloudService, isCloudEnabled } from './firebaseService';

// Updated Logic: Always try Cloud first since we have hardcoded config.
// Only fallback to simulated local storage if Cloud returns empty or fails (optional).

export const caseService = {
  getAllCases: async (): Promise<Case[]> => {
    if (isCloudEnabled()) {
        try {
            const cloudCases = await cloudService.getAllCases();
            // If cloud is empty (first run), maybe we return local mock data?
            // For now, let's trust the cloud.
            return cloudCases; 
        } catch (e) {
            console.error("Cloud Error", e);
        }
    }
    // Fallback (only happens if firebase init fails completely)
    return new Promise((resolve) => {
      setTimeout(() => resolve(storageService.getCases()), 300);
    });
  },

  getCaseGroups: async (): Promise<CaseGroup[]> => {
    if (isCloudEnabled()) return cloudService.getGroups();
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(storageService.getGroups()), 300);
    });
  },

  getCaseDetailById: async (id: string): Promise<CaseDetail | null> => {
    if (isCloudEnabled()) {
        const detail = await cloudService.getCaseDetailById(id);
        if (detail) return detail;
        // If not found in cloud, do NOT fallback to local. 
        // We want single source of truth.
        return null;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        const details = storageService.getCaseDetails();
        const detail = details[id];
        resolve(detail || null);
      }, 300);
    });
  },

  updateCaseDetail: async (updatedData: CaseDetail): Promise<CaseDetail> => {
    if (isCloudEnabled()) {
        await cloudService.saveCaseDetail(updatedData);
        return updatedData;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        storageService.saveCaseDetail(updatedData);
        resolve(updatedData);
      }, 500);
    });
  },

  createCase: async (newCase: Case): Promise<void> => {
    if (isCloudEnabled()) {
        await cloudService.createCase(newCase);
        return;
    }

    return new Promise((resolve) => {
        setTimeout(() => {
            storageService.createCase(newCase);
            resolve();
        }, 300);
    });
  },

  deleteCase: async (id: string): Promise<void> => {
    if (isCloudEnabled()) {
        await cloudService.deleteCase(id);
        return;
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        storageService.deleteCase(id);
        resolve();
      }, 300);
    });
  }
};
