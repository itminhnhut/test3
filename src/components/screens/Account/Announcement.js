import { useEffect, useState } from 'react';
import { getLastedArticles } from 'utils';
import { useTranslation } from 'next-i18next';
import { omit, range } from 'lodash';
import { formatTime } from 'redux/actions/utils';
import { SupportCategories } from 'constants/faqHelper';
import { PATHS } from 'constants/paths';
import useApp from 'hooks/useApp';
import { useWindowSize } from 'react-use';

function Announcement() {
    const [data, setData] = useState([]);
    const [fetching, setFetching] = useState(false);

    const [isLoadMore, setIsLoadMore] = useState(false);

    const { width } = useWindowSize();
    const isMobile = width <= 768;

    const {
        t,
        i18n: { language }
    } = useTranslation();

    const isApp = useApp();

    useEffect(() => {
        setFetching(true);
        getLastedArticles(undefined, 10, 1, language)
            .then((res) => setData(res))
            .finally(() => {
                setFetching(false);
            });
    }, []);

    return (
        <div>
            <div className="mb-8">
                <span className="font-semibold text-xl md:text-2xl">{t('profile:announcements')}</span>
            </div>
            <div className="md:bg-white md:dark:bg-darkBlue-3 rounded-xl md:px-1 md:py-6">
                <div className="md:h-[33.625rem] overflow-y-auto md:px-5 space-y-6">
                    {
                        // Skeleton
                        fetching &&
                            !data?.length &&
                            range(1, 10).map((e) => {
                                return (
                                    <div key={e} className="animate-pulse space-y-2">
                                        <div className="h-6 w-full bg-gray-4 dark:bg-dark-2 rounded" />
                                        <div className="h-4 w-36 bg-gray-4 dark:bg-dark-2 rounded" />
                                    </div>
                                );
                            })
                    }

                    {data.slice(0, isLoadMore || !isMobile ? undefined : 5).map((item) => {
                        let mode, topic, ownedTags, _tagsLib, categories;

                        const isNoti = item.tags.some((e) => e.slug.includes('noti-'));

                        if (isNoti) {
                            mode = 'announcement';
                            categories = SupportCategories.announcements[language];
                            ownedTags = item.tags.filter((f) => f.slug !== 'noti')?.map((o) => o?.slug?.replace('noti-vi-', '')?.replace('noti-en-', ''));
                        } else {
                            mode = 'faq';
                            categories = SupportCategories.faq[language];
                            ownedTags = item.tags.filter((f) => f.slug !== 'faq')?.map((o) => o?.slug?.replace('faq-vi-', '')?.replace('faq-en-', ''));
                        }

                        _tagsLib = categories.map((o) => o.displaySlug);

                        ownedTags.forEach((e) => {
                            if (_tagsLib.includes(e)) topic = e;
                        });

                        const href = PATHS.SUPPORT.DEFAULT + `/${mode}/${topic}/${item.slug.toString()}${isApp ? '?source=app' : ''}`;

                        return (
                            <div key={item.id}>
                                <a className="device font-semibold text-sm md:text-base hover:text-dominant transition-colors" href={href} target="_blank">
                                    {item.title}
                                </a>
                                <div className="location text-xs mt-2 text-txtSecondary dark:text-txtSecondary-dark">
                                    {formatTime(item.created_at, 'dd/MM/yyyy HH:mm')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {!isLoadMore && (
                <div className="text-center mt-6 cursor-pointer py-3 md:hidden" onClick={() => setIsLoadMore(!isLoadMore)}>
                    <span className="text-teal font-semibold">{t('common:read_more')}</span>
                </div>
            )}
        </div>
    );
}

export default Announcement;
