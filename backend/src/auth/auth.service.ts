import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../common/schemas/user.schema';
import { RegisterDto, LoginDto, CompanyRegisterDto, SeekerRegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRole, AuthProvider } from '../common/interfaces/entities.interface';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../common/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // ─── Generic register (backward compat) ────────────────────────
  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      role: dto.role,
      authProvider: AuthProvider.LOCAL,
    });

    return this.generateTokenResponse(user);
  }

  // ─── Company signup (email only) ────────────────────────────────
  async companyRegister(dto: CompanyRegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      role: UserRole.EMPLOYER,
      authProvider: AuthProvider.LOCAL,
      verificationToken,
      companyDetails: {
        companyName: dto.companyName,
        website: dto.website || '',
        verified: false,
      },
    });

    await this.mailService.sendVerificationEmail(user.email, verificationToken, dto.companyName);

    return this.generateTokenResponse(user);
  }

  // ─── Seeker signup (email) ──────────────────────────────────────
  async seekerRegister(dto: SeekerRegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      role: UserRole.JOB_SEEKER,
      authProvider: AuthProvider.LOCAL,
    });

    return this.generateTokenResponse(user);
  }

  // ─── Login (email/password) ─────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role === UserRole.EMPLOYER && user.companyDetails && !user.companyDetails.verified) {
      throw new UnauthorizedException('Please verify your company email address to access the platform. Check your inbox.');
    }

    return this.generateTokenResponse(user);
  }

  // ─── Company login (email only, enforce role) ───────────────────
  async companyLogin(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.role !== UserRole.EMPLOYER) {
      throw new ForbiddenException('This login is for companies only');
    }
    if (user.companyDetails && !user.companyDetails.verified) {
      throw new UnauthorizedException('Please verify your company email address to access the platform. Check your inbox.');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenResponse(user);
  }

  // ─── Seeker login (email) ──────────────────────────────────────
  async seekerLogin(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.role !== UserRole.JOB_SEEKER) {
      throw new ForbiddenException('This login is for job seekers only');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokenResponse(user);
  }

  // ─── Company Verification ────────────────────────────────────────
  async verifyCompany(token: string) {
    const user = await this.userModel.findOne({ verificationToken: token });
    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      $set: { 'companyDetails.verified': true },
      $unset: { verificationToken: 1 }
    });

    return { message: 'Company identity successfully verified' };
  }

  // ─── Google OAuth handler ──────────────────────────────────────
  async googleLogin(profile: any) {
    const { id: googleId, emails, displayName, photos } = profile;
    const email = emails[0].value.toLowerCase();
    const profilePic = photos?.[0]?.value || '';

    let user = await this.userModel.findOne({ email });

    if (user) {
      // If existing user is a company, BLOCK Google login
      if (user.role === UserRole.EMPLOYER) {
        throw new ForbiddenException('Companies cannot login via Google');
      }
      // Update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePic = profilePic;
        await user.save();
      }
    } else {
      // Create new seeker user via Google
      user = await this.userModel.create({
        name: displayName,
        email,
        role: UserRole.JOB_SEEKER,
        authProvider: AuthProvider.GOOGLE,
        googleId,
        profilePic,
      });
    }

    const token = await this.generateJwtToken(user);
    return { token, user };
  }

  // ─── Token generation ──────────────────────────────────────────
  private async generateJwtToken(user: User): Promise<string> {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '1h',
    });
  }

  private async generateTokenResponse(user: User) {
    const accessToken = await this.generateJwtToken(user);

    return {
      accessToken,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider,
        profilePic: user.profilePic,
        companyDetails: user.companyDetails,
      },
    };
  }

  // ─── Find user by ID (used by JWT strategy) ────────────────────
  async findUserById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }
}
