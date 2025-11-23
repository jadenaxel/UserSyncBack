import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AdModule } from '../ad/ad.module';
import { EntraModule } from '../entra/entra.module';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [AdModule, EntraModule, ExcelModule],
  controllers: [UsersController],
})
export class UsersModule {}
