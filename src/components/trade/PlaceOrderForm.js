/* eslint-disable react-hooks/exhaustive-deps */
import { IconLock } from 'src/components/common/Icons';
import ceil from 'lodash/ceil';
import defaults from 'lodash/defaults';
import find from 'lodash/find';
import floor from 'lodash/floor';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMarketWatch } from 'redux/actions/market';
import InputSlider from 'src/components/trade/InputSlider';
import * as Error from 'src/redux/actions/apiError';
import { ApiStatus, ExchangeOrderEnum, PublicSocketEvent, SpotMarketPriceBias } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { formatPrice, formatWallet, getDecimalScale, getFilter, getLoginUrl, getSymbolString, setTransferModal, getUnit } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import ButtonClip from 'components/common/V2/ButtonV2/ButtonClip';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import TradingInput from './TradingInput';
import AddCircle from 'components/svg/AddCircle';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { roundToDown } from 'round-to';
import { formatNumber } from 'redux/actions/utils';
import ErrorTriggersIcon from 'components/svg/ErrorTriggers';
import { WalletType } from 'redux/actions/const';
import { max, min } from 'lodash/math';

let initPrice = '';

const rate = 1.001;
const PlaceOrderForm = ({ symbol, orderBook }) => {
    const dispatch = useDispatch();
    const { base, quote } = symbol;
    const { t } = useTranslation();
    const QuantityMode = [
        {
            id: ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY,
            name: t('total')
        },
        {
            id: ExchangeOrderEnum.QuantityMode.QUANTITY,
            name: t('amount')
        }
    ];
    const user = useSelector((state) => state.auth.user) || null;
    const balanceSpot = useSelector((state) => state.wallet.SPOT);
    const selectedOrder = useSelector((state) => state.spot?.selectedOrder);
    const unitConfig = useSelector((state) => getUnit(state, quote));
    const [open, setOpen] = useState(false);
    const [quantityMode, setQuantityMode] = useState(QuantityMode[0]);
    const [percentage, setPercentage] = useState(0);
    const [placing, setPlacing] = useState(false);
    const [orderSide, setOrderSide] = useState(ExchangeOrderEnum.Side.BUY);
    const [orderType, setOrderType] = useState(ExchangeOrderEnum.Type.LIMIT);
    const [quantity, setQuantity] = useState('');
    const [quoteQty, setQuoteQty] = useState('');
    const [price, setPrice] = useState();
    const [symbolTicker, setSymbolTicker] = useState(null);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    const [showAlert, setShowAlert] = useState(false);
    const isChangeSlider = useRef(false);
    const alert = useRef({
        type: '',
        title: '',
        message: '',
        notes: ''
    });
    const mount = useRef(false);

    const [ticker, setTicker] = useState({ bid: 0, ask: 0 });

    useEffect(() => {
        if (orderBook) {
            const asks = orderBook?.asks.map((e) => e[0]);
            const bids = orderBook?.bids.map((e) => e[0]);
            setTicker({
                bid: max(bids),
                ask: min(asks)
            });
        }
    }, [orderBook]);

    useEffect(async () => {
        if (symbol) {
            const newSymbolTicker = await getMarketWatch(getSymbolString(symbol));
            setSymbolTicker(newSymbolTicker?.[0]);
        }
    }, [symbol]);

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
            setQuantity('');
            setQuoteQty('');
            setPercentage(0);
        }
    }, [symbolTicker]);

    useEffect(() => {
        mount.current = true;
        if (selectedOrder?.price) setPrice(selectedOrder?.price);
        if (selectedOrder?.quantity) setQuantity(selectedOrder?.quantity || '');
        if (selectedOrder?.quantity && selectedOrder?.price) {
            setQuoteQty(floor(selectedOrder?.quantity * selectedOrder?.price, 2) || '');
        }
    }, [selectedOrder]);

    const currentExchangeConfig = exchangeConfig.find((e) => e.symbol === getSymbolString(symbol));
    const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, currentExchangeConfig || []);
    const quantityFilter = getFilter(ExchangeOrderEnum.Filter.LOT_SIZE, currentExchangeConfig || []);
    const minNotionalFilter = getFilter(ExchangeOrderEnum.Filter.MIN_NOTIONAL, currentExchangeConfig || []);
    const quantityMarketFilter = getFilter(ExchangeOrderEnum.Filter.MARKET_LOT_SIZE, currentExchangeConfig || []);
    const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, currentExchangeConfig || []);
    // const quoteAssetPrecision = currentExchangeConfig?.quoteAssetPrecision || 6;
    // const baseAssetPrecision = currentExchangeConfig?.baseAssetPrecision || 6;
    const baseAssetId = currentExchangeConfig?.baseAssetId || 0;
    const quoteAssetId = currentExchangeConfig?.quoteAssetId || 0;
    const isMarket = orderType === ExchangeOrderEnum.Type.MARKET;
    const isBuy = orderSide === ExchangeOrderEnum.Side.BUY;
    const isFocus = useRef();

    const handleClickTab = (side) => {
        const _isBuy = side === ExchangeOrderEnum.Side.BUY;
        const _balance = getBalance(side);
        let _price = price;
        if (isMarket) {
            _price = +symbolTicker?.p * (1 + SpotMarketPriceBias.NORMAL);
        }
        const per = ceil(((+quantity * (_isBuy ? _price : 1)) / _balance) * 100, 0);
        isFocus.current = 'side';
        setPercentage(per);
        setOrderSide(side);
        if (side === ExchangeOrderEnum.Side.SELL) {
            setQuantityMode(QuantityMode[1]);
        }
    };

    useEffect(() => {
        isFocus.current = 'qty';
    }, [orderSide, percentage]);

    const handleClickSubTab = (tab) => {
        setOrderType(tab);
    };

    const subTabs = [ExchangeOrderEnum.Type.LIMIT, ExchangeOrderEnum.Type.MARKET];

    const closeModal = () => {
        setOpen(false);
    };

    const filterOrderInputApi = (input = {}) => {
        const success = null;
        const { stopPrice, type, useQuoteQty } = defaults(input, {
            symbol: null,
            price: null,
            stopPrice: null,
            side: null,
            type: null,
            quantity: 0,
            quoteOrderQty: 0,
            useQuoteQty: false
        });

        const config = currentExchangeConfig;
        if (config.filters && config.filters.length) {
            for (let i = 0; i < config.filters.length; i++) {
                const filter = config.filters[i];
                switch (filter.filterType) {
                    case ExchangeOrderEnum.Filter.PRICE_FILTER: {
                        const { minPrice, maxPrice } = filter;
                        if ([ExchangeOrderEnum.Type.LIMIT].includes(type)) {
                            if (price < +minPrice || price > +maxPrice) {
                                return Error.PRICE_FILTER;
                            }
                        }
                        if ([ExchangeOrderEnum.Type.STOP_LIMIT].includes(type)) {
                            if (stopPrice < minPrice || stopPrice > maxPrice) {
                                return Error.PRICE_FILTER;
                            }
                        }
                        break;
                    }
                    case ExchangeOrderEnum.Filter.LOT_SIZE: {
                        if (useQuoteQty && +quoteQty > 0) break;
                        const { minQty, maxQty } = filter;
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
                useQuoteQty: orderType === ExchangeOrderEnum.Type.MARKET && percentage === 100
            };
            // console.log(orderType, quantityMode.id, ExchangeOrderEnum.Type.MARKET, ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY);

            // if (orderType === ExchangeOrderEnum.Type.MARKET && quantityMode.id === ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY) {
            //     params.useQuoteQty = true;
            // }
            const filterResult = filterOrderInputApi(params);
            if (filterResult) {
                const { code, message } = filterResult;
                // showNotification(
                //     {
                //         message: `(${code}) ${t(`error:${message}`)}`,
                //         title: 'Error',
                //         type: 'failure'
                //     },
                //     2500,
                //     'bottom',
                //     'bottom-right'
                // );
                alert.current = {
                    type: 'error',
                    title: t('common:failed'),
                    message: t(`error:${message}`),
                    notes: `(${code})`
                };
                return;
            }

            const res = await fetchAPI({
                url: '/api/v3/spot/order',
                options: {
                    method: 'POST'
                },
                params
            });
            const { status, data, message } = res;
            if (status === ApiStatus.SUCCESS) {
                const { baseAsset, displayingId, executedQty, executedQuoteQty, price: _price, quantity: _quantity, quoteAsset, side, type } = data;
                let message = '';
                if (type === ExchangeOrderEnum.Type.MARKET) {
                    message = t('spot:place_success_market', {
                        displayingId,
                        side,
                        type,
                        token: `${baseAsset}/${quoteAsset}`
                    });
                } else {
                    message = t('spot:place_success_limit', {
                        displayingId,
                        side,
                        type,
                        token: `${baseAsset}/${quoteAsset}`
                    });
                }
                alert.current = {
                    type: 'success',
                    title: t('common:success'),
                    message: message
                };
                // showNotification({ message, title: t('common:success'), type: 'success' }, 2500, 'bottom', 'bottom-right');
            } else {
                const error = find(Error, { code: res?.code });
                const { requestId } = data;
                let shortRequestId = null;
                let content = null;
                if (typeof requestId === 'string' && requestId?.length > 0) {
                    shortRequestId = requestId.split('-')[0].toUpperCase();
                    content = error ? t(`error:${error.message}`) : t('error:ERROR_COMMON');
                } else {
                    content = error ? t(`error:${error.message}`) : t('error:ERROR_COMMON');
                }
                switch (message) {
                    case ExchangeOrderEnum.Filter.MIN_NOTIONAL:
                        content = t('error:MIN_NOTIONAL', {
                            value: `${formatPrice(minNotionalFilter.minNotional)} ${quote}`
                        });
                        break;
                    case ExchangeOrderEnum.Filter.MAX_TOTAL_VOLUME:
                        content = t('error:MAX_TOTAL_VOLUME', {
                            value: `${formatPrice(data?.notional)} ${quote}`
                        });
                        break;
                    default:
                        break;
                }
                alert.current = {
                    type: 'error',
                    title: t('common:failed'),
                    message: content,
                    notes: `(${shortRequestId})`
                };
                // showNotification(
                //     {
                //         message: content,
                //         title: t('common:failure'),
                //         type: 'warning'
                //     },
                //     2500,
                //     'bottom',
                //     'bottom-right'
                // );
            }
        } catch (e) {
            // console.log('createOrder web: ', e);
        } finally {
            setPlacing(false);
            setShowAlert(true);
            closeModal();
        }
    };

    const orderTypeLabels = {
        [ExchangeOrderEnum.Type.LIMIT]: t('spot:limit'),
        [ExchangeOrderEnum.Type.MARKET]: t('spot:market')
    };

    const confirmModal = async () => {
        setPlacing(true);
        await createOrder();
    };

    const getAvailable = (assetId) => {
        return balanceSpot?.[assetId]?.value - balanceSpot?.[assetId]?.locked_value;
    };

    const getBalance = (side) => {
        const token = getAvailable(baseAssetId);
        const stable = getAvailable(quoteAssetId);
        const _isBuy = side === ExchangeOrderEnum.Side.BUY;
        return roundToDown(_isBuy ? stable : token, _isBuy ? 2 : decimals.qty);
    };

    const decimals = useMemo(() => {
        return {
            price: getDecimalScale(+priceFilter?.tickSize),
            qty: getDecimalScale(+quantityFilter?.stepSize),
            symbol: unitConfig?.assetDigit ?? 2
        };
    }, [priceFilter, quantityFilter, unitConfig]);

    const balance = useMemo(() => {
        return getBalance(orderSide);
    }, [quoteAssetId, balanceSpot, baseAssetId, orderSide]);

    const getPrice = (side, price) => {
        return orderType === ExchangeOrderEnum.Type.MARKET ? (side === ExchangeOrderEnum.Side.BUY ? ticker.ask : ticker.bid) : price;
    };

    const getPercent = (value, balance) => {
        const per = value ? ((value / balance) * 100).toFixed(0) : 0;
        return Math.min(per, 100);
    };

    useEffect(() => {
        setPrice(symbolTicker?.p);
        setQuantity('');
        setQuoteQty('');
        setPercentage(0);
    }, [orderType, orderSide]);

    const onHandleChange = (key, value, side) => {
        const _isBuy = side === ExchangeOrderEnum.Side.BUY;
        const _price = getPrice(side, key === 'price' ? value : price);
        let qty = 0,
            _quoteQty = 0,
            per = 0;
        switch (key) {
            case 'price':
                if (_isBuy) {
                    qty = roundToDown(quoteQty / (_price * rate), decimals.qty);
                    setQuantity(qty);
                } else {
                    _quoteQty = floor(quantity * (_price * rate), decimals.symbol);
                    setQuoteQty(quoteQty);
                }
                setPrice(value);
                break;
            case 'percentage':
                isChangeSlider.current = true;
                if (isBuy) {
                    _quoteQty = floor((balance * value) / 100, decimals.symbol);
                    qty = roundToDown(_quoteQty / (_price * rate), decimals.qty);
                } else {
                    qty = roundToDown((balance * value) / 100, decimals.qty);
                    _quoteQty = floor(qty * (_price * rate), decimals.symbol);
                }
                setQuoteQty(_quoteQty);
                setQuantity(qty);
                setPercentage(value);
                break;
            case 'qty':
                if (isChangeSlider.current || isFocus.current !== key) {
                    isChangeSlider.current = false;
                    return;
                }
                quoteQty = floor(value * (_price * rate), decimals.symbol);
                per = getPercent(isBuy ? quoteQty : value, balance);
                setQuantity(value);
                setQuoteQty(quoteQty);
                setPercentage(per);
                break;
            case 'quote':
                if (isChangeSlider.current || isFocus.current !== key) {
                    isChangeSlider.current = false;
                    return;
                }
                qty = floor(value / (_price * rate), decimals.qty);
                per = getPercent(isBuy ? value : qty, balance);
                setQuantity(qty);
                setQuoteQty(value);
                setPercentage(per);
                break;
            default:
                break;
        }
    };

    const _renderOrderSide = () => {
        return (
            <div className="spot-place-orders-tabs mb-4">
                <ButtonClip
                    onClick={() => handleClickTab(ExchangeOrderEnum.Side.BUY)}
                    mode={ExchangeOrderEnum.Side.BUY}
                    active={orderSide === ExchangeOrderEnum.Side.BUY}
                >
                    {t('common:buy')}
                </ButtonClip>
                <ButtonClip
                    onClick={() => handleClickTab(ExchangeOrderEnum.Side.SELL)}
                    mode={ExchangeOrderEnum.Side.SELL}
                    active={orderSide === ExchangeOrderEnum.Side.SELL}
                >
                    {t('common:sell')}
                </ButtonClip>
            </div>
        );
    };

    const validatePrice = useMemo(() => {
        return {
            min: Math.max(priceFilter.minPrice, symbolTicker?.p * percentPriceFilter?.multiplierDown),
            max: Math.max(priceFilter.maxPrice, symbolTicker?.p * percentPriceFilter?.multiplierUp)
        };
    }, [priceFilter, percentPriceFilter, symbolTicker]);

    const validateTotal = (price) => {
        return {
            min: +minNotionalFilter?.minNotional,
            max: balance * (isBuy ? 1 : price)
        };
    };

    const validateAmount = (price) => {
        if (!price) {
            return {
                min: quantityFilter?.minQty,
                max: quantityFilter?.maxQty
            };
        }
        const validate_limit = {
            min: Math.max(+quantityFilter?.minQty, +(+minNotionalFilter?.minNotional / price).toFixed(decimals.qty)),
            max: roundToDown(Math.min(+quantityFilter?.maxQty, +(balance / (isBuy ? price : 1))), decimals.qty)
        };
        const validate_market = {
            min: Math.max(+quantityFilter?.minQty, +(+minNotionalFilter?.minNotional / symbolTicker?.p).toFixed(decimals.qty), quantityMarketFilter?.minQty),
            max: roundToDown(Math.min(+quantityFilter?.maxQty, +(balance / (isBuy ? symbolTicker?.p : 1)), quantityMarketFilter?.maxQty), decimals.qty)
        };
        return isMarket ? validate_market : validate_limit;
    };

    const notEnough = useMemo(() => {
        const { min, max } = validateAmount(getPrice(orderSide, price));
        return max < min;
    }, [price, orderSide, balance]);

    const validator = (key, value, isText = false) => {
        const _price = getPrice(orderSide, price);
        let rs = { isValid: true, msg: '' };
        let validate = {};
        if (notEnough && (key === 'amount' || key === 'quote')) {
            return {
                isValid: false,
                msg: ''
            };
        }
        switch (key) {
            case 'price':
                if (value < validatePrice.min || value > validatePrice.max) {
                    rs = {
                        isValid: false,
                        msg: textDescription(key, { min: validatePrice.min, max: validatePrice.max })
                    };
                }
                break;
            case 'amount':
                validate = validateAmount(+_price);
                if (isText) {
                    return { min: validate.min, max: validate.max };
                }
                if (value < validate.min || value > validate.max) {
                    rs = {
                        isValid: false,
                        msg: textDescription(key, { min: validate.min, max: validate.max })
                    };
                }
                break;
            case 'quote':
                validate = validateTotal(+_price);
                if (isText) {
                    return { min: validate.min, max: validate.max };
                }
                if (value < validate.min || value > validate.max) {
                    rs = {
                        isValid: false,
                        msg: textDescription(key, { min: validate.min, max: validate.max })
                    };
                }
                break;
            default:
                break;
        }
        return rs;
    };

    const textDescription = (key, data) => {
        let rs = {};
        switch (key) {
            case 'price':
                rs = {
                    min: `${t('common:min')}: ${formatNumber(data?.min, decimals.price)} ${quote}`,
                    max: `${t('common:max')}: ${formatNumber(data?.max, decimals.price)} ${quote}`
                };
                return `${rs.min} - ${rs.max}`;
            case 'amount':
                rs = {
                    min: `${t('common:min')}: ${formatNumber(data?.min, decimals.qty)} ${base}`,
                    max: `${t('common:max')}: ${formatNumber(data?.max, decimals.qty)} ${base}`
                };
                return `${rs.min} - ${rs.max}`;
            case 'quote':
                rs = {
                    min: `${t('common:min')}: ${formatNumber(data?.min, decimals.price)} ${quote}`,
                    max: `${t('common:max')}: ${formatNumber(data?.max, decimals.price)} ${quote}`
                };
                return `${rs.min} - ${rs.max}`;
            default:
                break;
        }
        return '';
    };

    const _renderOrderType = useMemo(() => {
        const tabs = [];
        subTabs.forEach((tab) => {
            tabs.push(tab);
        });

        return (
            <div className="tabs justify-start mb-4">
                {tabs.map((tab, index) => {
                    return (
                        <div className="px-2 w-1/2 !m-0">
                            <div className={`tab-item  ${orderType === tab ? 'active' : ''}`} key={index}>
                                <a
                                    className={'tab-link text-txtSecondary dark:text-txtSecondary-dark ' + (orderType === tab ? 'active' : '')}
                                    onClick={() => handleClickSubTab(tab)}
                                >
                                    {orderTypeLabels[tab]}
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }, [orderType, t, currentExchangeConfig]);

    const _renderOrderPrice = () => {
        // if (orderType !== ExchangeOrderEnum.Type.LIMIT) return null;
        return (
            <div className="flex justify-between items-center mb-4">
                <TradingInput
                    label={t('common:price')}
                    labelClassName="!text-sm !font-normal"
                    value={isMarket ? t('spot:market') : price}
                    onValueChange={({ value }) => {
                        onHandleChange('price', value);
                    }}
                    name="stop_buy_input"
                    disabled={isMarket}
                    allowNegative={false}
                    decimalScale={decimals.price}
                    errorTooltip={false}
                    validator={!isMarket && validator('price', price)}
                    textDescription={textDescription('price', { min: validatePrice.min, max: validatePrice.max })}
                    containerClassName="w-full dark:bg-dark-2"
                    tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-sm select-none"
                    renderTail={() => <span className="flex items-center">{quote}</span>}
                    clearAble
                />
            </div>
        );
    };

    const _renderQuantitySlider = () => {
        return (
            <div className="my-4 relative">
                <InputSlider
                    axis="x"
                    labelSuffix="%"
                    useLabel
                    positionLabel="top"
                    x={percentage}
                    onChange={({ x }) => {
                        onHandleChange('percentage', x, orderSide);
                    }}
                />
            </div>
        );
    };

    const _renderOrderQuoteQty = () => {
        if (isMarket && quantityMode.id !== ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY) {
            return null;
        }
        return (
            <div className="flex justify-between items-center mb-4">
                <TradingInput
                    label={t('total')}
                    labelClassName="!text-sm !font-normal"
                    value={quoteQty}
                    onFocus={() => (isFocus.current = 'quote')}
                    onValueChange={({ value }) => onHandleChange('quote', value)}
                    name="quoteQty"
                    allowNegative={false}
                    decimalScale={2}
                    validator={validator('quote', quoteQty)}
                    textDescription={textDescription('quote', validator('quote', quoteQty, true))}
                    errorTooltip={false}
                    containerClassName="w-full dark:bg-dark-2"
                    tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-sm select-none"
                    renderTail={() => <span className="flex items-center">{quote}</span>}
                    clearAble
                />
            </div>
        );
    };

    const _renderOrderQuantity = () => {
        return (
            <div className="flex justify-between items-center mb-2">
                <TradingInput
                    label={t('common:amount')}
                    labelClassName="!text-sm !font-normal"
                    value={quantity}
                    onFocus={() => (isFocus.current = 'qty')}
                    onValueChange={({ value }) => onHandleChange('qty', value)}
                    name="quantity"
                    allowNegative={false}
                    decimalScale={decimals.qty}
                    validator={validator('amount', quantity)}
                    textDescription={textDescription('amount', validator('amount', quoteQty, true))}
                    errorTooltip={false}
                    containerClassName="w-full dark:bg-dark-2"
                    tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-sm select-none"
                    renderTail={() => <span className="flex items-center">{base}</span>}
                    clearAble
                />
            </div>
        );
    };

    const _renderOrderValue = useMemo(() => {
        return <>{formatWallet(price * quantity)}</>;
    }, [price, quantity, symbol]);

    const _renderPlaceOrderButton = () => {
        const isError = !validator('amount', quantity)?.isValid || !validator('total', quoteQty)?.isValid || (!isMarket && !validator('price', price))?.isValid;
        return (
            <>
                <div className="mt-8">
                    {!user ? (
                        <>
                            <a href={getLoginUrl('sso', 'register')}>
                                <ButtonV2>{t('common:sign_up')}</ButtonV2>
                            </a>
                            <a href={getLoginUrl('sso')}>
                                <ButtonV2 className="mt-3" variants="secondary">
                                    {t('common:sign_in')}
                                </ButtonV2>
                            </a>
                        </>
                    ) : (
                        <ButtonV2
                            onClick={confirmModal}
                            disabled={placing || currentExchangeConfig?.status === 'MAINTAIN' || isError}
                            className={isBuy ? 'bg-teal' : '!bg-red'}
                        >
                            {t(orderSide)} {base}
                        </ButtonV2>
                    )}
                </div>
            </>
        );
    };

    const onTransFer = () => {
        dispatch(setTransferModal({ isVisible: true, fromWallet: WalletType.FUTURES, toWallet: WalletType.SPOT }));
    };

    const _renderUserBalance = () => {
        return (
            <>
                <div className="flex justify-between items-center">
                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark flex items-center space-x-1">
                        <span>{t('common:available_balance')}</span>
                        <AddCircle onClick={onTransFer} className="cursor-pointer" />
                    </div>
                    <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark text-right">
                        {
                            // eslint-disable-next-line no-nested-ternary
                            isBuy ? formatNumber(balance, 2) : formatNumber(balance, decimals.qty)
                        }{' '}
                        {isBuy ? quote : base}
                    </div>
                </div>
                {notEnough && (
                    <div className="mt-2 space-x-1 flex items-center text-red text-xs">
                        <ErrorTriggersIcon />
                        <span>{t('error:BALANCE_NOT_ENOUGH')}</span>
                    </div>
                )}
            </>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    };

    return (
        <>
            <AlertModalV2
                isVisible={showAlert}
                onClose={() => setShowAlert(false)}
                type={alert.current.type}
                title={alert.current.title}
                message={alert.current.message}
                notes={alert.current.notes}
            />
            <div className="py-6 px-4 spot-place-orders-container rounded">
                <h3 className="font-semibold text-sm text-txtPrimary dark:text-txtPrimary-dark mb-6 dragHandleArea">{t('spot:place_order')}</h3>
                {_renderOrderSide()}
                {_renderOrderType}

                <div className="tab-content">
                    {_renderOrderPrice()}
                    {_renderOrderQuantity()}
                    {_renderQuantitySlider()}
                    {_renderOrderQuoteQty()}
                    {currentExchangeConfig?.status === 'MAINTAIN' && (
                        <p className="text-sm mb-3 flex">
                            <span className="mr-2">
                                <IconLock width={12} height={16} />
                            </span>{' '}
                            <span>
                                {t('spot:pair_under_maintenance', {
                                    base: symbol?.base,
                                    quote: symbol?.quote
                                })}
                            </span>
                        </p>
                    )}
                    {_renderUserBalance()}
                    {_renderPlaceOrderButton()}
                </div>

                {/* {_renderAssetPortfolio()} */}
            </div>
        </>
    );
};

export default PlaceOrderForm;
