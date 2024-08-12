import jwt, { TokenExpiredError } from 'jsonwebtoken'
import {  unAuthorized } from './handle_errors'

const verifyToken = (req,res ,next)=>{

    const token = req.headers.authorization
    if(!token) return unAuthorized('Require Authorization', res)
    const accessToken = token.split(' ')[1]

    // (err,user) là call back trả ra khi giải mã từ token trả ra object (trả ra giống lúc mình đưa object để mã hóa ở auth)
    jwt.verify(accessToken, process.env.JWT_SECRET , (err, user)=> {

        //Check token expired
        if(err) {
            const isExpired = err instanceof TokenExpiredError
            if(isExpired) return unAuthorized('Access token expired ',res)
            return unAuthorized('Access Token invalid',res )
        }
        req.user = user
        next()
    })

}


export default verifyToken