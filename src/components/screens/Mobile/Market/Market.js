import CoinPairs from 'components/svg/CoinPairs'
import useDarkMode, {THEME_MODE} from 'hooks/useDarkMode'
import colors from 'styles/colors'
import DollarCoin from 'components/svg/DollarCoin'
import cn from 'classnames'
import {IconClose, IconStarFilled} from 'components/common/Icons'
import Tag from 'components/common/Tag'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {debounce} from 'lodash/function'
import {useTranslation} from 'next-i18next'
import fetchAPI from 'utils/fetch-api'
import {
    API_GET_FUTURES_MARKET_WATCH,
    API_GET_REFERENCE_CURRENCY,
} from 'redux/actions/apis'
import {
    formatCurrency,
    formatPercentage,
    formatPrice,
    getExchange24hPercentageChange,
} from 'redux/actions/utils'
import AssetLogo from 'components/wallet/AssetLogo'
import usePrevious from 'hooks/usePrevious'
import SortIcon from 'components/screens/Mobile/SortIcon'
import {useRouter} from 'next/router'
import {useDispatch, useSelector} from 'react-redux'
import {getFuturesFavoritePairs} from 'redux/actions/futures'
import {Search} from 'react-feather'
import classNames from "classnames";

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

const defaultFavoritePairs = [
    'BTC_VNDC',
    'BCH_VNDC',
    'ETH_VNDC',
    'ETC_VNDC',
    'LTC_VNDC',
    'BNB_VNDC',
    'EOS_VNDC',
]

let loading = false

export default ({isRealtime = true}) => {
    // * Initial State
    const [tab, setTab] = useState({
        active: TABS.FAVOURITE,
        tagActive: TAGS[TABS.FAVOURITE].FUTURES,
    })
    const [data, setData] = useState([])
    const [sort, setSort] = useState({
        field: 'change24hRaw',
        direction: 'desc',
    })
    const [search, setSearch] = useState('')
    const [referencePrice, setReferencePrice] = useState([])

    const dispatch = useDispatch()
    const favoritePairRaws = useSelector((state) => state.futures.favoritePairs) || []

    const favoritePairs = useMemo(() => {
        const favoritePairVNDC = favoritePairRaws.filter(f => f.split('_')[1] === 'VNDC')
        if (!favoritePairVNDC || favoritePairVNDC.length <= 0) {
            return defaultFavoritePairs
        }
        return favoritePairRaws
    })

    const router = useRouter()
    const {t} = useTranslation(['common'])

    const changeSearch = useCallback(
        debounce((value) => {
            setSearch(value)
        }, 300),
        []
    )

    const tabTitles = {
        [TABS.FAVOURITE]: t('markets:favourite'),
        [TABS.FUTURES]: 'Futures',
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

    useEffect(() => {
        dispatch(getFuturesFavoritePairs())
        // TODO: move this logic to redux store
        fetchAPI({
            url: API_GET_REFERENCE_CURRENCY,
            params: {base: 'VNDC,USDT', quote: 'USD'},
        })
            .then(({data = []}) => {
                setReferencePrice(
                    data.reduce((acm, current) => {
                        return {
                            ...acm,
                            [`${current.base}/${current.quote}`]: current.price,
                        }
                    }, {})
                )
            })
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        if (!tab.active || !tab.tagActive) return
        getData()
    }, [tab])

    useEffect(() => {
        if (!isRealtime) return
        const intervalHandle = setInterval(() => getData(), 2000)
        return () => {
            clearInterval(intervalHandle)
        }
    }, [isRealtime])

    const getData = async () => {
        if (loading) return
        loading = true
        await fetchAPI({
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
                        change24hRaw: getExchange24hPercentageChange(item),
                        change24h: formatPercentage(
                            getExchange24hPercentageChange(item),
                            2,
                            true
                        ),
                    }))
                setData(newData)
            })
            .catch((err) => console.error(err))
        loading = false
    }

    const listItem = data
        .filter((item) => {
            if (search) {
                return item.baseAsset.includes(search?.toUpperCase() || '')
            }

            const cond = []
            if (tab.active === TABS.FAVOURITE) {
                cond.push(
                    favoritePairs.includes(
                        item.baseAsset + '_' + item.quoteAsset
                    )
                )
            }
            cond.push()

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
                <div
                    key={item.symbol}
                    className='flex justify-between mb-6'
                    onClick={() => {
                        router.push(`/mobile/futures/${item.symbol}`)
                    }}
                >
                    <div className='flex flex-1 items-start'>
                        <AssetLogo assetCode={item.baseAsset} size={30}/>
                        <div className='ml-3'>
                            <div className='flex items-center text-sm whitespace-nowrap  leading-5'>
                                <span className='font-semibold'>{item.baseAsset}</span>
                                <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    /{item.quoteAsset}
                                </span>
                            </div>
                            <p className='text-xs font-medium text-txtSecondary leading-4'>
                                {t('markets:vol')}&nbsp;
                                {formatCurrency(item.volume24h, 1)}
                            </p>
                        </div>
                    </div>
                    <div className='flex items-start justify-end'>
                        <div className='flex flex-col font-medium text-right'>
                            <LastPrice price={item.lastPrice}/>
                            <span className='text-xs text-gray-1 leading-4 whitespace-nowrap'>
                                ${formatPrice(referencePrice[`${item.quoteAsset}/USD`] * item.lastPrice, 4)}
                            </span>
                        </div>
                        <div className='flex justify-end w-24'>
                            <div
                                className={cn(
                                    'h-9 w-[4.375rem] flex items-center justify-center rounded-[4px] text-sm font-medium border',
                                    {
                                        'text-red border-red':
                                            item.change24h < 0,
                                        'text-teal border-teal':
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
        <div className='market-mobile dark:bg-onus'>
            <div className='flex items-center mt-12 px-4'>
                <InputSearch onChange={changeSearch}/>
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
                                        tagActive: Object.values(TAGS[t])[0],
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
                                        `text-sm ml-2 pb-3 relative ${t === tab.active ? 'font-semibold': 'font-medium'}`,
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
            <div className='market-list flex flex-col flex-1 min-h-0 px-1 pt-6 pb-3 dark:bg-[#192648]'>
                <div className='flex justify-between mb-4 px-3'>
                    <div className='flex flex-1 space-x-1'>
                        <TitleHeadList
                            title={t('markets:pair')}
                            onClick={changeSort('symbol')}
                            sortDirection={
                                sort.field === 'symbol' && sort.direction
                            }
                        />
                        <span className='text-xs text-gray-1'>/</span>
                        <TitleHeadList
                            title={t('common:volume')}
                            onClick={changeSort('volume24h')}
                            sortDirection={
                                sort.field === 'volume24h' && sort.direction
                            }
                        />
                    </div>
                    <div className='flex justify-end'>
                        <TitleHeadList
                            title={t('common:last_price')}
                            onClick={changeSort('lastPrice')}
                            sortDirection={
                                sort.field === 'lastPrice' && sort.direction
                            }
                        />
                        <TitleHeadList
                            title={t('common:change_24h')}
                            onClick={changeSort('change24hRaw')}
                            className='w-24'
                            sortDirection={
                                sort.field === 'change24hRaw' && sort.direction
                            }
                        />
                    </div>
                </div>
                <div className='flex-1 overflow-y-auto pt-1 px-3'>{listItem}</div>
            </div>
        </div>
    )
}

const InputSearch = ({onChange}) => {
    const {t} = useTranslation()
    const [value, setValue] = useState('')

    const handleChange = (_value) => {
        setValue(_value)
        onChange(_value)
    }
    return <div className='flex flex-1 items-center bg-gray-4 dark:bg-darkBlue-3 rounded-md py-2 px-3'>
        <Search
            size={16}
            className='text-txtSecondary dark:text-txtSecondary-dark'
        />
        <input
            className='flex-1 ml-2 outline-none placeholder-gray-1 placeholder:font-medium placeholder-text-center text-sm'
            onChange={({target: {value: v}}) => handleChange(v?.replace(/[^\w\s]/gi, ""))}
            value={value}
            placeholder={t('markets:search_placeholder')}
            type='text'
        />
        <div
            className={classNames('py-1 px-2 transition-opacity duration-75 opacity-1', {
                'opacity-0': !value
            })}
            onClick={() => handleChange('')}
        >
            <IconClose size={10}/>
        </div>
    </div>
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
