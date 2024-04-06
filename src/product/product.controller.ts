import { Controller, Query, Get, UsePipes, Param, HttpCode, ValidationPipe,Put,  Delete,  Body, Post} from '@nestjs/common';
// import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductService } from './product.service';
import {GetAllProductDto } from './dto/get-all.product.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ProductDto, ProductUpdateDto } from './dto/product.dto';


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //Получение всех товаров
  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductDto){
    return this.productService.getAll(queryDto)
  }

  //Получение всех товаров со скидкой
  @UsePipes(new ValidationPipe())
  @Get("discount")
  async getAllDiscount(){
    return this.productService.getAllDiscount()
  }
  //Получение похожих товаров
  @Get('similar/:id')
  async getSimilar(@Param("id") id:string){
    return this.productService.getSimilar(+id)
  }

  //Получение по слагу
  @Get('by-slug/:slug')
  async getProductBySlug(@Param("slug") slug:string){
    return this.productService.bySlug(slug)
  }
  
  //Получение по категории
  @Get('by-category/:categorySlug')
  async getProductByCategory(@Param("categorySlug") categorySlug:string){
    return this.productService.byCategory(categorySlug)
  }
  
  //Создание нового товара
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  // @Auth("admin")
  @Post()
  async createProduct(@Body() dto: ProductDto){
    return this.productService.create(dto)
  }

  //Обновление товара
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth("admin")
  async updateProduct(@Param("id") id: string, @Body() dto: ProductUpdateDto){
      return this.productService.update(+id, dto)
  }
  //Удаление товара
  @HttpCode(200)
  @Delete(':id')
  @Auth("admin")
  async deleteProduct(@Param("id") id: string){
    return this.productService.delete(+id)
  }

  //Получение всех товаров в панеле админа
  @Get(':id')
  @Auth("admin")
  async getProduct(@Param("id") id: string){
    return this.productService.byId(+id)
  }
}
