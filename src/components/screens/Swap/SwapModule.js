import NumberFormat from 'react-number-format';
import AssetLogo from 'src/components/wallet/AssetLogo';
import fetchAPI from 'utils/fetch-api';
import colors from 'styles/colors';
import * as Error from '../../../redux/actions/apiError';
import Skeletor from 'src/components/common/Skeletor';
import useOutsideClick from 'hooks/useOutsideClick';
import { WalletType } from 'redux/actions/const';
import { EXCHANGE_ACTION } from 'pages/wallet';

import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAsync, useDebounce } from 'react-use';
import { Trans, useTranslation } from 'next-i18next';
import { find, orderBy, uniqBy } from 'lodash';
import {
    formatPrice,
    formatSwapRate,
    formatWallet,
    getDecimalScale,
    getLoginUrl,
    countDecimals,
    walletLinkBuilder,
    safeToFixed,
    dwLinkBuilder
} from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { ApiStatus } from 'redux/actions/const';
import { PATHS } from 'constants/paths';
import { roundToDown } from 'round-to';
import router from 'next/router';
import ModalV2 from 'components/common/V2/ModalV2';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import HrefButton from 'components/common/V2/ButtonV2/HrefButton';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';

// import SVG
import SvgAddCircle from 'components/svg/SvgAddCircle';
import SwapWarning from 'components/svg/SwapWarning';
import { CloseIcon, SyncAltIcon, ArrowDropDownIcon } from 'components/svg/SvgIcon';
import NoData from 'components/common/V2/TableV2/NoData';
import styled from 'styled-components';
import SearchBoxV2 from 'components/common/SearchBoxV2';
import { TYPE_DW } from '../WithdrawDeposit/constants';
import { SIDE } from 'redux/reducers/withdrawDeposit';
import { formatNumber } from 'utils/reference-utils';

const FEE_RATE = 0 / 100;
const DEBOUNCE_TIMEOUT = 500;

const DEFAULT_PAIR = {
    fromAsset: 'VNDC',
    toAsset: 'USDT'
};
const REJECT_PREORDER = ['BROKER_ERROR', 'PRICE_CHANGED', 'INVALID_SWAP_REQUEST_ID', 'INSTRUMENT_NOT_LISTED_FOR_TRADING_YET'];

const fromAssetRef = createRef();
const toAssetRef = createRef();

const SwapModule = ({ width, pair }) => {
    // Init State
    const [state, set] = useState({
        init: false,
        loading: false,
        swapConfigs: null,
        estRate: null,
        loadingEstRate: false,
        shouldRefreshRate: false,
        preOrder: null,
        loadingPreOrder: false,
        processingOrder: false,
        invoiceId: null,
        fromAsset: DEFAULT_PAIR.fromAsset,
        fromAmount: null,
        fromAssetList: null,
        toAsset: DEFAULT_PAIR.toAsset,
        toAmount: null,
        toAssetList: null,
        fromErrors: {},
        toErrors: {},
        focus: 'from',
        search: '',
        inputHighlighted: null,
        changeEstRatePosition: false,
        openAssetList: {},
        openModal: false,
        resultSwap: null
        //... Add new state here
    });
    const [swapTimer, setSwapTimer] = useState(null);
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Get state from Rdx
    const wallets = useSelector((state) => state.wallet.SPOT);
    const auth = useSelector((state) => state.auth?.user);
    const assetConfig = useSelector((state) => state.utils.assetConfig);

    // Refs
    const fromAssetListRef = useRef();
    const toAssetListRef = useRef();
    const fromAssetBtnRef = useRef();
    const toAssetBtnRef = useRef();
    // const cancelBtnRef = useRef()

    // Memmoized Variable
    // CURRENT SWAP PAIRS CONFIG
    const config = useMemo(() => {
        return find(state.swapConfigs, (sw) => sw?.fromAsset === state.fromAsset && sw?.toAsset === state.toAsset) || {};
    }, [state.swapConfigs, state.fromAsset, state.toAsset]);

    // AVAILABEL ASSET
    const availabelAsset = useMemo(() => {
        if (!config || !wallets) return { fromAsset: 0, toAsset: 0 };
        return {
            fromAsset: wallets?.[config?.fromAssetId]?.value - wallets?.[config?.fromAssetId]?.locked_value,
            toAsset: wallets?.[config?.toAssetId]?.value - wallets?.[config?.toAssetId]?.locked_value
        };
    }, [config, wallets]);

    // Use Hooks
    const {
        t,
        i18n: { language }
    } = useTranslation(['navbar', 'common', 'error', 'convert', 'wallet']);

    useOutsideClick(fromAssetListRef, () => state.openAssetList?.from && setState({ openAssetList: { from: false }, search: '' }));
    useOutsideClick(toAssetListRef, () => state.openAssetList?.to && setState({ openAssetList: { to: false }, search: '' }));

    // Helper
    const fetchEstimateRate = async (requestQty, requestAsset, updateQty = true) => {
        if (!(requestQty && requestAsset)) return;
        setState({ loadingEstRate: true, estRate: null });

        const result = await fetchAPI({
            url: '/api/v3/swap/estimate_price',
            options: {
                method: 'GET'
            },
            params: {
                fromAsset: state.fromAsset,
                toAsset: state.toAsset,
                requestQty: +requestQty,
                requestAsset
            }
        });

        const { status, data } = result;
        data && setState({ estRate: data });
        if (status === ApiStatus.SUCCESS && updateQty) {
            if (requestAsset === state.fromAsset) {
                setState({ toAmount: +roundToDown(requestQty * data?.price, 10) });
            }
            if (requestAsset === state.toAsset) {
                setState({ fromAmount: requestQty / data?.price });
            }
        } else {
            switch (status) {
                case 'SWAP_CANNOT_ESTIMATE_PRICE':
                    setState({ toErrors: { not_found: t('convert:est_rate_not_found') } });
                    break;
                case 'TRADE_NOT_ALLOWED':
                    setState({ toErrors: { not_found: t('convert:est_rate_not_found') } });
                    break;
                default:
            }
        }

        setState({ loadingEstRate: false, shouldRefreshRate: false });
    };

    const fetchPreSwapOrder = async (fromAsset, toAsset, fromQty) => {
        setState({ loadingEstRate: true, loadingPreOrder: true, preOrder: null });

        const { status, data, code } = await fetchAPI({
            url: '/api/v3/swap/pre_order',
            options: {
                method: 'POST'
            },
            params: {
                fromAsset,
                toAsset,
                fromQty
            }
        });

        if (status === ApiStatus.SUCCESS && data) {
            setState({ preOrder: data, shouldRefreshRate: false });
            setSwapTimer(data?.swapTimeout);
            setTimeout(() => setState({ openModal: true }), 200);
        } else {
            const e = find(Error, { code });
            const msg = e ? t(`error:${e?.message}`) : t('error:COMMON_ERROR');

            onOpenAlertResultSwap({
                msg: `(${code}) ${msg}`,
                type: 'warning',
                title: t('common:failure')
            });
        }

        setState({ loadingEstRate: false, loadingPreOrder: false });
    };

    const onConfirmOrder = async (preOrderId) => {
        setState({ processingOrder: true });
        const result = await fetchAPI({
            url: '/api/v3/swap/confirm_order',
            options: {
                method: 'POST'
            },
            params: { preOrderId }
        });
        setState({ processingOrder: false });

        if (result?.status === ApiStatus.SUCCESS && result?.data) {
            const { displayingId, fromAsset, toAsset, fromQty, toQty } = result?.data;
            let msg = t('convert:swap_success', { fromQty, fromAsset, toQty, toAsset });

            setState({ openModal: false, preOrder: null, invoiceId: displayingId });
            onOpenAlertResultSwap({
                msg: msg,
                type: 'success',
                title: t('common:success'),
                duration: 3200
            });
        } else {
            const error = find(Error, { code: result?.code });

            if (REJECT_PREORDER.includes(error.message)) {
                setTimeout(() => setState({ openModal: false }), 200);
            }

            const description = error ? t(`error:${error.message}`) : t('error:COMMON_ERROR');
            onOpenAlertResultSwap({
                msg: `(${result?.code}) ${description}`,
                type: 'warning',
                title: t('common:failure')
            });
            setSwapTimer(null);
        }
    };

    const onClickFromAsset = (fromAsset) => {
        if (!state.swapConfigs?.length || fromAsset === state.fromAsset) {
            setState({ openAssetList: {} });
            return;
        }

        setState({ fromAsset, search: '', fromErrors: {}, openAssetList: {} });
        fromAssetBtnRef?.current?.click();

        let result = state.swapConfigs.filter((sw) => sw?.fromAsset === fromAsset);
        if (result) {
            result = result.map((r) => ({
                ...r,
                available: wallets?.[r.toAssetId]?.value - wallets?.[r?.toAssetId]?.locked_value
            }));

            result = orderBy(result, ['available', 'toAsset'], ['desc', 'asc']);
            if (result?.length) {
                setState({ toAsset: result[0]?.toAsset });
            }
        }
    };

    const onClickToAsset = (toAsset) => {
        setState({ toAsset, search: '', toErrors: {}, openAssetList: {} });
        toAssetBtnRef?.current?.click();
    };

    const onReverse = () => {
        if (state.focus === 'from') {
            fromAssetRef?.current?.focus();
        } else {
            toAssetRef?.current?.focus();
        }

        const bridge = state.fromAmount;
        setState({
            fromAmount: state.toAmount,
            toAmount: bridge,
            fromAsset: state.toAsset,
            toAsset: state.fromAsset
        });
    };

    const onMaximumQty = (mode = 'from', availableAsset) => {
        if (!availableAsset) return;
        const _qty = availableAsset;
        // const limitMaxQty = config.filters?.[0].maxQty

        if (mode === 'from') {
            if (!_qty > 0) return;
            let max = +_qty;
            if (state.fromAsset === config?.displayPriceAsset) {
                max = +_qty * (1 - FEE_RATE);
            }
            setState({ fromAmount: safeToFixed(max, getDecimalScale(+config.filters?.[0].stepSize)) });
        }

        if (mode === 'to') {
            if (!_qty > 0) return;
            let max = +_qty;
            if (state.toAsset === config?.displayPriceAsset) {
                max = +_qty * (1 - FEE_RATE);
            }
            setState({ toAmount: safeToFixed(max, getDecimalScale(+config.filters?.[0].stepSize)) });
        }
    };

    const onCloseSwapModal = () => {
        setState({ openModal: false, preOrder: null, invoiceId: null });
        setSwapTimer(null);
    };

    // Render Handler
    const handleDepositIconBtn = useCallback(() => {
        if (!auth) {
            // router.push(getLoginUrl('sso', 'login'));
        } else {
            // router.push(walletLinkBuilder(WalletType.SPOT, EXCHANGE_ACTION.DEPOSIT, { type: 'crypto', asset: state?.fromAsset || 'USDT' }));
            router.push(dwLinkBuilder(TYPE_DW.CRYPTO, SIDE.BUY, state?.fromAsset));
        }
    }, [state.fromAsset, auth]);

    const renderFromInput = useCallback(() => {
        const decimalInput = getDecimalScale(+config.filters?.[0].stepSize);
        return (
            <div className="flex items-center justify-between bg-transparent font-semibold text-base">
                <div className="flex items-center justify-between">
                    <NumberFormat
                        thousandSeparator
                        allowNegative={false}
                        getInputRef={fromAssetRef}
                        className="w-full text-left txtPri-3 placeholder-shown:text-txtSecondary dark:placeholder-shown:text-txtSecondary-dark"
                        value={state.fromAmount}
                        onFocus={() => setState({ focus: 'from', inputHighlighted: 'from' })}
                        onBlur={() => setState({ inputHighlighted: null })}
                        onValueChange={({ value }) => setState({ fromAmount: value })}
                        placeholder={(0).toFixed(decimalInput >= 0 ? decimalInput : 4)}
                        decimalScale={decimalInput}
                    />

                    <button className={`border-r border-r-divider dark:border-r-divider-dark mr-3 pr-3 ${!!state.fromAmount ? 'visible' : 'invisible'}`}>
                        <CloseIcon onClick={() => setState({ fromAmount: '' })} size={width >= 768 ? 20 : 16} className="cursor-pointer" />
                    </button>
                </div>
                <div className="relative flex items-center justify-end">
                    <div className="uppercase cursor-pointer hover:opacity-50 text-teal" onClick={() => onMaximumQty('from', availabelAsset?.fromAsset)}>
                        max
                    </div>
                    <div className="mx-3 w-[1px] bg-divider dark:bg-divider-dark h-6" />
                    <div
                        className="flex items-center cursor-pointer select-none"
                        onClick={() => setState({ openAssetList: { from: !state.openAssetList?.from } })}
                    >
                        <AssetLogo assetCode={state.fromAsset} size={24} />
                        <span className="mx-2 uppercase">{state.fromAsset}</span>
                        <span className={`transition-transform duration-50 ${state.openAssetList?.from && 'rotate-180'}`}>
                            <ArrowDropDownIcon size={16} />
                        </span>
                    </div>
                </div>
            </div>
        );
    }, [state.fromAsset, state.fromAmount, state.openAssetList, availabelAsset, config]);

    // Poppup choose from asset list
    const renderFromAssetList = useCallback(() => {
        if (!state.openAssetList?.from || !state.fromAssetList) return null;

        const assetItems = [];
        const data = state.fromAssetList;

        for (let i = 0; i < data?.length; ++i) {
            const { fromAsset, available, filters } = data?.[i];
            const currentAssetConfig = find(assetConfig, { assetCode: fromAsset });

            assetItems.push(
                <AssetItem
                    key={`asset_item___${i}`}
                    isChoosed={state.fromAsset === fromAsset}
                    onClick={() => onClickFromAsset(fromAsset)}
                    isDisabled={!available}
                >
                    <div className={`flex items-center  `}>
                        <div className={`${!available && 'opacity-20'} w-5 h-5`}>
                            <AssetLogo assetCode={fromAsset} size={20} />
                        </div>
                        <p className={`${!available && 'text-txtDisabled dark:text-txtDisabled-dark'}`}>
                            <span className={`mx-2 ${available && 'text-txtPrimary dark:text-txtPrimary-dark'}`}>{fromAsset}</span>
                            <span className="text-xs leading-4 text-left">{currentAssetConfig?.assetName}</span>
                        </p>
                    </div>
                    <div> {available ? formatNumber(available, currentAssetConfig?.assetDigit) : '0.0000'}</div>
                </AssetItem>
            );
        }

        return (
            <AssetList ref={fromAssetListRef}>
                <div className="px-4">
                    <SearchBoxV2
                        value={state.search}
                        onChange={(value) => {
                            setState({ search: value });
                        }}
                        width
                    />
                </div>
                <ul className="mt-6 max-h-[332px] overflow-y-auto">
                    {assetItems?.length ? (
                        assetItems
                    ) : (
                        <div className="flex items-center justify-center h-[332px]">
                            <NoData isSearch={!!state.search} />
                        </div>
                    )}
                </ul>
            </AssetList>
        );
    }, [state.fromAsset, state.fromAssetList, state.openAssetList, state.search, language]);

    const renderToInput = useCallback(() => {
        return (
            <div className="flex items-center justify-between font-semibold text-base">
                <div className="flex items-center justify-between">
                    <NumberFormat
                        thousandSeparator
                        allowNegative={false}
                        getInputRef={toAssetRef}
                        className="w-full text-left txtPri-3 placeholder-shown:text-txtSecondary dark:placeholder-shown:text-txtSecondary-dark"
                        value={state.toAmount}
                        onFocus={() => setState({ focus: 'to', inputHighlighted: 'to' })}
                        onBlur={() => setState({ inputHighlighted: null })}
                        onValueChange={({ value }) => setState({ toAmount: value })}
                        placeholder={(0).toFixed(find(assetConfig, { assetCode: state?.toAsset })?.assetDigit ?? 4)}
                    />
                </div>
                <div
                    className="mt-1 flex items-center cursor-pointer select-none"
                    onClick={() => setState({ openAssetList: { to: !state.openAssetList?.to } })}
                >
                    <button className={`border-r border-r-divider dark:border-r-divider-dark mr-3 pr-3 ${!!state.toAmount ? 'visible' : 'invisible'}`}>
                        <CloseIcon onClick={() => setState({ toAmount: '' })} size={width >= 768 ? 20 : 16} className="cursor-pointer" />
                    </button>
                    <AssetLogo assetCode={state.toAsset} size={24} />
                    <span className="mx-2 uppercase text-txtPrimary dark:text-txtPrimary-dark">{state.toAsset}</span>
                    <span className={`transition-transform duration-50 ${state.openAssetList?.to && 'rotate-180'}`}>
                        <ArrowDropDownIcon size={16} />
                    </span>
                </div>
            </div>
        );
    }, [state.toAsset, state.toAmount, state.openAssetList, availabelAsset]);

    const renderToAssetList = useCallback(() => {
        if (!state.openAssetList?.to || !state.toAssetList) return null;
        const assetItems = [];
        const data = state.toAssetList;

        for (let i = 0; i < data?.length; ++i) {
            const { toAsset, available, filters } = data?.[i];
            const currentAssetConfig = find(assetConfig, { assetCode: toAsset });

            assetItems.push(
                <AssetItem key={`to_asset_item___${i}`} isChoosed={state.toAsset === toAsset} onClick={() => onClickToAsset(toAsset)} isDisabled={false}>
                    <div className="flex items-center">
                            <div className="w-5 h-5">
                                <AssetLogo assetCode={toAsset} size={20} />
                            </div>
                        <p>
                            <span className={`mx-2 text-txtPrimary dark:text-txtPrimary-dark`}>{toAsset}</span>
                            <span className="text-xs leading-4 text-left">{currentAssetConfig?.assetName}</span>
                        </p>
                    </div>
                    <div> {available ? formatNumber(available, currentAssetConfig?.assetDigit) : '0.0000'}</div>
                </AssetItem>
            );
        }

        return (
            <AssetList ref={toAssetListRef}>
                <div className="px-4">
                    <SearchBoxV2
                        value={state.search}
                        onChange={(value) => {
                            setState({ search: value });
                        }}
                        width
                    />
                </div>
                <ul className="mt-6 max-h-[332px] overflow-y-auto">
                    {assetItems?.length ? (
                        assetItems
                    ) : (
                        <div className="flex items-center justify-center h-[332px]">
                            <NoData isSearch={!!state.search} />
                        </div>
                    )}
                </ul>
            </AssetList>
        );
    }, [state.toAsset, state.toAssetList, state.openAssetList, state.search, language]);

    const renderRate = useCallback(
        () => {
            let price = 0;

            const leftUnit = state.changeEstRatePosition ? state.toAsset : state.fromAsset;
            const rightUnit = state.changeEstRatePosition ? state.fromAsset : state.toAsset;

            if (state.loadingEstRate && !state.loadingPreOrder) {
                return <Skeletor width={100} />;
            }

            if (state.estRate?.price && state.estRate?.fromAsset === state.fromAsset && state.estRate?.toAsset === state.toAsset) {
                try {
                    price = state.changeEstRatePosition ? formatSwapRate(1 / +state.estRate?.price) : formatSwapRate(+state.estRate?.price);
                } catch (error) {
                    console.error('BigInt error', error, 'state: ', state);
                }
            }

            if (!state.fromAmount > 0) {
                return <span className="font-bold">---</span>;
            }

            if (!state.estRate || price === 0) {
                return <span className="font-bold">---</span>;
            }

            return (
                <span className="font-bold">
                    1<span className="ml-2">{leftUnit}</span>
                    <span className="mx-2">=</span>
                    <span className="mr-2">{price}</span>
                    <span>{rightUnit}</span>
                </span>
            );
        },
        [config, state.fromAsset, state.fromAmount, state.toAsset, state.estRate, state.changeEstRatePosition, state.loadingEstRate],
        state.fromErrors
    );

    const renderSwapBtn = useCallback(() => {
        if (!auth) {
            return (
                <HrefButton className="block mt-8 !w-full !max-w-none text-base !font-semibold" href={getLoginUrl('sso', 'login')} variants="primary">
                    {t('common:signin_now')}
                </HrefButton>
            );
        }

        let error;
        if (!Object.keys(state.fromErrors).length) error = null;

        if (state.fromErrors.hasOwnProperty('min')) {
            error = t('convert:errors.min', { amount: formatPrice(state.fromErrors.min) }).toUpperCase() + ` ${state.fromAsset}`;
        }
        if (state.fromErrors.hasOwnProperty('max')) {
            error = t('convert:errors.max', { amount: formatPrice(state.fromErrors.max) }).toUpperCase() + ` ${state.fromAsset}`;
        }
        if (state.fromErrors.hasOwnProperty('insufficient')) {
            error = t('convert:errors.insufficient').toUpperCase();
        }
        if (state.toErrors.hasOwnProperty('not_found')) {
            error = t('convert:errors.est_rate_not_found').toUpperCase();
        }

        const shouldDisable = error || !state.fromAmount || !state.estRate;

        return (
            <ButtonV2
                disabled={shouldDisable}
                onClick={() => !shouldDisable && !state.loadingPreOrder && fetchPreSwapOrder(state.fromAsset, state.toAsset, +state.fromAmount)}
                className="mt-8"
            >
                {t('convert:btn_preview')}
            </ButtonV2>
        );
    }, [auth, state.fromAsset, state.toAsset, state.fromAmount, state.loadingPreOrder, state.estRate, state.fromErrors, state.toErrors]);

    const renderHelperTextFrom = useCallback(() => {
        let error = '';
        if (!Object.keys(state.fromErrors).length) error = null;

        if (state.fromErrors.hasOwnProperty('min')) {
            error = t('convert:errors.min', { amount: formatPrice(state.fromErrors.min) }) + ` ${state.fromAsset}`;
        }
        if (state.fromErrors.hasOwnProperty('max')) {
            error = t('convert:errors.max', { amount: formatPrice(state.fromErrors.max) }) + ` ${state.fromAsset}`;
        }
        if (state.fromErrors.hasOwnProperty('insufficient')) {
            error = t('convert:errors.insufficient');
        }

        if (!error) return null;
        return (
            <div className="flex items-center text-red pt-3 text-xs text-left leading-4 gap-1">
                <SwapWarning size={12} fill={colors.red2} />
                {error}
            </div>
        );
    }, [auth, state.fromAsset, state.toAsset, state.fromAmount, state.loadingPreOrder, state.estRate, state.fromErrors]);

    const renderHelperTextTo = useCallback(() => {
        let error = '';
        if (!Object.keys(state.toErrors).length) error = null;

        if (state.toErrors.hasOwnProperty('not_found')) {
            error = t('convert:errors.est_rate_not_found');
        }

        if (!error) return null;
        return (
            <div className="flex items-center text-red pt-3 text-xs text-left leading-4  gap-1">
                <SwapWarning size={12} fill={colors.red2} />
                {error}
            </div>
        );
    }, [auth, state.fromAsset, state.toAsset, state.fromAmount, state.loadingPreOrder, state.estRate, state.toErrors]);

    // Modal confirmation
    const renderPreOrderModal = useCallback(() => {
        const positiveLabel = swapTimer <= 0 ? t('common:refresh') : `${t('common:confirm')} (${swapTimer})`;
        return (
            <ModalV2 loading={state.processingOrder} className="!max-w-[488px]" isVisible={state.openModal} onBackdropCb={onCloseSwapModal}>
                <div className="my-6 text-left font-semibold text-[24px] leading-[30px] text-dark-2 dark:text-gray-4 hover:bg-transparent">
                    {t('convert:confirm')}
                </div>
                <div className="flex flex-col items-start justify-between gap-2">
                    <span className="text-sm leading-5  text-txtSecondary dark:text-txtSecondary-dark">{t('convert:from_amount')}:</span>
                    <div className="w-full rounded-md bg-gray-10 dark:bg-dark-2 px-3 py-2 flex justify-between text-base items-center leading-6">
                        <span className="py-1 text-txtPrimary dark:text-txtPrimary-dark">{formatPrice(state.preOrder?.fromQty)} </span>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{state.preOrder?.fromAsset}</span>
                    </div>
                </div>

                <div className="flex flex-col mt-4 items-start justify-between gap-2">
                    <span className="text-sm leading-5  text-txtSecondary dark:text-txtSecondary-dark">{t('convert:to_amount')}:</span>
                    <div className="w-full rounded-md bg-gray-10 dark:bg-dark-2 px-3 py-2 flex justify-between text-base items-center leading-6">
                        <span className="py-1 text-txtPrimary dark:text-txtPrimary-dark">{formatPrice(state.preOrder?.toQty)}</span>
                        <span className="text-txtSecondary dark:text-txtSecondary-dark">{state.preOrder?.toAsset}</span>
                    </div>
                </div>
                <div className="flex items-end justify-between mt-4 text-base">
                    <span className="text-txtSecondary dark:text-txtSecondary-dark">{t('convert:rate')}:</span>
                    {state.loadingEstRate ? (
                        <Skeletor width={100} />
                    ) : state.preOrder?.fromAsset === config?.displayPriceAsset ? (
                        <span className="font-semibold">
                            1 {state.preOrder?.toAsset} = {formatPrice(state.preOrder?.displayingPrice)} {state.preOrder?.fromAsset}
                        </span>
                    ) : (
                        <span className="font-semibold">
                            1 {state.preOrder?.toAsset} = {formatPrice(state.preOrder?.displayingPrice)} {state.preOrder?.fromAsset}
                        </span>
                    )}
                    {/* <span className="font-semibold">
                        1 {state.preOrder?.fromAsset === config?.displayPriceAsset ? state.preOrder?.fromAsset : state.preOrder?.toAsset} ={' '}
                        {formatPrice(state.preOrder?.displayingPrice)}{' '}
                        {state.preOrder?.fromAsset === config?.displayPriceAsset ? state.preOrder?.toAsset : state.preOrder?.fromAsset}
                    </span> */}
                </div>
                <div className="mt-10 w-full flex flex-row items-center justify-between">
                    <ButtonV2
                        loading={state.processingOrder}
                        onClick={() =>
                            swapTimer
                                ? onConfirmOrder(state.preOrder?.preOrderId)
                                : !state.loadingPreOrder && fetchPreSwapOrder(state.fromAsset, state.toAsset, +state.fromAmount)
                        }
                    >
                        {positiveLabel}
                    </ButtonV2>
                </div>
            </ModalV2>
        );
    }, [state.openModal, state.preOrder, state.fromAmount, state.toAsset, state.fromAmount, state.processingOrder, swapTimer, config]);

    const onOpenAlertResultSwap = ({ msg, type, title, duration }) => {
        setTimeout(() => {
            set((prevState) => ({ ...prevState, resultSwap: { msg, type, title, duration } }));
        }, 100);
    };

    const onCloseAlertResultSwap = () => {
        if (state.resultSwap) set((prevState) => ({ ...prevState, resultSwap: null }));
    };

    const renderAlertNotification = useCallback(() => {
        if (!state?.resultSwap || !state.resultSwap) return null;

        setTimeout(() => {
            onCloseAlertResultSwap();
        }, state?.duration || 5000);

        return (
            <AlertModalV2
                isVisible={!!state.resultSwap}
                onClose={onCloseAlertResultSwap}
                type={state?.resultSwap?.type}
                title={state?.resultSwap?.title}
                message={state?.resultSwap?.msg}
            />
        );
    }, [state.resultSwap]);

    // Side Effect
    useAsync(async () => {
        !state.swapConfigs && setState({ loading: true });
        try {
            const options = {
                url: '/api/v3/swap/config',
                options: {
                    method: 'GET'
                }
            };
            const { status, data } = await fetchAPI(options);

            if (status === ApiStatus.SUCCESS && data) {
                setState({ swapConfigs: data });
            }
        } catch (e) {
            console.log(`Can't get swap config `, e);
        } finally {
            setState({ loading: false });
        }
    }, []);

    // useEffect(() => {
    //     console.log('namidev-DEBUG => ', state)
    // }, [state])

    // useEffect(() => {
    //     if (config?.filters) {
    //         const fromAmount = +config.filters?.[0]?.minQty;
    //         fromAmount && setState({ fromAmount });
    //     }
    // }, [config]);

    useEffect(() => {
        fromAssetRef?.current?.focus();
    }, []);

    useEffect(() => {
        if (pair && pair?.fromAsset && pair?.fromAsset !== 'undefined') {
            setState({ fromAsset: pair?.fromAsset });
        }
        if (pair && pair?.toAsset && pair?.toAsset !== 'undefined') {
            setState({ toAsset: pair?.toAsset });
        }
    }, [pair]);

    useEffect(() => {
        let interval;
        if (swapTimer) {
            interval = setInterval(() => {
                setSwapTimer((lastTimerCount) => {
                    if (lastTimerCount <= 1) {
                        clearInterval(interval);
                        setState({ shouldRefreshRate: true });
                    }
                    return lastTimerCount - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [swapTimer]);

    useEffect(() => {
        if (!state.swapConfigs || state.init) return;
        const sizeFilter = find(config?.filters, { filterType: 'LOT_SIZE' });
        if (sizeFilter?.minQty > 0) {
            fetchEstimateRate(sizeFilter?.minQty, state.fromAsset, false);
            setState({ init: true });
        }
    }, [config, state.swapConfigs, state.fromAsset]);

    useEffect(() => {
        let result = uniqBy(state.swapConfigs, 'fromAsset').filter((e) => e?.fromAsset?.toLowerCase()?.includes(state.search?.toLowerCase())) || [];
        result = result.map((r) => ({
            ...r,
            available: wallets?.[r.fromAssetId]?.value - wallets?.[r?.fromAssetId]?.locked_value
        }));
        result = orderBy(result, ['available', 'fromAsset'], ['desc', 'asc']);
        setState({ fromAssetList: result });
    }, [state.swapConfigs, state.search, wallets]);

    useEffect(() => {
        if (!state.swapConfigs?.length) return;
        let result = state.swapConfigs.filter((e) => e?.toAsset?.toLowerCase()?.includes(state.search?.toLowerCase()) && e.fromAsset === state.fromAsset);
        result = result.map((e) => ({
            ...e,
            available: wallets?.[e.toAssetId]?.value - wallets?.[e?.toAssetId]?.locked_value
        }));
        result = orderBy(result, ['available', 'toAsset'], ['desc', 'asc']);
        setState({ toAssetList: result });
    }, [state.swapConfigs, state.search, state.fromAsset, wallets]);

    useDebounce(
        () => {
            setState({ fromErrors: {} });
            const value = +state.fromAmount;

            if (config?.filters && config.filters.length && value) {
                const min = +config?.filters[0].minQty;
                const max = +config?.filters[0].maxQty;
                const available = availabelAsset?.fromAsset;

                if (value < min) {
                    setState({ fromErrors: { min } });
                } else if (value > available) {
                    setState({ fromErrors: { insufficient: available } });
                } else if (value > max) {
                    setState({ fromErrors: { max } });
                }
            }

            if (state.focus === 'from') {
                if (!(+state.fromAmount > 0)) setState({ toAmount: '' });
                fetchEstimateRate(state.fromAmount, state.fromAsset);
            }
        },
        DEBOUNCE_TIMEOUT,
        [state.fromAmount, state.focus, config, availabelAsset]
    );

    useDebounce(
        () => {
            if (['from', 'to'].includes(state.focus)) {
                fetchEstimateRate(state.fromAmount, state.fromAsset);
            }
        },
        DEBOUNCE_TIMEOUT,
        [state.fromAsset, state.toAsset]
    );

    useDebounce(
        () => {
            if (state.focus === 'to') {
                if (!(+state.toAmount > 0)) setState({ fromAmount: '' });
                fetchEstimateRate(state.toAmount, state.toAsset);
            }
        },
        DEBOUNCE_TIMEOUT,
        [state.toAmount, state.toAsset]
    );

    return (
        <>
            <div className="flex items-center justify-center w-full h-full lg:block lg:w-auto lg:h-auto">
                <div className="relative min-w-[350px] max-w-[508px] rounded-xl">
                    <div className="flex flex-col justify-center items-center">
                        <span className="text-[32px] leading-[38px] font-semibold">{t('navbar:submenu.swap')}</span>
                    </div>
                    <div className="mt-8 p-6 rounded-xl shadow-card_light dark:border dark:border-divider-dark dark:bg-dark bg-white">
                        {/*INPUT WRAPPER*/}
                        <div className="relative">
                            <Input isFocus={state.inputHighlighted === 'from'}>
                                <div className="flex items-center justify-between pb-4 text-txtSecondary dark:text-txtSecondary-dark">
                                    <span>{t('common:from')}</span>
                                    <div className="flex gap-2 items-center">
                                        <span>
                                            {/* {t('common:available_balance')}: {formatWallet(availabelAsset?.fromAsset)} */}
                                            {t('common:available_balance')}:{' '}
                                            {formatNumber(availabelAsset?.fromAsset, find(assetConfig, { assetCode: state?.fromAsset })?.assetDigit || 0)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDepositIconBtn();
                                            }}
                                        >
                                            <SvgAddCircle size={13.3} color={colors.teal} className="cursor-pointer" />
                                        </button>
                                    </div>
                                </div>
                                {renderFromInput()}
                                {renderFromAssetList()}
                            </Input>
                            {renderHelperTextFrom()}

                            <div className="flex justify-center items-center py-4">
                                <button
                                    className={`p-1.5 bg-gray-10 dark:bg-dark-2 rounded-full ${state.openAssetList?.from && 'invisible'}`}
                                    onClick={onReverse}
                                >
                                    <SyncAltIcon size={width < 640 && 24} />
                                </button>
                            </div>

                            <Input isFocus={state.inputHighlighted === 'to'}>
                                <div className="flex items-center justify-between pb-4 text-txtSecondary dark:text-txtSecondary-dark">
                                    <span>{t('common:to')}</span>
                                    <span>
                                        {/* {t('common:available_balance')}: {formatWallet(availabelAsset?.toAsset)} */}
                                        {t('common:available_balance')}:{' '}
                                        {formatNumber(availabelAsset?.toAsset, find(assetConfig, { assetCode: state?.toAsset })?.assetDigit || 0)}
                                    </span>
                                </div>
                                {renderToInput()}
                                {renderToAssetList()}
                            </Input>
                            {renderHelperTextTo()}
                        </div>
                        {/*END:INPUT WRAPPER*/}

                        {/*SWAP RATE*/}
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-txtSecondary dark:text-txtSecondary-dark text-left">{t('common:rate')}:</span>

                            {renderRate()}
                        </div>
                        {/*END:SWAP RATE*/}

                        {/*SWAP BUTTON*/}
                        {renderSwapBtn()}
                        {/*END:SWAP BUTTON*/}

                        <div className="mt-4 text-center text-sm text-gray-7 dark:text-gray-7">
                            <Trans i18nKey="common:term_swap">
                                <HrefButton className="!inline !p-0" href={PATHS.TERM_OF_SERVICES.SWAP} variants="blank" />
                            </Trans>
                        </div>
                    </div>
                </div>
            </div>
            {renderPreOrderModal()}
            {renderAlertNotification()}
        </>
    );
};

const Input = styled.div.attrs(({ isFocus }) => ({
    className: `py-6 px-4 rounded-xl relative bg-gray-13 dark:bg-dark-2 border ${isFocus ? 'border-green-2' : 'border-transparent'}`
}))``;

const AssetList = styled.div.attrs(({ AssetListRef }) => ({
    className: `absolute right-0 top-full py-4 mt-2 w-full max-w-[400px] z-20 rounded-xl
    border border-divider dark:border-divider-dark bg-white dark:bg-dark-4
    shadow-card_light dark:shadow-popover`,
    ref: AssetListRef
}))``;

const AssetItem = styled.li.attrs(({ key, className, isChoosed, onClick, isDisabled }) => ({
    className: `text-txtSecondary dark:text-txtSecondary-dark text-left text-base
    px-4 py-4 flex items-center justify-between cursor-not-allowed font-normal first:mt-0 mt-3
    ${!isDisabled && 'hover:bg-hover focus:bg-hover dark:hover:bg-hover-dark dark:focus:bg-hover-dark !cursor-pointer'}
    ${isChoosed && 'bg-hover dark:bg-hover-dark'} ${className}`,
    key: key,
    onClick: isDisabled ? null : onClick
}))``;

export default SwapModule;
