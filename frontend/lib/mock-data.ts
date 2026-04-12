import { Case, User, Volunteer, AnalyticsData } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Priya Sharma',
    email: 'admin@sevagrid.org',
    role: 'ADMIN',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    id: 'field-1',
    name: 'Amit Kumar',
    email: 'field@sevagrid.org',
    role: 'FIELD_STAFF',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit'
  },
  {
    id: 'vol-1',
    name: 'Neha Gupta',
    email: 'volunteer@sevagrid.org',
    role: 'VOLUNTEER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neha'
  }
];

export const MOCK_VOLUNTEERS: Volunteer[] = [
  {
    ...MOCK_USERS[2],
    role: 'VOLUNTEER',
    status: 'AVAILABLE',
    completedTasks: 12,
    activeTasks: 0,
    rating: 4.8,
    specialties: ['First Aid', 'Logistics', 'Driving'],
    location: 'Connaught Place'
  },
  {
    id: 'vol-2',
    name: 'Rahul Verma',
    email: 'rahul@volunteer.org',
    role: 'VOLUNTEER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
    status: 'BUSY',
    completedTasks: 25,
    activeTasks: 1,
    rating: 4.9,
    specialties: ['Food Distribution', 'Translation'],
    location: 'Andheri West'
  },
  {
    id: 'vol-3',
    name: 'Ayesha Desai',
    email: 'ayesha@volunteer.org',
    role: 'VOLUNTEER',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ayesha',
    status: 'AVAILABLE',
    completedTasks: 8,
    activeTasks: 0,
    rating: 4.7,
    specialties: ['Medical Staff', 'Elderly Care'],
    location: 'Malabar Hill'
  }
];

export const MOCK_CASES: Case[] = [
  {
    id: 'case-1',
    title: 'Emergency Water Shortage in Sector 4, HSR',
    description: 'Main water pipe burst affecting 50 households. Need immediate distribution of drinking water units.',
    category: 'Water & Sanitation',
    severity: 'URGENT',
    status: 'SUBMITTED',
    peopleAffected: 250,
    location: {
      address: '123 MG Road, Sector 4',
      area: 'Connaught Place',
    },
    fieldStaffId: 'field-1',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    history: [
      {
        id: 'h1',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'SUBMITTED',
        actorId: 'field-1',
        actorName: 'Amit Kumar',
        note: 'Reported by community leader.'
      }
    ]
  },
  {
    id: 'case-2',
    title: 'Food Supply Support for Elderly Home',
    description: 'Regular monthly supply of non-perishable food items requested for the Aashirwad Old Age Home.',
    category: 'Food Security',
    severity: 'MEDIUM',
    status: 'ASSIGNED',
    peopleAffected: 45,
    location: {
      address: '45 Link Road',
      area: 'Andheri West',
    },
    fieldStaffId: 'field-1',
    assignedVolunteerId: 'vol-2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    history: [
      {
        id: 'h2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        status: 'SUBMITTED',
        actorId: 'field-1',
        actorName: 'Amit Kumar'
      },
      {
        id: 'h3',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        status: 'READY_FOR_ASSIGNMENT',
        actorId: 'admin-1',
        actorName: 'Priya Sharma'
      },
      {
        id: 'h4',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'ASSIGNED',
        actorId: 'admin-1',
        actorName: 'Priya Sharma',
        note: 'Rahul Verma assigned to this task.'
      }
    ]
  },
  {
    id: 'case-3',
    title: 'Medical Camp Logistics Assistance',
    description: 'Upcoming medical camp in Dharavi needs assistance in setting up tents and managing patient queues.',
    category: 'Health',
    severity: 'HIGH',
    status: 'COMPLETED',
    peopleAffected: 500,
    location: {
      address: 'Dharavi, Near Mahim Station',
      area: 'Dharavi',
    },
    fieldStaffId: 'field-1',
    assignedVolunteerId: 'vol-1',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    history: [
      {
        id: 'h5',
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        status: 'SUBMITTED',
        actorId: 'field-1',
        actorName: 'Amit Kumar'
      },
      {
        id: 'h6',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'COMPLETED',
        actorId: 'vol-1',
        actorName: 'Neha Gupta'
      }
    ],
    proofOfCompletion: {
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      notes: 'All tents set up and patient overflow managed successfully.',
      attachments: ['https://images.unsplash.com/photo-1516581285268-b39910d5e2b3?w=800&auto=format&fit=crop'],
      volunteerId: 'vol-1'
    }
  }
];

export const MOCK_ANALYTICS: AnalyticsData = {
  totalCases: 156,
  urgentCases: 12,
  pendingAssignments: 34,
  completedToday: 8,
  casesByStatus: {
    'DRAFT': 5,
    'SUBMITTED': 12,
    'UNDER_REVIEW': 8,
    'READY_FOR_ASSIGNMENT': 10,
    'ASSIGNED': 15,
    'ACCEPTED': 7,
    'IN_PROGRESS': 11,
    'COMPLETED_PENDING_VERIFICATION': 4,
    'COMPLETED': 78,
    'FAILED': 2,
    'ESCALATED': 4
  },
  casesByCategory: {
    'Health': 45,
    'Food Security': 32,
    'Water & Sanitation': 28,
    'Education': 15,
    'Shelter': 20,
    'Environment': 16
  },
  casesByPriority: {
    'LOW': 40,
    'MEDIUM': 65,
    'HIGH': 39,
    'URGENT': 12
  },
  weeklyTrend: [
    { day: 'Mon', count: 12 },
    { day: 'Tue', count: 18 },
    { day: 'Wed', count: 15 },
    { day: 'Thu', count: 22 },
    { day: 'Fri', count: 30 },
    { day: 'Sat', count: 25 },
    { day: 'Sun', count: 14 }
  ]
};
