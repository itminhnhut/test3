import { useRouter } from 'next/router';
import TopicsLayout from 'components/screens/Support/TopicsLayout';
import { PATHS } from 'constants/paths';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { getLastedArticles, } from 'utils';
import { formatTime } from 'redux/actions/utils';
import useApp from 'hooks/useApp';
import { ChevronLeft } from 'react-feather';
import { useTranslation } from 'next-i18next';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useEffect, useMemo, useState } from 'react';
// import RePagination from 'components/common/ReTable/RePagination';
import dynamic from 'next/dynamic';
import useWindowSize from 'hooks/useWindowSize';

const RePagination = dynamic(() => import('components/common/ReTable/RePagination'), { ssr: false });

const AnnouncementTopics = (props) => {
    const router = useRouter();
    const isApp = useApp();
    const [theme, , setTheme] = useDarkMode();
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(25);
    const [pagination, setPagination] = useState({
        limit: 25,
        next: null,
        page: 1,
        pages: 0,
        prev: null,
        total: 0,
    })


    const { width } = useWindowSize()
    const isMobile = width < 640

    useEffect(() => {
        const themeLocal = localStorage.getItem('theme');
        if (themeLocal === 'dark') {
            setTheme(THEME_MODE.DARK);
        } else {
            setTheme(THEME_MODE.LIGHT);
        }
    }, [router?.query]);

    useEffect(() => {
        getLastedArticles(
            `noti-${language}-${router?.query?.topic}`,
            limit,
            page,
            language
        )
            .then((articles) => {
                setData(articles);
                setPagination(articles.meta?.pagination)
            });
    }, [page, router?.query?.topic, language, limit]);

    const renderPagination = useMemo(() => {
        if (!data.length) return null;
        return page === 1 && !pagination?.next ? null : (
            <div className="flex items-center justify-center mt-8">
                <div className='sm:hidden font-semibold text-base dark:text-teal text-txtTextBtn cursor-pointer' onClick={() => setLimit(limit + 15)}>{t('common:read_more')}</div>
                <div className='sm:block hidden'>
                    <RePagination
                        isNamiV2
                        current={page}
                        pageSize={25}
                        name="market_table___list"
                        pagingPrevNext={{ language, page: page - 1, hasNext: !!pagination?.next, onChangeNextPrev: (change) => setPage(page + change) }}
                    />
                </div>
            </div>
        );
    }, [page, data, pagination, limit]);

    const renderTopics = () => {
        if (!data || !data?.length) {
            return <div>{t('support-center:no_articles')}</div>;
        }

        return data?.map((item) => (
            <Link
                href={
                    PATHS.SUPPORT.ANNOUNCEMENT +
                    `/${router?.query?.topic}/${item.slug}${isApp ? '?source=app' : ''
                    }`
                }
                key={item.uuid}
            >
                <a className="block mb-6 hover:text-txtTextBtn dark:hover:text-teal">
                    <div className='flex w-full gap-6 items-center'>
                        <img className='rounded-xl h-[70px] sm:h-[130px]' src={item?.feature_image} style={{
                            aspectRatio: isMobile ? '2/1' : '25/13'
                        }} />
                        <div className='h-full gap-6 flex flex-col justify-center'>
                            <div className='line-clamp-2 sm:line-clamp-4 text-textPrimary dark:text-gray-4 font-semibold text-sm sm:text-2xl'>
                                {item?.title}{' '}
                            </div>
                            {isMobile ? null : <div className='line-clamp-2 text-txtSecondary dark:text-darkBlue-5 text-sm font-normal'>
                                {item?.excerpt}
                            </div>}
                        </div>
                    </div>
                </a>
            </Link>
        ));
    };

    const renderAppHeader = () => {
        if (!isApp) return null;
        const topic = props?.data?.tags?.find(
            (o) => o?.displaySlug === router?.query?.topic
        )?.name;
        return (
            <div
                onClick={router?.back}
                className="active:text-dominant flex items-center px-4 pt-4 pb-2 text-sm font-medium"
            >
                <ChevronLeft size={16} className="mr-2.5" />
                {topic}
                {topic && ' | '}
                Nami FAQ
            </div>
        );
    };

    return (
        <>
            {renderAppHeader()}
            <TopicsLayout
                useTopicTitle={!!data?.length}
                mode="announcement"
            >
                {renderTopics()}
                {renderPagination}
            </TopicsLayout>
        </>
    );
};

export async function getServerSideProps({
    locale,
    query
}) {
    const articles = await getLastedArticles(
        `noti-${locale}-${query?.topic}`,
        25,
        1,
        locale
    );
    return {
        props: {
            data: {
                articles: [],
            },
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'support-center',
            ])),
        },
    };
}

export default AnnouncementTopics;
