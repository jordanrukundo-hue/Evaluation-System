/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserProfile,
  UserRole,
  Placement,
  WeeklyLogbook,
  AcademicEvaluation,
  SupervisorEvaluation,
  ScoreWeights,
  SystemNotification,
  GitCommit,
  MergeRequest,
  UnitTestCase,
  ApiEndpoint
} from './types';

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substring(2, 9);

// 1. Initial User Profiles
export const defaultUsers: UserProfile[] = [
  {
    id: 'student_jordan',
    name: 'Jordan Rukundo',
    email: 'jordanrukundo@gmail.com',
    role: UserRole.STUDENT,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    department: 'Computer Science & Software Engineering',
    studentId: 'CSC/2026/0042',
    phone: '+256 702 123456'
  },
  {
    id: 'student_alice',
    name: 'Alice Chen',
    email: 'alice.chen@university.edu',
    role: UserRole.STUDENT,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces',
    department: 'Computer Science & Software Engineering',
    studentId: 'CSC/2026/0119',
    phone: '+1 (555) 432-1098'
  },
  {
    id: 'supervisor_sarah',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@techcorp.com',
    role: UserRole.SUPERVISOR,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
    department: 'Core Frontend Engineering, TechCorp'
  },
  {
    id: 'supervisor_robert',
    name: 'Robert Davis',
    email: 'robert.davis@innovate.io',
    role: UserRole.SUPERVISOR,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces',
    department: 'Product & Architecture Group, Innovate LLC'
  },
  {
    id: 'liaison_john',
    name: 'Dr. John Kamau',
    email: 'john.kamau@university.edu',
    role: UserRole.ACADEMIC_LIAISON,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
    department: 'Department of Computing Studies'
  },
  {
    id: 'admin_coordinator',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@university.edu',
    role: UserRole.ADMIN,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=faces',
    department: 'Office of Industry Relations & Careers'
  }
];

// 2. Initial Placements
export const defaultPlacements: Placement[] = [
  {
    id: 'placement_jordan',
    studentId: 'student_jordan',
    studentName: 'Jordan Rukundo',
    companyName: 'TechCorp Software Solutions',
    companyAddress: 'Plot 45 Innovation Way, Sector 6, Tech Park',
    positionTitle: 'Junior Software Development Intern',
    startDate: '2026-05-11',
    endDate: '2026-08-28',
    supervisorId: 'supervisor_sarah',
    supervisorName: 'Sarah Jenkins',
    supervisorEmail: 'sarah.jenkins@techcorp.com',
    status: 'ACTIVE',
    academicLiaisonId: 'liaison_john',
    academicLiaisonName: 'Dr. John Kamau',
    departmentCode: 'CSC'
  },
  {
    id: 'placement_alice',
    studentId: 'student_alice',
    studentName: 'Alice Chen',
    companyName: 'Innovate LLC',
    companyAddress: 'Suite 300, Pioneer Building, Commerce Hub',
    positionTitle: 'Full-Stack Web Design Intern',
    startDate: '2026-05-18',
    endDate: '2026-09-04',
    supervisorId: 'supervisor_robert',
    supervisorName: 'Robert Davis',
    supervisorEmail: 'robert.davis@innovate.io',
    status: 'ACTIVE',
    academicLiaisonId: 'liaison_john',
    academicLiaisonName: 'Dr. John Kamau',
    departmentCode: 'CSC'
  }
];

// 3. Initial Weekly Logbooks (Seed values to make graphs look rich!)
export const defaultLogbooks: WeeklyLogbook[] = [
  {
    id: 'log_jordan_w1',
    placementId: 'placement_jordan',
    studentId: 'student_jordan',
    studentName: 'Jordan Rukundo',
    weekNumber: 1,
    startDate: '2026-05-11',
    endDate: '2026-05-15',
    totalHours: 40,
    status: 'APPROVED',
    supervisorFeedback: 'Excellent onboarding week. Jordan integrated very fast into our Figma layouts and successfully configured his regional development containers.',
    weeklySummary: 'This week was primarily focused on onboarding, setting up the development workspace, introducing myself to the squad, and learning best practices for the Git branching model in TechCorp.',
    dailyEntries: [
      { day: 'Monday', date: '2026-05-11', taskDescription: 'IT Orientation, workstation setups, and environment configuration.', hours: 8, challenges: 'Minor dependency clashes in Docker setup.', learning: 'Docker caching strategies and configuration of private registries.' },
      { day: 'Tuesday', date: '2026-05-12', taskDescription: 'Introduced to the team. Reviewed architectural diagrams of the microservices.', hours: 8, challenges: 'Adapting to microservice terminology and boundaries.', learning: 'Clean Architecture with separation of domain entities and controllers.' },
      { day: 'Wednesday', date: '2026-05-13', taskDescription: 'Wrote unit tests for the core auth middleware.', hours: 8, challenges: 'Mocking JWT key verification endpoints.', learning: 'Jest mocking frameworks and security token expirations.' },
      { day: 'Thursday', date: '2026-05-14', taskDescription: 'Fixed small frontend positioning bugs on user profiles.', hours: 8, challenges: 'Tailwind configuration scoping override.', learning: 'Using CSS custom properties to dynamically set profile layout banners.' },
      { day: 'Friday', date: '2026-05-15', taskDescription: 'Attended sprint planning and retrospective sessions.', hours: 8, challenges: 'Translating product specs into technical tickets.', learning: 'Estimation utilizing story-points.' }
    ],
    lastUpdated: '2026-05-15T16:30:00Z',
    submittedAt: '2026-05-15T16:45:00Z',
    reviewedAt: '2026-05-16T10:15:00Z'
  },
  {
    id: 'log_jordan_w2',
    placementId: 'placement_jordan',
    studentId: 'student_jordan',
    studentName: 'Jordan Rukundo',
    weekNumber: 2,
    startDate: '2026-05-18',
    endDate: '2026-05-22',
    totalHours: 40,
    status: 'APPROVED',
    supervisorFeedback: 'Fantastic job writing comprehensive API controllers. The unit test coverage was exceptionally high. Keep up this standard!',
    weeklySummary: 'Focused heavily on writing the backend CRUD controllers for the intern tracking system. Contributed three pull requests into the staging repository.',
    dailyEntries: [
      { day: 'Monday', date: '2026-05-18', taskDescription: 'Designed database schema structures for placement schedules.', hours: 8, challenges: 'Optimizing indexes for compound date keys.', learning: 'Query indexing rules and schema normalizations.' },
      { day: 'Tuesday', date: '2026-05-19', taskDescription: 'Wrote the primary Express routes and controllers for logging.', hours: 8, challenges: 'Validation logic with Zod packages.', learning: 'Integrating middleware-level validatons with standard express handlers.' },
      { day: 'Wednesday', date: '2026-05-20', taskDescription: 'Created data seed scripts for staging database populations.', hours: 8, challenges: 'Idempotency management on multiple script re-runs.', learning: 'Writing upsert statements and verifying state.' },
      { day: 'Thursday', date: '2026-05-21', taskDescription: 'Refactored error handler middlewares to return readable errors.', hours: 8, challenges: 'Handling asynchronous controller errors without crashes.', learning: 'Express promise wrapper models.' },
      { day: 'Friday', date: '2026-05-22', taskDescription: 'Tested full suite of endpoints with postman collections.', hours: 8, challenges: 'Synchronizing cookie credentials on headless requests.', learning: 'CSRF mitigation procedures.' }
    ],
    lastUpdated: '2026-05-22T17:00:00Z',
    submittedAt: '2026-05-22T17:15:00Z',
    reviewedAt: '2026-05-23T09:45:00Z'
  },
  {
    id: 'log_jordan_w3',
    placementId: 'placement_jordan',
    studentId: 'student_jordan',
    studentName: 'Jordan Rukundo',
    weekNumber: 3,
    startDate: '2026-05-25',
    endDate: '2026-05-29',
    totalHours: 35,
    status: 'APPROVED',
    supervisorFeedback: 'Good debugging of the pipeline caching issue. Glad to see you collaborating with the DevOps team.',
    weeklySummary: 'Assisted in resolving pipeline integration blockages, updated UI component states, and documented API endpoints in the company wiki.',
    dailyEntries: [
      { day: 'Monday', date: '2026-05-25', taskDescription: 'Participated in a design jam for the reporting module dashboard.', hours: 7, challenges: 'Balancing visual elements and key density.', learning: 'Figma Auto-Layout algorithms.' },
      { day: 'Tuesday', date: '2026-05-26', taskDescription: 'Implemented interactive SVG charts for the dashboard pages.', hours: 8, challenges: 'Calculating responsive aspect ratios dynamically.', learning: 'SVG viewbox controls and coordinates.' },
      { day: 'Wednesday', date: '2026-05-27', taskDescription: 'Discovered and resolved a critical bug in the log query filters.', hours: 8, challenges: 'Timezone bias offsets shifting dates backward.', learning: 'Using ISO-8601 strings and UTC moments.' },
      { day: 'Thursday', date: '2026-05-28', taskDescription: 'Fixed an automated CI/CD caching lockup blocking build pushes.', hours: 8, challenges: 'Docker file lock conflicts.', learning: 'Configuring multi-stage build mounts.' },
      { day: 'Friday', date: '2026-05-29', taskDescription: 'Reviewed pull requests from peer interns and completed documentation.', hours: 4, challenges: 'Analyzing heavy code blocks constructively.', learning: 'Code critique styles.' }
    ],
    lastUpdated: '2026-05-29T15:00:00Z',
    submittedAt: '2026-05-29T15:10:00Z',
    reviewedAt: '2026-05-30T11:00:00Z'
  },
  {
    id: 'log_jordan_w4',
    placementId: 'placement_jordan',
    studentId: 'student_jordan',
    studentName: 'Jordan Rukundo',
    weekNumber: 4,
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    totalHours: 40,
    status: 'REVISION_REQUESTED',
    supervisorFeedback: 'Jordan, please elaborate further on the Redis caching layout. The Thursday description is a bit too brief, and I want you to document the hit/miss ratio findings.',
    weeklySummary: 'Conducted load testing, implemented cache strategies, and debugged connection spikes under simulated peak traffics.',
    dailyEntries: [
      { day: 'Monday', date: '2026-06-01', taskDescription: 'Integrated Redis client routines in backend.', hours: 8, challenges: 'Redis timeout and error reconnections.', learning: 'Handling connection pool failures gracefully.' },
      { day: 'Tuesday', date: '2026-06-02', taskDescription: 'Configured sliding-window rate limiters with server scripts.', hours: 8, challenges: 'Mitigating distributed brute force attacks.', learning: 'Token buckets.' },
      { day: 'Wednesday', date: '2026-06-03', taskDescription: 'Identified database slow queries.', hours: 8, challenges: 'Inefficient table scans in log aggregators.', learning: 'Explain Analyze statements.' },
      { day: 'Thursday', date: '2026-06-04', taskDescription: 'Implemented brief Redis logic parameters.', hours: 8, challenges: 'Cache invalidation on update transactions.', learning: 'Redis SETEX directives.' },
      { day: 'Friday', date: '2026-06-05', taskDescription: 'Shared performance metrics with the core system engineer.', hours: 8, challenges: 'Exporting raw latency profiles.', learning: 'Grafana dashboards and performance charting.' }
    ],
    lastUpdated: '2026-06-05T17:00:00Z',
    submittedAt: '2026-06-05T17:30:00Z',
    reviewedAt: '2026-06-06T15:00:00Z'
  },
  {
    id: 'log_jordan_w5',
    placementId: 'placement_jordan',
    studentId: 'student_jordan',
    studentName: 'Jordan Rukundo',
    weekNumber: 5,
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    totalHours: 40,
    status: 'SUBMITTED',
    supervisorFeedback: '',
    weeklySummary: 'Completed full-stack dashboard statistics, fully resolved cache invalidation guidelines requested in the Week 4 feedback, and organized manual backup routines.',
    dailyEntries: [
      { day: 'Monday', date: '2026-06-08', taskDescription: 'Remodeled Redis cache configuration parameters as requested.', hours: 8, challenges: 'Integrating cache invalidators with main models.', learning: 'Broadcasting triggers.' },
      { day: 'Tuesday', date: '2026-06-09', taskDescription: 'Created beautiful charting components in frontend dashboards.', hours: 8, challenges: 'Scaling canvas sizes on narrow screens.', learning: 'ResizeObservers and React states.' },
      { day: 'Wednesday', date: '2026-06-10', taskDescription: 'Wrote unit verification tests for cache hit/miss distributions.', hours: 8, challenges: 'Injecting custom redis mocking engines in tests.', learning: 'Mock-redis package usage.' },
      { day: 'Thursday', date: '2026-06-11', taskDescription: 'Constructed the final evaluation template UI forms.', hours: 8, challenges: 'Form validation bindings with deep nested structures.', learning: 'React form control structures.' },
      { day: 'Friday', date: '2026-06-12', taskDescription: 'Polished general UI typography and finalized Week 5 log package.', hours: 8, challenges: 'Overcoming spacing visual inconsistencies.', learning: 'Consistent type scales (display fonts and mono accents).' }
    ],
    lastUpdated: '2026-06-12T17:15:00Z',
    submittedAt: '2026-06-12T17:20:00Z'
  }
];

// 4. Initial Default Scores Configuration
export const defaultWeights: ScoreWeights = {
  weeklyLogCount: 10,
  weeklyLogsWeight: 30, // 30%
  supervisorEvalWeight: 40, // 40%
  academicLiaisonWeight: 30 // 30%
};

// 5. Initial Evaluations
export const defaultSupervisorEvaluations: SupervisorEvaluation[] = [
  {
    id: 'sup_eval_jordan',
    studentId: 'student_jordan',
    placementId: 'placement_jordan',
    technicalCapability: 95,
    punctualityReliability: 90,
    communicationSkills: 92,
    problemSolvingAbility: 96,
    overallPerformance: 93,
    generalComments: 'Jordan has demonstrated extraordinary growth. He is an independent thinker, writes very robust code, and does not hesitate to spearhead complex database optimization tasks. High competence shown.',
    gradedAt: '2026-06-14T10:00:00Z',
    gradedBy: 'supervisor_sarah'
  }
];

export const defaultAcademicEvaluations: AcademicEvaluation[] = [
  {
    id: 'acad_eval_jordan',
    studentId: 'student_jordan',
    placementId: 'placement_jordan',
    siteVisitScore: 88,
    midtermPresentationScore: 92,
    finalReportScore: 90,
    generalComments: 'Strong overall alignment with industrial criteria. Site visit supervisor interview was glowing. Jordan presents clearly and is keeping a very diligent logbook.',
    gradedAt: '2026-06-15T09:00:00Z',
    gradedBy: 'liaison_john'
  }
];

// 6. Default Notifications
export const defaultNotifications: SystemNotification[] = [
  {
    id: 'notify_1',
    title: 'Logbook Approved',
    message: 'Your Week 3 Logbook has been reviewed and approved by Sarah Jenkins.',
    timestamp: '2026-06-10T11:00:00Z',
    read: true,
    targetRole: UserRole.STUDENT,
    targetUserId: 'student_jordan',
    category: 'logbook'
  },
  {
    id: 'notify_2',
    title: 'Revision Requested',
    message: 'Sarah Jenkins requested changes for Week 4 Logbook. Reason: "elaborate on redis cache load tests".',
    timestamp: '2026-06-11T14:30:00Z',
    read: false,
    targetRole: UserRole.STUDENT,
    targetUserId: 'student_jordan',
    category: 'logbook'
  },
  {
    id: 'notify_3',
    title: 'Logbook Submitted',
    message: 'Jordan Rukundo submitted Week 5 Logbook for review.',
    timestamp: '2026-06-12T17:20:00Z',
    read: false,
    targetRole: UserRole.SUPERVISOR,
    targetUserId: 'supervisor_sarah',
    category: 'logbook'
  },
  {
    id: 'notify_4',
    title: 'Placement Update',
    message: 'Your internship placement at TechCorp Software Solutions has been marked as Active.',
    timestamp: '2026-05-11T09:00:00Z',
    read: true,
    targetRole: UserRole.STUDENT,
    targetUserId: 'student_jordan',
    category: 'placement'
  }
];

// Helper variables for GitLab simulator
export const defaultGitCommits: GitCommit[] = [
  { hash: '7c8f2d5', authorName: 'Jordan Rukundo', authorEmail: 'jordanrukundo@gmail.com', date: '2026-06-12 16:45', message: 'feat: Polish dashboard metrics and append responsive SVG charts', branch: 'main' },
  { hash: '4a1e9c2', authorName: 'Alice Chen', authorEmail: 'alice.chen@university.edu', date: '2026-06-12 14:10', message: 'fix: Align footer alignment grid and resolve spacing overlap', branch: 'main' },
  { hash: 'bb91a0c', authorName: 'Jordan Rukundo', authorEmail: 'jordanrukundo@gmail.com', date: '2026-06-11 11:30', message: 'test: Add unit verification tests for Redis logging invalidation', branch: 'feature/redis-invalid' },
  { hash: 'fb4219a', authorName: 'Jordan Rukundo', authorEmail: 'jordanrukundo@gmail.com', date: '2026-06-10 18:22', message: 'feat: Implement core redis connector and sliding window rate limiter', branch: 'feature/redis-invalid' },
  { hash: 'da932ef', authorName: 'Alice Chen', authorEmail: 'alice.chen@university.edu', date: '2026-06-09 10:45', message: 'docs: Draft initial placement register outline layouts', branch: 'main' },
  { hash: 'e2c6791', authorName: 'Jordan Rukundo', authorEmail: 'jordanrukundo@gmail.com', date: '2026-06-08 15:30', message: 'chore: Refactor deep Zod form validator fields to allow optional overrides', branch: 'main' }
];

export const defaultMergeRequests: MergeRequest[] = [
  { id: 'mr_1', title: 'feat: Implements Core Redis Storage Cache and Integration Tests', authorName: 'Jordan Rukundo', sourceBranch: 'feature/redis-invalid', targetBranch: 'main', status: 'MERGED', createdAt: '2026-06-10' },
  { id: 'mr_2', title: 'fix: Adjust Card Paddings and Layout Overlap on Mobile Viewports', authorName: 'Alice Chen', sourceBranch: 'bugfix/viewport-spacing', targetBranch: 'main', status: 'MERGED', createdAt: '2026-06-12' },
  { id: 'mr_3', title: 'feat: Draft Academic Grading Score Configuration Screens', authorName: 'Jordan Rukundo', sourceBranch: 'feature/academic-weights', targetBranch: 'main', status: 'OPEN', createdAt: '2026-06-15' }
];

// Helper variables for Unit Testing simulator
export const defaultUnitTests: UnitTestCase[] = [
  { id: 'ut_1', name: 'Student Placement validation fails if startDate > endDate', suite: 'Backend', status: 'PASSED', durationMs: 12 },
  { id: 'ut_2', name: 'Logbook submission shifts status to PENDING_REVIEW', suite: 'Backend', status: 'PASSED', durationMs: 18 },
  { id: 'ut_3', name: 'Weighted score calculation accurately multiplies user matrices', suite: 'Backend', status: 'PASSED', durationMs: 4 },
  { id: 'ut_4', name: 'Zod schemas block incomplete logbook inputs', suite: 'Backend', status: 'PASSED', durationMs: 22 },
  { id: 'ut_5', name: 'Active role boundaries isolate academic liaisons from system configurations', suite: 'Backend', status: 'PASSED', durationMs: 15 },
  { id: 'ut_6', name: 'Auth token validates email structure and expiration values', suite: 'Backend', status: 'PASSED', durationMs: 9 },
  { id: 'ut_7', name: 'Layout rendering matches mobile break points cleanly', suite: 'Frontend', status: 'PASSED', durationMs: 42 },
  { id: 'ut_8', name: 'Activity chart processes nested data nodes without null crashes', suite: 'Frontend', status: 'PASSED', durationMs: 84 },
  { id: 'ut_9', name: 'Evaluation grade computes standard letter grades matches criteria scales', suite: 'Frontend', status: 'PASSED', durationMs: 14 }
];

// Interactive mock API simulator
export const defaultApiEndpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/placements/student/:id',
    description: 'Fetch the active internship placement parameters and matched supervisor details for a specified student ID.',
    successResponseExample: `{
  "status": "success",
  "data": {
    "id": "placement_jordan",
    "studentId": "student_jordan",
    "companyName": "TechCorp Software Solutions",
    "positionTitle": "Junior Software Development Intern",
    "supervisorName": "Sarah Jenkins",
    "status": "ACTIVE"
  }
}`,
    rolesAllowed: ['STUDENT', 'SUPERVISOR', 'ACADEMIC_LIAISON', 'ADMIN']
  },
  {
    method: 'GET',
    path: '/api/v1/logbooks/student/:id',
    description: 'Retrieve all historically logged, submitted, and evaluated weekly sheets completed by a student.',
    successResponseExample: `[
  {
    "id": "log_jordan_w1",
    "weekNumber": 1,
    "totalHours": 40,
    "status": "APPROVED",
    "supervisorFeedback": "Excellent onboarding week..."
  }
]`,
    rolesAllowed: ['STUDENT', 'SUPERVISOR', 'ACADEMIC_LIAISON', 'ADMIN']
  },
  {
    method: 'PUT',
    path: '/api/v1/logbooks/:id/status',
    description: 'Transition a weekly logbook status. For supervisors to approve, reject, or request revisions.',
    requestBodyExample: `{
  "status": "APPROVED",
  "supervisorFeedback": "Superb task logging, code optimization was well explained."
}`,
    successResponseExample: `{
  "status": "success",
  "message": "Logbook status transit successfully.",
  "data": {
    "id": "log_jordan_w5",
    "status": "APPROVED",
    "reviewedAt": "2026-06-15T13:05:00Z"
  }
}`,
    rolesAllowed: ['SUPERVISOR', 'ADMIN']
  },
  {
    method: 'POST',
    path: '/api/v1/evaluations/academic',
    description: 'Submit academic advisor grade inputs including midterm presentation, site visits, and final writeup scores.',
    requestBodyExample: `{
  "studentId": "student_jordan",
  "siteVisitScore": 88,
  "midtermPresentationScore": 92,
  "finalReportScore": 90
}`,
    successResponseExample: `{
  "status": "success",
  "id": "acad_eval_jordan_new",
  "calculatedScore": 90.0
}`,
    rolesAllowed: ['ACADEMIC_LIAISON', 'ADMIN']
  }
];

// Main LocalStorage State Manager
export class IlesDbManager {
  static init() {
    if (!localStorage.getItem('iles_users')) {
      localStorage.setItem('iles_users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('iles_placements')) {
      localStorage.setItem('iles_placements', JSON.stringify(defaultPlacements));
    }
    if (!localStorage.getItem('iles_logbooks')) {
      localStorage.setItem('iles_logbooks', JSON.stringify(defaultLogbooks));
    }
    if (!localStorage.getItem('iles_weights')) {
      localStorage.setItem('iles_weights', JSON.stringify(defaultWeights));
    }
    if (!localStorage.getItem('iles_sup_evals')) {
      localStorage.setItem('iles_sup_evals', JSON.stringify(defaultSupervisorEvaluations));
    }
    if (!localStorage.getItem('iles_acad_evals')) {
      localStorage.setItem('iles_acad_evals', JSON.stringify(defaultAcademicEvaluations));
    }
    if (!localStorage.getItem('iles_notifications')) {
      localStorage.setItem('iles_notifications', JSON.stringify(defaultNotifications));
    }
    if (!localStorage.getItem('iles_commits')) {
      localStorage.setItem('iles_commits', JSON.stringify(defaultGitCommits));
    }
    if (!localStorage.getItem('iles_mrs')) {
      localStorage.setItem('iles_mrs', JSON.stringify(defaultMergeRequests));
    }
    if (!localStorage.getItem('iles_tests')) {
      localStorage.setItem('iles_tests', JSON.stringify(defaultUnitTests));
    }
  }

  // Generic Getters/Setters
  static getUsers(): UserProfile[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_users') || '[]');
  }

  static getPlacements(): Placement[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_placements') || '[]');
  }

  static getLogbooks(): WeeklyLogbook[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_logbooks') || '[]');
  }

  static getWeights(): ScoreWeights {
    this.init();
    return JSON.parse(localStorage.getItem('iles_weights') || JSON.stringify(defaultWeights));
  }

  static getSupervisorEvaluations(): SupervisorEvaluation[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_sup_evals') || '[]');
  }

  static getAcademicEvaluations(): AcademicEvaluation[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_acad_evals') || '[]');
  }

  static getNotifications(): SystemNotification[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_notifications') || '[]');
  }

  static getCommits(): GitCommit[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_commits') || '[]');
  }

  static getMergeRequests(): MergeRequest[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_mrs') || '[]');
  }

  static getTests(): UnitTestCase[] {
    this.init();
    return JSON.parse(localStorage.getItem('iles_tests') || '[]');
  }

  // Update logic triggers
  static saveLogbooks(logs: WeeklyLogbook[]) {
    localStorage.setItem('iles_logbooks', JSON.stringify(logs));
  }

  static savePlacements(placements: Placement[]) {
    localStorage.setItem('iles_placements', JSON.stringify(placements));
  }

  static saveWeights(weights: ScoreWeights) {
    localStorage.setItem('iles_weights', JSON.stringify(weights));
  }

  static saveSupervisorEvaluations(evals: SupervisorEvaluation[]) {
    localStorage.setItem('iles_sup_evals', JSON.stringify(evals));
  }

  static saveAcademicEvaluations(evals: AcademicEvaluation[]) {
    localStorage.setItem('iles_acad_evals', JSON.stringify(evals));
  }

  static saveUsers(users: UserProfile[]) {
    localStorage.setItem('iles_users', JSON.stringify(users));
  }

  static addNotification(title: string, message: string, targetRole: UserRole | 'ALL', targetUserId?: string, category: 'logbook' | 'placement' | 'evaluation' | 'system' = 'system') {
    const notifications = this.getNotifications();
    const newNotify: SystemNotification = {
      id: generateId(),
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      targetRole,
      targetUserId,
      category
    };
    notifications.unshift(newNotify);
    localStorage.setItem('iles_notifications', JSON.stringify(notifications));
  }

  static markNotificationsRead() {
    const notifications = this.getNotifications();
    notifications.forEach(n => n.read = true);
    localStorage.setItem('iles_notifications', JSON.stringify(notifications));
  }

  static addCommit(commit: GitCommit) {
    const commits = this.getCommits();
    commits.unshift(commit);
    localStorage.setItem('iles_commits', JSON.stringify(commits));
  }

  static addMergeRequest(mr: MergeRequest) {
    const mrs = this.getMergeRequests();
    mrs.unshift(mr);
    localStorage.setItem('iles_mrs', JSON.stringify(mrs));
  }
}
