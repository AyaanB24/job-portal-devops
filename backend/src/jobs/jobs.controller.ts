import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto, UpdateJobDto, JobQueryDto } from './dto/jobs.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/interfaces/entities.interface';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Post a new job' })
  create(@Req() req: any, @Body() dto: CreateJobDto) {
    return this.jobsService.create(dto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jobs with optional filters' })
  @ApiBearerAuth()
  @UseGuards(OptionalJwtGuard)
  findAll(@Req() req: any, @Query() query: JobQueryDto) {
    const userId = req.user?.userId;
    return this.jobsService.findAll(query, userId);
  }

  @Get('my-jobs')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get jobs created by the current employer' })
  findMyJobs(@Req() req: any) {
    return this.jobsService.findEmployerJobs(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get job by ID' })
  @ApiBearerAuth()
  @UseGuards(OptionalJwtGuard)
  findOne(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.userId;
    return this.jobsService.findOne(id, userId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a job' })
  update(@Param('id') id: string, @Req() req: any, @Body() dto: UpdateJobDto) {
    return this.jobsService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.EMPLOYER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a job' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.jobsService.remove(id, req.user.userId);
  }
}
