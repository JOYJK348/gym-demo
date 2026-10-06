'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  HelpCircle, 
  Plus, 
  Phone, 
  Send, 
  UserCheck, 
  MessageSquare, 
  Search, 
  Flame, 
  Clock 
} from 'lucide-react';
import { EnquirySource, EnquiryStatus } from '@/types';

export default function EnquiriesPage() {
  const { enquiries, plans, addEnquiry, updateEnquiryStatus, convertEnquiryToMember, sendWhatsAppMessage } = useApp();

  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [convertingEnquiryId, setConvertingEnquiryId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || '');

  // Add Enquiry form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<EnquirySource>('Instagram');
  const [interestedPlanName, setInterestedPlanName] = useState('Monthly Plan');
  const [notes, setNotes] = useState('');

  const statuses: ('All' | EnquiryStatus)[] = ['All', 'New', 'Contacted', 'Trial', 'Joined', 'Lost'];

  const filteredEnquiries = enquiries.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.phone.includes(searchTerm);

    if (!matchesSearch) return false;
    if (activeTab === 'All') return true;
    return e.status === activeTab;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addEnquiry({
      name,
      phone,
      email,
      source,
      interestedPlanName,
      status: 'New',
      notes
    });

    setIsAddSheetOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setNotes('');
  };

  const handleConvertSubmit = () => {
    if (convertingEnquiryId) {
      convertEnquiryToMember(convertingEnquiryId, selectedPlanId);
      setConvertingEnquiryId(null);
    }
  };

  const getStatusBadge = (st: EnquiryStatus) => {
    switch (st) {
      case 'New':
        return 'info';
      case 'Contacted':
        return 'neutral';
      case 'Trial':
        return 'warning';
      case 'Joined':
        return 'success';
      case 'Lost':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Enquiries & Leads"
        subtitle="Track potential gym members, trials & lead conversions"
        action={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setIsAddSheetOpen(true)}>
            New Enquiry
          </Button>
        }
      />

      {/* Search & Pipeline Status Tabs */}
      <div className="space-y-3">
        <Input
          placeholder="Search enquiry by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="bg-white"
        />

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {statuses.map((st) => {
            const count = st === 'All' ? enquiries.length : enquiries.filter((e) => e.status === st).length;
            const isSelected = activeTab === st;

            return (
              <button
                key={st}
                onClick={() => setActiveTab(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{st}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${isSelected ? 'bg-white/20' : 'bg-slate-100'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Enquiry Cards Pipeline */}
      {filteredEnquiries.length === 0 ? (
        <EmptyState
          icon={<HelpCircle className="w-8 h-8" />}
          title="No Enquiries Found"
          description="No leads match your current search query or pipeline filter."
          actionLabel="Create New Enquiry"
          onAction={() => setIsAddSheetOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredEnquiries.map((enq) => (
            <Card key={enq.id} className="p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{enq.name}</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                        {enq.source}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 font-semibold mt-0.5">
                      Interested: {enq.interestedPlanName}
                    </p>
                  </div>

                  <Badge variant={getStatusBadge(enq.status)}>{enq.status}</Badge>
                </div>

                {enq.notes && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-xl italic">
                    "{enq.notes}"
                  </p>
                )}

                {/* Free Trial Banner */}
                {enq.status === 'Trial' && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs flex items-center justify-between text-amber-900">
                    <div className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-bold">Free Trial Active</span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-700">
                      Ends {enq.trialEndDate || 'Tomorrow'}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <a
                  href={`tel:${enq.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>

                <button
                  onClick={() => sendWhatsAppMessage(enq.id, 'tpl_trial')}
                  className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                {enq.status !== 'Joined' && (
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<UserCheck className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setConvertingEnquiryId(enq.id);
                      setSelectedPlanId(plans[0]?.id || '');
                    }}
                  >
                    Convert
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Enquiry Bottom Sheet */}
      <BottomSheet isOpen={isAddSheetOpen} onClose={() => setIsAddSheetOpen(false)} title="New Lead Enquiry">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Prospect Name *"
            placeholder="e.g. Vignesh K"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Phone Number *"
            type="tel"
            placeholder="+91 98765 88990"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <Select
            label="Lead Source *"
            value={source}
            onChange={(e) => setSource(e.target.value as any)}
            options={[
              { value: 'Instagram', label: 'Instagram' },
              { value: 'WhatsApp', label: 'WhatsApp' },
              { value: 'Google', label: 'Google Search' },
              { value: 'Referral', label: 'Member Referral' },
              { value: 'Walk-in', label: 'Walk-in' },
              { value: 'Other', label: 'Other' }
            ]}
          />

          <Input
            label="Interested Membership Plan"
            placeholder="e.g. Monthly Plan"
            value={interestedPlanName}
            onChange={(e) => setInterestedPlanName(e.target.value)}
          />

          <Input
            label="Notes / Inquiry Details"
            placeholder="e.g. Asked about evening batch weight training"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" fullWidth size="lg">
            Create Lead Record
          </Button>
        </form>
      </BottomSheet>

      {/* Convert Enquiry to Member Sheet */}
      <BottomSheet
        isOpen={!!convertingEnquiryId}
        onClose={() => setConvertingEnquiryId(null)}
        title="Convert Lead to Gym Member"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Select a membership plan to activate and register this prospect as a full gym member.
          </p>

          <Select
            label="Select Membership Plan *"
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            options={plans.map((p) => ({
              value: p.id,
              label: `${p.name} — ₹${p.price} (${p.durationDays} days)`
            }))}
          />

          <Button fullWidth onClick={handleConvertSubmit} icon={<UserCheck className="w-4 h-4" />}>
            Confirm & Convert to Member
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
