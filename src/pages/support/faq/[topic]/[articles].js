import TopicsLayout from 'components/screens/Support/TopicsLayout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getArticle, getLastedArticles, getSupportCategories } from 'utils'
import { formatTime } from 'redux/actions/utils'
import GhostContent from 'components/screens/Support/GhostContent'

const FaqArticle = (props) => {
    return (
        <TopicsLayout mode="faq" useTopicTitle={false} topics={props?.data?.tags} lastedArticles={props?.data?.lastedArticles}>
            <div className="mt-6 lg:mt-0 text-sm sm:text-[18px] lg:text-[20px] xl:text-[28px] leading-[36px] font-bold">
                {props?.data?.article?.title}
            </div>
            <div
                className="sm:mt-2 text-[10px] sm:text-xs lg:text-[16px] lg:mt-4 font-medium text-txtSecondary dark:text-txtSecondary-dark">
                {formatTime(props?.data?.article?.created_at, 'dd-MM-yyyy')}
            </div>
            <GhostContent content={props?.data?.article?.html}/>
        </TopicsLayout>
    )
}

export async function getServerSideProps({ locale, query }) {
    const tags = await getSupportCategories(locale)
    const article = await getArticle(query.articles)
    const lastedArticles = await getLastedArticles('faq', 8, locale)

    return {
        props: {
            data: {
                tags: tags.faqCategories,
                article,
                lastedArticles
            },
            ...await serverSideTranslations(locale, ['common', 'navbar', 'support-center'])
        }
    }
}

export default FaqArticle
