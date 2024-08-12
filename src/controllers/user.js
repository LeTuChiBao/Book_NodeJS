import * as services from "../services"
import { internalServerError ,badRequest} from '../middlewares/handle_errors'
// import { email, password } from "../helpers/joi_schema"
// import joi from "joi"

export const getUserByToken = async (req,res) => {
    try {
        // id lấy từ property user được gán ở middle ware trước khi chạy tới controller
        const { id } = req.user
        const response = await services.getOne(id)
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}
