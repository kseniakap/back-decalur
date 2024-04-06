import { Controller, HttpCode,UsePipes, ValidationPipe, Param, Get, Put, Post, Delete, Body} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(){
    return this.categoryService.getAll()
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param("slug") slug:string){
    return this.categoryService.bySlug(slug)
  }
  
  @Get(":id")
  async getById(@Param("id") id: string){
    return this.categoryService.byId(+id)
  }

  @HttpCode(200)
  // @Auth("admin")
  @Post()
  async create(@Body() dto: CategoryDto){
    return this.categoryService.create(dto)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth("admin")
  @Put(':id')
  async update( @Param('id') id: string, @Body() dto: CategoryDto ){
    return this.categoryService.update(+id, dto)
  }

  @HttpCode(200)
  @Auth("admin")
  @Delete(':id')
  async delete( @Param('id') id: string ){
    return this.categoryService.delete(+id)
  }
  
}
