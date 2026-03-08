import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  resumeLink: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  experienceYears?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  portfolioUrl?: string;
}
