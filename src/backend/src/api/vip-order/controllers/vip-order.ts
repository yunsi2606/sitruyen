/**
 * vip-order controller
 *
 * Custom endpoints:
 *   POST /vip-orders/create   – User creates a new order
 *   GET  /vip-orders/check/:code  – Poll order status
 *   POST /vip-orders/sepay-webhook – SePay callback (public)
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::vip-order.vip-order', ({ strapi }) => ({

    /**
     * POST /api/vip-orders/create
     * Body: { plan: "1month" | "3months" | "6months" }
     * Requires authenticated user.
     */
    async createOrder(ctx) {
        const user = ctx.state.user;
        if (!user) {
            return ctx.unauthorized('You must be logged in to purchase VIP.');
        }

        const { plan } = ctx.request.body as any;
        if (!plan) {
            return ctx.badRequest('Missing plan selection.');
        }

        try {
            const order = await strapi.service('api::vip-order.vip-order').createOrder(user.id, plan);

            // Build bank transfer info for frontend
            const bankInfo = {
                bank_id: process.env.SEPAY_BANK_ID || 'BIDV',
                account_number: process.env.SEPAY_ACCOUNT_NUMBER || '',
                account_name: process.env.SEPAY_ACCOUNT_NAME || 'SITRUYEN',
                amount: order.amount,
                content: order.order_code,
                qr_url: `https://qr.sepay.vn/img?bank=${process.env.SEPAY_BANK_ID || 'MBBank'}&acc=${process.env.SEPAY_ACCOUNT_NUMBER || ''}&template=compact&amount=${order.amount}&des=${order.order_code}`,
            };

            ctx.body = {
                success: true,
                order: {
                    id: order.id,
                    order_code: order.order_code,
                    amount: order.amount,
                    duration_days: order.duration_days,
                    status: order.status,
                    note: order.note,
                },
                bank: bankInfo,
            };
        } catch (err: any) {
            if (err.message === 'INVALID_PLAN') {
                return ctx.badRequest('Invalid plan selected.');
            }
            strapi.log.error(`[VIP] Create order failed: ${err.message}`);
            return ctx.internalServerError('Failed to create order.');
        }
    },

    /**
     * GET /api/vip-orders/check/:code
     * Public polling endpoint to check if an order has been paid.
     */
    async checkStatus(ctx) {
        const { code } = ctx.params;
        if (!code) {
            return ctx.badRequest('Missing order code.');
        }

        const orders = await strapi.entityService.findMany('api::vip-order.vip-order', {
            filters: { order_code: code } as any,
        });

        const order = (orders as any[])?.[0];
        if (!order) {
            return ctx.notFound('Order not found.');
        }

        ctx.body = {
            status: order.status,
            paid_at: order.paid_at,
        };
    },

    /**
     * POST /api/vip-orders/sepay-webhook
     * Called by SePay when a transaction is detected.
     *
     * SePay sends JSON with fields:
     *   id, gateway, transactionDate, accountNumber,
     *   content, transferType, transferAmount, accumulated,
     *   subAccount, referenceCode, code, description
     *
     * We match the "code" or "content" field against our order_code.
     */
    async sepayWebhook(ctx) {
        const body = ctx.request.body as any;

        // Validate webhook secret (API Key auth)
        const webhookSecret = process.env.SEPAY_WEBHOOK_SECRET;
        if (webhookSecret) {
            const authHeader = ctx.request.headers['authorization'];
            const apiKey = ctx.request.headers['x-api-key'];
            const token = apiKey || authHeader?.replace('Apikey ', '');

            if (token !== webhookSecret) {
                strapi.log.warn('[VIP Webhook] Invalid webhook secret');
                return ctx.unauthorized('Invalid webhook secret.');
            }
        }

        // Only process incoming transfers
        if (body.transferType !== 'in') {
            ctx.body = { success: true, message: 'Ignored outgoing transfer' };
            return;
        }

        strapi.log.info(`[VIP Webhook] Received: amount=${body.transferAmount}, code=${body.code}, content=${body.content}`);

        // SePay auto-detects payment code in the "code" field
        // Fallback: try to extract from "content" field
        let paymentCode = body.code || '';
        if (!paymentCode) {
            // Try regex match for PREFIX+6chars pattern
            const prefix = process.env.SEPAY_PREFIX || 'ST';
            const regex = new RegExp(`${prefix}[A-Z0-9]{6}`, 'i');
            const match = (body.content || '').match(regex);
            if (match) {
                paymentCode = match[0].toUpperCase();
            }
        }

        if (!paymentCode) {
            strapi.log.warn('[VIP Webhook] No payment code detected in transaction');
            ctx.body = { success: true, message: 'No payment code found' };
            return;
        }

        // Fulfill the order
        const result = await strapi.service('api::vip-order.vip-order').fulfillOrder(
            paymentCode.toUpperCase(),
            body.id,
            body.referenceCode || '',
            body.transferAmount
        );

        ctx.body = { success: result.success };
    },
}));
