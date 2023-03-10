import axios from 'axios';
import { IconLock } from 'src/components/common/Icons';
import find from 'lodash/find';
import floor from 'lodash/floor';
import { useTranslation } from 'next-i18next';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAsync } from 'react-use';
import { getMarketWatch } from 'redux/actions/market';
import InputSlider from 'src/components/trade/InputSlider';
import * as Error from 'src/redux/actions/apiError';
import { ApiStatus, ExchangeOrderEnum, PublicSocketEvent, SpotMarketPriceBias } from 'src/redux/actions/const';
import Emitter from 'src/redux/actions/emitter';
import { formatBalance, formatPrice, getDecimalScale, getFilter, getLoginUrl, getSymbolString, formatNumber, getUnit } from 'src/redux/actions/utils';
import fetchAPI from 'utils/fetch-api';
import { GET_SPOT_FEE_CONFIG } from 'redux/actions/apis';
import { max, min } from 'lodash/math';
import TradingInput from 'components/trade/TradingInput';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import { roundToDown } from 'round-to';

let initPrice = '';

const rate = 1.001;

const SimplePlaceOrderForm = ({ symbol, orderBook }) => {
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
    const [quantityMode, setQuantityMode] = useState(QuantityMode[1]);
    const [buyPercentage, setBuyPercentage] = useState(0);
    const [sellPercentage, setSellPercentage] = useState(0);
    const [placing, setPlacing] = useState(false);
    const [orderType, setOrderType] = useState(ExchangeOrderEnum.Type.LIMIT);
    const [buyQuantity, setBuyQuantity] = useState(0);
    const [sellQuantity, setSellQuantity] = useState(0);
    const [buyQuoteQty, setBuyQuoteQty] = useState(0);
    const [sellQuoteQty, setSellQuoteQty] = useState(0);
    const [buyPrice, setBuyPrice] = useState();
    const [sellPrice, setSellPrice] = useState();
    // const [initialPrice, setInitialPrice] = useState();
    const [symbolTicker, setSymbolTicker] = useState(null);
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);

    const unitConfig = useSelector((state) => getUnit(state, quote));
    const [isUseQuoteQuantity, setIsUseQuoteQuantity] = useState(false);
    const [state, set] = useState({ centerPrice: null, feeConfig: null });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const [showAlert, setShowAlert] = useState(false);
    const isFocus = useRef();
    const [ticker, setTicker] = useState({ bid: 0, ask: 0 });
    const isChangeSlider = useRef(false);
    const alert = useRef({
        type: '',
        title: '',
        message: '',
        notes: ''
    });
    const side = useRef();

    const getFeeConfig = async () => {
        try {
            const {
                data: { status, data: feeConfig }
            } = await axios.get(GET_SPOT_FEE_CONFIG);
            if (status === 'ok') {
                setState({ feeConfig });
            }
        } catch (e) {
            console.log('Cant get fee config: ', e);
        }
    };

    useAsync(async () => {
        if (symbol) {
            const newSymbolTicker = await getMarketWatch(getSymbolString(symbol));
            setSymbolTicker(newSymbolTicker?.[0]);
        }
    }, [symbol]);

    useEffect(() => {
        getFeeConfig();
    }, []);

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
            setBuyPrice(+symbolTicker?.p);
            setSellPrice(+symbolTicker?.p);
            setBuyQuantity('');
            setBuyQuoteQty('');
            setBuyPercentage('');
            setSellQuantity('');
            setSellQuoteQty('');
            setSellPercentage('');
        }
    }, [symbolTicker]);

    useEffect(() => {
        if (selectedOrder?.price) {
            setBuyPrice(selectedOrder?.price);
            setSellPrice(selectedOrder?.price);
        }
        if (selectedOrder?.quantity) {
            setBuyQuantity(selectedOrder?.quantity || '');
            setSellQuantity(selectedOrder?.quantity || '');
        }
        if (selectedOrder?.quantity && selectedOrder?.price) {
            setBuyQuoteQty(floor(selectedOrder?.quantity * selectedOrder?.price, 2) || '');
            setSellQuoteQty(floor(selectedOrder?.quantity * selectedOrder?.price, 2) || '');
        }
    }, [selectedOrder]);

    useEffect(() => {
        if (orderBook) {
            const asks = orderBook?.asks.map((e) => e[0]);
            const bids = orderBook?.bids.map((e) => e[0]);
            setTicker({ bid: max(bids), ask: min(asks) });
        }
    }, [orderBook]);

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

    const decimals = useMemo(() => {
        return {
            price: getDecimalScale(+priceFilter?.tickSize),
            qty: getDecimalScale(+quantityFilter?.stepSize),
            symbol: unitConfig?.assetDigit ?? 2
        };
    }, [priceFilter, quantityFilter, unitConfig]);

    const handleClickSubTab = (tab) => {
        setOrderType(tab);
    };

    const subTabs = [ExchangeOrderEnum.Type.MARKET, ExchangeOrderEnum.Type.LIMIT];

    useEffect(() => {
        const source = axios.CancelToken.source();
        return () => {
            source.cancel();
        };
    }, [baseAssetId, symbol]);

    const createOrder = async (_orderSide) => {
        side.current = _orderSide;
        try {
            const _quantity = _orderSide === ExchangeOrderEnum.Side.BUY ? +buyQuantity : +sellQuantity;
            const _quoteOrderQty = _orderSide === ExchangeOrderEnum.Side.BUY ? +buyQuoteQty : +sellQuoteQty;
            const _price = _orderSide === ExchangeOrderEnum.Side.BUY ? +buyPrice : +sellPrice;

            const params = {
                symbol: `${base}${quote}`,
                side: _orderSide,
                type: orderType,
                quantity: _quantity,
                quoteOrderQty: _quoteOrderQty,
                price: _price,
                useQuoteQty: isUseQuoteQuantity
            };
            const res = await fetchAPI({
                url: '/api/v3/spot/order',
                options: {
                    method: 'POST'
                },
                params
            });
            const { status, data, message } = res;
            if (status === ApiStatus.SUCCESS) {
                const { baseAsset, displayingId, price: _price, quantity: _quantity, quoteAsset, side, type } = data;
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
                        content = t('error:MIN_NOTIONAL', { value: `${formatPrice(minNotionalFilter.minNotional)} ${quote}` });
                        break;
                    default:
                        break;
                }
                alert.current = {
                    type: 'error',
                    title: t('common:failure'),
                    message: content,
                    notes: `(${shortRequestId})`
                };
            }
        } catch (e) {
            console.log('createOrder web: ', e);
        } finally {
            setShowAlert(true);
            setPlacing(false);
        }
    };

    const orderTypeLabels = {
        [ExchangeOrderEnum.Type.LIMIT]: t('spot:limit'),
        [ExchangeOrderEnum.Type.MARKET]: t('spot:market')
    };

    const confirmModal = async (_orderSide) => {
        setPlacing(true);
        await createOrder(_orderSide);
    };

    const getAvailableText = (assetId) => {
        return formatBalance(balanceSpot?.[assetId]?.value - balanceSpot?.[assetId]?.locked_value, 6);
    };

    const getAvailable = (assetId) => {
        return balanceSpot?.[assetId]?.value - balanceSpot?.[assetId]?.locked_value;
    };

    const getPrice = (side, price) => {
        return orderType === ExchangeOrderEnum.Type.MARKET ? (side === ExchangeOrderEnum.Side.BUY ? ticker.ask : ticker.bid) : price;
    };

    const getPercent = (value, balance) => {
        const per = value ? ((value / balance) * 100).toFixed(0) : 0;
        return Math.min(per, 100);
    };

    const balance = useMemo(() => {
        return {
            token: roundToDown(+getAvailable(baseAssetId) ?? 0, decimals.qty),
            stable: roundToDown(+getAvailable(quoteAssetId ?? 0), 2)
        };
    }, [quoteAssetId, balanceSpot, baseAssetId, decimals]);

    useEffect(() => {
        const price = symbolTicker?.p;
        const quoteQty = floor(+sellQuantity * price * rate, decimals.symbol);
        const per = getPercent(sellQuantity, balance.token);
        setSellPrice(price);
        setSellPercentage(per);
        setSellQuoteQty(quoteQty);
    }, [orderType]);

    useEffect(() => {
        const price = symbolTicker?.p;
        const qty = roundToDown(buyQuoteQty / (price * rate), decimals.qty);
        const per = getPercent(qty, balance.stable);
        setBuyPrice(price);
        setBuyPercentage(per);
        setBuyQuantity(qty);
    }, [orderType]);

    const _renderOrderType = useMemo(() => {
        const tabs = [];
        subTabs.forEach((tab) => {
            if (currentExchangeConfig?.orderTypes && currentExchangeConfig?.orderTypes.includes(tab)) {
                tabs.push(tab);
            }
        });
        return (
            <ul className="tabs justify-start mb-2 dragHandleArea px-4 space-x-2">
                {tabs.map((tab, index) => {
                    return (
                        <li className={`tab-item font-medium ${orderType === tab ? 'active' : ''}`} key={index}>
                            <a
                                className={'tab-link text-txtSecondary dark:text-txtSecondary-dark ' + (orderType === tab ? 'active' : '')}
                                onClick={() => handleClickSubTab(tab)}
                            >
                                {' '}
                                {orderTypeLabels[tab]}
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    }, [orderType, t, currentExchangeConfig]);

    const validatePrice = useMemo(() => {
        return {
            min: Math.max(priceFilter.minPrice, symbolTicker?.p * percentPriceFilter?.multiplierDown),
            max: Math.max(priceFilter.maxPrice, symbolTicker?.p * percentPriceFilter?.multiplierUp)
        };
    }, [priceFilter, percentPriceFilter, symbolTicker]);

    const validateTotal = (price, side) => {
        const isBuy = side === ExchangeOrderEnum.Side.BUY;
        const _balance = balance[isBuy ? 'stable' : 'token'];
        return {
            min: +minNotionalFilter?.minNotional,
            max: _balance * (isBuy ? 1 : price)
        };
    };

    const validateAmount = (price, side) => {
        const isMarket = orderType === ExchangeOrderEnum.Type.MARKET;
        const isBuy = side === ExchangeOrderEnum.Side.BUY;
        const _balance = balance[isBuy ? 'stable' : 'token'];
        if (!price) {
            return {
                min: quantityFilter?.minQty,
                max: quantityFilter?.maxQty
            };
        }
        const validate_limit = {
            min: Math.max(+quantityFilter?.minQty, +(+minNotionalFilter?.minNotional / price).toFixed(decimals.qty)),
            max: Math.min(+quantityFilter?.maxQty, +(_balance / (isBuy ? price : 1)).toFixed(decimals.qty))
        };

        const validate_market = {
            min: Math.max(+quantityFilter?.minQty, +(+minNotionalFilter?.minNotional / price).toFixed(decimals.qty), quantityMarketFilter?.minQty),
            max: Math.min(+quantityFilter?.maxQty, +(_balance / (isBuy ? price : 1), quantityMarketFilter?.maxQty).toFixed(decimals.qty))
        };
        return isMarket ? validate_market : validate_limit;
    };

    const validator = (key, value, options) => {
        let rs = { isValid: true, msg: '' };
        const price = getPrice(options?.side, options?.side === ExchangeOrderEnum.Side.BUY ? buyPrice : sellPrice);

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
                const { min: min_qty, max: max_qty } = validateAmount(+price, options.side);
                if (max_qty < min_qty) {
                    return {
                        isValid: false,
                        msg: t('error:BALANCE_NOT_ENOUGH')
                    };
                }
                if (value < min_qty || value > max_qty) {
                    rs = {
                        isValid: false,
                        msg: textDescription(key, { min: min_qty, max: max_qty })
                    };
                }
                break;
            case 'total':
                const { min: min_total, max: max_total } = validateTotal(+price, options.side);
                if (max_total < min_total) {
                    return {
                        isValid: false,
                        msg: t('error:BALANCE_NOT_ENOUGH')
                    };
                }
                if (value < min_total || value > max_total) {
                    rs = {
                        isValid: false,
                        msg: textDescription(key, { min: min_total, max: max_total })
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
            case 'total':
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

    const formatValue = (value) => {
        return value || '';
    };

    const onHandleChange = (key, value, options) => {
        const isBuy = options?.side === ExchangeOrderEnum.Side.BUY;
        const _balance = balance[isBuy ? 'stable' : 'token'];
        let qty = 0,
            quoteQty = 0,
            per = 0;
        const _price = key === 'price' ? value : isBuy ? buyPrice : sellPrice;
        const price = getPrice(options?.side, _price);

        switch (key) {
            case 'price':
                if (isBuy) {
                    qty = roundToDown(buyQuoteQty / (price * rate), decimals.qty);
                    setBuyPrice(value);
                    setBuyQuantity(formatValue(qty));
                } else {
                    quoteQty = floor(sellQuantity * (price * rate), decimals.symbol);
                    setSellPrice(value);
                    setSellQuoteQty(formatValue(quoteQty));
                }
                break;
            case 'percentage':
                isChangeSlider.current = true;
                if (isBuy) {
                    quoteQty = floor((_balance * value) / 100, decimals.symbol);
                    qty = roundToDown(quoteQty / (price * rate), decimals.qty);
                    setBuyQuoteQty(formatValue(quoteQty));
                    setBuyQuantity(formatValue(qty));
                    setBuyPercentage(value);
                } else {
                    qty = roundToDown((_balance * value) / 100, decimals.qty);
                    quoteQty = floor(qty * (price * rate), decimals.symbol);
                    setSellPercentage(value);
                    setSellQuantity(formatValue(qty));
                    setSellQuoteQty(formatValue(quoteQty));
                }
                break;
            case 'qty':
                if (isChangeSlider.current || isFocus.current !== key) {
                    isChangeSlider.current = false;
                    return;
                }
                quoteQty = floor(value * (price * rate), decimals.symbol);
                per = getPercent(isBuy ? quoteQty : value, _balance);
                if (isBuy) {
                    setBuyQuantity(formatValue(value));
                    setBuyQuoteQty(formatValue(quoteQty));
                    setBuyPercentage(per);
                } else {
                    setSellQuantity(formatValue(value));
                    setSellQuoteQty(formatValue(quoteQty));
                    setSellPercentage(per);
                }
                break;
            case 'quote':
                if (isChangeSlider.current || isFocus.current !== key) {
                    isChangeSlider.current = false;
                    return;
                }
                qty = floor(value / (price * rate), decimals.qty);
                per = getPercent(isBuy ? value : qty, _balance);
                if (isBuy) {
                    setBuyQuantity(formatValue(qty));
                    setBuyQuoteQty(formatValue(value));
                    setBuyPercentage(per);
                } else {
                    setSellQuantity(formatValue(qty));
                    setSellQuoteQty(formatValue(value));
                    setSellPercentage(per);
                }
                break;
            default:
                break;
        }
    };

    const _renderOrderPrice = (_orderSide) => {
        // if (orderType !== ExchangeOrderEnum.Type.LIMIT) return null;
        const isMarket = orderType === ExchangeOrderEnum.Type.MARKET;
        return (
            <div className="flex justify-between items-center mb-3">
                <TradingInput
                    label={t('common:price')}
                    labelClassName="!text-sm !font-normal"
                    value={isMarket ? t('spot:market') : _orderSide === ExchangeOrderEnum.Side.BUY ? buyPrice : sellPrice}
                    onValueChange={({ value }) => {
                        onHandleChange('price', +value, { side: _orderSide });
                    }}
                    name="stop_buy_input"
                    disabled={isMarket}
                    allowNegative={false}
                    validator={!isMarket && validator('price', _orderSide === ExchangeOrderEnum.Side.BUY ? buyPrice : sellPrice, { side: _orderSide })}
                    decimalScale={decimals.price}
                    containerClassName="w-full dark:bg-dark-2"
                    tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-sm select-none"
                    renderTail={() => <span className="flex items-center">{quote}</span>}
                    clearAble
                />
            </div>
        );
    };

    const _renderQuantitySlider = (_orderSide) => {
        const isBuy = _orderSide === ExchangeOrderEnum.Side.BUY;
        return (
            <div className="mt-4 mb-3 relative">
                <InputSlider
                    axis="x"
                    labelSuffix="%"
                    useLabel
                    positionLabel="top"
                    x={isBuy ? buyPercentage : sellPercentage}
                    onChange={({ x }) => {
                        onHandleChange('percentage', x, { side: _orderSide });
                    }}
                />
            </div>
        );
    };

    const _renderOrderQuoteQty = (_orderSide) => {
        if (orderType === ExchangeOrderEnum.Type.MARKET && quantityMode.id !== ExchangeOrderEnum.QuantityMode.QUOTE_QUANTITY) return null;
        return (
            <div className="flex justify-between items-center mb-3">
                <TradingInput
                    label={t('total')}
                    labelClassName="!text-sm !font-normal"
                    value={_orderSide === ExchangeOrderEnum.Side.BUY ? buyQuoteQty : sellQuoteQty}
                    onFocus={() => (isFocus.current = 'quote')}
                    onValueChange={({ value }) => {
                        onHandleChange('quote', value, { side: _orderSide });
                    }}
                    name="quoteQty"
                    allowNegative={false}
                    decimalScale={2}
                    validator={validator('total', _orderSide === ExchangeOrderEnum.Side.BUY ? buyQuoteQty : sellQuoteQty, { side: _orderSide })}
                    containerClassName="w-full dark:bg-dark-2"
                    tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-sm select-none"
                    renderTail={() => <span className="flex items-center">{quote}</span>}
                    clearAble
                />
            </div>
        );
    };

    const _renderOrderQuantity = (_orderSide) => {
        return (
            <div className="flex justify-between items-center mb-3">
                <TradingInput
                    label={t('common:amount')}
                    labelClassName="!text-sm !font-normal"
                    value={_orderSide === ExchangeOrderEnum.Side.BUY ? buyQuantity : sellQuantity}
                    onFocus={() => (isFocus.current = 'qty')}
                    onValueChange={({ value }) => {
                        onHandleChange('qty', value, { side: _orderSide });
                    }}
                    name="quantity"
                    allowNegative={false}
                    validator={validator('amount', _orderSide === ExchangeOrderEnum.Side.BUY ? buyQuantity : sellQuantity, { side: _orderSide })}
                    decimalScale={decimals.qty}
                    containerClassName="w-full dark:bg-dark-2"
                    tailContainerClassName="text-txtSecondary dark:text-txtSecondary-dark text-sm select-none"
                    renderTail={() => <span className="flex items-center">{base}</span>}
                    clearAble
                />
            </div>
        );
    };

    const _renderPlaceOrderButton = (_orderSide) => {
        const isMarket = orderType === ExchangeOrderEnum.Type.MARKET;
        const isErorr =
            !validator('amount', _orderSide === ExchangeOrderEnum.Side.BUY ? buyQuantity : sellQuantity, { side: _orderSide })?.isValid ||
            !validator('total', _orderSide === ExchangeOrderEnum.Side.BUY ? buyQuoteQty : sellQuoteQty, { side: _orderSide })?.isValid ||
            (!isMarket && !validator('price', _orderSide === ExchangeOrderEnum.Side.BUY ? buyPrice : sellPrice))?.isValid;
        const disabled = placing || currentExchangeConfig?.status === 'MAINTAIN' || isErorr;
        return !user ? (
            <ButtonV2 variants="secondary">
                <a href={getLoginUrl('sso')}>
                    <span className="text-teal hover:underline">{t('common:sign_in')}</span>
                </a>
                <div className="font-normal">{t('common:or')}</div>
                <a href={getLoginUrl('sso', 'register')}>
                    <span className="text-teal hover:underline">{t('common:sign_up')}</span>
                </a>
            </ButtonV2>
        ) : (
            <ButtonV2
                onClick={() => !disabled && confirmModal(_orderSide)}
                disabled={disabled}
                loading={placing && side.current === _orderSide}
                className={_orderSide === ExchangeOrderEnum.Side.BUY ? 'bg-teal' : '!bg-red'}
            >
                {t(_orderSide)} {base}
            </ButtonV2>
        );
    };

    const _renderUserBalance = (_orderSide) => {
        return (
            <>
                <div className="mb-4 flex items-center space-x-2">
                    <div className="text-sm text-txtSecondary dark:text-txtSecondary-dark font-medium ">{t('common:available_balance')}:</div>
                    <div className="text-sm text-txtPrimary dark:text-txtPrimary-dark font-medium text-right">
                        {
                            // eslint-disable-next-line no-nested-ternary
                            _orderSide === ExchangeOrderEnum.Side.BUY
                                ? quoteAssetId
                                    ? getAvailableText(quoteAssetId)
                                    : 0
                                : baseAssetId
                                ? getAvailableText(baseAssetId)
                                : 0
                        }{' '}
                        {_orderSide === ExchangeOrderEnum.Side.BUY ? quote : base}
                    </div>
                </div>
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
            <div className="bg-bgSpotContainer dark:bg-bgSpotContainer-dark h-full spot-place-orders-container">
                {/* <h3 className="font-medium text-lg text-black pt-6 pb-4 px-1.5 dragHandleArea">{t('spot:place_order')}</h3> */}
                {/* {_renderOrderSide} */}
                {_renderOrderType}

                <div className="grid grid-cols-2 gap-5 mt-4 px-4">
                    <div className="">
                        {_renderUserBalance(ExchangeOrderEnum.Side.BUY)}
                        {_renderOrderPrice(ExchangeOrderEnum.Side.BUY)}
                        {_renderOrderQuantity(ExchangeOrderEnum.Side.BUY)}
                        {_renderQuantitySlider(ExchangeOrderEnum.Side.BUY)}
                        {_renderOrderQuoteQty(ExchangeOrderEnum.Side.BUY)}
                        {/* {_renderUserFee(ExchangeOrderEnum.Side.BUY)} */}
                        {currentExchangeConfig?.status === 'MAINTAIN' && (
                            <p className="text-sm mb-3 flex">
                                <span className="mr-2">
                                    <IconLock width={12} height={16} />
                                </span>{' '}
                                <span>{t('spot:pair_under_maintenance', { base: symbol?.base, quote: symbol?.quote })}</span>
                            </p>
                        )}
                        {_renderPlaceOrderButton(ExchangeOrderEnum.Side.BUY)}
                    </div>
                    <div className="">
                        {_renderUserBalance(ExchangeOrderEnum.Side.SELL)}
                        {_renderOrderPrice(ExchangeOrderEnum.Side.SELL)}
                        {_renderOrderQuantity(ExchangeOrderEnum.Side.SELL)}
                        {_renderQuantitySlider(ExchangeOrderEnum.Side.SELL)}
                        {_renderOrderQuoteQty(ExchangeOrderEnum.Side.SELL)}
                        {/* {_renderUserFee(ExchangeOrderEnum.Side.SELL)} */}
                        {currentExchangeConfig?.status === 'MAINTAIN' && (
                            <p className="text-sm mb-3 flex">
                                <span className="mr-2">
                                    <IconLock width={12} height={16} />
                                </span>{' '}
                                <span>{t('spot:pair_under_maintenance', { base: symbol?.base, quote: symbol?.quote })}</span>
                            </p>
                        )}
                        {_renderPlaceOrderButton(ExchangeOrderEnum.Side.SELL)}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SimplePlaceOrderForm;
