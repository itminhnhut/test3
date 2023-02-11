import useDarkMode from 'hooks/useDarkMode';
import colors from 'styles/colors';
import Link from 'next/link';
import AssetLogo from 'components/wallet/AssetLogo';
import MarketLabel from 'components/common/MarketLabel';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import showNotification from 'utils/notificationService';
import Skeletor from 'components/common/Skeletor';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatCurrency, formatPrice, getExchange24hPercentageChange, getV1Url, render24hChange } from 'redux/actions/utils';
import { initMarketWatchItem, sparkLineBuilder } from 'utils';
import { useTranslation } from 'next-i18next';
import { IconStarFilled } from 'components/common/Icons';
import { Search, X } from 'react-feather';
import { useWindowSize } from 'utils/customHooks';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { EMPTY_VALUE } from 'constants/constants';
import _, { remove } from 'lodash';
import { TRADING_MODE } from 'redux/actions/const';
import { favoriteAction } from 'redux/actions/user';
import { useSelector } from 'react-redux';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import React from 'react';
import { ScaleLoader } from 'react-spinners';
import NoData from 'components/common/V2/TableV2/NoData';
import InputV2 from 'components/common/V2/InputV2';
import axios from 'axios';
import { API_GET_FAVORITE } from 'redux/actions/apis';

const MARKET_ROW_LIMIT = 20

const MarketTable = ({ loading, data, parentState, ...restProps }) => {
    // Init State

    // Rdx
    const auth = useSelector((state) => state.auth?.user) || null;

    // Use Hooks
    const router = useRouter();
    const {
        t,
        i18n: { language }
    } = useTranslation(['common', 'table']);
    const [currentTheme] = useDarkMode();
    const { width } = useWindowSize();

    const [type, setType] = useState(0);
    const types = [
        {
            id: 0,
            content: {
                vi: 'Tất cả',
                en: 'All'
            }
        },
        {
            id: 'MOST_TRADED',
            content: {
                vi: (
                    <div className="flex space-x-2">
                        <HotIcon />
                        <div>Giao dịch nhiều</div>
                    </div>
                ),
                en: (
                    <div className="flex space-x-2">
                        <HotIcon />
                        <div>Most traded</div>
                    </div>
                )
            }
        },
        {
            id: 'TOP_GAINER',
            content: {
                vi: 'Tăng giá',
                en: 'Top gainer'
            }
        },
        {
            id: 'NEW_LISTING',
            content: {
                vi: 'Mới niêm yết',
                en: 'New Listing'
            }
        },
        {
            id: 'TOP_LOSER',
            content: {
                vi: 'Giảm giá',
                en: 'Top loser'
            }
        }
    ]

    useEffect(() => {
        setType(restProps.type);
    }, [restProps.type]);

    // Render Handler
    const renderTab = useCallback(() => {
        return tab.map((item, index) => {
            const label = restProps?.tabLabelCount ? restProps.tabLabelCount?.[item.key] : null;

            return (
                <div
                    key={item.key}
                    onClick={() =>
                        parentState({ tabIndex: index, subTabIndex: item.key === 'favorite' ? 0 : 1, currentPage: 1, type: item.key === 'favorite' ? 1 : 0 })
                    }
                    className={classNames(
                        'relative mr-6 pb-4 capitalize select-none font-normal text-base text-darkBlue-5 cursor-pointer flex items-center',
                        { '!text-gray-4 !font-semibold': restProps.tabIndex === index }
                    )}
                >
                    <span className={item.key === 'favorite' ? 'ml-2' : ''}>
                        {item.localized ? t(item.localized) : item.key} {label ? `(${label})` : null}
                    </span>
                    {restProps.tabIndex === index && <div className="absolute left-1/2 bottom-0 w-[40px] h-[1px] bg-dominant -translate-x-1/2" />}
                </div>)
        })
    }, [currentTheme, restProps.tabIndex, restProps.tabLabelCount])

    const renderSubTab = useCallback(() => {
        return subTab.map((item, index) => {
            return (
                <div key={item.key}
                    onClick={() => parentState({ subTabIndex: index, currentPage: 1 })}
                    className={
                        restProps.subTabIndex === index
                            ? 'text-base font-semibold px-4 py-3 bg-dark-2 text-gray-4 cursor-pointer select-none'
                            : 'text-base font-semibold px-4 py-3 bg-shadow text-darkBlue-5 cursor-pointer select-none'
                    }
                >
                    {item.localized ? t(item.localized) : <span className="uppercase">{item.key}</span>}
                </div>
            )
        })
    }, [restProps.subTabIndex, restProps.tabIndex])

    const renderSuggested = useMemo(() => {
        const tradingMode = restProps?.favType + 1

        return <div className='px-8 pb-4'>
            <div className='text-base text-darkBlue-5 font-normal mb-6'>
                Bạn chưa thêm cặp tiền điện tử nào. Bắt đầu thêm ngay các cặp giao dịch phổ biến dưới đây vào Yêu thích.
            </div>
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-6'>
                {restProps?.suggestedSymbols?.map(symbol => {
                    const symbolLeverageConfig = tradingMode === TRADING_MODE.FUTURES ? restProps?.futuresConfigs?.find(e => e?.pair == symbol?.s)?.leverageConfig : null
                    const leverage = symbolLeverageConfig ? (symbolLeverageConfig?.max ?? 0) : null
                    return (
                        <div className='w-full p-3 text-darkBlue-5 bg-darkBlue-3 rounded-md' key={symbol.s}>
                            <div className='flex justify-between w-full'>
                                <div className=''>
                                    <div className='flex space-x-3 items-center'>
                                        <div className='font-medium text-base'>
                                            <span className="text-gray-4">{symbol?.b}</span>/{symbol?.q}
                                        </div>
                                        {leverage ? <div className='px-1 py-[2px] bg-dark-2 rounded-[3px] font-semibold text-xs leading-4'>
                                            {leverage}x
                                        </div> : null}
                                    </div>
                                    <div className={classNames('font-normal text-sm justify-start', {
                                        'text-red': !symbol.u,
                                        'text-teal': symbol.u
                                    })}>
                                        {formatPrice(symbol.p)}
                                    </div>
                                </div>
                                <div className='cursor-pointer'>
                                    <FavActionButton b={{ b: symbol.b, i: symbol.bi }}
                                        q={{ q: symbol.q, i: symbol.qi }}
                                        list={restProps.favoriteList}
                                        lang={language}
                                        mode={tradingMode} favoriteRefresher={restProps.favoriteRefresher}
                                    />
                                </div>
                            </div>
                            <div className='mt-4 flex font-normal text-xs gap-2'>
                                <div className='w-full'>
                                    <div className='w-fit font-medium text-base'>
                                        {render24hChange(symbol, true)}
                                    </div>
                                    <div className='mt-2 leading-4'>
                                        {t('futures:24h_high')}: {formatPrice(symbol.h)}
                                    </div>
                                    <div className='leading-4'>
                                        {t('futures:24h_low')}: {formatPrice(symbol.l)}
                                    </div>
                                </div>
                                <div className='h-full lg:w-1/2 w-full flex justify-end'>
                                    <img src={sparkLineBuilder(symbol?.s, symbol.u ? colors.teal : colors.red.DEFAULT)}
                                        alt="Nami Exchange" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    }, [restProps?.suggestedSymbols, restProps?.favType, restProps?.futuresConfigs])


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


        let pairColumnsWidth = 220
        let starColumnWidth = 64

        if (width < 768) pairColumnsWidth = 174

        if (!data?.length) pairColumnsWidth = 128

        const starColumn = { key: 'star', dataIndex: 'star', title: '', fixed: 'left', align: 'left', width: starColumnWidth }

        const columns = [
            { key: 'pair', dataIndex: 'pair', title: 'Coin', fixed: 'left', align: 'left', width: pairColumnsWidth },
            { key: 'last_price', dataIndex: 'last_price', title: 'Last Price', align: 'right', width: 168 },
            { key: 'change_24h', dataIndex: 'change_24h', title: 'Change 24h', align: 'right', width: 128 },
            // { key: 'market_cap', dataIndex: 'market_cap', title: 'Market Cap', align: 'right', width: 168 },
            // { key: 'mini_chart', dataIndex: 'mini_chart', title: 'Mini Chart', align: 'right', width: 168 },
            { key: 'volume_24h', dataIndex: 'volume_24h', title: 'Volume 24h', align: 'right', width: 138 },
            { key: '24h_high', dataIndex: '24h_high', title: '24h High', align: 'right', width: 128 },
            { key: '24h_low', dataIndex: '24h_low', title: '24h Low', align: 'right', width: 132 },
            { key: 'operation', dataIndex: 'operation', title: '', align: 'center', width: 180 }
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
            if (favSubTab[restProps.favType]?.key === 'futures') {
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
        const dataSource = dataHandler(data, language, width, tradingMode, restProps.favoriteList, restProps.favoriteRefresher, loading, auth, restProps?.futuresConfigs)

        if (tab[restProps.tabIndex]?.key === 'favorite') {
            if (!restProps.auth) {
                tableStatus = <NoData />
            } else {
                if (!dataSource.length) {
                    return renderSuggested
                }
            }
        } else {
            if (loading) {
                tableStatus = <ScaleLoader color={colors.teal} size={12} />
            } else if (!dataSource.length) {
                tableStatus = <NoData isSearch />;
            }
        }

        return (
            <ReTable
                // @ts-ignore
                sort
                defaultSort={{ key: 'pair', direction: 'asc' }}
                useRowHover
                data={dataSource}
                columns={modifyColumns}
                rowKey={item => `${rowKey}___${item?.key}`}
                loading={loading}
                scroll={{ x: true }}
                tableStatus={tableStatus}
                noBorder
                // onRow={(record) => ({
                //     onClick: () => router.push(PATHS.EXCHANGE.TRADE.getPair(
                //         record?.sortByValue?.tradingMode,
                //         {
                //             baseAsset: record?.sortByValue?.baseAsset,
                //             quoteAsset: record?.sortByValue?.quoteAsset
                //         }))
                // })}
                tableStyle={{
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


        );
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
                    name="market_table___list" fromZero={undefined} />
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
        <div className="px-4 lg:px-0 text-darkBlue-5">
            <div className="flex flex-col justify-start md:justify-between md:flex-row md:items-center mb-8">
                <div className="text-2xl text-gray-4 lg:text-[32px] lg:leading-[38px] font-bold mb-4 md:mb-0">
                    {t('common:market')}
                </div>
                <div className='flex items-center space-x-4'>
                    <div className="flex items-center border-divider-dark border-[1px] overflow-hidden rounded-md">
                        {renderSubTab()}
                    </div>
                    <InputV2
                        value={restProps.search}
                        onChange={(value) => parentState({ search: value })}
                        placeholder={t('common:search')}
                        prefix={(<Search color={colors.darkBlue5} size={16} />)}
                        className='pb-0 w-[100px] sm:w-[368px]'
                        suffix={(<X color={colors.gray10} size={16} />)}
                    />
                </div>
            </div>
            <div className="bg-shadow">
                <div id="market_table___list"
                    className="py-4 h-full rounded-xl border-[1px] border-divider-dark">
                    <div className="mt-[20px] flex items-center overflow-auto px-8 border-b-[1px] border-divider-dark">
                        {renderTab()}
                    </div>
                    <div className={classNames('my-4 sm:my-0 h-24 border-divider-dark flex items-center px-8 justify-between flex-wrap space-y-3', { 'border-b-[1px]': tab[restProps.tabIndex]?.key !== 'favorite' })}>
                        {tab[restProps.tabIndex]?.key === 'favorite' ?
                            <TokenTypes type={restProps.favType} setType={(index) => { parentState({ favType: index }) }} types={[{ id: 0, content: { vi: 'Exchange', en: 'Exchange' } }, { id: 1, content: { vi: 'Futures', en: 'Futures' } }]} lang={language} />
                            :
                            <TokenTypes type={type} setType={(index) => {
                                parentState({
                                    type: index
                                })
                            }} types={types} lang={language} />}

                        {tab[restProps.tabIndex]?.key === 'favorite' && !data?.length ?
                            <div className='h-10 px-4 sm:h-12 sm:px-6 flex justify-center items-center bg-teal rounded-md text-white text-base font-medium cursor-pointer'
                                onClick={() => addTokensToFav({
                                    symbols: restProps?.suggestedSymbols?.map(e => e.b + '_' + e.q),
                                    lang: language,
                                    mode: restProps?.favType + 1,
                                    favoriteRefresher: restProps.favoriteRefresher
                                })}
                            >
                                {{ en: 'Add all', vi: 'Thêm tất cả' }[language]}
                            </div>
                            :
                            null}

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
    // { key: 'all', localized: 'common:all' },
    { key: 'usdt', localized: null },
    { key: 'vndc', localized: null }
]

export const favSubTab = [
    { key: 'exchange', localized: null },
    { key: 'futures', localized: null }
]

const dataHandler = (arr, lang, screenWidth, mode, favoriteList = {}, favoriteRefresher, isLoading = false, isAuth, futuresConfigs) => {
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
                pair: renderPair(baseAsset, quoteAsset, label, screenWidth, mode === 1 ? TRADING_MODE.EXCHANGE : TRADING_MODE.FUTURES, lang, futuresConfigs),
                last_price: <span className="whitespace-nowrap">{formatPrice(lastPrice)}</span>,
                change_24h: render24hChange(item, false, 'justify-end'),
                market_cap: renderMarketCap(lastPrice, supply),
                mini_chart: (
                    <div className="w-full flex justify-center items-center">
                        <img src={sparkLine} alt="--" className="w-[85px]" />
                    </div>
                ),
                volume_24h: <span className="whitespace-nowrap">{formatCurrency(volume24h, 0)}</span>,
                '24h_high': <span className="whitespace-nowrap">{formatPrice(high, high < 1000 ? 2 : 0)}</span>,
                '24h_low': <span className="whitespace-nowrap">{formatPrice(low, high < 1000 ? 2 : 0)}</span>,
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

const renderPair = (b, q, lbl, w, mode, lang = 'vi', futuresConfigs) => {
    let url = lang === 'vi' ? '/vi' : ''
    let hasLeverage = false
    switch (mode) {
        case TRADING_MODE.FUTURES:
            url = url + '/futures/' + b + q
            hasLeverage = true
            break
        case TRADING_MODE.EXCHANGE:
            url = '/trade/' + b + '-' + q
            break
        default:
            break
    }

    const symbolLeverageConfig = hasLeverage ? futuresConfigs?.find(e => e?.pair == (b + q))?.leverageConfig : null
    const leverage = hasLeverage ? (symbolLeverageConfig?.max ?? 0) : null

    return (
        <a href={url} target='_blank' className='hover:underline'>
            <div className="flex items-center font-semibold text-base">
                {w >= 768 && <AssetLogo assetCode={b} size={w >= 1024 ? 32 : 28} />}
                <div className={w >= 768 ? 'ml-3 whitespace-nowrap' : 'whitespace-nowrap' + ' truncate'}>
                    <span className="text-gray-4">{b}</span>
                    <span className="text-darkBlue-5">/{q}</span>
                </div>
                {leverage ? <div className='px-1 py-[2px] bg-dark-2 rounded-[3px] font-semibold text-xs leading-4 ml-2'>
                    {leverage}x
                </div> : <MarketLabel labelType={lbl} />}
            </div>
        </a>
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
    const callback = _.debounce(async (method, list) => {
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
    }, 300)

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
        <div className="flex items-center"
            onClick={() => {
                !loading && callback(already ? 'delete' : 'put', list)
            }}>
            {already ? <IconStarFilled size={24} color="#FFC632" />
                : <IconStarFilled size={24} color="#8694B3" />}
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
            <Link href={url} prefetch={false}>
                <a className="text-teal re_table__link px-3 flex items-center justify-center" target="_blank">
                    {lang === LANGUAGE_TAG.VI ? 'Giao dịch' : 'Trade'}
                </a>
            </Link>
            {swapurl ? <Link href={swapurl} prefetch={false}>
                <a className="text-teal re_table__link px-3 flex items-center justify-center border-l-[1px] border-divider-dark" target="_blank">
                    {lang === LANGUAGE_TAG.VI ? 'Quy đổi' : 'Swap'}
                </a>
            </Link> : null}
        </div>
    )
}

const TokenTypes = ({ type, setType, types, lang }) => {
    return <div className='flex space-x-3 h-12 font-normal text-sm overflow-auto no-scrollbar'>
        {types.map(e =>
            <div key={e.id} className={classNames('h-full px-4 py-3 text-base rounded-[800px] border-[1px] border-divider-dark cursor-pointer whitespace-nowrap', {
                'border-teal bg-teal bg-opacity-10 text-teal font-semibold': e.id === type
            })}
                onClick={() => setType(e.id)}
            >
                {e?.content[lang]}
            </div>
        )}
    </div>
}

export default MarketTable

export const HotIcon = ({ size = "20" }) => <svg width={size} height={size} viewBox={`0 0 20 20`} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.813 2.896a.295.295 0 0 0-.493.167c-.092.547-.284 1.435-.647 2.251 0 0-.718-3.946-5.496-5.302a.295.295 0 0 0-.373.326c.173 1.173.486 4.481-.851 7.65-.696-1.414-1.808-1.966-2.515-2.18a.295.295 0 0 0-.362.391c.619 1.542-.771 3.468-.771 6.095a7.706 7.706 0 1 0 15.412 0c0-5.23-2.82-8.38-3.904-9.398z" fill="#FFC632" />
    <path d="M15.263 13.583c-.034-2.518-1.03-4.26-1.57-5.022a.318.318 0 0 0-.544.043c-.165.33-.431.747-.793.964 0 0-1.534-1.236-1.605-3.088a.317.317 0 0 0-.42-.286c-.812.276-2.535 1.204-2.952 4.16-.342-.617-1.154-.797-1.676-.847a.317.317 0 0 0-.339.391c.398 1.553-.604 2.48-.604 3.815a5.252 5.252 0 0 0 5.237 5.252c2.937.009 5.305-2.445 5.266-5.382z" fill="#CC1F1F" />
</svg>

const addTokensToFav = _.debounce(async ({ symbols, mode, lang, favoriteRefresher }) => {
    // Helper
    let message = ''
    let title = ''
    const method = 'put'

    try {
        const { data } = await axios.put(API_GET_FAVORITE, { pairs: symbols, tradingMode: mode });
        await favoriteRefresher()

        if (data.status === 'error') throw 'error'

        if (lang === LANGUAGE_TAG.VI) {
            title = 'Thành công'
            message = `Đã ${method === 'delete' ? `xoá ${symbols.join(', ').replace('_', '/')} khỏi` : `thêm ${symbols.join(', ').replace('_', '/')} vào`} danh sách yêu thích`
        }
        if (lang === LANGUAGE_TAG.EN) {
            title = 'Success'
            message = `${method === 'delete' ? `Deleted ${symbols.join(', ').replace('_', '/')} from` : `Added ${symbols.join(', ').replace('_', '/')} to`} favorites`
        }
        showNotification(
            { message, title, type: 'success' },
            2500,
            'top',
            'top-right'
        )
    } catch (e) {
        console.log(`Can't execute this action `, e)

        if (lang === LANGUAGE_TAG.VI) {
            title = 'Thất bại'
            message = 'Thêm tất cả symbol thất bại, hãy thử thêm từng cặp một'
        }


        if (lang === LANGUAGE_TAG.EN) {
            title = 'Failure'
            message = 'Add all symbols error, please try one by one'
        }
        showNotification(
            { message, title, type: 'failure' },
            2500,
            'top',
            'top-right',
        )
    }
}, 1000)
