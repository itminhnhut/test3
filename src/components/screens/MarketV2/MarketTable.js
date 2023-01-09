import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import MCard from 'src/components/common/MCard';
import colors from 'styles/colors';
import Link from 'next/link';
import AssetLogo from 'src/components/wallet/AssetLogo';
import MarketLabel from 'src/components/common/MarketLabel';
import ReTable, { RETABLE_SORTBY } from 'src/components/common/ReTable';
import RePagination from 'src/components/common/ReTable/RePagination';
import showNotification from 'utils/notificationService';
import Empty from 'src/components/common/Empty';
import NeedLogin from 'src/components/common/NeedLogin';
import Skeletor from 'components/common/Skeletor';

import { useCallback, useEffect, useState } from 'react';
import { formatPrice, getExchange24hPercentageChange, getV1Url, render24hChange } from 'redux/actions/utils';
import { StarOutlined } from '@ant-design/icons';
import { initMarketWatchItem, sparkLineBuilder } from 'src/utils';
import { useTranslation } from 'next-i18next';
import { IconStarFilled } from 'src/components/common/Icons';
import { Search, X } from 'react-feather';
import { useWindowSize } from 'utils/customHooks';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { EMPTY_VALUE } from 'constants/constants';
import { remove } from 'lodash';
import { TRADING_MODE } from 'redux/actions/const';
import { favoriteAction } from 'redux/actions/user';
import { useSelector } from 'react-redux';
import { PATHS } from 'constants/paths';

import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';
import classNames from 'classnames';

const MARKET_ROW_LIMIT = 20

const MarketTable = ({ loading, data, parentState, ...restProps }) => {
    // Init State

    // Rdx
    const auth = useSelector(state => state.auth?.user) || null

    // Use Hooks
    const router = useRouter()
    const { t, i18n: { language } } = useTranslation(['common', 'table'])
    const [currentTheme] = useDarkMode()
    const { width } = useWindowSize()

    const [type, setType] = useState(0)
    const types = [{
        id: 0,
        content: {
            vi: 'Tất cả',
            en: 'All'
        }
    }, {
        id: 'MOST_TRADED',
        content: {
            vi: <div className='flex space-x-2'><HotIcon /><div>Giao dịch nhiều</div></div>,
            en: <div className='flex space-x-2'><HotIcon /><div>Most traded</div></div>
        }
    }, {
        id: 'TOP_GAINER',
        content: {
            vi: 'Tăng giá',
            en: 'Top gainer'
        }
    }, {
        id: 'NEW_LISTING',
        content: {
            vi: 'Mới niêm yết',
            en: 'New Listing'
        }
    }, {
        id: 'TOP_LOSER',
        content: {
            vi: 'Giảm giá',
            en: 'Top loser'
        }
    }]

    const changeType = (index) => {
        setType(index)
        parentState({
            type: index
        })
    }
    // Render Handler
    const renderTab = useCallback(() => {
        return tab.map((item, index) => {
            const label = restProps?.tabLabelCount ? restProps.tabLabelCount?.[item.key] : null

            return (
                <div key={item.key}
                    onClick={() => parentState({ tabIndex: index, subTabIndex: item.key === 'favorite' ? 0 : 1, currentPage: 1 })}
                    className={classNames("relative mr-6 pb-4 capitalize select-none font-normal text-base text-namiv2-gray-1 cursor-pointer flex items-center", { "text-namiv2-gray-2 font-semibold": restProps.tabIndex === index })}>
                    <span className={item.key === 'favorite' ? 'ml-2' : ''}>{item.localized ? t(item.localized) : item.key} {label ? `(${label})` : null}</span>
                    {restProps.tabIndex === index && <div className="absolute left-1/2 bottom-0 w-[40px] h-[1px] bg-dominant -translate-x-1/2" />}
                </div>)
        })
    }, [currentTheme, restProps.tabIndex, restProps.tabLabelCount])

    const renderSubTab = useCallback(() => {
        if (tab[restProps.tabIndex]?.key === 'favorite') {
            return favSubTab.map((item, index) => {
                return (
                    <div key={item.key}
                        onClick={() => parentState({ subTabIndex: index, currentPage: 1 })}
                        className={restProps.subTabIndex === index ?
                            'text-[14px] font-medium px-3 py-1 mr-3 rounded-md bg-bgTabActive dark:bg-bgTabActive-dark text-white cursor-pointer select-none'
                            : 'text-[14px] font-medium px-3 py-1 mr-3 rounded-md bg-bgTabInactive dark:bg-bgTabInactive-dark text-gray-1 dark:text-darkBlue-5 cursor-pointer select-none'}>
                        {item.localized ? t(item.localized) : <span className="capitalize">{item.key}</span>}
                    </div>
                )
            })
        }

        return subTab.map((item, index) => {
            return (
                <div key={item.key}
                    onClick={() => parentState({ subTabIndex: index, currentPage: 1 })}
                    className={restProps.subTabIndex === index ?
                        'text-base font-semibold px-4 py-3 bg-namiv2-gray text-namiv2-gray-2 cursor-pointer select-none'
                        : 'text-base font-semibold px-4 py-3 bg-namiv2-black text-namiv2-gray-1 cursor-pointer select-none'}>
                    {item.localized ? t(item.localized) : <span className="uppercase">{item.key}</span>}
                </div>
            )
        })
    }, [restProps.subTabIndex, restProps.tabIndex])

    const renderTable = useCallback(() => {
        let modifyColumns = []
        const translater = (key) => {
            switch (key) {
                case 'pair':
                    return language === 'vi' ? 'Cặp' : 'Pair'
                case 'last_price':
                    return language === 'vi' ? 'Giá gần nhất' : 'Last Price'
                case 'change_24h':
                    return language === 'vi' ? 'Thay đổi 24h' : 'Change 24h'
                case 'market_cap':
                    return language === 'vi' ? 'Market Cap' : 'Market Cap'
                case 'volume_24h':
                    return language === 'vi' ? 'Khối lượng 24h' : 'Volume 24h'
                case '24h_high':
                    return language === 'vi' ? 'Cao nhất 24h' : '24h High'
                case '24h_low':
                    return language === 'vi' ? 'Thấp nhất 24h' : '24h Low'
                case 'mini_chart':
                    return language === 'vi' ? 'Biểu đồ' : 'Chart'
                default:
                    return null
            }
        }


        let pairColumnsWidth = 100
        let starColumnWidth = 45

        if (width >= 768) {
            pairColumnsWidth = 138
            starColumnWidth = 65
        }

        if (width >= 1024) {
            pairColumnsWidth = 158
            starColumnWidth = 80
        }

        const starColumn = { key: 'star', dataIndex: 'star', title: '', fixed: 'left', align: 'left', width: starColumnWidth }

        const columns = [
            { key: 'pair', dataIndex: 'pair', title: 'Coin', fixed: 'left', align: 'left', width: pairColumnsWidth },
            { key: 'last_price', dataIndex: 'last_price', title: 'Last Price', align: 'right', width: 168 },
            { key: 'change_24h', dataIndex: 'change_24h', title: 'Change 24h', align: 'right', width: 128 },
            // { key: 'market_cap', dataIndex: 'market_cap', title: 'Market Cap', align: 'right', width: 168 },
            // { key: 'mini_chart', dataIndex: 'mini_chart', title: 'Mini Chart', align: 'right', width: 168 },
            { key: 'volume_24h', dataIndex: 'volume_24h', title: 'Volume 24h', align: 'right', width: 168 },
            { key: '24h_high', dataIndex: '24h_high', title: '24h High', align: 'right', width: 128 },
            { key: '24h_low', dataIndex: '24h_low', title: '24h Low', align: 'right', width: 128 },
            { key: 'operation', dataIndex: 'operation', title: '', align: 'center', width: 170 }
        ]

        // Translate
        columns.forEach(c => {
            let item = c
            if (c.key !== 'star' && c.key !== 'operation') {
                item = { ...c, title: translater(c.key) }
            }
            modifyColumns.push(item)
        })

        // Hide star button if user not found
        if (auth) {
            modifyColumns.unshift(starColumn)
        } else {
            modifyColumns = modifyColumns.filter(col => col?.key !== 'star')
        }

        //
        let tradingMode = TRADING_MODE.EXCHANGE

        if (tab[restProps.tabIndex]?.key === 'favorite') {
            if (favSubTab[restProps.subTabIndex]?.key === 'futures') {
                tradingMode = TRADING_MODE.FUTURES
            } else {
                tradingMode = TRADING_MODE.EXCHANGE
            }
        }

        // only show market cap col for exchange tab
        if (tab[restProps.tabIndex]?.key === 'futures'
            || (tab[restProps.tabIndex]?.key === 'favorite' && favSubTab[restProps.subTabIndex]?.key === 'futures')) {
            remove(modifyColumns, o => o.key === 'market_cap')
            tradingMode = TRADING_MODE.FUTURES
        }


        // PRE PROCESS DATA FOR TABLE
        let rowKey = `${tab[restProps.tabIndex]?.key}_${tradingMode}__`
        let tableStatus
        const dataSource = dataHandler(data, language, width, tradingMode, restProps.favoriteList, restProps.favoriteRefresher, loading, auth)

        if (!restProps.auth && tab[restProps.tabIndex]?.key === 'favorite') {
            tableStatus = <NeedLogin />
        } else {
            if (loading) {
                // tableStatus = <ScaleLoader color={colors.teal} size={12}/>
            } else if (!dataSource.length) {
                tableStatus = <Empty />
            }
        }

        return (
            <ReTable sort
                defaultSort={{ key: 'pair', direction: 'asc' }}
                useRowHover
                data={dataSource}
                columns={modifyColumns}
                rowKey={item => `${rowKey}___${item?.key}`}
                loading={loading}
                scroll={{ x: true }}
                tableStatus={tableStatus}
                // onRow={(record) => ({
                //     onClick: () => router.push(PATHS.EXCHANGE.TRADE.getPair(
                //         record?.sortByValue?.tradingMode,
                //         {
                //             baseAsset: record?.sortByValue?.baseAsset,
                //             quoteAsset: record?.sortByValue?.quoteAsset
                //         }))
                // })}
                tableStyle={{
                    paddingHorizontal: '32px',
                    tableStyle: { minWidth: '888px !important' },
                    headerStyle: {},
                    rowStyle: {},
                    shadowWithFixedCol: width < 1366,
                    noDataStyle: {
                        minHeight: '480px'
                    },
                    backgroundColor: '#0c0e14 !important'
                }}
                paginationProps={{
                    hide: true,
                    current: restProps.currentPage,
                    pageSize: MARKET_ROW_LIMIT,
                    onChange: (currentPage) => parentState({ currentPage })
                }}
                isNamiV2
            />
        )
    }, [
        data,
        width,
        language,
        auth,
        loading,
        restProps.favoriteRefresher,
        restProps.favoriteList,
        restProps.tabIndex,
        restProps.subTabIndex,
        restProps.currentPage,
        restProps.auth
    ])

    const renderPagination = useCallback(() => {
        let tradingMode = TRADING_MODE.EXCHANGE

        if (tab[restProps.tabIndex]?.key === 'favorite') {
            if (favSubTab[restProps.subTabIndex]?.key === 'futures') {
                tradingMode = TRADING_MODE.FUTURES
            } else {
                tradingMode = TRADING_MODE.EXCHANGE
            }
        }

        const total = dataHandler(data, language, width, tradingMode)?.length

        if (total <= MARKET_ROW_LIMIT) return null

        return (
            <div className="my-4 flex items-center justify-center">
                <RePagination total={total}
                    isNamiV2
                    current={restProps.currentPage}
                    pageSize={MARKET_ROW_LIMIT}
                    onChange={(currentPage) => parentState({ currentPage })}
                    name="market_table___list"
                />
            </div>
        )
    }, [data, language, restProps.currentPage, restProps.tabIndex, restProps.subTabIndex])

    useEffect(() => {
        if (restProps.favoriteList?.exchange?.length && restProps.favoriteList?.futures?.length) {
            parentState({ tabIndex: 0, subTabIndex: 0 })
        }

        if (restProps.favoriteList?.exchange?.length && !restProps.favoriteList?.futures?.length) {
            parentState({ tabIndex: 0, subTabIndex: 0 })
        }

        if (restProps.favoriteList?.futures?.length && !restProps.favoriteList?.exchange?.length) {
            parentState({ tabIndex: 0, subTabIndex: 1 })
        }

    }, [restProps.favoriteList])

    return (
        <div className='px-4 lg:px-0 text-namiv2-gray-1'>
            <div className="flex flex-col justify-start md:justify-between md:flex-row md:items-center mb-8">
                <div className="text-2xl text-namiv2-gray-2 lg:text-[32px] lg:leading-[38px] font-bold mb-4 md:mb-0">
                    {t('common:market')}
                </div>
                <div className='flex items-center space-x-4'>
                    <div className="flex items-center border-namiv2-gray-3 border-[1px] overflow-hidden rounded-md">
                        {renderSubTab()}
                    </div>
                    <div className="h-12 lg:w-[368px] flex items-center py-2 px-3 rounded-[6px] bg-namiv2-gray cursor-pointer justify-between">
                        <div className='flex items-center'>
                            <Search color={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5} size={16} />
                            <input className="bg-transparent outline-none px-2"
                                value={restProps.search}
                                onChange={({ target: { value } }) => parentState({ search: value })} />
                        </div>
                        <X className={restProps.search ? 'visible' : 'invisible'}
                            onClick={() => parentState({ search: '' })}
                            color={currentTheme === THEME_MODE.LIGHT ? colors.grey1 : colors.darkBlue5}
                            size={20} />
                    </div>
                </div>
            </div>
            <div className="bg-namiv2-black">
                <div id="market_table___list"
                    className="py-4 h-full rounded-xl border-[1px] border-namiv2-gray-3">
                    <div className="mt-[20px] flex items-center overflow-auto px-8 border-b-[1px] border-namiv2-gray-3">
                        {renderTab()}
                    </div>
                    <div className='h-24 border-b-[1px] border-namiv2-gray-3 flex items-center px-8'>
                        <TokenTypes type={type} setType={changeType} types={types} lang={language} />
                    </div>
                    <div className="">
                        {renderTable()}
                    </div>
                    <div className='px-8'>
                        {renderPagination()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const tab = [
    { key: 'favorite', localized: null },
    { key: 'exchange', localized: null },
    { key: 'futures', localized: null },
    // { key: 'zones', localized: null }
]

export const subTab = [
    { key: 'all', localized: 'common:all' },
    { key: 'usdt', localized: null },
    { key: 'vndc', localized: null }
]

export const favSubTab = [
    { key: 'exchange', localized: null },
    { key: 'futures', localized: null }
]

const dataHandler = (arr, lang, screenWidth, mode, favoriteList = {}, favoriteRefresher, isLoading = false, isAuth) => {
    if (isLoading) {
        const loadingSkeleton = []

        for (let i = 0; i < 20; ++i) {
            loadingSkeleton.push({ ...ROW_LOADING_SKELETON, key: `market_loading__skeleton_${i}` })
        }
        return loadingSkeleton
    }

    if (!Array.isArray(arr) || !arr || !arr.length) return []

    const result = []


    arr.forEach(item => {
        const {
            baseAsset, baseAssetId, quoteAsset, quoteAssetId,
            lastPrice, volume24h, high, low, supply, label
        } = initMarketWatchItem(item)

        const change24h = getExchange24hPercentageChange(item)
        const sparkLine = sparkLineBuilder(`${baseAsset}${quoteAsset}`, change24h >= 0 ? colors.teal : colors.red2)

        if (baseAsset && quoteAsset) {
            result.push({
                key: `market_row___${baseAsset}_${quoteAsset}`,
                star: isAuth ? <FavActionButton b={{ b: baseAsset, i: baseAssetId }}
                    q={{ q: quoteAsset, i: quoteAssetId }}
                    list={favoriteList}
                    lang={lang}
                    mode={mode} favoriteRefresher={favoriteRefresher}
                /> : null,
                pair: renderPair(baseAsset, quoteAsset, label, screenWidth),
                last_price: <span className="whitespace-nowrap">{formatPrice(lastPrice)}</span>,
                change_24h: render24hChange(item, true),
                market_cap: renderMarketCap(lastPrice, supply),
                mini_chart: <div className="w-full flex justify-center items-center">
                    <img src={sparkLine} alt="--" className="w-[85px]" />
                </div>,
                volume_24h: <span className="whitespace-nowrap">{formatPrice(volume24h)}</span>,
                '24h_high': <span className="whitespace-nowrap">{formatPrice(high)}</span>,
                '24h_low': <span className="whitespace-nowrap">{formatPrice(low)}</span>,
                operation: renderTradeLink(baseAsset, quoteAsset, lang, mode),
                [RETABLE_SORTBY]: {
                    pair: `${baseAsset}`, last_price: lastPrice,
                    change_24h: getExchange24hPercentageChange(item), market_cap: +lastPrice * +supply,
                    volume_24h: volume24h, '24h_high': high, '24h_low': low,
                    baseAsset, quoteAsset, tradingMode: mode
                }
            })
        }
    })

    return result
}

const ROW_LOADING_SKELETON = {
    star: <Skeletor width={65} />,
    pair: <Skeletor width={65} />,
    last_price: <Skeletor width={65} />,
    change_24h: <Skeletor width={65} />,
    market_cap: <Skeletor width={65} />,
    volume_24h: <Skeletor width={65} />,
    '24h_high': <Skeletor width={65} />,
    '24h_low': <Skeletor width={65} />,
    operation: <Skeletor width={65} />
}

const renderPair = (b, q, lbl, w) => {
    return (
        <div className="flex items-center font-semibold text-base">
            {w >= 768 && <AssetLogo assetCode={b} size={w >= 1024 ? 32 : 28} />}
            <div className={w >= 768 ? 'ml-3 whitespace-nowrap' : 'whitespace-nowrap'}>
                <span className="text-namiv2-gray-1">{b}</span>
                <span className="text-namiv2-gray-2">/{q}</span>
            </div>
            <MarketLabel labelType={lbl} />
        </div>
    )
}

const renderMarketCap = (price, supply) => {
    if (price && supply) {
        return <span className="whitespace-nowrap">{formatPrice(+price * +supply)}</span>
    }
    return EMPTY_VALUE
}

const FavActionButton = ({ b, q, mode, lang, list, favoriteRefresher }) => {
    const [loading, setLoading] = useState(false)
    const [already, setAlready] = useState(false)

    const pairKey = mode === TRADING_MODE.FUTURES ? `${b?.b}_${q?.q}` : `${b?.i}_${q?.i}`

    // Helper
    const callback = async (method, list) => {
        setLoading(true)
        let message = ''
        let title = ''

        try {
            await favoriteAction(method, mode, pairKey)
        } catch (e) {
            console.log(`Can't execute this action `, e)

            if (lang === LANGUAGE_TAG.VI) title = 'Thất bại'
            if (lang === LANGUAGE_TAG.EN) title = 'Failure'
            showNotification(
                { message: `FAV_ACTION_UNKNOWN_ERR`, title, type: 'failure' },
                2500,
                'top',
                'top-right',
            )
        } finally {
            setLoading(false)

            await favoriteRefresher()
            if (lang === LANGUAGE_TAG.VI) {
                title = 'Thành công'
                message = `Đã ${method === 'delete' ? `xoá ${b?.b}/${q?.q} khỏi` : `thêm ${b?.b}/${q?.q} vào`} danh sách yêu thích`
            }
            if (lang === LANGUAGE_TAG.EN) {
                title = 'Success'
                message = `${method === 'delete' ? `Deleted ${b?.b}/${q?.q} from` : `Added ${b?.b}/${q?.q} to`} favorites`
            }
            showNotification(
                { message, title, type: 'success' },
                2500,
                'top',
                'top-right'
            )
        }
    }

    useEffect(() => {
        if (list) {
            if (mode === TRADING_MODE.EXCHANGE && list?.exchange) {
                list.exchange.includes(pairKey) ? setAlready(true) : setAlready(false)
            }

            if (mode === TRADING_MODE.FUTURES && list?.futures) {
                list.futures.includes(pairKey) ? setAlready(true) : setAlready(false)
            }
        }
    }, [list, pairKey])

    return (
        <div className="pr-2 py-2 flex items-center"
            onClick={() => {
                !loading && callback(already ? 'delete' : 'put', list)
            }}>
            {already ? <IconStarFilled color="#FFC632" />
                : <IconStarFilled color="#8694B3" />}
        </div>
    )
}

const renderTradeLink = (b, q, lang, mode) => {
    let url
    let swapurl
    if (mode === TRADING_MODE.FUTURES) {
        url = getV1Url(`/futures/${b}${q}`)
    } else {
        url = `/trade/${b}-${q}`
        // swapurl = `/swap/${b}-${q}`
        swapurl = `/swap`
    }

    return (
        <div className='flex justify-end items-center font-medium text-base'>
            <Link href={url} prefetch={false} className=''>
                <a className="text-namiv2-green re_table__link px-3 flex items-center justify-center" target="_blank">
                    {lang === LANGUAGE_TAG.VI ? 'Giao dịch' : 'Trade'}
                </a>
            </Link>
            {swapurl ? <Link href={swapurl} prefetch={false} className=''>
                <a className="text-namiv2-green re_table__link px-3 flex items-center justify-center border-l-[1px] border-namiv2-gray-3" target="_blank">
                    {lang === LANGUAGE_TAG.VI ? 'Quy đổi' : 'Swap'}
                </a>
            </Link> : null}
        </div>
    )
}

const TokenTypes = ({ type, setType, types, lang }) => {
    return <div className='flex space-x-3 h-12 font-normal'>
        {types.map(e =>
            <div key={e.id} className={classNames('h-full px-4 py-3 rounded-[800px] border-[1px] border-namiv2-gray-3 cursor-pointer', {
                'border-namiv2-green bg-namiv2-green bg-opacity-10 text-namiv2-green font-semibold': e.id === type
            })}
                onClick={() => setType(e.id)}
            >
                {e?.content[lang]}
            </div>
        )}
    </div>
}

export default MarketTable

const HotIcon = () => <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.813 2.896a.295.295 0 0 0-.493.167c-.092.547-.284 1.435-.647 2.251 0 0-.718-3.946-5.496-5.302a.295.295 0 0 0-.373.326c.173 1.173.486 4.481-.851 7.65-.696-1.414-1.808-1.966-2.515-2.18a.295.295 0 0 0-.362.391c.619 1.542-.771 3.468-.771 6.095a7.706 7.706 0 1 0 15.412 0c0-5.23-2.82-8.38-3.904-9.398z" fill="#FFC632" />
    <path d="M15.263 13.583c-.034-2.518-1.03-4.26-1.57-5.022a.318.318 0 0 0-.544.043c-.165.33-.431.747-.793.964 0 0-1.534-1.236-1.605-3.088a.317.317 0 0 0-.42-.286c-.812.276-2.535 1.204-2.952 4.16-.342-.617-1.154-.797-1.676-.847a.317.317 0 0 0-.339.391c.398 1.553-.604 2.48-.604 3.815a5.252 5.252 0 0 0 5.237 5.252c2.937.009 5.305-2.445 5.266-5.382z" fill="#CC1F1F" />
</svg>
