export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  cron: {
    enabled: true,
    tasks: {
      // Run every hour to unlock VIP chapters that have passed the 7-day window
      '0 * * * *': async ({ strapi }) => {
        strapi.log.info('[Cron] Running VIP chapter unlock task...');
        try {
          await strapi.service('api::chapter.chapter').unlockExpiredVipChapters();
        } catch (err: any) {
          strapi.log.error(`[Cron] VIP unlock failed: ${err.message}`);
        }
      },
      // Run every 5 minutes to expire stale pending VIP orders (>30 min old)
      '*/5 * * * *': async ({ strapi }) => {
        try {
          await strapi.service('api::vip-order.vip-order').expireStaleOrders();
        } catch (err: any) {
          strapi.log.error(`[Cron] Expire stale orders failed: ${err.message}`);
        }
      },
    },
  },
});
