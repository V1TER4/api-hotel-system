import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'; // Defina sua chave secreta no .env

/**
 * Gera um token JWT.
 * @param {Object} payload - Os dados que você deseja incluir no token.
 * @returns {string} - O token JWT gerado.
 */
export function validateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return res.status(401).json({ message: 'Token não fornecido ou mal formatado.' });
    
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(401).json({ message: 'Token expirado.' });

        console.log('============ Houve o seguinte erro ================');
        console.log(err)
        return res.status(403).json({ message: 'Token inválido.' });
    }
}
