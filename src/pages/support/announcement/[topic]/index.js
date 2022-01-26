import { useRouter } from 'next/router'
import TopicsLayout from 'components/screens/Support/TopicsLayout'
import { PATHS } from 'constants/paths'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { getLastedArticles, getSupportArticles, getSupportCategories, ghost } from 'utils'
import { formatTime } from 'redux/actions/utils'

const AnnouncementTopics = (props) => {
    const router = useRouter()

    const renderTopics = () => {
        const data = props?.data?.articles?.filter(f => {
            const _tags = f.tags.map(e => e.slug?.replace('noti-vi-', '')
                .replace('noti-en-', ''))
            return _tags?.includes(router?.query?.topic)
        })

        if (!data || !data?.length) {
            return <div>No topics</div>
        }
        // console.log('namidev ', data)
        return data?.map(item => (
            <Link href={{
                pathname: PATHS.SUPPORT.ANNOUNCEMENT + `/${router?.query?.topic}/[articles]`,
                query: {
                    articles: item.id.toString()
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

    return (
        <TopicsLayout useTopicTitle mode="announcement" topics={props?.data?.tags}>
            {renderTopics()}
        </TopicsLayout>
    )
}

export async function getServerSideProps({ locale }) {
    const articles = await getLastedArticles('noti', 'all', locale)
    const tags = await getSupportCategories(locale)

    return {
        props: {
            data: {
                tags: tags.announcementCategories,
                articles: articles
            },
            ...await serverSideTranslations(locale, ['common', 'navbar', 'support-center'])
        }
    }
}

export default AnnouncementTopics
