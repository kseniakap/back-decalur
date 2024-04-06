import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OrderDto } from './order.dto';
import { productReturnObject, orderReturnObject } from 'src/product/return-product.object';
import { returnUserObject } from 'src/user/return-user.object';
// import * as YooKassa from "yookassa"
// import { PaymentStatusDto } from './payment-status.dto';
// import { EnumOrderStatus } from '@prisma/client';

// const yooKassa = new YooKassa({
//     shopId: process.env['SHOP_ID'],
//     secretKey: process.env["PAYMENT_TOKEN"]
// })

@Injectable()
export class OrderService {
    constructor(private prisma: PrismaService){}

    // Получение информации только об одном заказе
    async getOrderById(id:number) {
        const product = await this.prisma.order.findUnique({
            where:{
                id
            }, 

            include:{
                items:{
                    include:{
                        product: {
                            select: orderReturnObject
                        }
                    }
                }, 
            }
        })
        if(!product) {
            throw new Error("Product not fount")
        }
        return product
    }
    // Получение всех заказов на сайте
    async getAll(){
        return this.prisma.order.findMany({
            orderBy:{
                createdAt: "desc"
            },
            include:{
                user:{
                    select: returnUserObject
                },
                items:{
                    include:{
                        product: {
                            select: orderReturnObject
                        }
                    }
                }, 
            }
        })
    }
    // Получение пользователем его заказов
    async getByUserId(userId: number){
        return this.prisma.order.findMany({
            where:{
                userId
            }, 
            orderBy:{
                createdAt: "desc"
            },
            include:{
                items:{
                    include:{
                        product: {
                            select: productReturnObject
                        }
                    }
                }
            }
        })
    }
    
    //Удаление заказа
    async deleteOrder(orderId: number) { 
        const product = await this.prisma.orderItem.deleteMany({
            where:{
                orderId          
            }
        })
        if(!product) {
            throw new Error("Произошла ошибка")
        }

        return this.prisma.order.delete({
            where:{
                id: orderId
            }
        })
    }


    async  placeOrder (dto: OrderDto, userId: number){
        const total = dto.items.reduce((acc, item)=>{
            return acc + item.price * item.quantity
        }, 0)

        const order = this.prisma.order.create({
            data:{
                status: dto.status,
                items:{

                    create:dto.items
                
                }, 
                total,
                user: {
                    connect:{
                        id: userId
                    }
                },
                
            }
        })
        // const payment = await yooKassa.createPayment({
        //     amount:{
        //         value: total.toFixed(2),
        //         currency: "RUB"
        //     },
        //     payment_method_data:{
        //         type:"bank_card"
        //     },
        //     confirmation:{
        //         type: "redirect", 
        //         return_url: "https://localhost:3000/thanks"
        //     },
        //     description: `Заказ под номером #${(await order).id}`
        // })

        return  order
        // payment
    }

    // async updateStatus(dto: PaymentStatusDto){
    //     if(dto.event==="payment.waiting_for_capture"){
    //         const payment = await yooKassa.capturePayment(dto.object.id)
    //         return payment
    //     }
    //     if(dto.event === "payment.succeeded"){
    //         // console.log(dto)
    //         const orderId = Number(dto.object.description.split("#")[1])
    //         await this.prisma.order.update({
    //             where:{
    //                 id: orderId
    //             }, 
    //             data:{
    //                 status: EnumOrderStatus.PAYED
    //             }
    //         })
    //         return true
    //     }
    //     return true
    // }
}
