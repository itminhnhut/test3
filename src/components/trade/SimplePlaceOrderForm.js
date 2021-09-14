/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, Listbox, Transition } from '@headlessui/react';
import axios from 'axios';
import { IconLock } from 'components/common/Icons';
import TextLoader from 'components/loader/TextLoader';
import AssetPnL from 'components/trade/AssetPnL';
import AssetLogo from 'components/wallet/AssetLogo';
import { iconColor } from 'config/colors';
import ceil from 'lodash/ceil';
import defaults from 'lodash/defaults';
import find from 'lodash/find';
import floor from 'lodash/floor';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'react-feather';
import NumberFormat from 'react-number-format';
import { useSelector } from 'react-redux';
import { useAsync, useDebounce, useLocalStorage } from 'react-use';
import { getMarketWatch } from 'redux/actions/market';
import { getAssetName } from 'redux/actions/utils';
import InputSlider from 'src/components/trade/InputSlider';
import * as Error from 'src/redux/actions/apiError';
import {
    ApiStatus,
    EPS,
    ExchangeOrderEnum,
    PublicSocketEvent,
    SpotFeePercentage,
    SpotMarketPriceBias,
} from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import {
    formatBalance,
    formatPrice,
    formatSpotFee,
    formatWallet,
    getDecimalScale,
    getFilter,
    getLoginUrl,
    getSymbolString,
    isInvalidPrecision,
} from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import showNotification from 'utils/notificationService';
import SpotMarketValue from '../markets/SpotMarketValue';

let initPrice = '';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
        return htmlElRef.current && htmlElRef.current.focus();
    };
    return [htmlElRef, setFocus];
};

const allSubTabs = [
    ExchangeOrderEnum.Type.MARKET,
    ExchangeOrderEnum.Type.LIMIT,
];

const SimplePlaceOrderForm = ({ symbol }) => {
    const [priceRef, setPriceFocus] = useFocus();
    const [quantityRef, setQuantityFocus] = useFocus();
    const [quoteQtyRef, setQuoteQtyFocus] = useFocus();
    const { base, quote } = symbol;
    const { t } = useTranslation();
    const QuantityMode = [
        {
            id: ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY,
            name: t('total'),
        },
        {
            id: ExchangeOrderEnum.QuantityMode.QUANTITY,
            name: t('amount'),
        },
    ];

    const user = useSelector(state => state.auth.user) || null;
    const balanceSpot = useSelector(state => state.wallet.SPOT);
    const selectedOrder = useSelector(state => state.spot?.selectedOrder);
    const cancelButtonRef = useRef();
    const [open, setOpen] = useState(false);
    const [quantityMode, setQuantityMode] = useState(QuantityMode[0]);
    const [percentage, setPercentage] = useState(0);
    const [placing, setPlacing] = useState(false);
    const [orderSide, setOrderSide] = useState(ExchangeOrderEnum.Side.BUY);
    const [orderType, setOrderType] = useState(ExchangeOrderEnum.Type.LIMIT);
    const [quantity, setQuantity] = useState(0);
    const [quoteQty, setQuoteQty] = useState(0);
    const [focus, setFocus] = useState();
    const [price, setPrice] = useState();
    const [loadingInitialPrice, setLoadingInitialPrice] = useState(true);
    const [initialPrice, setInitialPrice] = useState();
    const [needConfirm, setNeedConfirm] = useLocalStorage('spot:need_confirm', 'true');
    const [symbolTicker, setSymbolTicker] = useState(null);
    const exchangeConfig = useSelector(state => state.utils.exchangeConfig);
    const quoteAsset = useSelector(state => state.user.quoteAsset) || 'USDT';
    const [isLoadingMultiValueList, setIsLoadingMultiValueList] = useState(true);
    const [multiValueList, setMultiValueList] = useState({});
    const [multiValue, setMultiValue] = useState(0);
    const router = useRouter();
    const [discountTransactionFee, setDiscountTransactionFee] = useState(0);
    const [isUseQuoteQuantity, setIsUseQuoteQuantity] = useState(false);

    useAsync(async () => {
        if (symbol) {
            setMultiValue(symbol?.quote === 'VNDC' ? 24000 : 1);
            const newSymbolTicker = await getMarketWatch(getSymbolString(symbol));
            setSymbolTicker(newSymbolTicker?.[0]);
        }
    }, [symbol]);

    useAsync(async () => {
        const { data, status } = await fetchAPI({
            url: '/api/v1/asset/value_by_name',
            options: {
                method: 'GET',
            },
        });
        if (status === ApiStatus.SUCCESS) {
            await setMultiValueList(data);
            setIsLoadingMultiValueList(false);
        }
        const membership = await fetchAPI({
            url: '/api/v1/membership/user_status',
            options: {
                method: 'GET',
            },
        });
        if (membership?.data?.discountSpotFee !== 0) {
            setDiscountTransactionFee(membership?.data?.discountSpotFee);
        }
    }, []);
    useEffect(() => {
        if (!isLoadingMultiValueList) {
            if (multiValueList[quoteAsset] > 0) setMultiValue(quoteAsset === 'VNDC' ? 1 / multiValueList[quoteAsset] : multiValueList[quoteAsset]);
        }
    }, [multiValueList, isLoadingMultiValueList]);

    useEffect(() => {
        Emitter.on(PublicSocketEvent.SPOT_TICKER_UPDATE, async (data) => {
            setSymbolTicker(data);
        });
        return function cleanup() {
            Emitter.off(PublicSocketEvent.SPOT_TICKER_UPDATE);
        };
    }, [Emitter]);

    useEffect(() => {
        if (initPrice !== symbolTicker?.b) {
            initPrice = symbolTicker?.b;
            setPrice(+symbolTicker?.p);
            setQuantity(0);
            setQuoteQty(0);
            setPercentage(0);
        }
    }, [symbolTicker]);

    useEffect(() => {
        if (selectedOrder?.price) setPrice(selectedOrder?.price);
        if (selectedOrder?.quantity) setQuantity(selectedOrder?.quantity);
        if (selectedOrder?.quantity && selectedOrder?.price) setQuoteQty(floor(selectedOrder?.quantity * selectedOrder?.price, 2));
    }, [selectedOrder]);

    const currentExchangeConfig = exchangeConfig.find(e => e.symbol === getSymbolString(symbol));
    const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, currentExchangeConfig || []);
    const quantityFilter = getFilter(ExchangeOrderEnum.Filter.LOT_SIZE, currentExchangeConfig || []);
    const minNotionalFilter = getFilter(ExchangeOrderEnum.Filter.MIN_NOTIONAL, currentExchangeConfig || []);
    // const quoteAssetPrecision = currentExchangeConfig?.quoteAssetPrecision || 6;
    // const baseAssetPrecision = currentExchangeConfig?.baseAssetPrecision || 6;
    const baseAssetId = currentExchangeConfig?.baseAssetId || 0;
    const quoteAssetId = currentExchangeConfig?.quoteAssetId || 0;

    const handleClickTab = (side) => {
        setOrderSide(side);
        if (side === ExchangeOrderEnum.Side.SELL) {
            setQuantityMode(QuantityMode[1]);
        }
        setIsUseQuoteQuantity(false);
        // setOrderType(ExchangeOrderEnum.Type.LIMIT);
    };
    const handleClickSubTab = (tab) => {
        setOrderType(tab);
        setQuantityMode(QuantityMode[1]);
        setIsUseQuoteQuantity(false);
    };

    const subTabs = [
        ExchangeOrderEnum.Type.MARKET,
        ExchangeOrderEnum.Type.LIMIT,
    ];

    const closeModal = () => {
        setOpen(false);
    };
    const openModal = () => {
        setOpen(true);
    };

    const filterOrderInputApi = (input = {}) => {
        const success = null;
        const {
            stopPrice,
            type,
            useQuoteQty,
        } = defaults(input, {
            symbol: null,
            price: null,
            stopPrice: null,
            side: null,
            type: null,
            quantity: 0,
            quoteOrderQty: 0,
            useQuoteQty: false,
        });

        const config = currentExchangeConfig;
        if (config.filters && config.filters.length) {
            for (let i = 0; i < config.filters.length; i++) {
                const filter = config.filters[i];
                switch (filter.filterType) {
                    case ExchangeOrderEnum.Filter.PRICE_FILTER: {
                        const {
                            minPrice,
                            maxPrice,
                        } = filter;
                        if ([
                            ExchangeOrderEnum.Type.LIMIT,
                        ].includes(type)) {
                            if (
                                price < +minPrice
                                || price > +maxPrice
                            ) {
                                return Error.PRICE_FILTER;
                            }
                        }
                        if ([
                            ExchangeOrderEnum.Type.STOP_LIMIT,
                        ].includes(type)) {
                            if (stopPrice < minPrice || stopPrice > maxPrice) {
                                return Error.PRICE_FILTER;
                            }
                        }
                        break;
                    }
                    case ExchangeOrderEnum.Filter.LOT_SIZE: {
                        if (useQuoteQty && +quoteQty > 0) break;
                        const {
                            minQty,
                            maxQty,
                        } = filter;
                        if (+quantity < +minQty || +quantity > +maxQty) {
                            return Error.LOT_SIZE;
                        }
                        break;
                    }
                    default:
                        break;
                }
            }
        }
        return success;
    };

    const getInitialPrice = async (assetId, source) => {
        if (!(assetId)) return;
        setLoadingInitialPrice(true);
        const { data, status } = await fetchAPI({
            url: '/api/v1/asset/initial_price',
            options: {
                method: 'GET',
            },
            params: {
                assetId,
            },
            cancelToken: source.token,
        });
        setLoadingInitialPrice(false);

        if (status === ApiStatus.SUCCESS) {
            setInitialPrice(data);
        }
    };

    const handleRouteCancel = (source) => () => {
        source.cancel();
    };

    useEffect(() => {
        const source = axios.CancelToken.source();
        getInitialPrice(baseAssetId, source);
        router.events.on('routeChangeStart', handleRouteCancel(source));

        // If the component is unmounted, unsubscribe
        // from the event with the `off` method:
        return () => {
            router.events.off('routeChangeStart', handleRouteCancel(source));
        };
    }, [baseAssetId, symbol]);

    const createOrder = async () => {
        // Filter input
        try {
            const params = {
                symbol: `${base}${quote}`,
                side: orderSide,
                type: orderType,
                quantity: +quantity,
                quoteOrderQty: +quoteQty,
                price: +price,
                useQuoteQty: isUseQuoteQuantity,
            };
            // console.log(orderType, quantityMode.id, ExchangeOrderEnum.Type.MARKET, ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY);

            // if (orderType === ExchangeOrderEnum.Type.MARKET && quantityMode.id === ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY) {
            //     params.useQuoteQty = true;
            // }
            const filterResult = filterOrderInputApi(params);
            if (filterResult) {
                const { code, message } = filterResult;
                showNotification({ message: `(${code}) ${t(`error:${message}`)}`, title: 'Error', type: 'failure' }, 'bottom', 'bottom-right');
                return;
            }

            const res = await fetchAPI({
                url: '/api/v1/exchange/order',
                options: {
                    method: 'POST',
                },
                params,
            });
            const { status, data, message } = res;
            if (status === ApiStatus.SUCCESS) {
                const {
                    baseAsset,
                    displayingId,
                    executedQty,
                    executedQuoteQty,
                    price: _price,
                    quantity: _quantity,
                    quoteAsset,
                    side,
                    type,
                } = data;
                let message = '';
                if (type === ExchangeOrderEnum.Type.MARKET) {
                    message = t('spot:place_success_market', {
                        displayingId, side, type, token: `${baseAsset}/${quoteAsset}`,
                    });
                } else {
                    message = t('spot:place_success_limit', {
                        displayingId, side, type, token: `${baseAsset}/${quoteAsset}`,
                    });
                }
                showNotification({ message, title: t('common:success'), type: 'success' }, 'bottom', 'bottom-right');
            } else {
                const error = find(Error, { code: res?.code });
                const { requestId } = data;
                let shortRequestId = null;
                let content = null;
                if (typeof requestId === 'string' && requestId?.length > 0) {
                    shortRequestId = requestId.split('-')[0] + '-' + requestId.split('-')[1];
                    content = error
                        ? t(`error:${error.message}`) + ` (Code: ${shortRequestId})`
                        : t('error:ERROR_COMMON') + ` (Code: ${shortRequestId})`;
                } else {
                    content = error
                        ? t(`error:${error.message}`)
                        : t('error:ERROR_COMMON');
                }
                switch (message) {
                    case ExchangeOrderEnum.Filter.MIN_NOTIONAL:
                        content = t('error:MIN_NOTIONAL', { value: `${formatPrice(minNotionalFilter.minNotional)} ${quote}` });
                        break;
                    default:
                        break;
                }

                showNotification({ message: content, title: t('common:failure'), type: 'warning' }, 'bottom', 'bottom-right');
            }
        } catch (e) {
            // console.log('createOrder web: ', e);
        } finally {
            setPlacing(false);
            closeModal();
        }
    };

    const orderTypeLabels = {
        [ExchangeOrderEnum.Type.LIMIT]: t('spot:limit'),
        [ExchangeOrderEnum.Type.MARKET]: t('spot:market'),
    };

    const confirmModal = async () => {
        setPlacing(true);
        await createOrder();
    };

    const getAvailableText = (assetId) => {
        return formatBalance(balanceSpot?.[assetId]?.value - balanceSpot?.[assetId]?.lockedValue, 6);
    };

    const getAvailable = (assetId) => {
        return balanceSpot?.[assetId]?.value - balanceSpot?.[assetId]?.lockedValue;
    };

    const getBalance = (assetId) => {
        return balanceSpot?.[assetId]?.value;
    };

    useDebounce(
        () => {
            if (focus !== 'percentage') return;
            if (!(baseAssetId && quoteAssetId)) return;
            const available = orderSide === ExchangeOrderEnum.Side.BUY ? getAvailable(quoteAssetId) : getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +price;

            if (orderSide === ExchangeOrderEnum.Side.BUY) {
                if (orderType === ExchangeOrderEnum.Type.MARKET) {
                    _price = +symbolTicker?.p * (1 + SpotMarketPriceBias.NORMAL);
                }
                const nextQuoteQty = floor(available * percentage / 100 * (1 - currentExchangeConfig?.normalTakerFee), 2);
                const nextQuantity = floor(nextQuoteQty / _price, qtyDecimal);
                setQuantity(nextQuantity);
                setQuoteQty(nextQuoteQty);
            } else {
                const nextQuantity = floor(available * percentage / 100, qtyDecimal);
                const nextQuoteQty = floor(nextQuantity * _price, 2);
                setQuantity(nextQuantity);
                setQuoteQty(nextQuoteQty);
            }
        },
        100,
        [orderSide, orderType, quantityMode, percentage],
    );
    useDebounce(
        () => {
            if (focus !== 'price') return; // Mac dinh la limit
            if (!(baseAssetId && quoteAssetId)) return;
            const available = orderSide === ExchangeOrderEnum.Side.BUY ? getAvailable(quoteAssetId) : getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            const _price = +price;
            const _quantity = +quantity;
            const _quoteQty = +quoteQty;

            const nextQuoteQty = floor(_quantity * _price * (1 + currentExchangeConfig?.normalTakerFee), 2);
            setQuoteQty(nextQuoteQty);
            if (orderSide === ExchangeOrderEnum.Side.BUY) {
                const nextPercentage = ceil(nextQuoteQty / available, 0);
                setPercentage(nextPercentage);
            }

            // setDebouncedValue(queryFilter);
        },
        100,
        [orderSide, orderType, quantityMode, price],
    );
    useDebounce(
        () => {
            if (focus !== 'quantity') return;
            if (!(baseAssetId && quoteAssetId)) return;

            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +price;
            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p * (1 + SpotMarketPriceBias.NORMAL);
            }
            const _quantity = +quantity;
            const _quoteQty = +quoteQty;

            const nextQuoteQty = floor(_quantity * _price * (1 + currentExchangeConfig?.normalTakerFee), 2);
            setQuoteQty(nextQuoteQty);
            const available = orderSide === ExchangeOrderEnum.Side.BUY ? getAvailable(quoteAssetId) : getAvailable(baseAssetId);

            if (!(available > EPS)) return;
            let nextPercentage = 0;
            if (orderSide === ExchangeOrderEnum.Side.SELL) {
                nextPercentage = ceil(_quantity / available * 100, 0);
            } else {
                nextPercentage = ceil(nextQuoteQty / available * 100, 0);
            }
            setPercentage(Math.min(nextPercentage, 100));
        },
        100,
        [orderSide, orderType, quantityMode, quantity],
    );
    useDebounce(
        () => {
            if (focus !== 'quoteQty') return;
            if (!(baseAssetId && quoteAssetId)) return;

            const qtyDecimal = getDecimalScale(+quantityFilter?.stepSize);
            let _price = +price;
            const _quantity = +quantity;
            const _quoteQty = +quoteQty;

            if (orderType === ExchangeOrderEnum.Type.MARKET) {
                _price = +symbolTicker?.p * (1 + SpotMarketPriceBias.NORMAL);
            }
            const nextQuantity = floor(_quoteQty / _price * (1 - currentExchangeConfig?.normalTakerFee), qtyDecimal);
            setQuantity(nextQuantity);
            let nextPercentage = 0;

            const available = orderSide === ExchangeOrderEnum.Side.BUY ? getAvailable(quoteAssetId) : getAvailable(baseAssetId);
            if (!(available > EPS)) return;
            if (orderSide === ExchangeOrderEnum.Side.SELL) {
                nextPercentage = ceil(nextQuantity / available * 100, 0);
            } else {
                nextPercentage = ceil(_quoteQty / available * 100, 0);
            }
            setPercentage(Math.min(nextPercentage, 100));

            // setDebouncedValue(queryFilter);
        },
        100,
        [orderSide, orderType, quantityMode, quoteQty],
    );

    const _renderOrderSide = useMemo(() => {
        return (
            <div className="spot-place-orders-tabs mb-4">
                <div
                    className={'spot-place-orders-tab block--left capitalize ' + (orderSide === ExchangeOrderEnum.Side.BUY ? 'active' : '')}
                    onClick={() => handleClickTab(ExchangeOrderEnum.Side.BUY)}
                >{t('common:buy')}
                </div>
                <div
                    className={'spot-place-orders-tab block--right capitalize ' + (orderSide === ExchangeOrderEnum.Side.SELL ? 'active' : '')}
                    onClick={() => handleClickTab(ExchangeOrderEnum.Side.SELL)}
                >{t('common:sell')}
                </div>
            </div>
        );
    }, [orderSide, t]);

    const _renderOrderType = useMemo(() => {
        const tabs = [];
        subTabs.forEach(tab => {
            if (currentExchangeConfig?.orderTypes
            && currentExchangeConfig?.orderTypes.includes(tab)
            ) {
                tabs.push(tab);
            }
        });
        return (
            <ul className="tabs justify-start mb-6">
                {tabs.map((tab, index) => {
                    return (
                        <li className="tab-item pr-3 font-semibold" key={index}>
                            <a
                                className={'tab-link ' + (orderType === tab ? 'active' : '')}
                                onClick={() => handleClickSubTab(tab)}
                            > {orderTypeLabels[tab]}
                            </a>
                        </li>);
                })}
            </ul>
        );
    }, [orderType, t, currentExchangeConfig]);

    const _renderOrderPrice = useMemo(() => {
        // if (orderType !== ExchangeOrderEnum.Type.LIMIT) return null;
        return (
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-black-500 font-semibold">{t('common:price')}</div>
                <div className="form-group md:w-[100px] xl:w-4/6">
                    <div className="input-group">
                        {
                            orderType === ExchangeOrderEnum.Type.LIMIT
                            &&
                            (
                                <NumberFormat
                                    getInputRef={priceRef}
                                    className="form-control form-control-sm !pr-0 !pl-2 text-right font-semibold outline-none"
                                    name="stop_buy_input"
                                    thousandSeparator
                                    onFocus={() => {
                                        setFocus('price');
                                    }}
                                    decimalScale={getDecimalScale(+priceFilter?.tickSize)}
                                    allowNegative={false}
                                    value={price}
                                    onValueChange={({ value }) => {
                                        setPrice(value);
                                    }}
                                />
                            )
                        }
                        {
                            orderType === ExchangeOrderEnum.Type.MARKET
                            &&
                            (
                                <input
                                    className="form-control form-control-sm !pr-0 !pl-2 text-right font-semibold bg-white"
                                    name="stop_buy_input"
                                    type="text"
                                    disabled
                                    value={t('spot:market')}
                                />
                            )
                        }
                        <div
                            className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                        >
                            <span className="input-group-text text-black-500 ">
                                {quote}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [price, orderType, symbol, t]);

    const _renderQuantitySlider = useMemo(() => {
        return (
            <div className="mt-6 mb-14 relative">
                <InputSlider
                    axis="x"
                    x={percentage}
                    onDragStart={() => {
                        setFocus('percentage');
                        quantityRef?.current?.blur();
                        priceRef?.current?.blur();
                        quoteQtyRef?.current?.blur();
                    }}
                    onChange={({ x }) => {
                        if (orderSide === ExchangeOrderEnum.Side.BUY) {
                            setIsUseQuoteQuantity(true);
                        } else {
                            setIsUseQuoteQuantity(false);
                        }
                        setPercentage(x);
                    }}
                />
            </div>
        );
    }, [percentage, orderSide]);

    const _renderPendingFee = useMemo(() => {
        const orderValue = +quantity * (+price);
        const feeValue = orderValue * currentExchangeConfig?.normalTakerFee;
        if (discountTransactionFee !== 0 && feeValue > 0.01) {
            return (
                <>
                    <span className="line-through mr-1 ml-4 text-xs text-[#C5C6D2]">{formatSpotFee(feeValue * 2)}</span>
                    <span>{formatSpotFee(feeValue)}</span>
                </>
            );
        }
        return formatSpotFee(feeValue);
    }, [orderSide, orderType, symbol, quantity, price, t]);

    const _renderOrderFee = () => {
        return (
            <div>
                <span className="text-black-700 font-medium mr-1">
                    {
                        orderType === ExchangeOrderEnum.Type.MARKET
                            ? (
                                <SpotMarketValue
                                    type="fee"
                                    quantity={quantity}
                                    price={price}
                                    orderSide={orderSide}
                                    orderType={orderType}
                                    symbol={symbol}
                                />
                            )
                            : _renderPendingFee
                    }
                </span>
                <span
                    className="text-black-500"
                >
                    {quote}
                </span>
            </div>
        );
    };

    const _renderQuantityMode = useMemo(() => {
        return (
            <Listbox
                value={quantityMode}
                onChange={(value) => {
                    if (value === QuantityMode[0]) {
                        setIsUseQuoteQuantity(true);
                    } else {
                        setIsUseQuoteQuantity(false);
                    }
                    setQuantityMode(value);
                }}
            >
                {({ open }) => (
                    <>
                        <div className="relative z-50">
                            <Listbox.Button
                                className="relative w-full text-left cursor-pointer focus:outline-none sm:text-sm"
                            >
                                <div className="text-sm text-black-500 font-semibold">
                                    <span className="w-[100px]">
                                        {quantityMode.name}
                                    </span>
                                    <svg
                                        className="ml-1.5 inline"
                                        width="8"
                                        height="5"
                                        viewBox="0 0 8 5"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M1.31208 0C0.43606 0 -0.0165491 1.04647 0.583372 1.68483L3.22245 4.49301C3.6201 4.91614 4.29333 4.91276 4.68671 4.48565L7.27316 1.67747C7.8634 1.03664 7.40884 0 6.53761 0H1.31208Z"
                                            fill="#8B8C9B"
                                        />
                                    </svg>
                                </div>
                            </Listbox.Button>

                            <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options
                                    static
                                    className="absolute z-10 mt-1 w-32 bg-white border border-black-200 rounded transform  shadow-xl outline-none"
                                >
                                    {QuantityMode.map((mode) => (
                                        <Listbox.Option
                                            key={mode.id}
                                            className={({ selected, active }) => classNames(
                                                selected ? 'text-teal font-medium' : 'text-black-600',
                                                'text-sm  cursor-pointer hover:text-teal py-1 text-center hover:bg-gray-100 px-4',
                                            )}
                                            value={mode}
                                        >
                                            {({ selected, active }) => mode.name}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </>
                )}
            </Listbox>
        );
    }, [quantityMode]);

    const _renderOrderQuoteQty = useMemo(() => {
        if (orderType === ExchangeOrderEnum.Type.MARKET
            && quantityMode.id !== ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY) return null;
        return (
            <div className="flex justify-between items-center mb-3">

                {
                    orderType === ExchangeOrderEnum.Type.MARKET && orderSide === ExchangeOrderEnum.Side.BUY
                        ? _renderQuantityMode
                        : <div className="text-sm text-black-500 font-semibold ">{t('total')}</div>
                }
                <div className="form-group md:w-[100px] xl:w-4/6">
                    <div className="input-group">

                        <NumberFormat
                            getInputRef={quoteQtyRef}
                            className="form-control form-control-sm !pr-0 !pl-2 text-right font-semibold outline-none"
                            name="quoteQty"
                            onFocus={() => {
                                setFocus('quoteQty');
                            }}
                            thousandSeparator
                            decimalScale={2}
                            allowNegative={false}
                            value={quoteQty}
                            onChange={() => setIsUseQuoteQuantity(true)}
                            onValueChange={({ value }) => {
                                setQuoteQty(value);
                            }}
                        />

                        <div
                            className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                        >
                            <span className="input-group-text text-black-500 ">
                                {quote}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [price, orderType, symbol, t, quoteQty, quantityMode]);

    const _renderOrderQuantity = useMemo(() => {
        if (orderType === ExchangeOrderEnum.Type.MARKET
                && quantityMode.id !== ExchangeOrderEnum.QuantityMode.QUANTITY) return null;
        return (
            <div className="flex justify-between items-center mb-3">
                {
                    orderType === ExchangeOrderEnum.Type.MARKET && orderSide === ExchangeOrderEnum.Side.BUY
                        ? _renderQuantityMode
                        : <div className="text-sm text-black-500 font-semibold ">{t('common:amount')}</div>
                }

                <div className="form-group md:w-[100px] xl:w-4/6">
                    <div className="input-group">
                        <NumberFormat
                            getInputRef={quantityRef}
                            className="form-control form-control-sm !pr-0 !pl-2 text-right font-semibold outline-none"
                            name="quantity"
                            onFocus={() => {
                                setFocus('quantity');
                            }}
                            thousandSeparator
                            decimalScale={getDecimalScale(+quantityFilter?.stepSize)}
                            allowNegative={false}
                            value={quantity}
                            onChange={() => setIsUseQuoteQuantity(false)}
                            onValueChange={({ value }) => {
                                setQuantity(value);
                            }}
                        />

                        <div
                            className="input-group-append px-3 flex-shrink-0 w-[60px] flex justify-end items-center"
                        >
                            <span className="input-group-text text-black-500">
                                {base}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    [quantity, symbol, quantityMode, orderSide, orderType]);

    const _renderOrderValue = useMemo(() => {
        return (
            <>
                {formatWallet(price * quantity)}
            </>
        );
    }, [price, quantity, symbol]);

    const _renderPlaceOrderButton = () => {
        if (!user) {
            return (
                <div className="mb-6">
                    <a href={getLoginUrl('sso')} className="btn w-full capitalize button-common block text-center">
                        {t('sign_in_to_continue')}
                    </a>
                </div>
            );
        }

        return (
            <div className="mb-6">
                <button
                    // onClick={() => (orderType === ExchangeOrderEnum.Type.LIMIT ? openModal() : (needConfirm === 'true' ? openModal() : confirmModal()))}
                    onClick={confirmModal}
                    type="button"
                    disabled={placing || currentExchangeConfig?.status === 'MAINTAIN'}
                    className={'btn w-full capitalize disabled:bg-black-400 ' + (orderSide === ExchangeOrderEnum.Side.BUY ? 'btn-green' : 'btn-red')}
                >{t(orderSide)} {base}
                </button>
            </div>
        );
    };

    const _renderUserBalance = () => {
        return (
            <>
                <h3 className="font-semibold text-lg text-black mb-3">{t('spot:balance')}</h3>
                <div className="flex justify-between items-center">
                    <div className="text-sm text-black-500 font-semibold ">{t('spot:available_balance')}</div>
                    <div className="text-sm text-black-700 font-semibold text-right">
                        {
                            // eslint-disable-next-line no-nested-ternary
                            orderSide === ExchangeOrderEnum.Side.BUY
                                ? quoteAssetId ? getAvailableText(quoteAssetId) : 0
                                : baseAssetId ? getAvailableText(baseAssetId) : 0
                        } {orderSide === ExchangeOrderEnum.Side.BUY ? quote : base}
                    </div>
                </div>
            </>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    return (
        <>
            <div className="bg-white h-full px-3 pb-6 spot-place-orders-container rounded">
                {/* <h3 className="font-semibold text-lg text-black pt-6 pb-4 px-1.5 dragHandleArea">{t('spot:place_order')}</h3> */}
                {/* {_renderOrderSide} */}
                {_renderOrderType}

                <div className="grid grid-cols-2 gap-8">
                    <div className="">

                        {_renderOrderPrice}
                        {_renderOrderQuantity}
                        {_renderOrderQuoteQty}
                        {_renderQuantitySlider}
                        {currentExchangeConfig?.status === 'MAINTAIN' && <p className="text-sm mb-3 flex"><span className="mr-2"><IconLock width={12} height={16} /></span> <span>{t('spot:pair_under_maintenance', { base: symbol?.base, quote: symbol?.quote })}</span></p>}
                        {_renderPlaceOrderButton()}
                    </div>
                    <div className="">

                        {_renderOrderPrice}
                        {_renderOrderQuantity}
                        {_renderOrderQuoteQty}
                        {_renderQuantitySlider}
                        {currentExchangeConfig?.status === 'MAINTAIN' && <p className="text-sm mb-3 flex"><span className="mr-2"><IconLock width={12} height={16} /></span> <span>{t('spot:pair_under_maintenance', { base: symbol?.base, quote: symbol?.quote })}</span></p>}
                        {_renderPlaceOrderButton()}
                    </div>
                </div>
                {/* <div className="tab-content">

                    {_renderOrderPrice}
                    {_renderOrderQuantity}
                    {_renderOrderQuoteQty}
                    {_renderQuantitySlider}
                    {currentExchangeConfig?.status === 'MAINTAIN' && <p className="text-sm mb-3 flex"><span className="mr-2"><IconLock width={12} height={16} /></span> <span>{t('spot:pair_under_maintenance', { base: symbol?.base, quote: symbol?.quote })}</span></p>}
                    {_renderPlaceOrderButton()}
                </div> */}
                {/* {_renderUserBalance()} */}
                {/* {_renderAssetPortfolio()} */}

            </div>
            <Transition show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 z-10 overflow-y-auto"
                    initialFocus={cancelButtonRef}
                    static
                    open={open}
                    onClose={closeModal}
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
                            <Dialog.Overlay className="fixed inset-0 bg-black-800 bg-opacity-70" />
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
                                className="inline-block min-w-[400px] py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
                            >
                                <Dialog.Title className="border-b px-5">
                                    <div className="flex justify-between items-center mb-3">
                                        <p
                                            className="text-xl text-black-800 font-bold"
                                        >{t('spot:confirm_order')}
                                        </p>
                                        <button className="btn btn-icon !p-0" type="button" onClick={closeModal}>
                                            <X color={iconColor} size={24} />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-semibold pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="mr-2">
                                                <AssetLogo assetCode={base} />
                                            </div>
                                            <div>
                                                <div>{`${base}/${quote}`}</div>
                                                <p className="text-xs text-[#8B8C9B] font-normal">{getAssetName(currentExchangeConfig?.baseAssetId)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span>{t(`spot:${orderType}`)}</span>
                                            <span className="px-1 text-black-500">/</span>
                                            <span
                                                className={orderSide === 'buy' ? 'text-mint' : 'text-pink'}
                                            >{t(orderSide)}
                                            </span>
                                        </div>
                                    </div>
                                </Dialog.Title>
                                <div className="px-5 mt-4 text-sm">
                                    {/* <div className="flex justify-between items-center mb-4"> */}
                                    {/*    <div className="text-sm text-black-500">Stop:</div> */}
                                    {/*    <div> */}
                                    {/*        <span className="text-black-700 font-medium mr-1">{ }</span> */}
                                    {/*        <span className="text-black-500">VNDC</span> */}
                                    {/*    </div> */}
                                    {/* </div> */}
                                    {
                                        orderType === ExchangeOrderEnum.Type.LIMIT
                                        && (
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="text-sm text-black-500">{t('price')}</div>
                                                <div>
                                                    <span
                                                        className="text-black-700 font-medium mr-1"
                                                    >{formatPrice(price, exchangeConfig, quote)}
                                                    </span>
                                                    <span className="text-black-500">{quote}</span>
                                                </div>
                                            </div>
                                        )
                                    }

                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm text-black-500">{t('amount')}</div>
                                        <div>
                                            <span
                                                className="text-black-700 font-medium mr-1"
                                            >{quantity}
                                            </span>
                                            <span className="text-black-500">{base}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm text-black-500 inline-flex items-center">{t('transaction_fee')} {
                                            discountTransactionFee !== 0 && (
                                                <div className="ml-2">
                                                    <span className="bg-[#F64953] rounded-[4px] px-1 py-[2px] text-white text-xxs mr-1">{discountTransactionFee}%</span>
                                                    <span className="bg-[#2D9AFF] rounded-[4px] px-1 py-[2px] text-white text-xxs">Member</span>
                                                </div>
                                            )
                                        }
                                        </div>
                                        {_renderOrderFee()}
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm text-black-500">{t('total')}</div>
                                        <div>
                                            <span
                                                className="text-black-700 font-medium mr-1"
                                            >
                                                {
                                                    orderType === ExchangeOrderEnum.Type.MARKET
                                                        ? (
                                                            <SpotMarketValue
                                                                type="order_value"
                                                                quantity={quantity}
                                                                price={price}
                                                                orderSide={orderSide}
                                                                orderType={orderType}
                                                                symbol={symbol}
                                                            />
                                                        )
                                                        : _renderOrderValue
                                                }
                                            </span>
                                            <span className="text-black-500">{quote}</span>
                                        </div>
                                    </div>
                                    {/* <div className="rounded border bg-black-100 px-3 py-4 text-xs text-black-500"> */}
                                    {/*    <Trans i18nKey="alert_stop_limit" t={t}> */}
                                    {/*        Nếu giá gần nhất lớn hơn hoặc bằng <span className="font-semibold text-black-700">{{ stop: '12,245,235,111 VNDC' }}</span>, một lệnh mua mua <span className="font-semibold text-black-700">{{ amount: '0,01 BTC' }}</span> ở mức giá <span className="font-semibold text-black-700">{{ price: '12,600,000,000 VNDC' }}</span> sẽ được đặt tự động. */}
                                    {/*    </Trans> */}
                                    {/* </div> */}

                                    {
                                        orderType !== ExchangeOrderEnum.Type.LIMIT && (
                                            <div className="">
                                                <label className="inline-flex items-center mt-3 cursor-pointer">
                                                    <input
                                                        defaultChecked={needConfirm !== 'true'}
                                                        onChange={(event) => setNeedConfirm(event?.target?.checked ? 'false' : 'true')}
                                                        type="checkbox"
                                                        className="form-checkbox h-3 w-3 text-teal-700 ring-0 focus:ring-0 outline-none focus:outline-none border-black-400 rounded-sm"
                                                    />
                                                    <span className="ml-2 text-black-600 text-xs select-none">
                                                        Đặt ngay không cần xem trước
                                                    </span>
                                                </label>
                                            </div>
                                        )
                                    }
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-primary w-full disabled:opacity-50"
                                            onClick={confirmModal}
                                            disabled={placing}
                                        >
                                            Xác nhận
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default SimplePlaceOrderForm;
