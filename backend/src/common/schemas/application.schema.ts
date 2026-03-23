import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApplicationStatus } from '../interfaces/entities.interface';

@Schema({ timestamps: true })
export class Application extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Job', required: true })
  jobId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  applicantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  companyId: Types.ObjectId;

  @Prop({ required: true })
  resumeLink: string;

  @Prop()
  coverLetter?: string;

  @Prop()
  phoneNumber?: string;

  @Prop()
  experienceYears?: string;

  @Prop()
  portfolioUrl?: string;

  @Prop({ type: String, enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status: ApplicationStatus;

  createdAt: Date;
  updatedAt: Date;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
