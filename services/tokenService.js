import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'; // Defina sua chave secreta no .env
const DEFAULT_EXPIRY_TIME = '2h'; // Padrão de 2 horas

/**
 * Gera um token JWT.
 * @param {Object} payload - Os dados que você deseja incluir no token.
 * @returns {string} - O token JWT gerado.
 */
export async function validToken(user) {
    try {
        const token = user.token;
        const decoded = jwt.verify(token, SECRET_KEY);

        return { decoded };
    } catch (error) {
        return false
    }
}

export async function generateToken(payload) {
    const expiresIn = process.env.TOKEN_EXPIRY_TIME || DEFAULT_EXPIRY_TIME;

    const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn });
    return { token: newToken };
}
export default { validToken, generateToken }