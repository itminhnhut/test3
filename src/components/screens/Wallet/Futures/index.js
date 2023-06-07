import { useCallback, useEffect, useState } from 'react';
import { formatNumber as formatWallet, setTransferModal } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { SECRET_STRING } from 'utils';

import useWindowSize from 'hooks/useWindowSize';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import MCard from 'components/common/MCard';
import AssetLogo from 'components/wallet/AssetLogo';
import { orderBy } from 'lodash';
import { WalletType } from 'redux/actions/const';
import Link from 'next/link';
import { PATHS } from 'constants/paths';
import SvgWalletFutures from 'components/svg/SvgWalletFutures';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TableV2 from 'components/common/V2/TableV2';
import HideSmallBalance from 'components/common/HideSmallBalance';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import EstBalance from 'components/common/EstBalance';
import NoData from 'components/common/V2/TableV2/NoData';
import { LANGUAGE_TAG } from 'hooks/useLanguage';
import { PortfolioIcon } from 'components/svg/SvgIcon';

const INITIAL_STATE = {
    hideSmallAsset: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    allAssets: null
};

const AVAILBLE_KEY = 'futures_available';
const FUTURES_ASSET = ['VNDC', 'NAMI', 'NAC', 'USDT'];

const FuturesWallet = ({ estBtc, estUsd, usdRate, marketWatch, isSmallScreen, isHideAsset, setIsHideAsset }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Rdx
    const wallets = useSelector((state) => state.wallet.FUTURES);
    const assetConfig = useSelector((state) => state.utils.assetConfig) || null;

    // Use Hooks
    const [currentTheme] = useDarkMode();
    const { width } = useWindowSize();
    const {
        t,
        i18n: { language }
    } = useTranslation();
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
        if (isSmallScreen) return null;
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
                        {isHideAsset ? SECRET_STRING : v ? formatWallet(v, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}
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
                        {isHideAsset ? SECRET_STRING : v ? formatWallet(v, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}
                    </span>
                )
            },
            {
                key: 'wallet.locked_value',
                dataIndex: ['wallet', 'locked_value'],
                title: t('wallet:locked'),
                align: 'right',
                width: 213,
                render: (v, item) => {
                    let lockedValue = formatWallet(v, item?.assetDigit, 0, true);
                    if (lockedValue === 'NaN') {
                        lockedValue = '0.0000';
                    }

                    return (
                        <span className="whitespace-nowrap">
                            {isHideAsset ? (
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
                                        {isHideAsset ? SECRET_STRING : totalBtc ? formatWallet(totalBtc, estBtc?.assetDigit || 8) : '0.0000'}
                                    </div>
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
                width: 137,
                fixed: 'right',
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
    }, [state.tableData, width, usdRate, isHideAsset]);

    const renderEstWallet = useCallback(() => {
        return (
            <div className="mt-[24px] md:mt-12 flex items-center justify-between">
                <div className="hidden md:flex rounded-full dark:bg-dark-2 w-[64px] h-[64px] items-center justify-center mr-6">
                    <SvgWalletFutures size={32} />
                </div>
                <div>
                    <div className="t-common-v2">{isHideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)} BTC</div>
                    <div className="font-normal text-sm md:text-base mt-1">
                        {isHideAsset ? `${SECRET_STRING}` : `$${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)}`}
                    </div>
                </div>
            </div>
        );
    }, [isHideAsset, currentTheme, estUsd, estBtc]);

    // Kha dung - dang dat lenh2
    const renderAvailableBalance = useCallback(() => {
        return (
            <div className="txtPri-1 grid grid-cols-2 mt-5 md:flex md:justify-start md:mt-8">
                <div className="flex flex-col md:flex-row pr-4 md:pr-8 md:items-center">
                    <span className="txtSecond-1">{t('common:available_balance')}: &nbsp;</span>
                    <span className="mt-2 md:mt-0">
                        {isHideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.value, estBtc?.assetDigit, estBtc?.value ? 0 : 8)} BTC
                    </span>
                </div>
                <div className="pl-4 border-l border-divider dark:border-divider-dark md:flex md:border-none md:items-center">
                    <div className="txtSecond-1">{t('wallet:locked')}: &nbsp;</div>
                    <div className="mt-2 md:mt-0">
                        {isHideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.locked, estBtc?.assetDigit, estBtc?.locked ? 0 : 8, true)} BTC
                    </div>
                </div>
            </div>
        );
    }, [estBtc, isHideAsset, currentTheme]);

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
                        <EstBalance onClick={() => setIsHideAsset(!isHideAsset)} isHide={isHideAsset} isSmallScreen={isSmallScreen} />
                        {renderEstWallet()}
                    </div>

                    <div className="hidden md:block">
                        <div className="flex space-x-3 justify-end h-full w-full">
                            <ButtonV2
                                onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT }))}
                                // disabled={placing || currentExchangeConfig?.status === 'MAINTAIN' || isError}
                                className="px-6 py-3 !font-semibold !text-base"
                            >
                                {t('common:transfer')}
                            </ButtonV2>

                            <Link href={'/statistics'} passHref>
                                <a className="block">
                                    <ButtonV2 variants="secondary" className="px-6 py-3 !space-x-2 !font-semibold !text-base !w-auto">
                                        <PortfolioIcon size={16} />

                                        <span>{t('wallet:statistics')}</span>
                                    </ButtonV2>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                {renderAvailableBalance()}
            </MCard>
            <div className="flex items-center space-x-3 md:hidden  mt-6">
                <ButtonV2
                    onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT }))}
                    // disabled={placing || currentExchangeConfig?.status === 'MAINTAIN' || isError}
                    className="py-3 !font-semibold !text-base w-full"
                >
                    {t('common:transfer')}
                </ButtonV2>
                <Link href={'/statistics'} passHref>
                    <a className="block w-full">
                        <ButtonV2 variants="secondary" className="py-3 !space-x-2 !font-semibold !text-base w-full">
                            <PortfolioIcon size={16} />
                            <span>{t('wallet:statistics')}</span>
                        </ButtonV2>
                    </a>
                </Link>
            </div>

            <div className="mt-12 md:mt-16 flex items-center justify-between">
                <div className="t-common-v2 hidden md:block">
                    {language === LANGUAGE_TAG.VI ? 'Ví' : ''} {t('wallet:nami_futures_short')}
                </div>
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

            <div className="hidden md:block">{renderAssetTable()}</div>
            <div className="md:hidden flex flex-col gap-4 mt-4 mb-20 text-sm dark:text-gray-4 text-gray-15">
                {state?.tableData && state?.tableData?.length > 0 ? (
                    <>
                        {state.tableData.map((item, index) => {
                            const { assetCode, assetDigit, assetName, available, id, wallet } = item;
                            const assetUsdRate = usdRate?.[id] || 0;
                            const totalUsd = wallet.value * assetUsdRate;
                            const hidden = index + 1 > state.currentPage * ASSET_ROW_LIMIT;

                            return (
                                <div key={`CARD_ROW_${item?.assetCode}`} className="w-full flex flex-col p-4 gap-4 bg-gray-13 dark:bg-dark-4 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <AssetLogo assetCode={assetCode} size={32} />
                                            <span className="font-semibold mr-2 ml-3">{assetCode}</span>
                                            <span className="txtSecond-1">{assetName}</span>
                                        </div>
                                        <div className="cursor-pointer">{renderOperationLink(assetCode, t, dispatch)}</div>
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
                                            <span className="txtSecond-2">{t('wallet:locked')}</span>
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
        </div>
    );
};

const ASSET_ROW_LIMIT = 8;

const renderOperationLink = (assetName, translator, dispatch) => {
    return (
        <ButtonV2
            variants="text"
            onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT, asset: assetName }))}
            className="!md:text-base text-sm"
        >
            {translator('common:transfer')}
        </ButtonV2>
    );
};

export default FuturesWallet;
