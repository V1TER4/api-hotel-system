const USERTYPE = {
    ADMIN: 1,
    SYSTEM: 2,
    USER: 3
};

async function isValidUserType(userType) {
    return Object.values(USERTYPE).includes(userType);
}

export default {
    USERTYPE,
    isValidUserType
};

