import TopicsLayout from 'components/screens/Support/TopicsLayout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getArticle, getLastedArticles } from 'utils';
import { formatTime } from 'redux/actions/utils';
import GhostContent from 'components/screens/Support/GhostContent';
import useApp from 'hooks/useApp';
import { useRouter } from 'next/router';
import { SupportCategories } from 'constants/faqHelper';
import { useTranslation } from 'next-i18next';
import SupportCenterHead from 'components/common/SupportCenterHead';
import { useEffect } from 'react';
import useDarkMode, { THEME_MODE } from "hooks/useDarkMode";
import { useDispatch } from 'react-redux';
import { reloadData } from 'redux/actions/heath';
import AppHeader from 'components/screens/Support/AppHeader';

const FaqArticle = (props) => {
    const router = useRouter()
    const isApp = useApp()
    const {
        i18n: { language },
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
        const topic = SupportCategories.faq[language]?.find(
            (o) => o?.displaySlug === router?.query?.topic
        )?.name
        return <AppHeader topic={topic} title="Nami FAQ" />
    }

    useEffect(() => {
        console.log('Props ', props)
    }, [props])

    return (
        <>
            <SupportCenterHead article={props?.data?.article} />
            {renderAppHeader()}
            <TopicsLayout
                mode='faq'
                useTopicTitle={false}
                lastedArticles={props?.data?.lastedArticles}
            >
                <div className='mt-6 lg:mt-0 text-sm sm:text-[18px] lg:text-[20px] xl:text-[28px] leading-[36px] font-bold'>
                    {props?.data?.article?.title}
                </div>
                <div className='sm:mt-2 text-[10px] sm:text-xs lg:text-[16px] lg:mt-4 font-medium text-txtSecondary dark:text-txtSecondary-dark'>
                    {formatTime(props?.data?.article?.published_at, 'dd/MM/yyyy')}
                </div>
                <GhostContent content={props?.data?.article?.html} />
            </TopicsLayout>
        </>
    )
}

export async function getServerSideProps({ res, locale, query }) {
    try {
        const article = await getArticle(query.articles)
        const lastedArticles = await getLastedArticles('faq', 8, 1, locale)

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

export default FaqArticle
