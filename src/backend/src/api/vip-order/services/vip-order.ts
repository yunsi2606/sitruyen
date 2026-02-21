/**
 * vip-order service
 *
 * Handles VIP order creation, status checking, and
 * plan activation upon successful payment.
 *
 * NOTE on strapi.db.query vs entityService:
 * We deliberately use `strapi.db.query()` for write operations (create/update)
 * because it accepts `data` as a loose `Record<string, unknown>`, whereas
 * `entityService.create/update` expects the Strapi-generated strict `Input<T>`,
 * which causes TS2322 errors that can only be worked around with `as any`.
 * For read operations (findMany/findOne with populate) we keep entityService
 * since db.query also supports those and both have the same loose return type.
 */

import { factories } from '@strapi/strapi';
import crypto from 'crypto';
import type { VipOrder, VipPlan, StrapiUser } from '../../../types/strapi.d';

interface PlanConfig {
    amount: number;
    days: number;
    label: string;
}

const PLANS: Record<VipPlan, PlanConfig> = {
    '1month': { amount: 49000, days: 30, label: 'VIP 1 Tháng' },
    '3months': { amount: 129000, days: 90, label: 'VIP 3 Tháng' },
    '6months': { amount: 229000, days: 180, label: 'VIP 6 Tháng' },
};

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
    async createOrder(userId: number, plan: string): Promise<VipOrder> {
        const selected = PLANS[plan as VipPlan];
        if (!selected) {
            throw new Error('INVALID_PLAN');
        }

        // Cancel any existing pending orders for this user (prevent spam)
        const pendingOrders = await strapi.db.query('api::vip-order.vip-order').findMany({
            where: { buyer: userId, status: 'pending' },
        }) as VipOrder[];

        for (const old of pendingOrders) {
            await strapi.db.query('api::vip-order.vip-order').update({
                where: { id: old.id },
                data: { status: 'cancelled' },
            });
        }

        // Generate unique order code
        let orderCode = this.generateOrderCode();
        let attempts = 0;
        while (attempts < 5) {
            const existing = await strapi.db.query('api::vip-order.vip-order').findMany({
                where: { order_code: orderCode },
            }) as VipOrder[];
            if (existing.length === 0) break;
            orderCode = this.generateOrderCode();
            attempts++;
        }

        const order = await strapi.db.query('api::vip-order.vip-order').create({
            data: {
                order_code: orderCode,
                amount: selected.amount,
                duration_days: selected.days,
                status: 'pending',
                buyer: userId,
                note: selected.label,
            },
        }) as VipOrder;

        return order;
    },

    /**
     * Called by SePay webhook when a matching payment arrives.
     * Activates VIP for the buyer.
     */
    async fulfillOrder(
        orderCode: string,
        transactionId: string,
        reference: string,
        paidAmount: number,
    ): Promise<{ success: boolean; reason?: string; orderId?: number }> {
        // Find the pending order (with buyer relation populated)
        const orders = await strapi.db.query('api::vip-order.vip-order').findMany({
            where: { order_code: orderCode, status: 'pending' },
            populate: ['buyer'],
        }) as VipOrder[];

        const order = orders?.[0];
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
        await strapi.db.query('api::vip-order.vip-order').update({
            where: { id: order.id },
            data: {
                status: 'paid',
                paid_at: new Date().toISOString(),
                sepay_transaction_id: String(transactionId),
                sepay_reference: reference || '',
            },
        });

        // Activate VIP for user
        const buyerRaw = order.buyer;
        const buyerId = typeof buyerRaw === 'object' && buyerRaw !== null
            ? (buyerRaw as StrapiUser).id
            : (buyerRaw as number | undefined);

        if (buyerId) {
            // Calculate new expiry: extend from current expiry if still active, otherwise from now
            const user = await strapi.db.query('plugin::users-permissions.user').findOne({
                where: { id: buyerId },
                select: ['id', 'vip_expired_at'],
            }) as Pick<StrapiUser, 'id' | 'vip_expired_at'> | null;

            let baseDate = new Date();
            if (user?.vip_expired_at && new Date(user.vip_expired_at) > baseDate) {
                baseDate = new Date(user.vip_expired_at); // Extend from current expiry
            }
            const newExpiry = new Date(baseDate.getTime() + order.duration_days * 24 * 60 * 60 * 1000);

            await strapi.db.query('plugin::users-permissions.user').update({
                where: { id: buyerId },
                data: {
                    plan: 'vip',
                    vip_expired_at: newExpiry.toISOString(),
                },
            });

            strapi.log.info(`[VIP] Activated VIP for user ${buyerId} until ${newExpiry.toISOString()}`);
        }

        return { success: true, orderId: order.id };
    },

    /**
     * Expire old pending orders (older than 30 minutes).
     * Can be called by cron.
     */
    async expireStaleOrders(): Promise<void> {
        const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        const stale = await strapi.db.query('api::vip-order.vip-order').findMany({
            where: {
                status: 'pending',
                createdAt: { $lt: thirtyMinAgo },
            },
        }) as VipOrder[];

        for (const order of stale) {
            await strapi.db.query('api::vip-order.vip-order').update({
                where: { id: order.id },
                data: { status: 'expired' },
            });
        }

        if (stale.length > 0) {
            strapi.log.info(`[VIP] Expired ${stale.length} stale orders`);
        }
    },
}));
