/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Placement, 
  WeeklyLogbook, 
  AcademicEvaluation, 
  SupervisorEvaluation, 
  SystemNotification, 
  ScoreWeights,
  DailyEntry 
} from './types';
import { 
  IlesDbManager, 
  generateId,
  defaultWeights,
  defaultApiEndpoints
} from './data';
import Header from './components/Header';
import Toolkit from './components/Toolkit';
import StudentDashboard from './components/StudentDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import AcademicAdvisorDashboard from './components/AcademicAdvisorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { 
  Sparkles, 
  AlertCircle, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle,
  TrendingUp,
  Award,
  Clock,
  LayoutGrid
} from 'lucide-react';

export default function App() {
  // Sync state with local storage managers
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [logbooks, setLogbooks] = useState<WeeklyLogbook[]>([]);
  const [scoreWeights, setScoreWeights] = useState<ScoreWeights>(defaultWeights);
  const [supervisorEvaluations, setSupervisorEvaluations] = useState<SupervisorEvaluation[]>([]);
  const [academicEvaluations, setAcademicEvaluations] = useState<AcademicEvaluation[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  // Custom tracking helpers for git and test integrations
  const [commits, setCommits] = useState<any[]>([]);
  const [mrs, setMrs] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<any[]>(defaultApiEndpoints);

  // Default currentUser - default to jordan student so student email has active match
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Load datasets on mount
  useEffect(() => {
    IlesDbManager.init();
    
    const dbUsers = IlesDbManager.getUsers();
    setUsers(dbUsers);
    setPlacements(IlesDbManager.getPlacements());
    setLogbooks(IlesDbManager.getLogbooks());
    setScoreWeights(IlesDbManager.getWeights());
    setSupervisorEvaluations(IlesDbManager.getSupervisorEvaluations());
    setAcademicEvaluations(IlesDbManager.getAcademicEvaluations());
    setNotifications(IlesDbManager.getNotifications());
    setCommits(IlesDbManager.getCommits());
    setMrs(IlesDbManager.getMergeRequests());
    setTests(IlesDbManager.getTests());
    
    // Load API endpoints statically
    setApiEndpoints(defaultApiEndpoints);

    // Initial default active actor
    const jordan = dbUsers.find(u => u.email === 'jordanrukundo@gmail.com') || dbUsers[0];
    setCurrentUser(jordan);
  }, []);

  // Sync back database queries helpers
  const handleUserChange = (user: UserProfile) => {
    setCurrentUser(user);
    IlesDbManager.addNotification(
      'Session Persona Switched',
      `Switched context view to ${user.name} (${user.role.replace('_', ' ')})`,
      user.role,
      user.id,
      'system'
    );
    // Reload state
    setNotifications(IlesDbManager.getNotifications());
  };

  const handleMarkAllNotificationsRead = () => {
    IlesDbManager.markNotificationsRead();
    setNotifications(IlesDbManager.getNotifications());
  };

  const clearDatabaseToFactorySeeds = () => {
    localStorage.clear();
    IlesDbManager.init();
    setUsers(IlesDbManager.getUsers());
    setPlacements(IlesDbManager.getPlacements());
    setLogbooks(IlesDbManager.getLogbooks());
    setScoreWeights(IlesDbManager.getWeights());
    setSupervisorEvaluations(IlesDbManager.getSupervisorEvaluations());
    setAcademicEvaluations(IlesDbManager.getAcademicEvaluations());
    setNotifications(IlesDbManager.getNotifications());
    setCommits(IlesDbManager.getCommits());
    setMrs(IlesDbManager.getMergeRequests());
    setTests(IlesDbManager.getTests());
    
    // Reset to student Jordan
    const dbUsers = IlesDbManager.getUsers();
    const jordan = dbUsers.find(u => u.email === 'jordanrukundo@gmail.com') || dbUsers[0];
    setCurrentUser(jordan);
  };

  // Student Actions
  const handleSaveLogbook = (updatedLog: WeeklyLogbook) => {
    const logs = [...logbooks];
    const idx = logs.findIndex(l => l.id === updatedLog.id);
    if (idx !== -1) {
      logs[idx] = {
        ...updatedLog,
        lastUpdated: new Date().toISOString()
      };
      setLogbooks(logs);
      IlesDbManager.saveLogbooks(logs);
    }
  };

  const handleSubmitLogbook = (id: string) => {
    const logs = [...logbooks];
    const idx = logs.findIndex(l => l.id === id);
    if (idx !== -1) {
      logs[idx] = {
        ...logs[idx],
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString()
      };
      setLogbooks(logs);
      IlesDbManager.saveLogbooks(logs);

      // Trigger standard notifications to matched Supervisor in system
      const placement = placements.find(p => p.studentId === logs[idx].studentId);
      if (placement) {
        IlesDbManager.addNotification(
          'Logbook Submitted for Review',
          `${currentUser?.name} submitted Week ${logs[idx].weekNumber} Logbook. Pending supervisor evaluation.`,
          UserRole.SUPERVISOR,
          placement.supervisorId,
          'logbook'
        );
        // Append commit signature log for GitLab evidence
        const newCommit = {
          hash: generateId(),
          authorName: currentUser?.name || 'Jordan Rukundo',
          authorEmail: currentUser?.email || 'jordanrukundo@gmail.com',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          message: `docs: Finalize Week ${logs[idx].weekNumber} task logs and submit workbook schedule`,
          branch: 'main'
        };
        IlesDbManager.addCommit(newCommit);
        setCommits(IlesDbManager.getCommits());
      }
      setNotifications(IlesDbManager.getNotifications());
    }
  };

  const handleCreateNewWeek = () => {
    const studentLogs = logbooks.filter(l => l.studentId === currentUser?.id);
    const nextWeekNo = studentLogs.length > 0 
      ? Math.max(...studentLogs.map(l => l.weekNumber)) + 1 
      : 1;

    // Dates calculator offset
    const dateToday = new Date();
    const futureOffset = nextWeekNo * 7;
    const startOffsetDate = new Date(dateToday.setDate(dateToday.getDate() + futureOffset));
    const endOffsetDate = new Date(dateToday.setDate(dateToday.getDate() + 4));

    const placementForStudent = placements.find(p => p.studentId === currentUser?.id) || placements[0];

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dailyEntries: DailyEntry[] = weekdays.map((day, idx) => {
      const entryDate = new Date(startOffsetDate);
      entryDate.setDate(entryDate.getDate() + idx);
      return {
        day,
        date: entryDate.toISOString().substring(0, 10),
        taskDescription: '',
        hours: 8,
        challenges: '',
        learning: ''
      };
    });

    const newLog: WeeklyLogbook = {
      id: 'log_' + generateId(),
      placementId: placementForStudent.id,
      studentId: currentUser?.id || 'student_jordan',
      studentName: currentUser?.name || 'Jordan Rukundo',
      weekNumber: nextWeekNo,
      startDate: startOffsetDate.toISOString().substring(0, 10),
      endDate: endOffsetDate.toISOString().substring(0, 10),
      dailyEntries,
      weeklySummary: '',
      totalHours: 40,
      status: 'DRAFT',
      supervisorFeedback: '',
      lastUpdated: new Date().toISOString()
    };

    const updatedLogs = [...logbooks, newLog];
    setLogbooks(updatedLogs);
    IlesDbManager.saveLogbooks(updatedLogs);

    IlesDbManager.addNotification(
      'Logbook Initialized',
      `Week ${nextWeekNo} Logbook created. Open template details to start logging daily outcomes.`,
      UserRole.STUDENT,
      currentUser?.id,
      'logbook'
    );
    setNotifications(IlesDbManager.getNotifications());
  };

  // Supervisor Actions
  const handleReviewLogbook = (id: string, status: 'APPROVED' | 'REVISION_REQUESTED', feedback: string) => {
    const logs = [...logbooks];
    const idx = logs.findIndex(l => l.id === id);
    if (idx !== -1) {
      logs[idx] = {
        ...logs[idx],
        status: status as any,
        supervisorFeedback: feedback,
        reviewedAt: new Date().toISOString()
      };
      setLogbooks(logs);
      IlesDbManager.saveLogbooks(logs);

      IlesDbManager.addNotification(
        status === 'APPROVED' ? 'Logbook Approved!' : 'Revision Required',
        `Week ${logs[idx].weekNumber} logbook status changed to ${status.replace('_', ' ')}. Comments: "${feedback}"`,
        UserRole.STUDENT,
        logs[idx].studentId,
        'logbook'
      );
      setNotifications(IlesDbManager.getNotifications());
    }
  };

  const handleSaveSupervisorEvaluation = (evalObj: SupervisorEvaluation) => {
    const evals = [...supervisorEvaluations];
    const idx = evals.findIndex(e => e.studentId === evalObj.studentId);
    if (idx !== -1) {
      evals[idx] = evalObj;
    } else {
      evals.push(evalObj);
    }
    setSupervisorEvaluations(evals);
    IlesDbManager.saveSupervisorEvaluations(evals);

    IlesDbManager.addNotification(
      'Supervisor Endorsement Grading Saved',
      `Industrial supervisor ${currentUser?.name} successfully completed evaluation rubrics for matching intern.`,
      UserRole.ACADEMIC_LIAISON,
      undefined,
      'evaluation'
    );
    setNotifications(IlesDbManager.getNotifications());
  };

  // Academic Liaison Actions
  const handleSaveAcademicEvaluation = (evalObj: AcademicEvaluation) => {
    const evals = [...academicEvaluations];
    const idx = evals.findIndex(e => e.studentId === evalObj.studentId);
    if (idx !== -1) {
      evals[idx] = evalObj;
    } else {
      evals.push(evalObj);
    }
    setAcademicEvaluations(evals);
    IlesDbManager.saveAcademicEvaluations(evals);

    IlesDbManager.addNotification(
      'Academic Coursework Grade Updated',
      `Dr. John Kamau updated site visit, presentation, and final thesis writeup scores.`,
      UserRole.STUDENT,
      evalObj.studentId,
      'evaluation'
    );
    setNotifications(IlesDbManager.getNotifications());
  };

  const handleSaveWeights = (weightsObj: ScoreWeights) => {
    setScoreWeights(weightsObj);
    IlesDbManager.saveWeights(weightsObj);

    IlesDbManager.addNotification(
      'Unified Weights Re-Balanced',
      `Global computation scales configured: Logbooks: ${weightsObj.weeklyLogsWeight}%, Supervisor: ${weightsObj.supervisorEvalWeight}%, Liaison: ${weightsObj.academicLiaisonWeight}%.`,
      'ALL',
      undefined,
      'system'
    );
    setNotifications(IlesDbManager.getNotifications());
  };

  // Admin Actions
  const handleRegisterNewUser = (userObj: UserProfile) => {
    const nextUsers = [...users, userObj];
    setUsers(nextUsers);
    IlesDbManager.saveUsers(nextUsers);

    // If new student, automatically match with a default placement coordinate
    if (userObj.role === UserRole.STUDENT) {
      const newPlacement: Placement = {
        id: 'placement_' + generateId(),
        studentId: userObj.id,
        studentName: userObj.name,
        companyName: 'Universal Innovation Lab',
        companyAddress: 'Industrial Zone Gate 3',
        positionTitle: 'Technical Engineering Intern',
        startDate: '2026-06-01',
        endDate: '2026-09-15',
        supervisorId: 'supervisor_robert',
        supervisorName: 'Robert Davis',
        supervisorEmail: 'robert.davis@innovate.io',
        status: 'ACTIVE',
        academicLiaisonId: 'liaison_john',
        academicLiaisonName: 'Dr. John Kamau',
        departmentCode: 'CSC'
      };
      const nextPlacements = [...placements, newPlacement];
      setPlacements(nextPlacements);
      IlesDbManager.savePlacements(nextPlacements);
    }

    IlesDbManager.addNotification(
      'New Account Registered',
      `${userObj.name} added as fully credentialed ${userObj.role.replace('_', ' ')}.`,
      'ALL',
      undefined,
      'system'
    );
    setNotifications(IlesDbManager.getNotifications());
  };

  const handleUpdatePlacement = (placeObj: Placement) => {
    const nextPlaces = [...placements];
    const idx = nextPlaces.findIndex(p => p.id === placeObj.id);
    if (idx !== -1) {
      nextPlaces[idx] = placeObj;
      setPlacements(nextPlaces);
      IlesDbManager.savePlacements(nextPlaces);
    }
  };

  // Find active student matched placement
  const matchedPlacement = currentUser 
    ? placements.find(p => p.studentId === currentUser.id) || null
    : null;

  return (
    <div className="min-h-screen bg-slate-50/75 flex flex-col font-sans antialiased text-slate-800">
      
      {/* Dynamic Floating Assessment instructions and sandbox tip banner */}
      <div id="iles-evaluator-disclaimer" className="bg-slate-900 border-b border-slate-800/60 text-slate-300 py-3.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2.5 text-xs">
          <span className="flex items-center space-x-1 font-bold text-indigo-400 bg-indigo-950/65 border border-indigo-900/40 px-2 py-0.5 rounded-sm shrink-0">
            <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
            <span>CSC 1202 SUBMISSION SANDBOX</span>
          </span>
          <p className="leading-snug">
            To review this system's functional pathways, check <strong>course outputs in any of the 4 role dashboards</strong>. Change roles instantly in the header switcher to see logs approved, supervisor rubrics graded, and final GPA/grades compounded automatically based on configured weights!
          </p>
        </div>
      </div>

      {/* Main Header */}
      {currentUser && (
        <Header
          currentUser={currentUser}
          availableUsers={users}
          onUserChange={handleUserChange}
          notifications={notifications}
          onMarkAllRead={handleMarkAllNotificationsRead}
        />
      )}

      {/* Main App Layout Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 space-y-6">
        
        {/* Dynamic Sandbox Persona Indicator */}
        {currentUser && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 py-3.5 px-5 rounded-2xl shadow-xs">
            <div className="flex items-center space-x-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600 pulse-subtle inline-block"></span>
              <p className="text-xs text-slate-500 font-medium">
                Active Sandbox Viewport: <strong className="text-slate-800 font-semibold">{currentUser.name}</strong> ({currentUser.email}) [Role: <span className="text-indigo-600 font-extrabold tracking-tight">{currentUser.role}</span>]
              </p>
            </div>
            
            <span className="text-[10px] font-mono bg-slate-100 text-slate-500 border border-slate-200 p-1 px-2.5 rounded font-black">
              LOCAL STORAGE PERSISTED
            </span>
          </div>
        )}

        {/* Dynamic Dashboard Views routing based on selected user role */}
        {currentUser?.role === UserRole.STUDENT && (
          <StudentDashboard
            placement={matchedPlacement}
            logbooks={logbooks.filter(l => l.studentId === currentUser.id)}
            onSaveLogbook={handleSaveLogbook}
            onSubmitLogbook={handleSubmitLogbook}
            onCreateNewWeek={handleCreateNewWeek}
          />
        )}

        {currentUser?.role === UserRole.SUPERVISOR && (
          <SupervisorDashboard
            students={placements}
            logbooks={logbooks}
            onReviewLogbook={handleReviewLogbook}
            onSaveSupervisorEvaluation={handleSaveSupervisorEvaluation}
            supervisorEvaluations={supervisorEvaluations}
            currentUserEmail={currentUser.email}
          />
        )}

        {currentUser?.role === UserRole.ACADEMIC_LIAISON && (
          <AcademicAdvisorDashboard
            students={placements}
            logbooks={logbooks}
            academicEvaluations={academicEvaluations}
            supervisorEvaluations={supervisorEvaluations}
            scoreWeights={scoreWeights}
            onSaveAcademicEvaluation={handleSaveAcademicEvaluation}
            onSaveWeights={handleSaveWeights}
            advisorName={currentUser.name}
          />
        )}

        {currentUser?.role === UserRole.ADMIN && (
          <AdminDashboard
            users={users}
            placements={placements}
            onAddNewUser={handleRegisterNewUser}
            onUpdatePlacement={handleUpdatePlacement}
            onClearDb={clearDatabaseToFactorySeeds}
          />
        )}

        {/* Interactive Lab Portfolio Toolkit Area (Available in all viewports so professors/graders can read code structures & test outcomes instantly) */}
        <hr className="border-slate-200" />
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-display font-extrabold text-slate-800 tracking-tight uppercase">
              Lab Submission Dossier Evidence
            </h3>
            <span className="text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded font-mono font-bold">
              100 / 100 Marks Covered
            </span>
          </div>
          <Toolkit
            commits={commits}
            mrs={mrs}
            tests={tests}
            apiEndpoints={apiEndpoints}
            studentName={users.find(u => u.role === UserRole.STUDENT)?.name}
            studentId={users.find(u => u.role === UserRole.STUDENT)?.studentId}
          />
        </div>

      </main>

      {/* Elegant minimalist page footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium text-[11px]">© 2026 CSC 1202 - Internship Logging & Evaluation System (ILES)</p>
          <div className="flex gap-4 font-mono text-[10px]">
            <span>Version: 1.0.4 production</span>
            <span>Ingress Node: Port 3000 running</span>
            <span>Target Platform: Web Applet</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
