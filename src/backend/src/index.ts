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
        // Auto-set publish date and VIP lock for new chapters
        if (!data.chap_published_at) {
          data.chap_published_at = new Date().toISOString().split('T')[0];
        }
        if (data.is_vip_only === undefined || data.is_vip_only === null) {
          data.is_vip_only = true;
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
        const storyId = extractStoryId(data.story);
        if (storyId) {
          await updateTotalChapters(strapi, storyId);
          await syncStoryViewCount(strapi, storyId);
        }
      },

      async afterUpdate(event) {
        const { result, params } = event;
        const { data } = params;
        let storyId = extractStoryId(data.story);
        if (!storyId && result) {
          const chapter: any = await strapi.db.query('api::chapter.chapter').findOne({
            where: { id: (result as any).id },
            populate: ['story'],
          });
          storyId = chapter?.story?.id ?? null;
        }
        if (storyId) {
          await syncStoryViewCount(strapi, storyId);
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
          await syncStoryViewCount(strapi, storyId);
        }
      },
    });
  },
};

/**
 * Normalize the `story` field from event.params.data into a plain numeric ID.
 * Strapi can pass it as:
 *   - a number: 42
 *   - an object with id: { id: 42 }
 *   - a connect array: { connect: [{ id: 42 }] }
 *   - a set array:     { set: [{ id: 42 }] }
 */
function extractStoryId(story: any): number | null {
  if (!story) return null;
  if (typeof story === 'number') return story;
  if (typeof story === 'string') return Number(story) || null;
  // { id: 42 }
  if (typeof story === 'object' && story.id) return Number(story.id);
  // { connect: [{ id: 42 }] }
  if (Array.isArray(story?.connect) && story.connect[0]?.id) return Number(story.connect[0].id);
  // { set: [{ id: 42 }] }
  if (Array.isArray(story?.set) && story.set[0]?.id) return Number(story.set[0].id);
  return null;
}

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

async function syncStoryViewCount(strapi: Core.Strapi, storyId: any) {
  if (!storyId) return;
  try {
    // Fetch all chapters for this story and sum their view_count
    const chapters = await strapi.db.query('api::chapter.chapter').findMany({
      where: { story: storyId },
      select: ['view_count'],
    });

    const total = chapters.reduce(
      (sum: number, ch: any) => sum + (Number(ch.view_count) || 0),
      0
    );

    await strapi.db.query('api::story.story').update({
      where: { id: storyId },
      data: { view_count: total },
    });
    strapi.log.info(`[ViewSync] Story ${storyId} view_count → ${total}`);
  } catch (err: any) {
    strapi.log.error(`[ViewSync] Failed to sync story view_count: ${err.message}`);
  }
}
