/**
 * rating lifecycle hooks
 * 
 * Grants EXP to the user when they rate a manga.
 * Each new rating gives +3 EXP via the user-level service.
 * 
 * Note: Rating uses an upsert pattern on frontend (one rating per user per story),
 * so afterCreate only fires for the FIRST rating per story — no EXP farming possible.
 * Subsequent score changes trigger UPDATE, not CREATE.
 */

export default {
    async afterCreate(event) {
        const { result } = event;

        try {
            // Extract user ID from the created rating
            let userId: number | null = null;

            if (result.user) {
                userId = typeof result.user === "object" ? result.user.id : result.user;
            }

            if (!userId) {
                strapi.log.debug("[Level] Rating created without user, skipping EXP grant");
                return;
            }

            // Grant EXP for rating a manga
            const levelService = strapi.service("api::user-level.user-level") as any;
            const grantResult = await levelService.grantExp(userId, 3, "rating_given");

            if (grantResult?.leveledUp) {
                strapi.log.info(
                    `[Level] 🎉 User #${userId} leveled up to ${grantResult.newLevel} after rating!`
                );
            }
        } catch (error) {
            // Never let EXP errors break the rating flow
            strapi.log.error(`[Level] Error granting EXP in rating lifecycle:`, error);
        }
    },
};
