import { useCallback, useMemo, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BREAK_POINTS } from 'constants/constants';
import { PATHS } from 'constants/paths';
import SearchSection from 'components/screens/Support/SearchSection';
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
    const isMobile = width < 640
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
        return (
            <div className='grid justify-between w-full gap-4 sm:bg-darkBlue-3 rounded-xl sm:p-6' style={{
                gridTemplateColumns: "repeat(auto-fill, 280px)",
            }}>
                {SupportCategories.faq[language].map((faq) => (
                    <a href={
                        PATHS.SUPPORT.FAQ +
                        `/${faq.displaySlug}${isApp ? '?source=app' : ''}`
                    }>
                        <div className='flex gap-4 sm:p-4 w-full sm:w-[280px] h-[48px] sm:h-[68px] items-center sm:hover:!bg-hover-dark rounded-xl text-gray-2 font-normal text-sm sm:font-semibold sm:text-base' key={faq.id}>
                            <Image
                                src={getSupportCategoryIcons(faq.id)}
                                width={isMobile ? 24 : 36}
                                height={isMobile ? 24 : 36}
                            />
                            {faq?.title}
                        </div>
                    </a>
                ))}
            </div>
        )
    }

    const renderAnnouncementCategories = () => {
        return (
            SupportCategories.announcements[language].map((announcement) => (
                <a
                    href={
                        PATHS.SUPPORT.ANNOUNCEMENT +
                        `/${announcement.displaySlug}${isApp ? '?source=app' : ''}`
                    }
                    className={classNames({ 'w-full': isMobile })}
                >
                    <div key={announcement.id} className={classNames('w-[170px] h-[140px] sm:w-[286px] sm:h-[200px] flex flex-col items-center gap-6 justify-center rounded-xl bg-darkBlue-3 truncate text-gray-4 font-semibold sm:font-medium  text-sm sm:text-[20px] hover:!bg-hover-dark', {
                        '!w-full': isMobile
                    })}>
                        <Image
                            src={getSupportCategoryIcons(announcement.id)}
                            width={isMobile ? 48 : 52}
                            height={isMobile ? 48 : 52}
                        />
                        {announcement?.title || '--'}
                    </div>
                </a>
            ))
        )
    }

    // const renderLastedArticles = useCallback(() => {
    //     if (loading) {
    //         return (
    //             <>
    //                 <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
    //                     <Skeletor className='!w-full !h-full' />
    //                 </div>
    //                 <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
    //                     <Skeletor className='!w-full !h-full' />
    //                 </div>
    //                 <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
    //                     <Skeletor className='!w-full !h-full' />
    //                 </div>
    //                 <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
    //                     <Skeletor className='!w-full !h-full' />
    //                 </div>
    //                 <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
    //                     <Skeletor className='!w-full !h-full' />
    //                 </div>
    //                 <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
    //                     <Skeletor className='!w-full !h-full' />
    //                 </div>
    //                 <div className='mt-3 lg:mt-5 w-full lg:min-w-[650px] h-[35px] lg:h-[45px]  md:pr-1 lg:pr-3'>
    //                     <Skeletor className='!w-full !h-full' />
    //                 </div>
    //             </>
    //         )
    //     }

    //     // console.log('namidev ', lastedArticles)

    //     return (
    //         <div className='w-full bg-darkBlue-3 rounded-xl p-6 flex flex-col gap-8'>
    //             {lastedArticles.map((article, index) => {
    //                 let mode, topic, ownedTags, _tagsLib, categories
    //                 const isNoti = !!article?.tags?.find((o) =>
    //                     o.slug?.includes('noti-')
    //                 )

    //                 if (isNoti) {
    //                     mode = 'announcement'
    //                     categories = SupportCategories.announcements[language]
    //                     ownedTags = article.tags
    //                         .filter((f) => f.slug !== 'noti')
    //                         ?.map((o) =>
    //                             o?.slug
    //                                 ?.replace('noti-vi-', '')
    //                                 ?.replace('noti-en-', '')
    //                         )
    //                 } else {
    //                     mode = 'faq'
    //                     categories = SupportCategories.faq[language]
    //                     ownedTags = article.tags
    //                         .filter((f) => f.slug !== 'faq')
    //                         ?.map((o) =>
    //                             o?.slug?.replace('faq-vi-', '')?.replace('faq-en-', '')
    //                         )
    //                 }

    //                 _tagsLib = categories.map((o) => o.displaySlug)

    //                 ownedTags.forEach((e) => {
    //                     if (_tagsLib.includes(e)) topic = e
    //                 })

    //                 return (

    //                     <div className='flex items-center gap-6' key={article.id}>
    //                         <div className='rounded-full bg-gray-4 h-2 w-2'>
    //                         </div>
    //                         <a href={
    //                             PATHS.SUPPORT.DEFAULT +
    //                             `/${mode}/${topic}/${article.slug.toString()}${isApp ? '?source=app' : ''
    //                             }`
    //                         }>
    //                             <div className='flex flex-col grap-2'>
    //                                 <div className='mr-2 text-gray-4 text-base font-normal hover:text-teal active:text-teal'>
    //                                     {article.title}
    //                                     {index === 0 ? <span className='ml-9 text-gray-1 font-normal text-xs leading-4 bg-divider-dark bg-opacity-50 px-3 py-1 rounded-[80px]'>{t('support-center:highlight_articles')}</span> : null}
    //                                 </div>
    //                                 <div className='font-normal text-xs leading-4 text-darkBlue-5 whitespace-nowrap'>
    //                                     {formatTime(article.created_at, 'dd-MM-yyyy')}
    //                                 </div>
    //                             </div>
    //                         </a>
    //                     </div>

    //                 )
    //             })
    //             }
    //         </div >)
    // }, [lastedArticles, loading, language])

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
            <div className='bg-shadow'>
                <SearchSection t={t} width={width} />
                <div className='container pt-6 max-w-[1440px]'>
                    <div className='pb-[120px] px-4 sm:px-[112px] h-full  drop-shadow-onlyLight bg-transparent'>
                        <div className='mt-12 sm:mt-20'>
                            <SupportSection
                                title={t('support-center:announcement')}
                                mode='announcement'
                                contentContainerClassName={isMobile ? 'mt-6' : 'mt-8'}
                                isMobile={isMobile}
                            >
                                {renderAnnouncementCategories()}
                            </SupportSection>
                        </div>

                        <div className='mt-12 sm:mt-20'>
                            <SupportSection
                                title={t('support-center:faq')}
                                mode='faq'
                                contentContainerClassName={isMobile ? 'mt-6' : 'mt-8' + ' !flex'}
                                isMobile={isMobile}
                            >
                                {renderFaqCategories()}
                            </SupportSection>
                        </div>

                        <div className='mt-12 sm:mt-20'>
                            <div className=''>
                                <SupportSection
                                    title={t('support-center:lasted_articles')}
                                    contentContainerClassName={isMobile ? 'mt-6' : 'mt-8' + ' !flex'}
                                    isMobile={isMobile}
                                >
                                    <LastedArticles lastedArticles={lastedArticles} loading={loading} language={language} isApp={isApp} t={t} isMobile={isMobile} />
                                </SupportSection>
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

export const LastedArticles = ({ lastedArticles, loading = false, language, isApp = false, t, containerClassName = '', isMobile = false }) => {
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

    return (
        <div className={classNames('w-full sm:bg-darkBlue-3 rounded-xl sm:p-6 flex flex-col gap-8', containerClassName)}>
            {lastedArticles.map((article, index) => {
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
                    <div>
                        {isMobile && index === 0 ? <div className='ml-4 mb-3 w-fit text-gray-1 font-normal text-xs leading-4 bg-divider-dark bg-opacity-50 px-3 py-1 rounded-[80px]'>{t('support-center:highlight_articles')}</div> : null}
                        <div className={'flex items-center gap-3 sm:gap-6 w-full'} key={article.id}>
                            <span className='rounded-full bg-gray-4 h-2 w-2'>
                            </span>
                            <div>
                                <a href={
                                    PATHS.SUPPORT.DEFAULT +
                                    `/${mode}/${topic}/${article.slug.toString()}${isApp ? '?source=app' : ''
                                    }`
                                }>
                                    <div className='flex flex-col grap-2'>
                                        <div className='mr-2 text-gray-4 text-sm sm:text-base font-normal hover:text-teal active:text-teal'>
                                            {article.title}
                                            {!isMobile && index === 0 ? <span className='ml-9 text-gray-1 font-normal text-xs leading-4 bg-divider-dark bg-opacity-50 px-3 py-1 rounded-[80px]'>{t('support-center:highlight_articles')}</span> : null}
                                        </div>
                                        <div className='mt-2 sm:mt-3 font-normal text-xs leading-4 text-darkBlue-5 whitespace-nowrap'>
                                            {formatTime(article.created_at, 'dd-MM-yyyy')}
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div >)
}