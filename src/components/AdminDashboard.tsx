/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile, Placement } from '../types';
import { 
  ShieldCheck, 
  Settings, 
  Database, 
  UserPlus, 
  Code2, 
  RefreshCw,
  FolderSync,
  UserCheck
} from 'lucide-react';

interface AdminDashboardProps {
  users: UserProfile[];
  placements: Placement[];
  onAddNewUser: (user: UserProfile) => void;
  onUpdatePlacement: (placement: Placement) => void;
  onClearDb: () => void;
}

export default function AdminDashboard({
  users,
  placements,
  onAddNewUser,
  onUpdatePlacement,
  onClearDb
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'placements' | 'database'>('users');

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'STUDENT' | 'SUPERVISOR' | 'ACADEMIC_LIAISON'>('STUDENT');
  const [formSuccess, setFormSuccess] = useState(false);

  // Schema state viewer
  const [selectedSchemaTable, setSelectedSchemaTable] = useState<'users' | 'placements' | 'logbooks'>('users');
  const [schemaPayload, setSchemaPayload] = useState('');

  React.useEffect(() => {
    // Read raw localStorage records dynamically to display on the explorer screen
    const rawData = localStorage.getItem('iles_' + selectedSchemaTable) || '[]';
    try {
      setSchemaPayload(JSON.stringify(JSON.parse(rawData), null, 2));
    } catch {
      setSchemaPayload(rawData);
    }
  }, [selectedSchemaTable, users, placements]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName && newUserEmail) {
      onAddNewUser({
        id: 'user_' + Math.random().toString(36).substring(3, 9),
        name: newUserName,
        email: newUserEmail,
        role: newUserRole as any,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces',
        department: 'Engineering Coordinator'
      });
      setNewUserName('');
      setNewUserEmail('');
      setFormSuccess(true);
      setTimeout(() => setFormSuccess(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper sub-selector tabs */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-[10px] text-emerald-600 font-mono uppercase font-black tracking-wider block">Admin Management Section</span>
          <h2 className="text-lg font-display font-extrabold text-slate-900 mt-1">Global System Configurations</h2>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            User Matrix
          </button>
          <button
            onClick={() => setActiveSubTab('placements')}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'placements' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Placement Schedules
          </button>
          <button
            onClick={() => setActiveSubTab('database')}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'database' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Raw schema explorer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sub-Tab 1: Users Matrix */}
        {activeSubTab === 'users' && (
          <>
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-705 uppercase tracking-wider block">Create New System Account</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Appends custom user credentials into the environment login sandbox matrix.</p>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3 text-xs text-slate-655">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Full User Name</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 bg-white font-medium"
                    placeholder="e.g. Dr. Arthur Pendelton"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Email Coordinates</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 bg-white font-medium"
                    placeholder="e.g. pendelton@university.edu"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Enrollment System Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-600 bg-slate-50 font-semibold"
                  >
                    <option value="STUDENT">Student Intern</option>
                    <option value="SUPERVISOR">Industrial Supervisor</option>
                    <option value="ACADEMIC_LIAISON">Academic Liaison / Advisor</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="cursor-pointer bg-slate-900 border border-slate-950 text-white font-bold p-3 rounded-xl w-full text-center flex items-center justify-center space-x-1.5 transition-all"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register System User</span>
                </button>

                {formSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-center font-bold">
                    ✓ New credentials added to Sandbox Matrix on-the-fly!
                  </div>
                )}
              </form>
            </div>

            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-705 uppercase tracking-wider block">Registered Sandbox Users Accounts</span>
              
              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
                {users.map(user => (
                  <div key={user.id} className="py-3 flex items-center justify-between text-xs hover:bg-slate-50 p-2.5 rounded-2xl transition-colors">
                    <div className="flex items-center space-x-3">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-extrabold text-slate-900">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <span className="p-1 px-2.5 bg-slate-100 border border-slate-200 rounded-full font-bold text-[9px] uppercase tracking-wider text-slate-600 font-mono">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Sub-Tab 2: Placements */}
        {activeSubTab === 'placements' && (
          <div className="lg:col-span-12 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-705 uppercase tracking-wider block">Ongoing Placement Coordinates</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {placements.map(placement => (
                <div key={placement.id} className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 hover:border-slate-300 transition-all text-xs">
                  <div className="flex justify-between items-start border-b border-slate-200/50 pb-2">
                    <div>
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[8px] font-bold">ACTIVE</span>
                      <h4 className="font-black text-slate-800 mt-1">{placement.studentName}</h4>
                      <p className="text-[10px] text-slate-450">ID: {placement.studentId}</p>
                    </div>
                    <span className="font-mono text-[9px] bg-slate-150 border border-slate-200 p-1 rounded">
                      {placement.departmentCode} DEPT
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-650 font-medium">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Position Title:</span>
                      <span className="text-slate-800 font-bold">{placement.positionTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Company Name:</span>
                      <span className="text-slate-800 font-bold">{placement.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Industry Supervisor:</span>
                      <span className="text-slate-800 font-bold">{placement.supervisorName} ({placement.supervisorEmail})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Schedules:</span>
                      <span className="text-slate-800 font-semibold">{placement.startDate} to {placement.endDate}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-Tab 3: Schema Inspector */}
        {activeSubTab === 'database' && (
          <div className="lg:col-span-12 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-3">
              <div>
                <h3 className="text-xs font-bold text-slate-705 uppercase tracking-wider block">Raw Web Database Sandbox Explorer</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Examine the direct schema arrays stored inside local storage keys mapping to our database entities.</p>
              </div>
              
              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto text-xs font-bold">
                {['users', 'placements', 'logbooks'].map(tbl => (
                  <button
                    key={tbl}
                    onClick={() => setSelectedSchemaTable(tbl as any)}
                    className={`cursor-pointer px-3 py-1 rounded-lg capitalize transition-all ${
                      selectedSchemaTable === tbl 
                        ? 'bg-slate-900 text-white' 
                        : 'text-slate-500 hover:text-slate-850'
                    }`}
                  >
                    iles_{tbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <pre className="bg-slate-950 text-emerald-400 p-4 rounded-2xl text-[10px] font-mono h-80 overflow-y-auto border border-slate-850 shadow-xl leading-relaxed whitespace-pre-wrap pr-1">
                {schemaPayload}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-[10px] text-slate-400 italic">Connected to active browser local storage scopes.</span>
              <button
                type="button"
                onClick={onClearDb}
                className="cursor-pointer font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1.5 px-3 rounded-xl transition-all border border-rose-100"
              >
                Reset Database to Factory Seeds
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
