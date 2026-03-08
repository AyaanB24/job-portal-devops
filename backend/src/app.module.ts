import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { JobsModule } from './jobs/jobs.module';
import { ApplicationsModule } from './applications/applications.module';
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    JobsModule,
    ApplicationsModule,
    CompaniesModule,
    UsersModule,
    NotificationsModule,
  ],
})
export class AppModule {}
