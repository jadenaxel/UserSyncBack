import { Module } from '@nestjs/common';
import { AdService } from './ad.service';

@Module({
  providers: [AdService],
  exports: [AdService],
})
export class AdModule {}
