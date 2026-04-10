import { Case, User, Volunteer, AnalyticsData, CaseStatus, UserRole } from './types';
import { MOCK_CASES, MOCK_USERS, MOCK_VOLUNTEERS, MOCK_ANALYTICS } from './mock-data';

const STORAGE_KEYS = {
  CASES: 'sevagrid_cases',
  USERS: 'sevagrid_users',
  VOLUNTEERS: 'sevagrid_volunteers',
  CURRENT_USER: 'sevagrid_current_user'
};

class MockService {
  private isInitialized = false;

  private init() {
    if (this.isInitialized) return;
    
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem(STORAGE_KEYS.CASES)) {
        localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(MOCK_CASES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
      }
      if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEERS)) {
        localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(MOCK_VOLUNTEERS));
      }
      this.isInitialized = true;
    }
  }

  private async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // --- Auth ---
  async login(email: string, role?: UserRole): Promise<User | null> {
    this.init();
    await this.delay();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user = users.find((u: User) => u.email === email && (!role || u.role === role));
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return user;
    }
    return null;
  }

  async logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  async getCurrentUser(): Promise<User | null> {
    this.init();
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  }

  // --- Cases ---
  async getCases(): Promise<Case[]> {
    this.init();
    await this.delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES) || '[]');
  }

  async getCaseById(id: string): Promise<Case | undefined> {
    this.init();
    await this.delay();
    const cases = await this.getCases();
    return cases.find(c => c.id === id);
  }

  async createCase(newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt' | 'history'>): Promise<Case> {
    this.init();
    await this.delay(800);
    const cases = await this.getCases();
    const createdCase: Case = {
      ...newCase,
      id: `case-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [
        {
          id: `h-${Date.now()}`,
          timestamp: new Date().toISOString(),
          status: newCase.status,
          actorId: newCase.fieldStaffId,
          actorName: 'Current User', // Simplified for demo
        }
      ]
    };
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify([createdCase, ...cases]));
    return createdCase;
  }

  async updateCaseStatus(caseId: string, status: CaseStatus, actor: User, note?: string): Promise<Case> {
    this.init();
    await this.delay();
    const cases = await this.getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) throw new Error('Case not found');

    const updatedCase = { ...cases[caseIndex] };
    updatedCase.status = status;
    updatedCase.updatedAt = new Date().toISOString();
    updatedCase.history.push({
      id: `h-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status,
      actorId: actor.id,
      actorName: actor.name,
      note
    });

    cases[caseIndex] = updatedCase;
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    return updatedCase;
  }

  async assignVolunteer(caseId: string, volunteerId: string, admin: User): Promise<Case> {
    this.init();
    await this.delay();
    const cases = await this.getCases();
    const caseIndex = cases.findIndex(c => c.id === caseId);
    if (caseIndex === -1) throw new Error('Case not found');

    const updatedCase = { ...cases[caseIndex] };
    updatedCase.status = 'ASSIGNED';
    updatedCase.assignedVolunteerId = volunteerId;
    updatedCase.updatedAt = new Date().toISOString();
    updatedCase.history.push({
      id: `h-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'ASSIGNED',
      actorId: admin.id,
      actorName: admin.name,
      note: `Assigned to ${volunteerId}`
    });

    cases[caseIndex] = updatedCase;
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
    return updatedCase;
  }

  // --- Volunteers ---
  async getVolunteers(): Promise<Volunteer[]> {
    this.init();
    await this.delay();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VOLUNTEERS) || '[]');
  }

  // --- Analytics ---
  async getAnalytics(): Promise<AnalyticsData> {
    await this.delay();
    // In a real app, we would calculate this from live data
    return MOCK_ANALYTICS;
  }
}

export const mockService = new MockService();
