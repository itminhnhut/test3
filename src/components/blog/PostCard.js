import { sanitize } from 'src/utils/helpers';
import { formatTime } from 'src/redux/actions/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

const PostCard = ({ post }) => {
    const imageUrl = post?._embedded?.['wp:featuredmedia']?.['0']?.media_details?.sizes?.large?.source_url || post?._embedded?.['wp:featuredmedia']?.['0']?.source_url || '/images/blog/image-default.svg';
    const router = useRouter();
    const { locale } = router;
    const { t } = useTranslation();
    return (
        <div className="card-post">
            <Link href={`/blog/${encodeURIComponent(post.slug)}`} locale={locale} prefetch={false}>
                <a rel="noopener noreferrer">
                    <div className="card-post-header w-full lg:w-[400px] lg:h-[248px] relative mb-6">
                        <img src={imageUrl} className="rounded-2xl" />
                    </div>
                </a>
            </Link>
            <div className="card-post-body">
                <div className="card-post-date mb-4">
                    {t('common:published_at')} {formatTime(post.date, 'MMM dd, yyyy')}
                </div>
                <Link href={`/blog/${encodeURIComponent(post.slug)}`} locale={locale} prefetch={false}>
                    <a rel="noopener noreferrer">
                        <div
                            className="card-post-title line-clamp-2 mb-3"
                            dangerouslySetInnerHTML={{ __html: sanitize(post?.title?.rendered) }}
                        />
                    </a>
                </Link>
                <div
                    className="card-post-description line-clamp-2 mb-6"
                    dangerouslySetInnerHTML={{ __html: sanitize(post?.excerpt?.rendered) }}
                />
                <Link href={`/blog/${encodeURIComponent(post.slug)}`} locale={locale} prefetch={false}>
                    <a rel="noopener noreferrer">
                        <div className="card-post-readmore">
                            {t('common:read_more')}
                        </div>
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
