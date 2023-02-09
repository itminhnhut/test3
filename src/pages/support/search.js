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
import NoResult from 'components/screens/Support/NoResult';
import SearchSection from 'components/screens/Support/SearchSection';

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
    const isMobile = width < 640
    // ? helper
    const onQuery = (tab, query) => router.push(
        {
            pathname: PATHS.SUPPORT.SEARCH,
            query: appUrlHandler({ type: tab, query }, isApp)
        })

    // ? render
    const renderTab = useCallback(() => TAB_SERIES.map(item => (
        <div className={classNames(
            'flex items-center truncate border-[1px] px-4 py-2 sm:px-5 sm:py-3 rounded-[800px] text-tiny leading-5 sm:text-base sm:leading-6 cursor-pointer',
            { 'border-teal bg-teal bg-opacity-10 font-medium text-teal': item.key === state.tab },
            { 'border-divider-dark font-normal text-darkBlue-5': item.key !== state.tab })}
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
        return data?.map(search => <SearchResultItem key={search?.id} article={search} keyword={router?.query?.query} />)
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
            <div className='w-full bg-shadow'>
                <SearchSection t={t} width={width} />
                <div className='container mt-7 sm:mt-0 pt-6 max-w-[1440px]'>
                    <div className='pb-[120px] px-6 lg:px-[112px] h-full drop-shadow-onlyLight bg-transparent'>
                        <div className='w-full block sm:flex items-end justify-between text-gray-4'>
                            <div className='font-semibold text-base sm:text-[32px] sm:leading-[38px]'>
                                {t('support-center:search_result')}: {state?.query}
                            </div>
                            <div className='my-2 border-t-[1px] border-divider-dark w-full'></div>
                            <div className='font-normal text-xs text-darkBlue-5 sm:text-base sm:text-gray-4 h-full'>
                                {isMobile ?
                                   `'${state?.totalArticle}'` + ' ' + t('futures:result').toLowerCase()
                                    :
                                    t('support-center:search_result_count', {
                                        key: state?.query,
                                        count: state?.totalArticle
                                    })}
                            </div>
                        </div>
                        {!isMobile ? <div className='mt-5 border-t-[1px] border-divider-dark w-full'></div> : null}
                        <div className='mt-8 sm:mt-10 flex w-full gap-6'>
                            {renderTab()}
                        </div>
                        <div className='w-full mt-8 sm:mt-12' id='search-result'>
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
