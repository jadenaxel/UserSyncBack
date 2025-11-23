import { Module } from '@nestjs/common';
import { EntraService } from './entra.service';

@Module({
  providers: [EntraService],
  exports: [EntraService],
})
export class EntraModule {}
