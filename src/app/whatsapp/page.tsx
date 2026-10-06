'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  CheckCheck, 
  Clock, 
  Smartphone,
  Plus
} from 'lucide-react';

export default function WhatsAppPage() {
  const { members, templates, whatsappMessages, sendWhatsAppMessage, settings } = useApp();

  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');
  const [customText, setCustomText] = useState('');

  const currentMember = members.find((m) => m.id === selectedMemberId);
  const currentTemplate = templates.find((t) => t.id === selectedTemplateId);

  // Compute live message text preview
  const getPreviewText = () => {
    let text = customText || currentTemplate?.content || '';
    if (currentMember) {
      text = text
        .replace(/\[Customer Name\]/g, currentMember.name)
        .replace(/\[Gym Name\]/g, settings.gymName)
        .replace(/\[Plan Name\]/g, currentMember.currentMembership?.planName || 'Membership')
        .replace(/\[Amount\]/g, currentMember.currentMembership?.price.toString() || '0')
        .replace(/\[Expiry Date\]/g, currentMember.currentMembership?.expiryDate || 'N/A')
        .replace(/\[Days Remaining\]/g, '3');
    }
    return text;
  };

  const insertChip = (chipText: string) => {
    setCustomText((prev) => (prev ? `${prev} ${chipText}` : `${currentTemplate?.content || ''} ${chipText}`));
  };

  const handleSend = () => {
    if (!selectedMemberId) return;
    sendWhatsAppMessage(selectedMemberId, selectedTemplateId, customText || undefined);
    setCustomText('');
  };

  const chips = [
    '[Customer Name]',
    '[Gym Name]',
    '[Plan Name]',
    '[Amount]',
    '[Expiry Date]',
    '[Days Remaining]'
  ];

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="WhatsApp Automation & Messaging"
        subtitle="Send automated reminders, payment receipts & welcome greetings"
      />

      {/* Connection Status Banner */}
      <Card className="p-4 bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 animate-ping" />
              <h3 className="text-sm font-bold">WhatsApp Business Connected</h3>
            </div>
            <p className="text-xs text-emerald-100">
              Active Number: <span className="font-semibold">{settings.whatsAppNumber}</span>
            </p>
          </div>
        </div>

        <Badge variant="neutral" className="bg-white/20 border-white/30 text-white self-start sm:self-auto">
          ⚡ Ready for Messages
        </Badge>
      </Card>

      {/* Composer Card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Send Instant WhatsApp Message</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Select Member *"
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            options={members.map((m) => ({
              value: m.id,
              label: `${m.name} (${m.phone})`
            }))}
          />

          <Select
            label="Select Message Template *"
            value={selectedTemplateId}
            onChange={(e) => {
              setSelectedTemplateId(e.target.value);
              setCustomText('');
            }}
            options={templates.map((t) => ({ value: t.id, label: t.name }))}
          />
        </div>

        {/* Variable Chips Bar */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Insert Variable Chips
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {chips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => insertChip(chip)}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Live Message Preview */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Message Live Preview
          </label>
          <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl text-xs text-slate-800 space-y-2 relative">
            <p className="whitespace-pre-line font-medium leading-relaxed">
              {getPreviewText()}
            </p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          fullWidth
          size="lg"
          variant="success"
          icon={<Send className="w-5 h-5" />}
          onClick={handleSend}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
        >
          Send WhatsApp to {currentMember?.name || 'Member'}
        </Button>
      </Card>

      {/* Recent Sent Messages Log */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Recent Sent Messages Log</h3>
          <span className="text-xs text-slate-500">{whatsappMessages.length} sent</span>
        </div>

        <div className="space-y-2.5">
          {whatsappMessages.map((msg) => (
            <div
              key={msg.id}
              className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{msg.recipientName}</span>
                  <Badge variant="success">{msg.status}</Badge>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">{msg.messageText}</p>
                <p className="text-[10px] text-slate-400">
                  {msg.sentAt} &bull; Template: {msg.templateName}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
