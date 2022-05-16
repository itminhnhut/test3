import React, {useCallback, useEffect, useState} from 'react'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import LayoutMobile from 'components/common/layouts/LayoutMobile'
import CoinPairs from 'components/svg/CoinPairs'
import DollarCoin from 'components/svg/DollarCoin'
import colors from 'styles/colors'
import {IconStarFilled} from 'components/common/Icons'
import cn from 'classnames'
import Tag from 'components/common/Tag'
import SortIcon from 'components/screens/Mobile/SortIcon'
import fetchAPI from 'utils/fetch-api'
import {
    API_GET_FAVORITE,
    API_GET_FUTURES_MARKET_WATCH,
} from 'redux/actions/apis'
import AssetLogo from 'components/wallet/AssetLogo'
import {
    formatNumber,
    formatPercentage,
    formatPrice,
    getExchange24hPercentageChange,
} from 'redux/actions/utils'
import usePrevious from 'hooks/usePrevious'
import {debounce} from 'lodash/function'
import useDarkMode, {THEME_MODE} from 'hooks/useDarkMode'
import {useTranslation} from 'next-i18next'

const TABS = {
    FAVOURITE: 'FAVOURITE',
    FUTURES: 'FUTURES',
    // EXCHANGE: 'EXCHANGE'
}

const TAGS = {
    [TABS.FAVOURITE]: {
        FUTURES: 2,
        // EXCHANGE: 1,
    },
    [TABS.FUTURES]: {
        VNDC: 'VNDC',
        // USDT: 'USDT',
    },
}

const Market = () => {
    // * Initial State
    const [tab, setTab] = useState({
        active: TABS.FAVOURITE,
        tagActive: TAGS[TABS.FAVOURITE].FUTURES,
    })

    const [favoriteSymbols, setFavoriteSymbols] = useState([])
    const [data, setData] = useState([])

    const [sort, setSort] = useState({
        field: 'change24hRaw',
        direction: 'desc',
    })

    const [search, setSearch] = useState('')

    const changeSearch = useCallback(
        debounce(({target: {value}}) => {
            setSearch(value)
        }, 300),
        []
    )

    const [themeMode, setThemeMode] = useDarkMode()

    const {t} = useTranslation(['common'])

    const tabTitles = {
        [TABS.FAVOURITE]: t('markets:favourite'),
        [TABS.FUTURES]: 'Futures'
    }

    const changeSort = (field) => () => {
        if (field !== sort.field) {
            setSort({field, direction: 'asc'})
        } else {
            switch (sort.direction) {
                case 'asc':
                    setSort({field, direction: 'desc'})
                    break
                case 'desc':
                    setSort({field: '', direction: ''})
                    break
                default:
                    setSort({field, direction: 'asc'})
                    break
            }
        }
    }

    // TODO: move to utils
    const formatCash = (n, digits = 4) => {
        if (n < 1e3) return formatNumber(n, 0, 0, true)
        if (n >= 1e6 && n < 1e9)
            return formatNumber(+(n / 1e6).toFixed(4), digits, 0, true) + 'M'
        if (n >= 1e9 && n < 1e12)
            return formatNumber(+(n / 1e9).toFixed(4), digits, 0, true) + 'B'
        if (n >= 1e12)
            return formatNumber(+(n / 1e12).toFixed(4), digits, 0, true) + 'T'
    }

    useEffect(() => {
        fetchAPI({
            url: API_GET_FAVORITE,
            params: {tradingMode: tab.tagActive},
        })
            .then(({data = []}) => {
                setFavoriteSymbols(data.map((s) => s.replace('_', '')))
            })
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        if (!tab.active || !tab.tagActive) return

        const intervalHandle = setInterval(() => getData(), 1500)
        return () => {
            clearInterval(intervalHandle)
        }
    }, [tab])

    const getData = () => {
        fetchAPI({
            url: API_GET_FUTURES_MARKET_WATCH,
        })
            .then(({data = []}) => {
                const newData = data
                    .filter((item) => {
                        // Add more filter before store if needed
                        return item.q === 'VNDC'
                    })
                    .map((item = {}) => ({
                        symbol: item.s,
                        lastPrice: item.p,
                        lastPrice24h: item.ld,
                        volume24h: item.vq,
                        quoteAsset: item.q,
                        baseAsset: item.b,
                        change24hRaw: Math.abs(
                            getExchange24hPercentageChange(item)
                        ),
                        change24h: formatPercentage(
                            getExchange24hPercentageChange(item),
                            2,
                            true
                        ),
                    }))
                setData(newData)
            })
            .catch((err) => console.error(err))
    }

    const listItem = data
        .filter((item) => {
            const cond = []
            if (tab.active === TABS.FAVOURITE) {
                cond.push(favoriteSymbols.includes(item.symbol))
            }
            cond.push(item.baseAsset.includes(search?.toUpperCase() || ''))

            return cond.every((e) => e)
        })
        .sort((a, b) => {
            if (!sort.field || !sort.direction) return 0
            if (a[sort.field] > b[sort.field]) {
                return sort.direction === 'asc' ? 1 : -1
            } else {
                return sort.direction === 'asc' ? -1 : 1
            }
        })
        .map((item) => {
            return (
                <div key={item.symbol} className='flex justify-between mb-4'>
                    <div className='flex flex-1 items-start'>
                        <AssetLogo assetCode={item.baseAsset} size={30}/>
                        <div className='ml-3'>
                            <div className='flex items-center text-sm whitespace-nowrap font-semibold leading-5'>
                                <span>{item.baseAsset}</span>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    /{item.quoteAsset}
                                </span>
                            </div>
                            <p className='text-xs font-medium text-txtSecondary leading-4'>
                                Vol {formatCash(item.volume24h, 1)}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-center justify-end'>
                        <div className='font-medium text-right'>
                            <LastPrice price={item.lastPrice}/>
                            {/*<p className='text-xs text-gray-1 leading-4'>*/}
                            {/*    $ 2,796.66*/}
                            {/*</p>*/}
                        </div>
                        <div className='flex justify-end w-24'>
                            <div
                                className={cn(
                                    'h-9 w-[4.375rem] flex items-center justify-center rounded-[4px] text-sm font-medium',
                                    {
                                        'text-red bg-[rgba(229,84,75,0.1)]':
                                            item.change24h < 0,
                                        'text-teal bg-[rgba(0,200,188,0.1)]':
                                            item.change24h >= 0,
                                    }
                                )}
                            >
                                {item.change24h > 0 && '+'}
                                {item.change24h} %
                            </div>
                        </div>
                    </div>
                </div>
            )
        })

    return (
        <LayoutMobile>
            <div className='market-mobile'>
                <div className='flex items-center pt-6 px-4'>
                    <div className='flex flex-1 items-center bg-gray-4 dark:bg-darkBlue-3 rounded-md py-2 px-3 mr-4'>
                        <CoinPairs
                            size={16}
                            color={
                                themeMode === THEME_MODE.LIGHT
                                    ? colors.grey1
                                    : colors.darkBlue5
                            }
                        />
                        <input
                            className='flex-1 ml-2 outline-none placeholder-gray-1 placeholder:font-semibold'
                            onChange={changeSearch}
                            placeholder={t('markets:search_placeholder')}
                            type='text'
                        />
                    </div>
                    <DollarCoin
                        onClick={setThemeMode}
                        color={
                            themeMode === THEME_MODE.LIGHT
                                ? colors.grey1
                                : colors.darkBlue5
                        }
                    />
                </div>
                <div>
                    <div className='flex space-x-8 px-4 mt-6'>
                        {Object.values(TABS).map((t) => {
                            return (
                                <div
                                    key={t}
                                    className={cn(
                                        'flex cursor-pointer text-gray-1'
                                    )}
                                    onClick={() =>
                                        setTab({
                                            active: t,
                                            tagActive: Object.values(
                                                TAGS[t]
                                            )[0],
                                        })
                                    }
                                >
                                    {t === TABS.FAVOURITE && (
                                        <span className='mt-1'>
                                            <IconStarFilled
                                                size={16}
                                                color={colors.yellow}
                                            />
                                        </span>
                                    )}
                                    <span
                                        className={cn(
                                            'font-medium ml-2 pb-3 relative',
                                            {
                                                'tab-active text-darkBlue dark:text-gray-4':
                                                    t === tab.active,
                                            }
                                        )}
                                    >
                                        {tabTitles[t]}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='market-list px-4 pt-6 bg-white dark:bg-darkBlue-2'>
                    <div className='flex space-x-4'>
                        {Object.keys(TAGS[tab.active]).map((tag) => {
                            return (
                                <Tag
                                    key={tag}
                                    type={
                                        TAGS[tab.active][tag] === tab.tagActive
                                            ? 'primary'
                                            : ''
                                    }
                                    onClick={() => {
                                        setTab({
                                            ...tab,
                                            tagActive: TAGS[tab.active][tag],
                                        })
                                    }}
                                >
                                    {tag}
                                </Tag>
                            )
                        })}
                    </div>
                    <div className='mt-4'>
                        <div className='flex justify-between mb-4'>
                            <div className='flex flex-1 space-x-1'>
                                <TitleHeadList
                                    title={t('markets:pair')}
                                    onClick={changeSort('symbol')}
                                    sortDirection={
                                        sort.field === 'symbol' &&
                                        sort.direction
                                    }
                                />
                                <span className='text-xs text-gray-1'>/</span>
                                <TitleHeadList
                                    title={t('common:volume')}
                                    onClick={changeSort('volume24h')}
                                    sortDirection={
                                        sort.field === 'volume24h' &&
                                        sort.direction
                                    }
                                />
                            </div>
                            <div className='flex justify-end'>
                                <TitleHeadList
                                    title={t('common:last_price')}
                                    onClick={changeSort('lastPrice')}
                                    sortDirection={
                                        sort.field === 'lastPrice' &&
                                        sort.direction
                                    }
                                />
                                <TitleHeadList
                                    title={t('common:change_24h')}
                                    onClick={changeSort('change24hRaw')}
                                    className='w-24'
                                    sortDirection={
                                        sort.field === 'change24hRaw' &&
                                        sort.direction
                                    }
                                />
                            </div>
                        </div>
                        <div className='h-[calc(100vh-19rem)] overflow-y-auto'>
                            {listItem}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutMobile>
    )
}

const LastPrice = ({price}) => {
    const prevPrice = usePrevious(price)
    return (
        <span
            className={cn('text-sm leading-5', {
                'text-red': price < prevPrice,
                'text-teal': price >= prevPrice,
            })}
        >
            {formatPrice(price)}
        </span>
    )
}

const TitleHeadList = ({title, className = '', onClick, sortDirection}) => {
    return (
        <div
            className={
                'flex items-center justify-end cursor-pointer ' + className
            }
            onClick={onClick}
        >
            <span className='text-gray-1 text-xs leading-4'>{title}</span>
            <SortIcon direction={sortDirection}/>
        </div>
    )
}

export async function getStaticProps({locale}) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'navbar',
                'markets',
            ])),
        },
    }
}

export default Market
