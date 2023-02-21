import { useCallback, useEffect, useState } from 'react';
import { formatNumber as formatWallet, getS3Url, setTransferModal } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Check, Search, X } from 'react-feather';
import { SeeIcon, HideIcon } from 'components/svg/SvgIcon';

import { SECRET_STRING } from 'utils';

import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import MCard from 'components/common/MCard';
import AssetLogo from 'components/wallet/AssetLogo';
import ReTable, { RETABLE_SORTBY } from 'components/common/ReTable';
import RePagination from 'components/common/ReTable/RePagination';
import { orderBy } from 'lodash';
import Skeletor from 'components/common/Skeletor';
import Empty from 'components/common/Empty';
import { ExchangeOrderEnum, WalletType } from 'redux/actions/const';
import Link from 'next/link';
import { PATHS } from 'constants/paths';
import SvgWalletFutures from 'components/svg/SvgWalletFutures';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TableV2 from 'components/common/V2/TableV2';
import HideSmallBalance from 'components/common/HideSmallBalance';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import EstBalance from 'components/common/EstBalance';
import ModalV2 from 'components/common/V2/ModalV2';

const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    allAssets: null
};

const AVAILBLE_KEY = 'futures_available';
const FUTURES_ASSET = ['VNDC', 'NAMI', 'NAC', 'USDT'];

const FuturesWallet = ({ estBtc, estUsd, usdRate, marketWatch, isSmallScreen }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Rdx
    const wallets = useSelector((state) => state.wallet.FUTURES);
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;

    // Use Hooks
    const [currentTheme] = useDarkMode();
    const { width } = useWindowSize();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Helper
    const walletMapper = (allWallet, assetConfig) => {
        if (!allWallet || !assetConfig) return;
        const mapper = [];
        if (Array.isArray(assetConfig) && assetConfig?.length) {
            const futures = assetConfig.filter((o) => FUTURES_ASSET.includes(o?.assetCode));
            futures &&
                futures.forEach(
                    (item) =>
                        allWallet?.[item.id] &&
                        mapper.push({
                            ...item,
                            [AVAILBLE_KEY]: allWallet?.[item?.id]?.value - allWallet?.[item?.id]?.locked_value,
                            wallet: allWallet?.[item?.id]
                        })
                );
        }
        setState({ allAssets: orderBy(mapper, [AVAILBLE_KEY, 'displayWeight'], ['desc']) });
    };

    // Render Handler
    const renderAssetTable = useCallback(() => {
        const columns = [
            {
                key: 'assetCode',
                dataIndex: 'assetCode',
                title: t('common:asset'),
                align: 'left',
                width: 150,
                fixed: width >= 992 ? 'none' : 'left',
                render: (v, item) => (
                    <div className="flex items-center gap-4">
                        <AssetLogo assetCode={v} size={32} />
                        <div className="flex flex-col space-y-1">
                            <span className="font-semibold text-sm">{v}</span>
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
                width: 213,
                render: (v, item) => (
                    <span className="whitespace-nowrap">
                        {state.hideAsset ? SECRET_STRING : v ? formatWallet(v, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}
                    </span>
                )
            },
            {
                key: 'futures_available',
                dataIndex: 'futures_available',
                title: t('common:available_balance'),
                align: 'right',
                width: 213,
                render: (v, item) => (
                    <span className="whitespace-nowrap">
                        {state.hideAsset ? SECRET_STRING : v ? formatWallet(v, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}
                    </span>
                )
            },
            {
                key: 'wallet.locked_value',
                dataIndex: ['wallet', 'locked_value'],
                title: t('common:in_order'),
                align: 'right',
                width: 213,
                render: (v, item) => {
                    let lockedValue = formatWallet(v, item?.assetDigit, 0, true);
                    if (lockedValue === 'NaN') {
                        lockedValue = '0.0000';
                    }

                    return (
                        <span className="whitespace-nowrap">
                            {state.hideAsset ? (
                                SECRET_STRING
                            ) : v ? (
                                <Link href={PATHS.FUTURES.TRADE.DEFAULT}>
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
                width: 213,
                render: (v, item) => {
                    const assetUsdRate = usdRate?.[item?.id] || 0;
                    const btcUsdRate = usdRate?.['9'] || 0;

                    const totalUsd = v * assetUsdRate;
                    const totalBtc = totalUsd / btcUsdRate;

                    return (
                        <div>
                            {assetUsdRate ? (
                                <>
                                    <div className="whitespace-nowrap">
                                        {state.hideAsset ? SECRET_STRING : totalBtc ? formatWallet(totalBtc, estBtc?.assetDigit || 8) : '0.0000'}
                                    </div>
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark font-medium whitespace-nowrap">
                                        ({state.hideAsset ? '$' + SECRET_STRING : totalUsd > 0 ? ' ≈ $' + formatWallet(totalUsd, 2) : '$0.0000'})
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
                width: 137,
                fixed: width >= 992 ? 'right' : 'none',
                render: (v, item) => {
                    return renderOperationLink(item?.assetCode, t, dispatch);
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
                noBorder={true}
                isSearch={!!state.search}
                height={404}
                pagingClassName="border-none"
                className="border border-divider dark:border-divider-dark rounded-xl pt-4 mt-8"
                tableStyle={{ fontSize: '16px', padding: '16px' }}
            />
            // <div className="mt-8 py-4 border border-divider-dark dark:border-divider-dark rounded-xl">
            // </div>
        );
    }, [state.tableData, width, usdRate, state.hideAsset]);

    const renderEstWallet = useCallback(() => {
        return (
            <div className="mt-[24px] md:mt-12 flex items-center justify-between">
                <div className="hidden md:flex rounded-full dark:bg-listItemSelected-dark w-[64px] h-[64px] items-center justify-center mr-6">
                    <SvgWalletFutures size={32} />
                </div>
                <div>
                    <div className="font-semibold text-[20px] leading-[28px] md:text-[32px] md:leading-[38px] dark:text-txtPrimary-dark text-txtPrimary">
                        {state.hideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)} BTC
                    </div>
                    <div className="font-normal text-sm md:text-base mt-1">
                        {state.hideAsset ? `${SECRET_STRING}` : `$${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)}`}
                    </div>
                </div>
                {/* <div>
                    <div className="font-semibold text-[20px] leading-[28px] md:text-[32px] md:leading-[38px] dark:text-txtPrimary-dark text-txtPrimary">
                        {state.hideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)}
                        BTC
                    </div>
                    <div className="font-normal text-sm md:text-base mt-1">
                        {state.hideAsset ? `${SECRET_STRING}` : `$${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)}`}
                    </div>
                </div> */}
            </div>
        );
    }, [state.hideAsset, currentTheme, estUsd, estBtc]);

    // Kha dung - dang dat lenh2
    const renderAvailableBalance = useCallback(() => {
        return (
            <div className={`font-semibold  grid grid-cols-2 mt-5 text-sm md:flex md:justify-start md:mt-8 md:text-base'}`}>
                <div className="flex flex-col md:flex-row pr-4 md:pr-8 md:items-center">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark text-xs leading-[16px] md:text-base font-normal">
                        {t('common:available_balance')}: &nbsp;
                    </span>
                    <span className="font-semibold mt-2 md:mt-0">
                        {state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.value, estBtc?.assetDigit, estBtc?.value ? 0 : 8)} BTC
                    </span>
                </div>
                <div className="pl-4 border-l border-divider dark:border-divider-dark md:flex md:border-none md:items-center">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark text-xs leading-[16px] md:text-base font-normal">
                        {t('common:in_order')}: &nbsp;
                    </div>
                    <div className="font-semibold mt-2 md:mt-0">
                        {state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.locked, estBtc?.assetDigit, estBtc?.locked ? 0 : 8, true)} BTC
                    </div>
                </div>
            </div>

            // <div className="flex pt-8 gap-12">
            //     <div>
            //         <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:available_balance')}: </span>{' '}
            //         <span className="font-semibold">
            //             {state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.value, estBtc?.assetDigit, estBtc?.value ? 0 : 8)} BTC
            //         </span>
            //     </div>
            //     <div>
            //         <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:in_order')}: </span>{' '}
            //         <span className="font-semibold">
            //             {state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.locked, estBtc?.assetDigit, estBtc?.locked ? 0 : 8, true)} BTC
            //         </span>
            //     </div>
            // </div>
        );
    }, [estBtc, state.hideAsset, currentTheme]);

    useEffect(() => {
        walletMapper(wallets, assetConfig);
    }, [wallets, assetConfig]);

    useEffect(() => {
        if (state.allAssets && Array.isArray(state.allAssets)) {
            let tableData = state.allAssets;

            const minSmallBalance = 0;
            if (state.hideSmallAsset) {
                tableData = tableData.filter((item) => item?.wallet?.value > minSmallBalance);
            }

            if (state.search) {
                tableData = tableData.filter(
                    (item) =>
                        item?.assetCode?.toUpperCase().includes(state.search?.toUpperCase()) ||
                        item?.assetName?.toUpperCase().includes(state.search?.toUpperCase())
                );
            }
            tableData && setState({ tableData });
        }
    }, [usdRate, marketWatch, state.allAssets, state.hideSmallAsset, state.search]);

    return (
        <div>
            <MCard
                addClass={`mt-5 !p-8 rounded-xl 
             ${currentTheme === THEME_MODE.DARK ? ' bg-bgTabInactive-dark border border-divider-dark' : ' bg-white shadow-card_light border-none'}`}
            >
                <div className="text-base border-b border-divider dark:border-divider-dark pb-5 md:pb-8 flex justify-between items-end">
                    <div>
                        <EstBalance onClick={() => setState({ hideAsset: !state.hideAsset })} isHide={state.hideAsset} isSmallScreen={isSmallScreen} />
                        {renderEstWallet()}
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-end justify-end h-full w-full ">
                            <ButtonV2
                                onClick={() => dispatch(setTransferModal({ isVisible: true }))}
                                // disabled={placing || currentExchangeConfig?.status === 'MAINTAIN' || isError}
                                className="px-6 py-3 !font-semibold !text-base"
                            >
                                {t('common:transfer')}
                            </ButtonV2>
                        </div>
                    </div>
                </div>
                {renderAvailableBalance()}
            </MCard>
            <ButtonV2
                onClick={() => dispatch(setTransferModal({ isVisible: true }))}
                // disabled={placing || currentExchangeConfig?.status === 'MAINTAIN' || isError}
                className="py-3 !font-semibold !text-base w-full md:hidden mt-6"
            >
                {t('common:transfer')}
            </ButtonV2>

            <div className="mt-12 md:mt-16 flex items-center justify-between">
                <div className="t-common-v2 hidden md:block">Futures</div>
                {isSmallScreen ? (
                    <div className="w-full flex items-center justify-between">
                        <SearchBoxV2
                            value={state.search}
                            onChange={(value) => {
                                setState({ search: value });
                            }}
                            onFocus={() => setState({ currentPage: 1 })}
                            wrapperClassname="w-[180px]"
                            placeholder={t('common:search_asset')}
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
                            placeholder={t('common:search_asset')}
                        />
                    </div>
                )}
            </div>

            {renderAssetTable()}
        </div>
    );
};

const ASSET_ROW_LIMIT = 8;

const ROW_LOADING_SKELETON = {
    asset: <Skeletor width={65} />,
    total: <Skeletor width={65} />,
    available: <Skeletor width={65} />,
    in_order: <Skeletor width={65} />,
    operation: <Skeletor width={125} />
};

const renderOperationLink = (assetName, translator, dispatch) => {
    return (
        <ButtonV2
            variants="text"
            onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT, asset: assetName }))}
            className="!text-base"
        >
            {translator('common:transfer')}
        </ButtonV2>
    );
};

export default FuturesWallet;
