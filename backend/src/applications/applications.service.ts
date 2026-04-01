import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application } from '../common/schemas/application.schema';
import { Job } from '../common/schemas/job.schema';
import { User } from '../common/schemas/user.schema';
import { CreateApplicationDto } from './dto/applications.dto';
import { UpdateApplicationStatusDto } from './dto/update-status.dto';
import { ApplicationStatus } from '../common/interfaces/entities.interface';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private readonly applicationModel: Model<Application>,
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notifications: NotificationsGateway,
  ) {}

  async create(dto: CreateApplicationDto, userId: string) {
    const job = await this.jobModel.findById(dto.jobId);
    if (!job) throw new NotFoundException('Job not found');

    const existing = await this.applicationModel.findOne({
      jobId: new Types.ObjectId(dto.jobId),
      applicantId: new Types.ObjectId(userId),
    });
    if (existing) throw new ConflictException('Already applied for this job');

    const application = await this.applicationModel.create({
      jobId: new Types.ObjectId(dto.jobId),
      applicantId: new Types.ObjectId(userId),
      companyId: job.createdBy,
      resumeLink: dto.resumeLink,
      coverLetter: dto.coverLetter,
      phoneNumber: dto.phoneNumber,
      experienceYears: dto.experienceYears,
      portfolioUrl: dto.portfolioUrl,
      status: ApplicationStatus.PENDING,
    });

    // Notify employer
    this.notifications.notifyNewApplication(job.createdBy.toString(), application);

    return {
      ...application.toObject(),
      id: application._id.toString(),
      appliedAt: (application as any).createdAt || new Date(),
    };
  }

  async findMy(userId: string) {
    const applications = await this.applicationModel
      .find({ applicantId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await Promise.all(
      applications.map(async (app) => {
        const job = await this.jobModel.findById(app.jobId).lean();
        const company = await this.userModel.findById(app.companyId).lean();
        return {
          ...app,
          id: app._id.toString(),
          jobTitle: job?.title || 'Unknown Job',
          jobStatus: job?.status || 'UNKNOWN',
          companyName: company?.companyDetails?.companyName || company?.name || 'Unknown Company',
          appliedAt: app.createdAt,
        };
      }),
    );

    return enriched;
  }

  async findAll() {
    const applications = await this.applicationModel.find().sort({ createdAt: -1 }).lean();

    const enriched = await Promise.all(
      applications.map(async (app) => {
        const job = await this.jobModel.findById(app.jobId).lean();
        const user = await this.userModel.findById(app.applicantId).lean();
        return {
          ...app,
          id: app._id.toString(),
          jobTitle: job?.title || 'Unknown Job',
          applicantName: user?.name || 'Unknown User',
          appliedAt: app.createdAt,
        };
      }),
    );

    return enriched;
  }

  async updateStatus(
    id: string,
    dto: UpdateApplicationStatusDto,
    userId: string,
    role: string,
  ) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');

    const job = await this.jobModel.findById(app.jobId);
    if (!job) throw new NotFoundException('Job associated with application not found');

    const updated = await this.applicationModel.findByIdAndUpdate(
      id,
      { $set: { status: dto.status } },
      { new: true },
    );

    // Notify applicant
    this.notifications.notifyApplicationStatus(app.applicantId.toString(), {
      ...updated.toObject(),
      job: { title: job.title },
    });

    return updated;
  }

  async findByJob(jobId: string, userId: string, role: string) {
    const job = await this.jobModel.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');

    const applications = await this.applicationModel
      .find({ jobId: new Types.ObjectId(jobId) })
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await Promise.all(
      applications.map(async (app) => {
        const user = await this.userModel.findById(app.applicantId).lean();
        return {
          ...app,
          id: app._id.toString(),
          applicantName: user?.name || 'Unknown User',
          applicantEmail: user?.email || 'Unknown Email',
          appliedAt: app.createdAt,
        };
      }),
    );

    return enriched;
  }
}
