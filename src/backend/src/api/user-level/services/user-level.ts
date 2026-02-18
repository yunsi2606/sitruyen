/**
 * user-level service
 * 
 * Core logic for the Level / EXP gamification system.
 * Handles level configuration, EXP granting, level-up detection,
 * and reward assignment (avatar frames, name colors, wibu badges).
 */

// ─── Level Configuration ────────────────────────────────────────
// Each level defines: EXP threshold, frame key, frame image path,
// name color, wibu title (long), and badge (short tag for comments).

const LEVEL_CONFIG = [
    {
        level: 1, expRequired: 0,
        frame: "default", frameImage: null,
        nameColor: "#ffffff",
        title: "Kouhai", badge: "後輩 Kouhai",
    },
    {
        level: 2, expRequired: 50,
        frame: "bronze", frameImage: "/frame_bronze.png",
        nameColor: "#cd7f32",
        title: "Nakama", badge: "仲間 Nakama",
    },
    {
        level: 3, expRequired: 150,
        frame: "silver", frameImage: "/frame_silver.png",
        nameColor: "#c0c0c0",
        title: "Senpai", badge: "先輩 Senpai",
    },
    {
        level: 4, expRequired: 300,
        frame: "gold", frameImage: "/frame_gold.png",
        nameColor: "#a855f7",
        title: "Otaku Sage", badge: "賢者 Otaku Sage",
    },
    {
        level: 5, expRequired: 500,
        frame: "platinum", frameImage: "/frame_platinum.png",
        nameColor: "#ef4444",
        title: "Chuunibyou", badge: "中二病 Chuunibyou",
    },
    {
        level: 6, expRequired: 800,
        frame: "diamond", frameImage: "/frame_diamond.png",
        nameColor: "#10b981",
        title: "Shounen Hero", badge: "英雄 Shounen Hero",
    },
    {
        level: 7, expRequired: 1200,
        frame: "emerald", frameImage: "/frame_emerald.png",
        nameColor: "#f59e0b",
        title: "Isekai Veteran", badge: "異世界 Isekai",
    },
    {
        level: 8, expRequired: 1800,
        frame: "legendary", frameImage: "/frame_legendary.png",
        nameColor: "#ec4899",
        title: "Manga Kishin", badge: "鬼神 Kishin",
    },
    {
        level: 9, expRequired: 2500,
        frame: "transcendent", frameImage: "/frame_transcendent.png",
        nameColor: "#6366f1",
        title: "Shinigami Reader", badge: "死神 Shinigami",
    },
    {
        level: 10, expRequired: 3500,
        frame: "ultimate", frameImage: "/frame_ultimate.png",
        nameColor: "#dc2626",
        title: "Manga no Kami", badge: "神 Kami-sama",
    },
];

// EXP reward amounts for various user actions
const EXP_REWARDS = {
    CHAPTER_READ: 10, // First time reading a story (via reading-history create)
    COMMENT_POST: 5, // Posting a comment
    DAILY_LOGIN: 20, // Daily login bonus (once per calendar day)
    RATING_GIVEN: 3, // Rating a manga (first time per story)
};

export default {
    /**
     * Get the full level configuration table.
     * Frontend uses this to display level badges, progress bars, and frame previews.
     */
    getLevelConfig() {
        return LEVEL_CONFIG;
    },

    /**
     * Get EXP reward amounts configuration.
     */
    getExpRewards() {
        return EXP_REWARDS;
    },

    /**
     * Calculate the level for a given amount of EXP.
     * Iterates through levels in reverse to find the highest level
     * the user qualifies for.
     */
    calculateLevel(exp: number): typeof LEVEL_CONFIG[0] {
        for (let i = LEVEL_CONFIG.length - 1; i >= 0; i--) {
            if (exp >= LEVEL_CONFIG[i].expRequired) {
                return LEVEL_CONFIG[i];
            }
        }
        return LEVEL_CONFIG[0];
    },

    /**
     * Get the next level info (for progress bar display).
     * Returns null if user is already at max level.
     */
    getNextLevel(currentLevel: number): typeof LEVEL_CONFIG[0] | null {
        const nextIndex = LEVEL_CONFIG.findIndex(l => l.level === currentLevel + 1);
        return nextIndex !== -1 ? LEVEL_CONFIG[nextIndex] : null;
    },

    /**
     * Grant EXP to a user and handle level-up if applicable.
     * 
     * Flow:
     *  Fetch user's current EXP
     *  Add new EXP
     *  Calculate new level
     *  If level changed → apply cosmetic rewards (frame, color, badge)
     *  Save updated user data
     * 
     * Returns: { oldLevel, newLevel, totalExp, leveledUp, rewards }
     */
    async grantExp(userId: number, amount: number, reason: string = "unknown") {
        const user = await strapi.db.query("plugin::users-permissions.user").findOne({
            where: { id: userId },
            select: ["id", "exp", "level"],
        });

        if (!user) {
            strapi.log.warn(`[Level] User #${userId} not found, cannot grant EXP`);
            return null;
        }

        const oldExp = user.exp || 0;
        const oldLevel = user.level || 1;
        const newExp = oldExp + amount;

        // Calculate new level
        const levelInfo = this.calculateLevel(newExp);
        const newLevel = levelInfo.level;
        const leveledUp = newLevel > oldLevel;

        // Build update payload
        const updateData: Record<string, any> = {
            exp: newExp,
            level: newLevel,
        };

        // If leveled up, apply cosmetic rewards automatically
        if (leveledUp) {
            updateData.avatar_frame = levelInfo.frame;
            updateData.name_color = levelInfo.nameColor;
            strapi.log.info(
                `[Level] 🎉 User #${userId} leveled up! ${oldLevel} → ${newLevel} 「${levelInfo.badge}」 | EXP: ${newExp}`
            );
        }

        // Save to database
        await strapi.db.query("plugin::users-permissions.user").update({
            where: { id: userId },
            data: updateData,
        });

        strapi.log.debug(
            `[Level] User #${userId} +${amount} EXP (${reason}) | Total: ${newExp} | Level: ${newLevel}`
        );

        return {
            userId,
            oldLevel,
            newLevel,
            totalExp: newExp,
            expGained: amount,
            leveledUp,
            rewards: leveledUp ? {
                frame: levelInfo.frame,
                frameImage: levelInfo.frameImage,
                nameColor: levelInfo.nameColor,
                title: levelInfo.title,
                badge: levelInfo.badge,
            } : null,
        };
    },

    /**
     * Claim daily login EXP bonus.
     * Checks `last_daily_exp` timestamp to ensure only one claim per calendar day.
     * Returns grant result or null if already claimed today.
     */
    async claimDailyLogin(userId: number) {
        const user = await strapi.db.query("plugin::users-permissions.user").findOne({
            where: { id: userId },
            select: ["id", "last_daily_exp"],
        });

        if (!user) return null;

        const now = new Date();
        const todayStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"

        if (user.last_daily_exp) {
            const lastClaimStr = new Date(user.last_daily_exp).toISOString().split("T")[0];
            if (lastClaimStr === todayStr) {
                strapi.log.debug(`[Level] User #${userId} already claimed daily EXP today`);
                return { alreadyClaimed: true, nextClaimAt: todayStr + "T24:00:00.000Z" };
            }
        }

        // Update the last claim timestamp
        await strapi.db.query("plugin::users-permissions.user").update({
            where: { id: userId },
            data: { last_daily_exp: now.toISOString() },
        });

        // Grant EXP
        const result = await this.grantExp(userId, EXP_REWARDS.DAILY_LOGIN, "daily_login");

        return { alreadyClaimed: false, ...result };
    },

    /**
     * Get full level info for a user, including progress to next level.
     * Now also returns badge and frameImage for frontend display.
     */
    async getUserLevelInfo(userId: number) {
        const user = await strapi.db.query("plugin::users-permissions.user").findOne({
            where: { id: userId },
            select: ["id", "username", "exp", "level", "avatar_frame", "name_color", "last_daily_exp"],
        });

        if (!user) return null;

        const exp = user.exp || 0;
        const currentLevelInfo = this.calculateLevel(exp);
        const nextLevelInfo = this.getNextLevel(currentLevelInfo.level);

        // Calculate progress percentage to next level
        let progressPercent = 100; // Max level
        let expToNextLevel = 0;

        if (nextLevelInfo) {
            const expInCurrentLevel = exp - currentLevelInfo.expRequired;
            const expNeededForNext = nextLevelInfo.expRequired - currentLevelInfo.expRequired;
            progressPercent = Math.floor((expInCurrentLevel / expNeededForNext) * 100);
            expToNextLevel = nextLevelInfo.expRequired - exp;
        }

        // Check if daily login is already claimed today
        let dailyClaimed = false;
        if (user.last_daily_exp) {
            const todayStr = new Date().toISOString().split("T")[0];
            const lastClaimStr = new Date(user.last_daily_exp).toISOString().split("T")[0];
            dailyClaimed = lastClaimStr === todayStr;
        }

        return {
            userId: user.id,
            username: user.username,
            exp,
            level: currentLevelInfo.level,
            title: currentLevelInfo.title,
            badge: currentLevelInfo.badge,
            avatarFrame: user.avatar_frame || currentLevelInfo.frame,
            frameImage: currentLevelInfo.frameImage,
            nameColor: user.name_color || currentLevelInfo.nameColor,
            dailyClaimed,
            progress: {
                percent: progressPercent,
                currentLevelExp: currentLevelInfo.expRequired,
                nextLevelExp: nextLevelInfo?.expRequired || null,
                expToNextLevel,
            },
            isMaxLevel: !nextLevelInfo,
        };
    },

    /**
     * Get all unlocked cosmetics for a user.
     * Returns every frame, badge, and color from level 1 up to (and including)
     * the user's current level, plus which ones are currently equipped.
     */
    async getUnlockedCosmetics(userId: number) {
        const user = await strapi.db.query("plugin::users-permissions.user").findOne({
            where: { id: userId },
            select: ["id", "exp", "level", "avatar_frame", "name_color"],
        });

        if (!user) return null;

        const exp = user.exp || 0;
        const currentLevelInfo = this.calculateLevel(exp);
        const currentLevel = currentLevelInfo.level;

        // All cosmetics from level 1 up to user's current level
        const unlocked = LEVEL_CONFIG
            .filter(l => l.level <= currentLevel)
            .map(l => ({
                level: l.level,
                frame: l.frame,
                frameImage: l.frameImage,
                nameColor: l.nameColor,
                title: l.title,
                badge: l.badge,
            }));

        return {
            currentLevel,
            equipped: {
                frame: user.avatar_frame || currentLevelInfo.frame,
                nameColor: user.name_color || currentLevelInfo.nameColor,
            },
            unlocked,
        };
    },

    /**
     * Set user's cosmetics (frame and/or nameColor).
     * Validates that the chosen cosmetics belong to a level the user has unlocked.
     * Accepts partial updates — only provided fields are changed.
     */
    async setCosmetics(userId: number, options: { frame?: string; nameColor?: string }) {
        const user = await strapi.db.query("plugin::users-permissions.user").findOne({
            where: { id: userId },
            select: ["id", "exp", "level"],
        });

        if (!user) return { success: false, error: "User not found" };

        const exp = user.exp || 0;
        const currentLevelInfo = this.calculateLevel(exp);
        const currentLevel = currentLevelInfo.level;

        // Get all unlocked level configs
        const unlockedConfigs = LEVEL_CONFIG.filter(l => l.level <= currentLevel);

        const updateData: Record<string, any> = {};

        // Validate and set frame
        if (options.frame !== undefined) {
            const validFrame = unlockedConfigs.find(l => l.frame === options.frame);
            if (!validFrame) {
                return { success: false, error: `Frame "${options.frame}" is not unlocked yet` };
            }
            updateData.avatar_frame = options.frame;
        }

        // Validate and set name color
        if (options.nameColor !== undefined) {
            const validColor = unlockedConfigs.find(l => l.nameColor === options.nameColor);
            if (!validColor) {
                return { success: false, error: `Color "${options.nameColor}" is not unlocked yet` };
            }
            updateData.name_color = options.nameColor;
        }

        if (Object.keys(updateData).length === 0) {
            return { success: false, error: "No valid cosmetic options provided" };
        }

        await strapi.db.query("plugin::users-permissions.user").update({
            where: { id: userId },
            data: updateData,
        });

        strapi.log.info(
            `[Level] User #${userId} changed cosmetics: ${JSON.stringify(updateData)}`
        );

        // Return the updated cosmetics state
        const frameConfig = LEVEL_CONFIG.find(l => l.frame === (updateData.avatar_frame || user.avatar_frame));

        return {
            success: true,
            equipped: {
                frame: updateData.avatar_frame || user.avatar_frame,
                frameImage: frameConfig?.frameImage || null,
                nameColor: updateData.name_color || user.name_color,
            },
        };
    },

    /**
     * Get top users by EXP (Leaderboard).
     * Returns badge and frameImage alongside each entry.
     */
    async getLeaderboard(limit: number = 10) {
        const users = await strapi.db.query("plugin::users-permissions.user").findMany({
            where: { exp: { $gt: 0 } },
            select: ["id", "username", "exp", "level", "avatar_frame", "name_color"],
            orderBy: { exp: "desc" },
            limit,
        });

        return users.map((user, index) => {
            const levelInfo = this.calculateLevel(user.exp || 0);
            return {
                rank: index + 1,
                userId: user.id,
                username: user.username,
                exp: user.exp || 0,
                level: levelInfo.level,
                title: levelInfo.title,
                badge: levelInfo.badge,
                avatarFrame: user.avatar_frame,
                frameImage: levelInfo.frameImage,
                nameColor: user.name_color,
            };
        });
    },
};
