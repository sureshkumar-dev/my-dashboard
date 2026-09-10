export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Interview Call'
  | 'Interview'
  | 'Final Round'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn'
  | 'No Response';

export type AppliedThrough =
  | 'LinkedIn'
  | 'Naukri'
  | 'Indeed'
  | 'Company Website'
  | 'Referral'
  | 'Recruiter'
  | 'Other';

export type LocationType = 'Remote' | 'Hybrid' | 'On-site';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Role {
  id: string;
  name: string;
  order: number;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  roleId: string;
  company: string;
  jobTitle: string;
  location: string;
  locationType: LocationType;
  appliedDate: string;
  appliedThrough: AppliedThrough;
  jobUrl: string;
  status: ApplicationStatus;
  interviewDate?: string;
  interviewStage?: string;
  recruiterName?: string;
  recruiterContact?: string;
  recruiterLinkedIn?: string;
  salary?: string;
  priority: Priority;
  nextAction?: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type InterviewStage =
  | 'Screening'
  | 'Technical'
  | 'Coding'
  | 'System Design'
  | 'Managerial'
  | 'HR'
  | 'Final Round'
  | 'Other';

export type InterviewType = 'Video' | 'Phone' | 'In-Person' | 'Take-Home';

export type InterviewResult =
  | 'Upcoming'
  | 'Completed'
  | 'Passed'
  | 'Rejected'
  | 'Rescheduled'
  | 'Cancelled'
  | 'Waiting for Result';

export type PrepStatus = 'Not Started' | 'In Progress' | 'Well Prepared' | 'Completed';

export interface Interview {
  id: string;
  company: string;
  role: string;
  applicationId?: string;
  interviewDate: string;
  interviewTime: string;
  interviewStage: InterviewStage;
  interviewType: InterviewType;
  interviewer?: string;
  meetingLink?: string;
  recruiter?: string;
  preparationStatus: PrepStatus;
  questionsAsked?: string;
  myAnswers?: string;
  mistakes?: string;
  feedback?: string;
  result: InterviewResult;
  nextRound?: string;
  nextAction?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ChecklistType = 'Preparation' | 'Technical' | 'HR' | 'Application' | 'Custom';

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  notes?: string;
}

export interface Checklist {
  id: string;
  name: string;
  type: ChecklistType;
  dueDate?: string;
  items: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: ChecklistType;
  defaultItems: {
    title: string;
    description?: string;
    priority: Priority;
  }[];
  isBuiltIn: boolean;
}

export type RecurrenceType = 'one-time' | 'daily' | 'weekdays' | 'weekly' | 'custom';

export interface DayTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface DayChecklist {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  recurrence: RecurrenceType;
  tasks: DayTask[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MNCStatus =
  | 'Target'
  | 'Researching'
  | 'Ready to Apply'
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

export interface MNCCompany {
  id: string;
  companyName: string;
  locations: string[];
  website?: string;
  careersUrl?: string;
  targetRoles: string[];
  priority: 'Top Priority' | 'High' | 'Medium' | 'Low';
  status: MNCStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type GoalCategory = 'Applications' | 'Interviews' | 'Skill Prep' | 'MNC' | 'Other';
export type GoalStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Deferred';

export interface Goal {
  id: string;
  name: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  status: GoalStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  name: string;
  title: string;
  summary: string;
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    databases: string[];
    cloudAndTools: string[];
  };
  projects: string[];
}

export interface DashboardData {
  version: number;
  lastUpdated: string;
  userProfile: UserProfile;
  roles: Role[];
  applications: JobApplication[];
  interviews: Interview[];
  checklists: Checklist[];
  checklistTemplates: ChecklistTemplate[];
  dayChecklists: DayChecklist[];
  mncCompanies: MNCCompany[];
  goals: Goal[];
}
