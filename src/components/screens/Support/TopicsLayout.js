import classNames from 'classnames';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import SupportBanner from 'components/screens/Support/SupportBanner';
import SupportSearchBar from 'components/screens/Support/SupportSearchBar';
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
import { ChevronDown, ChevronUp } from 'react-feather';
import useHideScrollbar from 'hooks/useHideScrollbar';
import { handleHideScrollBar } from 'utils/helpers';
import { useWindowSize } from 'utils/customHooks';
import SupportSection from './SupportSection';
import { LastedArticles } from 'pages/support';


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

    const baseHref = mode === 'announcement' ? PATHS.SUPPORT.ANNOUNCEMENT : PATHS.SUPPORT.FAQ;
    const queryMode = mode === 'announcement' ? 'noti' : 'faq';
    const topics =
        mode === 'announcement'
            ? SupportCategories.announcements[language]
            : SupportCategories.faq[language];
    const isFaq = mode === 'faq';

    const mainTopic = topics.find((o) => o?.displaySlug === router?.query?.topic);
    const subTopics = mainTopic?.subCats?.find((o) => o?.displaySlug === faqCurrentGroup) || false;

    useEffect(handleHideScrollBar, []);
    useEffect(() => {
        if (isFaq && router?.query?.topic) {
            setShowDropdown({ [router.query.topic]: true });
        }
    }, [isFaq, router]);

    return (
        <MaldivesLayout>
            <div className="bg-[#F2F4F6] dark:bg-bgPrimary-dark pt-8 lg:pt-0">
                {/* <SupportBanner
                    title={
                        mode === 'announcement'
                            ? t('support-center:announcement')
                            : t('support-center:faq')
                    }
                    href={baseHref}
                    containerClassNames="hidden lg:block"
                /> */}
                <SearchSection t={t} width={width} image={`url('/images/screen/support/v2/background/${isFaq ? 'bg_faq' : 'bg_announcement'}.png')`} />
                <div
                    style={
                        theme === THEME_MODE.LIGHT
                            ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' }
                            : undefined
                    }
                    className="bg-bgPrimary dark:bg-darkBlue-2 rounded-t-[20px] lg:mt-0"
                >
                    <div className="block sm:flex min-h-[500px]">
                        <div
                            style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}
                            className="pt-16 sm:py-20 border-r border-divider dark:border-divider-dark"
                        >
                            <div className='hidden sm:block text-white font-medium text-xl px-6 mb-8'>
                                {t('navbar:menu_grid.category')}
                            </div>
                            {topics?.map((item) => (
                                <div key={item.id}>
                                    <div
                                        className={classNames(
                                            'h-14 mb-3 flex items-center hover:bg-hover dark:hover:bg-hover-dark cursor-pointer',
                                            {
                                                'bg-hover dark:bg-hover-dark': router?.query?.topic === item.displaySlug,
                                                'hidden': isMobile && router?.query?.topic !== item.displaySlug && !toggleMenu,
                                            }
                                        )}
                                    >
                                        {!isMobile && router?.query?.topic === item.displaySlug ?
                                            <div className='h-8 w-1 bg-teal rounded-[10px]'></div>
                                            :
                                            null
                                        }
                                        <Link
                                            href={{
                                                pathname:
                                                    PATHS.SUPPORT.DEFAULT + `/${mode}/[topic]`,
                                                query: appUrlHandler(
                                                    { topic: item.displaySlug },
                                                    isApp
                                                )
                                            }}
                                        >
                                            <a
                                                className={classNames(
                                                    'px-6 flex flex-grow items-center text-gray-4 font-semibold text-base cursor-pointer', {
                                                    '!px-4 sm:!px-5': !isFaq && router?.query?.topic === item.displaySlug
                                                }
                                                )}
                                            >
                                                <div className="w-6 h-6 mr-6">
                                                    {
                                                        <Image
                                                            src={getSupportCategoryIcons(item.id)}
                                                            layout="responsive"
                                                            width={24}
                                                            height={24}
                                                        />
                                                    }
                                                </div>
                                                <span className="flex-grow"> {item?.title}</span>
                                            </a>
                                        </Link>
                                        {isFaq && !!item.subCats?.length && (
                                            <span
                                                className="hover:text-dominant cursor-pointer pr-4"
                                                onClick={() =>
                                                    setShowDropdown((prevState) => ({
                                                        ...prevState,
                                                        [item.displaySlug]:
                                                            !showDropdown?.[item.displaySlug]
                                                    }))
                                                }
                                            >
                                                {!!showDropdown?.[item.displaySlug] ? (
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#kstei7ehqa)">
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
                                                        <g clip-path="url(#v5enqzqcna)">
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
                                    {isFaq && !!item.subCats?.length && (
                                        <div
                                            className={classNames('hidden mb-3', {
                                                '!flex flex-col gap-4': !!showDropdown?.[item.displaySlug]
                                            })}
                                        >
                                            {item.subCats?.map((subCats, index) => (
                                                <Link
                                                    key={index}
                                                    href={{
                                                        pathname:
                                                            PATHS.SUPPORT.FAQ +
                                                            `/${item.displaySlug}`,
                                                        query: appUrlHandler(
                                                            {
                                                                group: subCats.displaySlug
                                                            },
                                                            isApp
                                                        )
                                                    }}
                                                >
                                                    <a
                                                        className={classNames(
                                                            'block pl-[72px] text-base cursor-pointer text-darkBlue-5 font-normal',
                                                            {
                                                                '!font-semibold !text-gray-4 leading-6':
                                                                    subCats.displaySlug ===
                                                                    faqCurrentGroup
                                                            }
                                                        )}
                                                    >
                                                        {subCats.title}
                                                    </a>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='w-full'>
                            <div className="flex-grow w-full px-4 py-6 sm:px-[112px] sm:py-20">
                                {children}
                            </div>

                            {lastedArticles && Array.isArray(lastedArticles) && lastedArticles.length && (
                                <div className='px-[112px] pb-24'>
                                    <div className='text-gray-4 text-xl font-medium mb-2'>{t('support-center:lasted_articles')}</div>
                                    <LastedArticles lastedArticles={lastedArticles} language={language} isApp={isApp} t={t} containerClassName="!bg-transparent px-0" />
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
