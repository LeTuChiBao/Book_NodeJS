
import db from '../models'
import data from '../../data/databook.json'
import { generateCode } from '../helpers/function'

export const insetData = () => new Promise( async (resolve, reject) => {
  
    try {
        //Cách 1 dùng array để loop tạo db
        const categories = Object.keys(data) 
        categories.forEach( async (category) => {
            await db.Category.create({
                code : generateCode(category),
                value: category
            })
        } ) 

        const dataArr = Object.entries(data)
        dataArr.forEach((item)=> {
           item[1]?.map(async (book)=> {
            await db.Book.create({
                id : book.upc,
                title: book.bookTitle,
                price: +book.bookPrice,
                available: +book.available,
                image: book.imgUrl,
                description: book.bookDescription,
                category_code: generateCode(item[0]),
            })
           })
        })
        resolve('OK')
    } catch (error) {
        reject(error)
    }
})
