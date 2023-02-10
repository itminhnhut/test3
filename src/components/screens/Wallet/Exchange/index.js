import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { formatNumber as formatWallet, getS3Url, getV1Url, setTransferModal, walletLinkBuilder } from 'redux/actions/utils';
import { Check, Search, X } from 'react-feather';
import { SeeIcon, HideIcon } from 'components/svg/SvgIcon';

import { EXCHANGE_ACTION } from 'pages/wallet';
import { getMarketAvailable, initMarketWatchItem, SECRET_STRING } from 'utils';
import { WalletType } from 'redux/actions/const';
import { useDispatch } from 'react-redux';
import { PATHS } from 'constants/paths';
import { Menu, useContextMenu } from 'react-contexify';

import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import MCard from 'components/common/MCard';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import Empty from 'components/common/Empty';
import Skeletor from 'components/common/Skeletor';
import Link from 'next/link';
import AssetLogo from 'components/wallet/AssetLogo';
import SvgWalletExchange from 'components/svg/SvgWalletExchange';
import SvgMoreHoriz from 'components/svg/SvgMoreHoriz';
import { ChevronDown } from 'react-feather';
import PopoverV2 from 'components/common/V2/PopoverV2';
import useOutsideClick from 'hooks/useOutsideClick';
import NoData from 'components/common/V2/TableV2/NoData';
import TableV2 from 'components/common/V2/TableV2';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

// import 'react-contexifpopovery/dist/ReactContexify.css';

const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    reInitializing: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    currentMarketList: null,
    currentRowAction: null
};

const MENU_CONTEXT = 'market-available';

const ExchangeWallet = ({ allAssets, estBtc, estUsd, usdRate, marketWatch }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    const tableRef = useRef(null);

    // Use Hooks
    const r = useRouter();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const [currentTheme] = useDarkMode();
    const dispatch = useDispatch();
    const { show } = useContextMenu({ id: MENU_CONTEXT });

    // handle columns operations in table sticky or not?
    const [isStickyColOperation, setIsStickyColOperation] = useState(false);
    useEffect(() => {
        // setIsStickyColOperation(width >= 992 && width < 1280);
        setIsStickyColOperation(width < 1280);
    }, [width]);

    // Render Handler
    const renderAssetTable = useCallback(() => {
        let tableStatus;

        const columns = [
            {
                key: 'asset',
                dataIndex: 'asset',
                title: t('common:asset'),
                align: 'left',
                width: 200,
                fixed: 'left'
            },
            {
                key: 'total',
                dataIndex: 'total',
                title: t('common:total'),
                align: 'right',
                width: 210
            },
            {
                key: 'available',
                dataIndex: 'available',
                title: t('common:available_balance'),
                align: 'right',
                width: 210
            },
            {
                key: 'in_order',
                dataIndex: 'in_order',
                title: t('common:in_order'),
                align: 'right',
                width: 231
            },
            {
                key: 'btc_value',
                dataIndex: 'btc_value',
                title: t('common:btc_value'),
                align: 'right',
                width: 231
            },
            {
                key: 'operation',
                dataIndex: 'operation',
                title: '',
                align: 'left',
                width: 72,
                // fixed: 'right'
                fixed: isStickyColOperation ? 'right' : 'none'
            }
        ];

        return (
            <>
                <div className="mt-8 pb-4 border border-divider-dark dark:border-divider-dark rounded-xl">
                    <TableV2
                        sort
                        defaultSort={{ key: 'btc_value', direction: 'desc' }}
                        useRowHover
                        data={state.tableData || []}
                        columns={columns}
                        rowKey={(item) => item?.key}
                        scroll={{ x: true }}
                        limit={ASSET_ROW_LIMIT}
                        skip={0}
                        isSearch={!!state.search}
                        pagingClassName="border-none"
                        // page={state.currentPage}
                        // onChangePage={(currentPage) => setState({ currentPage })}
                    />
                    {/* <ReTable
                        tableStatus={tableStatus}
                        paginationProps={{
                            hide: true,
                            current: state.currentPage,
                            pageSize: 10,
                            onChange: (currentPage) => setCurrentPage(currentPage)
                        }}
                        isNamiV2
                        // height={height}
                        emptyText={<NoData isSearch={!!state.search} />}
                        // {...props}
                    /> */}
                    {/* {state.tableData?.length > 0 && (
                        <div className="pt-8 flex items-center justify-center dark:bg-bgSpotContainer-dark">
                            <RePagination
                                total={state.tableData?.length}
                                current={state.currentPage}
                                pageSize={ASSET_ROW_LIMIT}
                                onChange={(currentPage) => setState({ currentPage })}
                                name="market_table___list"
                            />
                        </div>
                    )} */}
                </div>
            </>
        );
    }, [state.tableData, state.currentPage, width]);

    const renderEstWallet = useCallback(() => {
        return (
            <div className="flex items-center mt-12">
                <div className="rounded-full bg-teal-lightTeal dark:bg-teal-5 min-w-[60px] min-h-[60px] md:min-w-[64px] md:min-h-[64px] flex items-center justify-center">
                    <SvgWalletExchange size={32} />
                </div>
                <div className="ml-3 md:ml-6 dark:text-txtPrimary-dark text-txtPrimary">
                    <div className="font-semibold text-[32px] leading-[38px] dark:text-txtPrimary-dark text-txtPrimary">
                        {state.hideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)} BTC
                    </div>
                    <div className="font-normal text-base mt-1">
                        {state.hideAsset ? `${SECRET_STRING}` : `$${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)}`}
                    </div>
                </div>
            </div>
        );
    }, [estBtc, estUsd, state.hideAsset, currentTheme]);

    // Kha dung - dang dat lenh2
    const renderAvailableBalance = useCallback(() => {
        return (
            <div className="flex pt-8 gap-12">
                <div>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:available_balance')}: </span>{' '}
                    <span className="font-semibold">{state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.value, estBtc?.assetDigit)} BTC</span>
                </div>
                <div>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:in_order')}: </span>{' '}
                    <span className="font-semibold">{state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.locked, estBtc?.assetDigit)} BTC</span>
                </div>
            </div>
        );
    }, [estBtc, state.hideAsset, currentTheme]);

    const renderMarketListContext = useCallback(() => {
        if (!state.currentMarketList) return null;

        const markets = [];
        state.currentMarketList.forEach((item, index) => {
            const pair = initMarketWatchItem(item);
            markets.push(
                <div className="px-2">
                    <Link
                        href={PATHS.EXCHANGE.TRADE.getPair(undefined, {
                            pair: `${pair?.baseAsset}-${pair?.quoteAsset}`
                        })}
                    >
                        <a
                            className={
                                index % 2 === 0
                                    ? 'block text-center text-sm font-medium py-2.5 border-b border-divider dark:border-divider-dark cursor-pointer hover:text-dominant'
                                    : 'block text-center text-sm font-medium py-2.5 cursor-pointer hover:text-dominant'
                            }
                        >
                            {pair?.baseAsset}/{pair?.quoteAsset}
                        </a>
                    </Link>
                </div>
            );
        });

        return (
            <Menu
                id={MENU_CONTEXT}
                animation={false}
                style={{ boxShadow: 'none' }}
                className="!min-w-[100px] !w-auto !p-0 !rounded-lg !overflow-hidden
                             !drop-shadow-onlyLight dark:!drop-shadow-none !bg-bgContainer dark:!bg-darkBlue-3"
            >
                {markets}
            </Menu>
        );
    }, [state.currentMarketList]);

    useEffect(() => {
        if (r?.query?.action) {
            setState({ action: r.query.action });
        } else {
            setState({ action: null });
        }
    }, [r]);

    useEffect(() => {
        if (state.action && Object.keys(EXCHANGE_ACTION).includes(state.action.toUpperCase())) {
            r.replace(`?action=${state.action}`);
        }
    }, [state.action]);

    const [curRowSelected, setCurRowSelected] = useState(null);
    useEffect(() => {
        if (allAssets && Array.isArray(allAssets) && allAssets?.length) {
            const origin = dataHandler(allAssets, {
                usdRate,
                marketWatch,
                translator: t,
                dispatch,
                setState,
                show
            });
            let tableData = origin;
            if (state.hideSmallAsset) {
                tableData = origin.filter((item) => item?.sortByValue?.total > 1);
            }
            if (state.search) {
                tableData = tableData.filter((item) => item?.sortByValue?.asset.includes(state.search?.toUpperCase()));
            }
            tableData && setState({ tableData });
        }
    }, [allAssets, usdRate, marketWatch, state.hideSmallAsset, state.search, curRowSelected]);

    // useEffect(() => {
    //     console.log('namidev-DEBUG: => ', state)
    // }, [state])

    // handle table:
    const flag = useRef(false);
    const popover = useRef(null);

    useOutsideClick(popover, () => !flag.current && curRowSelected && setCurRowSelected(null));

    const dataHandler = (data, utils) => {
        if (!data || !data?.length) {
            const skeleton = [];
            for (let i = 0; i < ASSET_ROW_LIMIT; ++i) {
                skeleton.push({
                    ...ROW_LOADING_SKELETON,
                    key: `asset_loading__skeleton_${i}`
                });
            }
            return skeleton;
        }

        const result = [];

        data.forEach((item, idx) => {
            let lockedValue = formatWallet(item?.wallet?.locked_value, item?.assetDigit);
            if (lockedValue === 'NaN') {
                lockedValue = '0.0000';
            }

            const marketAvailable = getMarketAvailable(item?.assetCode, utils?.marketWatch);

            const assetUsdRate = utils?.usdRate?.[item?.id] || 0;
            const btcUsdRate = utils?.usdRate?.['9'] || 0;

            const totalUsd = item?.wallet?.value * assetUsdRate;
            const totalBtc = totalUsd / btcUsdRate;

            result.push({
                key: `exchange_asset___${item?.assetCode}`,
                asset: (
                    <div className="flex items-center gap-4">
                        <AssetLogo assetCode={item?.assetCode} size={32} />
                        <div className="flex flex-col space-y-1">
                            <span className="font-semibold text-sm">{item?.assetCode}</span>
                            <span className="text-xs text-txtSecondary-dark">{item?.assetName}</span>
                        </div>
                    </div>
                ),
                total: (
                    <span className="text-sm whitespace-nowrap flex justify-end">
                        {item?.wallet?.value ? formatWallet(item?.wallet?.value, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}
                    </span>
                ),
                available: (
                    <span className="text-sm whitespace-nowrap">
                        {item?.wallet?.value - item?.wallet?.locked_value
                            ? formatWallet(item?.wallet?.value - item?.wallet?.locked_value, item?.assetCode === 'USDT' ? 2 : item?.assetDigit)
                            : '0.0000'}
                    </span>
                ),
                in_order: (
                    <span className="text-sm whitespace-nowrap">
                        {item?.wallet?.locked_value ? (
                            <Link href={PATHS.EXCHANGE.TRADE.DEFAULT}>
                                <a className="hover:text-dominant hover:!underline">{lockedValue}</a>
                            </Link>
                        ) : (
                            '0.0000'
                        )}
                    </span>
                ),
                btc_value: (
                    <div className="text-sm">
                        {assetUsdRate ? (
                            <>
                                <div className="whitespace-nowrap">{totalBtc ? formatWallet(totalBtc, 4) : '0.0000'}</div>
                                <div className="text-txtSecondary dark:text-txtSecondary-dark font-medium whitespace-nowrap">
                                    ({totalUsd > 0 ? ' ≈ $' + formatWallet(totalUsd, 2) : '$0.0000'})
                                </div>
                            </>
                        ) : (
                            '--'
                        )}
                    </div>
                ),
                operation: (
                    <RenderOperationLink2
                        // rowData={curRowSelected}
                        isShow={curRowSelected?.id === item?.id}
                        idx={idx}
                        onClick={(e) => {
                            flag.current = true;
                            setCurRowSelected((prev) => {
                                return prev && prev?.id === e?.id ? null : e;
                            });
                        }}
                        isStickyColOperation={isStickyColOperation}
                        item={item}
                        popover={popover}
                        assetName={item?.assetName}
                        utils={{
                            ...utils,
                            marketAvailable
                        }}
                        onMouseOut={() => (flag.current = false)}
                    />
                ),
                [RETABLE_SORTBY]: {
                    asset: item?.assetName,
                    total: +item?.wallet?.value,
                    available: +item?.wallet?.value - +item?.wallet?.locked_value,
                    in_order: item?.wallet?.locked_value,
                    btc_value: +totalUsd
                }
            });
        });

        return result;
    };

    return (
        <>
            {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between"> */}
            {/* <div className="t-common whitespace-nowrap">{t('common:overview')}</div> */}
            {/* <div className="flex flex-wrap sm:flex-nowrap items-center w-full mt-3 sm:mt-0 sm:w-auto"> */}
            {/* <Link href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT)}>
                        <a className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                            {t('common:deposit')}
                        </a>
                    </Link>
                    <div className="w-full h-[8px] sm:hidden" />
                    <Link href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW)}>
                        <a className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px]  mr-3.5 sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer">
                            {t('common:withdraw')}
                        </a>
                    </Link> */}
            {/*<Link href="/wallet/exchange/transfer?from=exchange" prefetch>*/}
            {/* <div
                        onClick={() =>
                            dispatch(
                                setTransferModal({
                                    isVisible: true,
                                    fromWallet: WalletType.SPOT,
                                    toWallet: WalletType.FUTURES
                                })
                            )
                        }
                        className="py-1.5 md:py-2 text-center w-[45%] max-w-[180px] sm:w-[80px] md:w-[120px] sm:mr-0 sm:ml-2 bg-bgContainer dark:bg-bgContainer-dark rounded-md font-medium text-xs xl:text-sm text-dominant border border-dominant hover:text-white hover:!bg-dominant cursor-pointer"
                    >
                        {t('common:transfer')}
                    </div> */}
            {/*</Link>*/}
            {/* </div> */}
            {/* </div> */}
            <MCard addClass="mt-5 !p-6 xl:!p-8 dark:!bg-bgTabInactive-dark !dark:bg-namiV2 rounded-xl border border-divider dark:border-none">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between text-base border-b border-divider dark:border-divider-dark pb-8">
                    <div>
                        <div className="flex items-center font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark">
                            <div className="mr-2">{t('wallet:est_balance')}</div>
                            <div
                                className="flex items-center cursor-pointer hover:opacity-80 select-none"
                                onClick={() => setState({ hideAsset: !state.hideAsset })}
                            >
                                {state.hideAsset ? <HideIcon size={16} className="mr-[4px]" /> : <SeeIcon size={16} className="mr-[4px]" />}
                            </div>
                        </div>
                        {renderEstWallet()}
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-end justify-end h-full w-full mt-3 sm:mt-0 sm:w-auto gap-3">
                            <HrefButton className="min-w-[120px] py-3" href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto' })}>
                                {t('common:deposit')}
                            </HrefButton>
                            <HrefButton
                                className="min-w-[120px] py-3"
                                href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto' })}
                                variants="secondary"
                            >
                                {t('common:withdraw')}
                            </HrefButton>
                            <ButtonV2
                                className="min-w-[120px] py-3 text-base text-center cursor-pointer rounded-md
                                text-txtSecondary dark:text-txtSecondary-dark dark:bg-dark-2"
                                onClick={() => dispatch(setTransferModal({ isVisible: true }))}
                            >
                                {t('common:transfer')}
                            </ButtonV2>

                            {/* <Link href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto' })}>
                                <a className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 rounded-md font-medium text-xs xl:text-sm cursor-pointer bg-bgBtnPrimary">
                                    {t('common:deposit')}
                                </a>
                            </Link>
                            <Link href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto' })}>
                                <a
                                    className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 rounded-md font-medium text-xs xl:text-sm cursor-pointer
                                   text-txtSecondary dark:text-txtSecondary-dark hover:!bg-dominant dark:bg-dark-2 hover:!text-white
                                "
                                >
                                    {t('common:withdraw')}
                                </a>
                            </Link>
                            <div
                                className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 rounded-md font-medium text-xs xl:text-sm cursor-pointer
                                    text-txtSecondary dark:text-txtSecondary-dark hover:!bg-dominant dark:bg-dark-2 hover:!text-white
                                 "
                                onClick={() => dispatch(setTransferModal({ isVisible: true }))}
                            >
                                {t('common:transfer')}
                            </div> */}
                        </div>
                        {/* <img src={getS3Url('/images/screen/wallet/wallet_overview_grp.png')} width="140" height="140" alt="" /> */}
                    </div>
                </div>
                {renderAvailableBalance()}
            </MCard>

            <div className="mt-16 lg:items-center lg:justify-between">
                <div className="t-common">Exchange</div>
                <div className="flex items-end justify-between pt-8">
                    <div className="bg-dark-2 flex items-center justify-between text-white gap-3 rounded-md px-4 py-3 cursor-pointer">
                        <img src={getS3Url('/images/logo/nami_maldives.png')} alt="" width="24" height="24" />
                        <a href="/" className="text-sm dark:text-txtPrimary-dark flex items-center gap-3">
                            {width >= 640 ? t('wallet:convert_small', { asset: 'NAMI' }) : t('wallet:convert_small_mobile', { asset: 'NAMI' })}
                            <ChevronDown size={24} className="-rotate-90" />
                        </a>
                    </div>

                    <div className="mt-2 lg:flex">
                        <div className="flex items-center justify-between lg:mr-5">
                            <div
                                className="flex items-center select-none cursor-pointer lg:mr-5 text-txtSecondary dark:text-txtSecondary-dark"
                                onClick={() =>
                                    setState({
                                        hideSmallAsset: !state.hideSmallAsset
                                    })
                                }
                            >
                                <span
                                    className={
                                        state.hideSmallAsset
                                            ? 'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border border-dominant bg-dominant'
                                            : 'inline-flex items-center justify-center w-[16px] h-[16px] rounded-[3px] border border-divider dark:border-divider-dark'
                                    }
                                >
                                    {state.hideSmallAsset ? <Check size={10} color="#FFFFFF" /> : null}
                                </span>
                                <span className="ml-3 text-xs ">{t('wallet:hide_small_balance')}</span>
                            </div>
                        </div>
                        <div className="py-2 px-3 mt-4 lg:mt-0 lg:py-3 lg:px-5 lg:w-96 flex items-center rounded-md bg-gray-5 dark:bg-dark-2">
                            <Search size={width >= 768 ? 20 : 16} className="text-txtSecondary dark:text-txtSecondary-dark" />
                            <input
                                className="text-sm w-full px-2.5"
                                value={state.search}
                                onChange={(e) => {
                                    setState({ search: e?.target?.value });
                                }}
                                onFocus={() => setState({ currentPage: 1 })}
                                placeholder={t('common:search')}
                            />
                            {state.search && <X size={width >= 768 ? 20 : 16} className="cursor-pointer" onClick={() => setState({ search: '' })} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* <TableV2 /> */}
            {/* <MCard
                getRef={(ref) => (tableRef.current = ref)}
                style={currentTheme === THEME_MODE.LIGHT ? { boxShadow: '0px 7px 23px rgba(0, 0, 0, 0.05)' } : {}}
                addClass="relative mt-5 pt-0 pb-0 px-0 overflow-hidden"
            >
            </MCard> */}
            {renderAssetTable()}

            {/* {renderPagination()} */}

            {renderMarketListContext()}
        </>
    );
};

const ASSET_ROW_LIMIT = 10;

const RenderOperationLink2 = ({ isShow, onClick, item, popover, assetName, utils, idx, isStickyColOperation, onMouseOut, data }) => {
    const markets = utils?.marketAvailable;
    const noMarket = !markets?.length;

    let tradeButton = null;
    const cssLi = `text-txtSecondary dark:text-gray-4 leading-6 text-left text-base w-full
    px-4 py-2 flex items-center justify-center   cursor-pointer font-normal
    dark:hover:text-dominant bg-teal-lightTeal dark:bg-listItemSelected-dark hover:bg-teal-lightTeal dark:hover:bg-hover
    `;
    const cssPopover = () => {
        if (isStickyColOperation) {
            return `absolute ${
                idx >= 0 && idx < ASSET_ROW_LIMIT - 4 ? 'top-full mt-2' : 'bottom-full mb-2'
            } right-full py-2 w-full max-w-[400px] min-w-[136px] z-50 rounded-xl border
            border-divider dark:border-divider-dark bg-bgContainer dark:bg-listItemSelected-dark drop-shadow-onlyLight
            dark:drop-shadow-none dark:shadow-[0_-4px_20px_rgba(31,47,70,0.1)] ${isShow ? 'block' : 'hidden'} `;
        } else {
            return `absolute ${
                ASSET_ROW_LIMIT - idx < 4 ? 'bottom-full' : 'top-full'
            } right-1/2 py-2 mt-2 w-full max-w-[400px] min-w-[136px] z-50 rounded-xl border
        border-divider dark:border-divider-dark bg-bgContainer dark:bg-listItemSelected-dark drop-shadow-onlyLight
        dark:drop-shadow-none dark:shadow-[0_-4px_20px_rgba(31,47,70,0.1)] ${isShow ? 'block' : 'hidden'} `;
        }
    };

    if (Array.isArray(markets) && markets?.length) {
        if (markets?.length === 1) {
            const pair = initMarketWatchItem(markets?.[0]);
            // console.log('namidev-DEBUG: => ', pair)
            tradeButton = (
                <li>
                    <Link
                        href={PATHS.EXCHANGE?.TRADE?.getPair(undefined, {
                            pair: `${assetName}-${pair?.quoteAsset}`
                        })}
                        prefetch={false}
                    >
                        <a className={cssLi}>{utils?.translator('common:trade')}</a>
                    </Link>
                </li>
            );
        } else {
            tradeButton = (
                <li
                    className={cssLi}
                    onClick={(e) => {
                        utils?.setState({
                            currentMarketList: utils?.marketAvailable
                        });
                        setTimeout(() => utils?.show(e), 200);
                    }}
                >
                    {utils?.translator('common:trade')}
                </li>
            );
        }
    }

    return (
        <div className=" h-full flex items-center justify-between" id={item.id} onMouseOut={onMouseOut}>
            <button onClick={() => onClick(item)} className="relative w-full flex items-center justify-center px-0 z-30">
                <SvgMoreHoriz />
            </button>
            {/* Popover */}
            <ul ref={isShow ? popover : null} className={cssPopover()}>
                <li className={cssLi}>
                    <a
                        href={PATHS.EXCHANGE?.SWAP?.getSwapPair({
                            fromAsset: 'USDT',
                            toAsset: assetName
                        })}
                    >
                        {utils?.translator('common:buy')}
                    </a>
                </li>
                {!noMarket && tradeButton}
                <li className={cssLi}>
                    <a href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto', asset: assetName })}>
                        {utils?.translator('common:deposit')}
                    </a>
                </li>
                <li className={cssLi}>
                    <a href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto', asset: assetName })}>
                        {utils?.translator('common:withdraw')}
                    </a>
                </li>
                {ALLOWED_FUTURES_TRANSFER.includes(assetName) && (
                    <li
                        className={cssLi}
                        onClick={() =>
                            utils?.dispatch(
                                setTransferModal({
                                    isVisible: true,
                                    fromWallet: WalletType.SPOT,
                                    toWallet: WalletType.FUTURES,
                                    asset: assetName
                                })
                            )
                        }
                    >
                        {utils?.translator('common:transfer')}
                    </li>
                )}
            </ul>
        </div>
    );
};

const renderOperationLink = (assetName, utils) => {
    const markets = utils?.marketAvailable;
    const noMarket = !markets?.length;

    let tradeButton = null;
    if (Array.isArray(markets) && markets?.length) {
        if (markets?.length === 1) {
            const pair = initMarketWatchItem(markets?.[0]);
            // console.log('namidev-DEBUG: => ', pair)
            tradeButton = (
                <Link
                    href={PATHS.EXCHANGE?.TRADE?.getPair(undefined, {
                        pair: `${assetName}-${pair?.quoteAsset}`
                    })}
                    prefetch={false}
                >
                    <a
                        className="relative select-none py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center
                                text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
                    >
                        {utils?.translator('common:trade')}
                    </a>
                </Link>
            );
        } else {
            tradeButton = (
                <div
                    className="relative select-none py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center
                                text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
                    onClick={(e) => {
                        utils?.setState({
                            currentMarketList: utils?.marketAvailable
                        });
                        setTimeout(() => utils?.show(e), 200);
                    }}
                >
                    {utils?.translator('common:trade')}
                </div>
            );
        }
    }

    return (
        <div className="relative flex pl-12">
            <a
                className="py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
                href={PATHS.EXCHANGE?.SWAP?.getSwapPair({
                    fromAsset: 'USDT',
                    toAsset: assetName
                })}
            >
                {/*`/wallet/exchange/deposit?type=crypto&asset=${assetName}`*/}
                {utils?.translator('common:buy')}
            </a>
            <a
                className="py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
                href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto', asset: assetName })}
            >
                {utils?.translator('common:deposit')}
            </a>
            <a
                className="py-1.5 mr-3 min-w-[90px] w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
                href={walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto', asset: assetName })}
            >
                {utils?.translator('common:withdraw')}
            </a>
            {!noMarket && tradeButton}
            {ALLOWED_FUTURES_TRANSFER.includes(assetName) && (
                <div
                    className="py-1.5 min-w-[90px] w-[90px] flex items-center justify-center text-xs lg:text-sm text-dominant rounded-md border border-dominant hover:bg-dominant hover:text-white"
                    onClick={() =>
                        utils?.dispatch(
                            setTransferModal({
                                isVisible: true,
                                fromWallet: WalletType.SPOT,
                                toWallet: WalletType.FUTURES,
                                asset: assetName
                            })
                        )
                    }
                >
                    {utils?.translator('common:transfer')}
                </div>
            )}
        </div>
    );
};

const ALLOWED_FUTURES_TRANSFER = ['VNDC', 'USDT', 'NAMI', 'NAC'];

const ROW_LOADING_SKELETON = {
    asset: <Skeletor width={65} />,
    total: <Skeletor width={65} />,
    available: <Skeletor width={65} />,
    in_order: <Skeletor width={65} />,
    operation: <Skeletor width={125} />
};

export default ExchangeWallet;
