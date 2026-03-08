import { User, LoginPayload, RegisterPayload, UserRole } from "@/types/User";
import { Job, PostJobPayload } from "@/types/Job";
import { Application } from "@/types/Application";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const mapRoleToBE = (role: UserRole): string => {
  switch (role) {
    case "jobseeker": return "JOB_SEEKER";
    case "company": return "EMPLOYER";
    case "admin": return "ADMIN";
    default: return role;
  }
};

const mapRoleFromBE = (role: string): UserRole => {
  switch (role) {
    case "JOB_SEEKER": return "jobseeker";
    case "EMPLOYER": return "company";
    case "ADMIN": return "admin";
    default: return role as UserRole;
  }
};

export const apiService = {
  async login(payload: LoginPayload): Promise<User> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return {
      ...data.user,
      role: mapRoleFromBE(data.user.role),
      createdAt: new Date().toISOString(),
    };
  },

  async register(payload: RegisterPayload): Promise<{ success: boolean }> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        role: mapRoleToBE(payload.role),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return { success: true };
  },

  async getJobs(): Promise<Job[]> {
    const response = await fetch(`${API_URL}/jobs`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch jobs");
    const data = await response.json();
    return data;
  },

  async getJobById(id: string): Promise<Job | undefined> {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      headers: getHeaders(),
    });
    if (!response.ok) return undefined;
    return response.json();
  },

  async postJob(payload: PostJobPayload): Promise<Job> {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        title: payload.title,
        description: payload.description,
        skills: payload.skills,
        location: payload.location,
        jobType: payload.type,
        salaryRange: payload.salary || "Not Specified",
      }),
    });
    if (!response.ok) throw new Error("Failed to post job");
    return response.json();
  },

  async applyToJob(
    jobId: string, 
    coverLetter: string, 
    resumeLink: string,
    phoneNumber?: string,
    experienceYears?: string,
    portfolioUrl?: string
  ): Promise<Application> {
    const payload: any = {
      jobId,
      resumeLink: resumeLink || "https://example.com/resume.pdf",
    };

    if (coverLetter?.trim()) payload.coverLetter = coverLetter.trim();
    if (phoneNumber?.trim()) payload.phoneNumber = phoneNumber.trim();
    if (experienceYears?.trim()) payload.experienceYears = experienceYears.trim();
    if (portfolioUrl?.trim()) payload.portfolioUrl = portfolioUrl.trim();

    const response = await fetch(`${API_URL}/applications`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Failed to apply");
    return response.json();
  },

  async updateApplicationStatus(id: string, status: string): Promise<Application> {
    const response = await fetch(`${API_URL}/applications/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update status");
    return response.json();
  },

  async getApplications(): Promise<Application[]> {
    const response = await fetch(`${API_URL}/applications/my`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch applications");
    return response.json();
  },

  async getCompanyJobs(): Promise<Job[]> {
    const response = await fetch(`${API_URL}/jobs/my-jobs`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch company jobs");
    return response.json();
  },

  async getCompanyApplicants(): Promise<Application[]> {
    // This could be updated if there's a specific endpoint for all company applicants
    // For now, assume company can see theirs via some logic or use current mock-like behavior if BE missing it
    const jobs = await this.getCompanyJobs();
    let allApps: any[] = [];
    for (const job of jobs) {
      const res = await fetch(`${API_URL}/applications/job/${job.id}`, { headers: getHeaders() });
      if (res.ok) {
        const apps = await res.json();
        allApps = [...allApps, ...apps];
      }
    }
    return allApps;
  },

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    return data.map((u: any) => ({ ...u, role: mapRoleFromBE(u.role) }));
  },

  async getAllJobs(): Promise<Job[]> {
    // Admin view usually sees everything including deleted if needed, but current BE returns all for roles
    return this.getJobs();
  },

  async deleteJob(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("Failed to delete job");
  },

  async blockUser(id: string): Promise<void> {
    // Backend doesn't have block user yet, mock it
    await new Promise(r => setTimeout(r, 400));
  },
};
