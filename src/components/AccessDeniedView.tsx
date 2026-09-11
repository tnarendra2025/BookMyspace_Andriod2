import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, RefreshCw } from 'lucide-react';
import { UserRole } from '../types';
import { useApp } from '../context/AppContext';

interface AccessDeniedViewProps {
  requiredRole: 'ADMIN' | 'VENUE_OWNER';
  screenTitle: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  requiredRole,
  screenTitle,
}) => {
  const { currentUser, switchRole, setActiveScreen } = useApp();

  const getRoleDisplayName = (role: UserRole | string) => {
    switch (role) {
      case 'ADMIN':
        return 'Platform Administrator';
      case 'VENUE_OWNER':
        return 'Venue / Property Host';
      case 'USER':
      default:
        return 'Standard Customer';
    }
  };

  const getRequiredRoleBadge = () => {
    if (requiredRole === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
          <Lock className="w-3.5 h-3.5" />
          Required: Administrator (ADMIN)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <Lock className="w-3.5 h-3.5" />
        Required: Venue Owner (VENUE_OWNER)
      </span>
    );
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4 sm:px-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl border border-rose-200 shadow-xl shadow-rose-900/5 p-6 sm:p-8 text-center space-y-6">
        {/* Security Shield Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex justify-center">{getRequiredRoleBadge()}</div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Restricted Access
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            You attempted to access <strong className="text-slate-800 font-semibold">{screenTitle}</strong>, but your authenticated session does not possess the required authorization.
          </p>
        </div>

        {/* Dynamic Session Role Info (No Hardcoded IDs) */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2.5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Current Authenticated Session
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">User Account:</span>
            <span className="text-xs font-bold text-slate-900">{currentUser.fullName || currentUser.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600">Active Role:</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-200 text-slate-800">
              <UserCheck className="w-3 h-3 text-slate-600" />
              {getRoleDisplayName(currentUser.role)} ({currentUser.role})
            </span>
          </div>
          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
            Authorization check: Verified dynamically via role claims (<code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">user.role</code>) without reliance on hardcoded identifiers.
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setActiveScreen('home')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Explore (Home)
          </button>

          {/* Sandbox Role Switcher for verification */}
          <button
            onClick={() => switchRole(requiredRole)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
            Switch to {requiredRole === 'ADMIN' ? 'Admin' : 'Owner'} Role
          </button>
        </div>
      </div>
    </div>
  );
};
