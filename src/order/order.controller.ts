import { Body, Controller, Get, Post, HttpCode, UsePipes, ValidationPipe, Param, Delete} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { OrderService } from './order.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { OrderDto } from './order.dto';
// import { PaymentStatusDto } from './payment-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Обработчик GET-запроса для получения всех заказов
  @Get()
  @Auth("admin")
  getAllOrders() {
    return this.orderService.getAll();
  }

  // Обработчик GET-запроса для получения информации об одном заказе
  @Get(':id')
  @Auth("admin")
  async getProduct(@Param("id") id: string){
    return this.orderService.getOrderById(+id)
  }
  //получение пользователем его заказов
  @Get('by-user')
  @Auth()
  getByUserId(@CurrentUser("id") userId: number){
    return this.orderService.getByUserId(userId)
  } 

  //Удаление заказа
  @HttpCode(200)
  @Delete(':id')
  @Auth("admin")
  async deleteProduct(@Param("id") orderId: number){
    return this.orderService.deleteOrder(+orderId)
  }
  
  //создание заказа и +(его оплата(скрыто))
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  placeOrder(@Body() dto: OrderDto, @CurrentUser("id") userId: number){
    return this.orderService.placeOrder(dto, userId)
  }

  //Обновление статуса платежа
  // @HttpCode(200)
  // @Post("status")
  // async updateStatus(@Body() dto: PaymentStatusDto){
  //   return this.orderService.updateStatus(dto)
  // }
}
