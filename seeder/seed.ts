import { PrismaClient, Product } from "@prisma/client"
import *as  dotenv from "dotenv"
import { faker } from "@faker-js/faker"
import { generateSlug } from "./../src/utils/generate-slug"
import { getRandomNumber } from "./../src/utils/random-number"

dotenv.config()
const prisma = new PrismaClient()

const createProducts = async(quantity: number)=>{
    const products: Product[] =[]
    for(let i = 0; i< quantity; i++){
        const productName = faker.commerce.productName()
        const categoryName = faker.commerce.department()

        const product = await prisma.product.create({
            data:{
                name: productName,
                slug: generateSlug(productName),
                description:faker.commerce.productDescription(),
                price: +faker.commerce.price(),
                measure: "м",
                images: Array.from({length:getRandomNumber(2, 6)}).map(()=>
                // faker.image.urlPicsumPhotos({ width: 128 })
                `/uploads/${faker.number.int({min: 1, max:5})}.jpg`
                ),
                category:{
                    create:{
                        name: categoryName, 
                        slug: generateSlug(categoryName),
                        images: faker.animal.cat()
                    }
                },
                reviews:{
                    create:[
                    {
                        rating: faker.number.int({min: 1, max:5}),
                        text: faker.lorem.paragraph(),
                        user:{
                            connect:{
                                id:1
                            }
                        }
                    },
                    {
                        rating: faker.number.int({min: 1, max:5}),
                        text: faker.lorem.paragraph(),
                        user:{
                            connect:{
                                id:1
                            }
                        }
                    }
                ]
                }
            }
 
        })
        products.push(product)

    }
    // console.log(`created ${products.length} products`)

}
async function main(){
    // console.log("start seeding...")
    await createProducts(10)
}

main()
.catch(e=>console.error(e))
.finally(async()=>{
    await prisma.$disconnect()
})