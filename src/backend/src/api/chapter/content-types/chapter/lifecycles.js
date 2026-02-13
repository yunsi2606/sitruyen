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
};
