import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TopicsLayout from 'components/screens/Support/TopicsLayout'
import axios from 'axios'
import { API_GET_ALL_BLOG_POSTS, API_GET_ALL_BLOG_TAGS } from 'redux/actions/apis'
import { useAsync } from 'react-use'
import { PATHS } from 'constants/paths'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'
import { getArticle, getSupportArticles, getSupportCategories } from 'utils'
import { formatTime } from 'redux/actions/utils'
import Parser from 'html-react-parser'

const AnnouncementArticle = (props) => {
    const router = useRouter()

    useEffect(() => {
        console.log('nami ', props)
    }, [props])

    return (
        <TopicsLayout useTopicTitle={false} topics={props?.data?.tags} lastedArticles={props?.data?.lastedArticles}>
            <div className="mt-6 text-sm sm:text-[18px] lg:text-[28px] leading-[36px] font-bold">
                {props?.data?.article?.title}
            </div>
            <div
                className="sm:mt-2 text-[10px] sm:text-xs lg:text-[16px] lg:mt-4 font-medium text-txtSecondary dark:text-txtSecondary-dark">
                {formatTime(props?.data?.article?.created_at, 'dd-MM-yyyy')}
            </div>
            <div className="mt-4 sm:mt-6 lg:mt-8 !text-xs sm:!text-sm lg:!text-[16px]">
                {Parser(props?.data?.article?.html)}
            </div>
        </TopicsLayout>
    )
}

export async function getServerSideProps({
    locale,
    query
}) {
    const tags = await getSupportCategories(locale)
    const article = await getArticle(query.articles)

    return {
        props: {
            data: {
                tags: tags.announcementCategories,
                article
            },
            ...await serverSideTranslations(locale, ['common', 'navbar', 'support-center'])
        }
    }
}

// export async function getStaticPaths() {
//     return {
//         paths: [
//             { params: { topic: 'new_listing', articles: 'abcdxyz' } }
//         ],
//         fallback: true
//     }
// }

export default AnnouncementArticle
