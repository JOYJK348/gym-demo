'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Home, 
  Users, 
  MessageSquare, 
  Grid, 
  CreditCard, 
  CheckSquare, 
  HelpCircle, 
  Zap, 
  BarChart3, 
  Settings, 
  LogOut,
  Dumbbell
} from 'lucide-react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

export const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, settings } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'OWNER';

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Members', href: '/members', icon: Users },
    { label: 'WhatsApp', href: '/whatsapp', icon: MessageSquare },
  ];

  const moreItems = [
    { label: 'Memberships', href: '/memberships', icon: Dumbbell, roles: ['OWNER', 'STAFF'] },
    { label: 'Payments', href: '/payments', icon: CreditCard, roles: ['OWNER', 'STAFF'] },
    { label: 'Attendance', href: '/attendance', icon: CheckSquare, roles: ['OWNER', 'STAFF'] },
    { label: 'Enquiries / Leads', href: '/enquiries', icon: HelpCircle, roles: ['OWNER', 'STAFF'] },
    { label: 'Automations', href: '/automations', icon: Zap, roles: ['OWNER'] },
    { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['OWNER'] },
    { label: 'Settings', href: '/settings', icon: Settings, roles: ['OWNER'] },
  ];

  const filteredMore = moreItems.filter((item) => item.roles.includes(currentUser.role));

  const isMoreActive = filteredMore.some((item) => pathname.startsWith(item.href));

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 md:hidden px-3 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95',
                  isActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5px]')} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsMoreOpen(true)}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-150 cursor-pointer active:scale-95',
              isMoreActive ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            )}
          >
            <Grid className={cn('w-5 h-5', isMoreActive && 'stroke-[2.5px]')} />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* "More" Bottom Sheet Modal */}
      <BottomSheet isOpen={isMoreOpen} onClose={() => setIsMoreOpen(false)} title="Menu & Navigation">
        <div className="space-y-4 pb-4">
          {/* User Info header */}
          <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {currentUser.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-xs text-slate-500">{currentUser.email}</p>
              </div>
            </div>
            <Badge variant={isOwner ? 'blue' : 'neutral'}>
              {currentUser.role}
            </Badge>
          </div>

          {/* Nav Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {filteredMore.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    setIsMoreOpen(false);
                    router.push(item.href);
                  }}
                  className={cn(
                    'flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-150 active:scale-98 cursor-pointer',
                    isActive
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-2xs'
                      : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100 text-slate-700 font-medium'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-xl shrink-0',
                    isActive ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 shadow-2xs'
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Logout button */}
          <div className="pt-2">
            <button
              onClick={() => {
                setIsMoreOpen(false);
                logout();
                router.push('/login');
              }}
              className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </BottomSheet>
    </>
  );
};
