import type { Core } from '@strapi/strapi';
const slugify = require('slugify');

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ['api::chapter.chapter'],

      async beforeCreate(event) {
        const { data } = event.params;
        strapi.log.info(`[Global Lifecycle] Chapter beforeCreate: ${data.title}`);
        if (data.title && !data.slug) {
          data.slug = slugify(data.title, { lower: true, strict: true });
        }
      },

      async beforeUpdate(event) {
        const { data } = event.params;
        strapi.log.info(`[Global Lifecycle] Chapter beforeUpdate: ${JSON.stringify(data)}`);
        if (data.title && !data.slug) {
          data.slug = slugify(data.title, { lower: true, strict: true });
        }
      },

      async afterCreate(event) {
        const { params } = event;
        const { data } = params;
        const storyId = data.story;
        if (storyId) {
          await updateTotalChapters(strapi, storyId);
        }
      },

      async beforeDelete(event) {
        const { where } = event.params;
        const chapter: any = await strapi.db.query('api::chapter.chapter').findOne({
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
          await updateTotalChapters(strapi, storyId);
        }
      },
    });
  },
};

async function updateTotalChapters(strapi: Core.Strapi, storyId: any) {
  if (!storyId) return;
  try {
    const count = await strapi.db.query('api::chapter.chapter').count({
      where: { story: storyId },
    });

    // Check if story exists first (optional but safe)
    const story = await strapi.db.query('api::story.story').findOne({ where: { id: storyId } });
    if (!story) {
      strapi.log.warn(`Story ${storyId} not found during total_chapters update`);
      return;
    }

    await strapi.db.query('api::story.story').update({
      where: { id: storyId },
      data: { total_chapters: count },
    });
    strapi.log.info(`Updated total_chapters for Story ${storyId} to ${count}`);
  } catch (err: any) {
    strapi.log.error(`Failed to update total_chapters: ${err.message}`);
  }
}
