import { Controller, Post, Body, Get, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, CompanyRegisterDto, SeekerRegisterDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Backward-compatible generic endpoints ──────────────────────
  @Post('register')
  @ApiOperation({ summary: 'Register a new user (generic)' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user (generic)' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── Company auth endpoints ─────────────────────────────────────
  @Post('company/signup')
  @ApiOperation({ summary: 'Register a new company (email only)' })
  companySignup(@Body() dto: CompanyRegisterDto) {
    return this.authService.companyRegister(dto);
  }

  @Post('company/verify')
  @ApiOperation({ summary: 'Verify company email' })
  verifyCompany(@Body('token') token: string) {
    return this.authService.verifyCompany(token);
  }

  @Post('company/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as company (email only)' })
  companyLogin(@Body() dto: LoginDto) {
    return this.authService.companyLogin(dto);
  }

  // ─── Seeker auth endpoints ──────────────────────────────────────
  @Post('seeker/signup')
  @ApiOperation({ summary: 'Register a new job seeker (email)' })
  seekerSignup(@Body() dto: SeekerRegisterDto) {
    return this.authService.seekerRegister(dto);
  }

  @Post('seeker/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login as job seeker (email)' })
  seekerLogin(@Body() dto: LoginDto) {
    return this.authService.seekerLogin(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current authenticated user' })
  async getMe(@Req() req: any) {
    const user = await this.authService.findUserById(req.user.userId);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        companyDetails: user.companyDetails,
        profile: user.profile,
      }
    };
  }

  // ─── Google OAuth (Seekers only) ────────────────────────────────
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Redirect to Google login (Seekers only)' })
  googleAuth() {
    // guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Handle Google OAuth callback' })
  async googleCallback(@Req() req: any, @Res() res: any) {
    const { token } = await this.authService.googleLogin(req.user);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:8080';
    return res.redirect(`${frontendUrl}/login?token=${token}`);
  }
}
