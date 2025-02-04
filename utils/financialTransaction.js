import db from '../models/index.js';

export async function buildTransactionMessage(booking, request) {
    const bookings = await db.bookings.findOne({
        where: { hotel_id: 1 },
        include: [
            { model: db.booking_status, as: 'status' },
            { model: db.users, as: 'user' },
            { model: db.hotel_rooms, as: 'hotel_room' },
            { model:db.hotels, as: 'hotel'},
        ]
    });
    
    const hotel = await db.hotels.findOne({
        where: { id: bookings.hotel_id},
        include: [
            { model: db.address, as: 'address'}
        ]
    });
    
    const user = await db.users.findOne({
        where: { id: bookings.user_id },
        include: [
            {
                model: db.address, as: 'address',
                include: [
                    { model: db.cities, as: 'city' },
                    { model: db.countries, as: 'country' }
                ]
            },
        ]
    });
    
    const transactionMessage = {
        Customer: {
            Address: {
                Street: user.address.street,
                Number: user.address.number,
                Complement: user.address.complement,
                ZipCode: user.address.postal_code,
                City: user.address.city.name,
                State: user.address.city.uf,
                Country: user.address.country.name
            },
            Name: user.name,
            Email: user.email,
        },
        Payment: {
            Type: "CreditCard",
            CreditCard: {
                CardToken: request.creditCard
            },
            Currency: "BRL",
            Country: "BRA",
            Installments: 1,
            Capture: true,
            Recurrent: "false",
            SoftDescriptor: hotel.name,
            Amount: parseInt(bookings.total_value.toString().replace('.', ''))
        },
        MerchantOrderId: request.nsu
    };
    return transactionMessage;
}
