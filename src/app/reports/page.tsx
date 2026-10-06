'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, StatCard } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3, 
  IndianRupee, 
  Users, 
  CheckSquare, 
  HelpCircle, 
  TrendingUp,
  Download
} from 'lucide-react';

export default function ReportsPage() {
  const { members, payments, enquiries } = useApp();

  const [timeRange, setTimeRange] = useState<'this_month' | 'last_month' | 'quarter'>('this_month');

  const totalRevenue = payments
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const activeCount = members.filter((m) => m.currentMembership?.status === 'Active' || m.currentMembership?.status === 'Expiring Soon').length;
  const expiredCount = members.filter((m) => m.currentMembership?.status === 'Expired').length;
  const totalLeads = enquiries.length;
  const joinedLeads = enquiries.filter((e) => e.status === 'Joined').length;
  const conversionRate = totalLeads > 0 ? Math.round((joinedLeads / totalLeads) * 100) : 0;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      <PageHeader
        title="Analytics & Business Reports"
        subtitle="Revenue insights, member retention, attendance & lead conversion trends"
        action={
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="h-9 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            >
              <option value="this_month">This Month (Oct 2026)</option>
              <option value="last_month">Last Month (Sept 2026)</option>
              <option value="quarter">This Quarter (Q4)</option>
            </select>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          subtext="+14% vs last month"
          trend="+14%"
          icon={<IndianRupee className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Active Members"
          value={activeCount}
          subtext="Retained members"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Avg Attendance"
          value="82%"
          subtext="Daily turnout"
          icon={<CheckSquare className="w-5 h-5" />}
          iconBg="bg-violet-50 text-violet-600"
        />

        <StatCard
          title="Lead Conversion"
          value={`${conversionRate}%`}
          subtext={`${joinedLeads} / ${totalLeads} joined`}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* Visual Chart 1: Revenue & Collection Breakdown */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Revenue Breakdown by Membership Plan</h3>
            <p className="text-xs text-slate-500">Gross collections in INR</p>
          </div>
          <Badge variant="blue">Updated Today</Badge>
        </div>

        {/* CSS Visual Bar Chart */}
        <div className="space-y-3 pt-2">
          {[
            { label: 'Yearly VIP Plan (₹12,000)', amount: 24000, pct: '80%' },
            { label: 'Half Yearly Plan (₹7,000)', amount: 14000, pct: '55%' },
            { label: 'Quarterly Plan (₹4,000)', amount: 12000, pct: '45%' },
            { label: 'Monthly Plan (₹1,500)', amount: 9000, pct: '35%' },
            { label: 'Personal Training (₹8,000)', amount: 8000, pct: '30%' },
          ].map((item) => (
            <div key={item.label} className="space-y-1 text-xs">
              <div className="flex justify-between font-bold text-slate-800">
                <span>{item.label}</span>
                <span className="text-blue-600">₹{item.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: item.pct }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Grid 2: Attendance Peak Hours & Lead Source Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attendance Hours */}
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Peak Attendance Hours
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Morning 06:00 AM - 09:00 AM</span>
              <span className="font-bold text-emerald-600">52% (45 Members)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '52%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600">Evening 05:00 PM - 09:00 PM</span>
              <span className="font-bold text-blue-600">38% (33 Members)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '38%' }} />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-600">Afternoon 12:00 PM - 04:00 PM</span>
              <span className="font-bold text-slate-500">10% (8 Members)</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full">
              <div className="h-full bg-slate-400 rounded-full" style={{ width: '10%' }} />
            </div>
          </div>
        </Card>

        {/* Lead Source Breakdown */}
        <Card className="p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Lead Source Acquisition
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">Instagram Ads & Reels</span>
              <Badge variant="blue">40% Leads</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">Member Referrals</span>
              <Badge variant="success">30% Leads</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">Google Maps / Search</span>
              <Badge variant="info">20% Leads</Badge>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50">
              <span className="font-semibold text-slate-700">Walk-in Enquiries</span>
              <Badge variant="warning">10% Leads</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
