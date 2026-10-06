'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Select } from '@/components/ui/Select';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  HeartPulse, 
  Dumbbell, 
  IndianRupee, 
  CheckSquare, 
  MessageSquare, 
  RefreshCw, 
  PauseCircle, 
  XCircle, 
  CreditCard,
  Send,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/cn';

export default function MemberProfilePage() {
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const { 
    members, 
    plans, 
    payments, 
    renewMembership, 
    updateMember, 
    sendWhatsAppMessage, 
    recordPayment,
    templates
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'membership' | 'payments' | 'attendance' | 'timeline'>('membership');
  const [isRenewSheetOpen, setIsRenewSheetOpen] = useState(false);
  const [isWhatsAppSheetOpen, setIsWhatsAppSheetOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [confirmFreezeOpen, setConfirmFreezeOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  const member = members.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="text-center py-12 space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Member Not Found</h2>
        <p className="text-xs text-slate-500">The member you are looking for does not exist or was deleted.</p>
        <Button onClick={() => router.push('/members')}>Back to Members List</Button>
      </div>
    );
  }

  const memberPayments = payments.filter((p) => p.memberId === member.id);

  const handleRenewSubmit = () => {
    renewMembership(member.id, selectedPlanId);
    setIsRenewSheetOpen(false);
  };

  const handleFreezeConfirm = () => {
    if (member.currentMembership) {
      updateMember(member.id, {
        currentMembership: {
          ...member.currentMembership,
          status: 'Frozen'
        }
      });
    }
    setConfirmFreezeOpen(false);
  };

  const handleCancelConfirm = () => {
    if (member.currentMembership) {
      updateMember(member.id, {
        currentMembership: {
          ...member.currentMembership,
          status: 'Cancelled'
        }
      });
    }
    setConfirmCancelOpen(false);
  };

  const handleSendWhatsApp = () => {
    sendWhatsAppMessage(member.id, selectedTemplateId);
    setIsWhatsAppSheetOpen(false);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <PageHeader title="Member Profile" showBack />

      {/* Profile Header Card */}
      <Card className="p-5 space-y-4 bg-gradient-to-b from-white to-blue-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar name={member.name} size="xl" />
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">{member.name}</h2>
              <p className="text-xs text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                <Dumbbell className="w-3.5 h-3.5" />
                {member.currentMembership?.planName || 'No Membership'}
              </p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge
                  variant={
                    member.currentMembership?.status === 'Active'
                      ? 'success'
                      : member.currentMembership?.status === 'Expiring Soon'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  🟢 {member.currentMembership?.status || 'Inactive'}
                </Badge>
                <span className="text-[11px] text-slate-400 font-medium">
                  ID: #{member.id.replace('mem_', '')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="primary"
              icon={<RefreshCw className="w-4 h-4" />}
              onClick={() => setIsRenewSheetOpen(true)}
            >
              Renew
            </Button>

            <Button
              size="sm"
              variant="secondary"
              icon={<MessageSquare className="w-4 h-4 text-emerald-600" />}
              onClick={() => setIsWhatsAppSheetOpen(true)}
            >
              WhatsApp
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'membership', label: 'Membership' },
          { key: 'info', label: 'Personal Info' },
          { key: 'payments', label: 'Payments' },
          { key: 'attendance', label: 'Attendance' },
          { key: 'timeline', label: 'Activity Log' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={cn(
              'px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer',
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Membership Details */}
      {activeTab === 'membership' && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Current Membership Status</h3>
              <Badge variant={member.currentMembership?.status === 'Active' ? 'success' : 'warning'}>
                {member.currentMembership?.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Assigned Plan</span>
                <p className="font-bold text-slate-900 text-sm">{member.currentMembership?.planName}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Plan Price</span>
                <p className="font-bold text-blue-600 text-sm">₹{member.currentMembership?.price.toLocaleString('en-IN')}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Start Date</span>
                <p className="font-semibold text-slate-700">{member.currentMembership?.startDate}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Expiry Date</span>
                <p className="font-semibold text-amber-700">{member.currentMembership?.expiryDate}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={() => setIsRenewSheetOpen(true)}
              >
                Renew
              </Button>

              <Button
                variant="outline"
                size="sm"
                icon={<PauseCircle className="w-3.5 h-3.5 text-blue-600" />}
                onClick={() => setConfirmFreezeOpen(true)}
              >
                Freeze
              </Button>

              <Button
                variant="danger"
                size="sm"
                icon={<XCircle className="w-3.5 h-3.5" />}
                onClick={() => setConfirmCancelOpen(true)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Personal Info */}
      {activeTab === 'info' && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Contact & Personal Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Phone Number</span>
                <span className="font-semibold text-slate-900">{member.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Email Address</span>
                <span className="font-semibold text-slate-900">{member.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Date of Birth / Gender</span>
                <span className="font-semibold text-slate-900">{member.dob} &bull; {member.gender}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Residential Address</span>
                <span className="font-semibold text-slate-900">{member.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <HeartPulse className="w-4 h-4 text-slate-400 shrink-0" />
              <div>
                <span className="text-slate-400 block">Emergency Contact</span>
                <span className="font-semibold text-slate-900">{member.emergencyContact}</span>
              </div>
            </div>

            {member.notes && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mt-2">
                <span className="text-slate-400 block mb-1 font-semibold">Staff Notes</span>
                <p className="text-slate-700 font-medium">{member.notes}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tab 3: Payments History */}
      {activeTab === 'payments' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Payment History</h3>
            <span className="text-xs text-slate-500">{memberPayments.length} transactions</span>
          </div>

          {memberPayments.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No recorded payments for this member.</p>
          ) : (
            <div className="space-y-2.5">
              {memberPayments.map((pay) => (
                <div
                  key={pay.id}
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{pay.purpose}</span>
                      <Badge variant={pay.status === 'Completed' ? 'success' : 'warning'}>
                        {pay.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {pay.invoiceNo} &bull; {pay.date} via {pay.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-blue-600">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* Tab 4: Attendance Stats */}
      {activeTab === 'attendance' && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Monthly Attendance Stats
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <span className="text-2xl font-black text-emerald-700">18 / 22</span>
              <p className="text-xs text-emerald-600 font-semibold mt-1">Days Attended</p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <span className="text-2xl font-black text-blue-700">82%</span>
              <p className="text-xs text-blue-600 font-semibold mt-1">Attendance Rate</p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recent Check-ins</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <span>Oct 06</span>
                <span className="font-bold text-emerald-600">Present (06:20 AM)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <span>Oct 05</span>
                <span className="font-bold text-emerald-600">Present (06:15 AM)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <span>Oct 04</span>
                <span className="font-bold text-rose-600">Absent</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                <span>Oct 03</span>
                <span className="font-bold text-emerald-600">Present (06:30 AM)</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 5: Activity Timeline */}
      {activeTab === 'timeline' && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Member Activity Timeline
          </h3>

          <div className="space-y-4 relative pl-4 border-l-2 border-slate-200 ml-2">
            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white" />
              <p className="text-xs font-bold text-slate-900">Welcome WhatsApp Sent</p>
              <p className="text-[11px] text-slate-500">Sent automated onboarding template</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-600 border-2 border-white" />
              <p className="text-xs font-bold text-slate-900">Payment Received — ₹{member.currentMembership?.price}</p>
              <p className="text-[11px] text-slate-500">{member.currentMembership?.planName} transaction completed</p>
            </div>

            <div className="relative">
              <div className="absolute -left-[23px] top-0 w-3.5 h-3.5 rounded-full bg-amber-600 border-2 border-white" />
              <p className="text-xs font-bold text-slate-900">Membership Activated</p>
              <p className="text-[11px] text-slate-500">Joined Agaran Fitness on {member.joiningDate}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Renew Sheet Modal */}
      <BottomSheet isOpen={isRenewSheetOpen} onClose={() => setIsRenewSheetOpen(false)} title={`Renew ${member.name}`}>
        <div className="space-y-4">
          <Select
            label="Choose Renewal Plan"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            options={plans.map((p) => ({
              value: p.id,
              label: `${p.name} — ₹${p.price} (${p.durationDays} days)`
            }))}
          />

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs space-y-1">
            <p className="font-bold text-blue-900">Renewal Summary:</p>
            <p className="text-blue-700">Starts: Today ({new Date().toISOString().split('T')[0]})</p>
            <p className="text-blue-700">Expires: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</p>
          </div>

          <Button fullWidth onClick={handleRenewSubmit} icon={<RefreshCw className="w-4 h-4" />}>
            Confirm & Renew Membership
          </Button>
        </div>
      </BottomSheet>

      {/* Send WhatsApp Sheet Modal */}
      <BottomSheet isOpen={isWhatsAppSheetOpen} onClose={() => setIsWhatsAppSheetOpen(false)} title={`Send WhatsApp to ${member.name}`}>
        <div className="space-y-4">
          <Select
            label="Select Message Template"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            options={templates.map((t) => ({ value: t.id, label: t.name }))}
          />

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <p className="font-bold text-slate-700">Template Preview:</p>
            <p className="text-slate-600 whitespace-pre-line italic">
              {templates.find((t) => t.id === selectedTemplateId)?.content
                .replace(/\[Customer Name\]/g, member.name)
                .replace(/\[Gym Name\]/g, 'Agaran Fitness')
                .replace(/\[Plan Name\]/g, member.currentMembership?.planName || 'Membership')
                .replace(/\[Amount\]/g, member.currentMembership?.price.toString() || '0')}
            </p>
          </div>

          <Button fullWidth onClick={handleSendWhatsApp} icon={<Send className="w-4 h-4" />}>
            Send WhatsApp Message
          </Button>
        </div>
      </BottomSheet>

      {/* Confirm Freeze Dialog */}
      <ConfirmDialog
        isOpen={confirmFreezeOpen}
        onClose={() => setConfirmFreezeOpen(false)}
        onConfirm={handleFreezeConfirm}
        title="Freeze Membership?"
        description={`Are you sure you want to temporarily freeze ${member.name}'s membership?`}
        confirmText="Freeze Plan"
      />

      {/* Confirm Cancel Dialog */}
      <ConfirmDialog
        isOpen={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Membership?"
        description={`Are you sure you want to cancel ${member.name}'s membership?`}
        confirmText="Cancel Plan"
        variant="danger"
      />
    </div>
  );
}
