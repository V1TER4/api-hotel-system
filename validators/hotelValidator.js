import db from '../models/index.js';
import constants from '../constants/index.js';
import validateDocument from '../utils/validateDocument.js';

export async function createHotel(req) {
    const validStatus = await constants.status.isValidStatus(req.status_id);
    if (!validStatus) {
        return { error: 'Invalid status!' }
    }

    const validDocument = validateDocument(req.document);
    if (!validDocument) {
        return { error: 'Invalid document!' }
    }
    
    const Company = db.companies;
    const company = await Company.findOne({
        where: { 
            document: req.document,
        }
    });
    
    if (company) {
        return { error: 'Hotel is already registered!' }
    }
    return null;
}