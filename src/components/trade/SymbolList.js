import { IconNoSort, IconSearch, IconSort, IconStarFilled } from 'components/common/Icons';
import SearchInput from 'components/markets/SearchInput';
import compact from 'lodash/compact';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsync, useInterval, useLocalStorage } from 'react-use';
import SymbolListItem from 'src/components/markets/SymbolListItem';
import { CATEGORY_SPOT_SIGNAL, LS_KEYS } from 'src/redux/actions/const';
import { getMarketWatch } from 'src/redux/actions/market';
import { getExchange24hPercentageChange } from 'src/redux/actions/utils';

const SymbolList = (props) => {
    const { query } = useRouter();
    const { t } = useTranslation();
    const { parentCallback, publicSocket, changeSymbolList, favorite, watchList, symbol, handleChangeSymbol } = props;
    const [symbolList, setSymbolList] = useState([]);
    const [sortField, setSortField] = useState();
    const [sortDirection, setSortDirection] = useState('asc');
    // const [favorite, setFavorite] = useState([]);
    const [activeTab, setActiveTab] = useState('VNDC');
    const [search, setSearch] = useState('');
    const [filteredSymbolList, setFilteredSymbolList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ name: t('common:all'), value: CATEGORY_SPOT_SIGNAL.ALL });
    const [signals, setSignals] = useState([]);
    const [filteredSignals, setFilteredSignals] = useState([]);

    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const user = useSelector(state => state.auth.user) || null;

    useAsync(async () => {
        const result = await getMarketWatch();
        setSymbolList(result);
    }, []);

    useInterval(async () => {
        const result = await getMarketWatch();
        setSymbolList(result);
    }, 5000);

    useEffect(() => {
        if (symbolList && symbolList.length) {
            let filterSymbols = [];

            if (selectedCategory.value === CATEGORY_SPOT_SIGNAL.ALL) {
                symbolList.forEach(sym => {
                    const {
                        'q': quoteAsset,
                        'b': baseAsset,
                    } = sym;
                    if (!(quoteAsset && baseAsset)) return null;
                    if (typeof search === 'string' && search.length) {
                        if (quoteAsset === activeTab
                        && baseAsset.toLowerCase().includes(search.toLowerCase())) {
                            filterSymbols.push(sym);
                        }
                    } else {
                        if (quoteAsset === activeTab) {
                            filterSymbols.push(sym);
                        }
                    }
                });
            } else if (selectedCategory.value === CATEGORY_SPOT_SIGNAL.SIGNAL) {
                if (typeof search === 'string' && search.length) {
                    // console.log(search, signals);
                    const filteredSignal = signals.filter(signal => signal?.metadata?.baseAsset.toLowerCase().includes(search.toLowerCase()));
                    setFilteredSignals(filteredSignal);
                    setHasMoreSignalPage(filteredSignal.length > 0);
                } else {
                    setFilteredSignals(signals);
                    setHasMoreSignalPage(true);
                }
            } else if (selectedCategory?.assets && selectedCategory?.assets.length > 0) {
                selectedCategory?.assets.forEach(asset => {
                    symbolList.forEach(sym => {
                        const {
                            'q': quoteAsset,
                            'b': baseAsset,
                        } = sym;
                        if (!(quoteAsset && baseAsset)) return null;
                        if (quoteAsset === activeTab
                                && baseAsset.toLowerCase().includes(asset.toLowerCase())) {
                            filterSymbols.push(sym);
                        }
                    });
                });
            }
            filterSymbols = compact(filterSymbols);

            if (sortField === 'p' || sortField === 'change24h') {
                // sort khong can quan tam favorite
                filterSymbols = orderBy(filterSymbols, [
                    item => item,
                    // ...sortField && sortField === 'b' ? [item => item[sortField].toLowerCase().charAt(0)] : [],
                    ...sortField && sortField === 'p' ? [item => +item.p] : [],
                    ...sortField && sortField === 'change24h' ? [item => getExchange24hPercentageChange(item)] : [],
                ], [
                    'desc',
                    ...sortField ? [sortDirection] : ['desc'],
                ]);
            } else {
                // Sap xep favorite len dau
                filterSymbols = orderBy(filterSymbols, [
                    item => favorite && favorite.length && favorite.includes(item.b),
                    ...sortField && sortField === 'b' ? [item => item[sortField].toLowerCase().charAt(0)] : [],
                    // ...sortField && sortField === 'p' ? [item => +item.p] : [],
                    // ...sortField && sortField === 'change24h' ? [item => { return getExchange24hPercentageChange(item)}] : [],
                ], [
                    'desc',
                    ...sortField ? [sortDirection] : ['desc'],
                ]);
            }
            setFilteredSymbolList(filterSymbols);
        }
    }, [symbolList, search, activeTab, favorite, sortDirection, selectedCategory, sortField]);

    const SortIcon = ({ direction }) => {
        return (
            <div className={`transform ${direction === 'asc' ? 'rotate-180' : ''}`}>
                <IconSort />
            </div>
        );
    };

    const renderList = useCallback(() => {
        return (
            <>
                <div className="ats-tbheader px-3">
                    <div className="flex justify-between items-center mb-3">
                        <div
                            className="flex flex-1 items-center justify-start text-black-600 text-xs font-semibold cursor-pointer select-none"
                            onClick={() => {
                                setSortField('b');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div
                                className="mr-1"
                            >{t('common:asset')}
                            </div>
                            {
                                sortField === 'b'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort />
                            }
                        </div>
                        <div
                            className="flex flex-1 items-center justify-end text-black-600 text-xs font-semibold cursor-pointer select-none"
                            onClick={() => {
                                setSortField('p');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div className="mr-1">{t('common:price')}</div>
                            {
                                sortField === 'p'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort />
                            }
                        </div>
                        <div
                            className="flex flex-1 items-center justify-end text-black-600 text-xs font-semibold cursor-pointer select-none"
                            onClick={() => {
                                setSortField('change24h');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div className="mr-1">{t('common:change')}</div>
                            {
                                sortField === 'change24h'
                                    ? <SortIcon direction={sortDirection} />
                                    : <IconNoSort />
                            }
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(100%-6rem)]">
                    {/* <div className="overflow-y-scroll"> */}
                    {filteredSymbolList.map((ticker, index) => {
                        return (
                            <Fragment
                                key={`${search}_${activeTab}_${ticker.b}}`}
                            >
                                <SymbolListItem
                                    changeSymbolList={changeSymbolList}
                                    exchangeConfig={exchangeConfig}
                                    favorite={favorite}
                                    symbolString={ticker?.s}
                                    publicSocket={publicSocket}
                                    currentId={query?.id}
                                    originTicker={ticker}
                                    watchList={watchList}
                                />
                            </Fragment>
                        );
                    })}
                </div>
            </>
        );
    }, [filteredSymbolList, selectedCategory, filteredSignals, query]);

    return (
        <>
            <div
                className="spot-symbol-list__container- bg-bgContainer dark:bg-bgContainer-dark rounded py-6 h-full transition-all	duration-700 ease-in"
            >
                <>
                    <div className="mx-3 mb-3">
                        <SearchInput
                            placeholder={t('spot:search')}
                            onChange={(e) => setSearch(e.target.value)}
                            customStyle={{ height: '30px' }}
                        />
                    </div>

                    <div className="mx-3 mb-3 flex items-center">

                        <div
                            className={'w-12 h-[23px] flex justify-center items-center text-sm mx-1 border cursor-pointer ' + (activeTab === 'favorite' ? 'active text-mint border-mint' : 'text-black-400 border-black-400')}
                            onClick={() => setActiveTab('favorite')}
                        >
                            <IconStarFilled size={14} color={activeTab === 'favorite' ? '#09becf' : '#C5C6D2'} />
                        </div>

                        <a
                            className={'w-12 text-sm text-center mx-1 font-bold border   cursor-pointer ' + (activeTab === 'VNDC' ? 'active text-mint border-mint' : 'text-black-400 border-black-400')}
                            onClick={() => setActiveTab('VNDC')}
                        > VNDC
                        </a>
                        <a
                            className={'w-12 text-sm text-center mx-1 font-bold border   cursor-pointer ' + (activeTab === 'USDT' ? 'active text-mint border-mint' : 'text-black-400 border-black-400')}
                            onClick={() => setActiveTab('USDT')}
                        > USDT
                        </a>
                    </div>
                    {renderList()}
                </>

            </div>
        </>
    );
};

export default SymbolList;
