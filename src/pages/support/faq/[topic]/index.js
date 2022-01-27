import { useRouter } from 'next/router'
import TopicsLayout from 'components/screens/Support/TopicsLayout'
import { PATHS } from 'constants/paths'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { getSupportArticles, getSupportCategories } from 'utils'
import { formatTime } from 'redux/actions/utils'
import { useTranslation } from 'next-i18next'
import useApp from 'hooks/useApp'
import { ChevronLeft } from 'react-feather'

const FaqTopics = (props) => {
    const router = useRouter()
    const isApp = useApp()
    const {t} = useTranslation()

    const renderCats = () => {
        const data = props?.data?.articles?.filter(f => {
            const _tags = f.tags.map(e => e.slug?.replace('faq-vi-', '')
                .replace('faq-en-', ''))
            return _tags?.includes(router?.query?.topic)
        })

        if (!data || !data?.length) {
            return <div>{t('support-center:no_articles')}</div>
        }
        // console.log('namidev faq ', data)
        return data?.map(item => (
            <Link href={{
                pathname: PATHS.SUPPORT.FAQ + `/${router?.query?.topic}/[articles]`,
                query: {
                    articles: item.id.toString(),
                    source: isApp ? 'app' : ''
                }
            }} key={item.uuid}>
                <a className="block text-sm font-medium mb-[18px] lg:text-[16px] lg:mb-8 hover:!text-dominant">
                    {item?.title}{' '}{' '}
                    <span className="text-[10px] lg:text-xs text-txtSecondary dark:text-txtSecondary-dark">
                        {formatTime(item.created_at, 'dd-MM-yyyy')}
                    </span>
                </a>
            </Link>
        ))
    }

    const renderAppHeader = () => {
        if (!isApp) return null
        const topic = props?.data?.tags?.find(o => o?.displaySlug === router?.query?.topic)?.name
        return (
            <div onClick={router?.back} className="active:text-dominant flex items-center px-4 pt-4 pb-2 text-sm font-medium">
                <ChevronLeft size={16}
                             className="mr-2.5"/>
                {topic}
                {topic && ' | '}
                Nami FAQ
            </div>
        )
    }

    return (
        <>
            {renderAppHeader()}
            <TopicsLayout useTopicTitle mode="faq" topics={props?.data?.tags}>
                {renderCats()}
            </TopicsLayout>
        </>
    )
}

export async function getServerSideProps({ locale }) {
    const articles = await getSupportArticles('faq')
    const tags = await getSupportCategories(locale)

    return {
        props: {
            data: {
                tags: tags.faqCategories,
                articles: articles
            },
            ...await serverSideTranslations(locale, ['common', 'navbar', 'support-center'])
        }
    }
}

export default FaqTopics
