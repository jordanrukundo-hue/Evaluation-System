/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Placement, 
  WeeklyLogbook, 
  AcademicEvaluation, 
  SupervisorEvaluation, 
  ScoreWeights 
} from '../types';
import { 
  Sliders, 
  GraduationCap, 
  Edit, 
  Save, 
  BarChart, 
  FileCheck, 
  Percent, 
  BookOpen, 
  Calendar,
  Layers,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface AcademicAdvisorDashboardProps {
  students: Placement[];
  logbooks: WeeklyLogbook[];
  academicEvaluations: AcademicEvaluation[];
  supervisorEvaluations: SupervisorEvaluation[];
  scoreWeights: ScoreWeights;
  onSaveAcademicEvaluation: (evaluation: AcademicEvaluation) => void;
  onSaveWeights: (weights: ScoreWeights) => void;
  advisorName: string;
}

export default function AcademicAdvisorDashboard({
  students,
  logbooks,
  academicEvaluations,
  supervisorEvaluations,
  scoreWeights,
  onSaveAcademicEvaluation,
  onSaveWeights,
  advisorName
}: AcademicAdvisorDashboardProps) {
  
  // Weights adjustment details
  const [logsWeight, setLogsWeight] = useState(scoreWeights.weeklyLogsWeight);
  const [supWeight, setSupWeight] = useState(scoreWeights.supervisorEvalWeight);
  const [acadWeight, setAcadWeight] = useState(scoreWeights.academicLiaisonWeight);
  const [weightsSuccess, setWeightsSuccess] = useState(false);

  // Selected student for grade detailed view
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    students.length > 0 ? students[0].studentId : null
  );

  const activeStudent = students.find(s => s.studentId === selectedStudentId) || null;

  // Evaluation form elements
  const currentEval = academicEvaluations.find(e => e.studentId === selectedStudentId);
  const [siteVisit, setSiteVisit] = useState(currentEval?.siteVisitScore || 85);
  const [midterm, setMidterm] = useState(currentEval?.midtermPresentationScore || 85);
  const [finalReport, setFinalReport] = useState(currentEval?.finalReportScore || 85);
  const [advisorComments, setAdvisorComments] = useState(currentEval?.generalComments || '');
  const [evalSuccess, setEvalSuccess] = useState(false);

  // Update form inputs if student changes
  React.useEffect(() => {
    if (selectedStudentId) {
      const activeEval = academicEvaluations.find(e => e.studentId === selectedStudentId);
      setSiteVisit(activeEval?.siteVisitScore || 85);
      setMidterm(activeEval?.midtermPresentationScore || 85);
      setFinalReport(activeEval?.finalReportScore || 85);
      setAdvisorComments(activeEval?.generalComments || '');
      setEvalSuccess(false);
    }
  }, [selectedStudentId, academicEvaluations]);

  // Sync sliders with parents configuration
  React.useEffect(() => {
    setLogsWeight(scoreWeights.weeklyLogsWeight);
    setSupWeight(scoreWeights.supervisorEvalWeight);
    setAcadWeight(scoreWeights.academicLiaisonWeight);
  }, [scoreWeights]);

  // Enforce sliders to sum up to exactly 100 on updates
  const handleWeightsChange = (category: 'logs' | 'sup' | 'acad', value: number) => {
    if (category === 'logs') {
      const remaining = 100 - value;
      // split split ratio to other two category sums
      const currentSum = supWeight + acadWeight || 1;
      const ratioSup = supWeight / currentSum;
      const updatedSup = Math.round(remaining * ratioSup);
      const updatedAcad = remaining - updatedSup;

      setLogsWeight(value);
      setSupWeight(updatedSup);
      setAcadWeight(updatedAcad);
    } else if (category === 'sup') {
      const remaining = 100 - value;
      const currentSum = logsWeight + acadWeight || 1;
      const ratioLogs = logsWeight / currentSum;
      const updatedLogs = Math.round(remaining * ratioLogs);
      const updatedAcad = remaining - updatedLogs;

      setSupWeight(value);
      setLogsWeight(updatedLogs);
      setAcadWeight(updatedAcad);
    } else {
      const remaining = 100 - value;
      const currentSum = logsWeight + supWeight || 1;
      const ratioLogs = logsWeight / currentSum;
      const updatedLogs = Math.round(remaining * ratioLogs);
      const updatedSup = remaining - updatedLogs;

      setAcadWeight(value);
      setLogsWeight(updatedLogs);
      setSupWeight(updatedSup);
    }
  };

  const saveWeightsConfig = () => {
    onSaveWeights({
      weeklyLogCount: 10,
      weeklyLogsWeight: logsWeight,
      supervisorEvalWeight: supWeight,
      academicLiaisonWeight: acadWeight
    });
    setWeightsSuccess(true);
    setTimeout(() => setWeightsSuccess(false), 2000);
  };

  const saveEvaluationGrade = () => {
    if (activeStudent) {
      onSaveAcademicEvaluation({
        id: currentEval?.id || 'acad_' + Math.random().toString(36).substring(3, 9),
        studentId: selectedStudentId!,
        placementId: activeStudent.id,
        siteVisitScore: siteVisit,
        midtermPresentationScore: midterm,
        finalReportScore: finalReport,
        generalComments: advisorComments || 'Logbooks compiled exceptionally, showing active student participation.',
        gradedAt: new Date().toISOString(),
        gradedBy: advisorName
      });
      setEvalSuccess(true);
      setTimeout(() => setEvalSuccess(false), 2500);
    }
  };

  // 100 Marks Weighted Computation Logic
  const calculateOverallWeightedScore = (studentId: string) => {
    const studentLogs = logbooks.filter(l => l.studentId === studentId);
    
    // 1. Logbooks status and completeness mapping
    // Full points map if they got 10 logs approved. Or compute ratio of approved hours
    const totalApproved = studentLogs.filter(l => l.status === 'APPROVED').length;
    const completenessFactor = Math.min((totalApproved / 4) * 100, 100); // map out of 100 basis
    const weightedLogs = completenessFactor * (logsWeight / 100);

    // 2. Supervisor average mapping
    const supEval = supervisorEvaluations.find(e => e.studentId === studentId);
    const averageSupScore = supEval?.overallPerformance || 85; // fallbacks to 85
    const weightedSup = averageSupScore * (supWeight / 100);

    // 3. Academic average mapping
    const acadEval = academicEvaluations.find(e => e.studentId === studentId);
    const averageAcadScore = acadEval 
      ? Math.round((acadEval.siteVisitScore + acadEval.midtermPresentationScore + acadEval.finalReportScore) / 3) 
      : 80;
    const weightedAcad = averageAcadScore * (acadWeight / 100);

    const overallTotal = Math.round(weightedLogs + weightedSup + weightedAcad);
    
    // Letter grade and equivalence mapping and GPA representation
    let letter = 'F';
    let gpa = '0.00';
    let color = 'text-rose-600 bg-rose-50 border-rose-100';
    if (overallTotal >= 90) {
      letter = 'A';
      gpa = '4.00';
      color = 'text-emerald-700 bg-emerald-50 border-emerald-100';
    } else if (overallTotal >= 80) {
      letter = 'B';
      gpa = '3.00';
      color = 'text-blue-700 bg-blue-50 border-blue-100';
    } else if (overallTotal >= 70) {
      letter = 'C';
      gpa = '2.00';
      color = 'text-amber-700 bg-amber-50 border-amber-100';
    } else if (overallTotal >= 50) {
      letter = 'D';
      gpa = '1.00';
      color = 'text-orange-700 bg-orange-50 border-orange-100';
    }

    return { 
      overallTotal, 
      completeness: Math.round(completenessFactor), 
      supScore: averageSupScore, 
      acadScore: averageAcadScore,
      letter,
      gpa,
      color
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Analytics Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Total Tracked Interns</span>
            <span className="text-2xl font-display font-black text-slate-900 mt-1">{students.length} Students</span>
            <p className="text-[10px] text-slate-450 mt-1">Computer Science & Engineering Group</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Total Logbook Books</span>
            <span className="text-2xl font-display font-black text-slate-900 mt-1">
              {logbooks.length} Journals
            </span>
            <p className="text-[10px] text-slate-450 mt-1">
              {logbooks.filter(l => l.status === 'APPROVED').length} Approved • {logbooks.filter(l => l.status === 'SUBMITTED').length} Pending
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Grade Computations Status</span>
            <span className="text-2xl font-display font-black text-indigo-600 mt-1">Active Rules</span>
            <p className="text-[10px] text-slate-450 mt-1">Weights Sum Enforced Enrolment</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
            <Percent className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT: Weighted Core Configurations and Student scores sheets */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Dynamic weights adjusting sliders */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-sidebar pb-3">
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Weight Configurations (6. Weighted Score Computation)</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Define weights for the three curriculum logging matrices. Must sum to exactly 100%.</p>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 p-1 px-2.5 rounded border border-indigo-100">
                Sum: {logsWeight + supWeight + acadWeight}%
              </span>
            </div>

            <div className="space-y-4 pt-1">
              
              {/* Daily Logbook completeness Weight */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Weekly Logbook completeness Tracker Weight:</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 rounded">{logsWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={logsWeight}
                  onChange={(e) => handleWeightsChange('logs', Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-slate-100 appearance-none rounded"
                />
              </div>

              {/* Industrial Supervisor Evaluation Weight */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Industry Supervisor Evaluation Assessment weight:</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 rounded">{supWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={supWeight}
                  onChange={(e) => handleWeightsChange('sup', Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-slate-100 appearance-none rounded"
                />
              </div>

              {/* Liaison evaluation Weights */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Academic Liaison Evaluation Scoring Weight:</span>
                  <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 rounded">{acadWeight}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={acadWeight}
                  onChange={(e) => handleWeightsChange('acad', Number(e.target.value))}
                  className="w-full accent-indigo-600 h-1 bg-slate-100 appearance-none rounded"
                />
              </div>

              {/* Save triggers */}
              <button
                type="button"
                onClick={saveWeightsConfig}
                className="cursor-pointer text-xs font-bold bg-slate-900 border border-slate-950 text-white rounded-xl py-2 px-4 w-full flex items-center justify-center space-x-1 hover:bg-slate-800"
              >
                <Save className="h-4 w-4" />
                <span>Save and Compound Weights System Configuration</span>
              </button>

              {weightsSuccess && (
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl text-center font-bold text-xs">
                  ✓ Weights configured successfully! Score computations refreshed.
                </div>
              )}
            </div>
          </div>

          {/* Student Class Record grid */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-705 uppercase tracking-wider block">Class Internship Evaluation Logbooks Matrix</span>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 pb-2 text-slate-400 font-mono text-[10px]">
                    <th className="py-2">Student Name</th>
                    <th>Log Completeness</th>
                    <th>Supervisor. Avg</th>
                    <th>Liaison. Avg</th>
                    <th>Weighted Mark</th>
                    <th>Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(std => {
                    const metrics = calculateOverallWeightedScore(std.studentId);
                    return (
                      <tr 
                        key={std.studentId} 
                        className={`hover:bg-slate-50 transition-colors ${selectedStudentId === std.studentId ? 'bg-slate-50' : ''}`}
                      >
                        <td className="py-3 font-bold text-slate-800">
                          <div>
                            <p>{std.studentName}</p>
                            <span className="text-[10px] text-slate-400 font-normal font-sans block">{std.companyName}</span>
                          </div>
                        </td>
                        <td className="font-mono font-semibold">{metrics.completeness}%</td>
                        <td className="font-mono font-semibold">{metrics.supScore}%</td>
                        <td className="font-mono font-semibold">{metrics.acadScore}%</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] border font-black font-mono inline-block ${metrics.color}`}>
                            {metrics.overallTotal}% ({metrics.letter})
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedStudentId(std.studentId)}
                            className="cursor-pointer text-[10px] text-indigo-600 font-bold bg-indigo-50 p-1 px-2.5 rounded hover:bg-indigo-100 transition-all"
                          >
                            Examine
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COMPONENT: Detailed student evaluation parameters */}
        <div className="lg:col-span-5">
          {activeStudent ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  (5. Academic Evaluation Module)
                </span>
                <h3 className="text-sm font-black text-slate-900 mt-1">Liaison Evaluation: {activeStudent.studentName}</h3>
                <p className="text-[10px] text-slate-400 leading-tight">Match individual site vising records to complete academic assessments.</p>
              </div>

              <div className="space-y-4">
                
                {/* Site Visit Grade input */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Liaison Site Visit Marks</span>
                    <span className="font-mono text-indigo-600">{siteVisit}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={siteVisit}
                    onChange={(e) => setSiteVisit(Number(e.target.value))}
                    className="w-full h-1 accent-indigo-600 bg-slate-100 appearance-none rounded"
                  />
                  <p className="text-[10px] text-slate-400 font-medium leading-none">Supervisor interview on-site, compliance with company protocols.</p>
                </div>

                {/* Midterm Grade input */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Midterm Presentation & Slides</span>
                    <span className="font-mono text-indigo-600">{midterm}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={midterm}
                    onChange={(e) => setMidterm(Number(e.target.value))}
                    className="w-full h-1 accent-indigo-600 bg-slate-100 appearance-none rounded"
                  />
                  <p className="text-[10px] text-slate-400 font-medium leading-none">Oral delivery clarity, design architectures overview explanation.</p>
                </div>

                {/* Final report grade input */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>Written Final Report Write-up</span>
                    <span className="font-mono text-indigo-600">{finalReport}/100</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    value={finalReport}
                    onChange={(e) => setFinalReport(Number(e.target.value))}
                    className="w-full h-1 accent-indigo-600 bg-slate-100 appearance-none rounded"
                  />
                  <p className="text-[10px] text-slate-400 font-medium leading-none">Reflective summaries, technical diagram accuracy, git log screenshots attachments.</p>
                </div>

                {/* Executive liaison remarks */}
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Summative Liaison Remarks</label>
                  <textarea
                    value={advisorComments}
                    onChange={(e) => setAdvisorComments(e.target.value)}
                    placeholder="Type advisor general remarks on academic outcomes and portfolio contents..."
                    rows={2}
                    className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                  />
                </div>

                {/* Compound average display */}
                {(() => {
                  const data = calculateOverallWeightedScore(selectedStudentId!);
                  return (
                    <div className="bg-slate-900 border border-slate-950 p-4 rounded-2xl text-white space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Compounded Coursework Mark</span>
                          <p className="text-xs font-semibold text-slate-200">Enforcing weight rules matrix</p>
                        </div>
                        <span className="text-2xl font-display font-black text-indigo-400">
                          {data.overallTotal}%
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono border-t border-slate-800 pt-2 text-slate-440">
                        <div>Letter Grade: <span className="text-indigo-400 font-bold">{data.letter}</span></div>
                        <div>GPA Equivalency: <span className="text-indigo-400 font-bold">{data.gpa}</span></div>
                      </div>
                    </div>
                  );
                })()}

                {/* Save trigger button */}
                <button
                  type="button"
                  onClick={saveEvaluationGrade}
                  className="cursor-pointer text-xs font-bold bg-slate-900 text-white p-3 rounded-xl w-full flex items-center justify-center space-x-2 hover:bg-slate-805 transition-all shadow-md shadow-slate-900/10"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Academic Evaluation Grades</span>
                </button>

                {evalSuccess && (
                  <div className="p-3.5 bg-indigo-50 text-indigo-800 border-indigo-150 border rounded-xl text-xs text-center font-bold">
                    ✓ Academic Marks updated and compounds refreshed successfully!
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center">
              <p className="text-xs text-slate-400 font-medium">Please select a student from the logs table to initiate evaluation forms.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
