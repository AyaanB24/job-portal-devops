import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../common/database.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { UserRole } from '../common/interfaces/entities.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.db.findUserByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = {
      id: randomUUID(),
      ...dto,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await this.db.saveUser(user);
    return this.generateTokens(user.id, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.db.findUserByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.role);
  }

  async refreshToken(token: string) {
    const rt = this.db.refreshTokens.find(
      (t) => t.token === token && t.expiresAt > new Date(),
    );
    if (!rt) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.db.findUserById(rt.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    // Remove used token
    this.db.refreshTokens = this.db.refreshTokens.filter(
      (t) => t.token !== token,
    );

    return this.generateTokens(user.id, user.role);
  }

  private async generateTokens(userId: string, role: UserRole) {
    const payload = { sub: userId, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET || 'super-secret-key',
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
    });

    const refreshToken = randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    this.db.refreshTokens.push({
      userId,
      token: refreshToken,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        role,
      },
    };
  }

  async logout(token: string) {
    this.db.refreshTokens = this.db.refreshTokens.filter(
      (t) => t.token !== token,
    );
  }
}
