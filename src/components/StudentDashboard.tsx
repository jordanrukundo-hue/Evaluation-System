/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Placement, WeeklyLogbook, DailyEntry, LogbookStatus } from '../types';
import { 
  BookmarkCheck, 
  Calendar, 
  Plus, 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Send, 
  Save, 
  Maximize2,
  ListCollapse,
  RefreshCcw,
  Activity
} from 'lucide-react';

interface StudentDashboardProps {
  placement: Placement | null;
  logbooks: WeeklyLogbook[];
  onSaveLogbook: (logbook: WeeklyLogbook) => void;
  onSubmitLogbook: (id: string) => void;
  onCreateNewWeek: () => void;
}

export default function StudentDashboard({
  placement,
  logbooks,
  onSaveLogbook,
  onSubmitLogbook,
  onCreateNewWeek
}: StudentDashboardProps) {
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(
    logbooks.length > 0 ? logbooks[logbooks.length - 1].id : null
  );
  const [isEditing, setIsEditing] = useState(false);

  // Buffer state to edit active logbook details
  const [editBuffer, setEditBuffer] = useState<WeeklyLogbook | null>(null);

  const selectedLogbook = logbooks.find(l => l.id === selectedWeekId) || null;

  const startEditing = () => {
    if (selectedLogbook) {
      setEditBuffer(JSON.parse(JSON.stringify(selectedLogbook))); // deep clone
      setIsEditing(true);
    }
  };

  const handleDayChange = (dayIndex: number, field: keyof DailyEntry, value: string | number) => {
    if (editBuffer) {
      const updatedEntries = [...editBuffer.dailyEntries];
      updatedEntries[dayIndex] = {
        ...updatedEntries[dayIndex],
        [field]: value
      };
      
      // Compute total hours in real time
      const totalHours = updatedEntries.reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
      
      setEditBuffer({
        ...editBuffer,
        dailyEntries: updatedEntries,
        totalHours
      });
    }
  };

  const saveEdits = () => {
    if (editBuffer) {
      onSaveLogbook(editBuffer);
      setIsEditing(false);
      setEditBuffer(null);
    }
  };

  const getStatusBadge = (status: LogbookStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Draft</span>;
      case 'SUBMITTED':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase animate-pulse">Awaiting Review</span>;
      case 'APPROVED':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-250 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Approved</span>;
      case 'REVISION_REQUESTED':
        return <span className="bg-amber-50 text-amber-700 border border-amber-250 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Revision Requested</span>;
      case 'REJECTED':
        return <span className="bg-rose-50 text-rose-700 border border-rose-220 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Rejected</span>;
    }
  };

  const totalCompletedHours = logbooks
    .filter(l => l.status === 'APPROVED')
    .reduce((sum, l) => sum + l.totalHours, 0);

  const pendingHours = logbooks
    .filter(l => l.status === 'SUBMITTED')
    .reduce((sum, l) => sum + l.totalHours, 0);

  return (
    <div className="space-y-6">
      
      {/* 2. PLACEMENT HEADING CARD */}
      {placement ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                <BookmarkCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  Verified Placement Details
                </span>
                <h2 className="text-xl font-display font-extrabold text-slate-900 mt-1">{placement.companyName}</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Role: <span className="text-slate-700 font-semibold">{placement.positionTitle}</span> • Joined {new Date(placement.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
            
            {/* Quick stats on hours */}
            <div className="flex gap-3 shrink-0">
              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Approved logs</span>
                <span className="text-lg font-display font-black text-slate-800">{totalCompletedHours}h</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-2xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">Completed Weeks</span>
                <span className="text-lg font-display font-black text-slate-800">
                  {logbooks.filter(l => l.status === 'APPROVED').length} wk
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center">
          <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
          <h3 className="font-bold text-slate-900">No Active Placement Schedulers Yet</h3>
          <p className="text-xs text-slate-600 mt-1">Please register or contact Eleanor Vance to match with an industry supervisor.</p>
        </div>
      )}

      {/* CORE: WEEKS SELECTION & GRID EDITOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Logbooks List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-755 uppercase tracking-wider block">Weekly Journals</span>
              <button
                onClick={onCreateNewWeek}
                className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center space-x-1 outline-none transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Initialize Week</span>
              </button>
            </div>

            <div className="space-y-2">
              {logbooks.map(log => (
                <button
                  key={log.id}
                  onClick={() => {
                    setSelectedWeekId(log.id);
                    setIsEditing(false);
                    setEditBuffer(null);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                    selectedWeekId === log.id 
                      ? 'bg-slate-50 border-indigo-500 shadow-sm' 
                      : 'bg-white border-slate-200/60 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-450" />
                      <span className="text-xs font-black text-slate-800">Week {log.weekNumber}</span>
                      {getStatusBadge(log.status)}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">{log.startDate} to {log.endDate}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono text-xs text-slate-500 font-semibold bg-slate-100 p-1.5 rounded-lg border border-slate-200">
                    <Clock className="h-3 w-3" />
                    <span>{log.totalHours}h</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Weekly Logbook Detail & Editor */}
        <div className="lg:col-span-8">
          {selectedLogbook ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-5">
              
              {/* Log Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-3">
                <div>
                  <div className="flex items-center space-x-2.5">
                    <h3 className="text-lg font-display font-extrabold text-slate-900">
                      Weekly Logbook Journal — Week {selectedLogbook.weekNumber}
                    </h3>
                    {getStatusBadge(selectedLogbook.status)}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Dates Scheduled: <span className="font-mono">{selectedLogbook.startDate}</span> to <span className="font-mono">{selectedLogbook.endDate}</span> • Total Hours Logged: <span className="font-semibold text-slate-800">{isEditing ? editBuffer?.totalHours : selectedLogbook.totalHours}h</span>
                  </p>
                </div>

                <div className="flex gap-2 self-start sm:self-auto shrink-0">
                  {!isEditing ? (
                    <>
                      {['DRAFT', 'REVISION_REQUESTED'].includes(selectedLogbook.status) && (
                        <button
                          onClick={startEditing}
                          className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center space-x-1 transition-all"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>Fill Log Details</span>
                        </button>
                      )}
                      {['DRAFT', 'REVISION_REQUESTED'].includes(selectedLogbook.status) && (
                        <button
                          onClick={() => {
                            onSubmitLogbook(selectedLogbook.id);
                          }}
                          className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center space-x-1 transition-all shadow-md shadow-indigo-500/10"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit to Supervisor</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        onClick={saveEdits}
                        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center space-x-1 transition-all shadow-md shadow-indigo-600/10"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditBuffer(null);
                        }}
                        className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3.5 py-1.5 rounded-xl flex items-center space-x-1 transition-all"
                      >
                        <RefreshCcw className="h-3.5 w-3.5" />
                        <span>Discard</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Revision remarks warning banner */}
              {selectedLogbook.status === 'REVISION_REQUESTED' && selectedLogbook.supervisorFeedback && (
                <div className="p-4 bg-amber-50 border border-amber-250 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-950">Active Revision Feedback from Sarah Jenkins:</h4>
                    <p className="text-amber-800 mt-1 italic font-medium">"{selectedLogbook.supervisorFeedback}"</p>
                    <p className="text-amber-500 text-[10px] font-bold uppercase mt-2">Action Required: Click "Fill Log Details" below, update descriptions, and click Save & Re-submit.</p>
                  </div>
                </div>
              )}

              {/* Supervisor Approval Success Banner */}
              {selectedLogbook.status === 'APPROVED' && selectedLogbook.supervisorFeedback && (
                <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-start space-x-3 text-xs leading-relaxed">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-950">Supervisor Approval Comments:</h4>
                    <p className="text-emerald-800 mt-1">"{selectedLogbook.supervisorFeedback}"</p>
                  </div>
                </div>
              )}

              {/* Dynamic overall weekly summaries block */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-slate-400">Weekly Executive Summary</span>
                {isEditing && editBuffer ? (
                  <textarea
                    value={editBuffer.weeklySummary}
                    onChange={(e) => setEditBuffer({ ...editBuffer, weeklySummary: e.target.value })}
                    rows={2}
                    className="w-full text-xs p-2 mt-1 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                    placeholder="Provide a high-level summary of your core focus, accomplishments, and skills built during this schedule."
                  />
                ) : (
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {selectedLogbook.weeklySummary || (
                      <span className="italic text-slate-400">No overall weekly summary compiled yet.</span>
                    )}
                  </p>
                )}
              </div>

              {/* Daily entries list */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Daily Activity breakdown</span>
                
                {(isEditing && editBuffer ? editBuffer.dailyEntries : selectedLogbook.dailyEntries).map((entry, index) => (
                  <div key={index} className="bg-white p-4 border border-slate-200 rounded-2xl shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-start relative hover:border-slate-300 transition-all">
                    
                    {/* Day Column */}
                    <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start">
                      <div>
                        <span className="text-xs font-black text-slate-900">{entry.day}</span>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{entry.date}</p>
                      </div>
                      <div className="flex items-center space-x-1 mt-2">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="24"
                            value={entry.hours}
                            onChange={(e) => handleDayChange(index, 'hours', Number(e.target.value))}
                            className="text-xs w-12 text-center p-1 bg-slate-50 border border-slate-200 rounded focus:outline-none font-bold"
                          />
                        ) : (
                          <span className="text-xs font-mono font-bold text-slate-600">{entry.hours}h</span>
                        )}
                        <span className="text-[10px] text-slate-400">logged</span>
                      </div>
                    </div>

                    {/* Task details Column */}
                    <div className="md:col-span-9 space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Tasks Done & Achievements</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={entry.taskDescription}
                            onChange={(e) => handleDayChange(index, 'taskDescription', e.target.value)}
                            className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                            placeholder="Explain technical tasks, files coded, etc."
                          />
                        ) : (
                          <p className="text-slate-750 font-medium">{entry.taskDescription}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Challenges Overcome</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={entry.challenges}
                              onChange={(e) => handleDayChange(index, 'challenges', e.target.value)}
                              className="w-full text-[11px] p-1 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                              placeholder="e.g. key expired issues"
                            />
                          ) : (
                            <p className="text-slate-500 italic max-w-sm">{entry.challenges}</p>
                          )}
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Industrial Learning Node</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={entry.learning}
                              onChange={(e) => handleDayChange(index, 'learning', e.target.value)}
                              className="w-full text-[11px] p-1 bg-slate-50 border border-slate-200 rounded-md focus:outline-none"
                              placeholder="e.g. how indexing speeds query search"
                            />
                          ) : (
                            <p className="text-slate-600 font-medium text-slate-700">{entry.learning}</p>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-xs">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800">No Weekly Sheets Generated</h3>
              <p className="text-xs text-slate-500 mt-1">Please initialize a weekly logs workbook to begin recording daily records.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
