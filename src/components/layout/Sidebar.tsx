'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Home, 
  Users, 
  Dumbbell, 
  CreditCard, 
  CheckSquare, 
  HelpCircle, 
  MessageSquare, 
  Zap, 
  BarChart3, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout, settings } = useApp();

  if (!currentUser) return null;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home, roles: ['OWNER', 'STAFF'] },
    { label: 'Members', href: '/members', icon: Users, roles: ['OWNER', 'STAFF'] },
    { label: 'Memberships', href: '/memberships', icon: Dumbbell, roles: ['OWNER', 'STAFF'] },
    { label: 'Payments', href: '/payments', icon: CreditCard, roles: ['OWNER', 'STAFF'] },
    { label: 'Attendance', href: '/attendance', icon: CheckSquare, roles: ['OWNER', 'STAFF'] },
    { label: 'Enquiries / Leads', href: '/enquiries', icon: HelpCircle, roles: ['OWNER', 'STAFF'] },
    { label: 'WhatsApp', href: '/whatsapp', icon: MessageSquare, roles: ['OWNER', 'STAFF'] },
    { label: 'Automations', href: '/automations', icon: Zap, roles: ['OWNER'] },
    { label: 'Reports', href: '/reports', icon: BarChart3, roles: ['OWNER'] },
    { label: 'Settings', href: '/settings', icon: Settings, roles: ['OWNER'] },
  ];

  const filteredItems = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-500/20">
          <Dumbbell className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-extrabold text-slate-900 text-base leading-tight">
            {settings.gymName}
          </h2>
          <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">
            Gym Management
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-150',
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* User Info Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs border border-blue-200 shrink-0">
              {currentUser.name[0]}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser.role.toLowerCase()}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.push('/login');
            }}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
