import {ArrayMinSize,  IsBoolean,  IsNumber, IsOptional, IsString, Min } from "class-validator";
import { Prisma } from "@prisma/client";

export class ProductDto implements Prisma.ProductUpdateInput{
    @IsString()
    name: string

    @IsNumber()
    @Min(0)
    price: number

    @IsString()
    measure: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsString({each:true})
    @ArrayMinSize(1)
    // images: Express.Multer.File[] | string[];
    images:string[];
    

    @IsNumber()
    categoryId:number

    @IsOptional()
    @IsString()
    slug:string

}
export class ProductUpdateDto implements Prisma.ProductUpdateInput{
    @IsOptional()
    @IsNumber()
    @Min(0)
    price: number

    @IsString()
    measure: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsNumber()
    categoryId:number

    @IsOptional()
    @IsBoolean()
    isDiscount?: boolean

    @IsOptional()
    @IsBoolean()
    isStock?: boolean
}