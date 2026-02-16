/**
 * vip-order custom routes
 */

export default {
    routes: [
        {
            method: 'POST',
            path: '/vip-orders/create',
            handler: 'vip-order.createOrder',
            config: {
                // Requires authenticated user
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'GET',
            path: '/vip-orders/check/:code',
            handler: 'vip-order.checkStatus',
            config: {
                // Public – frontend polls this
                policies: [],
                middlewares: [],
            },
        },
        {
            method: 'POST',
            path: '/vip-orders/sepay-webhook',
            handler: 'vip-order.sepayWebhook',
            config: {
                // Public – SePay calls this
                policies: [],
                middlewares: [],
            },
        },
    ],
};
