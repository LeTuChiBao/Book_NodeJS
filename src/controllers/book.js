import * as services from "../services"
import { internalServerError ,badRequest} from '../middlewares/handle_errors'
import { bid, bids ,title, description, price, available, category_code, image ,filename} from "../helpers/joi_schema"
import joi from "joi"
const cloudinary = require('cloudinary').v2;

export const getBooks = async (req,res) => {
    try {
        const response = await services.getBooks(req.query)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

//Create Book Controller

export const createNewBook = async (req,res) => {
    try {
        const fileData = req.file
        const {error} =joi.object({title,description, price, available, category_code, image}).validate({...req.body, image: fileData?.path})
        if(error) {
            if(fileData) cloudinary.uploader.destroy(fileData.filename)
            console.log('Controller delete image on clound just updated'+ fileData?.filename)
            return badRequest(error.details[0].message,res)
        }
        const response = await services.createBook(req.body,fileData)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

//UPDATE book controller

export const updateBook = async (req,res) => {
    try {
        console.log(req.body)
        const fileData = req.file
        console.log(fileData)
        const {error} =joi.object({bid}).validate({bid : req.body.bid })
        console.log(error)
        if(error) {
            if(fileData) cloudinary.uploader.destroy(fileData.filename)
            console.log('Controller updateBook delete image on cloud just updated'+ fileData?.filename)
            return badRequest(error.details[0].message,res)
        }
        console.log('gọi service')
        const response = await services.updatedBook(req.body,fileData)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

//DELETE
export const deleteBook = async (req,res) => {
    try {
        const {error} =joi.object({bids,filename}).validate(req.query)
        if(error) return badRequest(error.details[0].message,res)
        const response = await services.deletedBook(req.query)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}