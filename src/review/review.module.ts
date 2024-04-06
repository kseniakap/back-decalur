import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from 'src/prisma.service';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { PaginationModule } from 'src/pagination/pagination.module';
import { CategoryModule } from 'src/category/category.module';
import { FilesModule } from 'src/files/files.module';
import { FilesService } from 'src/files/files.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ProductService, FilesService],
  imports:[ProductModule, PaginationModule, CategoryModule, FilesModule]
})
export class ReviewModule {}
