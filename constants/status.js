const STATUS = {
    ACTIVE: 1, // Status Ativo
    INACTIVE: 2 // Status Inativo
};

async function isValidStatus(status) {
    return Object.values(STATUS).includes(status);
}

export default {
    STATUS,
    isValidStatus
};
