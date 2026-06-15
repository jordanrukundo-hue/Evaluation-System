/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserProfile, SystemNotification } from '../types';
import { 
  Briefcase, 
  User, 
  Bell, 
  LogOut, 
  CheckCircle, 
  RefreshCw, 
  CheckCheck,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  onUserChange: (user: UserProfile) => void;
  notifications: SystemNotification[];
  onMarkAllRead: () => void;
  onClearNotifications?: () => void;
}

export default function Header({
  currentUser,
  availableUsers,
  onUserChange,
  notifications,
  onMarkAllRead
}: HeaderProps) {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.STUDENT:
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case UserRole.SUPERVISOR:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case UserRole.ACADEMIC_LIAISON:
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case UserRole.ADMIN:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 backdrop-blur-md bg-white/95 shadow-xs px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Branding & Course Code */}
        <div id="iles-branding" className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md shadow-indigo-600/10 flex items-center justify-center">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-slate-900 tracking-tight text-lg">ILES</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-slate-150 border border-slate-200 rounded font-mono font-medium text-slate-500">CSC 1202</span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Internship Logging & Evaluation System</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Active Testing Role Indicator */}
          <div className="hidden md:flex items-center bg-slate-50 border border-slate-100 px-3 py-1 rounded-full text-xs space-x-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 pulse-subtle"></span>
            <span className="text-slate-500">Testing Sandbox Mode</span>
          </div>

          {/* Role Switching Selector - CRITICAL for simple evaluation */}
          <div className="relative">
            <button
              id="role-picker-btn"
              onClick={() => {
                setShowRoleSelector(!showRoleSelector);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl transition-all cursor-pointer border border-slate-200/50"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-2 ring-indigo-500/15" 
                referrerPolicy="no-referrer"
              />
              <div className="text-left hidden xs:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 capitalize leading-none font-medium">Role: {currentUser.role.toLowerCase().replace('_', ' ')}</p>
              </div>
              <RefreshCw className="h-3 w-3 text-slate-400 animate-spin-slow ml-1" />
            </button>

            {showRoleSelector && (
              <div id="role-selector-menu" className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 transform origin-top-right transition-all">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Change Simulated User</span>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">Switch users to inspect student weekly lists, supervisor approvals, and liaison score compositions.</p>
                </div>
                <div className="max-h-80 overflow-y-auto py-1 space-y-1">
                  {availableUsers.map(user => (
                    <button
                      key={user.id}
                      onClick={() => {
                        onUserChange(user);
                        setShowRoleSelector(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all text-left cursor-pointer ${
                        currentUser.id === user.id 
                          ? 'bg-indigo-50 text-indigo-900 border-indigo-100 border' 
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md border ${getRoleBadgeColor(user.role)}`}>
                            {user.role.replace('_', ' ')}
                          </span>
                          {user.studentId && (
                            <span className="text-[9px] font-mono text-slate-400 font-semibold">{user.studentId}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              id="notifications-bell"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleSelector(false);
              }}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all relative cursor-pointer border border-slate-100"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4.5 w-4.5 bg-rose-500 text-[10px] font-extrabold text-white rounded-full flex items-center justify-center ring-2 ring-white animate-bounce-short">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div id="notifications-dropdown" className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 transform origin-top-right transition-all">
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Activity Log</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => onMarkAllRead()}
                      className="text-[10px] text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer flex items-center space-x-1"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>Mark read</span>
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto py-1 divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-xs text-slate-400 font-medium">No recent actions</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 text-left transition-colors flex space-x-2.5 ${!notif.read ? 'bg-slate-50/70 font-medium' : ''}`}
                      >
                        <div className="pt-0.5">
                          {notif.category === 'logbook' ? (
                            <span className="h-2 w-2 rounded-full bg-blue-500 inline-block"></span>
                          ) : notif.category === 'evaluation' ? (
                            <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span>
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-indigo-500 inline-block"></span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs leading-tight text-slate-800 font-bold">{notif.title}</p>
                          <p className="text-[11px] leading-relaxed text-slate-500 mt-0.5">{notif.message}</p>
                          <p className="text-[9px] font-mono text-slate-400 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
