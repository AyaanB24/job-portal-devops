export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN',
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  REJECTED = 'REJECTED',
}

export interface UserProfile {
  skills: string[];
  experience: string;
  resumeLink?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  profile?: UserProfile;
  createdAt: Date;
}

export interface RefreshToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface Company {
  id: string;
  companyName: string;
  description: string;
  website: string;
  location: string;
  industry: string;
  createdBy: string; // Employer ID
  createdAt: Date;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skills: string[];
  location: string;
  jobType: string;
  salaryRange: string;
  companyId: string;
  status: JobStatus;
  createdBy: string;
  createdAt: Date;
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  companyId: string; // Direct link to company
  resumeLink: string;
  coverLetter?: string;
  phoneNumber?: string;
  experienceYears?: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  appliedAt: Date;
}
