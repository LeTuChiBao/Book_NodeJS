
import { defaults } from 'joi'
import db from '../models'
import {Op } from 'sequelize'
import { v4 as generateId } from 'uuid'
const cloudinary = require('cloudinary').v2;
//CRUD
// >> READ
export const getBooks = ({page, limit, orderBy,orderType ,name,...query}) => new Promise( async (resolve, reject) => {
  
    const queries = {raw : true , nest: true}
    const offset = (!page || +page <=1) ? 0 : (+page  - 1)
    const flimit = +limit || +process.env.LIMIT_BOOK
    queries.offset = offset * flimit
    queries.limit = flimit
    if(orderBy) queries.order = [[orderBy]]
    if(orderType) queries.order[0].push(orderType)
    if(name) query.title = { [Op.substring]: name}

    try {
        const response = await db.Book.findAndCountAll({
            where: query,
            ...queries,
            attributes : {
                exclude: ['category_code']
            },
            include: [
                {model: db.Category, attributes: {exclude : ['createdAt', 'updatedAt']}, as: 'categoryData'}
            ]
        })
        resolve({
            error : response ? 0 : 1,
            message : response ? 'Get Book Success' : 'Cannot found books',
            bookData : response
        })
    } catch (error) {
        reject(error)
    }
})

// >> CREATE
export const createBook = (body, fileData) => new Promise( async (resolve, reject) => {
  
    try {
        const response = await db.Book.findOrCreate({
            where : {title:  body?.title},
            defaults : {
                ...body,
                id : generateId(),
                image : fileData?.path,
                filename : fileData?.filename
            }
         })
        resolve({
            error : response[1] ? 0 : 1,
            message : response[1] ? 'Create book Success' : 'Cannot create book, possibly because title is already duplicated',
            bookData : response
        })
        if(!response[1] && fileData) {
            console.log("Service delete file on clound: "+ fileData.filename)
            cloudinary.uploader.destroy(fileData.filename)
        }
    } catch (error) {
        reject(error)
        if(fileData) cloudinary.uploader.destroy(fileData.filename)
    }
})

// >> UPDATE
export const updatedBook = ({bid,...body}, fileData) => new Promise( async (resolve, reject) => {
  
    try {
        if(fileData) body.image = fileData?.path
        console.log(body)
        const response = await db.Book.update(body,{
            where : {id: bid}
         })
         console.log(response)
        resolve({
            error : response[0] > 0 ? 0 : 1,
            message : response[0] > 0 ? `${response[0]} book updated` : 'Cannot update book/ Book ID not found',
            // bookData : response
        })
        if(response[0]===0 && fileData) {
            console.log("Service updatedBook delete file on clound: "+ fileData.filename)
            cloudinary.uploader.destroy(fileData.filename)
        }
    } catch (error) {
        reject(error)
        if(fileData) cloudinary.uploader.destroy(fileData.filename)
    }
})

// >> DELETE
// [id1, id2]
export const deletedBook = ({bids,filename}) => new Promise( async (resolve, reject) => {
  
    try {
        const response = await db.Book.destroy({
            where : {id: bids}
         })
        resolve({
            error : response > 0 ? 0 : 1,
            message : response > 0 ? `${response} book(s) deleted` : 'Cannot deleted book/ Book ID not found',
            // bookData : response
        })
        if(filename) cloudinary.api.delete_resources(filename, (result)=> {
            console.log(result)
        })
    } catch (error) {
        reject(error)
    }
})