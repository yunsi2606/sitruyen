/**
 * Google Analytics 4 tracking utility
 */

export const GA_MEASUREMENT_ID = 'G-LWNE0EXJNZ';

// Push event to dataLayer
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, params);
    } else {
        console.debug(`[GA4 Event] ${eventName}`, params);
    }
};

// Common Event Names
export const EVENTS = {
    VIEW_MANGA: 'view_manga',
    READ_CHAPTER: 'read_chapter',
    SEARCH: 'search',
    LOGIN: 'login',
    SIGN_UP: 'sign_up',
    ADD_TO_HISTORY: 'add_to_history',
    UPGRADE_VIP: 'upgrade_vip',
    POST_COMMENT: 'post_comment',
    SELECT_STICKER: 'select_sticker',
    REPORT_MANGA: 'report_manga',
};
