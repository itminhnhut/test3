import { useRouter } from 'next/router'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import SupportBanner from 'components/screens/Support/SupportBanner'
import SupportSearchBar from 'components/screens/Support/SupportSearchBar'
import { PATHS } from 'constants/paths'
import Link from 'next/link'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import useApp from 'hooks/useApp'
import { getSupportCategoryIcons, SupportCategories } from 'pages/support/faq/faqHelper'

const COL_WIDTH = 304

const TopicsLayout = ({
                          children,
                          lastedArticles,
                          useTopicTitle = true,
                          mode = 'announcement'
                      }) => {
    const router = useRouter()
    const [theme] = useDarkMode()
    const { t, i18n: { language } } = useTranslation()
    const isApp = useApp()

    const baseHref = mode === 'announcement' ? PATHS.SUPPORT.ANNOUNCEMENT : PATHS.SUPPORT.FAQ
    const queryMode = mode === 'announcement' ? 'noti' : 'faq'
    const topics = mode === 'announcement' ? SupportCategories.announcements[language] : SupportCategories.faq[language]

    return (
        <MaldivesLayout>
            <SupportBanner title={mode === 'announcement' ? t('support-center:announcement') : t('support-center:faq')}
                           href={baseHref}
                           containerClassNames="hidden lg:block"/>
            <div style={
                theme === THEME_MODE.LIGHT ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' } : undefined}
                 className="bg-bgPrimary dark:bg-darkBlue-2 rounded-t-[20px] mt-8 lg:mt-0">
                <div className="flex min-h-[500px]">
                    <div style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}
                         className="hidden lg:block py-5 lg:py-[40px] border-r border-divider dark:border-divider-dark">
                        {topics?.map(item => <Link key={item.id} href={{
                            pathname: PATHS.SUPPORT.DEFAULT + `/${mode}/[topic]`,
                            query: { topic: item.displaySlug, source: isApp ? 'app' : '' }
                        }}>
                            <a className={classNames('flex items-center block px-5 lg:py-2.5 2xl:py-4 text-[16px] font-medium hover:bg-teal-lightTeal dark:hover:bg-teal-opacity cursor-pointer',
                                                     {
                                                         'bg-teal-lightTeal dark:bg-teal-opacity': router?.query?.topic === item.displaySlug
                                                     }
                            )}>
                                <div className="w-[32px] h-[32px] mr-4">
                                    {<Image src={getSupportCategoryIcons(item.id)} layout="responsive" width={32}
                                            height={32}/>}
                                </div>
                                <span> {item?.title}</span>
                            </a>
                        </Link>)}
                    </div>

                    <div className="flex-grow px-4 pb-8 md:px-6 lg:px-8 lg:py-[40px]">
                        <SupportSearchBar simpleMode containerClassNames="!mt-4 lg:!mt-0 lg:hidden"/>
                        {useTopicTitle &&
                        <div className={classNames('text-[16px] md:text-[20px] lg:text-[28px] font-bold mt-4 mb-6 lg:mt-0 lg:mb-10',
                                                   {
                                                       'lg:!m-0': !useTopicTitle,
                                                   })}>
                            {topics.find(o => o?.displaySlug === router?.query?.topic)?.title}
                        </div>}
                        {children}
                    </div>

                    {lastedArticles && Array.isArray(lastedArticles) && lastedArticles.length &&
                    <div style={{ width: COL_WIDTH, minWidth: COL_WIDTH }}
                         className="hidden lg:block py-5 lg:py-[40px] pr-4 lg:pr-6 xl:pr-8">
                        <div className="px-3 text-[16px] font-bold mb-2.5">{t('support-center:lasted_articles')}</div>
                        {lastedArticles.map(article => {
                            let topic
                            const ownedTags = article.tags.filter(f => f.slug !== queryMode)
                                ?.map(o => o?.slug?.replace(`${queryMode}-vi-`, '')
                                    ?.replace(`${queryMode}-en-`, ''))
                            const _tagsLib = topics.map(o => o.displaySlug)

                            ownedTags.forEach(e => {
                                if (_tagsLib.includes(e)) topic = e
                            })

                            return (
                                <Link key={article.id} href={{
                                    pathname: baseHref + '/[topic]/[articles]',
                                    query: { topic, articles: article.id?.toString(), source: isApp ? 'app' : '' }
                                }}>
                                    <a className={classNames('block mb-2.5 font-medium px-3 py-2.5 rounded-[8px]',
                                                             { 'bg-gray-4 dark:bg-darkBlue-4': article.id === router?.query?.articles })}>
                                        {article?.title}
                                    </a>
                                </Link>
                            )
                        })}
                    </div>}
                </div>
            </div>
        </MaldivesLayout>
    )
}

export default TopicsLayout
