import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { JobStatus } from '../interfaces/entities.interface';

@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  jobType: string;

  @Prop({ default: 'Not Specified' })
  salaryRange: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  companyId: Types.ObjectId;

  @Prop({ type: String, enum: JobStatus, default: JobStatus.ACTIVE })
  status: JobStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);
