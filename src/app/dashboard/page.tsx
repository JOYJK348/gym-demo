'use client';

import React, { useState } from 'react';
import useRouter from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Users, 
  UserPlus, 
  CheckSquare, 
  IndianRupee, 
  Clock, 
  AlertCircle, 
  Plus, 
  MessageSquare, 
  CreditCard, 
  ArrowRight, 
  ChevronRight,
  Send,
  Zap,
  HelpCircle
} from 'lucide-react';
import { StatCard, Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';

export default function DashboardPage() {
  const { currentUser, members, payments, enquiries, activities, settings } = useApp();

  if (!currentUser) return null;

  const isOwner = currentUser.role === 'OWNER';

  // Compute live metrics from store
  const activeMembersCount = members.filter((m) => m.currentMembership?.status === 'Active' || m.currentMembership?.status === 'Expiring Soon').length;
  const expiringMembers = members.filter((m) => m.currentMembership?.status === 'Expiring Soon');
  const pendingPaymentsList = payments.filter((p) => p.status === 'Pending');
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New' || e.status === 'Trial').length;

  const todayCollection = payments
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl text-white shadow-lg shadow-blue-500/20">
        <div>
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold tracking-wide uppercase mb-1">
            {settings.gymName}
          </span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Good Morning, {isOwner ? 'Admin 👋' : `${currentUser.name} 👋`}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            {isOwner
              ? "Here is what's happening at your gym today."
              : 'Focus on today’s member renewals, attendance and enquiries.'}
          </p>
        </div>
        
        {/* Quick Add Button */}
        <Link href="/members/new">
          <Button
            variant="secondary"
            size="md"
            icon={<UserPlus className="w-4 h-4" />}
            className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 shadow-sm font-bold"
          >
            Add New Member
          </Button>
        </Link>
      </div>

      {/* Overview Metrics Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Today's Overview
        </h2>
        
        {isOwner ? (
          /* OWNER metrics grid */
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <StatCard
              title="Active Members"
              value={activeMembersCount}
              subtext="Total registered"
              icon={<Users className="w-5 h-5" />}
              iconBg="bg-blue-50 text-blue-600"
            />
            <StatCard
              title="New Members"
              value={7}
              subtext="Joined this week"
              icon={<UserPlus className="w-5 h-5" />}
              iconBg="bg-teal-50 text-teal-600"
            />
            <StatCard
              title="Today Attendance"
              value="86"
              subtext="Out of 128 active"
              trend="67%"
              icon={<CheckSquare className="w-5 h-5" />}
              iconBg="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              title="Today Collection"
              value={`₹${todayCollection.toLocaleString('en-IN')}`}
              subtext="Paid transactions"
              icon={<IndianRupee className="w-5 h-5" />}
              iconBg="bg-violet-50 text-violet-600"
            />
            <StatCard
              title="Renewals Due"
              value={expiringMembers.length}
              subtext="Expiring in < 7 days"
              icon={<Clock className="w-5 h-5" />}
              iconBg="bg-amber-50 text-amber-600"
            />
            <StatCard
              title="Pending Payments"
              value={pendingPaymentsList.length}
              subtext="Needs collection"
              icon={<AlertCircle className="w-5 h-5" />}
              iconBg="bg-rose-50 text-rose-600"
            />
          </div>
        ) : (
          /* STAFF metrics grid */
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Today Attendance"
              value="86"
              subtext="67% present"
              icon={<CheckSquare className="w-5 h-5" />}
              iconBg="bg-emerald-50 text-emerald-600"
            />
            <StatCard
              title="New Members"
              value={4}
              subtext="This month"
              icon={<UserPlus className="w-5 h-5" />}
              iconBg="bg-blue-50 text-blue-600"
            />
            <StatCard
              title="Renewals Due"
              value={expiringMembers.length}
              subtext="Follow up needed"
              icon={<Clock className="w-5 h-5" />}
              iconBg="bg-amber-50 text-amber-600"
            />
            <StatCard
              title="Pending Payments"
              value={pendingPaymentsList.length}
              subtext="To be recorded"
              icon={<AlertCircle className="w-5 h-5" />}
              iconBg="bg-rose-50 text-rose-600"
            />
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          <Link href="/members/new">
            <Button variant="outline" fullWidth className="h-14 flex-col gap-1 py-2 text-xs bg-white hover:border-blue-300">
              <Plus className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-800">Add Member</span>
            </Button>
          </Link>

          <Link href="/payments">
            <Button variant="outline" fullWidth className="h-14 flex-col gap-1 py-2 text-xs bg-white hover:border-blue-300">
              <CreditCard className="w-4 h-4 text-violet-600" />
              <span className="font-bold text-slate-800">Record Payment</span>
            </Button>
          </Link>

          <Link href="/attendance">
            <Button variant="outline" fullWidth className="h-14 flex-col gap-1 py-2 text-xs bg-white hover:border-blue-300">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800">Mark Attendance</span>
            </Button>
          </Link>

          <Link href="/enquiries">
            <Button variant="outline" fullWidth className="h-14 flex-col gap-1 py-2 text-xs bg-white hover:border-blue-300">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-slate-800">New Enquiry</span>
            </Button>
          </Link>

          <Link href="/whatsapp">
            <Button variant="outline" fullWidth className="h-14 flex-col gap-1 py-2 text-xs bg-white hover:border-blue-300 col-span-2 sm:col-span-1">
              <Send className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800">Send WhatsApp</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Attention Required Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Memberships Expiring Soon */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <h3 className="text-sm font-bold text-slate-900">Memberships Expiring Soon</h3>
            </div>
            <Link href="/members?filter=Expiring" className="text-xs text-blue-600 font-bold hover:underline flex items-center">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {expiringMembers.slice(0, 3).map((mem) => (
              <Link
                key={mem.id}
                href={`/members/${mem.id}`}
                className="flex items-center justify-between p-2.5 bg-amber-50/50 border border-amber-100 rounded-xl hover:bg-amber-100/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={mem.name} size="sm" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{mem.name}</p>
                    <p className="text-[11px] text-slate-500">{mem.currentMembership?.planName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="warning">
                    Expires: {mem.currentMembership?.expiryDate}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Pending Payments */}
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">Pending Payments</h3>
            </div>
            <Link href="/payments" className="text-xs text-blue-600 font-bold hover:underline flex items-center">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {pendingPaymentsList.slice(0, 3).map((pay) => (
              <div
                key={pay.id}
                className="flex items-center justify-between p-2.5 bg-rose-50/40 border border-rose-100 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <Avatar name={pay.memberName} size="sm" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{pay.memberName}</p>
                    <p className="text-[11px] text-slate-500">{pay.purpose}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-rose-700">
                    ₹{pay.amount.toLocaleString('en-IN')} pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity Timeline */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Activity Timeline</h3>
          <span className="text-[11px] text-slate-400">Live Updates</span>
        </div>

        <div className="space-y-3">
          {activities.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                {act.type === 'renewal' && <Clock className="w-4 h-4 text-amber-600" />}
                {act.type === 'join' && <UserPlus className="w-4 h-4 text-blue-600" />}
                {act.type === 'payment' && <IndianRupee className="w-4 h-4 text-emerald-600" />}
                {act.type === 'enquiry' && <HelpCircle className="w-4 h-4 text-violet-600" />}
                {act.type === 'whatsapp' && <MessageSquare className="w-4 h-4 text-teal-600" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 truncate">{act.title}</p>
                  <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-500 truncate">{act.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
