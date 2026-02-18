/**
 * reading-history lifecycle hooks
 * 
 * Hooks into the reading-history content type to automatically
 * grant EXP when a user reads a new story for the first time.
 * 
 * Flow:
 *   User reads chapter → Frontend calls POST /reading-histories (first time for this story)
 *   → afterCreate fires → Grant EXP via user-level service
 * 
 * Note: saveHistory in frontend uses upsert pattern:
 *   - CREATE only fires for the FIRST chapter of each story per user
 *   - Subsequent chapters of the same story trigger UPDATE (no EXP granted)
 *   This naturally prevents EXP farming by re-reading the same story.
 */

export default {
    async afterCreate(event) {
        const { result } = event;

        try {
            // Extract user ID from the created reading-history
            // Strapi v5: result.user can be an object or just an ID
            let userId: number | null = null;

            if (result.user) {
                userId = typeof result.user === "object" ? result.user.id : result.user;
            }

            if (!userId) {
                strapi.log.debug("[Level] Reading history created without user, skipping EXP grant");
                return;
            }

            // Grant EXP for reading a new story (+10 = EXP_REWARDS.CHAPTER_READ)
            const levelService = strapi.service("api::user-level.user-level") as any;
            const grantResult = await levelService.grantExp(userId, 10, "chapter_read");

            if (grantResult?.leveledUp) {
                strapi.log.info(
                    `[Level] 🎉 User #${userId} leveled up to ${grantResult.newLevel} after reading!`
                );
            }
        } catch (error) {
            // Never let EXP errors break the reading experience
            strapi.log.error(`[Level] Error granting EXP in reading-history lifecycle:`, error);
        }
    },
};
