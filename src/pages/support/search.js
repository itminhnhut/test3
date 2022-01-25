import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ChevronRight } from 'react-feather'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { PATHS } from '../../constants/paths'
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import SupportBanner from 'components/screens/Support/SupportBanner'
import classNames from 'classnames'
import Link from 'next/link'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import useApp from 'hooks/useApp'
import SearchResultItem from 'components/screens/Support/SearchResultItem'
import useWindowSize from 'hooks/useWindowSize'
import { BREAK_POINTS } from 'constants/constants'

const INITIAL_STATE = {
    tab: 0,
    query: null
}

const SupportSearchResult = () => {
    const [state, set] = useState(INITIAL_STATE)
    const setState = (_state) => set(prevState => ({ ...prevState, ..._state }))

    const [theme] = useDarkMode()
    const router = useRouter()
    const isApp = useApp()
    const { width } = useWindowSize()

    // ? helper
    const onQuery = (tab, query) => router.push(
        {
            pathname: PATHS.SUPPORT.SEARCH,
            query: {
                type: tab,
                query,
                source: isApp ? 'app' : undefined
            }
        })

    // ? render
    const renderTab = useCallback(() => TAB_SERIES.map(item => (
        <div key={item.key} className="mr-8 cursor-pointer min-h-[33px]"
             onClick={() => onQuery(item.key, state.query)}>
            <div className={classNames(
                'mb-2 truncate text-sm',
                { 'font-bold': item.key === state.tab },
                { 'text-txtSecondary dark:text-txtSecondary-dark font-medium': item.key !== state.tab }
            )}>
                {item.localizedPath ? t(item.localizedPath) : item.title}
            </div>
            {state.tab === item.key && <div className="m-auto w-[32px] h-[4px] bg-dominant"/>}
        </div>
    )), [state.tab, state.query])

    useEffect(() => {
        if (router?.query && Object.keys(router.query).length && router.query?.query && router.query?.type) {
            // console.log('namidev ', router.query)
            setState({
                tab: +router.query?.type,
                query: router.query.query
            })
            if (router.query.query?.length) {
                setState({ searchKey: router.query.query })
            }
        }
    }, [router])

    return (
        <MaldivesLayout>
            <SupportBanner
                href={PATHS.SUPPORT.DEFAULT}
                title={
                <>
                    Chúng tôi có thể <br className="hidden lg:block"/> giúp gì cho bạn?
                </>
            } innerClassNames="container"/>
            <div className="block md:hidden bg-bgPrimary dark:bg-bgPrimary-dark drop-shadow-onlyLight dark:shadow-none">
                <div
                    className="container px-4 py-2 flex items-center text-xs font-medium text-txtSecondary dark:text-txtSecondary-dark">
                    <Link href={PATHS.SUPPORT.DEFAULT}>
                        <a className="hover:!underline">Trung tâm trợ giúp</a>
                    </Link>
                    <ChevronRight strokeWidth={1.5} size={16} className="mx-2"/>
                    <div>Kết quả tìm kiếm</div>
                </div>
            </div>
            <div
                className="container md:mt-4 md:px-5 md:pt-2 md:pb-[100px] md:bg-bgPrimary md:dark:bg-bgPrimary-dark md:rounded-t-[20px]"
                style={theme === THEME_MODE.LIGHT && width >= BREAK_POINTS.md ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' } : undefined}>
                <div className="mt-4 px-4 flex items-center select-none overflow-x-auto no-scrollbar">
                    {renderTab()}
                </div>
                <div style={theme === THEME_MODE.LIGHT ? { boxShadow: '0px -4px 30px rgba(0, 0, 0, 0.08)' } : undefined}
                     className="px-4 py-5 bg-[#FCFCFC] dark:bg-darkBlue-2 rounded-[20px] lg:p-8">
                    <SearchResultItem/>
                    <SearchResultItem/>
                    <SearchResultItem/>
                    <SearchResultItem/>
                    <SearchResultItem/>
                    <SearchResultItem/>
                </div>
            </div>
        </MaldivesLayout>
    )
}

const TAB_SERIES = [
    {
        key: 0,
        title: 'Câu hỏi thường gặp',
        localizedPath: null
    },
    {
        key: 1,
        title: 'Thông báo',
        localizedPath: null
    },
    {
        key: 2,
        title: 'Tất cả',
        localizedPath: null
    }
]

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...await serverSideTranslations(locale, ['common', 'navbar'])
    }
})

export default SupportSearchResult
