import { ghost } from 'utils';
// eslint-disable-next-line no-unused-vars
import { getServerSideSitemap } from 'next-sitemap';

export const getServerSideProps = async (ctx) => {
    const options = {
        limit: 'all',
        include: 'tags',
        order: 'published_at DESC'
    };
    const result = await ghost.posts.browse(options);
    const fields = result.map(item => {
        let primary_tag = normalizeTag(item?.primary_tag?.slug);
        let first_tag = normalizeTag(item?.tags?.[1]?.slug);
        const slug = item?.slug;
        return {
            loc: `${process.env.NEXT_PUBLIC_APP_URL}/support/${primary_tag}/${first_tag}/${slug}`,
            lastmod: new Date().toISOString(),
            changefreq: 'monthly',
            priority: 0.7,
        };
    });
    return getServerSideSitemap(ctx, fields);
};

function normalizeTag(tag) {
    if (typeof tag === 'string' && tag.length) {
        return tag.replace('noti-vi-', '')
            .replace('noti-en-', '')
            .replace('faq-vi-', '')
            .replace('faq-en-', '');
    }
    return '';
}

// Default export to prevent next.js errors
export default () => {
};
