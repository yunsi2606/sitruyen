/**
 * vip-order service
 *
 * Handles VIP order creation, status checking, and
 * plan activation upon successful payment.
 */

import { factories } from '@strapi/strapi';
import crypto from 'crypto';

export default factories.createCoreService('api::vip-order.vip-order', ({ strapi }) => ({

    /**
     * Generate a unique, short, uppercase payment code.
     * Format: <PREFIX><random6chars>  (e.g. STAB12XY)
     */
    generateOrderCode(): string {
        const prefix = process.env.SEPAY_PREFIX || 'ST';
        const rand = crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
        return `${prefix}${rand}`;
    },

    /**
     * Create a new pending VIP order for a user.
     */
    async createOrder(userId: number, plan: string) {
        // Plan config – easy to extend later
        const plans: Record<string, { amount: number; days: number; label: string }> = {
            '1month': { amount: 49000, days: 30, label: 'VIP 1 Tháng' },
            '3months': { amount: 129000, days: 90, label: 'VIP 3 Tháng' },
            '6months': { amount: 229000, days: 180, label: 'VIP 6 Tháng' },
        };

        const selected = plans[plan];
        if (!selected) {
            throw new Error('INVALID_PLAN');
        }

        // Cancel any existing pending orders for this user (prevent spam)
        const pendingOrders = await strapi.entityService.findMany('api::vip-order.vip-order', {
            filters: { buyer: userId, status: 'pending' } as any,
        });

        for (const old of pendingOrders as any[]) {
            await strapi.entityService.update('api::vip-order.vip-order', old.id, {
                data: { status: 'cancelled' } as any,
            });
        }

        // Generate unique order code
        let orderCode = this.generateOrderCode();
        let attempts = 0;
        while (attempts < 5) {
            const existing = await strapi.entityService.findMany('api::vip-order.vip-order', {
                filters: { order_code: orderCode } as any,
            });
            if ((existing as any[]).length === 0) break;
            orderCode = this.generateOrderCode();
            attempts++;
        }

        const order = await strapi.entityService.create('api::vip-order.vip-order', {
            data: {
                order_code: orderCode,
                amount: selected.amount,
                duration_days: selected.days,
                status: 'pending',
                buyer: userId,
                note: selected.label,
            } as any,
        });

        return order;
    },

    /**
     * Called by SePay webhook when a matching payment arrives.
     * Activates VIP for the buyer.
     */
    async fulfillOrder(orderCode: string, transactionId: string, reference: string, paidAmount: number) {
        // Find the pending order
        const orders = await strapi.entityService.findMany('api::vip-order.vip-order', {
            filters: { order_code: orderCode, status: 'pending' } as any,
            populate: ['buyer'],
        });

        const order = (orders as any[])?.[0];
        if (!order) {
            strapi.log.warn(`[VIP] No pending order found for code: ${orderCode}`);
            return { success: false, reason: 'ORDER_NOT_FOUND' };
        }

        // Verify amount (allow small tolerance for bank fees)
        if (paidAmount < order.amount) {
            strapi.log.warn(`[VIP] Underpaid order ${orderCode}: expected ${order.amount}, got ${paidAmount}`);
            return { success: false, reason: 'UNDERPAID' };
        }

        // Mark order as paid
        await strapi.entityService.update('api::vip-order.vip-order', order.id, {
            data: {
                status: 'paid',
                paid_at: new Date().toISOString(),
                sepay_transaction_id: String(transactionId),
                sepay_reference: reference || '',
            } as any,
        });

        // Activate VIP for user
        const buyerId = order.buyer?.id || order.buyer;
        if (buyerId) {
            // Calculate new expiry: extend from current expiry if still active, otherwise from now
            const user: any = await strapi.entityService.findOne('plugin::users-permissions.user', buyerId);
            let baseDate = new Date();
            if (user?.vip_expired_at && new Date(user.vip_expired_at) > baseDate) {
                baseDate = new Date(user.vip_expired_at); // Extend from current expiry
            }
            const newExpiry = new Date(baseDate.getTime() + order.duration_days * 24 * 60 * 60 * 1000);

            await strapi.entityService.update('plugin::users-permissions.user', buyerId, {
                data: {
                    plan: 'vip',
                    vip_expired_at: newExpiry.toISOString(),
                } as any,
            });

            strapi.log.info(`[VIP] Activated VIP for user ${buyerId} until ${newExpiry.toISOString()}`);
        }

        return { success: true, orderId: order.id };
    },

    /**
     * Expire old pending orders (older than 30 minutes).
     * Can be called by cron.
     */
    async expireStaleOrders() {
        const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        const stale = await strapi.entityService.findMany('api::vip-order.vip-order', {
            filters: {
                status: 'pending',
                createdAt: { $lt: thirtyMinAgo },
            } as any,
        });

        for (const order of stale as any[]) {
            await strapi.entityService.update('api::vip-order.vip-order', order.id, {
                data: { status: 'expired' } as any,
            });
        }

        if ((stale as any[]).length > 0) {
            strapi.log.info(`[VIP] Expired ${(stale as any[]).length} stale orders`);
        }
    },
}));
