import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronRight, Slash } from 'react-feather';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { PATHS } from '../../constants/paths';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import SupportBanner from 'components/screens/Support/SupportBanner';
import classNames from 'classnames';
import Link from 'next/link';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import useApp from 'hooks/useApp';
import SearchResultItem from 'components/screens/Support/SearchResultItem';
import useWindowSize from 'hooks/useWindowSize';
import { BREAK_POINTS } from 'constants/constants';
import { algoliaIndex } from 'utils';
import { useAsync } from 'react-use';
import { useTranslation } from 'next-i18next';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import RePagination from 'components/common/ReTable/RePagination';
import { appUrlHandler } from 'constants/faqHelper';
import { SearchSection } from '.';
import NoResult from '../../components/screens/Support/NoResult';

const PAGE_SIZE = 15

const INITIAL_STATE = {
    tab: 0,
    query: null,
    loading: false,
    searchResult: [],
    currentPage: 1,
    totalArticle: null,
}

const SupportSearchResult = () => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = (_state) => set(prevState => ({ ...prevState, ..._state }))

    const [theme] = useDarkMode()
    const router = useRouter()
    const isApp = useApp()
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize()

    // ? helper
    const onQuery = (tab, query) => router.push(
        {
            pathname: PATHS.SUPPORT.SEARCH,
            query: appUrlHandler({ type: tab, query }, isApp)
        })

    // ? render
    const renderTab = useCallback(() => TAB_SERIES.map(item => (
        <div className={classNames(
            'flex items-center truncate border-[1px] h-12 px-5 rounded-[800px] text-base cursor-pointer',
            { 'border-namiv2-green bg-namiv2-green bg-opacity-10 font-medium text-namiv2-green': item.key === state.tab },
            { 'border-namiv2-gray-3 font-normal text-namiv2-gray-1': item.key !== state.tab })}
            key={item.key}
            onClick={() => onQuery(item.key, state.query)}
        >
            {item.localizedPath ? t(item.localizedPath) : item.title}
        </div>
    )), [state.tab, state.query])

    const renderSearchResult = useCallback(() => {
        if (state.loading) {
            return (
                <>
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                    <SearchResultItem loading={true} />
                </>
            )
        }

        const data = state.searchResult
        return data?.map(search => <SearchResultItem key={search?.id} article={search} keyword={router?.query?.query}/>)
    }, [state.searchResult, state.currentPage, state.loading])

    useEffect(() => {
        if (router?.query && Object.keys(router.query).length && router.query?.query && router.query?.type) {
            setState({
                tab: +router.query?.type,
                query: router.query.query
            })
            if (router.query.query?.length) {
                setState({ searchKey: router.query.query })
            }
        }
    }, [router])

    useAsync(async () => {
        const tagFilters = [language === 'en' ? language : `-en`]
        const tab = {
            2: "faq",
            1: "noti",
        }[state.tab]
        if (tab) {
            tagFilters.push(tab)
        }
        const algoSearch = await algoliaIndex.search(state.query, {
            page: state.currentPage - 1,
            hitsPerPage: 15,
            facetFilters: tagFilters.map(t => `tags.slug:${t}`),
            // ranking: ['desc(post_date_timestamp)']
        })
        setState({ totalArticle: algoSearch?.nbHits, searchResult: algoSearch?.hits })
    }, [state.query, state.currentPage, language, state.tab])

    return (
        <MaldivesLayout>
            <div className='w-full bg-namiv2-black'>
                <SearchSection t={t} width={width} />
                <div className='container pt-6 max-w-[1440px]'>
                    <div className='pb-[120px] px-10 lg:px-[112px] h-full drop-shadow-onlyLight bg-transparent'>
                        <div className='w-full flex items-end justify-between text-namiv2-gray-2'>
                            <div className='font-semibold text-[32px] leading-[38px]'>
                                {t('support-center:search_result')}: {state?.query}
                            </div>
                            <div className='font-normal text-base h-full'>
                                {t('support-center:search_result_count', {
                                    key: state?.query,
                                    count: state?.totalArticle
                                })}
                            </div>
                        </div>
                        <div className='mt-5 border-t-[1px] border-namiv2-gray-3 w-full'></div>
                        <div className='mt-10 flex w-full gap-6'>
                            {renderTab()}
                        </div>
                        <div className='w-full mt-12'>
                            {state?.searchResult?.length ? renderSearchResult() : <NoResult text={t('common:no_results_found')} />}
                        </div>
                    </div>
                </div>
            </div>
        </MaldivesLayout>
    )
}

const TAB_SERIES = [
    {
        key: 0,
        title: 'Tất cả',
        localizedPath: 'common:all'
    },
    {
        key: 1,
        title: 'Thông báo',
        localizedPath: 'support-center:announcement'
    },
    {
        key: 2,
        title: 'Câu hỏi thường gặp',
        localizedPath: 'support-center:faq'
    },
]

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar', 'support-center'])
    }
})

export default SupportSearchResult
