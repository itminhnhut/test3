import { memo, useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FuturesPairListItemV2 from './PairListItemV2';
import colors from 'styles/colors';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useTranslation } from 'next-i18next';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { orderBy, pick } from 'lodash';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { API_GET_TRENDING } from '../../../../redux/actions/apis';
import Axios from 'axios';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';
import NoData from 'components/common/V2/TableV2/NoData';

import { SUGGESTED_SYMBOLS } from '../FavoritePairs';

const FuturesPairList = memo(({ mode, setMode, isAuth, activePairList, onSelectPair = null, className = '' }) => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const favoritePairs = useSelector((state) => state.futures.favoritePairs);
    const [theme] = useDarkMode();
    const isDark = theme === THEME_MODE.DARK;
    const [curTab, setCurTab] = useState(TABS.FAVOURITE);
    const pairConfigs = useSelector((state) => state.futures.pairConfigs);

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

    // end handle trendings

    useEffect(() => {
        try {
            let data = pairConfigs.map((item) => pick(item, ['pair', 'symbol', 'baseAsset', 'quoteAsset', 'pricePrecision']));

            data.forEach((item) => {
                const pairTicker = marketWatch[item?.pair];
                if (pairTicker && item) {
                    item.lastPrice = pairTicker.lastPrice;
                    item.priceChangePercent = pairTicker.priceChangePercent;
                }
            });

            if (mode === 'USDT' || mode === 'VNDC') {
                data = data.filter((item) => item?.quoteAsset === mode);
            }

            switch (curTab) {
                case TABS.FAVOURITE:
                    if (favoritePairs?.length > 0) {
                        data = data?.filter((i) => favoritePairs.find((rs) => rs.replace('_', '') === i.symbol));
                    } else {
                        data = data?.filter((i) => SUGGESTED_SYMBOLS?.find((rs) => rs.includes(i?.baseAsset)));
                    }
                    break;
                case TABS.FUTURES:
                    data = data;
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

            // sort by field
            if (Object.keys(sortBy)?.length) {
                const _s = Object.entries(sortBy)[0];
                if (_s[1] !== undefined) {
                    data = orderBy(
                        data,
                        [
                            (o) => {
                                const value = o[`${_s[0]}`];
                                return value ? value : _s[1] ? 1000000 : -1000000;
                            }
                        ],
                        [`${_s[1] ? 'asc' : 'desc'}`]
                    );
                }
            }

            // filter search
            if (search) {
                const _search = search?.replace('/', '').toLowerCase();
                data = data?.filter((o) => o?.pair?.toLowerCase().includes(_search));
            }
            setDataTable(data);
        } catch (error) {
            console.log('error', error);
        }
    }, [mode, curTab, favoritePairs, pairConfigs, sortBy, search]);

    // End sort function,
    const renderPairListItemsV2 = useCallback(() => {
        if (dataTable.length === 0) return <NoData isSearch={!!search} />;

        return dataTable?.map((pair) => {
            const isFavorite = favoritePairs.find((rs) => rs.replace('_', '') === pair.symbol);
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
    }, [dataTable]);

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
            className={`${!activePairList ? 'hidden' : ''} py-4 min-w-[400px] border border-divider dark:border-divider-dark bg-white dark:bg-dark-4
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
                    <Tabs isMobile tab={curTab ?? TABS.FUTURES} className="border-b border-divider dark:border-divider-dark">
                        {Object.values(TABS).map((t) => {
                            return (
                                <TabItem
                                    isActive={curTab === t}
                                    key={'tab_detail_pairlist_' + t}
                                    className={`!px-2 !text-sm`}
                                    value={t}
                                    onClick={() => {
                                        if (curTab !== t) setCurTab(t);
                                    }}
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
