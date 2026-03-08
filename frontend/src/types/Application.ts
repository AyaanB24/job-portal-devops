export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicantId: string;
  applicant?: {
    id: string;
    name: string;
    email: string;
  };
  coverLetter?: string;
  resumeLink: string;
  phoneNumber?: string;
  experienceYears?: string;
  portfolioUrl?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'REJECTED';
  jobStatus?: string;
  appliedAt: string;
}
