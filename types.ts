
export enum CaseStatus {
  COMPLETED = 'Hoàn thành',
  PENDING = 'Đang xử lý',
  OVERDUE = 'Quá hạn',
  POSTPONED = 'Tạm hoãn',
  UPCOMING = 'Sắp diễn ra',
}

export enum CaseType {
  CIVIL = 'Dân sự',
  CRIMINAL = 'Hình sự',
  ADMINISTRATIVE = 'Hành chính',
  LABOR = 'Lao động',
}

export interface Case {
  id: string;
  title: string;
  caseNumber: string; // Số thụ lý
  court: string;
  status: CaseStatus;
  type: CaseType;
  date: string;
}

export type EventType = 'TRIAL' | 'DOCUMENT' | 'POSTPONEMENT' | 'REQUEST' | 'ONSITE';

export interface TimelineEvent {
  id: string;
  date: string;
  time?: string;
  type: EventType;
  title: string;
  summary?: string;
  reason?: string;
  documentLink?: string;
  docNumber?: string;
  statusTag?: string; // e.g., 'Quá hạn', 'Đã hoàn tất'
}

export interface Representative {
  name: string;
  type: string; // 'Ủy quyền' | 'Bảo vệ quyền lợi'
}

export interface Party {
  name: string;
  role: string;
  representatives: Representative[];
  hasHistory?: boolean;
}

export interface ChallengedAction {
  step: number;
  docType: string;
  docNumber: string;
  issuer: string;
  date: string;
}

export interface CaseDetail extends Case {
  judge: string;
  caseStage: string; // e.g., 'Sơ thẩm', 'Phúc thẩm'
  nextEventDate: string;
  nextEventDescription: string;
  parties: Party[];
  challengedActions: ChallengedAction[];
  timeline: TimelineEvent[];
  documents: { title: string; date: string; type: string }[]; // New field for Document Library
}

export interface CaseGroup {
  id: string;
  name: string;
  caseCount: number;
  plaintiffs: string[];
  type: CaseType;
}

export type SearchFilters = {
  query: string;
  type: CaseType | 'ALL';
  court: string | 'ALL';
  status: CaseStatus | 'ALL';
};

// --- Auth Types ---
export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
}
