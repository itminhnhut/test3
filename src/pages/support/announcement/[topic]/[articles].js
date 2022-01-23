import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TopicsLayout from 'components/screens/Support/TopicsLayout'
import axios from 'axios'
import { API_GET_ALL_BLOG_POSTS, API_GET_ALL_BLOG_TAGS } from 'redux/actions/apis'
import { useAsync } from 'react-use'
import { PATHS } from 'constants/paths'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'

const AnnouncementArticle = (props) => {
    const router = useRouter()

    useEffect(() => {
        console.log('nami ', props)
    }, [props])

    return (
        <TopicsLayout useTopicTitle={false} topics={props?.data?.tags} lastedArticles={props?.data?.lastedArticles}>

        </TopicsLayout>
    )
}

export async function getStaticProps({ locale }) {
    let tags, articles
    const tagsResult = await axios.get(API_GET_ALL_BLOG_TAGS)
    const articlesResult = await axios.get(API_GET_ALL_BLOG_POSTS)
    console.log('namidev ', articlesResult)

    if (tagsResult.status === 200 && tagsResult.data?.tags?.length) {
        tags = tagsResult.data.tags
    }
    //
    if (articlesResult.status === 200 && articlesResult.data?.posts?.length) {
        articles = articlesResult.data.posts
    }

    return {
        props: {
            data: {
                tags,
                articles
            },
            ...await serverSideTranslations(locale, ['common', 'navbar'])
        }
    }
}

export async function getStaticPaths() {
    return {
        paths: [
            { params: { topic: 'new_listing', articles: 'abcdxyz' } }
        ],
        fallback: true
    }
}

export default AnnouncementArticle
