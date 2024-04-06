import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  //Получение общей статистики по сайту
  @Get("main")
  @Auth("admin")
  getMainStatistics(){
    return this.statisticsService.getMain()
  }

  //Получение статистики определенного пользователя
  //!!!!!!!!!!!!!!!(метод нужно доработать)!!!!!!!!!!!!!!!!!
  @Get("my-statictic")
  @Auth()
  getStaticticUser(@CurrentUser("id") id:number){
    return this.statisticsService.getStaticticUser(id)
  }
}
