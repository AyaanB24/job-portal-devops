import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Job } from '../common/schemas/job.schema';
import { Application } from '../common/schemas/application.schema';
import { User } from '../common/schemas/user.schema';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/jobs.dto';
import { JobStatus } from '../common/interfaces/entities.interface';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name) private readonly jobModel: Model<Job>,
    @InjectModel(Application.name) private readonly applicationModel: Model<Application>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly notifications: NotificationsGateway,
  ) {}

  async create(dto: CreateJobDto, userId: string) {
    const user = await this.userModel.findById(userId);

    const job = await this.jobModel.create({
      ...dto,
      companyId: new Types.ObjectId(userId),
      status: JobStatus.ACTIVE,
      createdBy: new Types.ObjectId(userId),
    });

    this.notifications.notifyNewJob(job);
    return job;
  }

  async findAll(query: JobQueryDto, userId?: string) {
    const filter: any = { status: JobStatus.ACTIVE };

    if (query.search) {
      const regex = new RegExp(query.search, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { skills: { $in: [regex] } },
      ];
    }

    if (query.location) {
      filter.location = new RegExp(query.location, 'i');
    }

    const jobs = await this.jobModel.find(filter).sort({ createdAt: -1 }).lean();

    // Enrich with applicant count and company name
    const enriched = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await this.applicationModel.countDocuments({ jobId: job._id });
        const creator = await this.userModel.findById(job.createdBy).lean();
        const companyName = creator?.companyDetails?.companyName || creator?.name || 'Unknown Company';

        let applicationStatus = null;
        if (userId) {
          const app = await this.applicationModel.findOne({
            jobId: job._id,
            applicantId: new Types.ObjectId(userId),
          });
          applicationStatus = app?.status || null;
        }

        return {
          ...job,
          id: job._id.toString(),
          company: companyName,
          applicants,
          applicationStatus,
        };
      }),
    );

    return enriched;
  }

  async findEmployerJobs(userId: string) {
    const jobs = await this.jobModel
      .find({ createdBy: new Types.ObjectId(userId), status: JobStatus.ACTIVE })
      .sort({ createdAt: -1 })
      .lean();

    const enriched = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await this.applicationModel.countDocuments({ jobId: job._id });
        return {
          ...job,
          id: job._id.toString(),
          applicants,
        };
      }),
    );

    return enriched;
  }

  async findOne(id: string, userId?: string) {
    const job = await this.jobModel.findById(id).lean();
    if (!job) throw new NotFoundException('Job not found');

    const creator = await this.userModel.findById(job.createdBy).lean();
    const companyName = creator?.companyDetails?.companyName || creator?.name || 'Unknown Company';
    const applicants = await this.applicationModel.countDocuments({ jobId: job._id });

    let applicationStatus = null;
    if (userId) {
      const app = await this.applicationModel.findOne({
        jobId: job._id,
        applicantId: new Types.ObjectId(userId),
      });
      applicationStatus = app?.status || null;
    }

    return {
      ...job,
      id: job._id.toString(),
      company: companyName,
      applicants,
      applicationStatus,
    };
  }

  async update(id: string, dto: UpdateJobDto, userId: string) {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('Job not found');

    return this.jobModel.findByIdAndUpdate(id, { $set: dto }, { new: true });
  }

  async remove(id: string, userId: string) {
    const job = await this.jobModel.findById(id);
    if (!job) throw new NotFoundException('Job not found');

    if (job.createdBy.toString() !== userId) throw new ForbiddenException();

    return this.jobModel.findByIdAndUpdate(
      id,
      { $set: { status: JobStatus.DELETED } },
      { new: true },
    );
  }
}
