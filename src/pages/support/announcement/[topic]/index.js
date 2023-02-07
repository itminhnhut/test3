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
import { useCallback, useEffect, useState } from 'react';
// import RePagination from 'components/common/ReTable/RePagination';
import dynamic from 'next/dynamic';

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
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

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
            25,
            page,
            language
        )
            .then((articles) => {
                setData(articles);
                setTotal(articles.meta?.pagination?.total);
            });
    }, [page]);

    const renderPagination = useCallback(() => {
        if (!total) return null;
        return (
            <div className="flex items-center justify-center mt-8">
                <RePagination
                    total={total}
                    current={page}
                    pageSize={25}
                    showTitle={false}
                    onChange={(currentPage) => setPage(currentPage)}
                />
            </div>
        );
    }, [page, data, total]);

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
                <a className="block text-sm font-medium mb-[18px] lg:text-[16px] lg:mb-8 hover:!text-dominant">
                    <div className='flex w-full gap-6 items-center'>
                        <img className='rounded-xl h-[130px]' src={item?.feature_image} style={{
                            aspectRatio: '25/13'
                        }} />
                        <div className='h-full gap-6 flex flex-col justify-center'>
                            <div className='text-gray-4 font-medium text-xl'>
                                {item?.title}{' '}
                            </div>
                            <div className='line-clamp-2 text-darkBlue-5 font-normal text-sm'>
                                {item?.excerpt}
                            </div>
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
                {renderPagination()}
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
