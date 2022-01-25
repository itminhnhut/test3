import { ChevronRight } from 'react-feather'
import Link from 'next/link'
import { PATHS } from 'constants/paths'
import useWindowSize from 'hooks/useWindowSize'
import { memo, useMemo } from 'react'
import { BREAK_POINTS } from 'constants/constants'
import Skeletor from 'components/common/Skeletor'
import { useTranslation } from 'next-i18next'
import { formatTime } from 'redux/actions/utils'

const SearchResultItem = memo(({ article, loading = false }) => {
    const { width } = useWindowSize()
    const { t, i18n: { language } } = useTranslation()

    // ? Memmoized
    const iconSize = useMemo(() => width >= BREAK_POINTS.lg ? 20 : 16, [width])

    const getTopics = (topic) => {
        switch (topic?.slug) {
            case 'noti':
                return (
                    <>
                        <Link href={PATHS.SUPPORT.ANNOUNCEMENT}>
                            <a className="!underline">{t('support-center:announcement')}</a>
                        </Link>
                        <ChevronRight strokeWidth={1.5} size={iconSize} className="mx-2"/>
                    </>
                )
            case 'faq':
                return (
                    <>
                        <Link href={PATHS.SUPPORT.FAQ}>
                            <a className="!underline">{t('support-center:faq')}</a>
                        </Link>
                        <ChevronRight strokeWidth={1.5} size={iconSize} className="mx-2"/>
                    </>
                )
        }
    }

    const getCategory = (topic, tags) => {
        const slugCollect = tags?.filter(o => o?.slug !== topic?.slug)
        return (
            <Link href={{
                pathname: `${topic?.slug === 'noti' ? PATHS.SUPPORT.ANNOUNCEMENT : PATHS.SUPPORT.FAQ}/[topic]`,
                query: { topic: slugCollect?.[0]?.slug?.replace(`${topic?.slug}-${language}-`, '') }
            }}>
                <a className="!underline">{slugCollect?.[0]?.name}</a>
            </Link>
        )
    }

    return (
        <div className="mb-6 lg:mb-9">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <Link href="#">
                    <a className="font-bold text-sm lg:text-[18px] hover:text-dominant hover:!underline cursor-pointer">
                        {loading ?
                            <div className="!min-w-[200px] lg:!w-[500px] xl:!w-[800px]"><Skeletor className="!w-full"/>
                            </div> : article?.title}
                    </a>
                </Link>
                <div className="font-bold text-[10px] text-txtSecondary dark:text-txtSecondary-dark">
                    {loading ?
                        <div className="hidden md:block md:!w-[100px]"><Skeletor className="!w-full" height={15}/>
                        </div> : formatTime(article?.created_at, 'dd-MM-yyyy')}
                </div>
            </div>
            <div
                className="mt-2.5 overflow-hidden font-medium text-xs lg:text-sm lg:mt-4 md:text-txtSecondary md:dark:text-txtSecondary-dark">
                {loading ?
                    <>
                        <div className="w-full"><Skeletor className="!w-full" height={15}/></div>
                        <div className="w-full"><Skeletor className="!w-full" height={15}/></div>
                        <div className="w-full"><Skeletor className="!w-full" height={15}/></div>
                    </>
                    : (article?.custom_excerpt || article.excerpt)}
            </div>
            <div className="mt-2.5 flex items-center text-[10px] lg:text-sm font-medium">
                {loading ?
                    <div className="!min-w-[80px] lg:!w-[120px] xl:!w-[200px]"><Skeletor className="!w-full" height={15}/></div>
                    : <>
                        {getTopics(article?.primary_tag)}
                        {getCategory(article?.primary_tag, article?.tags)}
                    </>
                }
            </div>
        </div>
    )
})

export default SearchResultItem
