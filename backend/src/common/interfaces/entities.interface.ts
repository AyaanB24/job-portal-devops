export enum UserRole {
  JOB_SEEKER = 'JOB_SEEKER',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
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
