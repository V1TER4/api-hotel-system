import db from '../models/index.js';

export function buildTransactionMessage(booking) {
    const hotels = db.hotels;
    const hotel = hotels.findOne({
        where: { id: booking.hotel_id },
        include: [
            { model: db.address, as: 'address' }
        ]
    });

    // const user = db.users

    const transactionMessage = {
        Customer: {
            Address: {
                Street: "Rua Teste",
                Number: "123",
                Complement: "AP 123",
                ZipCode: "12345987",
                City: "Rio de Janeiro",
                State: "RJ",
                Country: "BRA"
            },
            Name: "Comprador crédito completo",
            Email: "compradorteste@teste.com",
            Birthdate: "1991-01-02"
        },
        Payment: {

            CreditCard: {
                CardNumber: "1234123412341234",
                Holder: "Teste Holder",
                ExpirationDate: "12/2030",
                SecurityCode: "123",
                Brand: "Visa"
            },
            Currency: "BRL",
            Type: "CreditCard",
            Country: "BRA",
            Installments: 1,
            Capture: true,
            Recurrent: "false",
            SoftDescriptor: "Hotel XYZ",
            Amount: 15700
        },
        MerchantOrderId: "0000001"
    };

    return transactionMessage ;
}
