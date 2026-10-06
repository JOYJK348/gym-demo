'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { 
  CreditCard, 
  Search, 
  Plus, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Send,
  FileText,
  Check
} from 'lucide-react';
import { PaymentMethod } from '@/types';

export default function PaymentsPage() {
  const { payments, members, recordPayment, sendWhatsAppMessage, settings } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [isRecordSheetOpen, setIsRecordSheetOpen] = useState(false);
  const [receiptPayment, setReceiptPayment] = useState<any | null>(null);

  // Form states
  const [memberId, setMemberId] = useState(members[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('Monthly Membership Renewal');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesSearch =
        p.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.purpose.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'Completed') return p.status === 'Completed';
      if (statusFilter === 'Pending') return p.status === 'Pending';
      return true;
    });
  }, [payments, searchTerm, statusFilter]);

  const totalCollected = payments
    .filter((p) => p.status === 'Completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payments.filter((p) => p.status === 'Pending').length;

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !amount) return;

    const newPay = recordPayment({
      memberId,
      amount: Number(amount),
      purpose,
      paymentMethod,
      notes
    });

    setIsRecordSheetOpen(false);
    setReceiptPayment(newPay);
  };

  const handleSendReceiptWhatsApp = () => {
    if (receiptPayment) {
      sendWhatsAppMessage(receiptPayment.memberId, 'tpl_payment');
      setReceiptPayment(null);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Payments & Receipts"
        subtitle="Record fees, issue receipts & track collections"
        action={
          <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setIsRecordSheetOpen(true)}>
            Record Payment
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <StatCard
          title="Total Collection"
          value={`₹${totalCollected.toLocaleString('en-IN')}`}
          subtext="Completed transactions"
          icon={<IndianRupee className="w-5 h-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Pending Payments"
          value={pendingCount}
          subtext="Follow-up needed"
          icon={<Clock className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Total Receipts"
          value={payments.length}
          subtext="Recorded entries"
          icon={<FileText className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <Input
          placeholder="Search payment by member name, invoice # or purpose..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="bg-white shadow-2xs"
        />

        <div className="flex items-center gap-2">
          {['All', 'Completed', 'Pending'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payment List Cards */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-8 h-8" />}
          title="No Payment Records"
          description="No payments found matching your current filter settings."
          actionLabel="Record New Payment"
          onAction={() => setIsRecordSheetOpen(true)}
        />
      ) : (
        <div className="space-y-2.5">
          {filteredPayments.map((pay) => (
            <Card key={pay.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{pay.memberName}</h3>
                    <Badge variant={pay.status === 'Completed' ? 'success' : 'warning'}>
                      {pay.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{pay.purpose}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Invoice: <span className="font-semibold text-slate-700">{pay.invoiceNo}</span> &bull; {pay.date} via {pay.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className="text-base font-black text-blue-600">
                  ₹{pay.amount.toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => setReceiptPayment(pay)}
                  className="text-xs text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1 mt-1"
                >
                  View Receipt
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Record Payment Bottom Sheet */}
      <BottomSheet
        isOpen={isRecordSheetOpen}
        onClose={() => setIsRecordSheetOpen(false)}
        title="Record Payment"
      >
        <form onSubmit={handleRecordSubmit} className="space-y-4">
          <Select
            label="Select Member *"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            options={members.map((m) => ({ value: m.id, label: `${m.name} (${m.phone})` }))}
          />

          <Input
            label="Amount (INR) *"
            type="number"
            placeholder="2999"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            icon={<IndianRupee className="w-4 h-4" />}
            required
          />

          <Input
            label="Purpose *"
            placeholder="e.g. Gold Membership Renewal"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />

          <Select
            label="Payment Method *"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as any)}
            options={[
              { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
              { value: 'Cash', label: 'Cash at Desk' },
              { value: 'Card', label: 'Credit / Debit Card' },
              { value: 'Online', label: 'Online NetBanking' }
            ]}
          />

          <Input
            label="Notes / Ref ID (Optional)"
            placeholder="e.g. GPay Ref #99283741"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" fullWidth size="lg" icon={<Check className="w-5 h-5" />}>
            Record Payment & Generate Receipt
          </Button>
        </form>
      </BottomSheet>

      {/* Digital Receipt Modal */}
      {receiptPayment && (
        <BottomSheet
          isOpen={!!receiptPayment}
          onClose={() => setReceiptPayment(null)}
          title="Payment Receipt"
        >
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-emerald-900">Payment Completed!</h4>
              <p className="text-xs text-emerald-700">Receipt generated successfully</p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Receipt No:</span>
                <span className="font-bold text-slate-900">{receiptPayment.invoiceNo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Member:</span>
                <span className="font-bold text-slate-900">{receiptPayment.memberName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Purpose:</span>
                <span className="font-bold text-slate-900">{receiptPayment.purpose}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Method:</span>
                <span className="font-bold text-slate-900">{receiptPayment.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-700 font-bold">Total Paid:</span>
                <span className="font-black text-blue-600 text-sm">
                  ₹{receiptPayment.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" fullWidth onClick={() => setReceiptPayment(null)}>
                Close Receipt
              </Button>

              <Button
                variant="primary"
                fullWidth
                icon={<Send className="w-4 h-4" />}
                onClick={handleSendReceiptWhatsApp}
              >
                Send WhatsApp
              </Button>
            </div>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
