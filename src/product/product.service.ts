import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { productReturnObject, productReturnObjectFullest } from './return-product.object';
import { ProductDto, ProductUpdateDto } from './dto/product.dto';
import { Prisma } from '@prisma/client';
import { generateSlug } from 'src/utils/generate-slug';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto';
import { PaginationService } from 'src/pagination/pagination.service';
import { convertToNumber } from 'src/utils/convert-to-number';
import { FilesService } from 'src/files/files.service';


@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService, 
        private paginationService: PaginationService, 
        private filesService: FilesService,
    ){}


    async getAll(dto: GetAllProductDto = {}){
        const {perPage, skip}= this.paginationService.getPagination(dto)

        const filters = this.createFilter(dto)

        const products = await this.prisma.product.findMany({
            where: filters,
            orderBy: this.getSortOption(dto.sort), 
            skip, 
            take: perPage, 
            select:productReturnObject
        })

        return {
            products, 
            length: await this.prisma.product.count({
                where: filters
            })
        }

    }

    async getAllDiscount(){
        const products = await this.prisma.product.findMany({
            where:{
                isDiscount:{
                    not: false
                }
            }
        })
        return {
            products, 
            length: await this.prisma.product.count
        }

    }

    private createFilter(dto:GetAllProductDto): Prisma.ProductWhereInput{
        const filters: Prisma.ProductWhereInput[] = []

        if(dto.searchTerm) 
            filters.push(this.getSearchTermFilter(dto.searchTerm))
        if(dto.ratings) 
            filters.push(this.getRatingFilter(dto.ratings.split("|").map(rating=>+rating)))
        if(dto.minPrice || dto.maxPrice)
            filters.push(this.getPriceFilter(
            convertToNumber(dto.minPrice), 
            convertToNumber(dto.maxPrice)
        ))
        if(dto.categoryId)
            filters.push(this.getCategoryFilter(+dto.categoryId))

        return filters.length ? {AND: filters} : {}
    }

    private getSortOption(sort:EnumProductSort)
        :Prisma.ProductOrderByWithRelationInput[]{
        switch(sort){
            case EnumProductSort.LOW_PRICE:
                return [{price:"asc"}]
            case EnumProductSort.HIGH_PRICE:
                return [{price:"desc"}]
            case EnumProductSort.OLDEST:
                return [{createdAt:"asc"}]
            default:
                return [{createdAt:"desc"}]
        }
    }

    private getSearchTermFilter(searchTerm: string): Prisma.ProductWhereInput{
        return {
            OR:[
                {
                    category:{
                        name:{
							contains: searchTerm, 
							mode: "insensitive"
                        }
                    }
                },
                {
                    name: {
                        contains: searchTerm, 
                        mode: "insensitive"
                    }
                }, 
                {
                    description: {
                        contains: searchTerm, 
                        mode: "insensitive"
                    }
                }                    
            ]
        }       
    }

    private getRatingFilter(ratings: number[]): Prisma.ProductWhereInput{
        return{
            reviews:{
                    some:{
                        rating:{
                            in: ratings
                    }
                }
            }
        }
    }

    private getPriceFilter(minPrice?:number, maxPrice?: number):Prisma.ProductWhereInput{
        let priceFilter: Prisma.IntFilter | undefined = undefined

        if(minPrice){
            priceFilter = {
                ...priceFilter,
                gte: minPrice
            }
        }
        if(maxPrice){
            priceFilter = {
                ...priceFilter,
                lte: maxPrice
            }
        }
        return {
            price: priceFilter
        }
    }

    private getCategoryFilter(categoryId: number):Prisma.ProductWhereInput{
        return{
            categoryId
        }
    }

    async byId(id:number){
        const product = await this.prisma.product.findUnique({
            where:{
                id
            }, 
            select: productReturnObjectFullest
        })
  
        if(!product) {
            throw new Error("Product not fount")
        }
  
        return product
    }

    async bySlug(slug:string){
        const product = await this.prisma.product.findUnique({
            where:{
                slug
            }, 
            select: productReturnObjectFullest
        })
    
        if(!product) {
            throw new NotFoundException("Product not fount")
        }
    
        return product
    }

    async byCategory(categorySlug:string){
        const products = await this.prisma.product.findMany({
            where:{
                category:{
                    slug:categorySlug
                }
            }, 
            select: productReturnObjectFullest
        })

        if(!products) {
            throw new NotFoundException("Products not fount")
        }

        return products
    }

    async getSimilar(id:number){
        const currentProduct = await this.byId(id)

        // if(!currentProduct) {
        //     throw new NotFoundException("Current product not fount")
        // }
        if(!currentProduct.category || !currentProduct.category.name) {
            return [];
        }
        const products = await this.prisma.product.findMany({
            where:{
                category:{
                    name: currentProduct.category.name
                }, 
                NOT: {
                    id: currentProduct.id
                }
            }, 
            orderBy:{
                createdAt:"desc"
            }, 
            select: productReturnObject
        })
        return products
    }
 
    async create(dto: ProductDto) {
        const product = await this.prisma.product.create({
            data: {
                ...dto,
                price: Number(dto.price),
                categoryId: Number(dto.categoryId),
                slug: generateSlug(dto.name),
            },
        });
    
        return product.id;
    }

    async update(id:number, dto: ProductUpdateDto){
        const {description, price, categoryId, measure, isDiscount, isStock} = dto
    
        return this.prisma.product.update({
            where:{
                id
            }, 
            data:{
                description, 
                price: +price,  
                measure,
                categoryId: +categoryId,
                isDiscount, 
                isStock
            }
        })
    } 

    async delete(id: number) {
        try {
            const product = await this.prisma.product.findUnique({
                where: {
                    id: +id
                }
            });
            if (!product) {
                return { message: 'Товар не найден' };
            }
            const existingOrders = await this.prisma.orderItem.findMany({
                where: {
                  productId: id
                }
            });
         
            if (existingOrders && existingOrders.length > 0) {
                return { message: 'Нельзя удалить товар, так как на него есть ссылки в заказах' };
            }
            await this.prisma.review.deleteMany({
                where: {
                    productId: id
                }
            });
            for (const url of product.images) {
                const img = url.replace(`${process.env.SERVER_UPLOADS}/`, '');
                this.filesService.deleteImage(img);
            }
    
            return this.prisma.product.delete({
                where: {
                    id
                }
            });
        } catch (error) {
            return { message: 'Произошла ошибка при удалении товара' };
        }
    }
}
