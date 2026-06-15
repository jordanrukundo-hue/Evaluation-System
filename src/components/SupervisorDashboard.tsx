/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Placement, WeeklyLogbook, SupervisorEvaluation } from '../types';
import { 
  Users, 
  Check, 
  AlertTriangle, 
  FileCheck2, 
  ChevronRight, 
  Clock, 
  Award,
  Star,
  Layers,
  Save,
  MessageSquare
} from 'lucide-react';

interface SupervisorDashboardProps {
  students: Placement[];
  logbooks: WeeklyLogbook[];
  onReviewLogbook: (id: string, status: 'APPROVED' | 'REVISION_REQUESTED', feedback: string) => void;
  onSaveSupervisorEvaluation: (evaluation: SupervisorEvaluation) => void;
  supervisorEvaluations: SupervisorEvaluation[];
  currentUserEmail: string;
}

export default function SupervisorDashboard({
  students,
  logbooks,
  onReviewLogbook,
  onSaveSupervisorEvaluation,
  supervisorEvaluations,
  currentUserEmail
}: SupervisorDashboardProps) {
  // Find placing assigned to this supervisor
  const assignedPlacements = students.filter(s => s.supervisorEmail === currentUserEmail);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(
    assignedPlacements.length > 0 ? assignedPlacements[0].id : null
  );

  const activePlacement = assignedPlacements.find(p => p.id === selectedPlacementId) || null;
  const activeStudentId = activePlacement?.studentId || '';

  // Get logbooks for this student
  const studentLogbooks = logbooks.filter(l => l.studentId === activeStudentId);
  const pendingLogbooks = studentLogbooks.filter(l => l.status === 'SUBMITTED');
  const evaluatedLogbooks = studentLogbooks.filter(l => l.status === 'APPROVED');

  const [reviewLogbookId, setReviewLogbookId] = useState<string | null>(
    pendingLogbooks.length > 0 ? pendingLogbooks[0].id : null
  );
  
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [quickTemplate, setQuickTemplate] = useState('');

  // Silding grades states for Supervisor Evaluation Form
  const existingEvaluation = supervisorEvaluations.find(e => e.studentId === activeStudentId);
  
  const [techGrade, setTechGrade] = useState(existingEvaluation?.technicalCapability || 90);
  const [puncGrade, setPuncGrade] = useState(existingEvaluation?.punctualityReliability || 90);
  const [commGrade, setCommGrade] = useState(existingEvaluation?.communicationSkills || 90);
  const [problemGrade, setProblemGrade] = useState(existingEvaluation?.problemSolvingAbility || 90);
  const [comments, setComments] = useState(existingEvaluation?.generalComments || '');
  const [showEvaluationSuccess, setShowEvaluationSuccess] = useState(false);

  // Sync state if student changes
  React.useEffect(() => {
    if (activeStudentId) {
      const activeEval = supervisorEvaluations.find(e => e.studentId === activeStudentId);
      setTechGrade(activeEval?.technicalCapability || 90);
      setPuncGrade(activeEval?.punctualityReliability || 90);
      setCommGrade(activeEval?.communicationSkills || 90);
      setProblemGrade(activeEval?.problemSolvingAbility || 90);
      setComments(activeEval?.generalComments || '');
      setShowEvaluationSuccess(false);

      const activeStudentPending = logbooks.filter(l => l.studentId === activeStudentId && l.status === 'SUBMITTED');
      setReviewLogbookId(activeStudentPending.length > 0 ? activeStudentPending[0].id : null);
      setReviewFeedback('');
    }
  }, [selectedPlacementId, supervisorEvaluations, logbooks]);

  const handleReviewAction = (status: 'APPROVED' | 'REVISION_REQUESTED') => {
    if (reviewLogbookId) {
      const finalMsg = reviewFeedback || quickTemplate || (status === 'APPROVED' ? 'Excellent logs, approved.' : 'Please add more details regarding achievements.');
      onReviewLogbook(reviewLogbookId, status, finalMsg);
      setReviewLogbookId(null);
      setReviewFeedback('');
      setQuickTemplate('');
    }
  };

  const handleSaveAssessment = () => {
    if (activePlacement) {
      const averageOverall = Math.round((techGrade + puncGrade + commGrade + problemGrade) / 4);
      onSaveSupervisorEvaluation({
        id: existingEvaluation?.id || 'eval_' + Math.random().toString(36).substring(3, 9),
        studentId: activeStudentId,
        placementId: activePlacement.id,
        technicalCapability: techGrade,
        punctualityReliability: puncGrade,
        communicationSkills: commGrade,
        problemSolvingAbility: problemGrade,
        overallPerformance: averageOverall,
        generalComments: comments || 'Jordan shows consistent application node capabilities in real-time software systems.',
        gradedAt: new Date().toISOString(),
        gradedBy: currentUserEmail
      });
      setShowEvaluationSuccess(true);
      setTimeout(() => setShowEvaluationSuccess(false), 3000);
    }
  };

  const currentSelectionLogbook = studentLogbooks.find(l => l.id === reviewLogbookId);

  return (
    <div className="space-y-6">
      
      {/* Selector tab row for active interns */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-3">Assigned Students Under Your Direction</span>
        <div className="flex flex-wrap gap-3">
          {assignedPlacements.map(student => (
            <button
              key={student.id}
              onClick={() => setSelectedPlacementId(student.id)}
              className={`flex items-center space-x-3 p-3 px-4 rounded-2xl border text-left cursor-pointer transition-all ${
                selectedPlacementId === student.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md shadow-slate-950/10' 
                  : 'bg-white hover:bg-slate-50 border-slate-205 text-slate-705'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${selectedPlacementId === student.id ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-black tracking-tight leading-none">{student.studentName}</p>
                <p className="text-[9px] font-mono mt-1 opacity-80">{student.positionTitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activePlacement ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Submitted week list and Supervisor action console */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Awaiting review console */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Awaiting Action Journals</span>
                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full">
                  {pendingLogbooks.length} pending
                </span>
              </div>

              {pendingLogbooks.length > 0 ? (
                <div className="space-y-4">
                  
                  {/* Selector list of pending books */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {pendingLogbooks.map(log => (
                      <button
                        key={log.id}
                        onClick={() => {
                          setReviewLogbookId(log.id);
                          setReviewFeedback('');
                        }}
                        className={`p-2 px-3 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                          reviewLogbookId === log.id 
                            ? 'bg-slate-50 border-slate-800 text-slate-900' 
                            : 'bg-white border-slate-200 text-slate-500'
                        }`}
                      >
                        Week {log.weekNumber} logs
                      </button>
                    ))}
                  </div>

                  {currentSelectionLogbook && (
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center bg-white p-2.5 border border-slate-200 rounded-xl">
                        <span className="text-xs font-black text-slate-800">Review Week {currentSelectionLogbook.weekNumber} Entry</span>
                        <span className="font-mono text-[11px] bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                          {currentSelectionLogbook.totalHours} hours total
                        </span>
                      </div>
                      
                      {/* Displays summary to read directly */}
                      <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 border border-slate-150 rounded-xl">
                        "{currentSelectionLogbook.weeklySummary || 'No summary compiled.'}"
                      </p>

                      {/* Daily break-downs briefly */}
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {currentSelectionLogbook.dailyEntries.map((entry, idx) => (
                          <div key={idx} className="bg-white p-2 border border-slate-150 rounded-lg text-[10px] space-y-1">
                            <div className="flex justify-between">
                              <span className="font-bold text-slate-700">{entry.day}: {entry.hours}h</span>
                              <span className="text-slate-400">{entry.date}</span>
                            </div>
                            <p className="font-medium text-slate-650">{entry.taskDescription}</p>
                            {entry.challenges && <p className="text-rose-600 italic">Challenges: {entry.challenges}</p>}
                          </div>
                        ))}
                      </div>

                      {/* Supervisor feedback boxes */}
                      <div className="space-y-2 pt-3 border-t border-slate-200">
                        <label className="block text-[10px] uppercase font-bold text-slate-400">Review Comments & Corrections</label>
                        
                        {/* Quick responses list */}
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            'Excellent detailed activity list. Approved.', 
                            'Please expand on technical tasks compiled on Thursday.', 
                            'Hours mismatch, please adjust with correct timings.'
                          ].map(tpl => (
                            <button
                              key={tpl}
                              type="button"
                              onClick={() => setQuickTemplate(tpl)}
                              className={`text-[9px] p-1 px-2 rounded-lg border cursor-pointer transition-all ${
                                quickTemplate === tpl 
                                  ? 'bg-indigo-50 border-indigo-200 text-indigo-800 font-semibold' 
                                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-500'
                              }`}
                            >
                              {tpl}
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={reviewFeedback || quickTemplate}
                          onChange={(e) => {
                            setReviewFeedback(e.target.value);
                            setQuickTemplate('');
                          }}
                          placeholder="Type supervisor logs comments here..."
                          rows={2}
                          className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                        />

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleReviewAction('APPROVED')}
                            className="cursor-pointer flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-2 rounded-xl transition-all shadow-md shadow-indigo-500/10 flex items-center justify-center space-x-1"
                          >
                            <Check className="h-4 w-4" />
                            <span>Approve logs</span>
                          </button>
                          <button
                            onClick={() => handleReviewAction('REVISION_REQUESTED')}
                            className="cursor-pointer flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs p-2 rounded-xl transition-all flex items-center justify-center space-x-1"
                          >
                            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                            <span>Request revision</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <FileCheck2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-semibold">No pending weekly review sheets submitted currently.</p>
                </div>
              )}
            </div>

            {/* Approved logs summary list */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-705 uppercase tracking-wider block">Historical Reviewed Logs</span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {evaluatedLogbooks.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No approved weekly entries yet.</p>
                ) : (
                  evaluatedLogbooks.map(log => (
                    <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800">Week {log.weekNumber} Entries</span>
                        <p className="text-[9px] text-emerald-700 italic font-semibold truncate max-w-72">"Approved: {log.supervisorFeedback}"</p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100 font-bold">Approved</span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: Supervisor final Assessment / rubric scoring */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Supervisor Industrial Review</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Grade your matched intern on core criteria elements below to form overall evaluation score.</p>
              </div>

              {/* Rubric evaluation sliders */}
              <div className="space-y-4">
                
                {/* Tech score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Technical Capability & Deliveries</span>
                    <span className="font-mono text-indigo-600">{techGrade}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={techGrade}
                    onChange={(e) => setTechGrade(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-ew-resize h-1 bg-slate-100 rounded-lg appearance-none"
                  />
                  <p className="text-[10px] text-slate-400 leading-none bg-slate-50 p-1 rounded">Code output quality, architectural frameworks, documentation accuracy.</p>
                </div>

                {/* Punctuality score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Punctuality & Reliability</span>
                    <span className="font-mono text-indigo-600">{puncGrade}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={puncGrade}
                    onChange={(e) => setPuncGrade(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-ew-resize h-1 bg-slate-100 rounded-lg appearance-none"
                  />
                  <p className="text-[10px] text-slate-400 leading-none bg-slate-50 p-1 rounded">Meeting deadlines, active standup arrivals, prompt work cycles.</p>
                </div>

                {/* Communications score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Interpersonal Communication SKills</span>
                    <span className="font-mono text-indigo-600">{commGrade}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={commGrade}
                    onChange={(e) => setCommGrade(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-ew-resize h-1 bg-slate-100 rounded-lg appearance-none"
                  />
                  <p className="text-[10px] text-slate-400 leading-none bg-slate-50 p-1 rounded">PR review exchanges, design document collaborations, updates reporting.</p>
                </div>

                {/* Problem solving score */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Critical Problem Solving & Adaptability</span>
                    <span className="font-mono text-indigo-600">{problemGrade}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={problemGrade}
                    onChange={(e) => setProblemGrade(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-ew-resize h-1 bg-slate-100 rounded-lg appearance-none"
                  />
                  <p className="text-[10px] text-slate-400 leading-none bg-slate-50 p-1 rounded">Debugging code blocks independent testing, analytical loops.</p>
                </div>

                {/* Comments */}
                <div className="space-y-1 pt-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Summative General Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Provide detailed feedback on general areas for performance growth and overall score summaries..."
                    rows={2}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-350 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Compound average display */}
                <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Computed Average Score</span>
                      <h4 className="text-xs font-bold text-slate-200">Rubrics Completed</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-display font-black text-indigo-400">
                      {Math.round((techGrade + puncGrade + commGrade + problemGrade) / 4)}%
                    </span>
                  </div>
                </div>

                {/* Action trigger button */}
                <button
                  type="button"
                  onClick={handleSaveAssessment}
                  className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs p-3 rounded-xl w-full flex items-center justify-center space-x-2 transition-all shadow-md shadow-slate-900/10"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Assessment Rubrics Record</span>
                </button>

                {showEvaluationSuccess && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-800 border-emerald-150 border rounded-xl text-xs text-center font-semibold">
                    ✓ Industrial Rubric Evaluation saved and matched in database schemas!
                  </div>
                )}

              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
          <p className="text-xs text-slate-400 font-medium">Please match or join a student coordinator account to view industrial dashboard options.</p>
        </div>
      )}

    </div>
  );
}
