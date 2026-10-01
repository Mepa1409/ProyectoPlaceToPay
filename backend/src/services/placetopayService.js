const axios = require('axios');
const { generateAuth } = require('./placetopayAuth');

async function createPaymentSession(items, payer) {
    const auth = generateAuth();

    const total = items.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);

    const reference = `ORDER-${Date.now()}`;

    const request = {
        locale: 'es_CO',
        auth,
        payer,
        payment: {
            reference,
            description: 'Compra de prueba',
            amount: {
                currency: 'COP',
                total
            }
        },
        expiration: '2026-10-01T23:59:59-05:00',
        returnUrl: 'http://localhost:3000/return',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0'
    };

    const response = await axios.post(
        `${process.env.PLACETOPAY_API_URL}/api/session`,
        request
    );

    return {
        requestId: response.data.requestId,
        processUrl: response.data.processUrl,
        reference,
        total
    };
}
async function getPaymentSession(requestId) {
    const auth = generateAuth();

    const response = await axios.post(
        `${process.env.PLACETOPAY_API_URL}/api/session/${requestId}`,
        {
            auth
        }
    );

    const session = response.data;
    const payment = session.payment?.[0];

    return {
        requestId: session.requestId,
        status: session.status.status,
        message: session.status.message,
        reference: session.request.payment.reference,
        amount: session.request.payment.amount.total,
        currency: session.request.payment.amount.currency,
        paymentStatus: payment?.status?.status || null
    };
}

module.exports = {
    createPaymentSession,
    getPaymentSession
};