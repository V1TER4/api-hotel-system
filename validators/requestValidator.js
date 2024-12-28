const missingFields = [];
export async function validateRequest(requiredFields, req) {
    const missingFields = [];

    for (const field of requiredFields) {
        const fieldParts = field.split('.'); // Suporta campos aninhados
        let value = req.body;

        for (const part of fieldParts) {
            value = value?.[part];
            if (value === undefined) break;
        }

        if (value === undefined) missingFields.push(field);
    }

    if (missingFields.length > 0) {
        return {
            error: 'Campos necessários faltando',
            missingFields
        };
    }

    return null; // Indica que a validação passou

}