import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import Link from 'next/link';
import AssetLogo from 'components/wallet/AssetLogo';
import MarketLabel from 'components/common/MarketLabel';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import Skeletor from 'components/common/Skeletor';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    formatCurrency,
    formatPrice,
    getExchange24hPercentageChange,
    getV1Url,
    render24hChange
} from 'redux/actions/utils';
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
import { ScaleLoader } from 'react-spinners';
import NoData from 'components/common/V2/TableV2/NoData';
import InputV2 from 'components/common/V2/InputV2';
import axios from 'axios';
import { API_GET_FAVORITE } from 'redux/actions/apis';
import toast from 'utils/toast';
import Spinner from 'components/svg/Spinner';
import TableV2 from 'components/common/V2/TableV2';
import FuturesLeverage from 'components/common/FuturesLeverage';

const MARKET_ROW_LIMIT = 20;

const MarketTable = ({
    loading,
    data = [],
    parentState,
    ...restProps
}) => {
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
    const isMobile = width < 640;
    const [isLoading, setIsLoading] = useState(false)
    const [mobileLimit, setMobileLimit] = useState(15)

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
            id: 'NEW_LISTING',
            content: {
                vi: 'Mới niêm yết',
                en: 'New Listing'
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
            id: 'TOP_LOSER',
            content: {
                vi: 'Giảm giá',
                en: 'Top loser'
            }
        }
    ];

    useEffect(() => {
        setType(restProps.type);
    }, [restProps.type]);

    useEffect(() => {
        setMobileLimit(15)
    }, [restProps?.tabIndex, restProps?.subTabIndex, restProps?.favType])

    useEffect(() => {
        if (!restProps.search?.length || restProps.tabIndex !== 0) return
        parentState({ tabIndex: 1, type: 0 })
    }, [restProps.search])

    // Render Handler
    const renderTab = useCallback(() => {
        return tab.map((item, index) => {
            const label = restProps?.tabLabelCount ? restProps.tabLabelCount?.[item.key] : null
            return (
                <div
                    key={item.key}
                    onClick={() =>
                        parentState({
                            tabIndex: index,
                            // subTabIndex: item.key === 'favorite' ? 0 : 1,
                            currentPage: 1,
                            type: item.key === 'favorite' ? 1 : 0
                        })
                    }
                    className={classNames(
                        'relative mr-6 pb-4 capitalize select-none text-tiny sm:text-base cursor-pointer flex items-center',
                        {
                            'text-txtPrimary dark:text-txtPrimary-dark font-semibold': restProps.tabIndex === index,
                            'text-txtSecondary dark:text-txtSecondary-dark font-normal': restProps.tabIndex !== index,
                        }
                    )}
                >
                    <span className={item.key === 'favorite' ? 'ml-2' : ''}>
                        {item.localized ? t(item.localized) : item.key} {label ? `(${label})` : null}
                    </span>
                    {restProps.tabIndex === index &&
                        <div className="absolute left-1/2 bottom-0 w-[40px] h-[2px] bg-dominant -translate-x-1/2" />}
                </div>);
        });
    }, [currentTheme, restProps.tabIndex, restProps.tabLabelCount]);

    const renderSubTab = useCallback(() => {
        return subTab.map((item, index) => {
            return (
                <div key={item.key}
                    onClick={() => parentState({
                        subTabIndex: index,
                        currentPage: 1
                    })}
                    className={classNames('h-[44px] flex items-center text-sm sm:text-base px-4 cursor-pointer select-none', {
                        'font-semibold dark:text-txtPrimary-dark text-txtPrimary bg-bgSegmentActive dark:bg-bgSegmentActive-dark': restProps.subTabIndex === index,
                        'font-normal bg-bgSegmentInactive dark:bg-bgSegmentInactive-dark dark:text-txtSecondary-dark text-txtSecondary': restProps.subTabIndex !== index,
                        'border-r border-divider dark:border-divider-dark': index === 0
                    })}
                >
                    {item.localized ? t(item.localized) : <span className="uppercase">{item.key}</span>}
                </div>
            );
        });
    }, [restProps.subTabIndex, restProps.tabIndex]);

    const renderSuggested = useMemo(() => {
        const tradingMode = restProps?.favType + 1;
        const suggestionContent = {
            vi: "Bắt đầu xây dựng danh sách yêu thích với những cặp giao dịch phổ biến ngay bây giờ!",
            en: 'Start building your favorites list with popular trading pairs now!'
        }
        return <div className="px-0 sm:px-8 pb-4">
            <div className="text-base text-darkBlue-5 font-normal mb-6">
                {suggestionContent[language]}
            </div>
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6">
                {restProps?.suggestedSymbols?.map(symbol => {
                    const symbolLeverageConfig = tradingMode === TRADING_MODE.FUTURES ? restProps?.futuresConfigs?.find(e => e?.pair == symbol?.s)?.leverageConfig : null;
                    const leverage = symbolLeverageConfig ? (symbolLeverageConfig?.max ?? 0) : null;
                    return (
                        <div className="w-full p-3  bg-[#F2F4F5] dark:bg-bgContainer-dark  rounded-md" key={symbol.s}>
                            {leverage ? <div><FuturesLeverage value={leverage} className='sm:hidden block w-fit mb-3' /></div> : null}
                            <div className="flex justify-between w-full">
                                <div className="">
                                    <div className="flex space-x-3 items-center">
                                        <div className="font-medium text-base">
                                            <span className="text-txtPrimary dark:text-txtPrimary-dark">{symbol?.b}</span><span className="text-txtSecondary dark:text-txtSecondary-dark">/{symbol?.q}</span>
                                        </div>
                                        {leverage ? <FuturesLeverage value={leverage} className='sm:block hidden' /> : null}
                                    </div>
                                    <div className={classNames('font-normal text-sm justify-start', {
                                        'text-red': !symbol.u,
                                        'text-teal': symbol.u
                                    })}>
                                        {formatPrice(symbol.p)}
                                    </div>
                                </div>
                                <div className="cursor-pointer">
                                    <FavActionButton b={{
                                        b: symbol.b,
                                        i: symbol.bi
                                    }}
                                        q={{
                                            q: symbol.q,
                                            i: symbol.qi
                                        }}
                                        list={restProps.favoriteList}
                                        lang={language}
                                        mode={tradingMode} favoriteRefresher={restProps.favoriteRefresher}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row font-normal text-xs sm:gap-2">
                                <div className="w-full">
                                    <div className="w-fit font-medium text-base">
                                        {render24hChange(symbol, false, '!font-semibold !text-base')}
                                    </div>
                                    <div className="mt-2 leading-4 hidden sm:block">
                                        {t('futures:24h_high')}: {formatPrice(symbol.h)}
                                    </div>
                                    <div className="leading-4 hidden sm:block">
                                        {t('futures:24h_low')}: {formatPrice(symbol.l)}
                                    </div>
                                </div>
                                <div className="h-full sm:w-1/2 w-full flex justify-center sm:justify-end">
                                    <img src={sparkLineBuilder(symbol?.s, symbol.u ? colors.teal : colors.red2)}
                                        alt="Nami Exchange" className='w-full' />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>;
    }, [restProps?.suggestedSymbols, restProps?.favType, restProps?.futuresConfigs]);

    const renderTable = useCallback(() => {
        let modifyColumns = [];
        const translater = (key) => {
            switch (key) {
                case 'pair':
                    return language === 'vi' ? 'Cặp' : 'Pair';
                case 'last_price':
                    return language === 'vi' ? 'Giá gần nhất' : 'Last Price';
                case 'change_24h':
                    return language === 'vi' ? 'Biến động 24h' : '24h Change';
                case 'market_cap':
                    return language === 'vi' ? 'Market Cap' : 'Market Cap';
                case 'volume_24h':
                    return language === 'vi' ? 'Khối lượng 24h' : 'Volume 24h';
                case '24h_high':
                    return language === 'vi' ? 'Cao nhất 24h' : '24h High';
                case '24h_low':
                    return language === 'vi' ? 'Thấp nhất 24h' : '24h Low';
                case 'mini_chart':
                    return language === 'vi' ? 'Biểu đồ' : 'Chart';
                default:
                    return null;
            }
        };

        let pairColumnsWidth = 228;
        let starColumnWidth = 64;

        if (!data?.length) pairColumnsWidth = 128;

        // Hide star button if user not found

        //
        let tradingMode = TRADING_MODE.EXCHANGE;

        if (tab[restProps.tabIndex]?.key === 'favorite') {
            if (favSubTab[restProps.favType]?.key === 'futures') {
                tradingMode = TRADING_MODE.FUTURES;
            } else {
                tradingMode = TRADING_MODE.EXCHANGE;
            }
            if (!auth) {
                return <div className='my-8'>
                    <NoData />
                </div>
            }
            if (!data?.length) {
                return renderSuggested
            }
        }

        // only show market cap col for exchange tab
        if (tab[restProps.tabIndex]?.key === 'futures') {
            remove(modifyColumns, o => o.key === 'market_cap');
            tradingMode = TRADING_MODE.FUTURES;
        }

        if (isMobile) {
            if (!data?.length) {
                return (
                    <div className='my-8'>
                        <NoData isSearch={!!restProps.search} />
                    </div>
                )
            }
            const dataSource = dataHandler(data, language, width, tradingMode, restProps.favoriteList, restProps.favoriteRefresher, loading, auth, restProps?.futuresConfigs)

            return <div className='w-full overflow-auto'>
                <div className='min-w-full w-max flex flex-col justify-center items-stretch'>
                    {dataSource.slice(0, mobileLimit).map((e, index) => {
                        const basedata = data?.[index]
                        return (
                            <div className={classNames('w-full flex flex-1 justify-between items-center font-normal text-xs gap-2', { '': index !== 0, '': index === 0 })}>
                                <div className='w-full flex flex-col justify-center items-start'>
                                    {index === 0 ? <div className='mb-4'>{translater('pair')} / {translater('volume_24h')} </div> : null}
                                    <div className='flex h-[64px] items-center gap-4'>
                                        {e.star}
                                        <div className='flex flex-col justify-center'>
                                            {e.pair}
                                            <span>{t('common:vol')} {e.volume_24h}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col justify-center items-end'>
                                    {index === 0 ? <div className='mb-4'>{translater('last_price')}</div> : null}
                                    <div className='flex flex-col justify-center items-end h-[64px] gap-1'>
                                        <div className='font-semibold text-sm text-txtPrimary dark:text-txtPrimary-dark'>
                                            {e.last_price}
                                        </div>
                                        <div>
                                            ${formatPrice(basedata?.q === 'VNDC' ? basedata?.p / 23415 : restProps.referencePrice[`${basedata?.q}/USD`] * basedata?.p, 4)}
                                        </div>
                                    </div>
                                </div>
                                <div className='min-w-[94px] flex flex-col justify-center items-end'>
                                    {index === 0 ? <div className='mb-4'>{translater('change_24h')}</div> : null}
                                    <div className='flex h-[64px] items-center w-full justify-end'>
                                        <div className={classNames('h-9 border flex items-center justify-center rounded-[3px] w-full max-w-[74px]', {
                                            'dark:border-teal border-bgBtnV2': getExchange24hPercentageChange(basedata) >= 0,
                                            'dark:border-red border-red-lightRed': getExchange24hPercentageChange(basedata) < 0,
                                            'border-none !justify-end': !getExchange24hPercentageChange(basedata),
                                        })}>
                                            {e.change_24h}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        }

        const columns = [
            {
                key: 'star',
                fixed: 'left',
                align: 'left',
                width: starColumnWidth,
                sortable: true,
                visibile: auth,
                render: (_row, item) => {
                    const {
                        baseAsset,
                        baseAssetId,
                        quoteAsset,
                        quoteAssetId,
                    } = initMarketWatchItem(item);
                    return auth ? <FavActionButton
                        b={{
                            b: baseAsset,
                            i: baseAssetId
                        }}
                        q={{
                            q: quoteAsset,
                            i: quoteAssetId
                        }}
                        list={restProps.favoriteList}
                        lang={language}
                        mode={tradingMode}
                        favoriteRefresher={restProps.favoriteRefresher}
                    /> : null
                },
            },
            {
                key: 's',
                dataIndex: 's',
                title: translater('pair'),
                fixed: 'left',
                align: 'left',
                sortable: true,
                width: pairColumnsWidth,
                render: (_row, item) => {
                    return renderPair(item.b, item.q, item.lbl, width, tradingMode, language, restProps.futuresConfigs)
                },
            },
            {
                key: 'p',
                dataIndex: 'p',
                title: translater('last_price'),
                align: 'right',
                width: 168,
                sortable: true,
                render: (row, item) => <div>
                    <div className="whitespace-nowrap">{formatPrice(row)}</div>
                    <div className='text-txtSecondary dark:text-txtSecondary-dark font-normal text-xs'>${formatPrice(item?.q === 'VNDC' ? item?.p / 23415 : restProps.referencePrice[`${item?.q}/USD`] * item?.p, 4)}</div>
                </div>
            },
            {
                key: 'change_24h',
                title: translater('change_24h'),
                align: 'right',
                width: 168,
                sortable: false,
                render: (_row, item) => render24hChange(item, false, 'justify-end !text-base !font-normal'),
                sorter: (a, b) => {
                    const change24hA = getExchange24hPercentageChange(a);
                    const change24hB = getExchange24hPercentageChange(b);
                    return change24hA - change24hB;
                }
            },
            {
                key: 'vq',
                dataIndex: 'vq',
                title: translater('volume_24h'),
                align: 'right',
                width: 168,
                sortable: true,
                render: (row) => <span className="whitespace-nowrap">{formatCurrency(row, 0)}</span>
            },
            {
                key: 'h',
                dataIndex: 'h',
                title: translater('24h_high'),
                align: 'right',
                width: 168,
                sortable: true,
                render: (row) => <span className="whitespace-nowrap">{formatPrice(row, row < 1000 ? 2 : 0)}</span>
            },
            {
                key: 'l',
                dataIndex: 'l',
                title: translater('24h_low'),
                align: 'right',
                width: 168,
                sortable: true,
                render: (row) => <span className="whitespace-nowrap">{formatPrice(row, row < 1000 ? 2 : 0)}</span>
            },
            {
                key: 'operation',
                dataIndex: 'operation',
                align: 'center',
                width: (restProps.tabIndex === 1 || (restProps.tabIndex === 0 && restProps.favType === 0)) ? 224 : 164,
                render: (_row, item) => renderTradeLink(item.b, item.q, language, tradingMode)
            },
        ];

        return (
            <TableV2
                data={loading ? [] : data}
                sort
                isSearch={restProps?.search?.length}
                // defaultSort={{ key: 's', direction: 'asc' }}
                loading={loading}
                columns={columns}
                page={restProps.currentPage}
                limit={MARKET_ROW_LIMIT}
                total={data?.length ?? 0}
                scroll={{ x: true }}
                showPaging={false}
                height={'300px'}
                tableStyle={{
                    padding: '20px 16px',
                    headerStyle: {
                        padding: '0px'
                    },
                    fontSize: '16px !important',
                }}
                sorted={restProps.type !== 0}
                cbSort={(e) => parentState({ type: 0 })}
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
        isMobile,
        mobileLimit
    ])

    const renderPagination = useCallback(() => {
        let tradingMode = TRADING_MODE.EXCHANGE;

        if (tab[restProps.tabIndex]?.key === 'favorite') {
            if (favSubTab[restProps.subTabIndex]?.key === 'futures') {
                tradingMode = TRADING_MODE.FUTURES;
            } else {
                tradingMode = TRADING_MODE.EXCHANGE;
            }
        }

        const total = dataHandler(data, language, width, tradingMode)?.length;

        if (total <= MARKET_ROW_LIMIT || total <= mobileLimit) return null

        if (isMobile) {
            return (
                <div className='text-txtTextBtn dark:text-teal font-semibold text-sm cursor-pointer w-full text-center mt-6'
                    onClick={() => setMobileLimit(mobileLimit + 15)}
                >
                    {t('common:read_more')}
                </div>
            )
        }

        return (
            <div className="my-3 sm:my-5 flex items-center justify-center">
                <RePagination
                    isNamiV2
                    pagingPrevNext={{
                        language,
                        page: restProps.currentPage - 1,
                        hasNext: (restProps.currentPage * MARKET_ROW_LIMIT) < total,
                        onChangeNextPrev: (change) => parentState({ currentPage: restProps.currentPage + change })
                    }}
                />
            </div>
        )
    }, [data, language, restProps.currentPage, restProps.tabIndex, restProps.subTabIndex, isMobile])

    return (
        <div className="px-4 sm:px-0 text-darkBlue-5">
            <div className="w-full sm:w-auto flex flex-col justify-start sm:justify-between sm:flex-row sm:items-center sm-6 sm:mb-8">
                <div
                    className="text-txtPrimary dark:text-txtPrimary-dark font-semibold text-xl sm:text-[32px] sm:leading-[38px] mb-6 sm:mb-0">
                    {t('common:market')}
                </div>
                <div
                    className="flex flex-row-reverse sm:flex-row items-center sm:space-x-4 justify-between sm:justify-end">
                    <div
                        className="flex items-center border border-divider dark:border-divider-dark overflow-hidden rounded-md">
                        {renderSubTab()}
                    </div>
                    <div className="w-[calc(100vw-196px)] sm:w-[368px]">
                        <InputV2
                            value={restProps.search}
                            onChange={(value) => parentState({ search: value })}
                            placeholder={t('common:search')}
                            prefix={(<Search color={colors.darkBlue5} size={16} />)}
                            className='pb-0 w-full'
                        />
                    </div>
                </div>
            </div>
            <div id="market_table___list" className="py-4 h-full rounded-xl sm:border-[1px] border-divider dark:border-divider-dark">
                <div
                    className="mt-[20px] flex items-center overflow-auto sm:px-8 border-b-[1px] border-divider dark:border-divider-dark">
                    {renderTab()}
                </div>
                {restProps.auth || tab[restProps.tabIndex]?.key !== 'favorite' ?
                    <div className={classNames(
                        'py-8 sm:py-6 border-divider dark:border-divider-dark flex items-center sm:px-8 justify-between flex-wrap',
                        { 'sm:border-b-[1px]': tab[restProps.tabIndex]?.key !== 'favorite' })
                    }>
                        {tab[restProps.tabIndex]?.key === 'favorite' ?
                            <TokenTypes type={restProps.favType} setType={(index) => {
                                parentState({ favType: index });
                            }} types={[{
                                id: 0,
                                content: {
                                    vi: 'Exchange',
                                    en: 'Exchange'
                                }
                            }, {
                                id: 1,
                                content: {
                                    vi: 'Futures',
                                    en: 'Futures'
                                }
                            }]} lang={language} />
                            :
                            isMobile ?
                                <div className='space-y-4 w-full'>
                                    <TokenTypes type={type} setType={(index) => {
                                        parentState({
                                            type: index
                                        })
                                    }} types={types.slice(0, 2)} lang={language} className='w-full !justify-between !flex-1' />
                                    <TokenTypes type={type} setType={(index) => {
                                        parentState({
                                            type: index
                                        })
                                    }} types={types.slice(2, 6)} lang={language} className='w-full !justify-between !flex-1' />
                                </div>
                                :
                                <TokenTypes type={type} setType={(index) => {
                                    parentState({
                                        type: index
                                    })
                                }} types={types} lang={language} />}

                        {tab[restProps.tabIndex]?.key === 'favorite' && !data?.length ?
                            <div
                                className={classNames("h-10 px-4 sm:h-12 sm:px-6 hidden sm:flex justify-center items-center bg-teal rounded-md text-white text-base font-medium cursor-pointer", {
                                    'w-[164px]': language === 'vi',
                                    'w-[124px]': language !== 'vi'
                                })}
                                onClick={async () => {
                                    if (isLoading) return
                                    await addTokensToFav({
                                        symbols: restProps?.favType + 1 === 1  ? restProps?.suggestedSymbols?.map(e => {
                                            const pairConfig = restProps.futuresConfigs.find(config => config.pair == (e.b + e.q))
                                            return pairConfig?.baseAssetId + '_' + pairConfig?.quoteAssetId
                                        }) : restProps?.suggestedSymbols?.map(e => e.b + '_' + e.q),
                                        lang: language,
                                        mode: restProps?.favType + 1,
                                        favoriteRefresher: restProps.favoriteRefresher,
                                        setIsLoading: setIsLoading
                                    })
                                }}
                            >
                                {isLoading ? <Spinner size={24} /> : {
                                    en: 'Select all',
                                    vi: 'Chọn tất cả'
                                }[language]}
                            </div>
                            :
                            null}

                    </div> : null}
                {renderTable()}
                <div className="sm:px-8">
                    {renderPagination()}
                </div>
            </div>
        </div>
    );
};

export const tab = [
    {
        key: 'favorite',
        localized: 'markets:favourite'
    },
    {
        key: 'exchange',
        localized: null
    },
    {
        key: 'futures',
        localized: null
    },
    // { key: 'zones', localized: null }
];

export const subTab = [
    // { key: 'all', localized: 'common:all' },
    {
        key: 'usdt',
        localized: null
    },
    {
        key: 'vndc',
        localized: null
    }
];

export const favSubTab = [
    {
        key: 'exchange',
        localized: null
    },
    {
        key: 'futures',
        localized: null
    }
];

const dataHandler = (arr, lang, screenWidth, mode, favoriteList = {}, favoriteRefresher, isLoading = false, isAuth, futuresConfigs) => {
    if (isLoading) {
        const loadingSkeleton = [];

        for (let i = 0; i < 15; ++i) {
            loadingSkeleton.push({
                ...ROW_LOADING_SKELETON,
                key: `market_loading__skeleton_${i}`
            });
        }
        return loadingSkeleton;
    }

    if (!Array.isArray(arr) || !arr || !arr.length) return [];

    const result = [];

    arr.forEach(item => {
        const {
            baseAsset,
            baseAssetId,
            quoteAsset,
            quoteAssetId,
            lastPrice,
            volume24h,
            high,
            low,
            supply,
            label
        } = initMarketWatchItem(item);

        const change24h = getExchange24hPercentageChange(item);
        const sparkLine = sparkLineBuilder(`${baseAsset}${quoteAsset}`, change24h >= 0 ? colors.teal : colors.red2);

        if (baseAsset && quoteAsset) {
            result.push({
                key: `market_row___${baseAsset}_${quoteAsset}`,
                star: isAuth ? <FavActionButton b={{
                    b: baseAsset,
                    i: baseAssetId
                }}
                    q={{
                        q: quoteAsset,
                        i: quoteAssetId
                    }}
                    list={favoriteList}
                    lang={lang}
                    mode={mode} favoriteRefresher={favoriteRefresher}
                /> : null,
                pair: renderPair(baseAsset, quoteAsset, label, screenWidth, mode, lang, futuresConfigs),
                last_price: <span className="whitespace-nowrap sm:text-base text-sm">{formatPrice(lastPrice)}</span>,
                change_24h: render24hChange(item, false, 'justify-end !text-sm sm:!text-base sm:!font-normal'),
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
                    pair: `${baseAsset}`,
                    last_price: lastPrice,
                    change_24h: getExchange24hPercentageChange(item),
                    market_cap: +lastPrice * +supply,
                    volume_24h: volume24h,
                    '24h_high': high,
                    '24h_low': low,
                    baseAsset,
                    quoteAsset,
                    tradingMode: mode
                }
            });
        }
    });

    return result;
};

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
};

const renderPair = (b, q, lbl, w, mode, lang = 'vi', futuresConfigs) => {
    let url = lang === 'vi' ? '/vi' : '';
    let hasLeverage = false;
    switch (mode) {
        case TRADING_MODE.FUTURES:
            url = url + '/futures/' + b + q;
            hasLeverage = true;
            break;
        case TRADING_MODE.EXCHANGE:
            url = '/trade/' + b + '-' + q;
            break;
        default:
            break;
    }

    const symbolLeverageConfig = hasLeverage ? futuresConfigs?.find(e => e?.pair == (b + q))?.leverageConfig : null;
    const leverage = (symbolLeverageConfig?.max ?? 0) ?? null;

    return (
        <a href={url} target="_blank" className="hover:underline">
            <div className="flex items-center font-semibold text-sm sm:text-base">
                {w >= 768 && <AssetLogo assetCode={b} size={w >= 1024 ? 32 : 28} />}
                <div className={w >= 768 ? 'ml-3 whitespace-nowrap' : 'whitespace-nowrap' + ' truncate'}>
                    <span className="text-txtPrimary dark:text-txtPrimary-dark">{b}</span>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">/{q}</span>
                </div>
                {leverage ? <div className="px-1 py-[2px] bg-bgButtonDisabled dark:bg-bgButtonDisabled-dark text-txtPrimary dark:text-txtPrimary-dark rounded-[3px] font-semibold text-xs leading-4 ml-2">
                    {leverage}x
                </div> : <MarketLabel labelType={lbl} />}
            </div>
        </a>
    );
};

const renderMarketCap = (price, supply) => {
    if (price && supply) {
        return <span className="whitespace-nowrap">{formatPrice(+price * +supply)}</span>;
    }
    return EMPTY_VALUE;
};

const FavActionButton = ({
    b,
    q,
    mode,
    lang,
    list,
    favoriteRefresher
}) => {
    const [loading, setLoading] = useState(false);
    const [already, setAlready] = useState(false);

    const pairKey = mode === TRADING_MODE.FUTURES ? `${b?.b}_${q?.q}` : `${b?.i}_${q?.i}`;

    // Helper
    const callback = _.debounce(async (method, list) => {
        setLoading(true);
        let message = '';
        let title = '';

        try {
            await favoriteAction(method, mode, pairKey);
        } catch (e) {
            console.log(`Can't execute this action `, e);

            if (lang === LANGUAGE_TAG.VI) title = 'Thất bại'
            if (lang === LANGUAGE_TAG.EN) title = 'Failure'
            toast(
                { text: `Unknown error`, type: 'error' },
            )
        } finally {
            setLoading(false);

            await favoriteRefresher();
            if (lang === LANGUAGE_TAG.VI) {
                title = 'Thành công';
                message = `Đã ${method === 'delete' ? `xóa khỏi` : `thêm vào`} danh sách yêu thích`;
            }
            if (lang === LANGUAGE_TAG.EN) {
                title = 'Success';
                message = method === 'delete' ? `Removed from favorites` : `Added to favorites`
            }
            toast(
                { text: message, type: 'success' },
            )
        }
    }, 2000);

    useEffect(() => {
        if (list) {
            if (mode === TRADING_MODE.EXCHANGE && list?.exchange) {
                list.exchange.includes(pairKey) ? setAlready(true) : setAlready(false);
            }

            if (mode === TRADING_MODE.FUTURES && list?.futures) {
                list.futures.includes(pairKey) ? setAlready(true) : setAlready(false);
            }
        }
    }, [list, pairKey, mode]);

    return (
        <div className="flex items-center"
            onClick={() => {
                !loading && callback(already ? 'delete' : 'put', list);
            }}>
            {loading ? <Spinner size={24} /> : already ? <IconStarFilled size={24} color="#FFC632" />
                : <IconStarFilled size={24} color="#8694B3" />}
        </div>
    );
};

const renderTradeLink = (b, q, lang, mode) => {
    let url;
    let swapurl;
    if (mode === TRADING_MODE.FUTURES) {
        url = `/futures/${b}${q}`;
    } else {
        url = `/trade/${b}-${q}`;
        // swapurl = `/swap/${b}-${q}`
        swapurl = `/swap?fromAsset=${b}&toAsset=${q}`;
    }

    return (
        <div className="flex justify-end items-center font-semibold">
            <Link href={url} prefetch={false}>
                <a className="text-teal re_table__link px-3 flex items-center justify-center !text-sm sm:!text-base" target="_blank">
                    {lang === LANGUAGE_TAG.VI ? 'Giao dịch' : 'Trade'}
                </a>
            </Link>
            {swapurl ? <Link href={swapurl} prefetch={false}>
                <a className="text-teal re_table__link px-3 flex items-center justify-center border-l-[1px] border-divider dark:border-divider-dark !text-sm sm:!text-base!text-sm sm:!text-base"
                    target="_blank">
                    {lang === LANGUAGE_TAG.VI ? 'Quy đổi' : 'Swap'}
                </a>
            </Link> : null}
        </div>
    )
}

const TokenTypes = ({ type, setType, types, lang, className }) => {
    return <div className={classNames('flex items-center space-x-3 h-9 sm:h-12 font-normal text-sm overflow-auto no-scrollbar', className)}>
        {types.map(e =>
            <div key={e.id} className={classNames('flex items-center h-full flex-auto justify-center px-4 text-sm sm:text-base rounded-[800px] border-[1px] cursor-pointer whitespace-nowrap', {
                'border-teal bg-teal bg-opacity-10 text-teal font-semibold': e.id === type,
                'border-divider dark:border-divider-dark': e.id !== type,
            })}
                onClick={() => setType(e.id)}
            >
                {e?.content[lang]}
            </div>
        )}
    </div>;
};

export default MarketTable;

export const HotIcon = ({ size = '20' }) => <svg width={size} height={size} viewBox={`0 0 20 20`} fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <path
        d="M13.813 2.896a.295.295 0 0 0-.493.167c-.092.547-.284 1.435-.647 2.251 0 0-.718-3.946-5.496-5.302a.295.295 0 0 0-.373.326c.173 1.173.486 4.481-.851 7.65-.696-1.414-1.808-1.966-2.515-2.18a.295.295 0 0 0-.362.391c.619 1.542-.771 3.468-.771 6.095a7.706 7.706 0 1 0 15.412 0c0-5.23-2.82-8.38-3.904-9.398z"
        fill="#FFC632" />
    <path
        d="M15.263 13.583c-.034-2.518-1.03-4.26-1.57-5.022a.318.318 0 0 0-.544.043c-.165.33-.431.747-.793.964 0 0-1.534-1.236-1.605-3.088a.317.317 0 0 0-.42-.286c-.812.276-2.535 1.204-2.952 4.16-.342-.617-1.154-.797-1.676-.847a.317.317 0 0 0-.339.391c.398 1.553-.604 2.48-.604 3.815a5.252 5.252 0 0 0 5.237 5.252c2.937.009 5.305-2.445 5.266-5.382z"
        fill="#CC1F1F" />
</svg>;

const addTokensToFav = _.debounce(async ({
    symbols,
    mode,
    lang,
    favoriteRefresher,
    setIsLoading
}) => {
    // Helper
    setIsLoading(true)
    let message = '';
    let title = '';
    const method = 'put';

    try {
        const { data } = await axios.put(API_GET_FAVORITE, {
            pairs: symbols,
            tradingMode: mode
        });
        await favoriteRefresher();

        if (data.status === 'error') throw 'error';

        if (lang === LANGUAGE_TAG.VI) {
            title = 'Thành công';
            message = `Đã ${method === 'delete' ? `xóa khỏi` : `thêm vào`} danh sách yêu thích`;
        }
        if (lang === LANGUAGE_TAG.EN) {
            title = 'Success';
            message = method === 'delete' ? `Removed from Favorites` : `Added to Favorites`
        }
        toast(
            { text: message, type: 'success' },
        )
    } catch (e) {
        console.log(`Can't execute this action `, e);

        if (lang === LANGUAGE_TAG.VI) {
            title = 'Thất bại';
            message = 'Thêm tất cả symbol thất bại, hãy thử thêm từng cặp một';
        }

        if (lang === LANGUAGE_TAG.EN) {
            title = 'Failure';
            message = 'Add all symbols error, please try one by one';
        }
        toast({ text: message, type: 'error' })
    }
    setIsLoading(false)
}, 2000)
