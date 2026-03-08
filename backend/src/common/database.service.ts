import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  User,
  RefreshToken,
  Company,
  Job,
  Application,
  UserRole,
  JobStatus,
} from './interfaces/entities.interface';

@Injectable()
export class DatabaseService {
  users: User[] = [];
  refreshTokens: RefreshToken[] = [];
  companies: Company[] = [];
  jobs: Job[] = [];
  applications: Application[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    const hashedPassword = bcrypt.hashSync('password123', 10);

    // Mock Users
    this.users.push(
      {
        id: 'u1',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: UserRole.JOB_SEEKER,
        createdAt: new Date(),
      },
      {
        id: 'u2',
        name: 'Jane Smith',
        email: 'jane@techcorp.com',
        password: hashedPassword,
        role: UserRole.EMPLOYER,
        createdAt: new Date(),
      },
      {
        id: 'u3',
        name: 'Admin User',
        email: 'admin@portal.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        createdAt: new Date(),
      },
    );

    // Mock Company
    this.companies.push({
      id: 'c1',
      companyName: 'TechCorp',
      description: 'A leading tech company',
      website: 'https://techcorp.com',
      location: 'San Francisco, CA',
      industry: 'Technology',
      createdBy: 'u2',
      createdAt: new Date(),
    });

    // Mock Jobs
    this.jobs.push(
      {
        id: 'j1',
        title: 'Senior Frontend Developer',
        description: 'React expert needed',
        skills: ['React', 'TypeScript', 'Tailwind'],
        location: 'San Francisco, CA',
        jobType: 'Full-time',
        salaryRange: '$120k - $150k',
        companyId: 'c1',
        status: JobStatus.ACTIVE,
        createdBy: 'u2',
        createdAt: new Date(),
      },
      {
        id: 'j2',
        title: 'Backend Engineer',
        description: 'Node.js developer with NestJS experience',
        skills: ['Node.js', 'NestJS', 'PostgreSQL'],
        location: 'Remote',
        jobType: 'Full-time',
        salaryRange: '$130k - $160k',
        companyId: 'c1',
        status: JobStatus.ACTIVE,
        createdBy: 'u2',
        createdAt: new Date(),
      },
    );
  }

  // User methods
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async saveUser(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async updateUser(
    id: string,
    updates: Partial<User>,
  ): Promise<User | undefined> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return undefined;
  }

  // Job methods
  async findJobById(id: string): Promise<Job | undefined> {
    return this.jobs.find((j) => j.id === id);
  }

  async saveJob(job: Job): Promise<Job> {
    this.jobs.push(job);
    return job;
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    const index = this.jobs.findIndex((j) => j.id === id);
    if (index !== -1) {
      this.jobs[index] = { ...this.jobs[index], ...updates };
      return this.jobs[index];
    }
    return undefined;
  }

  // Application methods
  async findApplicationById(id: string): Promise<Application | undefined> {
    return this.applications.find((a) => a.id === id);
  }

  async findApplication(
    jobId: string,
    applicantId: string,
  ): Promise<Application | undefined> {
    return this.applications.find(
      (a) => a.jobId === jobId && a.applicantId === applicantId,
    );
  }

  async saveApplication(application: Application): Promise<Application> {
    this.applications.push(application);
    return application;
  }

  async updateApplication(
    id: string,
    updates: Partial<Application>,
  ): Promise<Application | undefined> {
    const index = this.applications.findIndex((a) => a.id === id);
    if (index !== -1) {
      this.applications[index] = { ...this.applications[index], ...updates };
      return this.applications[index];
    }
    return undefined;
  }
}
