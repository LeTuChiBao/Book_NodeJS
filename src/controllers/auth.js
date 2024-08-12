import * as services from "../services"
import { internalServerError ,badRequest, unAuthorized} from '../middlewares/handle_errors'
import { email, password , refreshToken} from "../helpers/joi_schema"
import joi from "joi"

export const register = async (req,res) => {
    try {
        const {error} = joi.object({ email, password}).validate(req.body)
        if(error) return badRequest(error.details[0]?.message , res)
        const response = await services.register(req.body)
        return res.status(201).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const login = async (req,res) => {
    try {
        const {error} = joi.object({ email, password}).validate(req.body)
        if(error) return badRequest(error.details[0]?.message , res)
        const response = await services.login(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const refreshTokenController = async (req,res) => {
    try {
        const {error} = joi.object({refreshToken}).validate(req.body)
        if(error) return badRequest(error.details[0]?.message , res)
        const response = await services.refreshToken(req.body)
        if(response?.error !== 0) {
            console.log('Controller export error')
            return unAuthorized(response?.message,res)
        }
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}