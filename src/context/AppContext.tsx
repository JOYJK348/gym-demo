'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Member, 
  MembershipPlan, 
  Payment, 
  AttendanceRecord, 
  Enquiry, 
  MessageTemplate, 
  WhatsAppMessage, 
  Automation, 
  Activity, 
  GymSettings, 
  UserRole,
  EnquiryStatus,
  AttendanceStatus,
  PaymentMethod
} from '@/types';
import {
  INITIAL_USERS,
  INITIAL_PLANS,
  INITIAL_MEMBERS,
  INITIAL_PAYMENTS,
  INITIAL_ENQUIRIES,
  INITIAL_TEMPLATES,
  INITIAL_WHATSAPP_LOGS,
  INITIAL_AUTOMATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_SETTINGS
} from '@/lib/mockData';

interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, pass: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
  
  members: Member[];
  plans: MembershipPlan[];
  payments: Payment[];
  attendance: AttendanceRecord[];
  enquiries: Enquiry[];
  whatsappMessages: WhatsAppMessage[];
  templates: MessageTemplate[];
  automations: Automation[];
  activities: Activity[];
  settings: GymSettings;

  toast: ToastState;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;

  // Actions
  addMember: (memberData: Omit<Member, 'id'>) => Member;
  updateMember: (id: string, memberData: Partial<Member>) => void;
  renewMembership: (memberId: string, planId: string, customPrice?: number) => void;
  
  addPlan: (plan: Omit<MembershipPlan, 'id'>) => void;
  updatePlan: (id: string, plan: Partial<MembershipPlan>) => void;
  togglePlanStatus: (id: string) => void;

  recordPayment: (paymentData: {
    memberId: string;
    amount: number;
    purpose: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => Payment;

  markAttendance: (memberId: string, date: string, status: AttendanceStatus) => void;
  
  addEnquiry: (enquiryData: Omit<Enquiry, 'id' | 'date'>) => Enquiry;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  convertEnquiryToMember: (enquiryId: string, planId: string) => void;

  sendWhatsAppMessage: (memberId: string, templateId: string, customText?: string) => void;
  saveTemplate: (template: MessageTemplate) => void;
  
  toggleAutomation: (id: string) => void;
  updateSettings: (newSettings: Partial<GymSettings>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'agaran_gym_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_PLANS);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(INITIAL_ENQUIRIES);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>(INITIAL_WHATSAPP_LOGS);
  const [templates, setTemplates] = useState<MessageTemplate[]>(INITIAL_TEMPLATES);
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);
  const [activities, setActivities] = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [settings, setSettings] = useState<GymSettings>(INITIAL_SETTINGS);

  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize today's mock attendance if empty
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    // Create initial mock attendance for today: 86 present members out of 128
    const mockTodayAttendance: AttendanceRecord[] = INITIAL_MEMBERS.map((m, idx) => ({
      id: `att_${m.id}_${todayStr}`,
      memberId: m.id,
      memberName: m.name,
      date: todayStr,
      status: idx < 6 ? 'Present' : 'Absent',
      checkInTime: idx < 6 ? `06:${15 + idx * 5} AM` : undefined
    }));
    setAttendance(mockTodayAttendance);

    // Try loading from localStorage
    try {
      const savedUser = localStorage.getItem('agaran_gym_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.members) setMembers(parsed.members);
        if (parsed.plans) setPlans(parsed.plans);
        if (parsed.payments) setPayments(parsed.payments);
        if (parsed.enquiries) setEnquiries(parsed.enquiries);
        if (parsed.whatsappMessages) setWhatsappMessages(parsed.whatsappMessages);
        if (parsed.templates) setTemplates(parsed.templates);
        if (parsed.automations) setAutomations(parsed.automations);
        if (parsed.settings) setSettings(parsed.settings);
      }
    } catch (e) {
      console.error('Failed to load local state', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        members,
        plans,
        payments,
        enquiries,
        whatsappMessages,
        templates,
        automations,
        settings
      }));
    } catch (e) {
      console.error('Failed to save local state', e);
    }
  }, [members, plans, payments, enquiries, whatsappMessages, templates, automations, settings, isLoaded]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  // Auth
  const login = (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'admin@gmail.com' && pass === 'admin@123') {
      const user = INITIAL_USERS[0];
      setCurrentUser(user);
      localStorage.setItem('agaran_gym_user', JSON.stringify(user));
      showToast('Welcome back, Admin!');
      return { success: true, role: user.role };
    }
    if (cleanEmail === 'staff@gmail.com' && pass === 'staff@123') {
      const user = INITIAL_USERS[1];
      setCurrentUser(user);
      localStorage.setItem('agaran_gym_user', JSON.stringify(user));
      showToast('Welcome back, Staff!');
      return { success: true, role: user.role };
    }
    return { success: false, error: 'Invalid email or password. Use demo login hints below.' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('agaran_gym_user');
    showToast('Logged out successfully', 'info');
  };

  // Add Member
  const addMember = (memberData: Omit<Member, 'id'>) => {
    const newId = `mem_${Date.now()}`;
    const newMember: Member = {
      ...memberData,
      id: newId
    };
    setMembers((prev) => [newMember, ...prev]);

    // Add activity
    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: `${newMember.name} joined as a new member`,
        subtitle: `${newMember.currentMembership?.planName || 'No plan'} assigned`,
        timestamp: 'Just now',
        type: 'join'
      },
      ...prev
    ]);

    showToast('Member added successfully!');
    return newMember;
  };

  // Update Member
  const updateMember = (id: string, memberData: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...memberData } : m))
    );
    showToast('Member profile updated');
  };

  // Renew Membership
  const renewMembership = (memberId: string, planId: string, customPrice?: number) => {
    const member = members.find((m) => m.id === memberId);
    const plan = plans.find((p) => p.id === planId);
    if (!member || !plan) return;

    const startDate = new Date().toISOString().split('T')[0];
    const expiryDateObj = new Date();
    expiryDateObj.setDate(expiryDateObj.getDate() + plan.durationDays);
    const expiryDate = expiryDateObj.toISOString().split('T')[0];

    const price = customPrice ?? plan.price;

    const updatedMembership = {
      id: `mship_${Date.now()}`,
      planId: plan.id,
      planName: plan.name,
      price,
      startDate,
      expiryDate,
      status: 'Active' as const
    };

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, currentMembership: updatedMembership } : m))
    );

    // Record auto payment entry
    recordPayment({
      memberId,
      amount: price,
      purpose: `${plan.name} Renewal`,
      paymentMethod: 'UPI',
      notes: 'Renewal transaction'
    });

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: `${member.name} renewed membership`,
        subtitle: `${plan.name} — ₹${price}`,
        timestamp: 'Just now',
        type: 'renewal',
        amount: price
      },
      ...prev
    ]);

    showToast(`Membership renewed for ${member.name}!`);
  };

  // Plans Management
  const addPlan = (planData: Omit<MembershipPlan, 'id'>) => {
    const newPlan: MembershipPlan = {
      ...planData,
      id: `plan_${Date.now()}`
    };
    setPlans((prev) => [...prev, newPlan]);
    showToast('New membership plan created!');
  };

  const updatePlan = (id: string, planData: Partial<MembershipPlan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...planData } : p)));
    showToast('Plan updated successfully');
  };

  const togglePlanStatus = (id: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    showToast('Plan status changed');
  };

  // Record Payment
  const recordPayment = (paymentData: {
    memberId: string;
    amount: number;
    purpose: string;
    paymentMethod: PaymentMethod;
    notes?: string;
  }) => {
    const member = members.find((m) => m.id === paymentData.memberId);
    const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      memberId: paymentData.memberId,
      memberName: member?.name || 'Unknown Member',
      memberPhone: member?.phone || '',
      amount: paymentData.amount,
      purpose: paymentData.purpose,
      paymentMethod: paymentData.paymentMethod,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      invoiceNo,
      notes: paymentData.notes
    };

    setPayments((prev) => [newPayment, ...prev]);

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: `Payment received from ${newPayment.memberName}`,
        subtitle: `₹${newPayment.amount} via ${newPayment.paymentMethod}`,
        timestamp: 'Just now',
        type: 'payment',
        amount: newPayment.amount
      },
      ...prev
    ]);

    showToast(`Payment of ₹${newPayment.amount} recorded!`);
    return newPayment;
  };

  // Attendance
  const markAttendance = (memberId: string, date: string, status: AttendanceStatus) => {
    const member = members.find((m) => m.id === memberId);
    const checkInTime = status === 'Present' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined;

    setAttendance((prev) => {
      const existingIdx = prev.findIndex((a) => a.memberId === memberId && a.date === date);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], status, checkInTime };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `att_${memberId}_${date}`,
            memberId,
            memberName: member?.name || 'Member',
            date,
            status,
            checkInTime
          }
        ];
      }
    });

    showToast(`Marked ${member?.name} as ${status}`);
  };

  // Enquiries
  const addEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq_${Date.now()}`,
      date: today
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    showToast('New enquiry recorded!');
    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status } : e))
    );
    showToast(`Enquiry status updated to ${status}`);
  };

  const convertEnquiryToMember = (enquiryId: string, planId: string) => {
    const enquiry = enquiries.find((e) => e.id === enquiryId);
    const plan = plans.find((p) => p.id === planId);
    if (!enquiry || !plan) return;

    const startDate = new Date().toISOString().split('T')[0];
    const expiryDateObj = new Date();
    expiryDateObj.setDate(expiryDateObj.getDate() + plan.durationDays);
    const expiryDate = expiryDateObj.toISOString().split('T')[0];

    const newMemberData: Omit<Member, 'id'> = {
      name: enquiry.name,
      phone: enquiry.phone,
      email: enquiry.email || `${enquiry.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      gender: 'Male',
      dob: '2000-01-01',
      address: 'Address not provided',
      emergencyContact: enquiry.phone,
      joiningDate: startDate,
      notes: `Converted from enquiry (${enquiry.source}). ${enquiry.notes || ''}`,
      currentMembership: {
        id: `mship_${Date.now()}`,
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        startDate,
        expiryDate,
        status: 'Active'
      }
    };

    addMember(newMemberData);
    updateEnquiryStatus(enquiryId, 'Joined');
    showToast(`${enquiry.name} converted to Member successfully!`);
  };

  // WhatsApp
  const sendWhatsAppMessage = (memberId: string, templateId: string, customText?: string) => {
    const member = members.find((m) => m.id === memberId);
    const template = templates.find((t) => t.id === templateId);

    let messageText = customText || template?.content || 'Hello from Agaran Fitness';

    if (member) {
      messageText = messageText
        .replace(/\[Customer Name\]/g, member.name)
        .replace(/\[Gym Name\]/g, settings.gymName)
        .replace(/\[Plan Name\]/g, member.currentMembership?.planName || 'Membership')
        .replace(/\[Amount\]/g, member.currentMembership?.price.toString() || '0')
        .replace(/\[Expiry Date\]/g, member.currentMembership?.expiryDate || 'N/A')
        .replace(/\[Days Remaining\]/g, '3');
    }

    const newLog: WhatsAppMessage = {
      id: `msg_${Date.now()}`,
      recipientName: member?.name || 'Customer',
      recipientPhone: member?.phone || '+91 98765 00000',
      templateName: template?.name || 'Custom Message',
      messageText,
      sentAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Sent'
    };

    setWhatsappMessages((prev) => [newLog, ...prev]);

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        title: `WhatsApp sent to ${newLog.recipientName}`,
        subtitle: `Template: ${newLog.templateName}`,
        timestamp: 'Just now',
        type: 'whatsapp'
      },
      ...prev
    ]);

    showToast('WhatsApp message sent successfully!');
  };

  const saveTemplate = (template: MessageTemplate) => {
    setTemplates((prev) => {
      const idx = prev.findIndex((t) => t.id === template.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = template;
        return copy;
      }
      return [...prev, template];
    });
    showToast('Template saved successfully!');
  };

  // Automations
  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === 'Active' ? 'Paused' : 'Active' } : a
      )
    );
    showToast('Automation status toggled');
  };

  // Settings
  const updateSettings = (newSettings: Partial<GymSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings saved successfully!');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,

        members,
        plans,
        payments,
        attendance,
        enquiries,
        whatsappMessages,
        templates,
        automations,
        activities,
        settings,

        toast,
        showToast,
        hideToast,

        addMember,
        updateMember,
        renewMembership,
        addPlan,
        updatePlan,
        togglePlanStatus,
        recordPayment,
        markAttendance,
        addEnquiry,
        updateEnquiryStatus,
        convertEnquiryToMember,
        sendWhatsAppMessage,
        saveTemplate,
        toggleAutomation,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
