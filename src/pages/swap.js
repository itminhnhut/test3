/* eslint-disable no-prototype-builtins */
import { createRef, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { Dialog, Popover, Transition } from '@headlessui/react';
import uniqBy from 'lodash/uniqBy';
import orderBy from 'lodash/orderBy';
import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { useAsync, useDebounce } from 'react-use';
import { X } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import Countdown from 'react-countdown';
import TextLoader from 'src/components/loader/TextLoader';
import { formatSwapValue, formatWallet, getDecimalScale, getLoginUrl, safeToFixed } from 'actions/utils';
import LayoutWithHeader from 'components/common/layouts/layoutWithHeader';
import { IconSelectSmall, IconSwitch } from 'components/common/Icons';
import { ApiStatus } from 'actions/const';
import * as Error from 'actions/apiError';
import AssetLogo from 'components/wallet/AssetLogo';
import SwapOrderList from 'components/trade/SwapOrderList';
import Footer from 'components/common/Footer';
import { iconColor } from '../config/colors';
import showNotification from '../utils/notificationService';
import fetchAPI from '../utils/fetch-api';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout'
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode'
import colors from '../styles/colors'

const swapFee = 0.1 / 100;

// const useFocus = () => {
//     const htmlElRef = useRef(null);
//     const setFocus = () => {
//         return htmlElRef?.current?.focus();
//     };
//     return [htmlElRef, setFocus];
// };

const AssetSelector = dynamic(
    () => import('src/components/convert/AssetSelector'),
    // {ssr: false}
);

const coinFromQtyRef = createRef();
const coinToQtyRef = createRef();

const Swap = () => {
    const { t } = useTranslation(['convert', 'error', 'navbar']);
    const buttonFromRef = useRef();
    const buttonToRef = useRef();
    const cancelButtonRef = useRef();
    // const coinFromQtyRef = useRef();
    // const coinToQtyRef = useRef();

    // const [coinFromQtyRef, setCoinFromQtyFocus] = useFocus();
    // const [coinToQtyRef, setCoinToQtyFocus] = useFocus();

    const setCoinFromQtyFocus = () => {
        coinFromQtyRef?.current?.focus();
    };

    const setCoinToQtyFocus = () => {
        coinToQtyRef?.current?.focus();
    };

    useEffect(() => {
        setCoinFromQtyFocus();
    }, []);
    const user = useSelector(state => state.auth.user) || null;
    const wallets = useSelector(state => state.wallet.SPOT);
    const [coinFrom, setCoinFrom] = useState('USDT');
    const [coinFromErrors, setCoinFromErrors] = useState({});
    const [coinTo, setCoinTo] = useState('BTC');
    const [focus, setFocus] = useState('from');
    const [shouldRefresh, setShouldRefresh] = useState(false);

    const [coinFromQty, setCoinFromQty] = useState();
    // const [coinToErrors, setCoinToErrors] = useState({});
    const [coinToQty, setCoinToQty] = useState();
    // const [togglePrice, setTogglePrice] = useState(false);
    const [priceData, setPriceData] = useState(null);
    const [listCoinFrom, setListCoinFrom] = useState([]);
    const [listCoinTo, setListCoinTo] = useState([]);
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loadingPrice, setLoadingPrice] = useState(true);
    const [loadingPost, setLoadingPost] = useState(false);
    const [preOrderData, setPreOrderData] = useState(null);
    const [successOrder, setSuccessOrder] = useState(null);
    const [swapConfig, setSwapConfig] = useState(null);
    const [init, setInit] = useState(false);

    const [currentTheme, ] = useDarkMode()

    const getCoinConfig = useMemo(() => {
        return find(swapConfig, e => e.fromAsset === coinFrom && e.toAsset === coinTo) || {};
    }, [swapConfig, coinFrom, coinTo]);

    const getAvailableText = () => {
        const _config = getCoinConfig;
        return formatWallet(wallets?.[_config?.fromAssetId]?.value - wallets?.[_config?.fromAssetId]?.locked_value);
    };
    const getAvailable = () => {
        const _config = getCoinConfig;
        return wallets?.[_config?.fromAssetId]?.value - wallets?.[_config?.fromAssetId]?.locked_value;
    };
    const getPrice = async (requestQty, requestAsset, updateQty = true) => {
        if (!(requestQty && requestAsset)) return;
        setLoadingPrice(true);
        const { data, status } = await fetchAPI({
            url: '/api/v3/swap/estimate_price',
            options: {
                method: 'GET',
            },
            params: {
                fromAsset: coinFrom,
                toAsset: coinTo,
                requestQty,
                requestAsset,
            },
        });
        setShouldRefresh(false);
        setLoadingPrice(false);
        setPriceData(data);

        if (status === ApiStatus.SUCCESS && updateQty) {
            if (requestAsset === coinFrom) {
                setCoinToQty(requestQty * data?.price);
            }
            if (requestAsset === coinTo) {
                setCoinFromQty(requestQty / data?.price);
            }
        }
    };

    useAsync(async () => {
        const { data, status } = await fetchAPI({
            url: '/api/v3/swap/config',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            setSwapConfig(data);
        }
    }, []);

    useEffect(() => {
        if (!swapConfig || init) return;
        const sizeFilter = find(getCoinConfig?.filters, { filterType: 'LOT_SIZE' });
        if (sizeFilter?.minQty > 0) {
            getPrice(sizeFilter?.minQty, coinFrom, false);
            setInit(true);
        }
    }, [swapConfig]);

    const handleSwitchCoin = () => {
        if (focus === 'from') {
            setCoinToQtyFocus();
        } else {
            setCoinFromQtyFocus();
        }

        const tempValue = coinFromQty;
        setCoinFromQty(coinToQty);
        setCoinToQty(tempValue);

        setCoinFrom(coinTo);
        setCoinTo(coinFrom);
    };

    useEffect(() => {
        let result = uniqBy(swapConfig, 'fromAsset').filter(e => (e?.fromAsset?.toLowerCase()?.includes(search?.toLowerCase()))) || [];
        result = result.map(e => ({
            ...e,
            available: wallets?.[e.fromAssetId]?.value - wallets?.[e?.fromAssetId]?.locked_value,
        }));
        result = orderBy(result, ['available', 'fromAsset'], ['desc', 'asc']);
        setListCoinFrom(result);
    }, [search, swapConfig, wallets]);

    useEffect(() => {
        if (!swapConfig?.length) return;
        let result = swapConfig.filter(e => {
            return e?.toAsset?.toLowerCase()?.includes(search?.toLowerCase()) && e.fromAsset === coinFrom;
        });
        result = result.map(e => ({
            ...e,
            available: wallets?.[e.toAssetId]?.value - wallets?.[e?.toAssetId]?.locked_value,
        }));
        result = orderBy(result, ['available', 'toAsset'], ['desc', 'asc']);
        setListCoinTo(result);
    }, [coinFrom, search, swapConfig, wallets]);

    const handleClickCoinFrom = (value) => {
        if (!swapConfig?.length) return;
        setCoinFrom(value);
        setSearch('');
        setCoinFromErrors({});
        buttonFromRef?.current.click();

        let result = swapConfig.filter(e => {
            return e.fromAsset === value;
        });
        result = result.map(e => ({
            ...e,
            available: wallets?.[e.toAssetId]?.value - wallets?.[e?.toAssetId]?.locked_value,
        }));
        result = orderBy(result, ['available', 'toAsset'], ['desc', 'asc']);
        if (result.length) {
            setCoinTo(result[0].toAsset);
        }
    };
    const handleClickCoinTo = (value) => {
        setCoinTo(value);
        setSearch('');
        buttonToRef?.current.click();
    };
    const closeDialog = () => {
        setIsOpen(false);
    };
    const openDialog = () => {
        setIsOpen(true);
    };
    const fetchPreSwapOrder = async () => {
        setLoadingPrice(true);
        const res = await fetchAPI({
            url: '/api/v3/swap/pre_order',
            options: {
                method: 'POST',
            },
            params: {
                fromAsset: coinFrom,
                toAsset: coinTo,
                fromQty: +coinFromQty,
            },
        });
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            setPreOrderData(data);
            setShouldRefresh(false);
            openDialog();
        } else {
            const error = find(Error, { code: res?.code });
            const description = error
                ? t(`error:${error.message}`)
                : t('error:COMMON_ERROR');
            showNotification({ message: `(${res?.code}) ${description}`, title: t('common:failure'), type: 'failure' });
        }
        setLoadingPrice(false);
    };
    const fetchConfirmSwapOrder = async () => {
        setLoadingPost(true);
        const res = await fetchAPI({
            url: '/api/v3/swap/confirm_order',
            options: {
                method: 'POST',
            },
            params: {
                preOrderId: preOrderData?.preOrderId,
            },
        });
        const { status, data } = res;
        setLoadingPost(false);
        if (status === ApiStatus.SUCCESS) {
            const {
                displayingId,
                fromAsset,
                toAsset,
                fromQty,
                toQty,
                displayingPrice,
            } = data;
            let message = '';
            setSuccessOrder(displayingId);
            message = t('convert:swap_success', { fromQty, fromAsset, toQty, toAsset, displayingPrice });
            showNotification({ message, title: t('common:success'), type: 'success' });
            closeDialog();
        } else {
            const error = find(Error, { code: res?.code });
            const rejectPreOrder = [
                'BROKER_ERROR',
                'PRICE_CHANGED',
                'INVALID_SWAP_REQUEST_ID',
                'INSTRUMENT_NOT_LISTED_FOR_TRADING_YET',
            ];
            if (rejectPreOrder.includes(error.message)) {
                closeDialog();
            }

            const description = error
                ? t(`error:${error.message}`)
                : t('error:COMMON_ERROR');
            showNotification({ message: `(${res?.code}) ${description}`, title: 'Failure', type: 'failure' });
        }
    };

    useDebounce(() => {
        setCoinFromErrors({});
        const _config = getCoinConfig;
        const value = +coinFromQty;
        if (_config.filters && _config.filters.length && value) {
            const min = +_config?.filters[0].minQty;
            const max = +_config?.filters[0].maxQty;
            const available = getAvailable();
            if (value < min) {
                setCoinFromErrors({ min });
            } else if (value > available) {
                setCoinFromErrors({ insufficient: available });
            } else if (value > max) {
                setCoinFromErrors({ max });
            }
        }

        if (focus === 'from') {
            if (!(+coinFromQty > 0)) setCoinToQty('');
            getPrice(coinFromQty, coinFrom);
        }
    }, 500, [coinFromQty, coinFrom]);

    useDebounce(() => {
        if (['from', 'to'].includes(focus)) {
            getPrice(coinFromQty, coinFrom);
        }
    }, 500, [`${coinFrom}_${coinTo}`]);

    useDebounce(() => {
        if (focus === 'to') {
            if (!(+coinToQty > 0)) setCoinFromQty('');
            getPrice(coinToQty, coinTo);
        }
    }, 500, [coinToQty, coinTo]);

    const setMaximumQty = () => {
        const _qty = getAvailable();
        if ((!_qty > 0)) return;
        let max = +_qty;
        if (coinFrom === getCoinConfig?.displayPriceAsset) {
            max = +_qty * (1 - swapFee);
        }
        setCoinFromQty(safeToFixed(max, getDecimalScale(+getCoinConfig.filters?.[0].stepSize)));
    };

    const Rate = () => {
        const displayPriceAsset = getCoinConfig?.displayPriceAsset;
        let price = 0;
        const displayCoinFrom = displayPriceAsset === coinTo ? coinFrom : coinTo;
        const displayCoinTo = displayPriceAsset === coinTo ? coinTo : coinFrom;

        if (priceData?.price && priceData?.fromAsset === coinFrom && priceData?.toAsset === coinTo) {
            price = getCoinConfig?.displayPriceAsset === coinTo
                ? formatSwapValue(priceData?.price)
                : formatSwapValue(1 / priceData?.price);
        }
        if ((!coinFromQty > 0)) {
            return t('convert:please_input');
        }
        if (price === 0) {
            return <TextLoader height={18} />;
        }

        return (
            <div className="font-semibold">1 {displayCoinFrom} = {price} {displayCoinTo}</div>
        );
    };

    const handleCompleteCountdown = () => {
        setShouldRefresh(true);
    };

    const CoinFromErrorText = () => {
        // eslint-disable-next-line no-prototype-builtins
        if (coinFromErrors.hasOwnProperty('min')) return t('convert:errors.min', { amount: coinFromErrors.min });
        if (coinFromErrors.hasOwnProperty('max')) return t('convert:errors.max', { amount: coinFromErrors.max });
        if (coinFromErrors.hasOwnProperty('insufficient')) return t('convert:errors.insufficient');
        return null;
    };

    // console.log('__ check coin from, to', coinFrom, coinTo);

    return (
        <MaldivesLayout>
            <div className="bg-backgroundSecondary dark:bg-get-darkBlue2 flex flex-col flex-grow justify-center
                            items-center min-h-[680px] h-full">
                {/* <div className="py-[3.75rem] text-center">
                    <div className="text-4xl text-teal ">
                        {t('navbar:submenu.convert')}
                    </div>
                    <div className="text-lg text-teal-400">
                        {t('navbar:submenu.convert_description')}
                    </div>
                </div> */}
                <div className="convert-container">
                    <div className="card card-shadow bg-bgContainer dark:bg-get-darkBlue1 rounded-xl lg:w-[480px] max-w-[480px] mx-auto">
                        <div className="card-body !py-6 !px-6">
                            <div className="font-bold text-xl pb-4">{t('navbar:submenu.swap')}</div>
                            <div className="group hover:border-teal swap-form-group">
                                <div className="flex justify-between">
                                    <span className="text-sm font-bold text-textPrimary dark:text-textPrimary-dark">{t('you_pay')}</span>
                                    <span className="text-sm font-bold text-textSecondary dark:text-textSecondary-dark">
                                        {t('convert:available_balance')}:&nbsp;
                                        {getAvailableText()}&nbsp;
                                        {coinFrom}
                                    </span>
                                </div>

                                <div className="swap-input-group relative">
                                    <NumberFormat
                                        getInputRef={coinFromQtyRef}
                                        className="swap-form-control"
                                        placeholder={t('convert:coin_from_placeholder', {
                                            min: +getCoinConfig.filters?.[0].minQty,
                                            max: +getCoinConfig.filters?.[0].maxQty,
                                        })}
                                        decimalScale={getDecimalScale(+getCoinConfig.filters?.[0].stepSize)}
                                        thousandSeparator
                                        allowNegative={false}
                                        value={coinFromQty}
                                        onFocus={() => {
                                            setFocus('from');
                                        }}
                                        onValueChange={({ value }) => {
                                            setCoinFromQty(value);
                                        }}
                                    />

                                    <div className="swap-input-group-append">
                                        <button className="py-3" type="button" onClick={setMaximumQty}>
                                            <span className="swap-input-group-text text-teal-700 font-semibold">
                                                MAX
                                            </span>
                                        </button>
                                    </div>
                                    <div className="swap-input-group-prepend md:w-[115px]">
                                        <Popover className="flex items-center">
                                            {({ open }) => (
                                                <>
                                                    <Popover.Button
                                                        type="button"
                                                        className="btn flex items-center transition-opacity	"
                                                        aria-expanded="false"
                                                        ref={buttonFromRef}
                                                        disabled={!swapConfig}
                                                    >
                                                        <span><AssetLogo assetCode={coinFrom} size={24} /></span>
                                                        <span className="mx-1.5 leading-6 text-textPrimary dark:text-textPrimary-dark">{coinFrom}</span>
                                                        <span><IconSelectSmall color={currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey4} /></span>
                                                    </Popover.Button>
                                                    {open
                                                    && <AssetSelector
                                                        setSearch={setSearch}
                                                        assets={listCoinFrom}
                                                        onSelectAsset={handleClickCoinFrom}
                                                        type="from"
                                                        selectedAsset={coinFrom}
                                                    />}
                                                </>
                                            )}
                                        </Popover>
                                    </div>

                                </div>
                                <div className="text-xs font-semibold text-pink">
                                    <CoinFromErrorText />
                                </div>
                            </div>
                            <div className="flex justify-center -my-2 cursor-pointer">
                                <button className="btn !p-0" type="button" onClick={handleSwitchCoin}>
                                    <IconSwitch fill={currentTheme === THEME_MODE.LIGHT ? '#F5F5F5' : colors.darkBlue3} />
                                </button>
                            </div>
                            <div className="group hover:border-teal swap-form-group">
                                <div className="flex justify-between">
                                    <span className="text-sm font-bold text-textPrimary dark:text-textPrimary-dark">{t('you_get')}</span>
                                </div>
                                <div className="swap-input-group relative">
                                    <NumberFormat
                                        getInputRef={coinToQtyRef}
                                        className="swap-form-control"
                                        placeholder="--"
                                        decimalScale={8}
                                        thousandSeparator
                                        allowNegative={false}
                                        value={coinToQty}
                                        onFocus={() => setFocus('to')}
                                        onValueChange={({ value }) => {
                                            setCoinToQty(value);
                                        }}
                                    />
                                    <div className="swap-input-group-prepend md:w-[115px]">
                                        <Popover className="flex items-center">
                                            {({ open }) => (
                                                <>
                                                    <Popover.Button
                                                        type="button"
                                                        className="btn flex items-center transition-opacity	"
                                                        aria-expanded="false"
                                                        ref={buttonToRef}
                                                        disabled={!swapConfig}
                                                    >
                                                        <span><AssetLogo assetCode={coinTo} size={24} /></span>
                                                        <span className="mx-1.5 leading-6 text-textPrimary dark:text-textPrimary-dark">{coinTo}</span>
                                                        <span><IconSelectSmall  color={currentTheme === THEME_MODE.LIGHT ? colors.darkBlue : colors.grey4}  /></span>
                                                    </Popover.Button>
                                                    {open
                                                    && <AssetSelector
                                                        onSelectAsset={handleClickCoinTo}
                                                        setSearch={setSearch}
                                                        assets={listCoinTo}
                                                        type="to"
                                                        selectedAsset={coinTo}
                                                    />}
                                                </>
                                            )}
                                        </Popover>
                                    </div>

                                </div>
                            </div>
                            <div className="mt-4 text-sm font-medium flex items-center justify-between">
                                <span className="text-black-600 text-textPrimary dark:text-textPrimary-dark">
                                    {t('convert:rate')}
                                </span>
                                {priceData ? <Rate /> : null}
                            </div>
                            <div className="mt-4 text-sm font-medium flex items-center justify-between">
                                <span className="text-black-600 text-textPrimary dark:text-textPrimary-dark">
                                    Slippage
                                </span>
                                <div className="font-semibold">0.5%</div>
                            </div>

                            <div className="mt-8">

                                {
                                    user ?
                                        (
                                            <button
                                                className="btn btn-primary w-full"
                                                onClick={fetchPreSwapOrder}
                                                type="button"
                                                disabled={!isEmpty(coinFromErrors) || loadingPrice || !coinFromQty}
                                            >{t('convert:btn_preview')}
                                            </button>
                                        )
                                        : (
                                            <a
                                                href={getLoginUrl('sso')}
                                                className="btn btn-primary w-full block text-center"
                                            >
                                                {t('common:sign_in_to_continue')}
                                            </a>
                                        )
                                }

                            </div>
                        </div>
                    </div>
                </div>

                <Transition show={isOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                        initialFocus={cancelButtonRef}
                        static
                        open={isOpen}
                        onClose={closeDialog}
                    >
                        <div className="min-h-screen px-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black-800 opacity-70" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div
                                    className="inline-block w-full max-w-[480px] my-8 overflow-hidden align-middle transition-all text-left transform  shadow-dropdown rounded"
                                >
                                    <Dialog.Title className="bg-white p-6">
                                        <div className="flex justify-between items-center">
                                            <div
                                                className="text-sm text-black-500"
                                            >{t('convert:you_will_get')}
                                            </div>
                                            <button className="btn btn-icon !p-0" type="button" onClick={closeDialog}>
                                                <X color={iconColor} size={24} />
                                            </button>
                                        </div>
                                        <div
                                            className="flex justify-between items-center text-2xl font-semibold letter-spacing-02"
                                        >
                                            {formatSwapValue(preOrderData?.toQty)} {preOrderData?.toAsset}
                                        </div>
                                    </Dialog.Title>
                                    <div className="bg-black-100 p-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-sm font-semibold text-black-500">
                                                {t('convert:from')}
                                            </div>
                                            <div className="font-semibold text-right">
                                                {formatSwapValue(preOrderData?.fromQty)} {preOrderData?.fromAsset}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="text-sm font-semibold text-black-500">
                                                {t('convert:fee')}
                                            </div>
                                            <div className="font-semibold text-right">
                                                {formatSwapValue(preOrderData?.feeMetadata?.value)} {preOrderData?.feeMetadata?.asset}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="text-sm font-semibold text-black-500">
                                                {t('convert:rate')}
                                            </div>
                                            <div className="font-semibold flex items-center">
                                                {formatSwapValue(preOrderData?.displayingPrice)}
                                            </div>
                                        </div>
                                        <div className="">
                                            {shouldRefresh
                                                ? (
                                                    <button
                                                        className="btn btn-primary btn-lg w-full"
                                                        type="button"
                                                        disabled={loadingPrice}
                                                        onClick={fetchPreSwapOrder}
                                                    >
                                                        {t('convert:refresh')}
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        className="btn btn-primary btn-lg w-full"
                                                        type="button"
                                                        disabled={loadingPost}
                                                        onClick={fetchConfirmSwapOrder}
                                                    >
                                                        {t('convert:confirm')} {!loadingPost ? <Countdown
                                                            date={preOrderData?.expiredAt}
                                                            renderer={({ formatted: { seconds } }) => `(${seconds})`}
                                                            onComplete={handleCompleteCountdown}
                                                        /> : null}
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </div>
        </MaldivesLayout>
    );
};

export async function getStaticProps({ locale }) {
    return {
        props: {
            ...await serverSideTranslations(locale, ['common', 'navbar', 'wallet', 'convert', 'error', 'footer']),
        },
    };
}

export default Swap;
