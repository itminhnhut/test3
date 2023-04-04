import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { dwLinkBuilder, formatNumber as formatWallet, setTransferModal, walletLinkBuilder } from 'redux/actions/utils';
import { MoreHorizIcon } from 'components/svg/SvgIcon';

import { EXCHANGE_ACTION } from 'pages/wallet';
import { getMarketAvailable, initMarketWatchItem, SECRET_STRING } from 'utils';
import { WalletType } from 'redux/actions/const';
import { useDispatch, useSelector } from 'react-redux';
import { PATHS } from 'constants/paths';
import { Menu, useContextMenu } from 'react-contexify';

import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import MCard from 'components/common/MCard';
import Link from 'next/link';
import AssetLogo from 'components/wallet/AssetLogo';
import SvgWalletExchange from 'components/svg/SvgWalletExchange';
import useOutsideClick from 'hooks/useOutsideClick';
import TableV2 from 'components/common/V2/TableV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import HideSmallBalance from 'components/common/HideSmallBalance';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import ModalV2 from 'components/common/V2/ModalV2';
import EstBalance from 'components/common/EstBalance';
import NoData from 'components/common/V2/TableV2/NoData';
import TransferSmallBalanceToNami from 'components/common/TransferSmallBalanceToNami';
import { TYPE_DW } from 'components/screens/WithdrawDeposit/constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';

const INITIAL_STATE = {
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

const ExchangeWallet = ({ allAssets, estBtc, estUsd, usdRate, marketWatch, isSmallScreen, isHideAsset, setIsHideAsset }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Use Hooks
    const r = useRouter();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const [currentTheme] = useDarkMode();
    const dispatch = useDispatch();
    const { show } = useContextMenu({ id: MENU_CONTEXT });
    const [curRowSelected, setCurRowSelected] = useState(null);

    // handle table:
    const flag = useRef(false);
    const popover = useRef(null);

    useOutsideClick(popover, () => {
        return !flag.current && curRowSelected && setCurRowSelected(null);
    });

    // handle columns operations in table sticky or not?
    const [isStickyColOperation, setIsStickyColOperation] = useState(false);
    useEffect(() => {
        // setIsStickyColOperation(width >= 992 && width < 1280);
        setIsStickyColOperation(width < 1280);
    }, [width]);

    const renderEstWallet = useCallback(() => {
        return (
            <div className="mt-[24px] md:mt-12 flex items-center justify-between">
                <div className="hidden md:flex rounded-full dark:bg-dark-2 w-[64px] h-[64px] items-center justify-center mr-6">
                    <SvgWalletExchange size={32} />
                </div>
                <div>
                    <div className="font-semibold text-[20px] leading-[28px] md:text-[32px] md:leading-[38px] dark:text-txtPrimary-dark text-txtPrimary">
                        {isHideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)} BTC
                    </div>
                    <div className="font-normal text-sm md:text-base mt-1">
                        {isHideAsset ? `${SECRET_STRING}` : `$${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)}`}
                    </div>
                </div>
            </div>
        );
    }, [estBtc, estUsd, isHideAsset, currentTheme]);

    // Kha dung - dang dat lenh2
    const renderAvailableBalance = useCallback(() => {
        return (
            <div className="txtPri-1 grid grid-cols-2 mt-5 md:flex md:justify-start md:mt-8">
                <div className="flex flex-col md:flex-row pr-4 md:pr-8 md:items-center">
                    <span className="txtSecond-1">{t('common:available_balance')}: &nbsp;</span>
                    <span className="mt-2 md:mt-0">{isHideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.value, estBtc?.assetDigit)} BTC</span>
                </div>
                <div className="pl-4 border-l border-divider dark:border-divider-dark md:flex md:border-none md:items-center">
                    <div className="txtSecond-1">{t('common:in_order')}: &nbsp;</div>
                    <div className="mt-2 md:mt-0">{isHideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.locked, estBtc?.assetDigit)} BTC</div>
                </div>
            </div>
        );
    }, [estBtc, isHideAsset, currentTheme]);

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

    useEffect(() => {
        if (allAssets && Array.isArray(allAssets) && allAssets?.length) {
            let tableData = allAssets;

            const minSmallBalance = 0;
            if (state.hideSmallAsset) {
                tableData = tableData.filter((item) => item?.wallet?.value > minSmallBalance);
            }

            if (state.search) {
                tableData = tableData.filter((item) => {
                    return (
                        item?.assetCode?.toUpperCase().includes(state.search?.toUpperCase()) ||
                        item?.assetName?.toUpperCase().includes(state.search?.toUpperCase())
                    );
                });
            }

            tableData && setState({ tableData });
        }
    }, [allAssets, usdRate, marketWatch, state.hideSmallAsset, state.search, curRowSelected]);

    // Render Handler
    const renderAssetTable = useCallback(() => {
        if (isSmallScreen) return null;
        const columns = [
            {
                key: 'assetCode',
                dataIndex: 'assetCode',
                title: t('common:asset'),
                align: 'left',
                width: 210,
                fixed: 'left',
                render: (v, item) => (
                    <div className="flex items-center gap-4">
                        <AssetLogo assetCode={v} size={32} />
                        <div className="flex flex-col space-y-1">
                            <span className="font-semibold">{v}</span>
                            <span className="text-xs text-txtSecondary-dark">{item?.assetName}</span>
                        </div>
                    </div>
                )
            },
            {
                key: 'wallet.value',
                dataIndex: ['wallet', 'value'],
                title: t('common:total'),
                align: 'right',
                width: 200,
                render: (v, item) => (
                    <span className="whitespace-nowrap">
                        {isHideAsset ? SECRET_STRING : v ? formatWallet(v, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}
                    </span>
                )
            },
            {
                key: 'available',
                dataIndex: 'available',
                title: t('common:available_balance'),
                align: 'right',
                width: 200,
                render: (v, item) => (isHideAsset ? SECRET_STRING : v ? formatWallet(v, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000')
            },
            {
                key: 'wallet.locked_value',
                dataIndex: ['wallet', 'locked_value'],
                title: t('common:in_order'),
                align: 'right',
                width: 200,
                render: (v, item) => {
                    let lockedValue = formatWallet(v, item?.assetDigit);
                    if (lockedValue === 'NaN') {
                        lockedValue = '0.0000';
                    }
                    return (
                        <span className="whitespace-nowrap">
                            {isHideAsset ? (
                                SECRET_STRING
                            ) : v ? (
                                <Link href={PATHS.EXCHANGE.TRADE.DEFAULT}>
                                    <a className="hover:text-dominant hover:!underline">{lockedValue}</a>
                                </Link>
                            ) : (
                                '0.0000'
                            )}
                        </span>
                    );
                }
            },
            {
                key: 'wallet.value',
                dataIndex: ['wallet', 'value'],
                title: t('common:btc_value'),
                align: 'right',
                width: 200,
                render: (v, item) => {
                    const assetUsdRate = usdRate?.[item?.id] || 0;
                    const btcUsdRate = usdRate?.['9'] || 0;

                    const totalUsd = v * assetUsdRate;
                    const totalBtc = totalUsd / btcUsdRate;

                    return (
                        <div>
                            {assetUsdRate ? (
                                <>
                                    <div className="whitespace-nowrap">{isHideAsset ? SECRET_STRING : totalBtc ? formatWallet(totalBtc, 4) : '0.0000'}</div>
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark font-medium whitespace-nowrap">
                                        ({isHideAsset ? '$' + SECRET_STRING : totalUsd > 0 ? ' ≈ $' + formatWallet(totalUsd, 2) : '$0.0000'})
                                    </div>
                                </>
                            ) : (
                                '--'
                            )}
                        </div>
                    );
                }
            },
            {
                key: 'operation',
                dataIndex: 'operation',
                title: '',
                align: 'left',
                width: 72,
                // fixed: 'right'
                fixed: isStickyColOperation ? 'right' : 'none',
                render: (v, item, idx) => {
                    const marketAvailable = getMarketAvailable(item?.assetCode, marketWatch);

                    return (
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
                                usdRate,
                                marketWatch,
                                translator: t,
                                dispatch,
                                setState,
                                show,
                                marketAvailable
                            }}
                            onMouseOut={() => (flag.current = false)}
                            router={router}
                        />
                    );
                }
            }
        ];

        return (
            <TableV2
                sort
                defaultSort={{ key: 'wallet.value', direction: 'desc' }}
                useRowHover
                data={state.tableData || []}
                columns={columns}
                rowKey={(item) => item?.key}
                scroll={{ x: true }}
                limit={ASSET_ROW_LIMIT}
                skip={0}
                isSearch={!!state.search}
                height={404}
                noBorder
                pagingClassName="border-none"
                tableStyle={{ fontSize: '16px', padding: '16px' }}
                className="border border-divider dark:border-divider-dark rounded-xl pt-4  md:mt-8"
            />
        );
    }, [state.tableData, state.currentPage, width, usdRate, curRowSelected, isHideAsset]);

    // Check Kyc before redirect to page Deposit / Withdraw
    const router = useRouter();

    const ListButton = ({ className }) => {
        return (
            <div className={className}>
                <ButtonV2 className="px-6" onClick={() => router.push(dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY))}>
                    {t('common:deposit')}
                </ButtonV2>
                <ButtonV2
                    // onClick={() => router.push(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto' }))}
                    onClick={() => router.push(dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.SELL))}
                    className="px-6"
                    variants="secondary"
                >
                    {t('common:withdraw')}
                </ButtonV2>
                <ButtonV2 onClick={() => dispatch(setTransferModal({ isVisible: true }))} className="px-6" variants="secondary">
                    {t('common:transfer')}
                </ButtonV2>
            </div>
        );
    };

    const [curAssetCodeAction, setCurAssetCodeAction] = useState('');

    const renderModalActionMobile = useCallback(() => {
        if (!curAssetCodeAction) return null;

        const marketAvailable = getMarketAvailable(curAssetCodeAction, marketWatch);
        const noMarket = !marketAvailable?.length;

        let tradeButton = null;
        if (Array.isArray(marketAvailable) && marketAvailable?.length) {
            if (marketAvailable?.length === 1) {
                const pair = initMarketWatchItem(marketAvailable?.[0]);
                // console.log('namidev-DEBUG: => ', pair)
                tradeButton = (
                    <Link
                        href={PATHS.EXCHANGE?.TRADE?.getPair(undefined, {
                            pair: `${curAssetCodeAction}-${pair?.quoteAsset}`
                        })}
                        prefetch={false}
                    >
                        <a>{t('common:trade')}</a>
                    </Link>
                );
            } else {
                tradeButton = (
                    <span
                        onClick={(e) => {
                            utils?.setState({
                                currentMarketList: marketAvailable
                            });
                            setTimeout(() => utils?.show(e), 200);
                        }}
                    >
                        {t('common:trade')}
                    </span>
                );
            }
        }

        return (
            <ModalV2 isVisible={curAssetCodeAction} onBackdropCb={() => setCurAssetCodeAction(null)} wrapClassName="px-6" isMobile={true}>
                <div className="flex flex-col gap-3 items-start">
                    <Link
                        href={PATHS.EXCHANGE?.SWAP?.getSwapPair({
                            fromAsset: 'USDT',
                            toAsset: curAssetCodeAction
                        })}
                    >
                        {t('common:buy')}
                    </Link>
                    <button
                        onClick={() =>
                            router.push(
                                dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY, curAssetCodeAction)
                                // walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, {
                                //     type: 'crypto',
                                //     asset: curAssetCodeAction
                                // })
                            )
                        }
                    >
                        {t('common:deposit')}
                    </button>
                    <button
                        onClick={() =>
                            router.push(
                                dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.SELL, curAssetCodeAction)
                                // walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, {
                                //     type: 'crypto',
                                //     asset: curAssetCodeAction
                                // })
                            )
                        }
                    >
                        {t('common:withdraw')}
                    </button>

                    {!noMarket && tradeButton}
                    {ALLOWED_FUTURES_TRANSFER.includes(curAssetCodeAction) && (
                        <button
                            onClick={() =>
                                dispatch(
                                    setTransferModal({
                                        isVisible: true,
                                        fromWallet: WalletType.SPOT,
                                        toWallet: WalletType.FUTURES,
                                        asset: curAssetCodeAction
                                    })
                                )
                            }
                        >
                            {t('common:transfer')}
                        </button>
                    )}
                </div>
            </ModalV2>
        );
    }, [curAssetCodeAction]);

    return (
        <>
            <MCard
                addClass={`mt-5 !p-8 rounded-xl
             ${currentTheme === THEME_MODE.DARK ? ' bg-bgTabInactive-dark border border-divider-dark' : ' bg-white shadow-card_light border-none'}`}
            >
                <div className="text-base border-b border-divider dark:border-divider-dark pb-5 md:pb-8 flex justify-between items-end">
                    <div>
                        <EstBalance onClick={() => setIsHideAsset(!isHideAsset)} isHide={isHideAsset} isSmallScreen={isSmallScreen} />
                        {renderEstWallet()}
                    </div>
                    <div className="hidden md:block">
                        <ListButton className="flex items-end justify-end h-full w-full mt-3 sm:mt-0 sm:w-auto gap-3" />
                    </div>
                </div>
                {renderAvailableBalance()}
            </MCard>
            <ListButton className="mt-6 flex items-end justify-end h-full w-full gap-2 md:hidden" />

            {/* Khi nao co Function Chuyen so du nho thanh Nami thi remove code nay */}
            {/* <div className="mt-12 md:mt-16 flex items-center justify-between">
                <div className="t-common-v2 hidden md:block">Exchange</div>
                {isSmallScreen ? (
                    <div className="w-full flex items-center justify-between">
                        <SearchBoxV2
                            value={state.search}
                            onChange={(value) => {
                                setState({ search: value });
                            }}
                            onFocus={() => setState({ currentPage: 1 })}
                            wrapperClassname="w-[180px]"
                            width={width}
                        />
                        <HideSmallBalance
                            onClick={() =>
                                setState({
                                    hideSmallAsset: !state.hideSmallAsset
                                })
                            }
                            isHide={state.hideSmallAsset}
                            className="whitespace-nowrap"
                            width={width}
                        />
                    </div>
                ) : (
                    <div className="flex items-center">
                        <HideSmallBalance
                            onClick={() =>
                                setState({
                                    hideSmallAsset: !state.hideSmallAsset
                                })
                            }
                            isHide={state.hideSmallAsset}
                            className="mr-8 whitespace-nowrap"
                            width={width}
                        />
                        <SearchBoxV2
                            value={state.search}
                            onChange={(value) => {
                                setState({ search: value });
                            }}
                            onFocus={() => setState({ currentPage: 1 })}
                            width={width}
                        />
                    </div>
                )}
            </div> */}

            {/* Khi nao co Function Chuyen so du nho thanh Nami thi enable code nay */}
            <div className="mt-12 md:mt-16 lg:items-center lg:justify-between">
                <div className="t-common-v2 hidden md:block">Exchange</div>
                <div className="flex items-end justify-between md:pt-8">
                    <TransferSmallBalanceToNami className="hidden md:flex" width={width} allAssets={allAssets} />

                    {isSmallScreen ? (
                        <div className="w-full flex items-center justify-between">
                            <SearchBoxV2
                                value={state.search}
                                onChange={(value) => {
                                    setState({ search: value });
                                }}
                                onFocus={() => setState({ currentPage: 1 })}
                                wrapperClassname="w-[180px]"
                                width={width}
                            />
                            <HideSmallBalance
                                onClick={() =>
                                    setState({
                                        hideSmallAsset: !state.hideSmallAsset
                                    })
                                }
                                isHide={state.hideSmallAsset}
                                className="whitespace-nowrap"
                                width={width}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <HideSmallBalance
                                onClick={() =>
                                    setState({
                                        hideSmallAsset: !state.hideSmallAsset
                                    })
                                }
                                isHide={state.hideSmallAsset}
                                className="mr-8 whitespace-nowrap"
                                width={width}
                            />
                            <SearchBoxV2
                                value={state.search}
                                onChange={(value) => {
                                    setState({ search: value });
                                }}
                                onFocus={() => setState({ currentPage: 1 })}
                                width={width}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="hidden md:block">{renderAssetTable()}</div>
            <div className="md:hidden flex flex-col gap-4 mt-4 mb-20 text-sm dark:text-gray-4 text-gray-15">
                {state?.tableData && state?.tableData?.length > 0 && isSmallScreen ? (
                    <>
                        {state.tableData.map((item, index) => {
                            const { assetCode, assetDigit, assetName, available, id, wallet } = item;
                            const assetUsdRate = usdRate?.[id] || 0;
                            const totalUsd = wallet.value * assetUsdRate;
                            const hidden = index + 1 > state.currentPage * ASSET_ROW_LIMIT;

                            return (
                                <div
                                    key={'mobile_row_' + item.id}
                                    className={`w-full flex flex-col p-4 gap-4 bg-gray-13 dark:bg-dark-4 rounded-xl ${hidden && 'hidden'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <AssetLogo assetCode={assetCode} size={32} />
                                            <span className="font-semibold mr-2 ml-3">{assetCode}</span>
                                            <span className="txtSecond-1">{assetName}</span>
                                        </div>
                                        <div className="cursor-pointer">
                                            <MoreHorizIcon onClick={() => setCurAssetCodeAction(assetCode)} />
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="txtPri-1 whitespace-nowrap">
                                            {isHideAsset
                                                ? SECRET_STRING
                                                : wallet.value
                                                ? formatWallet(wallet.value, assetCode === 'USDT' ? 2 : assetDigit)
                                                : '0.0000'}
                                        </span>
                                        &nbsp;
                                        <span className="txtSecond-1  whitespace-nowrap">
                                            ~ ${isHideAsset ? SECRET_STRING : totalUsd > 0 ? formatWallet(totalUsd, 2) : '0.0000'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <span className="txtSecond-2">{t('common:available_balance')}</span>
                                            <span className="txtPri-1">
                                                {isHideAsset
                                                    ? SECRET_STRING
                                                    : available
                                                    ? formatWallet(available, assetCode === 'USDT' ? 2 : assetDigit)
                                                    : '0.0000'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="txtSecond-2">{t('common:in_order')}</span>
                                            <span className="txtPri-1">
                                                {isHideAsset
                                                    ? SECRET_STRING
                                                    : wallet.locked_value
                                                    ? formatWallet(wallet.locked_value, assetCode === 'USDT' ? 2 : assetDigit)
                                                    : '0.0000'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {state.tableData.length > state.currentPage * ASSET_ROW_LIMIT + ASSET_ROW_LIMIT && (
                            <div
                                onClick={() => setState({ currentPage: state.currentPage + 1 })}
                                className="text-teal text-sm font-semibold text-center cursor-pointer mt-2"
                            >
                                {t('common:load_more')}
                            </div>
                        )}
                    </>
                ) : (
                    <NoData className="mt-12" isSearch={!!state.search} />
                )}
            </div>

            {/* {renderPagination()} */}

            {renderMarketListContext()}
            {renderModalActionMobile()}
        </>
    );
};

const ASSET_ROW_LIMIT = 10;

const RenderOperationLink2 = ({ isShow, onClick, item, popover, assetName, utils, idx, isStickyColOperation, onMouseOut, router }) => {
    const markets = utils?.marketAvailable;
    const noMarket = !markets?.length;

    let tradeButton = null;
    const cssLi = `w-full px-4 py-2 flex items-center justify-center cursor-pointer
    hover:text-txtTabHover dark:hover:text-txtTextBtn-dark
    hover:bg-gray-13 dark:hover:bg-hover-dark
    `;
    const cssPopover = () => {
        if (isStickyColOperation) {
            return `absolute ${idx >= 0 && idx < ASSET_ROW_LIMIT - 3 ? 'top-2/3 mt-2' : 'bottom-2/3 mb-2'} right-full`;
        } else {
            return `absolute ${ASSET_ROW_LIMIT - idx < 4 ? 'bottom-2/3 mb-2' : 'top-2/3 mt-2'} right-1/2`;
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
                <MoreHorizIcon />
            </button>
            {/* Popover */}
            <ul
                ref={isShow ? popover : null}
                className={`py-2 w-full max-w-[400px] min-w-[136px] z-50 rounded-xl
                border-[0.5px] border-divider dark:border-divider-dark
                bg-white dark:bg-listItemSelected-dark
                text-gray-1 dark:text-txtPrimary-dark text-left text-base font-normal
                ${isShow ? 'block' : 'hidden'} ${cssPopover()}`}
            >
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
                <li
                    className={cssLi}
                    onClick={() =>
                        // router.push(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto', asset: item?.assetCode || assetName }))
                        router.push(dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY, item?.assetCode || assetName))
                    }
                >
                    {utils?.translator('common:deposit')}
                </li>
                <li
                    className={cssLi}
                    onClick={() =>
                        // router.push(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.WITHDRAW, { type: 'crypto', asset: item?.assetCode || assetName }))
                        router.push(dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.SELL, item?.assetCode || assetName))
                    }
                >
                    {utils?.translator('common:withdraw')}
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

const ALLOWED_FUTURES_TRANSFER = ['VNDC', 'USDT', 'NAMI', 'NAC'];

export default ExchangeWallet;
