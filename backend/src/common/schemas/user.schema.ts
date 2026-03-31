import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, AuthProvider } from '../interfaces/entities.interface';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ required: true, enum: AuthProvider, default: AuthProvider.LOCAL })
  authProvider: AuthProvider;

  @Prop()
  googleId?: string;

  @Prop()
  profilePic?: string;

  @Prop({ type: Object })
  companyDetails?: {
    companyName: string;
    website: string;
    verified: boolean;
  };

  @Prop({ type: Object })
  profile?: {
    skills: string[];
    experience: string;
    resumeLink?: string;
  };

  @Prop()
  verificationToken?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
