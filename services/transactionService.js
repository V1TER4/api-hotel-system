export async function checkTransaction(booking, request) {
    const { default: db } = await import('../models/index.js');
    
    const checkTransaction = await db.transaction.findOne({
        where: { 
            nsu: request.nsu,
            amount: booking.total_value
        },
        include: [
            { model: db.transaction_status, as: 'transaction_statuses' }
        ]
    });

    if (checkTransaction) {
        return { error: 'Transaction duplicated!' };
    }
    return { success: 'Success' };    
}

export async function createTransaction(booking, request){
    const transaction = {};
    transaction.nsu = request.body.nsu ;
    transaction.installments = request.body.payment.installments;
    transaction.currency = "BRL";
    transaction.amount = booking.total_value;
    transaction.paymentId = null ;

    return transaction ;
}

export async function validateTransactionConfirm(transaction, status){
}

export async function updateTransaction(request){
    const { default: db } = await import('../models/index.js');
    const { default: constants } = await import('../constants/status.js');
    
    const transactionModel = db.bookings;
    const transaction = transactionModel.findOne({
        where: { nsu: request.MerchantOrderId }
    });
    if (!transaction) {
        return { error: 'Transaction not found!' };
    }

    await transaction.update({
        status_id: constants.status.TRANSACTION_STATUS.CONFIRMED,
        payment_id: request.Payment.ProofOfSale
    }, {
        where: { nsu: request.MerchantOrderId }
    });

    return transaction ;
}