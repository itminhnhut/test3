import { useCallback, useMemo, useState } from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { BREAK_POINTS } from 'constants/constants'
import { useRouter } from 'next/router'
import { PATHS } from 'constants/paths'

import SupportSectionItem from 'components/screens/Support/SupportSectionItem'
import SupportSearchBar from 'components/screens/Support/SupportSearchBar'
import SupportSection from 'components/screens/Support/SupportSection'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import useWindowSize from 'hooks/useWindowSize'
import useApp from 'hooks/useApp'
import Image from 'next/image'
import { useAsync } from 'react-use'
import { getLastedArticles, getSupportCategories, ghost } from 'utils'
import { useTranslation } from 'next-i18next'
import { formatTime } from 'redux/actions/utils'


const Support = () => {
    // ? State
    const [announcementCategories, setAnnouncementCategories] = useState([])
    const [faqCategories, setFaqCategories] = useState([])
    const [lastedArticles, setLastedArticles] = useState([])

    // ? Use hooks
    const { width } = useWindowSize()
    const { t, i18n: { language } } = useTranslation()

    // ? Memmoized
    const sectionIconSize = useMemo(() => width >= BREAK_POINTS.lg ? 32 : 24, [width])

    // ? Render input
    const renderInput = useCallback(() => {
        return (
            <SupportSearchBar
                simpleMode={width < BREAK_POINTS.lg}
            />)
    }, [width])

    const renderFaqCategories = useCallback(() => {
        return faqCategories.map(faq => (
            <SupportSectionItem
                key={faq.id}
                href={{
                    pathname: PATHS.SUPPORT.FAQ + '/[topic]',
                    query: { topic: faq.displaySlug }
                }}
                title={faq?.name || '--'}
                titleClassNames="truncate"
                icon={<Image src={faq?.iconUrl}
                             width={sectionIconSize}
                             height={sectionIconSize}/>}
            />
        ))
    }, [faqCategories])

    const renderAnnouncementCategories = useCallback(() => {
        return announcementCategories.map(announcement => (
            <SupportSectionItem
                key={announcement.id}
                href={{
                    pathname: PATHS.SUPPORT.ANNOUNCEMENT + '/[topic]',
                    query: { topic: announcement.displaySlug }
                }}
                title={announcement?.name || '--'}
                titleClassNames="truncate"
                icon={<Image src={announcement?.iconUrl}
                             width={sectionIconSize} height={sectionIconSize}/>}/>
        ))
    }, [announcementCategories])

    const renderLastedArticles = useCallback(() => {
        return lastedArticles.map(article => (
            <SupportSectionItem
                key={article.id}
                title={<>
                                            <span
                                                className="mr-2">
                                                {article.title}
                                            </span>
                    <span
                        className="text-txtSecondary dark:text-txtSecondary-dark text-[10px] lg:text-[12px] whitespace-nowrap">
                        {formatTime(article.created_at, 'dd-MM-yyyy')}
                    </span>
                </>}
                containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
        ))
    }, [lastedArticles])

    useAsync(async () => {
        const data = await getSupportCategories(language)
        const lastedArticles = await getLastedArticles(undefined, 5)
        console.log('namidev ', lastedArticles)
        setAnnouncementCategories(data.announcementCategories)
        setFaqCategories(data.faqCategories)
        setLastedArticles(lastedArticles)
    }, [language])

    return (
        <MaldivesLayout>
            <div className="bg-[#F8F9FA] dark:bg-darkBlue-1">
                <div className="container pt-6 max-w-[1400px]">
                    <div className="font-bold px-4 text-[20px] mt-8 lg:mt-[40px] lg:text-[26px]">
                        {t('support-center:title')}
                    </div>
                    <div
                        className="mt-8 pt-4 pb-[80px] px-4 h-full bg-[#FCFCFC] dark:bg-darkBlue-2 rounded-t-[20px] drop-shadow-onlyLight lg:!bg-transparent">
                        <div className="text-[16px] font-medium">{t('support-center:search_faq')}</div>
                        {renderInput()}

                        <div className="mt-6 lg:mt-8">
                            <SupportSection title={t('support-center:faq')} mode="faq" containerClassNames="lg:pb-[32px]">
                                {renderFaqCategories()}
                            </SupportSection>
                        </div>

                        <div className="mt-6 lg:mt-8">
                            <SupportSection title={t('support-center:announcement')} containerClassNames="lg:pb-[32px]">
                                {renderAnnouncementCategories()}
                            </SupportSection>
                        </div>

                        <div className="mt-6 lg:mt-8">
                            <div className="lg:bg-bgPrimary dark:bg-bgPrimary-dark lg:rounded-xl lg:flex lg:mt-4">
                                <SupportSection title={t('support-center:lasted_articles')}
                                                contentContainerClassName="lg:!py-0 lg:!pb-6 lg:!mt-4">
                                    {renderLastedArticles()}
                                </SupportSection>
                                <SupportSection title={t('support-center:highlight_articles')}
                                                contentContainerClassName="lg:!py-0 lg:!pb-6 lg:!mt-4"
                                                containerClassNames="mt-6 lg:mt-0">
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                    <SupportSectionItem
                                        title="Lorem ip sum nonstop Lorem ip sum nonstop Lorem ip sum nonstop"
                                        containerClassNames="lg:!w-full md:!pr-6 lg:!pr-3 lg:!mb-0"
                                        classNames="active:!bg-transparent hover:!underline hover:!text-dominant"/>
                                </SupportSection>
                            </div>
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

export default Support
