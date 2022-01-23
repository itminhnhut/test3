import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import TopicsLayout from 'components/screens/Support/TopicsLayout'
import axios from 'axios'
import { API_GET_ALL_BLOG_POSTS, API_GET_ALL_BLOG_TAGS } from 'redux/actions/apis'
import { useAsync } from 'react-use'
import { PATHS } from 'constants/paths'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Link from 'next/link'

const AnnouncementTopics = (props) => {
    const router = useRouter()

    useEffect(() => {
        console.log('nami ', props)
    }, [props])

    return (
        <TopicsLayout topics={props?.data?.tags}>
            {props?.data?.articles?.map(item => (
                <Link href={{
                    pathname: PATHS.SUPPORT.ARTICLES,
                    query: {
                        topic: item.slug,
                        articles: item.id.toString()
                    }
                }} key={item.uuid}>
                    <a className="block text-sm font-medium mb-[18px] lg:text-[16px] lg:mb-6 hover:text-dominant">
                        {item?.title}{' '}{' '}<span className="text-[10px] text-txtSecondary dark:text-txtSecondary-dark">2021-12-30</span>
                    </a>
                </Link>
            ))}
        </TopicsLayout>
    )
}

export async function getStaticProps({ locale }) {
    let tags, articles
    const tagsResult = await axios.get(API_GET_ALL_BLOG_TAGS)
    const articlesResult = await axios.get(API_GET_ALL_BLOG_POSTS)
    // console.log('namidev ', articlesResult)

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
            { params: { topic: 'new_listing' } }
        ],
        fallback: true
    }
}

export default AnnouncementTopics
