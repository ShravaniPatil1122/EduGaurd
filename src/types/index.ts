export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface ParentInfo {
  name: string;
  relation: string;
  phone: string;
  preferredLanguage: string;
  preferredChannel: 'WhatsApp' | 'SMS' | 'Email';
}

export interface StudentIndicators {
  consecutiveAbsences: number;
  gpaDrop: number; // Term drop
  missedAssignmentsRatio: number; // percentage
  pastFailures: number;
  parentEducationLevel: number; // 1 to 4
  commuteTimeMins: number;
  peerStudyHoursWeekly: number;
  disciplinaryIncidents: number;
  feeStatus: 'Paid' | 'Overdue' | 'Exempt';
  attendanceHistory: { date: string; status: 'Present' | 'Absent' | 'Late'; reason?: string }[];
  termGpaHistory: { term: string; score: number }[];
}

export interface FactorExplanation {
  feature: string;
  label: string;
  impact: 'high' | 'medium' | 'low';
  direction: 'risk' | 'protective';
  description: string;
}

export interface MLPredictionResult {
  student_id: string;
  student_name: string;
  dropout_probability_pct: number;
  risk_level: RiskLevel;
  is_model_prediction: boolean;
  contributing_factors: FactorExplanation[];
  recommended_interventions: string[];
  disclaimer: string;
}

export interface InterventionRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  type: 'Check-in & Counseling' | 'Catch-Up Study Plan' | 'Parent Meeting' | 'Peer Mentor Assignment' | 'Financial/Fee Counseling';
  status: 'Scheduled' | 'In Progress' | 'Follow-up Needed' | 'Resolved';
  notes: string;
  followUpDate: string;
  outcome?: string;
  riskScoreBefore: number;
  riskScoreAfter?: number;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  class: string;
  section: string;
  rollNo: string;
  missedClassesThisWeek: number;
  riskLevel: RiskLevel;
  riskScore: number; // percentage dropout probability
  improving: boolean;
  avgScore: number;
  attendanceRate: number;
  subjects: string[];
  parent: ParentInfo;
  bio?: string;
  distanceKm?: number;
  coordinates?: [number, number];
  indicators?: StudentIndicators;
  prediction?: MLPredictionResult;
}

export interface DailyTopicCardData {
  id: string;
  class: string;
  section: string;
  subject: string;
  status: 'Live' | 'Upcoming' | 'Completed';
  topics: string[];
  importantConcepts: string;
  assignment: string;
}

export interface CatchUpResourceTask {
  id: string;
  type: 'video' | 'notes' | 'practice' | 'quiz';
  title: string;
  durationOrDetails?: string;
  completed: boolean;
  linkText?: string;
}

export interface MissedClassSubject {
  id: string;
  subject: string;
  date: string;
  topicTitle: string;
  tasks: CatchUpResourceTask[];
}

export interface SupportPlanTask {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  completed: boolean;
  resourceLabel: string;
}

export interface SupportPlan {
  id: string;
  studentId: string;
  subject: string;
  overview: string;
  tasks: SupportPlanTask[];
  completed: boolean;
  lastUpdated: string;
}

export interface PeerClassmate {
  id: string;
  name: string;
  avatar: string;
  class: string;
  distance: string;
  distanceKm: number;
  subjects: string[];
  bio: string;
  preferredStudyModes: ('In-person' | 'Online (video call)' | 'Group study')[];
  availabilityDays: string[];
  availabilityTime: string;
  coordinates: [number, number];
  connected: boolean;
  pendingRequest: boolean;
}

export interface GroupStudySession {
  id: string;
  title: string;
  time: string;
  days: string;
  topic: string;
  joined: boolean;
  memberCount: number;
}

export interface ChatMessage {
  id: string;
  studentId: string;
  sender: 'student' | 'teacher';
  text: string;
  timestamp: string;
}

export interface LearningGapOverviewItem {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  subject: string;
  missedTopicsCount: number;
  avgScore: number;
  status: RiskLevel;
}

export interface MissedTopicDetail {
  id: string;
  name: string;
  lastActivity: string;
  status: RiskLevel;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ParentCommunicationRecord {
  id: string;
  studentId: string;
  studentName: string;
  messageType: 'Missed class alert' | 'Progress update' | 'Meeting request' | 'Appreciation' | 'Fee reminder' | 'Attendance alert';
  channel: 'WhatsApp' | 'SMS' | 'Email';
  date: string;
  status: 'Sent' | 'Replied' | 'Read' | 'Booked' | 'No reply';
  messageText: string;
}

export interface ParentMeetingSchedule {
  id: string;
  studentId: string;
  studentName: string;
  slot: string;
  status: 'Confirmed' | 'Pending';
  dateScheduled: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  rollNo: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  reason?: string;
}
