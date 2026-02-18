/**
 * comment lifecycle hooks
 * 
 * Grants EXP to the user when they post a new comment.
 * Each new comment gives +5 EXP via the user-level service.
 * 
 * Anti-spam note: EXP is granted on every comment create.
 * If spam becomes an issue, consider adding a cooldown or
 * daily cap in the grantExp service layer.
 */

export default {
    async afterCreate(event) {
        const { result } = event;

        try {
            // Extract user ID from the created comment
            let userId: number | null = null;

            if (result.user) {
                userId = typeof result.user === "object" ? result.user.id : result.user;
            }

            if (!userId) {
                strapi.log.debug("[Level] Comment created without user, skipping EXP grant");
                return;
            }

            // Grant EXP for posting a comment
            const levelService = strapi.service("api::user-level.user-level") as any;
            const grantResult = await levelService.grantExp(userId, 5, "comment_post");

            if (grantResult?.leveledUp) {
                strapi.log.info(
                    `[Level] 🎉 User #${userId} leveled up to ${grantResult.newLevel} after commenting!`
                );
            }
        } catch (error) {
            // Never let EXP errors break the comment flow
            strapi.log.error(`[Level] Error granting EXP in comment lifecycle:`, error);
        }
    },
};
