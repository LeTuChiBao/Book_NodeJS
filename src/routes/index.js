import user from './user'
import auth from './auth'
import book from './book'
import insertData from './insertData'
import { notFound } from '../middlewares/handle_errors'
const initRoutes = (app) => {
    app.use('/api/v1/user', user)
    app.use('/api/v1/auth', auth)
    app.use('/api/v1/insert', insertData)
    app.use('/api/v1/book', book)

    return app.use('/',notFound)
}
module.exports = initRoutes