import colors from 'styles/colors';
import cn from 'classnames';
import classNames from 'classnames';
import { IconClose, IconStarFilled } from 'components/common/Icons';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash/function';
import { useTranslation } from 'next-i18next';
import fetchAPI from 'utils/fetch-api';
import { API_GET_FUTURES_MARKET_WATCH, API_GET_REFERENCE_CURRENCY, } from 'redux/actions/apis';
import {
    formatCurrency,
    formatPercentage,
    getExchange24hPercentageChange,
    scrollHorizontal,
    formatNumber,
    getDecimalPrice,
    formatPrice
} from 'redux/actions/utils';
import AssetLogo from 'components/wallet/AssetLogo';
import usePrevious from 'hooks/usePrevious';
import SortIcon from 'components/screens/Nao_futures/SortIcon';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getFuturesFavoritePairs } from 'redux/actions/futures';
import { Search } from 'react-feather';
import { useRef } from 'react';
import { orderBy } from 'lodash';
import Tag from 'components/common/Tag'
import { roundTo } from 'round-to';
import dynamic from 'next/dynamic';
import { TRADING_MODE } from 'redux/actions/const';

const TABS = {
    FAVOURITE: 'FAVOURITE',
    FUTURES: 'FUTURES',
    TRENDING: 'TRENDING',
    GAINERS: 'GAINERS',
    LOSERS: 'LOSERS',
    // EXCHANGE: 'EXCHANGE'
}

const initTags = {
    VNDC: 'VNDC',
    USDT: 'USDT',
}

const TAGS = {
    [TABS.FAVOURITE]: initTags,
    [TABS.FUTURES]: initTags,
    [TABS.TRENDING]: initTags,
    [TABS.GAINERS]: initTags,
    [TABS.LOSERS]: initTags,
}

const defaultFavoritePairs = [
    'BTC',
    'BCH',
    'ETH',
    'ETC',
    'LTC',
    'BNB',
    'EOS',
]

let loading = false

export default ({ isRealtime = true, pair, pairConfig }) => {
    // * Initial State
    const [tab, setTab] = useState({
        active: TABS.FAVOURITE,
        tagActive: pairConfig?.quoteAsset || TAGS[TABS.FAVOURITE].VNDC,
    })
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const [data, setData] = useState([])
    const [sort, setSort] = useState({
        field: 'volume24h',
        direction: 'desc',
    })
    const [search, setSearch] = useState('')
    const [referencePrice, setReferencePrice] = useState([])
    const refTabsMarkets = useRef(null);

    const dispatch = useDispatch()
    const favoritePairRaws = useSelector((state) => state.futures.favoritePairs) || []
    // const marketWatch = useSelector((state) => state.futures.marketWatch);

    const favoritePairs = useMemo(() => {
        const favoritePair = favoritePairRaws.filter(f => f.split('_')[1] === tab.tagActive)
        if (!favoritePair || favoritePair.length <= 0) {
            return defaultFavoritePairs.map(i => i + `_${tab.tagActive}`)
        }
        return favoritePairRaws
    }, [tab, favoritePairRaws])

    const router = useRouter()
    const { t } = useTranslation(['common'])

    const changeSearch = useCallback(
        debounce((value) => {
            setSearch(value)
        }, 300),
        []
    )

    const tabTitles = {
        [TABS.FAVOURITE]: t('markets:favourite'),
        [TABS.FUTURES]: t('common:all'),
        [TABS.TRENDING]: t('markets:trending'),
        [TABS.GAINERS]: t('markets:gainers'),
        [TABS.LOSERS]: t('markets:losers'),
    }

    const changeSort = (field) => () => {
        if (field !== sort.field) {
            setSort({ field, direction: 'asc' })
        } else {
            switch (sort.direction) {
                case 'asc':
                    setSort({ field, direction: 'desc' })
                    break
                case 'desc':
                    setSort({ field: '', direction: '' })
                    break
                default:
                    setSort({ field, direction: 'asc' })
                    break
            }
        }
    }


    useEffect(() => {
        dispatch(getFuturesFavoritePairs(TRADING_MODE.NAO))
        // TODO: move this logic to redux store
        fetchAPI({
            url: API_GET_REFERENCE_CURRENCY,
            params: { base: 'VNDC,USDT', quote: 'USD' },
        })
            .then(({ data = [] }) => {
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
        getData(tab.tagActive)
    }, [tab])

    useEffect(() => {
        if (!isRealtime) return
        const intervalHandle = setInterval(() => getData(tab.tagActive), 5000)
        return () => {
            clearInterval(intervalHandle)
        }
    }, [isRealtime, tab])

    const getData = async (tag) => {
        if (loading) return
        loading = true
        await fetchAPI({
            url: API_GET_FUTURES_MARKET_WATCH,
        })
            .then(({ data = [] }) => {
                const newData = data
                    .filter((item) => {
                        // Add more filter before store if needed
                        return item.q === tag
                    })
                    .map((item = {}) => ({
                        symbol: item.s,
                        lastPrice: item.p,
                        lastPrice24h: item.ld,
                        volume24h: item.vq,
                        quoteAsset: item.q,
                        baseAsset: item.b,
                        leverageMax: item.lbl,
                        view: item.vc ?? 0,
                        change24hRaw: getExchange24hPercentageChange(item),
                        change24h: formatPercentage(
                            roundTo(getExchange24hPercentageChange(item), 2),
                            2,
                            true
                        ),
                    }))
                setData(newData)
            })
            .catch((err) => console.error(err))
        loading = false
    }

    const filter = useRef({ field: '', direction: '' })

    const dataFilter = useMemo(() => {
        if (!Array.isArray(data)) return [];
        // if (data.length <= 0) {
        //     const sub = []
        //     favoritePairs.map(item => {
        //         const _item = marketWatch[String(item).replace('_', '')];
        //         sub.push({
        //             symbol: _item.symbol,
        //             lastPrice: _item.priceChange,
        //             lastPrice24h: _item.lastPrice,
        //             volume24h: 0,
        //             quoteAsset: _item.quoteAsset,
        //             baseAsset: _item.baseAsset,
        //             leverageMax: 0,
        //             view: 0,
        //             change24hRaw: _item.priceChangePercent * 100,
        //             change24h: _item.priceChangePercent * 100,
        //         })
        //     });
        //     return sub;
        // }
        if (search) {
            return data.filter((item) => {
                return item.baseAsset.includes(search?.toUpperCase() || '')
            })
        }
        return orderBy(data, [filter.current.field], [filter.current.direction]).filter(((item, index) => {
            if (tab.active === TABS.FAVOURITE) {
                return favoritePairs.includes(item.baseAsset + '_' + item.quoteAsset)
            }
            if (tab.active === TABS.TRENDING || tab.active === TABS.GAINERS || tab.active === TABS.LOSERS) {
                return index < 10;
            }
            return item;
        }));
    }, [tab, data, search])

    const dataSource = useMemo(() => {
        return orderBy(dataFilter, [sort.field], [sort.direction])
    }, [sort, dataFilter])

    const onChangeTab = (t) => {
        switch (t) {
            case TABS.TRENDING:
                filter.current = { field: 'view', direction: 'desc' }
                break
            case TABS.GAINERS:
                filter.current = { field: 'change24hRaw', direction: 'desc' }
                break
            case TABS.LOSERS:
                filter.current = { field: 'change24hRaw', direction: 'asc' }
                break
            default:
                filter.current = { field: 'volume24h', direction: 'desc' }
                break
        }
        setSort(filter.current)
        setTab({
            ...tab,
            active: t,
        })
    }


    const renderItem = (listItem) => {
        return listItem.map((item) => (
            <div
                key={item.symbol}
                className={`flex justify-between min-h-[3.375rem] items-center px-4 ${pair === item.symbol ? 'bg-hover dark:bg-hover-dark' : ''}`}
                onClick={() => {
                    router.push(`/mobile/futures/${item.symbol}`);
                }}
            >
                <div className="flex flex-1 items-center">
                    <AssetLogo assetCode={item.baseAsset} size={30} />
                    <div className="ml-3">
                        <div className="flex items-center text-sm whitespace-nowrap leading-5 mr-2">
                            <span className="font-semibold text-txtPrimary dark:text-txtPrimary-dark">{item.baseAsset}</span>
                            {/* <span className='text-txtSecondary dark:text-txtSecondary-dark'>
                                    /{item.quoteAsset}
                                </span> */}
                            {item.leverageMax && (
                                <div className="ml-2 bg-gray-12 dark:bg-dark-2 rounded-[2px] px-[0.375rem] h-[18px] text-xs font-medium">
                                    {item.leverageMax}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-txtSecondary dark:text-txtSecondary-dark">${formatCurrency(item.volume24h, 1)}</p>
                    </div>
                </div>
                <div className="flex items-start justify-end">
                    <div className="flex flex-col text-right">
                        <LastPrice price={item.lastPrice} />
                        <span className="text-xs text-txtSecondary dark:text-txtSecondary-dark leading-[1.125rem] whitespace-nowrap">
                            ${formatPrice(item?.quoteAsset === 'VNDC' ? item.lastPrice / 23415 : referencePrice[`${item.quoteAsset}/USD`] * item.lastPrice, 4)}
                        </span>
                    </div>
                    <div className="flex justify-end ml-6">
                        <div
                            className={cn('h-9 min-w-[4.375rem] flex items-center justify-center rounded-[4px] text-sm font-medium', {
                                'bg-red-2 text-txtBtnPrimary': item.change24h < 0,
                                'bg-green-2 text-txtBtnPrimary': item.change24h >= 0
                            })}
                        >
                            {item.change24h > 0 && '+'}
                            {formatNumber(item.change24h, 2, 2, true)} %
                        </div>
                    </div>
                </div>
            </div>
        ));

    }

    return (
        <div className='market-mobile'>
            <div className='mt-4 px-4'>
                <InputSearch onChange={changeSearch} />
            </div>
            <div className='border-b border-divider dark:border-divider-dark'>
                <div ref={refTabsMarkets} className='flex space-x-5 px-4 mt-6 overflow-x-auto overflow-y-hidden'>
                    {Object.values(TABS).map((t) => {
                        return (
                            <div
                                key={t}
                                className={cn(
                                    'flex cursor-pointer text-txtSecondary dark:text-txtSecondary-dark whitespace-nowrap'
                                )}
                                onClick={(e) => {
                                    onChangeTab(t)
                                    scrollHorizontal(e.target, refTabsMarkets.current)
                                }}
                            >
                                {t === TABS.FAVOURITE && (
                                    <span className="mt-0.5">
                                        <IconStarFilled
                                            size={16}
                                            color={colors.yellow[2]}
                                        />
                                    </span>
                                )}
                                <span
                                    className={cn(
                                        `text-sm pb-3 relative font-medium`,
                                        {
                                            'tab-active !font-semibold text-txtPrimary dark:text-txtPrimary-dark': t === tab.active,
                                            'ml-2': t === TABS.FAVOURITE
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
            <div className='flex gap-[0.375rem] mt-5 px-4'>
                {Object.keys(TAGS[tab.active]).map((tag) => {
                    return (
                        <div
                            className={classNames(
                                'min-h-[2rem] flex items-center justify-center px-3 rounded text-sm font-medium',
                                { 'bg-bgTabActive text-txtBtnPrimary': TAGS[tab.active][tag] === tab.tagActive },
                                { 'bg-gray-12 dark:bg-dark-2 text-txtPrimary dark:text-txtSecondary-dark': TAGS[tab.active][tag] !== tab.tagActive }
                            )}
                            onClick={() => {
                                setTab({
                                    ...tab,
                                    tagActive: TAGS[tab.active][tag],
                                })
                            }}
                        >
                            {tag}
                        </div>
                    )
                })}
            </div>
            <div className='flex flex-col flex-1 min-h-0 pt-4 pb-3'>
                <div className='flex justify-between mb-2 px-4'>
                    <div className='flex flex-1 space-x-1'>
                        <TitleHeadList
                            title={t('markets:pair')}
                            onClick={changeSort('symbol')}
                            sortDirection={
                                sort.field === 'symbol' && sort.direction
                            }
                        />
                        <span className='text-xs text-txtSecondary dark:text-txtSecondary-dark'>/</span>
                        <TitleHeadList
                            title={t('futures:volume')}
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
                            title={t('futures:mobile:change_24h')}
                            onClick={changeSort('change24hRaw')}
                            className='w-24'
                            sortDirection={
                                sort.field === 'change24hRaw' && sort.direction
                            }
                        />
                    </div>
                </div>
                <div className='flex-1 overflow-y-auto flex flex-col space-y-3'>{renderItem(dataSource)}</div>
            </div>
        </div>
    )
}

const InputSearch = ({ onChange }) => {
    const { t } = useTranslation()
    const [value, setValue] = useState('')

    const handleChange = (_value) => {
        const str = _value.normalize('NFD');
        _value = str.replace(/[\u0300-\u036f]/g, '')
        setValue(_value)
        onChange(_value)
    }
    return <div className='flex flex-1 items-center bg-gray-12 dark:bg-dark-2 rounded-md py-2 px-4'>
        <Search
            size={20}
            className='text-txtSecondary dark:text-txtSecondary-dark'
            strokeWidth={1}
        />
        <input
            className='flex-1 ml-2 outline-none !placeholder-txtSecondary dark:!placeholder-txtSecondary-dark placeholder:font-medium text-sm'
            onChange={({ target: { value: v } }) => handleChange(v)}
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
            <IconClose size={10} />
        </div>
    </div>
}

const LastPrice = ({ price, decimal = 8 }) => {
    const prevPrice = usePrevious(price);
    return (
        <span
            className={cn('text-sm leading-5 font-medium', {
                'text-red-2': price < prevPrice,
                'text-green-2': price >= prevPrice,
            })}
        >
            {formatNumber(price, decimal)}
        </span>
    );
};

const TitleHeadList = ({ title, className = '', onClick, sortDirection }) => {
    return (
        <div
            className={
                'flex items-center justify-end cursor-pointer ' + className
            }
            onClick={onClick}
        >
            <span className='text-txtSecondary dark:text-txtSecondary-dark text-xs leading-4'>{title}</span>
            <SortIcon color="currentColor" activeColor={colors.teal} direction={sortDirection} className="text-gray-1 dark:text-gray-7" />
        </div>
    )
}
