import { Controller, Post, Body, Res, Logger, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { AdService } from '../ad/ad.service';
import { EntraService } from '../entra/entra.service';
import { ExcelService } from '../excel/excel.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly adService: AdService,
    private readonly entraService: EntraService,
    private readonly excelService: ExcelService,
  ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    this.logger.log(`Received request to create user: ${createUserDto.email}`);
    
    const results = {
      ad: false,
      entra: false,
      excel: false,
      errors: [] as { source: string; message: any }[],
    };

    try {
      // 1. Create in AD
      try {
        await this.adService.createUser(createUserDto);
        results.ad = true;
      } catch (error) {
        this.logger.error('AD Creation failed', error);
        results.errors.push({ source: 'AD', message: error.message });
      }

      // 2. Create in Entra ID
      try {
        await this.entraService.createUser(createUserDto);
        results.entra = true;
      } catch (error) {
        this.logger.error('Entra Creation failed', error);
        results.errors.push({ source: 'Entra', message: error.message });
      }

      // 3. Generate Excel
      try {
        const buffer = await this.excelService.generateUserExcel(createUserDto);
        // In a real scenario, we might save this to a storage bucket or return it directly.
        // For this API, we'll just acknowledge it was generated.
        // If the client wants to download it, we might need a separate endpoint or return it here.
        // For now, let's assume we just want to confirm generation.
        results.excel = true;
      } catch (error) {
        this.logger.error('Excel Generation failed', error);
        results.errors.push({ source: 'Excel', message: error.message });
      }

      if (results.errors.length > 0) {
        return res.status(HttpStatus.PARTIAL_CONTENT).json({
          message: 'User creation completed with some errors',
          results,
        });
      }

      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully in all systems',
        results,
      });

    } catch (error) {
      this.logger.error('Unexpected error in user creation flow', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  }
}
