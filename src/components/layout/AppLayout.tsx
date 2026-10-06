'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { BottomNavigation } from './BottomNavigation';
import { Toast } from '@/components/ui/Toast';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser } = useApp();

  const isLoginPage = pathname === '/login';

  // Auth guard
  useEffect(() => {
    if (!currentUser && !isLoginPage) {
      router.push('/login');
    }
  }, [currentUser, isLoginPage, router]);

  if (isLoginPage) {
    return (
      <main className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Toast />
        {children}
      </main>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Staff Restriction Check
  const restrictedForStaff = ['/automations', '/reports', '/settings'];
  const isRestricted = currentUser.role === 'STAFF' && restrictedForStaff.some((r) => pathname.startsWith(r));

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Toast />
      
      {/* Desktop Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {isRestricted ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-rose-100 rounded-3xl text-center space-y-4 my-8 shadow-xs">
              <div className="p-4 rounded-full bg-rose-50 text-rose-600">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  This section is available to Gym Owners/Admins only. Staff accounts do not have permission to view or modify this module.
                </p>
              </div>
              <Button
                variant="primary"
                icon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          ) : (
            children
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
};
