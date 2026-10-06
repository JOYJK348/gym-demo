'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { User, Phone, Mail, Calendar, MapPin, HeartPulse, Dumbbell, Save } from 'lucide-react';

export default function AddMemberPage() {
  const router = useRouter();
  const { plans, addMember, recordPayment } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dob, setDob] = useState('1998-05-15');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [joiningDate, setJoiningDate] = useState(todayStr);
  const [planId, setPlanId] = useState(plans[0]?.id || '');
  const [startDate, setStartDate] = useState(todayStr);
  const [notes, setNotes] = useState('');
  const [collectPayment, setCollectPayment] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    setIsLoading(true);

    const selectedPlan = plans.find((p) => p.id === planId) || plans[0];

    const expiryDateObj = new Date(startDate);
    expiryDateObj.setDate(expiryDateObj.getDate() + (selectedPlan?.durationDays || 30));
    const expiryDate = expiryDateObj.toISOString().split('T')[0];

    const newMember = addMember({
      name,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      gender,
      dob,
      address: address || 'Chennai, Tamil Nadu',
      emergencyContact: emergencyContact || phone,
      joiningDate,
      notes,
      currentMembership: {
        id: `mship_${Date.now()}`,
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: selectedPlan.price,
        startDate,
        expiryDate,
        status: 'Active'
      }
    });

    if (collectPayment) {
      recordPayment({
        memberId: newMember.id,
        amount: selectedPlan.price,
        purpose: `${selectedPlan.name} Joining Fee`,
        paymentMethod: 'UPI',
        notes: 'Initial joining payment'
      });
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push(`/members/${newMember.id}`);
    }, 400);
  };

  const planOptions = plans
    .filter((p) => p.isActive)
    .map((p) => ({
      value: p.id,
      label: `${p.name} — ₹${p.price} (${p.durationDays} days)`
    }));

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <PageHeader title="Add New Member" subtitle="Register a new member to Agaran Fitness" showBack />

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Personal Information
          </h2>

          <Input
            label="Full Name *"
            placeholder="e.g. Raj Kumar"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number *"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="raj.kumar@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
            />

            <Input
              label="Date of Birth"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              icon={<Calendar className="w-4 h-4" />}
            />
          </div>

          <Input
            label="Address"
            placeholder="Door No, Street Name, Area, City"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            icon={<MapPin className="w-4 h-4" />}
          />

          <Input
            label="Emergency Contact"
            placeholder="Phone number & relation"
            value={emergencyContact}
            onChange={(e) => setEmergencyContact(e.target.value)}
            icon={<HeartPulse className="w-4 h-4" />}
          />
        </Card>

        {/* Membership Details */}
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Membership Assignment
          </h2>

          <Select
            label="Select Membership Plan *"
            value={planId}
            onChange={(e) => setPlanId(e.target.value)}
            options={planOptions}
            icon={<Dumbbell className="w-4 h-4" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Joining Date"
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
            />

            <Input
              label="Plan Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <Input
            label="Notes / Special Requirements"
            placeholder="e.g. Morning 6 AM slot, Fat loss focus, Medical history"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={collectPayment}
              onChange={(e) => setCollectPayment(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <span className="text-xs font-semibold text-slate-700">
              Record payment automatically for this plan (₹{plans.find((p) => p.id === planId)?.price})
            </span>
          </label>
        </Card>

        {/* Action Button */}
        <div className="pt-2">
          <Button
            type="submit"
            fullWidth
            size="lg"
            isLoading={isLoading}
            icon={<Save className="w-5 h-5" />}
          >
            Create Member & Activate Plan
          </Button>
        </div>
      </form>
    </div>
  );
}
