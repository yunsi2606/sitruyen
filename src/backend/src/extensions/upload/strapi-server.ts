export default (plugin: any) => {
  const originalUpload = plugin.services.upload.upload;

  plugin.services.upload.upload = async ({ data, files }: any) => {
    try {
      // Determine the reference from data or fileInfo
      let ref = data?.ref || data?.fileInfo?.ref;
      let refId = data?.refId || data?.fileInfo?.refId;

      // Handle the case where someone uploads directly via Strapi content manager
      if (ref === 'api::chapter.chapter' && refId) {
        const chapter: any = await strapi.documents('api::chapter.chapter').findOne({
          documentId: refId,
          populate: ['story'],
        });

        if (chapter) {
          const storySlug = chapter.story?.slug || chapter.story?.documentId || 'story';
          const chapSlug = chapter.slug || `chap-${chapter.chapterNumber || refId}`;
          const path = `${storySlug}/${chapSlug}`;

          if (!data.fileInfo) data.fileInfo = {};

          // Modify path for each file logically
          if (Array.isArray(files)) {
            files.forEach(f => f.path = path);
          } else if (files) {
            files.path = path;
          }
        }
      } else if (ref === 'api::story.story' && refId) {
        const story: any = await strapi.documents('api::story.story').findOne({
          documentId: refId,
        });

        if (story) {
          const path = `${story.slug || refId}`;

          if (Array.isArray(files)) {
            files.forEach(f => f.path = path);
          } else if (files) {
            files.path = path;
          }
        }
      } else if (data?.fileInfo?.path) {
        // If scraper explicitly provides fileInfo: { path: "truyen/chap-1" }
        const path = data.fileInfo.path;
        if (Array.isArray(files)) {
          files.forEach(f => f.path = path);
        } else if (files) {
          files.path = path;
        }
      }
    } catch (err) {
      strapi.log.error('Error intercepting upload path:', err);
    }

    // Call the original upload method with modified files (with our new path)
    return originalUpload({ data, files });
  };

  return plugin;
};
