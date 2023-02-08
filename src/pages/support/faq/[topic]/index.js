import { useRouter } from 'next/router';
import { PATHS } from 'constants/paths';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ChevronLeft } from 'react-feather';

import TopicsLayout from 'components/screens/Support/TopicsLayout';
import Link from 'next/link';
import useApp from 'hooks/useApp';
import { appUrlHandler, SupportCategories } from 'constants/faqHelper';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import { getLastedArticles, ghost } from 'utils';
import { formatTime } from 'redux/actions/utils';
import classNames from 'classnames';
import useDarkMode, { THEME_MODE } from "hooks/useDarkMode";
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import useWindowSize from 'hooks/useWindowSize';

const RePagination = dynamic(() => import('components/common/ReTable/RePagination'), { ssr: false });


const FaqTopics = (props) => {
    const [currentGroup, setCurrentGroup] = useState(null)
    const [theme, , setTheme] = useDarkMode();
    const [page, setPage] = useState(1);
    const [articles, setArticles] = useState([]);
    const [total, setTotal] = useState(0);
    const router = useRouter()
    const isApp = useApp()
    const {
        t,
        i18n: { language },
    } = useTranslation()
    const { width } = useWindowSize
    const isMobile = width < 640
    const cats =
        SupportCategories.faq[language]?.find(
            (o) => o.displaySlug === router?.query?.topic
        )?.subCats || false

    useEffect(() => {
        getLastedArticles(
            `faq-${language || 'en'}-${router?.query?.topic}`,
            25,
            page,
            language
        )
            .then((articles) => {
                setArticles(articles);
                setTotal(articles.meta?.pagination?.total);
            });
    }, [page, router?.query?.topic, language]);


    const renderGroup = () => {
        return (
            cats &&
            cats.map((item) => (
                <Link
                    href={{
                        pathname:
                            PATHS.SUPPORT.FAQ + `/${router?.query?.topic}`,
                        query: appUrlHandler(
                            { group: item.displaySlug },
                            isApp
                        ),
                    }}
                    key={item.uuid}
                >
                    <div
                        key={item.id}
                        title={item.title}
                        className={classNames('w-full h-[52px] sm:h-[76px] bg-darkBlue-3 rounded-md flex items-center cursor-pointer', {
                            '!bg-hover': item.displaySlug === router?.query?.group
                        })}
                    >
                        <a className='truncate block text-gray-4 font-normal text-sm sm:font-medium sm:text-xl px-6'>
                            {item?.title}
                        </a>
                    </div>
                </Link>
            ))
        )
    }
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
    }, [page, articles, total]);
    const renderAppHeader = () => {
        if (!isApp) return null
        const topic = props?.data?.tags?.find(
            (o) => o?.displaySlug === router?.query?.topic
        )?.name
        return (
            <div
                onClick={router?.back}
                className='active:text-dominant flex items-center px-4 pt-4 pb-2 text-sm font-medium'
            >
                <ChevronLeft size={16} className='mr-2.5' />
                {topic}
                {topic && ' | '}
                Nami FAQ
            </div>
        )
    }

    const renderGroupArticles = useMemo(() => {
        if (!currentGroup || !articles || !articles.length) return null

        const data = articles?.filter((e) => {
            const isBelongThisGroup = e?.tags?.find(
                (o) => o.slug === `faq-${language}-${currentGroup}`
            )
            return !!isBelongThisGroup
        })

        // console.log('namidev filtered => ', data)

        if (!data.length) {
            return <div>{t('support-center:no_articles')}</div>
        }

        return data?.map((article) => (
            <a
                href={
                    PATHS.SUPPORT.FAQ +
                    `/${router?.query?.topic}/${article.slug}${isApp ? '?source=app' : ''
                    }`
                }
                key={article.uuid}
                className='block text-sm font-medium mb-[18px] lg:text-[16px] lg:mb-8 hover:!text-dominant'
            >
                <a className='w-full'>
                    <div>
                        <div className='text-gray-4 font-normal text-base hover:text-teal'>
                            {article?.title}{' '}
                        </div>
                        <div className='mt-2 text-darkBlue-5 font-normal text-xs leading-4 mb-8'>
                            {formatTime(article.created_at, 'dd-MM-yyyy')}
                        </div>
                    </div>
                </a>
            </a>
        ))
    }, [currentGroup, articles, language])

    const renderLastedArticles = useCallback(() => {
        if (!!currentGroup) return null

        if (!cats.length && (!articles || !articles.length)) {
            return <div>{t('support-center:no_articles')}</div>
        }

        const data = articles.slice(0, !!cats?.length ? 5 : 25)

        return data.map((article) => (
            <Link
                href={
                    PATHS.SUPPORT.FAQ +
                    `/${router?.query?.topic}/${article.slug.toString()}${isApp ? '?source=app' : ''
                    }`
                }
                key={article.uuid}
            >
                <a className='w-full'>
                    <div>
                        <div className='text-gray-4 font-normal text-base hover:text-teal'>
                            {article?.title}{' '}
                        </div>
                        <div className='mt-2 text-darkBlue-5 font-normal text-xs leading-4 mb-8'>
                            {formatTime(article.created_at, 'dd-MM-yyyy')}
                        </div>
                    </div>
                </a>
            </Link>
        ))
    }, [articles, currentGroup])

    useEffect(() => {
        if (router?.query?.group) {
            setCurrentGroup(router?.query?.group)
        } else {
            setCurrentGroup(null)
        }

        const themeLocal = localStorage.getItem("theme");
        if (themeLocal === "dark") {
            setTheme(THEME_MODE.DARK);
        } else {
            setTheme(THEME_MODE.LIGHT);
        }
    }, [router?.query])

    return (
        <>
            {renderAppHeader()}
            <TopicsLayout
                useTopicTitle
                mode='faq'
                faqCurrentGroup={currentGroup}
            >
                <div className='text-gray-4 font-semibold text-base sm:text-[32px] sm:leading-[38px] mb-6 sm:mb-8 cursor-pointer'>
                    <Link href='/support/faq/account-functions'>
                        <a>
                            {SupportCategories.faq[language]?.find(
                                (o) => o.displaySlug === router?.query?.topic
                            )?.title}
                        </a>
                    </Link>
                </div>
                {cats.length ? <div
                    className={classNames('flex flex-col sm:grid w-full gap-4 mb-12 sm:mb-20', {
                        // '': !!cats.length && !!!currentGroup,
                    })}
                    style={{
                        gridTemplateColumns: isMobile ? null : "repeat(auto-fill, 280px)",
                    }}
                >
                    {renderGroup()}
                </div> : null}
                {(currentGroup && articles && articles.length) ? <div className='text-gray-4 font-semibold text-[32px] leading-[38px] mb-6 sm:mb-8'>
                    {t('common:related_posts')}
                </div> : null}
                <div className=''>{renderGroupArticles}</div>
                {!!cats.length && !!articles?.length && !!!currentGroup && (
                    <div className='text-gray-4 font-semibold text-[32px] leading-[38px] mb-6 sm:mb-8'>
                        {t('support-center:lasted_articles')}
                    </div>
                )}
                <div className=''>{renderLastedArticles()}</div>
                {renderPagination()}
            </TopicsLayout>
        </>
    )
}

export async function getServerSideProps({ locale, query }) {
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
    }
}

export default FaqTopics
