import * as controllers from '../controllers'
import express from 'express'
import { isCreatorOrAdmin } from '../middlewares/verify_role'
import verifyToken from '../middlewares/verify_token'
import uploadCloud from '../middlewares/uploader'


const router = express.Router()
//PUBLIC ROUTE
router.get('/',controllers.getBooks)

//PRIVATE ROUTE
router.use(verifyToken)
router.use(isCreatorOrAdmin)
router.post('/',uploadCloud.single('image'), controllers.createNewBook)
router.put('/',uploadCloud.single('image'), controllers.updateBook)
router.delete('/', controllers.deleteBook)


module.exports = router