import { Controller, UsePipes, ValidationPipe, Get, Post,  Param,  Body, HttpCode, Delete} from '@nestjs/common';
import { ReviewService } from './review.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { ReviewDto } from './review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(
    private reviewService: ReviewService) {}

  //Получение всех отзывов
  @UsePipes(new ValidationPipe())
  @Auth('admin')
  @Get()
  async getAll(){
    return this.reviewService.getAll()
  }

  //добавить новый отзыв о товаре
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('leave/:productId')
  @Auth()
  async leaveReview(
    @CurrentUser("id") id:number, 
    @Body() dto: ReviewDto, 
    @Param("productId") productId: string
  ){
    return this.reviewService.create(id, dto, +productId)
  }

  //Получение среднего отзыва
  @Get('avarage-by-product/:productId')
  async getAverageByProduct(@Param("productId") productId: string){
    return this.reviewService.getAverageValurByProductId(+productId)
  }

  //удаление отзыва
  @HttpCode(200)
  @Auth("admin")
  @Delete(':id')
  async delete( @Param('id') id: string ){
    return this.reviewService.delete(+id)
  }
}
