import { useCallback, useMemo, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BREAK_POINTS } from 'constants/constants';
import { PATHS } from 'constants/paths';

import SupportSectionItem from 'components/screens/Support/SupportSectionItem';
import SupportSearchBar from 'components/screens/Support/SupportSearchBar';
import SupportSection from 'components/screens/Support/SupportSection';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useWindowSize from 'hooks/useWindowSize';
import Image from 'next/image';
import { useAsync } from 'react-use';
import { getLastedArticles } from 'utils';
import { useTranslation } from 'next-i18next';
import { formatTime, getS3Url } from 'redux/actions/utils';
import classNames from 'classnames';
import Skeletor from 'components/common/Skeletor';
import useApp from 'hooks/useApp';
import { getSupportCategoryIcons, SupportCategories } from 'constants/faqHelper';
import useDarkMode, { THEME_MODE } from "hooks/useDarkMode";
import React from "react";
import { useDispatch } from 'react-redux';
import { reloadData } from 'redux/actions/heath';


const Support = () => {
    // ? State
    const [loading, setLoading] = useState(false)
    const [lastedArticles, setLastedArticles] = useState([])
    const [highlightedArticles, setHighlightedArticles] = useState([])
    const [currentTheme, onThemeSwitch, setTheme] = useDarkMode();
    const dispath = useDispatch();

    React.useEffect(() => {
        // document.body.classList.add('hidden-scrollbar');
        document.body.classList.add('no-scrollbar');
        // document.body.classList.add('!bg-onus');

        const intervalReloadData = setInterval(() => {
            dispath(reloadData());
        }, 5 * 60 * 1000);

        return () => {
            document.body.classList.remove('hidden-scrollbar');
            // document.body.classList.remove('bg-onus');
            clearInterval(intervalReloadData);
        };
    }, []);

    React.useEffect(() => {
        const themeInLocalStorage = localStorage.getItem("theme");
        const root = document.querySelector(":root");
        if (themeInLocalStorage === "dark") {
            root.classList.add("dark");
            setTheme(THEME_MODE.DARK);
        } else {
            root.classList.add("light");
            setTheme(THEME_MODE.LIGHT);
        }
    }, [currentTheme]);

    // ? Use hooks
    const { width } = useWindowSize()
    let {
        t,
        i18n: { language },
    } = useTranslation()
    const isApp = useApp()

    // ? Memmoized
    const sectionIconSize = useMemo(
        () => (width >= BREAK_POINTS.lg ? 32 : 24),
        [width]
    )

    // ? Render input

    const renderFaqCategories = () => {
        // if (loading) {
        //     return (
        //         <>
        //             <div className="mt-3 lg:mt-5 w-full h-[35px] lg:h-[45px] md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3">
        //                 <Skeletor className="!w-full !h-full"/></div>
        //             <div className="mt-3 lg:mt-5 w-full h-[35px] lg:h-[45px] md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3">
        //                 <Skeletor className="!w-full !h-full"/></div>
        //             <div className="mt-3 lg:mt-5 w-full h-[35px] lg:h-[45px] md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3">
        //                 <Skeletor className="!w-full !h-full"/></div>
        //             <div className="mt-3 lg:mt-5 w-full h-[35px] lg:h-[45px] md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3">
        //                 <Skeletor className="!w-full !h-full"/></div>
        //             <div className="mt-3 lg:mt-5 w-full h-[35px] lg:h-[45px] md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3">
        //                 <Skeletor className="!w-full !h-full"/></div>
        //             <div className="mt-3 lg:mt-5 w-full h-[35px] lg:h-[45px] md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3">
        //                 <Skeletor className="!w-full !h-full"/></div>
        //             <div className="mt-3 lg:mt-5 w-full h-[35px] lg:h-[45px] md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3">
        //                 <Skeletor className="!w-full !h-full"/></div>
        //             <div className="mt-3 lg:mt-5 w-full h-[35px] lg:h-[45px] md:w-1/3 xl:w-1/4 md:pr-1 lg:pr-3">
        //                 <Skeletor className="!w-full !h-full"/></div>
        //         </>
        //     )
        // }

        return SupportCategories.faq[language].map((faq) => (
            <SupportSectionItem
                key={faq.id}
                href={
                    PATHS.SUPPORT.FAQ +
                    `/${faq.displaySlug}${isApp ? '?source=app' : ''}`
                }
                title={faq?.title || '--'}
                titleClassNames='truncate'
                icon={
                    <Image
                        src={getSupportCategoryIcons(faq.id)}
                        width={sectionIconSize}
                        height={sectionIconSize}
                    />
                }
            />
        ))
    }

    const renderAnnouncementCategories = () => {
        return (
            SupportCategories.announcements[language].map((announcement) => (
                <a
                    href={
                        PATHS.SUPPORT.ANNOUNCEMENT +
                        `/${announcement.displaySlug}${isApp ? '?source=app' : ''}`
                    }
                >
                    <div key={announcement.id} className='w-[286px] h-[200px] flex flex-col items-center gap-6 justify-center rounded-xl bg-namiv2-black-1 truncate text-namiv2-gray-2 font-medium text-[20px] hover:!bg-[#262b34]'>
                        <Image
                            src={getSupportCategoryIcons(announcement.id)}
                            width={52}
                            height={52}
                        />
                        {announcement?.title || '--'}
                    </div>
                </a>
            ))
        )
    }

    const renderLastedArticles = useCallback(() => {
        if (loading) {
            return (
                <>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                </>
            )
        }

        // console.log('namidev ', lastedArticles)

        return lastedArticles.map((article) => {
            let mode, topic, ownedTags, _tagsLib, categories
            const isNoti = !!article?.tags?.find((o) =>
                o.slug?.includes('noti-')
            )

            if (isNoti) {
                mode = 'announcement'
                categories = SupportCategories.announcements[language]
                ownedTags = article.tags
                    .filter((f) => f.slug !== 'noti')
                    ?.map((o) =>
                        o?.slug
                            ?.replace('noti-vi-', '')
                            ?.replace('noti-en-', '')
                    )
            } else {
                mode = 'faq'
                categories = SupportCategories.faq[language]
                ownedTags = article.tags
                    .filter((f) => f.slug !== 'faq')
                    ?.map((o) =>
                        o?.slug?.replace('faq-vi-', '')?.replace('faq-en-', '')
                    )
            }

            _tagsLib = categories.map((o) => o.displaySlug)

            ownedTags.forEach((e) => {
                if (_tagsLib.includes(e)) topic = e
            })

            return (
                <SupportSectionItem
                    key={article.id}
                    href={
                        PATHS.SUPPORT.DEFAULT +
                        `/${mode}/${topic}/${article.slug.toString()}${isApp ? '?source=app' : ''
                        }`
                    }
                    title={
                        <>
                            <span className='mr-2'>{article.title}</span>
                            <span className='text-txtSecondary dark:text-txtSecondary-dark text-[10px] lg:text-[12px] whitespace-nowrap'>
                                {formatTime(article.created_at, 'dd-MM-yyyy')}
                            </span>
                        </>
                    }
                    containerClassNames='lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0'
                    classNames='active:!bg-transparent hover:!underline hover:!text-dominant'
                />
            )
        })
    }, [lastedArticles, loading, language])

    const renderHighlightedArticles = useCallback(() => {
        if (loading) {
            return (
                <>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                    <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
                        <Skeletor className='!w-full !h-full' />
                    </div>
                </>
            )
        }

        return highlightedArticles.map((article) => {
            let mode, topic, ownedTags, _tagsLib, categories
            const isNoti = !!article?.tags?.find((o) =>
                o.slug?.includes('noti-')
            )

            if (isNoti) {
                mode = 'announcement'
                categories = SupportCategories.announcements[language]
                ownedTags = article.tags
                    .filter((f) => f.slug !== 'noti')
                    ?.map((o) =>
                        o?.slug
                            ?.replace('noti-vi-', '')
                            ?.replace('noti-en-', '')
                    )
            } else {
                mode = 'faq'
                categories = SupportCategories.faq[language]
                ownedTags = article.tags
                    .filter((f) => f.slug !== 'faq')
                    ?.map((o) =>
                        o?.slug?.replace('faq-vi-', '')?.replace('faq-en-', '')
                    )
            }

            _tagsLib = categories.map((o) => o.displaySlug)

            ownedTags.forEach((e) => {
                if (_tagsLib.includes(e)) topic = e
            })

            return (
                <SupportSectionItem
                    key={article.id}
                    href={
                        PATHS.SUPPORT.DEFAULT +
                        `/${mode}/${topic}/${article.slug}${isApp ? '?source=app' : ''
                        }`
                    }
                    title={
                        <>
                            <span className='mr-2'>{article.title}</span>
                            <span className='text-txtSecondary dark:text-txtSecondary-dark text-[10px] lg:text-[12px] whitespace-nowrap'>
                                {formatTime(article.created_at, 'dd-MM-yyyy')}
                            </span>
                        </>
                    }
                    containerClassNames='lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0'
                    classNames='active:!bg-transparent hover:!underline hover:!text-dominant'
                />
            )
        })
    }, [highlightedArticles, loading, language])

    useAsync(async () => {
        setLoading(true)

        const lastedArticles = await getLastedArticles(undefined, 5, 1, language)
        const highlightedArticles = await getLastedArticles(
            undefined,
            5,
            1,
            language,
            true
        )

        setLastedArticles(lastedArticles)
        setHighlightedArticles(highlightedArticles)

        // const a = await ghost.tags.browse({ limit: 'all' })
        // console.log('namidev ', a)

        setLoading(false)
    }, [language])

    return (
        <MaldivesLayout>
            <div className='bg-namiv2-black'>
                <SearchSection t={t} width={width} />
                <div className='container pt-6 max-w-[1440px]'>
                    <div className='pb-[80px] px-10 lg:px-[112px] h-full rounded-t-[20px] drop-shadow-onlyLight lg:!bg-transparent'>
                        <div className='mt-20'>
                            <SupportSection
                                title={t('support-center:announcement')}
                                mode='announcement'
                                contentContainerClassName='mt-8'
                            >
                                {renderAnnouncementCategories()}
                            </SupportSection>
                        </div>

                        <div className='mt-20'>
                            <SupportSection
                                title={t('support-center:faq')}
                                mode='faq'
                                containerClassNames='lg:pb-[32px]'
                            >
                                {renderFaqCategories()}
                            </SupportSection>
                        </div>

                        <div className='mt-6 lg:mt-8'>
                            <div className='lg:bg-bgPrimary dark:bg-bgPrimary-dark lg:rounded-xl lg:flex lg:mt-4'>
                                <SupportSection
                                    title={t('support-center:lasted_articles')}
                                    contentContainerClassName='lg:!py-0 lg:!pb-6 lg:!mt-4'
                                    containerClassNames={classNames({
                                        'lg:w-1/2':
                                            !!highlightedArticles.length,
                                    })}
                                >
                                    {renderLastedArticles()}
                                </SupportSection>
                                {highlightedArticles?.length ? (
                                    <SupportSection
                                        title={t(
                                            'support-center:highlight_articles'
                                        )}
                                        contentContainerClassName='lg:!py-0 lg:!pb-6 lg:!mt-4'
                                        containerClassNames='mt-6 lg:mt-0 lg:w-1/2'
                                    >
                                        {renderHighlightedArticles()}
                                    </SupportSection>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MaldivesLayout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, [
            'common',
            'navbar',
            'support-center',
        ])),
    },
})

export default Support

export const SearchSection = ({ t, width }) => {
    const renderInput = useCallback(() => {
        return <SupportSearchBar simpleMode={width < BREAK_POINTS.lg} />
    }, [width])

    return (
        <div className='flex justify-center w-full h-[456px]'
            style={{
                backgroundImage: `url('/images/reference/bg_supportcenter.png')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
            }}
        >
            <div className='max-w-[1440px] w-full px-10 lg:px-[112px] flex flex-col justify-center h-full'>
                <div className='font-bold text-[20px] lg:text-[44px] text-white mb-12'>
                    {t('support-center:title')}
                </div>
                {renderInput()}
            </div>
        </div>
    )
}