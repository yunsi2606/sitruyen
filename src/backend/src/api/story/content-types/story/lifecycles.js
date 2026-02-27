'use strict';

async function checkAdultContentBefore(event) {
    const { data, where } = event.params;

    if (!data) return;

    try {
        let isAdult = false;
        let categoryIds = [];

        // Extract category IDs from payload
        if (Array.isArray(data.categories)) {
            // Arrays can be [1, 2] or [{id: 1}]
            categoryIds = data.categories.map(c => typeof c === 'object' && c !== null ? c.id : c);
        } else if (data.categories && typeof data.categories === 'object') {
            // Strapi object relation format (connect, set, etc.)
            for (const key of ['connect', 'set']) {
                if (Array.isArray(data.categories[key])) {
                    categoryIds = categoryIds.concat(data.categories[key].map(c => typeof c === 'object' && c !== null ? c.id : c));
                }
            }
        }

        categoryIds = categoryIds.filter(id => typeof id === 'number' || typeof id === 'string');

        // 1. If categories are provided in this request, check them
        if (data.categories !== undefined) {
            if (categoryIds.length > 0) {
                const categories = await strapi.db.query('api::category.category').findMany({
                    where: { id: { $in: categoryIds } }
                });
                isAdult = categories.some(cat => cat.slug === '18-plus' || cat.name === '18+');
            } else {
                isAdult = false;
            }
        }
        // 2. If categories are NOT provided (e.g. partial update), check existing ones from DB
        else if (event.action === 'beforeUpdate' && where && where.id) {
            const existingStory = await strapi.db.query('api::story.story').findOne({
                where: { id: where.id },
                populate: ['categories'],
            });

            if (existingStory && existingStory.categories && existingStory.categories.length > 0) {
                isAdult = existingStory.categories.some(cat => cat.slug === '18-plus' || cat.name === '18+');
            }
        }

        // Set the flag directly before saving to the DB
        data.isAdultContent = isAdult;

    } catch (error) {
        strapi.log.error('Error pre-calculating adult content flag: ' + error);
    }
}

module.exports = {
    async beforeCreate(event) {
        await checkAdultContentBefore(event);
    },

    async beforeUpdate(event) {
        await checkAdultContentBefore(event);
    },
};
