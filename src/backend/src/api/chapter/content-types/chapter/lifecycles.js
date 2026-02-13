const slugify = require('slugify');

module.exports = {
    async beforeCreate(event) {
        const { data } = event.params;

        if (data.title && !data.slug) {
            data.slug = slugify(data.title, { lower: true, strict: true });
        }
    },

    async beforeUpdate(event) {
        const { data } = event.params;

        if (data.title && !data.slug) {
            data.slug = slugify(data.title, { lower: true, strict: true });
        }
    },

    async afterCreate(event) {
        const { params } = event;
        const { data } = params;

        const storyId = data.story;

        if (storyId) {
            await updateTotalChapters(storyId);
        }
    },

    // Capture story before deletion because after deletion the relation is gone/hard to fetch
    async beforeDelete(event) {
        const { where } = event.params;

        // Find the chapter to be deleted to know its story
        const chapter = await strapi.db.query('api::chapter.chapter').findOne({
            where,
            populate: ['story'],
        });

        if (chapter && chapter.story) {
            event.state.storyId = chapter.story.id;
        }
    },

    async afterDelete(event) {
        const storyId = event.state.storyId;

        if (storyId) {
            await updateTotalChapters(storyId);
        }
    },
};

async function updateTotalChapters(storyId) {
    if (!storyId) return;

    try {
        const count = await strapi.db.query('api::chapter.chapter').count({
            where: {
                story: storyId,
            },
        });

        // Use update instead of entityService to be quick
        await strapi.db.query('api::story.story').update({
            where: { id: storyId },
            data: {
                total_chapters: count,
            },
        });
    } catch (err) {
        strapi.log.error(`Failed to update total_chapters` + err);
    }
}
