import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'institution';
  createdAt: string;
}

export interface TrustedContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  contact: string;
  enabled: boolean;
}

export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  zone: string;
}

export interface RouteSegment {
  id: string;
  routeId: string;
  name: string;
  distance: number;
  safetyScore: number;
  lightingScore: number;
  crowdScore: number;
  incidentRisk: number;
  isolationRisk: number;
}

export interface Route {
  id: string;
  origin: Location;
  destination: Location;
  distance: number;
  eta: number;
  routeType: 'fastest' | 'safest' | 'balanced';
  safeScore: number;
  segments: RouteSegment[];
  incidents: number;
  lightingQuality: number;
  crowdLevel: number;
  explanation: string;
  warnings: string[];
}

export interface SafetyEvent {
  id: string;
  type: 'incident' | 'risk_increase' | 'deviation' | 'low_activity' | 'emergency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: { lat: number; lng: number; address: string };
  timestamp: string;
  description: string;
  active: boolean;
}

export interface Journey {
  id: string;
  userId: string;
  routeId: string;
  status: 'active' | 'completed' | 'cancelled' | 'emergency';
  startedAt: string;
  completedAt?: string;
  currentSafeScore: number;
  events: SafetyEvent[];
}

export interface SOSIncident {
  id: string;
  journeyId: string;
  userId: string;
  timestamp: string;
  location: { lat: number; lng: number; address: string };
  status: 'active' | 'resolved';
}

export interface SafeZone {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'metro' | 'mall' | 'campus' | 'public';
  location: { lat: number; lng: number; address: string };
}

export interface Institution {
  id: string;
  name: string;
  type: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface InstitutionalIncident {
  id: string;
  institutionId: string;
  location: { lat: number; lng: number; address: string };
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
  description: string;
}

// ============================================================
// IN-MEMORY STORE
// ============================================================

const demoPasswordHash = bcrypt.hashSync('demo1234', 10);
const institutionPasswordHash = bcrypt.hashSync('admin1234', 10);

export const db = {
  users: [
    {
      id: 'user-demo',
      name: 'Priya Sharma',
      email: 'demo@safesphere.ai',
      passwordHash: demoPasswordHash,
      role: 'user',
      createdAt: '2024-11-01T08:00:00Z',
    },
    {
      id: 'user-2',
      name: 'Ananya Gupta',
      email: 'ananya@gtbit.edu.in',
      passwordHash: bcrypt.hashSync('pass1234', 10),
      role: 'user',
      createdAt: '2024-11-15T09:30:00Z',
    },
    {
      id: 'user-3',
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      passwordHash: bcrypt.hashSync('pass1234', 10),
      role: 'user',
      createdAt: '2024-12-01T10:00:00Z',
    },
  ] as User[],

  trustedContacts: [
    { id: 'tc-1', userId: 'user-demo', name: 'Mom', relationship: 'Mother', contact: '+91 98765 43210', enabled: true },
    { id: 'tc-2', userId: 'user-demo', name: 'Bhai', relationship: 'Brother', contact: '+91 87654 32109', enabled: true },
    { id: 'tc-3', userId: 'user-demo', name: 'Riya (Friend)', relationship: 'Friend', contact: '+91 76543 21098', enabled: false },
  ] as TrustedContact[],

  journeys: [] as Journey[],
  sosIncidents: [] as SOSIncident[],

  safetyEvents: [
    {
      id: 'evt-hist-1',
      type: 'incident',
      severity: 'medium',
      location: { lat: 28.6338, lng: 77.2190, address: 'Near Paharganj Market' },
      timestamp: '2025-01-10T22:15:00Z',
      description: 'Reported suspicious activity near market area after hours',
      active: false,
    },
    {
      id: 'evt-hist-2',
      type: 'incident',
      severity: 'low',
      location: { lat: 28.6562, lng: 77.2410, address: 'Civil Lines Metro Station' },
      timestamp: '2025-01-15T21:00:00Z',
      description: 'Minor altercation resolved, area secure',
      active: false,
    },
    {
      id: 'evt-hist-3',
      type: 'risk_increase',
      severity: 'high',
      location: { lat: 28.6495, lng: 77.2200, address: 'Near Old Delhi Railway Station' },
      timestamp: '2025-01-20T23:30:00Z',
      description: 'Elevated risk in area due to large crowd dispersal',
      active: false,
    },
    {
      id: 'evt-hist-4',
      type: 'incident',
      severity: 'medium',
      location: { lat: 28.5355, lng: 77.3910, address: 'Sector 18, Noida' },
      timestamp: '2025-02-05T20:00:00Z',
      description: 'Theft reported in commercial area',
      active: false,
    },
    {
      id: 'evt-hist-5',
      type: 'low_activity',
      severity: 'low',
      location: { lat: 28.5494, lng: 77.2001, address: 'Safdarjung Area' },
      timestamp: '2025-02-12T02:00:00Z',
      description: 'Isolated stretch detected, minimal pedestrian activity',
      active: false,
    },
    {
      id: 'evt-hist-6',
      type: 'incident',
      severity: 'critical',
      location: { lat: 28.6358, lng: 77.2245, address: 'Connaught Place, Inner Circle' },
      timestamp: '2025-02-18T21:45:00Z',
      description: 'Security incident reported, authorities responded',
      active: false,
    },
    {
      id: 'evt-hist-7',
      type: 'incident',
      severity: 'medium',
      location: { lat: 28.6139, lng: 77.2090, address: 'India Gate Vicinity' },
      timestamp: '2025-03-01T22:30:00Z',
      description: 'Suspicious individuals reported near monument',
      active: false,
    },
    {
      id: 'evt-hist-8',
      type: 'risk_increase',
      severity: 'medium',
      location: { lat: 28.6469, lng: 77.0892, address: 'Rajouri Garden Market' },
      timestamp: '2025-03-08T20:00:00Z',
      description: 'Heightened risk around market closing hours',
      active: false,
    },
    {
      id: 'evt-hist-9',
      type: 'incident',
      severity: 'low',
      location: { lat: 28.4595, lng: 77.0266, address: 'Gurugram Sector 29' },
      timestamp: '2025-03-15T23:00:00Z',
      description: 'Minor incident in nightlife district',
      active: false,
    },
    {
      id: 'evt-hist-10',
      type: 'incident',
      severity: 'high',
      location: { lat: 28.6600, lng: 77.2800, address: 'Shahdara Area' },
      timestamp: '2025-03-20T21:15:00Z',
      description: 'Significant security event, area cordoned',
      active: false,
    },
    {
      id: 'evt-hist-11',
      type: 'deviation',
      severity: 'low',
      location: { lat: 28.5665, lng: 77.3210, address: 'Mayur Vihar Phase 1' },
      timestamp: '2025-04-02T22:00:00Z',
      description: 'Traveler deviation detected from recommended route',
      active: false,
    },
    {
      id: 'evt-hist-12',
      type: 'incident',
      severity: 'medium',
      location: { lat: 28.6892, lng: 77.1577, address: 'GTB Nagar Area' },
      timestamp: '2025-04-10T20:30:00Z',
      description: 'Incident near university campus, students advised caution',
      active: false,
    },
  ] as SafetyEvent[],

  safeZones: [
    { id: 'sz-1', name: 'Connaught Place Police Station', type: 'police', location: { lat: 28.6338, lng: 77.2195, address: 'Connaught Place, New Delhi' } },
    { id: 'sz-2', name: 'AIIMS Hospital', type: 'hospital', location: { lat: 28.5672, lng: 77.2100, address: 'Ansari Nagar, New Delhi' } },
    { id: 'sz-3', name: 'New Delhi Railway Station', type: 'public', location: { lat: 28.6424, lng: 77.2195, address: 'Paharganj, New Delhi' } },
    { id: 'sz-4', name: 'Rajiv Chowk Metro Station', type: 'metro', location: { lat: 28.6328, lng: 77.2197, address: 'Connaught Place, New Delhi' } },
    { id: 'sz-5', name: 'Select Citywalk Mall', type: 'mall', location: { lat: 28.5270, lng: 77.2190, address: 'Saket, New Delhi' } },
    { id: 'sz-6', name: 'GTBIT Campus', type: 'campus', location: { lat: 28.6890, lng: 77.1540, address: 'Rohini Sec-7, New Delhi' } },
    { id: 'sz-7', name: 'IGI Airport Police', type: 'police', location: { lat: 28.5562, lng: 77.1000, address: 'Terminal 3, Delhi Airport' } },
    { id: 'sz-8', name: 'Fortis Hospital Gurugram', type: 'hospital', location: { lat: 28.4525, lng: 77.0733, address: 'Sec 44, Gurugram' } },
    { id: 'sz-9', name: 'Hauz Khas Metro', type: 'metro', location: { lat: 28.5434, lng: 77.2066, address: 'Hauz Khas, New Delhi' } },
    { id: 'sz-10', name: 'DLF Cyber Hub', type: 'mall', location: { lat: 28.4951, lng: 77.0878, address: 'DLF Phase 2, Gurugram' } },
    { id: 'sz-11', name: 'Paharganj Police Station', type: 'police', location: { lat: 28.6445, lng: 77.2105, address: 'Paharganj, New Delhi' } },
    { id: 'sz-12', name: 'Safdarjung Hospital', type: 'hospital', location: { lat: 28.5688, lng: 77.2063, address: 'Safdarjung, New Delhi' } },
  ] as SafeZone[],

  institutions: [
    {
      id: 'inst-gtbit',
      name: 'GTBIT — Guru Tegh Bahadur Institute of Technology',
      type: 'University',
      email: 'admin@gtbit.edu.in',
      passwordHash: institutionPasswordHash,
      createdAt: '2024-10-01T00:00:00Z',
    },
  ] as Institution[],

  institutionalIncidents: [
    { id: 'ii-1', institutionId: 'inst-gtbit', location: { lat: 28.6490, lng: 77.1600, address: 'Near GTB Nagar Metro' }, type: 'Suspicious Activity', severity: 'medium', timestamp: '2025-01-08T21:00:00Z', status: 'resolved', description: 'Suspicious individuals loitering near main gate' },
    { id: 'ii-2', institutionId: 'inst-gtbit', location: { lat: 28.6950, lng: 77.1450, address: 'Rohini Sector 9' }, type: 'Harassment', severity: 'high', timestamp: '2025-01-22T20:30:00Z', status: 'resolved', description: 'Student reported verbal harassment while returning from library' },
    { id: 'ii-3', institutionId: 'inst-gtbit', location: { lat: 28.6880, lng: 77.1520, address: 'Main Road Outside Campus' }, type: 'Theft', severity: 'medium', timestamp: '2025-02-03T19:45:00Z', status: 'investigating', description: 'Mobile snatching incident on main road' },
    { id: 'ii-4', institutionId: 'inst-gtbit', location: { lat: 28.6820, lng: 77.1580, address: 'Pitampura Area' }, type: 'Suspicious Activity', severity: 'low', timestamp: '2025-02-14T22:00:00Z', status: 'resolved', description: 'Unidentified vehicle following students' },
    { id: 'ii-5', institutionId: 'inst-gtbit', location: { lat: 28.6910, lng: 77.1610, address: 'Sector 8 Market' }, type: 'Harassment', severity: 'medium', timestamp: '2025-02-28T20:00:00Z', status: 'investigating', description: 'Group of students harassed at local market' },
    { id: 'ii-6', institutionId: 'inst-gtbit', location: { lat: 28.6890, lng: 77.1540, address: 'Campus Periphery' }, type: 'Security Breach', severity: 'high', timestamp: '2025-03-05T23:30:00Z', status: 'resolved', description: 'Unauthorized entry attempt at campus boundary' },
    { id: 'ii-7', institutionId: 'inst-gtbit', location: { lat: 28.6840, lng: 77.1500, address: 'Rohini Sec-7 Bus Stop' }, type: 'Eve Teasing', severity: 'high', timestamp: '2025-03-18T21:15:00Z', status: 'investigating', description: 'Student reported eve teasing at bus stop' },
    { id: 'ii-8', institutionId: 'inst-gtbit', location: { lat: 28.6870, lng: 77.1560, address: 'Auto Stand near GTBIT' }, type: 'Overcharging/Dispute', severity: 'low', timestamp: '2025-03-25T20:30:00Z', status: 'resolved', description: 'Dispute with auto-rickshaw driver' },
    { id: 'ii-9', institutionId: 'inst-gtbit', location: { lat: 28.6900, lng: 77.1490, address: 'Adjacent Park' }, type: 'Suspicious Activity', severity: 'medium', timestamp: '2025-04-01T22:45:00Z', status: 'open', description: 'Groups gathering in dark area of adjacent park' },
    { id: 'ii-10', institutionId: 'inst-gtbit', location: { lat: 28.6920, lng: 77.1550, address: 'Hostel Road' }, type: 'Theft', severity: 'high', timestamp: '2025-04-08T21:00:00Z', status: 'open', description: 'Bag snatching on hostel access road' },
    { id: 'ii-11', institutionId: 'inst-gtbit', location: { lat: 28.6860, lng: 77.1510, address: 'Library Vicinity' }, type: 'Harassment', severity: 'medium', timestamp: '2025-04-15T19:30:00Z', status: 'investigating', description: 'Harassment near library access road' },
    { id: 'ii-12', institutionId: 'inst-gtbit', location: { lat: 28.6830, lng: 77.1590, address: 'Night Market Area' }, type: 'Security Incident', severity: 'critical', timestamp: '2025-04-22T23:00:00Z', status: 'open', description: 'Major security incident in the area, police notified' },
  ] as InstitutionalIncident[],
};

export default db;
