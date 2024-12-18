const missingFields = [];
export async function validateRequest(requiredFields, req) {
    for (const field of requiredFields) {
        if (!req.body[field]) missingFields.push(field);
    }
    
    if (missingFields.length > 0) return {error: 'Campos necessários faltando',missingFields};

    return { success: 'Requisição correta'}
}