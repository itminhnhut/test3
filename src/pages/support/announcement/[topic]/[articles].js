import TopicsLayout from 'components/screens/Support/TopicsLayout';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {getArticle, getLastedArticles} from 'utils';
import {formatTime} from 'redux/actions/utils';
import GhostContent from 'components/screens/Support/GhostContent';
import {ChevronLeft} from 'react-feather';
import useApp from 'hooks/useApp';
import {useRouter} from 'next/router';
import {SupportCategories} from 'constants/faqHelper';
import {useTranslation} from 'next-i18next';
import SupportCenterHead from 'components/common/SupportCenterHead';
import SEO from "components/common/SEO";
import useDarkMode, { THEME_MODE } from "hooks/useDarkMode";
import { useEffect } from "react";
import { useDispatch } from 'react-redux';
import { reloadData } from 'redux/actions/heath';
import AppHeader from 'components/screens/Support/AppHeader';

const AnnouncementArticle = (props) => {
    const article = props?.data.article
    const router = useRouter()
    const isApp = useApp()
    const {
        i18n: {language},
    } = useTranslation()
    const [theme, , setTheme] = useDarkMode();
    const dispath = useDispatch();

    useEffect(() => {
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

    // useEffect(() => {
    //     const themeLocal = localStorage.getItem("theme");
    //     if (themeLocal === "dark") {
    //         setTheme(THEME_MODE.DARK);
    //     } else {
    //         setTheme(THEME_MODE.LIGHT);
    //     }
    // }, [router?.query]);

    const renderAppHeader = () => {
        if (!isApp) return null
        const topic = SupportCategories.announcements[language]?.find(
            (o) => o?.displaySlug === router?.query?.topic
        )?.name
        return <AppHeader topic={topic} title="Nami Announcement" />
    }

    return (
        <>
            <SEO
                title={article?.title}
                url={router.asPath}
                description={article?.excerpt}
                image={article?.feature_image || 'https://static.namifutures.com/nami.exchange/images/common-featured.png'}
                createdAt={article?.published_at}
                updatedAt={article?.published_at}
            />
            {renderAppHeader()}
            <TopicsLayout
                mode='announcement'
                useTopicTitle={false}
                lastedArticles={props?.data?.lastedArticles}
            >
                <div
                    className='mt-6 lg:mt-0 text-sm sm:text-[18px] lg:text-[20px] xl:text-[28px] leading-[36px] font-bold'>
                    {props?.data?.article?.title}
                </div>
                <div
                    className='sm:mt-2 text-[10px] sm:text-xs lg:text-[16px] lg:mt-4 font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                    {formatTime(props?.data?.article?.published_at, 'dd/MM/yyyy')}
                </div>
                <GhostContent content={props?.data?.article?.html}/>
            </TopicsLayout>
        </>
    )
}

export async function getServerSideProps({locale, query}) {
    try {
        const article = await getArticle(query.articles)
        const lastedArticles = await getLastedArticles('noti', 8, 1, locale)

        return {
            props: {
                data: {
                    article,
                    lastedArticles,
                },
                ...(await serverSideTranslations(locale, [
                    'common',
                    'navbar',
                    'support-center',
                ])),
            },
        }
    } catch (e) {
        return {
            redirect: {
                permanent: false,
                destination: '/404',
            },
        }
    }
}

export default AnnouncementArticle
