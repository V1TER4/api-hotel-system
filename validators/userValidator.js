import db from '../models/index.js';
import constants from '../constants/index.js';

export async function createUser(req) {
    const validUserType = await constants.userType.isValidUserType(req.user_type_id);
    if (!validUserType) {
        return { error: 'Tipo de usuário inválido!' }
    }

    const validStatus = await constants.status.isValidStatus(req.status_id);
    if (!validStatus) {
        return { error: 'Status inválido!' }
    }
    
    const User = db.users;
    const user = await User.findOne({
        where: { 
            email: req.email,
            user_type_id: req.user_type_id
         }
    });
    
    if (user) {
        return { error: 'Usuário já cadastrado!' }
    }
    return { sucess: 'Usuário ainda não existe!' }
}