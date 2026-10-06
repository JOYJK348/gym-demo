'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckSquare, 
  XSquare, 
  Search, 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  Check, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/cn';

export default function AttendancePage() {
  const { members, attendance, markAttendance } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'daily' | 'calendar'>('daily');

  // Attendance lookup for selectedDate
  const dateRecordsMap = useMemo(() => {
    const map = new Map<string, { status: 'Present' | 'Absent'; checkInTime?: string }>();
    attendance.forEach((r) => {
      if (r.date === selectedDate) {
        map.set(r.memberId, { status: r.status, checkInTime: r.checkInTime });
      }
    });
    return map;
  }, [attendance, selectedDate]);

  const totalActive = members.length;
  const presentCount = members.filter((m) => dateRecordsMap.get(m.id)?.status === 'Present').length;
  const absentCount = totalActive - presentCount;
  const attendanceRate = totalActive > 0 ? Math.round((presentCount / totalActive) * 100) : 0;

  const filteredMembers = useMemo(() => {
    return members.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm)
    );
  }, [members, searchTerm]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Daily Attendance"
        subtitle={`Track check-ins for ${selectedDate}`}
        action={
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setViewMode('daily')}
              className={cn(
                'px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer',
                viewMode === 'daily' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Daily Tracker
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer',
                viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Calendar View
            </button>
          </div>
        }
      />

      {/* Date Selector & Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Active"
          value={totalActive}
          subtext="Members"
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Present Today"
          value={presentCount}
          subtext="Checked in"
          icon={<CheckSquare className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Absent"
          value={absentCount}
          subtext="Not checked in"
          icon={<XSquare className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
        />

        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          subtext="Completion"
          icon={<CalendarIcon className="w-5 h-5" />}
          iconBg="bg-violet-50 text-violet-600"
        />
      </div>

      {viewMode === 'daily' ? (
        <div className="space-y-3">
          {/* Search & Date Input */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="flex-1">
              <Input
                placeholder="Search member by name to mark attendance..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="bg-white"
              />
            </div>
            <div className="w-full sm:w-44">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Member Check-in Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMembers.map((member) => {
              const record = dateRecordsMap.get(member.id);
              const isPresent = record?.status === 'Present';

              return (
                <Card
                  key={member.id}
                  className={cn(
                    'p-4 flex items-center justify-between gap-3 border transition-colors',
                    isPresent ? 'bg-emerald-50/30 border-emerald-200/80' : 'bg-white border-slate-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} size="md" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{member.name}</h4>
                      <p className="text-xs text-slate-500">
                        {member.currentMembership?.planName || 'Plan'}
                      </p>
                      {isPresent && record?.checkInTime && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold mt-0.5">
                          <Clock className="w-3 h-3" /> Checked in at {record.checkInTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Toggle Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant={isPresent ? 'success' : 'outline'}
                      icon={<Check className="w-3.5 h-3.5" />}
                      onClick={() => markAttendance(member.id, selectedDate, 'Present')}
                    >
                      Present
                    </Button>

                    <Button
                      size="sm"
                      variant={!isPresent && record ? 'danger' : 'ghost'}
                      icon={<X className="w-3.5 h-3.5" />}
                      onClick={() => markAttendance(member.id, selectedDate, 'Absent')}
                    >
                      Absent
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* Monthly Calendar Attendance Grid */
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">October 2026 Attendance Grid</h3>
            <span className="text-xs text-slate-500">22 Gym Working Days</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day} className="font-extrabold text-slate-400 py-1">
                {day}
              </span>
            ))}

            {Array.from({ length: 31 }).map((_, idx) => {
              const dayNum = idx + 1;
              const isPastOrToday = dayNum <= 6;
              const isPresentDay = [1, 2, 4, 5, 6].includes(dayNum);

              return (
                <div
                  key={dayNum}
                  className={cn(
                    'p-2.5 rounded-xl border flex flex-col items-center justify-center min-h-[44px]',
                    isPastOrToday
                      ? isPresentDay
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                        : 'bg-rose-50 border-rose-200 text-rose-800 font-bold'
                      : 'bg-slate-50 border-slate-100 text-slate-400'
                  )}
                >
                  <span className="text-xs">{dayNum}</span>
                  {isPastOrToday && (
                    <span className="text-[9px] mt-0.5">
                      {isPresentDay ? '86 Present' : 'Closed'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
