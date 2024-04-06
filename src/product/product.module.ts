import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PaginationModule } from 'src/pagination/pagination.module';
import { CategoryModule } from 'src/category/category.module';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';


@Module({
  controllers: [ProductController],
  imports: [PaginationModule, CategoryModule, FilesModule], 
  providers: [ProductService,  PrismaService, PaginationService, FilesService],
})
export class ProductModule {}
