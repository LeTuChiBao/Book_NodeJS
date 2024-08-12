
import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { where } from 'sequelize'
import { badRequest, unAuthorized } from '../middlewares/handle_errors'

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8))

export const register = ({email,password}) => new Promise( async (resolve, reject) => {
  
    try {
        const response = await db.User.findOrCreate({
            where: {email},
            defaults: {
                email,
                password: hashPassword(password)
            }
        })
        const accessToken = response[1] ? jwt.sign({
            id: response[0].id,
            email: response[0].email,
            role_code: response[0].role_code

        }, process.env.JWT_SECRET, {
            expiresIn: '30s'
        }) : null

        const refreshToken = response[1] ? jwt.sign({id: response[0].id }, 
            process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '1d'}) : null

        resolve({
            error : response[1] ? 0 : 1,
            message : response[1] ? 'Successful registration' : 'Email has been registered',
            'access_token' : accessToken ?  `Bearer ${accessToken}` : accessToken,
            'refresh_token' : refreshToken
        })

        if(refreshToken) {
            await db.User.update({
                refresh_token : refreshToken
            }, {
                where : {id: response[0].id}
            })
        }
    } catch (error) {
        reject(error)
    }
})

export const login = ({email,password}) => new Promise( async (resolve, reject) => {
  
    try {
        const response = await db.User.findOne({
            where: {email},
            raw: true
        })
        const isCheckedPass = response && bcrypt.compareSync(password,response.password)
        const accessToken = isCheckedPass ? jwt.sign({
            id: response.id,
            email: response.email,
            role_code: response.role_code

        }, process.env.JWT_SECRET, {
            expiresIn: '30s'
        }) : null

        const refreshToken = isCheckedPass ? jwt.sign({id: response.id }, 
            process.env.JWT_SECRET_REFRESH_TOKEN, { expiresIn: '1d'}) : null

       
        resolve({
            error : accessToken ? 0 : 1,
            message : accessToken ? 'Login Successfully' : response ? 'password was wrong' : 'Email has not been registered',
            'access_token': accessToken ? `Bearer ${accessToken}` : null,
            'refresh_token' : refreshToken
        })

        if(refreshToken && isCheckedPass) {
            await db.User.update(
                {refresh_token : refreshToken }, 
                { where : {id: response.id} }
            )
        }
    } catch (error) {
        reject(error)
    }
})


export const refreshToken = ({refreshToken}) => new Promise( async (resolve, reject) => {
  
    try {
        const response = await db.User.findOne({
            where : {refresh_token : refreshToken}
        })
        if(response) {
            jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, (error)=> {
                if(error) {
                    resolve({
                        error : 2,
                        message : 'Refresh Token expired. Require login'
                    })
                }else {
                    const access_token = jwt.sign({
                        id: response.id,
                        email: response.email,
                        role_code: response.role_code
            
                    }, process.env.JWT_SECRET, {
                        expiresIn: '30s'
                    }) 

                    resolve({
                        error : access_token ? 0 : 1,
                        message : access_token? 'Generate new access token success ' : 'Fail to generate new access token  . Let try more time',
                        'access_token' : `Bearer ${access_token}`,
                        'refresh_token' : refreshToken
                    })
                }
            })
        }

        resolve({
            error : 1,
            message : 'Refresh token invalid'
        })

    } catch (error) {
        reject(error)
    }
})