import bcrypt from 'bcrypt';

export async function validPassword(password, requesrPwd) {
    const pwd = await bcrypt.compare(password, requesrPwd);

    return pwd
}

export async function encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    
    return await bcrypt.hash(password, salt);

}