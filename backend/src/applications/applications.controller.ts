import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/applications.dto';
import { UpdateApplicationStatusDto } from './dto/update-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/interfaces/entities.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Apply for a job' })
  create(@Req() req: any, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto, req.user.userId);
  }

  @Get('my')
  @Roles(UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get my applications' })
  findMy(@Req() req: any) {
    return this.applicationsService.findMy(req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all applications (Admin only)' })
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get('job/:jobId')
  @Roles(UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get applications for a specific job' })
  findByJob(@Param('jobId') jobId: string, @Req() req: any) {
    return this.applicationsService.findByJob(
      jobId,
      req.user.userId,
      req.user.role,
    );
  }

  @Patch(':id/status')
  @Roles(UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update application status (Employer/Admin only)' })
  updateStatus(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateStatus(
      id,
      dto,
      req.user.userId,
      req.user.role,
    );
  }
}
