import db from '../models/index.js';
import constants from '../constants/index.js';

// Initiate Validator
export async function checkRoomIsAvailable(request) {
    const user = await db.users.findOne({
        where: { id: request.user_id }
    });
    if (user.user_type_id !== constants.userType.USERTYPE.USER) return { error: 'User is not allowed to book a room!' };

    const checkinDate = new Date(request.check_in.replace(" ", "T"));
    const checkoutDate = new Date(request.check_out.replace(" ", "T"));

    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
        return { error: 'Invalid check-in or check-out date!' };
    }

    if (checkinDate >= checkoutDate) {
        return { error: 'Check-out date must be after check-in date!' };
    }
    const filters = {};
    filters.room_id = request.room_id;
    filters.checkin_date = {
        [db.Sequelize.Op.lte]: checkoutDate
    };
    filters.checkout_date = {
        [db.Sequelize.Op.gte]: checkinDate
    };
    filters.status_id = [constants.status.BOOKING_STATUS.CONFIRMED, constants.status.BOOKING_STATUS.PENDING];

    const room = await db.hotel_rooms.findOne({
        where: { id: request.room_id }
    });
    if (!room) return {error: 'Room not found!'};

    const Room = await db.bookings.findOne({
        where: filters
    });
    if (Room) return {error: 'Room is not available for the selected dates!'};

    if (request.total_guests > room.capacity) return {error: 'Total guests exceeds the maximum limit!'};

    return true;
}