export interface Job {
  id: string;
  title: string;
  company: string; // compatibility
  companyName?: string;
  companyId: string;
  location: string;
  description: string;
  shortDescription: string;
  skills: string[];
  salary?: string;
  type: string;
  postedAt: string;
  applicants: number;
  status?: "ACTIVE" | "DELETED";
  applicationStatus?: string | null;
}

export interface PostJobPayload {
  title: string;
  description: string;
  skills: string[];
  location: string;
  type: Job["type"];
  salary?: string;
}
