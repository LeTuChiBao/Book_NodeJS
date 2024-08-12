import { unAuthorized } from "./handle_errors"

export const isAdmin = (req,res,next) => {
    const {role_code} = req.user
    if(role_code!=='R1') return unAuthorized('Require role Admin',res)
    next()
}

export const isCreatorOrAdmin = (req,res,next) => {
    const {role_code} = req.user
    if(role_code!=='R1' &&role_code!=='R2' ) return unAuthorized('Require role Admin or Monderator',res)
    next()
}