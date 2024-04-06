import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaService } from 'src/prisma.service';


@Module({
  // controllers: [FilesController]
  controllers:[FilesController],
  providers:[FilesService, PrismaService],
  exports:[FilesService]
})
export class FilesModule {}
// 