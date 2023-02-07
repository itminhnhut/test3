import Link from 'next/link';
import { PATHS } from 'constants/paths';
import useWindowSize from 'hooks/useWindowSize';
import { memo, useMemo } from 'react';
import { BREAK_POINTS } from 'constants/constants';
import Skeletor from 'components/common/Skeletor';
import { useTranslation } from 'next-i18next';
import { formatTime } from 'redux/actions/utils';
import Parse from 'html-react-parser';
import _ from 'lodash';

const SearchResultItem = memo(({ article, loading = false, keyword = '' }) => {
    const { width } = useWindowSize()
    const isMobile = width < 640
    const { t, i18n: { language } } = useTranslation()

    // ? Memmoized
    const getTopics = (topic) => {
        if (!topic) return null
        // console.log('namidev ', topic);
        let url
        if (topic?.slug?.includes('noti')) {
            url = PATHS.SUPPORT.ANNOUNCEMENT
        } else {
            url = PATHS.SUPPORT.FAQ
        }
        return (
            <>
                <Link href={url}>
                    <a className="!underline">{topic?.name}</a>
                </Link>
                {/* <ChevronRight strokeWidth={1.5} size={iconSize} className="mx-2"/> */}
            </>
        )
    }

    const getHighlightedText = (text, highlight) => {
        // Split on highlight term and include term into parts, ignore case
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, i) => part &&
            <span key={i} style={part.toLowerCase() === highlight?.toLowerCase() ? { color: '#47cc85' } : {}}>
                {Parse(part)}
            </span>)

    }



    const buildArticleUrl = () => {
        const isFaq = !!article?.tags.filter(o => o.slug === 'faq' || o.slug.includes('faq-'))?.length

        if (isFaq) {
            const cats = article?.tags?.filter(o => o.slug !== 'faq')?.[0]
            return PATHS.SUPPORT.FAQ + `/${cats?.slug?.replace(`faq-${language}-`, '')}/${article?.slug}`
        } else {
            const cats = article?.tags?.filter(o => o.slug.includes('noti'))
            // console.log('namidev noti ', article, cats);
            if (!cats?.length) return article?.url
            return PATHS.SUPPORT.ANNOUNCEMENT + `/${cats?.[0]?.slug?.replace(`noti-${language}-`, '')}/${article?.slug}`
        }
    }

    return (
        <div className="mb-6 lg:mb-9">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <Link href={buildArticleUrl()}>
                    <a target='_blank' className="text-gray-4 font-semibold text-base sm:font-medium sm:text-[20px] sm:leading-7 cursor-pointer">
                        {loading ?
                            <div className="!min-w-[200px] lg:!w-[500px] xl:!w-[800px]"><Skeletor className="!w-full" />
                            </div> : getHighlightedText(article?.title, keyword)}
                    </a>
                </Link>
                <div className="font-bold text-[10px] text-txtSecondary dark:text-txtSecondary-dark">
                    {loading ?
                        <div className="hidden md:block md:!w-[100px]"><Skeletor className="!w-full" height={15} />
                        </div> : formatTime(article?.raw_data?.created_at, 'dd-MM-yyyy')}
                </div>
            </div>
            <div
                className="mt-2 text-darkBlue-5 font-normal text-xs sm:text-sm leading-5">
                {loading ?
                    <>
                        <div className="w-full"><Skeletor className="!w-full" height={15} /></div>
                        <div className="w-full"><Skeletor className="!w-full" height={15} /></div>
                        <div className="w-full"><Skeletor className="!w-full" height={15} /></div>
                    </>
                    : getHighlightedText(article?.html?.substring(0, isMobile ? 70 : 240)?.trim() + '...', keyword)}


            </div>
            <div className="mt-2.5 flex items-center text-[10px] lg:text-sm font-medium">
                {loading ?
                    <div className="!min-w-[80px] lg:!w-[120px] xl:!w-[200px]"><Skeletor className="!w-full" height={15} /></div>
                    : <>
                        {getTopics(article?.raw_data?.primary_tag)}
                        {/* {getCategory(article?.raw_data?.primary_tag, article?.raw_data?.tags)} */}
                    </>
                }
            </div>
        </div>
    )
})

export default SearchResultItem

const Highlighted = ({ text = '', highlight = '' }) => {
    if (!highlight.trim()) {
        return <span>{text}</span>
    }
    const regex = new RegExp(`(${_.escapeRegExp(highlight)})`, 'gi')
    const parts = text.split(regex)
    return (
        <span>
            {parts.filter(part => part).map((part, i) => (
                regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
            ))}
        </span>
    )
}