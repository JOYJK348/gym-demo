'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Dumbbell, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const TopHeader: React.FC = () => {
  const { currentUser, settings } = useApp();

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'OWNER';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Mobile Gym Brand */}
        <div className="flex items-center gap-2.5 md:hidden">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-slate-900 text-sm tracking-tight">
              {settings.gymName}
            </span>
          </div>
        </div>

        {/* Desktop Title Header / Search info */}
        <div className="hidden md:block">
          <p className="text-xs text-slate-500 font-medium">
            Welcome to <span className="font-bold text-slate-800">{settings.gymName}</span> Management System
          </p>
        </div>

        {/* Right side role info badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">
              {currentUser.role === 'OWNER' ? 'Owner Mode' : 'Staff Mode'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
