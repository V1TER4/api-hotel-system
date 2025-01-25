import db from '../models/index.js';
import { Op, where } from 'sequelize';

export async function createAddress(req) {
    const Cities = db.cities;
    const city = await Cities.findOne({
        where: { 
            id: req.address.city_id
         }
    });
    
    if (!city) return { error: 'City not found!' }

    const Country = db.countries;
    const country = await Country.findOne({
        where: { 
            id: req.address.country_id
         }
    });
    if (!country) return { error: 'Country not found!' }

    const States = db.states;
    const state = await States.findOne({
        where: {
            id: req.address.state_id
        }
    });
    if (!state) return { error: 'State not found!' }

    return null;
}