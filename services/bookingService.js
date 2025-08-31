export async function calculateBooking(request) {
    const { default: constants } = await import('../constants/index.js');
    const { default: db } = await import('../models/index.js');

    const room = await db.hotel_rooms.findOne({
        where: { id: request.room_id },
        include: [
            { model: db.hotels, as: 'hotel' }
        ]
    });

    const totalDays = Math.ceil((new Date(request.check_out) - new Date(request.check_in)) / (1000 * 60 * 60 * 24));
    const totalAmount = totalDays * room.price;

    const checkinDate = new Date(request.check_in.replace(" ", "T"));
    const checkoutDate = new Date(request.check_out.replace(" ", "T"));

    const booking = {
        user_id: request.user_id,
        room_id: request.room_id,
        hotel_id: room.hotel_id,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        status_id: constants.status.BOOKING_STATUS.PENDING,
        total_value: totalAmount,
        total_guests: request.total_guests,
        reservation_date: new Date(),
    };

    return booking;
}

export async function updateBooking(request, transaction) {
    const { default: constants } = await import('../constants/index.js');
    const { default: db } = await import('../models/index.js');

    const room = await db.hotel_rooms.findOne({
        where: { nsu: req.body.MerchantOrderId },
    });
    if (!room) {
        return { error: 'Room not found!' };
    }

    await room.update({
        status_id: constants.status.BOOKING_STATUS.CONFIRMED,
        transaction_id: transaction.id
    }, {
        where: { nsu: req.body.MerchantOrderId }
    });
}