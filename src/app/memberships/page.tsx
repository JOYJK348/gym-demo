'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Dumbbell, Plus, Edit2, CheckCircle, Clock, IndianRupee } from 'lucide-react';

export default function MembershipsPage() {
  const { currentUser, plans, addPlan, updatePlan, togglePlanStatus } = useApp();

  const isOwner = currentUser?.role === 'OWNER';

  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [durationDays, setDurationDays] = useState('30');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');

  const openAdd = () => {
    setName('');
    setPrice('');
    setDurationDays('30');
    setDescription('');
    setTag('');
    setEditingPlanId(null);
    setIsAddSheetOpen(true);
  };

  const openEdit = (p: any) => {
    setName(p.name);
    setPrice(p.price.toString());
    setDurationDays(p.durationDays.toString());
    setDescription(p.description);
    setTag(p.tag || '');
    setEditingPlanId(p.id);
    setIsAddSheetOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    if (editingPlanId) {
      updatePlan(editingPlanId, {
        name,
        price: Number(price),
        durationDays: Number(durationDays),
        description,
        tag: tag || undefined
      });
    } else {
      addPlan({
        name,
        price: Number(price),
        durationDays: Number(durationDays),
        description,
        isActive: true,
        tag: tag || undefined
      });
    }
    setIsAddSheetOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="Membership Plans"
        subtitle="Configure gym pricing plans and package options"
        action={
          isOwner ? (
            <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={openAdd}>
              Create Plan
            </Button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-5 space-y-3 relative flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                    {plan.tag && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700">
                        {plan.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>
                </div>

                <Badge variant={plan.isActive ? 'success' : 'neutral'}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-2xl font-black text-blue-600">
                  ₹{plan.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ {plan.durationDays} days</span>
              </div>
            </div>

            {isOwner && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => openEdit(plan)}
                >
                  Edit Plan
                </Button>

                <Button
                  size="sm"
                  variant={plan.isActive ? 'ghost' : 'secondary'}
                  onClick={() => togglePlanStatus(plan.id)}
                >
                  {plan.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add / Edit Plan Sheet Modal */}
      <BottomSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        title={editingPlanId ? 'Edit Plan' : 'Create Membership Plan'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Plan Name *"
            placeholder="e.g. Monthly Plan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price (INR) *"
              type="number"
              placeholder="1500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              icon={<IndianRupee className="w-4 h-4" />}
              required
            />

            <Input
              label="Duration (Days) *"
              type="number"
              placeholder="30"
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              icon={<Clock className="w-4 h-4" />}
              required
            />
          </div>

          <Input
            label="Description"
            placeholder="Short details of what is included..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Highlight Tag (Optional)"
            placeholder="e.g. Popular, Best Value"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />

          <Button type="submit" fullWidth size="lg">
            {editingPlanId ? 'Save Changes' : 'Create Membership Plan'}
          </Button>
        </form>
      </BottomSheet>
    </div>
  );
}
