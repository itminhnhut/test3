import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import SupportBanner from 'components/screens/Support/SupportBanner'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import TopicItem from 'components/screens/Support/TopicItem'
import Image from 'next/image'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PATHS } from 'constants/paths'
import { useCallback, useEffect, useState } from 'react'
import { getLastedArticles, getSupportCategories } from 'utils'
import { useTranslation } from 'next-i18next'
import { formatTime } from 'redux/actions/utils'

const SupportAnnouncement = () => {
    const [theme] = useDarkMode()
    const [categories, setCategories] = useState([])
    const [lastedArticles, setLastedArticles] = useState([])

    const getData = async (language) => {
        const categories = await getSupportCategories(language)
        const lastedArticles = await getLastedArticles('noti')

        setCategories(categories.announcementCategories)
        setLastedArticles(lastedArticles)
    }

    const {
        t,
        i18n: { language }
    } = useTranslation()

    const renderTopics = useCallback(() => {
        return categories?.map(cat => (
            <Link key={cat.displaySlug} href={{
                pathname: PATHS.SUPPORT.TOPICS,
                query: { topic: cat.displaySlug }
            }}>
                <a className="block w-[48%] sm:w-[49%] lg:w-[32%] mt-3 md:mt-5">
                    <TopicItem
                        icon={<Image src={cat?.iconUrl} layout="responsive" width="24"
                                     height="24"/>}
                        title={cat.name}
                        description={cat?.description || '---'}
                    />
                </a>
            </Link>
        ))
    }, [categories])

    const renderLastedArticles = useCallback(() => {
        return lastedArticles.map(article => {
            let topic
            const ownedTags = article.tags.filter(f => f.slug !== 'noti')
                ?.map(o => o?.slug?.replace('noti-vi-', '')
                    ?.replace('noti-en-', ''))
            const _tagsLib = categories.map(o => o.displaySlug)

            ownedTags.forEach(e => {
                if (_tagsLib.includes(e)) topic = e
            })

            return (
                <Link key={article?.id} href={{
                    pathname: PATHS.SUPPORT.ANNOUNCEMENT + '/[topic]/[articles]',
                    query: { topic, articles: article.id }
                }}>
                    <a className="w-full md:w-1/2 text-sm lg:text-[16px] font-medium hover:text-dominant mb-5 lg:mb-8">
                        {article.title}
                        {' '}<span
                        className="text-[10px] lg:text-xs text-txtSecondary text-txtSecondary-dark whitespace-nowrap">
                        {formatTime(article.created_at, 'dd-MM-yyyy')}
                    </span>
                    </a>
                </Link>
            )
        })
    }, [lastedArticles, categories])

    useEffect(() => {
        getData(language)
    }, [language])

    return (
        <MaldivesLayout>
            <SupportBanner title={t('support-center:title')} innerClassNames="container" href={PATHS.SUPPORT.DEFAULT}/>
            <div className="">
                <div style={
                    theme === THEME_MODE.LIGHT ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' } : undefined}
                     className="px-4 py-5 sm:px-6 lg:px-[48px] lg:py-[50px] rounded-t-[20px]">
                    <div className="container">
                        <div className="text-[16px] font-bold md:text-[20px] lg:text-[28px] mb-4 md:mb-6 lg:mb-8">
                            {t('support-center:topics')}
                        </div>
                        <div className="flex flex-wrap justify-between w-full mb-8 md:mb-12 lg:mb-[80px]">
                            {renderTopics()}
                        </div>
                        <div className="text-[16px] font-bold md:text-[20px] lg:text-[28px] mb-6 md:mb-8">
                            {t('support-center:lasted_articles')}
                        </div>
                        <div className="flex flex-col md:flex-row md:flex-wrap">
                            {renderLastedArticles()}
                        </div>
                    </div>
                </div>
            </div>
        </MaldivesLayout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'support-center'])
    }
})

export default SupportAnnouncement
