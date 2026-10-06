'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { 
  Settings as SettingsIcon, 
  Building, 
  Phone, 
  Mail, 
  Globe, 
  Share2, 
  Clock, 
  Smartphone, 
  MessageSquare, 
  Users, 
  Save,
  Check
} from 'lucide-react';
import { cn } from '@/lib/cn';

export default function SettingsPage() {
  const { settings, updateSettings, templates, saveTemplate } = useApp();

  const [activeSection, setActiveSection] = useState<'profile' | 'whatsapp' | 'templates' | 'staff'>('profile');

  // Profile Form state
  const [gymName, setGymName] = useState(settings.gymName);
  const [phone, setPhone] = useState(settings.phone);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);
  const [website, setWebsite] = useState(settings.website);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [businessHours, setBusinessHours] = useState(settings.businessHours);

  // Template Edit Sheet
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
  const [templateContent, setTemplateContent] = useState('');

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      gymName,
      phone,
      email,
      address,
      website,
      instagram,
      businessHours
    });
  };

  const handleTemplateSave = () => {
    if (editingTemplate) {
      saveTemplate({
        ...editingTemplate,
        content: templateContent
      });
      setEditingTemplate(null);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <PageHeader
        title="Gym Settings"
        subtitle="Manage business profile, WhatsApp integration, templates & staff access"
      />

      {/* Settings Section Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto no-scrollbar pb-1">
        {[
          { key: 'profile', label: 'Business Profile', icon: Building },
          { key: 'whatsapp', label: 'WhatsApp Config', icon: Smartphone },
          { key: 'templates', label: 'Message Templates', icon: MessageSquare },
          { key: 'staff', label: 'Staff Accounts', icon: Users },
        ].map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.key;
          return (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key as any)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer',
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Business Profile */}
      {activeSection === 'profile' && (
        <form onSubmit={handleProfileSubmit}>
          <Card className="p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Gym Details & Branding Information
            </h3>

            <Input
              label="Gym Business Name *"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Official Phone *"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone className="w-4 h-4" />}
                required
              />

              <Input
                label="Official Email *"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />
            </div>

            <Input
              label="Gym Address *"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                icon={<Globe className="w-4 h-4" />}
              />

              <Input
                label="Instagram Handle"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                icon={<Share2 className="w-4 h-4" />}
              />
            </div>

            <Input
              label="Business Hours *"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              icon={<Clock className="w-4 h-4" />}
              required
            />

            <Button type="submit" fullWidth size="lg" icon={<Save className="w-5 h-5" />}>
              Save Profile Changes
            </Button>
          </Card>
        </form>
      )}

      {/* Section 2: WhatsApp Config */}
      {activeSection === 'whatsapp' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">WhatsApp Business Cloud API</h3>
            <Badge variant="success">Connected 🟢</Badge>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Connected Number:</span>
              <span className="font-bold text-slate-900">{settings.whatsAppNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-700">Online & Listening</span>
            </div>
          </div>
        </Card>
      )}

      {/* Section 3: Message Templates */}
      {activeSection === 'templates' && (
        <div className="space-y-3">
          <Card className="p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              WhatsApp Message Templates
            </h3>

            <div className="space-y-3">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingTemplate(tpl);
                        setTemplateContent(tpl.content);
                      }}
                    >
                      Edit Template
                    </Button>
                  </div>
                  <p className="text-xs text-slate-600 whitespace-pre-line font-mono bg-white p-2.5 rounded-xl border border-slate-100">
                    {tpl.content}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Section 4: Staff Accounts */}
      {activeSection === 'staff' && (
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Staff Accounts</h3>
            <span className="text-xs text-slate-500">1 Staff User Configured</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                ST
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Frontdesk Staff</p>
                <p className="text-xs text-slate-500">{settings.staffAccountEmail}</p>
              </div>
            </div>

            <Badge variant="neutral">STAFF ROLE</Badge>
          </div>
        </Card>
      )}

      {/* Edit Template Sheet */}
      {editingTemplate && (
        <BottomSheet
          isOpen={!!editingTemplate}
          onClose={() => setEditingTemplate(null)}
          title={`Edit ${editingTemplate.name}`}
        >
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Template Text Content
            </label>

            <textarea
              rows={6}
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500"
            />

            <p className="text-[11px] text-slate-400">
              Available variables: [Customer Name], [Gym Name], [Plan Name], [Amount], [Expiry Date], [Days Remaining]
            </p>

            <Button fullWidth onClick={handleTemplateSave} icon={<Check className="w-4 h-4" />}>
              Save Template
            </Button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
