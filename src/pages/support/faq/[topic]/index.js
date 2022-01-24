import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TopicsLayout from 'components/screens/Support/TopicsLayout'
import axios from 'axios'
import { API_GET_ALL_BLOG_POSTS, API_GET_ALL_BLOG_TAGS } from 'redux/actions/apis'
import { useAsync } from 'react-use'
import { PATHS } from 'constants/paths'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { getSupportArticles, getSupportCategories, ghost } from 'utils'
import { formatTime } from 'redux/actions/utils'
import { useTranslation } from 'next-i18next'

const FaqTopics = (props) => {
    const router = useRouter()
    const {t} = useTranslation()

    const renderTopics = () => {
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
        <TopicsLayout useTopicTitle mode="faq" topics={props?.data?.tags}>
            {renderTopics()}
        </TopicsLayout>
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

// export async function getStaticPaths() {
//     return {
//         paths: [
//             { params: { topic: 'new_listing' } }
//         ],
//         fallback: true
//     }
// }

export default FaqTopics
