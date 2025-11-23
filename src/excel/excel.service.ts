import { Injectable, Logger } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);

  async generateUserExcel(userData: any): Promise<Buffer> {
    this.logger.log(`Generating Excel for user: ${userData.email}`);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    worksheet.columns = [
      { header: 'ID Empresarial', key: 'id', width: 15 },
      { header: 'Nombre', key: 'firstName', width: 20 },
      { header: 'Apellido', key: 'lastName', width: 20 },
      { header: 'Proyecto', key: 'project', width: 20 },
      { header: 'Cargo', key: 'role', width: 20 },
      { header: 'Pais', key: 'country', width: 15 },
      { header: 'Ciudad', key: 'city', width: 15 },
    ];

    worksheet.addRow({
      id: userData.employeeId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      project: userData.project,
      role: userData.role,
      country: userData.country,
      city: userData.city,
    });

    const buffer = await workbook.xlsx.writeBuffer();
    this.logger.log('Excel generated successfully');
    return buffer as any as Buffer;
  }
}
