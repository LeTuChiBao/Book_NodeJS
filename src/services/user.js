
import db from '../models'


export const getOne = (userId) => new Promise( async (resolve, reject) => {
  
    try {
        const response = await db.User.findOne({
            where: { id : userId },
            attributes : {
                exclude : ['password', 'role_code']
            },
            include: [
                { 
                    model: db.Role, as: 'roleData', 
                    attributes: ['id', 'code', 'value']
                }
            ]
        })
    
        resolve({
            error : response ? 0 : 1,
            message : response ? 'Get User Success' : 'User not found',
            userData : response
        })
    } catch (error) {
        reject(error)
    }
})