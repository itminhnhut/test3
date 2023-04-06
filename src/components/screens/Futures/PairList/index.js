import { memo, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import FuturesPairListItemV2 from './PairListItemV2';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { orderBy, pick } from 'lodash';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { API_GET_TRENDING, API_GET_FUTURES_MARKET_WATCH } from '../../../../redux/actions/apis';
import Axios from 'axios';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import NoData from 'components/common/V2/TableV2/NoData';
import fetchAPI from 'utils/fetch-api';
import { SUGGESTED_SYMBOLS } from '../FavoritePairs';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import { searchSort } from 'redux/actions/utils';
import useDebounce from 'hooks/useDebounce';

const FuturesPairList = memo(({ mode, setMode, isAuth, activePairList, onSelectPair = null, className = '' }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const favoritePairs = useSelector((state) => state.futures.favoritePairs);
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;
    const pairConfigs = useSelector((state) => state.futures.pairConfigs);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const auth = useSelector((state) => state.auth?.user) || null;
    const deboundSearch = useDebounce(search, 500);

    const [curTab, setCurTab] = useState(auth ? TABS.FAVOURITE : TABS.FUTURES);
    // Sort function:
    const [sortBy, setSortBy] = useState({}); // undefined = default, true => desc, false => asc
    // const [pairTicker, setPairTicker] = useState(null);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const [dataTable, setDataTable] = useState([]);

    // Handle trendings:
    const [trendingPairs, setTrendingPairs] = useState([]);

    const getTrending = async () => {
        try {
            const { data } = await Axios.get(API_GET_TRENDING);
            if (data && data.status === 'ok' && data?.data) {
                const trending = [];
                data.data.forEach((item) => {
                    if (item.key === 'top_gainers' || item.key === 'top_losers') {
                        if (item.pairs) trending.push(item.pairs);
                    }
                });

                if (trending.length === 2) {
                    setTrendingPairs([...trending[0], ...trending[1]].map((item) => item?.s));
                }
            }
        } catch (e) {
            console.log('Cant get top trending data: ', e);
        }
    };

    useEffect(() => {
        getTrending();
    }, []);

    useEffect(() => {
        setCurTab(auth ? TABS.FAVOURITE : TABS.FUTURES);
    }, [!!auth]);

    const onHandleChange = async (key, value) => {
        let data = await forceData(pairConfigs);
        setCurTab(key);
        switch (key) {
            case TABS.FUTURES:
                break;
            case TABS.TRENDING:
                data = data?.filter((i) => trendingPairs.find((rs) => rs === i?.symbol));
                break;
            case TABS.GAINERS:
                data = data?.filter((i) => i.priceChangePercent && i?.priceChangePercent > 0);
                break;
            case TABS.LOSERS:
                data = data?.filter((i) => i.priceChangePercent && i?.priceChangePercent < 0);
                break;
            default:
                break;
        }
        setDataTable(data);
    };

    useEffect(() => {
        const arr = pairConfigs.map((rs) => rs?.pair);
        if (publicSocket && pairConfigs && pairConfigs.length > 0) publicSocket?.emit('subscribe:futures:ticker', arr);

        return () => {
            if (publicSocket) publicSocket?.emit('unsubscribe:futures:ticker', arr);
        };
    }, [pairConfigs, publicSocket]);

    const asyncValue = async (value, duration = 100) => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(value), duration);
        });
    };

    const forceData = async (duration = 0) => {
        return await Promise.all(
            pairConfigs.map(async (item) => {
                return {
                    ...item,
                    lastPrice: await asyncValue(marketWatch[item?.pair]?.lastPrice || 0, duration),
                    priceChangePercent: await asyncValue(marketWatch[item?.pair]?.priceChangePercent || 0, duration)
                };
            })
        );
    };

    const getMarketWatch = async () => {
        const { data } = await fetchAPI({
            url: API_GET_FUTURES_MARKET_WATCH
        });
        if (data) {
            const dataSource = pairConfigs.map((item) => {
                let ticker = data.find((rs) => rs.s === item.pair);
                if (ticker) ticker = FuturesMarketWatch.create(ticker);
                return {
                    ...item,
                    lastPrice: ticker?.lastPrice || 0,
                    priceChangePercent: ticker?.priceChangePercent || 0
                };
            });
            setDataTable(dataSource);
        }
    };

    useEffect(() => {
        if (pairConfigs) getMarketWatch();
    }, [pairConfigs]);

    const dataFilter = useMemo(() => {
        let data = [...dataTable];
        data = data.filter((item) => item?.quoteAsset === mode);
        if (curTab === TABS.FAVOURITE) {
            const _data = data?.filter((i) => favoritePairs.find((rs) => rs.replace('_', '') === i.symbol));
            if (_data?.length > 0) {
                data = _data;
            } else {
                data = data?.filter((i) => SUGGESTED_SYMBOLS?.includes(i?.baseAsset));
            }
        }
        if (deboundSearch) {
            data = pairConfigs.filter((item) => item?.quoteAsset === mode);
            setCurTab(TABS.FUTURES);
            return searchSort(data, ['baseAsset', 'quoteAsset'], deboundSearch);
        }
        if (Object.keys(sortBy)?.length) {
            const _s = Object.entries(sortBy)[0];
            data = orderBy(data, [_s[0]], [`${_s[1] ? 'asc' : 'desc'}`]);
        }
        return data;
    }, [dataTable, sortBy, mode, deboundSearch, curTab, favoritePairs, pairConfigs]);

    // End sort function,
    const renderPairListItemsV2 = useCallback(() => {
        if (dataFilter.length === 0) return <NoData isAuth={true} isSearch={!!search} />;
        return dataFilter?.map((pair) => {
            const isFavorite = favoritePairs.find((rs) => rs.replace('_', '') === pair.symbol);
            // if (curTab === TABS.FAVOURITE && !isFavorite) return;
            return (
                <FuturesPairListItemV2
                    key={`futures_pairListItems_${pair?.pair}`}
                    pairConfig={pair}
                    isDark={isDark}
                    isFavorite={isFavorite}
                    isAuth={isAuth}
                    onSelectPair={onSelectPair}
                    // pairTicker={marketWatch[pair.symbol]}
                />
            );
        });
    }, [dataFilter, curTab, favoritePairs]);

    const setSorter = (key) => {
        setSortBy((prev) => (prev?.[key] === undefined ? { [key]: true } : prev?.[key] ? { [key]: false } : { [key]: undefined }));
    };

    // Hanlde tabs
    const tabTitles = {
        [TABS.FAVOURITE]: t('common:favourite'),
        [TABS.FUTURES]: t('common:all'),
        [TABS.TRENDING]: t('common:trending'),
        [TABS.GAINERS]: t('common:gainers'),
        [TABS.LOSERS]: t('common:losers')
    };

    return (
        <div
            className={`py-4 min-w-[400px] border border-divider dark:border-divider-dark bg-white dark:bg-dark-4
            shadow-card_light dark:shadow-popover rounded-md ${className}`}
        >
            <div className="max-h-[352px] flex flex-col">
                <div className="px-4 mb-7 flex items-center">
                    <SearchBoxV2
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                        }}
                        wrapperClassname="py-2 flex-1"
                    />
                    <div className="pl-4 flex items-center text-sm gap-3 text-txtSecondary dark:text-txtSecondary-dark  select-none">
                        <button
                            onClick={() => setMode('VNDC')}
                            className={`${mode === 'VNDC' ? 'text-green-3 dark:text-green-2 font-semibold' : 'hover:text-gray-15 dark:hover:text-gray-14'}`}
                        >
                            VNDC
                        </button>
                        <button
                            onClick={() => setMode('USDT')}
                            className={`${mode === 'USDT' ? 'text-green-3 dark:text-green-2 font-semibold' : 'hover:text-gray-15 dark:hover:text-gray-14'}`}
                        >
                            USDT
                        </button>
                    </div>
                </div>

                <div className="relative flex tracking-normal mx-4">
                    <Tabs key="tabs_pair_list_info" tab={curTab} className="border-b border-divider dark:border-divider-dark">
                        {Object.values(TABS).map((t) => {
                            if (!auth && t === TABS.FAVOURITE) return;
                            return (
                                <TabItem
                                    V2
                                    key={'tab_detail_pairlist_' + t}
                                    className={`!px-2 !text-sm`}
                                    value={t}
                                    onClick={(isClick) => isClick && onHandleChange(t)}
                                >
                                    {tabTitles[t]}
                                </TabItem>
                            );
                        })}
                    </Tabs>
                </div>

                {/* {renderModes()} */}

                <div
                    style={{
                        height: ORDERS_HEADER_HEIGHT
                    }}
                    className="px-4 mt-7 mb-4 flex items-center justify-between font-normal text-xs text-txtSecondary dark:text-txtSecondary-dark"
                >
                    <div onClick={() => setSorter('symbol')} style={{ flex: '1 1 0%' }} className="flex justify-start items-center select-none">
                        {t('common:asset')}
                        <Sorter isUp={sortBy?.[`symbol`]} />
                    </div>
                    <div onClick={() => setSorter('lastPrice')} style={{ flex: '1 1 0%' }} className="flex justify-end items-center select-none">
                        {t('common:last_price')}
                        <Sorter isUp={sortBy?.[`lastPrice`]} />
                    </div>
                    <div onClick={() => setSorter('priceChangePercent')} style={{ flex: '1 1 0%' }} className="flex justify-end items-center select-none">
                        {t('futures:24h_change')}
                        <Sorter isUp={sortBy?.[`priceChangePercent`]} />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto">{renderPairListItemsV2()}</div>
            </div>
        </div>
    );
});

const Sorter = ({ isUp }) => {
    let active;
    if (isUp === undefined) {
        active = 1;
    } else if (isUp) {
        active = 2;
    } else {
        active = 3;
    }
    return (
        <SorterWrapper>
            <CaretUpFilled style={active === 2 ? { color: colors.teal } : undefined} />
            <CaretDownFilled style={active === 3 ? { color: colors.teal } : undefined} />
        </SorterWrapper>
    );
};

const SorterWrapper = styled.span`
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding-left: 10px;
    margin-top: -2px;

    span:first-child {
        transform: translateY(2px);
    }

    span {
        width: 7px;
        height: 7px;

        svg {
            width: 100%;
            height: auto;
        }
    }
`;

const ORDERS_HEADER_HEIGHT = 20;

const TABS = {
    FAVOURITE: 'FAVOURITE',
    FUTURES: 'FUTURES',
    TRENDING: 'TRENDING',
    GAINERS: 'GAINERS',
    LOSERS: 'LOSERS'
};

export default FuturesPairList;
