const STATUS = {
    ACTIVE: 1, // Status Ativo
    INACTIVE: 2 // Status Inativo
};

const BOOKING_STATUS = {
    PENDING: 1, // Status Pendente
    CONFIRMED: 2, // Status Confirmado
    CANCELED: 3 // Status Cancelado
};

async function isValidStatus(status) {
    return Object.values(STATUS).includes(status);
}

export default {
    STATUS,
    BOOKING_STATUS,
    isValidStatus
};
