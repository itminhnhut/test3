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
import { RETABLE_SORTBY } from 'components/common/ReTable';
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

const INITIAL_STATE = {
    hideAsset: false,
    hideSmallAsset: false,
    tableData: null,
    search: '',
    currentPage: 1,
    action: null, // action = null is wallet overview
    allAssets: null
};

const AVAILBLE_KEY = 'partners_available';
const PARTNERS_ASSET = ['VNDC', 'NAMI', 'NAC', 'USDT'];

const PartnersWallet = ({ estBtc, estUsd, usdRate, marketWatch }) => {
    // Init State
    const [state, set] = useState(INITIAL_STATE);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Rdx
    const wallets = useSelector((state) => state.wallet.PARTNERS);
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
            const partners = assetConfig.filter((o) => PARTNERS_ASSET.includes(o?.assetCode));
            partners &&
                partners.forEach(
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
                key: 'wallet',
                dataIndex: ['wallet', 'value'],
                title: t('common:total'),
                align: 'right',
                width: 213,
                render: (v, item) => (
                    <span className="whitespace-nowrap">{v ? formatWallet(v, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}</span>
                )
            },
            {
                key: 'partners_available',
                dataIndex: 'partners_available',
                title: t('common:available_balance'),
                align: 'right',
                width: 213,
                render: (v, item) => (
                    <span className="whitespace-nowrap">{v ? formatWallet(v, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}</span>
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
                            {v
                                ? // <Link href={PATHS.FUTURES.TRADE.DEFAULT}>
                                  //     <a className="hover:text-dominant hover:!underline">{lockedValue}</a>
                                  // </Link>
                                  lockedValue
                                : '0.0000'}
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
                                    <div className="whitespace-nowrap">{totalBtc ? formatWallet(totalBtc, estBtc?.assetDigit || 8) : '0.0000'}</div>
                                    <div className="text-txtSecondary dark:text-txtSecondary-dark font-medium whitespace-nowrap">
                                        ({totalUsd > 0 ? ' ≈ $' + formatWallet(totalUsd, 2) : '$0.0000'})
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
            // <div className="mt-8 border border-divider-dark dark:border-divider-dark rounded-xl">
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
                tableStyle={{ fontSize: '16px', padding: '16px' }}
                className="border border-divider dark:border-divider-dark rounded-xl pt-4 mt-8"
            />
            // </div>
        );
    }, [state.tableData, width, usdRate]);

    const renderEstWallet = useCallback(() => {
        return (
            <div className="flex items-center mt-12">
                <div className="rounded-full p-4 bg-teal-lightTeal dark:bg-teal-5 h-full flex items-center justify-center">
                    <SvgWalletFutures size={32} />
                </div>
                <div className="ml-6 dark:text-txtPrimary-dark text-txtPrimary md:min-h-[64px] flex flex-col justify-center">
                    <div className="font-semibold text-[32px] leading-[38px] dark:text-txtPrimary-dark text-txtPrimary">
                        <span className="mr-1.5">{state.hideAsset ? SECRET_STRING : formatWallet(estBtc?.totalValue, estBtc?.assetDigit)}</span>
                        <span>BTC</span>
                    </div>
                    <div className="font-normal text-base mt-1">
                        {state.hideAsset ? `${SECRET_STRING}` : `$${formatWallet(estUsd?.totalValue, estUsd?.assetDigit)}`}
                    </div>
                </div>
            </div>
        );
    }, [state.hideAsset, currentTheme, estUsd, estBtc]);

    // Kha dung - dang dat lenh2
    const renderAvailableBalance = useCallback(() => {
        return (
            <div className="flex pt-8 gap-12">
                <div>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:available_balance')}: </span>{' '}
                    <span className="font-semibold">
                        {state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.value, estBtc?.assetDigit, estBtc?.value ? 0 : 8)} BTC
                    </span>
                </div>
                <div>
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('common:in_order')}: </span>{' '}
                    <span className="font-semibold">
                        {state.hideAsset ? `${SECRET_STRING}` : formatWallet(estBtc?.locked, estBtc?.assetDigit, estBtc?.locked ? 0 : 8, true)} BTC
                    </span>
                </div>
            </div>
        );
    }, [estBtc, state.hideAsset, currentTheme]);

    useEffect(() => {
        walletMapper(wallets, assetConfig);
    }, [wallets, assetConfig]);

    useEffect(() => {
        if (state.allAssets && Array.isArray(state.allAssets)) {
            // const origin = dataHandler(state.allAssets, t, dispatch, {
            //     usdRate,
            //     marketWatch,
            //     btcAssetDigit: estBtc?.assetDigit
            // });
            let tableData = state.allAssets;
            if (state.hideSmallAsset) {
                tableData = tableData.filter((item) => item?.wallet?.value > 1);
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
            <MCard addClass="mt-5 !p-6 xl:!p-8 dark:!bg-bgTabInactive-dark !dark:bg-namiV2 rounded-xl border border-divider dark:border-none">
                <div className="flex flex-col sm:flex-row sm:gap-0 gap-3 sm:items-end sm:justify-between text-base border-b border-divider dark:border-divider-dark pb-8">
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

                    <div className="">
                        <div className="flex items-end justify-end h-full w-full sm:w-auto">
                            <ButtonV2
                                onClick={() => dispatch(setTransferModal({ isVisible: true }))}
                                // disabled={placing || currentExchangeConfig?.status === 'MAINTAIN' || isError}
                                // className={isBuy ? 'bg-teal' : 'bg-red'}
                                className="!px-6 !py-3"
                            >
                                {t('common:transfer')}
                            </ButtonV2>

                            {/* <div
                                className="py-1.5 md:py-2 text-center w-[30%] max-w-[100px] sm:w-[100px] mr-2 sm:mr-0 sm:ml-2 rounded-md font-medium text-xs xl:text-sm cursor-pointer
                                    text-txtSecondary dark:text-txtSecondary-dark hover:!bg-dominant dark:bg-dark-2 hover:!text-white
                                 "
                                onClick={() => dispatch(setTransferModal({ isVisible: true }))}
                            >
                                {t('common:transfer')}
                            </div> */}
                        </div>
                    </div>
                </div>
                {renderAvailableBalance()}
            </MCard>

            <div className="mt-16 sm:flex sm:items-end sm:justify-between">
                <div className="t-common-v2">{t('common:partners')}</div>
                <div className="flex items-center justify-between mt-4 sm:mt-0">
                    <HideSmallBalance
                        onClick={() =>
                            setState({
                                hideSmallAsset: !state.hideSmallAsset
                            })
                        }
                        isHide={state.hideSmallAsset}
                        className="mr-8"
                    />
                    <div className="py-2 px-3 sm:mt-0 lg:w-96 flex items-center rounded-md bg-gray-5 dark:bg-dark-2">
                        <Search size={width >= 768 ? 20 : 16} className="text-txtSecondary dark:text-txtSecondary-dark" />
                        <input
                            className="text-sm w-full px-2.5"
                            value={state.search}
                            onChange={(e) => setState({ search: e?.target?.value })}
                            onFocus={() => setState({ currentPage: 1 })}
                            placeholder={t('common:search')}
                        />
                        {state.search && <X size={width >= 768 ? 20 : 16} className="cursor-pointer" onClick={() => setState({ search: '' })} />}
                    </div>
                </div>
            </div>

            {renderAssetTable()}
        </div>
    );
};

const ASSET_ROW_LIMIT = 8;

const dataHandler = (data, translator, dispatch, utils) => {
    if (!data || !data?.length) {
        const skeleton = [];
        for (let i = 0; i < ASSET_ROW_LIMIT; ++i) {
            skeleton.push({ ...ROW_LOADING_SKELETON, key: `asset_loading__skeleton_${i}` });
        }
        return skeleton;
    }

    const result = [];

    data.forEach((item) => {
        let lockedValue = formatWallet(item?.wallet?.locked_value, item?.assetDigit, 0, true);
        if (lockedValue === 'NaN') {
            lockedValue = '0.0000';
        }

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
                <span className="whitespace-nowrap">
                    {item?.wallet?.value ? formatWallet(item?.wallet?.value, item?.assetCode === 'USDT' ? 2 : item?.assetDigit) : '0.0000'}
                </span>
            ),
            available: (
                <span className="whitespace-nowrap">
                    {item?.wallet?.value - item?.wallet?.locked_value
                        ? formatWallet(item?.wallet?.value - item?.wallet?.locked_value, item?.assetCode === 'USDT' ? 2 : item?.assetDigit)
                        : '0.0000'}
                </span>
            ),
            in_order: (
                <span className="whitespace-nowrap">
                    {item?.wallet?.locked_value ? (
                        <Link href={PATHS.PARTNERS.TRADE.DEFAULT}>
                            <a className="hover:text-dominant hover:!underline">{lockedValue}</a>
                        </Link>
                    ) : (
                        '0.0000'
                    )}
                </span>
            ),
            btc_value: (
                <div>
                    {assetUsdRate ? (
                        <>
                            <div className="whitespace-nowrap">{totalBtc ? formatWallet(totalBtc, utils?.btcAssetDigit || 8) : '0.0000'}</div>
                            <div className="text-txtSecondary dark:text-txtSecondary-dark font-medium whitespace-nowrap">
                                ({totalUsd > 0 ? ' ≈ $' + formatWallet(totalUsd, 2) : '$0.0000'})
                            </div>
                        </>
                    ) : (
                        '--'
                    )}
                </div>
            ),
            operation: renderOperationLink(item?.assetName, translator, dispatch),
            [RETABLE_SORTBY]: {
                asset: item?.assetName,
                total: +item?.wallet?.value,
                available: +item?.wallet?.value - +item?.wallet?.locked_value,
                in_order: item?.wallet?.locked_value
            }
        });
    });

    return result;
};

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
            onClick={() => dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.PARTNERS, toWallet: WalletType.SPOT, asset: assetName }))}
            className="!text-base"
        >
            {translator('common:transfer')}
        </ButtonV2>
    );
};

export default PartnersWallet;
