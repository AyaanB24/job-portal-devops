import { IsEnum } from 'class-validator';
import { ApplicationStatus } from '../../common/interfaces/entities.interface';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateApplicationStatusDto {
  @ApiProperty({ enum: ApplicationStatus })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
