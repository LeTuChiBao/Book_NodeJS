import * as controllers from '../controllers'
import express from 'express'
import verifyToken from '../middlewares/verify_token'
import {isAdmin, isCreatorOrAdmin} from '../middlewares/verify_role'

const router = express.Router()
//PUBLIC ROUTE


//những thèn nằm dưới thì sẽ chạy qua verify token rồi mới tới chạy vào route get

//PRIVATE ROUTE
router.use(verifyToken)
router.use(isCreatorOrAdmin)
router.get('/', controllers.getUserByToken)

module.exports = router