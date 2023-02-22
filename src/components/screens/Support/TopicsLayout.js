import classNames from 'classnames';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import SearchSection from 'components/screens/Support/SearchSection';
import { appUrlHandler, getSupportCategoryIcons, SupportCategories } from 'constants/faqHelper';
import { PATHS } from 'constants/paths';
import useApp from 'hooks/useApp';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWindowSize } from 'utils/customHooks';
import { LastedArticles } from 'pages/support';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { reloadData } from 'redux/actions/heath';


const TopicsLayout = ({
    children,
    lastedArticles,
    useTopicTitle = true,
    mode = 'announcement',
    faqCurrentGroup
}) => {
    const [showDropdown, setShowDropdown] = useState({});
    const { width } = useWindowSize()

    const isMobile = width < 640
    const COL_WIDTH = isMobile ? null : 308;

    const router = useRouter();
    const [theme] = useDarkMode();
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const isApp = useApp();

    const [toggleMenu, setToggleMenu] = useState(false)
    const dispath = useDispatch();
    const topics =
        mode === 'announcement'
            ? SupportCategories.announcements[language]
            : SupportCategories.faq[language];
    const isFaq = mode === 'faq';

    const mainTopic = topics.find((o) => o?.displaySlug === router?.query?.topic);
    const subTopics = mainTopic?.subCats?.find((o) => o?.displaySlug === faqCurrentGroup) || false;
    useEffect(() => {
        document.body.classList.add('no-scrollbar');
        const intervalReloadData = setInterval(() => {
            dispath(reloadData());
        }, 5 * 60 * 1000);
        return () => {
            document.body.classList.remove('no-scrollbar');
            clearInterval(intervalReloadData);
        };
    }, []);

    useEffect(() => {
        if (isFaq && router?.query?.topic) {
            setShowDropdown({ [router.query.topic]: true });
        }
        setToggleMenu(false)
    }, [isFaq, router]);

    const renderTopics = useMemo(() => topics?.map((item) => (
        <div key={item?.id}>
            <div
                className={classNames(
                    'h-14 mb-3 flex items-center hover:bg-hover dark:hover:bg-hover-dark cursor-pointer',
                    {
                        'bg-hover dark:bg-hover-dark': router?.query?.topic === item?.displaySlug,
                        // 'hidden': isMobile && router?.query?.topic !== item?.displaySlug,
                    }
                )}
            >
                {!isMobile && router?.query?.topic === item?.displaySlug ?
                    <div className='h-8 w-1 bg-bgBtnV2 dark:bg-teal rounded-[10px]'></div>
                    :
                    null
                }
                <Link
                    href={{
                        pathname:
                            PATHS.SUPPORT.DEFAULT + `/${mode}/[topic]`,
                        query: appUrlHandler(
                            { topic: item?.displaySlug },
                            isApp
                        )
                    }}
                >
                    <a className={classNames(
                        'px-4 sm:px-6 flex flex-grow items-center text-txtPrimary dark:text-gray-4 font-normal text-sm sm:text-base cursor-pointer', {
                        'sm:!px-5 sm:!font-semibold': !isFaq && router?.query?.topic === item?.displaySlug
                    })}>
                        <div className="h-6 w-6 mr-3 sm:mr-6">
                            <Image
                                src={getSupportCategoryIcons(item?.id)}
                                layout="responsive"
                                width={24}
                                height={24}
                            />
                        </div>
                        <span className="flex-grow"> {item?.title}</span>
                    </a>
                </Link>
                {isFaq && !!item?.subCats?.length && (
                    <span
                        className="hover:text-txtTextBtn dark:hover:text-teal cursor-pointer pr-4"
                        onClick={() =>
                            setShowDropdown((prevState) => ({
                                ...prevState,
                                [item?.displaySlug]:
                                    !showDropdown?.[item?.displaySlug]
                            }))
                        }
                    >
                        {!!showDropdown?.[item?.displaySlug] ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#kstei7ehqa)">
                                    <path d="M4.667 9.333 8 6l3.333 3.333H4.667z" fill="#8694B3" />
                                </g>
                                <defs>
                                    <clipPath id="kstei7ehqa">
                                        <path fill="#fff" d="M0 0h16v16H0z" />
                                    </clipPath>
                                </defs>
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#v5enqzqcna)">
                                    <path d="M4.667 6.667 8 10l3.333-3.333H4.667z" fill="#8694B3" />
                                </g>
                                <defs>
                                    <clipPath id="v5enqzqcna">
                                        <path fill="#fff" d="M0 0h16v16H0z" />
                                    </clipPath>
                                </defs>
                            </svg>

                        )}
                    </span>
                )}
            </div>
            {isFaq && !!item?.subCats?.length && (
                <div
                    className={classNames('hidden mb-3', {
                        '!flex flex-col gap-4': !!showDropdown?.[item?.displaySlug]
                    })}
                >
                    {item?.subCats?.map((subCats, index) => (
                        <Link
                            key={index}
                            href={{
                                pathname:
                                    PATHS.SUPPORT.FAQ +
                                    `/${item?.displaySlug}`,
                                query: appUrlHandler(
                                    {
                                        group: subCats?.displaySlug
                                    },
                                    isApp
                                )
                            }}
                        >
                            <a
                                className={classNames(
                                    'block pl-[72px] text-sm font-semibold sm:text-base sm:font-normal cursor-pointer text-txtSecondary dark:text-darkBlue-5',
                                    {
                                        '!font-semibold !text-txtPrimary dark:!text-gray-4 leading-6':
                                            subCats?.displaySlug ===
                                            faqCurrentGroup
                                    }
                                )}
                            >
                                {subCats?.title}
                            </a>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )), [topics, router?.query?.topic, showDropdown, isMobile])

    return (
        <MaldivesLayout>
            <div className="bg-bgPrimary dark:bg-dark pt-0">
                <SearchSection t={t} width={width} image={`url('/images/screen/support/v2/background/${isFaq ? 'bg_faq' : 'bg_announcement'}.png')`} />
                <div className="bg-bgPrimary dark:bg-dark rounded-t-[20px] lg:mt-0">
                    <div className="block sm:flex min-h-[500px] relative 2xl:max-w-screen-xxl m-auto">
                        <div
                            style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}
                            className="pt-16 sm:py-20 border-r border-divider dark:border-divider-dark"
                        >
                            <div className='hidden sm:block text-txtPrimary dark:text-white font-semibold text-2xl px-6 mb-8'>
                                {t('navbar:menu_grid.category')}
                            </div>
                            {isMobile ?
                                <div
                                    className={classNames(
                                        'h-[52px] px-4 flex flex-grow items-center cursor-pointer border-b-[1px] border-divider dark:border-divider-dark'
                                    )}
                                >
                                    <div className="w-6 h-6 mr-3">
                                        <Image
                                            src={getSupportCategoryIcons(mainTopic?.id)}
                                            width={24}
                                            height={24}
                                        />
                                    </div>
                                    <div className='flex justify-between w-full' onClick={() => setToggleMenu(!toggleMenu)}>
                                        <div className="flex-grow text-txtPrimary dark:text-gray-4 font-semibold text-sm"> {subTopics ? subTopics?.title : mainTopic?.title}</div>
                                        <div>
                                            {toggleMenu ?
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#kstei7ehqa)">
                                                        <path d="M4.667 9.333 8 6l3.333 3.333H4.667z" fill="#8694B3" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="kstei7ehqa">
                                                            <path fill="#fff" d="M0 0h16v16H0z" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                :
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clipPath="url(#v5enqzqcna)">
                                                        <path d="M4.667 6.667 8 10l3.333-3.333H4.667z" fill="#8694B3" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="v5enqzqcna">
                                                            <path fill="#fff" d="M0 0h16v16H0z" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            }
                                        </div>
                                    </div>
                                </div>
                                : null}
                            <div className={classNames('', {
                                'absolute w-full h-full': isMobile && toggleMenu,
                                'hidden h-0': isMobile && !toggleMenu
                            })}>
                                <div className='bg-bgPrimary dark:bg-dark pt-3 sm:pt-0'>
                                    {renderTopics}
                                </div>
                                <div className='h-[calc(100%-600px)] min-h-[150px] w-full bg-black-800/[.6] dark:bg-black-800/80 sm:hidden' onClick={() => setToggleMenu(false)}></div>
                            </div>
                        </div>

                        <div className='w-full'>
                            <div className="flex-grow w-full px-4 py-4 pb-12 sm:px-[112px] sm:py-20">
                                {children}
                            </div>

                            {lastedArticles && Array.isArray(lastedArticles) && lastedArticles?.length && (
                                <div className='px-4 sm:px-[112px] pb-24'>
                                    <div className='text-txtPrimary dark:text-gray-4 text-2xl font-semibold mb-6 sm:mb-2'>{t('support-center:lasted_articles')}</div>
                                    <LastedArticles isMobile={isMobile} lastedArticles={lastedArticles} language={language} isApp={isApp} t={t} containerClassName="!bg-transparent px-0 !shadow-none" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MaldivesLayout>
    );
};

export default TopicsLayout;
