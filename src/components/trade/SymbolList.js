import { Menu, Transition } from '@headlessui/react';
import compact from 'lodash/compact';
import orderBy from 'lodash/orderBy';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { ChevronsLeft, ChevronsRight } from 'react-feather';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';
import { useAsync, useInterval, useLocalStorage } from 'react-use';
import { CATEGORY_SPOT_SIGNAL, LS_KEYS } from 'src/redux/actions/const';
import { getCategoryList, getMarketWatch } from 'src/redux/actions/market';
import { getSignalNotification } from 'src/redux/actions/signal';
import { getS3Url, getExchange24hPercentageChange } from 'src/redux/actions/utils';
import { iconColor400 } from 'src/config/colors';

import { IconArrowDown, IconBell, IconLoading, IconSort, IconStar, IconStarFilled } from 'src/components/common/Icons';
import SymbolListItem from 'src/components/markets/SymbolListItem';
import SignalMessage from 'src/components/trade/SignalMessage';

const SymbolList = (props) => {
    const { query } = useRouter();
    const { t } = useTranslation();
    const { parentCallback, publicSocket, changeSymbolList, favorite, watchList, symbol, handleChangeSymbol } = props;
    // const [isOnSidebar, setIsOnSidebar] = useState(false);
    const [isOnSidebar, setIsOnSidebar] = useLocalStorage(LS_KEYS.SPOT_ON_SIDEBAR, 'false');
    const [symbolList, setSymbolList] = useState([]);
    const [sortField, setSortField] = useState();
    const [sortDirection, setSortDirection] = useState('asc');
    // const [favorite, setFavorite] = useState([]);
    const [activeTab, setActiveTab] = useState('VNDC');
    const [search, setSearch] = useState('');
    const [categoryList, setCategoryList] = useState([]);
    const [filteredSymbolList, setFilteredSymbolList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ name: t('common:all'), value: CATEGORY_SPOT_SIGNAL.ALL });
    const [signals, setSignals] = useState([]);
    const [filteredSignals, setFilteredSignals] = useState([]);
    const [isLoadingSignals, setIsLoadingSignals] = useState(true);
    const [currentSignalPage, setCurrentSignalPage] = useState(1);
    const [hasMoreSignalPage, setHasMoreSignalPage] = useState(true);

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

    useAsync(async () => {
        if (user) {
            const category = await getCategoryList();
            if (category && category.length > 0) {
                const filteredList = category.filter(cat => cat.type === 'USER');
                const allAsset = {
                    name: t('common:all'),
                    value: CATEGORY_SPOT_SIGNAL.ALL,
                };
                const signal = {
                    name: t('navbar:menu_grid.signals'),
                    avatar: '',
                    value: CATEGORY_SPOT_SIGNAL.SIGNAL,
                };
                filteredList.unshift(allAsset);
                filteredList.push(signal);
                setCategoryList(filteredList);
            }
        }
    }, [user]);

    // const getIsOnSidebar = () => {
    //     const _value = localStorage.getItem('spot:isOnSidebar');
    //     return _value && _value === 'true';
    // };
    //
    // useEffect(() => {
    //     setIsOnSidebar(!!getIsOnSidebar());
    // }, []);
    useEffect(() => {
        if (isOnSidebar) {
            parentCallback(isOnSidebar);
        }
    }, [isOnSidebar]);

    const fetchSignalNotification = async () => {
        setIsLoadingSignals(true);
        const result = await getSignalNotification({ asset: symbol.base, page: currentSignalPage });
        if (result?.histories && result?.histories.length > 0) {
            setCurrentSignalPage(currentSignalPage + 1);
            setSignals([...signals, ...result?.histories]);
            setFilteredSignals([...filteredSignals, ...result?.histories]);
        } else {
            setHasMoreSignalPage(false);
        }
        setIsLoadingSignals(false);
    };

    useEffect(() => {
        if (selectedCategory.value === CATEGORY_SPOT_SIGNAL.SIGNAL) {
            fetchSignalNotification();
            setCurrentSignalPage(currentSignalPage + 1);
        }
    }, [selectedCategory]);

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

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    const renderSelectCategory = useCallback(() => {
        return (
            <Menu as="div" className="relative inline-block">
                <p>
                    <Menu.Button className="text-lg font-bold inline-flex items-center text-left">
                        <span>{selectedCategory.value === CATEGORY_SPOT_SIGNAL.SIGNAL ? t('navbar:menu_grid.signals') : t('spot:assets_list') }</span>
                        <div className="ml-[6px]">
                            <IconArrowDown />
                        </div>
                    </Menu.Button>
                </p>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md focus:outline-none" style={{ boxShadow: '0px 16px 24px rgba(7, 12, 61, 0.04)' }}>
                        {
                            categoryList.map((category, index) => {
                                return (
                                    <Menu.Item key={index}>
                                        {({ active }) => (
                                            <button
                                                type="button"
                                                className={`${
                                                    active ? 'bg-violet-500 text-white' : 'text-[#52535C]'
                                                } group flex rounded-md items-center w-full px-6 h-14 box-border text-sm`}
                                                onClick={() => handleSelectCategory(category)}
                                            >
                                                {category.value === CATEGORY_SPOT_SIGNAL.SIGNAL && <div className="text-[#4021D0] w-8 min-w-[32px] h-8 rounded-full bg-[#EEF2FA] flex items-center justify-center"><IconBell /></div> }
                                                {category?.avatar && <img src={getS3Url(category?.avatar)} alt="avatar" width={32} height={32} className="rounded-full" />} <span style={{ fontWeight: 500 }} className="ml-2 w-full text-left truncate">{category?.name}</span>
                                            </button>
                                        )}
                                    </Menu.Item>
                                );
                            })
                        }
                    </Menu.Items>
                </Transition>
            </Menu>
        );
    }, [categoryList, selectedCategory]);

    const renderList = useCallback(() => {
        if (selectedCategory.value === CATEGORY_SPOT_SIGNAL.SIGNAL) {
            return (
                <div
                    className="overflow-y-scroll overflow-x-hidden max-h-[calc(100%-10rem)] -mt-2"
                    id="scrollableDiv"
                >
                    <InfiniteScroll
                        dataLength={filteredSignals.length} // This is important field to render the next data
                        next={fetchSignalNotification}
                        hasMore={hasMoreSignalPage}
                        loader={<div className="flex items-center justify-center h-6"><IconLoading color="#4021D0" /></div>}
                        endMessage={null}
                        scrollableTarget="scrollableDiv"
                        scrollThreshold="10px"
                        className="!overflow-y-hidden"
                    >
                        {
                            filteredSignals.map((signal, index) => ((
                                <Fragment key={index}>
                                    <SignalMessage filteredSignals={filteredSignals} signal={signal} handleChangeSymbol={handleChangeSymbol} signalIndex={index} />
                                </Fragment>
                            )))
                        }
                    </InfiniteScroll>
                </div>
            );
        }
        return (
            <>
                <div className="ats-tbheader px-3">
                    <div className="flex justify-between items-center mb-3">
                        <div
                            className="flex flex-1 items-center justify-start text-black-500 text-xs font-medium cursor-pointer select-none"
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
                                sortField === 'b' && <SortIcon direction={sortDirection} />
                            }
                        </div>
                        <div
                            className="flex flex-1 items-center justify-end text-black-500 text-xs font-medium cursor-pointer select-none"
                            onClick={() => {
                                setSortField('p');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div className="mr-1">{t('common:price')}</div>
                            {
                                sortField === 'p' && <SortIcon direction={sortDirection} />
                            }
                        </div>
                        <div
                            className="flex flex-1 items-center justify-end text-black-500 text-xs font-medium cursor-pointer select-none"
                            onClick={() => {
                                setSortField('change24h');
                                setSortDirection(value => (value === 'asc' ? 'desc' : 'asc'));
                            }}
                        >
                            <div className="mr-1">{t('common:change')}</div>
                            {
                                sortField === 'change24h' && <SortIcon direction={sortDirection} />
                            }
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[calc(100%-14rem)]">
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
                {isOnSidebar === 'true' ?
                    <>
                        <h3 className="font-semibold text-lg text-black mb-4 px-3 flex items-center justify-between">
                            {renderSelectCategory()}
                            <button
                                className="btn btn-icon"
                                type="button"
                                onClick={() => {
                                    setIsOnSidebar('false');
                                }}
                            >
                                <ChevronsLeft color={iconColor400} size={24} />
                            </button>
                        </h3>
                        <div className="px-3">
                            <input
                                className="border border-gray-200 bg-white w-full h-11 px-4 py-3 rounded-md text-sm focus:outline-none mb-4"
                                type="text"
                                name="search"
                                placeholder={t('spot:search')}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <ul className="tabs justify-around mb-6">
                            <li className="tab-item flex-1">
                                <a
                                    className={'tab-link font-semibold ' + (activeTab === 'VNDC' ? 'active text-black-700' : 'text-black-400')}
                                    onClick={() => setActiveTab('VNDC')}
                                > VNDC
                                </a>
                            </li>
                            <li className="tab-item flex-1">
                                <a
                                    className={'tab-link font-semibold ' + (activeTab === 'USDT' ? 'active text-black-700' : 'text-black-400')}
                                    onClick={() => setActiveTab('USDT')}
                                > USDT
                                </a>
                            </li>
                        </ul>
                        {renderList()}
                    </> :
                    <>
                        <button
                            className="btn btn-icon mb-6"
                            type="button"
                            onClick={() => {
                                setIsOnSidebar('true');
                            }}
                        >
                            <ChevronsRight color={iconColor400} size={24} />
                        </button>
                        <h3 className="text-sm text-black-500 mb-3 px-1.5 flex items-center">
                            <span className="">{t('common:assets')}</span>
                            {/* <IconStarFilled /> */}
                        </h3>
                        <div className="overflow-y-auto max-h-[calc(100%-5rem)]">
                            {filteredSymbolList.map((order, index) => {
                                const {
                                    'b': baseAsset,
                                    's': symbol,
                                    'q': quoteAsset,
                                } = order;
                                const isFavorite = favorite && favorite.length && favorite.includes(baseAsset);
                                return (
                                    <Link href={`/spot/${baseAsset}_${quoteAsset}`} key={index} prefetch={false} shallow>
                                        <div className="flex py-0 cursor-pointer hover:bg-blue-50" key={symbol}>
                                            <div
                                                className={`flex-1 text-xs font-medium leading-table flex items-center py-1 px-1.5 clickable ${query?.id === `${baseAsset}_${quoteAsset}` ? 'bg-black-200' : ''}`}
                                            >
                                                {isFavorite ? <IconStarFilled size={12} /> : <IconStar size={12} />}
                                                <div className="ml-1 2xl:ml-1.5">{baseAsset}</div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>}
            </div>
        </>
    );
};

export default SymbolList;
