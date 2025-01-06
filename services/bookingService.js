// Calculate booking
export async function calculateBooking(requiredFields, request) {
    const { default: constants } = await import('../constants/index.js');
    const { default: db } = await import('../models/index.js');

    const room = await db.hotel_rooms.findOne({
        where: { id: requiredFields.room_id },
        include: [
            { model: db.hotels, as: 'hotel' }
        ]
    });

    const totalDays = Math.ceil((new Date(requiredFields.check_out) - new Date(requiredFields.check_in)) / (1000 * 60 * 60 * 24));
    const totalAmount = totalDays * room.price;

    const checkinDate = new Date(requiredFields.check_in.replace(" ", "T"));
    const checkoutDate = new Date(requiredFields.check_out.replace(" ", "T"));

    const booking = {
        user_id: requiredFields.user_id,
        room_id: requiredFields.room_id,
        hotel_id: room.hotel_id,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        status_id: constants.status.BOOKING_STATUS.PENDING,
        total_value: totalAmount,
        total_guests: requiredFields.total_guests,
        reservation_date: new Date(),
    };

    return booking;
}