'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { 
  Zap, 
  Play, 
  Pause, 
  ArrowDown, 
  MessageSquare, 
  Clock, 
  Filter, 
  Plus, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AutomationsPage() {
  const { automations, toggleAutomation } = useApp();

  const [isAddStepOpen, setIsAddStepOpen] = useState(false);
  const [selectedAutoId, setSelectedAutoId] = useState(automations[0]?.id || '');

  const activeAutomation = automations.find((a) => a.id === selectedAutoId) || automations[0];

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'TRIGGER':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'CONDITION':
        return <Filter className="w-4 h-4 text-blue-500" />;
      case 'ACTION':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'WAIT':
        return <Clock className="w-4 h-4 text-violet-500" />;
      default:
        return <Zap className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStepBadge = (type: string) => {
    switch (type) {
      case 'TRIGGER':
        return 'warning';
      case 'CONDITION':
        return 'info';
      case 'ACTION':
        return 'success';
      case 'WAIT':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Visual Automation Builder"
        subtitle="Automate WhatsApp reminders, renewal sequences & lead nurture triggers"
        action={
          <Button
            size="sm"
            variant={activeAutomation?.status === 'Active' ? 'secondary' : 'primary'}
            icon={activeAutomation?.status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            onClick={() => toggleAutomation(activeAutomation.id)}
          >
            {activeAutomation?.status === 'Active' ? 'Pause Automation' : 'Activate Automation'}
          </Button>
        }
      />

      {/* Automation Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {automations.map((auto) => (
          <Card
            key={auto.id}
            onClick={() => setSelectedAutoId(auto.id)}
            className={`p-4 space-y-2 cursor-pointer transition-all ${
              selectedAutoId === auto.id
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30'
                : 'hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-sm font-bold text-slate-900">{auto.title}</h3>
              <Badge variant={auto.status === 'Active' ? 'success' : 'neutral'}>
                {auto.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500">{auto.description}</p>
            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
              <span>Trigger: {auto.trigger}</span>
              <span>Executed: {auto.executionCount} times</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Visual Workflow Nodes Renderer */}
      {activeAutomation && (
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">{activeAutomation.title}</h3>
              <p className="text-xs text-slate-500">Visual Flow Chart & Logic Steps</p>
            </div>

            <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsAddStepOpen(true)}>
              Add Step
            </Button>
          </div>

          {/* Workflow Graph Nodes Sequence */}
          <div className="space-y-4 max-w-md mx-auto relative">
            {activeAutomation.steps.map((step, idx) => (
              <React.Fragment key={step.id}>
                {/* Node Card */}
                <div className="p-4 rounded-2xl border bg-white shadow-xs space-y-2 relative transition-transform hover:scale-[1.01]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-100">
                        {getStepIcon(step.type)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Step {idx + 1} &bull; {step.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                      </div>
                    </div>

                    <Badge variant={getStepBadge(step.type) as any}>{step.type}</Badge>
                  </div>

                  <p className="text-xs text-slate-600 pl-1">{step.description}</p>
                </div>

                {/* Arrow Connector */}
                {idx < activeAutomation.steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="p-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </Card>
      )}

      {/* Add Step Bottom Sheet */}
      <BottomSheet isOpen={isAddStepOpen} onClose={() => setIsAddStepOpen(false)} title="Add Automation Step">
        <div className="space-y-4">
          <Select
            label="Step Type *"
            options={[
              { value: 'ACTION', label: 'Action (Send WhatsApp / Notification)' },
              { value: 'WAIT', label: 'Wait Delay (1, 2, 4, 7 days)' },
              { value: 'CONDITION', label: 'Condition Check (If not renewed)' }
            ]}
          />

          <Input label="Step Title *" placeholder="e.g. Wait 4 Days" required />
          <Input label="Description" placeholder="Step details..." />

          <Button fullWidth onClick={() => setIsAddStepOpen(false)}>
            Append Step to Flow
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
