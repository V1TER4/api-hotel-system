import { json } from 'sequelize';

export async function CieloCardToken(creditCard) {
    const { default: db } = await import('../models/index.js');
    const merchantId = await db.parameter.findOne({
        where: { code: 'CIELO_CLIENT_ID' }
    });
    if (!merchantId){
        console.log(merchantId)
        return 'Parameter CIELO_CLIENT_ID Not Found';
    }
    const merchantSecret = await db.parameter.findOne({
        where: { code: 'CIELO_CLIENT_SECRET' }
    });
    if (!merchantSecret){
        return 'Parameter CIELO_CLIENT_SECRET Not Found';
    }
    const urlConsult = await db.parameter.findOne({
        where: { code: 'CIELO_CONSULT_URL_API' }
    });
    if (!urlConsult){
        return 'Parameter CIELO_CONSULT_URL_API Not Found';
    }
    const url = await db.parameter.findOne({
        where: { code: 'CIELO_URL_API' }
    });
    if (!url){
        return 'Parameter CIELO_URL_API Not Found';
    }
    const card = {};
    card.ExpirationDate = creditCard.expiration_date ;
    card.CustomerName = creditCard.customer_name;
    card.CardNumber = creditCard.card_number ;
    card.Holder = creditCard.holder ;

    try {
        const binCard = creditCard.card_number.substring(0, 6);
        const response = await fetch(urlConsult.value + '/1/cardBin/' + binCard, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'MerchantId': merchantId.value,
                'MerchantKey': merchantSecret.value
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching card bin: ${response.statusText}`);
        }

        const json = await response.json();
        card.Brand = json.Provider;
    } catch (err) {
        console.error('Fetch error:', err);
    }

    try {
        const tokenResponse = await fetch(url.value + '/1/card/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'MerchantId': merchantId.value,
                'MerchantKey': merchantSecret.value
            },
            body: JSON.stringify(card)
        });

        if (!tokenResponse.ok) {
            throw new Error(`Error fetching token card: ${tokenResponse.statusText}`);
        }

        const tokenCard = await tokenResponse.json();
        return tokenCard.CardToken;
    } catch (err) {
        console.error('Fetch error:', err);
        return 'Error fetching token card';
    }
}