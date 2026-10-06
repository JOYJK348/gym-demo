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
  GymSettings 
} from '@/types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Admin Owner',
    email: 'admin@gmail.com',
    role: 'OWNER',
    phone: '+91 98765 00001'
  },
  {
    id: 'usr_staff',
    name: 'Staff Frontdesk',
    email: 'staff@gmail.com',
    role: 'STAFF',
    phone: '+91 98765 00002'
  }
];

export const INITIAL_PLANS: MembershipPlan[] = [
  {
    id: 'plan_monthly',
    name: 'Monthly Plan',
    price: 1500,
    durationDays: 30,
    description: 'Full access to gym facilities & cardio zone for 1 month.',
    isActive: true,
    tag: 'Popular'
  },
  {
    id: 'plan_quarterly',
    name: 'Quarterly Plan',
    price: 4000,
    durationDays: 90,
    description: '3 months full access + 1 free fitness assessment session.',
    isActive: true
  },
  {
    id: 'plan_halfyearly',
    name: 'Half Yearly Plan',
    price: 7000,
    durationDays: 180,
    description: '6 months access + free locker facility & diet guidance.',
    isActive: true
  },
  {
    id: 'plan_yearly',
    name: 'Yearly VIP Plan',
    price: 12000,
    durationDays: 365,
    description: 'Best value! 12 months full access + steam room & personal trainer consultation.',
    isActive: true,
    tag: 'Best Value'
  },
  {
    id: 'plan_student',
    name: 'Student Special',
    price: 1000,
    durationDays: 30,
    description: 'Discounted monthly membership with valid college ID.',
    isActive: true
  },
  {
    id: 'plan_pt',
    name: 'Personal Training (10 Sessions)',
    price: 8000,
    durationDays: 30,
    description: '1-on-1 personalized trainer sessions for targeted fitness goals.',
    isActive: true
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem_1',
    name: 'Raj Kumar',
    phone: '+91 98765 43210',
    email: 'raj.kumar@gmail.com',
    gender: 'Male',
    dob: '1995-04-12',
    address: 'No. 42, Anna Nagar West, Chennai',
    emergencyContact: '+91 98765 43211 (Brother)',
    joiningDate: '2025-10-01',
    notes: 'Focuses on weight training and hypertrophy. Prefers morning 6 AM batch.',
    currentMembership: {
      id: 'mship_1',
      planId: 'plan_monthly',
      planName: 'Monthly Plan',
      price: 1500,
      startDate: '2026-10-01',
      expiryDate: '2026-10-08', // Expires in 2 days from Oct 6 2026
      status: 'Expiring Soon'
    }
  },
  {
    id: 'mem_2',
    name: 'Priya S',
    phone: '+91 98765 12345',
    email: 'priya.s@gmail.com',
    gender: 'Female',
    dob: '1998-08-22',
    address: '15th Cross St, T. Nagar, Chennai',
    emergencyContact: '+91 98765 12346 (Father)',
    joiningDate: '2026-04-10',
    notes: 'Zumba and Cardio regular. Evening 6 PM batch.',
    currentMembership: {
      id: 'mship_2',
      planId: 'plan_quarterly',
      planName: 'Quarterly Plan',
      price: 4000,
      startDate: '2026-07-10',
      expiryDate: '2026-10-09', // Expires in 3 days
      status: 'Expiring Soon'
    }
  },
  {
    id: 'mem_3',
    name: 'Arun Kumar',
    phone: '+91 98765 99887',
    email: 'arun.k@gmail.com',
    gender: 'Male',
    dob: '1992-11-05',
    address: '88, Velachery Main Rd, Chennai',
    emergencyContact: '+91 98765 99888 (Wife)',
    joiningDate: '2026-01-15',
    notes: 'Goal is fat loss and stamina building.',
    currentMembership: {
      id: 'mship_3',
      planId: 'plan_yearly',
      planName: 'Yearly VIP Plan',
      price: 12000,
      startDate: '2025-10-11',
      expiryDate: '2026-10-11', // Expires in 5 days
      status: 'Expiring Soon'
    }
  },
  {
    id: 'mem_4',
    name: 'Karthik V',
    phone: '+91 98765 55443',
    email: 'karthik.v@gmail.com',
    gender: 'Male',
    dob: '1996-02-18',
    address: 'Plot 12, Adyar, Chennai',
    emergencyContact: '+91 98765 55444 (Mother)',
    joiningDate: '2026-09-01',
    notes: 'Pending balance ₹1,500 for current renewal.',
    currentMembership: {
      id: 'mship_4',
      planId: 'plan_monthly',
      planName: 'Monthly Plan',
      price: 1500,
      startDate: '2026-09-01',
      expiryDate: '2026-10-01',
      status: 'Expired'
    }
  },
  {
    id: 'mem_5',
    name: 'Suresh R',
    phone: '+91 98765 33221',
    email: 'suresh.r@gmail.com',
    gender: 'Male',
    dob: '1990-06-30',
    address: '24, OMR Kottivakkam, Chennai',
    emergencyContact: '+91 98765 33222 (Self)',
    joiningDate: '2026-08-15',
    notes: 'Pending payment ₹999.',
    currentMembership: {
      id: 'mship_5',
      planId: 'plan_student',
      planName: 'Student Special',
      price: 1000,
      startDate: '2026-08-15',
      expiryDate: '2026-09-15',
      status: 'Expired'
    }
  },
  {
    id: 'mem_6',
    name: 'Divya M',
    phone: '+91 98765 77665',
    email: 'divya.m@gmail.com',
    gender: 'Female',
    dob: '2001-12-14',
    address: '5th Main Rd, Nungambakkam, Chennai',
    emergencyContact: '+91 98765 77666 (Mother)',
    joiningDate: '2026-06-01',
    notes: 'Active member. Very consistent attendance.',
    currentMembership: {
      id: 'mship_6',
      planId: 'plan_halfyearly',
      planName: 'Half Yearly Plan',
      price: 7000,
      startDate: '2026-06-01',
      expiryDate: '2026-12-01',
      status: 'Active'
    }
  },
  {
    id: 'mem_7',
    name: 'Manoj P',
    phone: '+91 98765 11223',
    email: 'manoj.p@gmail.com',
    gender: 'Male',
    dob: '1997-03-25',
    address: '33, Porur, Chennai',
    emergencyContact: '+91 98765 11224 (Father)',
    joiningDate: '2026-07-20',
    notes: 'Active member taking PT sessions.',
    currentMembership: {
      id: 'mship_7',
      planId: 'plan_yearly',
      planName: 'Yearly VIP Plan',
      price: 12000,
      startDate: '2026-07-20',
      expiryDate: '2027-07-20',
      status: 'Active'
    }
  },
  {
    id: 'mem_8',
    name: 'Anitha Lakshmi',
    phone: '+91 98765 66778',
    email: 'anitha.l@gmail.com',
    gender: 'Female',
    dob: '1999-09-09',
    address: '9, Mylapore, Chennai',
    emergencyContact: '+91 98765 66779 (Sister)',
    joiningDate: '2026-05-15',
    notes: 'Joined after free trial.',
    currentMembership: {
      id: 'mship_8',
      planId: 'plan_quarterly',
      planName: 'Quarterly Plan',
      price: 4000,
      startDate: '2026-08-01',
      expiryDate: '2026-11-01',
      status: 'Active'
    }
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    memberId: 'mem_1',
    memberName: 'Raj Kumar',
    memberPhone: '+91 98765 43210',
    amount: 1500,
    purpose: 'Monthly Renewal',
    paymentMethod: 'UPI',
    date: '2026-10-06',
    status: 'Completed',
    invoiceNo: 'INV-2026-1001',
    notes: 'GPay reference #99283741'
  },
  {
    id: 'pay_2',
    memberId: 'mem_6',
    memberName: 'Divya M',
    memberPhone: '+91 98765 77665',
    amount: 7000,
    purpose: 'Half Yearly Plan',
    paymentMethod: 'Card',
    date: '2026-10-05',
    status: 'Completed',
    invoiceNo: 'INV-2026-1002',
    notes: 'HDFC Card Swipe'
  },
  {
    id: 'pay_3',
    memberId: 'mem_3',
    memberName: 'Arun Kumar',
    memberPhone: '+91 98765 99887',
    amount: 12000,
    purpose: 'Yearly VIP Plan Renewal',
    paymentMethod: 'Cash',
    date: '2026-10-04',
    status: 'Completed',
    invoiceNo: 'INV-2026-1003',
    notes: 'Handed cash at front desk'
  },
  {
    id: 'pay_4',
    memberId: 'mem_4',
    memberName: 'Karthik V',
    memberPhone: '+91 98765 55443',
    amount: 1500,
    purpose: 'Monthly Plan Renewal',
    paymentMethod: 'UPI',
    date: '2026-10-02',
    status: 'Pending',
    invoiceNo: 'INV-2026-1004',
    notes: 'Payment link sent, pending confirmation'
  },
  {
    id: 'pay_5',
    memberId: 'mem_5',
    memberName: 'Suresh R',
    memberPhone: '+91 98765 33221',
    amount: 999,
    purpose: 'Student Plan Renewal Balance',
    paymentMethod: 'Cash',
    date: '2026-10-01',
    status: 'Pending',
    invoiceNo: 'INV-2026-1005',
    notes: 'Promised to clear by weekend'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq_1',
    name: 'Vignesh K',
    phone: '+91 98765 88990',
    email: 'vignesh.k@gmail.com',
    source: 'Instagram',
    interestedPlanName: 'Monthly Plan',
    status: 'Trial',
    date: '2026-10-04',
    trialStartDate: '2026-10-05',
    trialEndDate: '2026-10-07',
    notes: 'Attended free trial session yesterday. Very positive feedback.'
  },
  {
    id: 'enq_2',
    name: 'Santhosh M',
    phone: '+91 98765 44332',
    email: 'santhosh.m@gmail.com',
    source: 'Walk-in',
    interestedPlanName: 'Quarterly Plan',
    status: 'New',
    date: '2026-10-06',
    notes: 'Visited during morning hours. Asked about weight loss training.'
  },
  {
    id: 'enq_3',
    name: 'Deepa Raj',
    phone: '+91 98765 22110',
    email: 'deepa.r@gmail.com',
    source: 'WhatsApp',
    interestedPlanName: 'Personal Training (10 Sessions)',
    status: 'Contacted',
    date: '2026-10-05',
    notes: 'Inquired about personal trainer availability in evening slot.'
  },
  {
    id: 'enq_4',
    name: 'Rahul Sharma',
    phone: '+91 98765 00998',
    email: 'rahul.s@gmail.com',
    source: 'Google',
    interestedPlanName: 'Yearly VIP Plan',
    status: 'New',
    date: '2026-10-06',
    notes: 'Filled contact form on website.'
  },
  {
    id: 'enq_5',
    name: 'Bhavani S',
    phone: '+91 98765 77112',
    source: 'Referral',
    interestedPlanName: 'Student Special',
    status: 'Contacted',
    date: '2026-10-03',
    notes: 'Referred by Divya M.'
  }
];

export const INITIAL_TEMPLATES: MessageTemplate[] = [
  {
    id: 'tpl_welcome',
    name: 'Welcome Message',
    category: 'WELCOME',
    content: 'Hi [Customer Name] 👋\n\nWelcome to [Gym Name]! Your membership ([Plan Name]) has been successfully activated.\n\nWe are excited to help you achieve your fitness goals! See you at the gym. 💪'
  },
  {
    id: 'tpl_payment',
    name: 'Payment Confirmation',
    category: 'PAYMENT',
    content: 'Hi [Customer Name] 👋\n\nWe received your payment of ₹[Amount] successfully for [Plan Name].\nInvoice #: [Invoice No]\n\nThank you for choosing [Gym Name]!'
  },
  {
    id: 'tpl_renewal',
    name: 'Renewal Reminder',
    category: 'RENEWAL',
    content: 'Hi [Customer Name] 👋\n\nYour [Plan Name] membership at [Gym Name] expires in [Days Remaining] days (on [Expiry Date]).\n\nRenew now to continue your training without interruption. 💪'
  },
  {
    id: 'tpl_expiry',
    name: 'Expiry Notice',
    category: 'EXPIRY',
    content: 'Hi [Customer Name],\n\nYour gym membership at [Gym Name] has expired.\n\nPlease contact frontdesk or reply to this message to renew your membership and get back to your workout routine!'
  },
  {
    id: 'tpl_trial',
    name: 'Trial Follow-up',
    category: 'TRIAL',
    content: 'Hi [Customer Name] 👋\n\nHope you enjoyed your free trial workout at [Gym Name]!\n\nJoin today and get an exclusive 10% discount on your first membership. Let us know if you have any questions!'
  }
];

export const INITIAL_WHATSAPP_LOGS: WhatsAppMessage[] = [
  {
    id: 'msg_1',
    recipientName: 'Raj Kumar',
    recipientPhone: '+91 98765 43210',
    templateName: 'Renewal Reminder',
    messageText: 'Hi Raj Kumar 👋 Your Monthly Plan membership at Agaran Fitness expires in 2 days. Renew now to continue your training without interruption. 💪',
    sentAt: '2026-10-06 09:30 AM',
    status: 'Delivered'
  },
  {
    id: 'msg_2',
    recipientName: 'Priya S',
    recipientPhone: '+91 98765 12345',
    templateName: 'Payment Confirmation',
    messageText: 'Hi Priya S 👋 We received your payment of ₹4000 successfully for Quarterly Plan. Invoice #: INV-2026-0980. Thank you for choosing Agaran Fitness!',
    sentAt: '2026-10-05 04:15 PM',
    status: 'Delivered'
  },
  {
    id: 'msg_3',
    recipientName: 'Vignesh K',
    recipientPhone: '+91 98765 88990',
    templateName: 'Trial Follow-up',
    messageText: 'Hi Vignesh K 👋 Hope you enjoyed your free trial workout at Agaran Fitness! Join today and get an exclusive discount.',
    sentAt: '2026-10-05 11:00 AM',
    status: 'Sent'
  }
];

export const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: 'auto_1',
    title: 'Membership Renewal Reminder',
    description: 'Automated 2-step WhatsApp sequence sent prior to membership expiration.',
    trigger: 'Membership Expiring',
    status: 'Active',
    executionCount: 142,
    steps: [
      {
        id: 'step_1',
        type: 'TRIGGER',
        title: 'Trigger: Membership expiring in 7 days',
        description: 'Fires when any member is 7 days away from expiry date',
        config: { daysBefore: 7 }
      },
      {
        id: 'step_2',
        type: 'CONDITION',
        title: 'Condition: Membership not renewed',
        description: 'Checks if member has not already paid for next period',
        config: { field: 'status', operator: 'equals', value: 'Expiring Soon' }
      },
      {
        id: 'step_3',
        type: 'ACTION',
        title: 'Action: Send WhatsApp Renewal Template',
        description: 'Sends Template: Renewal Reminder via WhatsApp',
        config: { templateId: 'tpl_renewal' }
      },
      {
        id: 'step_4',
        type: 'WAIT',
        title: 'Wait: 4 days',
        description: 'Waits 4 days before checking status again',
        config: { durationDays: 4 }
      },
      {
        id: 'step_5',
        type: 'ACTION',
        title: 'Action: Send Final Expiry Warning',
        description: 'Sends urgent renewal message if still unrenewed',
        config: { templateId: 'tpl_expiry' }
      }
    ]
  },
  {
    id: 'auto_2',
    title: 'New Enquiry Welcome Sequence',
    description: 'Instantly sends welcome WhatsApp & assigns staff follow-up tag when a lead registers.',
    trigger: 'New Enquiry',
    status: 'Active',
    executionCount: 58,
    steps: [
      {
        id: 'step_21',
        type: 'TRIGGER',
        title: 'Trigger: New Enquiry Created',
        description: 'Fires immediately on new lead creation',
        config: {}
      },
      {
        id: 'step_22',
        type: 'ACTION',
        title: 'Action: Send WhatsApp Trial Follow-up',
        description: 'Sends greeting & invitation for free trial session',
        config: { templateId: 'tpl_trial' }
      }
    ]
  }
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_1',
    title: 'Raj Kumar renewed membership',
    subtitle: 'Monthly Plan — ₹1,500 via UPI',
    timestamp: '10 mins ago',
    type: 'renewal',
    amount: 1500
  },
  {
    id: 'act_2',
    title: 'Priya S joined Gold Membership',
    subtitle: 'Quarterly Plan activated',
    timestamp: '1 hour ago',
    type: 'join'
  },
  {
    id: 'act_3',
    title: 'Payment received from Arun Kumar',
    subtitle: '₹12,000 via Cash (Yearly VIP)',
    timestamp: '2 hours ago',
    type: 'payment',
    amount: 12000
  },
  {
    id: 'act_4',
    title: 'New enquiry from Vignesh K',
    subtitle: 'Source: Instagram • Interested in Monthly Plan',
    timestamp: '3 hours ago',
    type: 'enquiry'
  },
  {
    id: 'act_5',
    title: 'WhatsApp renewal reminder sent',
    subtitle: 'Sent to 3 members expiring this week',
    timestamp: '4 hours ago',
    type: 'whatsapp'
  }
];

export const INITIAL_SETTINGS: GymSettings = {
  gymName: 'Agaran Fitness',
  logoUrl: '',
  phone: '+91 98765 00000',
  email: 'contact@agaranfitness.com',
  address: '100 Feet Road, Vadapalani, Chennai, Tamil Nadu 600026',
  website: 'https://agaranfitness.com',
  instagram: '@agaranfitness_official',
  facebook: 'agaranfitness',
  businessHours: 'Mon - Sat: 5:30 AM - 10:00 PM | Sun: 6:00 AM - 1:00 PM',
  whatsAppConnected: true,
  whatsAppNumber: '+91 98765 00000',
  staffAccountEmail: 'staff@gmail.com'
};
