export type UserRole = 'OWNER' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

export type MembershipStatus = 'Upcoming' | 'Active' | 'Expiring Soon' | 'Expired' | 'Frozen' | 'Cancelled';

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  isActive: boolean;
  tag?: string;
}

export interface Membership {
  id: string;
  planId: string;
  planName: string;
  price: number;
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: MembershipStatus;
  autoRenew?: boolean;
}

export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  address: string;
  emergencyContact: string;
  joiningDate: string;
  notes?: string;
  currentMembership?: Membership;
  photoUrl?: string;
}

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Online';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  amount: number;
  purpose: string; // e.g. "Gold Membership - 1 Month"
  paymentMethod: PaymentMethod;
  date: string; // ISO date string or YYYY-MM-DD
  status: PaymentStatus;
  invoiceNo: string;
  notes?: string;
}

export type AttendanceStatus = 'Present' | 'Absent';

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm
  status: AttendanceStatus;
}

export type EnquirySource = 'Instagram' | 'WhatsApp' | 'Google' | 'Referral' | 'Walk-in' | 'Other';
export type EnquiryStatus = 'New' | 'Contacted' | 'Trial' | 'Joined' | 'Lost';

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: EnquirySource;
  interestedPlanId?: string;
  interestedPlanName: string;
  status: EnquiryStatus;
  date: string;
  notes?: string;
  trialStartDate?: string;
  trialEndDate?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'WELCOME' | 'PAYMENT' | 'RENEWAL' | 'EXPIRY' | 'TRIAL' | 'CUSTOM';
  content: string;
}

export interface WhatsAppMessage {
  id: string;
  recipientName: string;
  recipientPhone: string;
  templateName: string;
  messageText: string;
  sentAt: string;
  status: 'Sent' | 'Delivered' | 'Failed';
}

export type AutomationTrigger = 
  | 'New Member Created'
  | 'Payment Received'
  | 'Membership Expiring'
  | 'Membership Expired'
  | 'Trial Ending'
  | 'New Enquiry'
  | 'Membership Renewed';

export type AutomationCondition = 
  | 'Membership Status'
  | 'Payment Status'
  | 'Days Until Expiry'
  | 'Lead Status'
  | 'Plan'
  | 'Customer Tag';

export type AutomationAction = 
  | 'Send WhatsApp'
  | 'Create Follow-up'
  | 'Update Status'
  | 'Add Tag'
  | 'Send Notification';

export interface AutomationStep {
  id: string;
  type: 'TRIGGER' | 'CONDITION' | 'ACTION' | 'WAIT';
  title: string;
  description: string;
  config: Record<string, any>;
}

export interface Automation {
  id: string;
  title: string;
  description: string;
  trigger: AutomationTrigger;
  status: 'Active' | 'Paused' | 'Draft';
  steps: AutomationStep[];
  executionCount: number;
}

export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'renewal' | 'join' | 'payment' | 'enquiry' | 'whatsapp';
  amount?: number;
}

export interface GymSettings {
  gymName: string;
  logoUrl?: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  instagram: string;
  facebook: string;
  businessHours: string;
  whatsAppConnected: boolean;
  whatsAppNumber: string;
  staffAccountEmail: string;
}
