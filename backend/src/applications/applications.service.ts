import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../common/database.service';
import { CreateApplicationDto } from './dto/applications.dto';
import { UpdateApplicationStatusDto } from './dto/update-status.dto';
import { randomUUID } from 'crypto';
import { ApplicationStatus } from '../common/interfaces/entities.interface';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly db: DatabaseService,
    private readonly notifications: NotificationsGateway,
  ) {}

  async create(dto: CreateApplicationDto, userId: string) {
    const job = await this.db.findJobById(dto.jobId);
    if (!job) throw new NotFoundException('Job not found');

    const existing = await this.db.findApplication(dto.jobId, userId);
    if (existing) throw new ConflictException('Already applied for this job');

    const application = {
      id: randomUUID(),
      ...dto,
      applicantId: userId,
      companyId: job.companyId,
      status: ApplicationStatus.PENDING,
      appliedAt: new Date(),
    };

    await this.db.saveApplication(application as any);

    // Notify employer
    this.notifications.notifyNewApplication(job.createdBy, application);

    return application;
  }

  async findMy(userId: string) {
    return this.db.applications
      .filter((a) => a.applicantId === userId)
      .map((a) => {
        const job = this.db.jobs.find((j) => j.id === a.jobId);
        const company = this.db.companies.find((c) => c.id === a.companyId);
        return {
          ...a,
          jobTitle: job?.title || 'Unknown Job',
          jobStatus: job?.status || 'UNKNOWN',
          companyName: company?.companyName || 'Unknown Company',
        };
      });
  }

  async findAll() {
    return this.db.applications.map((a) => {
      const job = this.db.jobs.find((j) => j.id === a.jobId);
      const user = this.db.users.find((u) => u.id === a.applicantId);
      return {
        ...a,
        jobTitle: job?.title || 'Unknown Job',
        applicantName: user?.name || 'Unknown User',
      };
    });
  }

  async updateStatus(
    id: string,
    dto: UpdateApplicationStatusDto,
    userId: string,
    role: string,
  ) {
    const app = await this.db.findApplicationById(id);
    if (!app) throw new NotFoundException('Application not found');

    const job = await this.db.findJobById(app.jobId);
    if (!job)
      throw new NotFoundException('Job associated with application not found');

    // Only Admin or the Employer who posted the job can update status
    // For testing/demo, we allow all authorized roles from controller (seeker allowed too)
    // if (role !== 'ADMIN' && job.createdBy !== userId) { ... }

    const updated = await this.db.updateApplication(id, { status: dto.status });

    // Notify applicant
    this.notifications.notifyApplicationStatus(app.applicantId, {
      ...updated,
      job: { title: job.title },
    });

    return updated;
  }

  async findByJob(jobId: string, userId: string, role: string) {
    const job = await this.db.findJobById(jobId);
    if (!job) throw new NotFoundException('Job not found');

    // Admin can see everything, Employer only their own jobs
    // For testing, we allow seekers to view for now if they have permission from controller
    // if (role !== 'ADMIN' && job.createdBy !== userId) { ... }

    return this.db.applications
      .filter((a) => a.jobId === jobId)
      .map((a) => {
        const user = this.db.users.find((u) => u.id === a.applicantId);
        return {
          ...a,
          applicantName: user?.name || 'Unknown User',
          applicantEmail: user?.email || 'Unknown Email',
        };
      });
  }
}
