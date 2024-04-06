import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticsService {
    constructor(
        private prisma: PrismaService,
       private userService: UserService
    ){}  

    //Получение общей статистики
    async getMain(){
        //перепиши, вынеси в отдельный endpoint
        const ordersCount = await this.prisma.order.count()
        const usersCount = await this.prisma.user.count()
        const reviewsCount = await this.prisma.review.count()
        const totalAmount = await this.prisma.order.aggregate({
            _sum:{
                total:true
            }
        })

        return [
            {
                name: "Заказы", 
                value: ordersCount
            }, 
            {
                name: "Пользователи", 
                value: usersCount
            },
            {
                name: "Отзывы", 
                value: reviewsCount
            }, 
            {
                name: "Общая сумма заказов", 
                value: totalAmount._sum.total || 0
            }
        ]
    }

    //Статистика пользователя !!!доработай
    async getStaticticUser(userId: number){
        const user = await this.userService.byId(userId, {
            orders:{
                select:{
                    items:{
                        select:{
                            price:true
                        }
                    }
                }
            }, 
            reviews: true
        })
        return [
            {
                name: "Orders", 
                value: user.orders.length
            }, 
            {
                name: "Reviews", 
                value: user.reviews.length
            },
            {
                name: "Favorites", 
                value: user.favorites.length
            }, 
            {
                name: "Total amount", 
                value: 1000
            }
        ]
    }
}
