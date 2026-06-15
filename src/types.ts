/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  STUDENT = 'STUDENT',
  SUPERVISOR = 'SUPERVISOR',
  ACADEMIC_LIAISON = 'ACADEMIC_LIAISON',
  ADMIN = 'ADMIN'
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  studentId?: string;
  phone?: string;
}

export type PlacementStatus = 'PENDING_MATCH' | 'UNDER_REVIEW' | 'APPROVED' | 'ACTIVE' | 'COMPLETED';

export interface Placement {
  id: string;
  studentId: string;
  studentName: string;
  companyName: string;
  companyAddress: string;
  positionTitle: string;
  startDate: string;
  endDate: string;
  supervisorId: string;
  supervisorName: string;
  supervisorEmail: string;
  status: PlacementStatus;
  academicLiaisonId: string;
  academicLiaisonName: string;
  departmentCode: string;
}

export type LogbookStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REVISION_REQUESTED' | 'REJECTED';

export interface DailyEntry {
  day: string; // 'Monday', 'Tuesday', etc.
  date: string;
  taskDescription: string;
  hours: number;
  challenges: string;
  learning: string;
}

export interface WeeklyLogbook {
  id: string;
  placementId: string;
  studentId: string;
  studentName: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  dailyEntries: DailyEntry[];
  weeklySummary: string;
  totalHours: number;
  status: LogbookStatus;
  supervisorFeedback: string;
  lastUpdated: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface ScoreWeights {
  weeklyLogCount: number; // e.g. out of 10 entries
  weeklyLogsWeight: number; // percentage (e.g. 30%)
  supervisorEvalWeight: number; // percentage (e.g. 30%)
  academicLiaisonWeight: number; // percentage (e.g. 40%)
}

export interface AcademicEvaluation {
  id: string;
  studentId: string;
  placementId: string;
  siteVisitScore: number; // out of 100
  midtermPresentationScore: number; // out of 100
  finalReportScore: number; // out of 100
  generalComments: string;
  gradedAt: string;
  gradedBy: string;
}

export interface SupervisorEvaluation {
  id: string;
  studentId: string;
  placementId: string;
  technicalCapability: number; // out of 100
  punctualityReliability: number; // out of 100
  communicationSkills: number; // out of 100
  problemSolvingAbility: number; // out of 100
  overallPerformance: number; // out of 100 (manually overridden or average)
  generalComments: string;
  gradedAt: string;
  gradedBy: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetRole: UserRole | 'ALL';
  targetUserId?: string;
  actionUrl?: string;
  category: 'logbook' | 'placement' | 'evaluation' | 'system';
}

// Student Portal / Toolkit Helpers
export interface GitCommit {
  hash: string;
  authorName: string;
  authorEmail: string;
  date: string;
  message: string;
  branch: string;
}

export interface MergeRequest {
  id: string;
  title: string;
  authorName: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'OPEN' | 'MERGED' | 'CLOSED';
  createdAt: string;
}

export interface UnitTestCase {
  id: string;
  name: string;
  suite: 'Frontend' | 'Backend';
  status: 'PASSED' | 'FAILED' | 'PENDING';
  durationMs: number;
  failureMessage?: string;
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBodyExample?: string;
  successResponseExample: string;
  rolesAllowed: string[];
}
