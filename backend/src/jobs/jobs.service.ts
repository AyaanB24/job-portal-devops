import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../common/database.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/jobs.dto';
import { randomUUID } from 'crypto';
import { JobStatus } from '../common/interfaces/entities.interface';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class JobsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly notifications: NotificationsGateway,
  ) {}

  async create(dto: CreateJobDto, userId: string) {
    const job = {
      id: randomUUID(),
      ...dto,
      companyId: 'c1', // Mock company ID
      status: JobStatus.ACTIVE,
      createdBy: userId,
      createdAt: new Date(),
    };

    await this.db.saveJob(job as any);
    this.notifications.notifyNewJob(job);
    return job;
  }

  async findAll(query: JobQueryDto, userId?: string) {
    let filtered = this.db.jobs.filter((j) => j.status === JobStatus.ACTIVE);

    if (query.search) {
      const s = query.search.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(s) ||
          j.description.toLowerCase().includes(s) ||
          j.skills.some((sk) => sk.toLowerCase().includes(s)),
      );
    }

    if (query.location) {
      filtered = filtered.filter((j) =>
        j.location.toLowerCase().includes(query.location.toLowerCase()),
      );
    }

    // Attach application status if userId provided
    return filtered.map((j) => {
      const app = this.db.applications.find(
        (a) => a.jobId === j.id && a.applicantId === userId,
      );
      const company = this.db.companies.find((c) => c.id === j.companyId);
      return {
        ...j,
        company: company?.companyName || 'Unknown Company',
        applicants: this.db.applications.filter((a) => a.jobId === j.id).length,
        applicationStatus: app ? app.status : null,
      };
    });
  }

  async findEmployerJobs(userId: string) {
    return this.db.jobs
      .filter((j) => j.createdBy === userId && j.status === JobStatus.ACTIVE)
      .map((j) => {
        return {
          ...j,
          applicants: this.db.applications.filter((a) => a.jobId === j.id)
            .length,
        };
      });
  }

  async findOne(id: string, userId?: string) {
    const job = await this.db.findJobById(id);
    if (!job) throw new NotFoundException('Job not found');

    const company = this.db.companies.find((c) => c.id === job.companyId);
    const app = this.db.applications.find(
      (a) => a.jobId === id && a.applicantId === userId,
    );

    return {
      ...job,
      company: company?.companyName || 'Unknown Company',
      applicants: this.db.applications.filter((a) => a.jobId === id).length,
      applicationStatus: app ? app.status : null,
    };
  }

  async update(id: string, dto: UpdateJobDto, userId: string) {
    const job = await this.db.findJobById(id);
    if (!job) throw new NotFoundException('Job not found');

    // Admin or Creator (For testing, allowed for all roles in controller)
    // if (job.createdBy !== userId) throw new ForbiddenException();

    return this.db.updateJob(id, dto);
  }

  async remove(id: string, userId: string) {
    const job = await this.db.findJobById(id);
    if (!job) throw new NotFoundException('Job not found');

    if (job.createdBy !== userId) throw new ForbiddenException();

    return this.db.updateJob(id, { status: JobStatus.DELETED });
  }
}
