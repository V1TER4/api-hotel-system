const STATUS = {
    ACTIVE: 1, // Status Ativo
    INACTIVE: 2 // Status Inativo
};

const BOOKING_STATUS = {
    PENDING: 1, // Status Pendente
    CONFIRMED: 2, // Status Confirmado
    CANCELED: 3 // Status Cancelado
};

const TRANSACTION_STATUS = {
    CONFIRMED: 1, // Status Confirmado
    PENDING: 2, // Status Pendente
    DENIED: 3 // Status Cancelado
}

const CIELO_PAYMENT_STATUS = {
    NOT_FINISHED: 0, // Aguardando atualização de status
    AUTHORIZED: 1, // Pagamento apto a ser capturado ou definido como pago
    PAYMENT_CONFIRMED: 2, // Pagamento confirmado e finalizado
    DENIED: 3, // Pagamento negado por Autorizador
    VOIDED: 10, // Pagamento cancelado
    REFUNDED: 11, // Pagamento cancelado após 23h59 do dia de autorização
    PENDING: 12, // Aguardando retorno da instituição financeira
    ABORTED: 13, // Pagamento cancelado por falha no processamento ou por ação do Antifraude
    SCHEDULED: 20 // Só id e descrição
}

async function isValidStatus(status) {
    return Object.values(STATUS).includes(status);
}

export default {
    STATUS,
    BOOKING_STATUS,
    TRANSACTION_STATUS,
    CIELO_PAYMENT_STATUS,
    isValidStatus
};
