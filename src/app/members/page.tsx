'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Search, UserPlus, Phone, Calendar, Dumbbell, ChevronRight, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { MembershipStatus } from '@/types';
import { cn } from '@/lib/cn';

export default function MembersPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'All';

  const { members } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>(initialFilter);

  const filters = ['All', 'Active', 'Expiring', 'Expired'];

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Search term
      const matchesSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'All') return true;
      if (activeTab === 'Active') return m.currentMembership?.status === 'Active';
      if (activeTab === 'Expiring') return m.currentMembership?.status === 'Expiring Soon';
      if (activeTab === 'Expired') return m.currentMembership?.status === 'Expired';
      return true;
    });
  }, [members, searchTerm, activeTab]);

  const getBadgeVariant = (status?: MembershipStatus) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Expiring Soon':
        return 'warning';
      case 'Expired':
        return 'danger';
      case 'Frozen':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <PageHeader
        title="Members Directory"
        subtitle={`Total ${members.length} members registered`}
        action={
          <Link href="/members/new">
            <Button size="sm" icon={<UserPlus className="w-4 h-4" />}>
              Add Member
            </Button>
          </Link>
        }
      />

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <Input
          placeholder="Search member by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="bg-white shadow-2xs"
        />

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => {
            const count =
              f === 'All'
                ? members.length
                : f === 'Active'
                ? members.filter((m) => m.currentMembership?.status === 'Active').length
                : f === 'Expiring'
                ? members.filter((m) => m.currentMembership?.status === 'Expiring Soon').length
                : members.filter((m) => m.currentMembership?.status === 'Expired').length;

            const isSelected = activeTab === f;

            return (
              <button
                key={f}
                onClick={() => setActiveTab(f)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 flex items-center gap-1.5',
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                )}
              >
                <span>{f}</span>
                <span
                  className={cn(
                    'px-1.5 py-0.2 rounded-full text-[10px]',
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Members Cards List (Mobile-First) */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="w-8 h-8" />}
          title="No Members Found"
          description="We couldn't find any member matching your search query or filter selection."
          actionLabel="Add New Member"
          onAction={() => window.location.href = '/members/new'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              hoverable
              className="p-4 space-y-3 relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} size="lg" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {member.name}
                    </h3>
                    <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                      <Dumbbell className="w-3.5 h-3.5" />
                      {member.currentMembership?.planName || 'No Active Plan'}
                    </p>
                  </div>
                </div>

                <Badge variant={getBadgeVariant(member.currentMembership?.status)}>
                  {member.currentMembership?.status || 'Inactive'}
                </Badge>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{member.phone}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Exp: {member.currentMembership?.expiryDate || 'N/A'}</span>
                </div>
              </div>

              <div className="pt-1">
                <Link href={`/members/${member.id}`}>
                  <Button variant="secondary" size="sm" fullWidth icon={<ChevronRight className="w-4 h-4" />}>
                    View Profile
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
