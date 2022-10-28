import { DefaultFuturesFee, ExchangeOrderEnum, FuturesOrderEnum, } from 'redux/actions/const';
import { FuturesOrderTypes } from "redux/reducers/futures";
import { formatNumber, getFilter } from "redux/actions/utils";

export const VndcFutureOrderType = {
    GroupStatus: {
        OPENING: 0,
        HISTORY: 1,
    },
    Status: {
        PENDING: 0,
        ACTIVE: 1,
        CLOSED: 2,
        REQUESTING: 3,
    },
    Side: {
        BUY: 'Buy',
        SELL: 'Sell',
    },
    Type: {
        MARKET: 'Market',
        LIMIT: 'Limit',
        STOP: 'Stop',
    },
    ReasonCloseCode: {
        NORMAL: 0,
        HIT_SL: 1,
        HIT_TP: 2,
        LIQUIDATE: 3,
        HIT_LIMIT_CLOSE: 4,
    },
    BitmexTransferError: {
        PROCESS_SUCCESSFULLY: 0,
        PLACE_ORDER_WITHOUT_SL_TP: 1, // Dat duoc lenh chinh nhung khong dat duoc lenh SL, TP
        ACTIVE_ORDER_ERROR: 2, // Lenh Stop hoac Limit duoc active nhung khong dat duoc SL, TP
        HIT_SL_TP_ERROR: 3, // Hit SL hoac TP nhung khong dong duoc lenh con lai
    },
    PromoteProgram: {
        NORMAL: 0,
        LUCKY_MONEY_2020: 1,
        AIRDROP_VNDC: 2,
    },
};

export const getProfitVndc = (order, lastPrice = 0, isOnus) => {
    const { status, quantity, open_price, type, symbol, side, close_price } = order || {};
    if (!order || !symbol) return null;
    let { fee } = order;
    fee = fee || 0;
    let profitVNDC = 0;
    let closePrice = 0;
    // if (status === VndcFutureOrderType.Status.PENDING || status === VndcFutureOrderType.Status.PENDING) {
    //     return 0
    // }
    if (status === VndcFutureOrderType.Status.ACTIVE) {
        closePrice = lastPrice;
    } else if (status === VndcFutureOrderType.Status.CLOSED) {
        return order.profit
    } else {
        return 0;
    }
    if (isOnus) {
        fee += quantity * closePrice * (0.06 / 100);
    }
    const swap = order?.swap || 0
    // const funding = order?.funding_fee?.margin ? Math.abs(order?.funding_fee?.margin) : 0
    fee += swap 
    try {
        let buyProfitVNDC = 0;
        buyProfitVNDC = quantity * (closePrice - open_price);
        profitVNDC = side === VndcFutureOrderType.Side.BUY ? buyProfitVNDC - fee : -buyProfitVNDC - fee;
    } catch (e) {
    }

    return profitVNDC;
};

export const renderCellTable = (key, rowData, t, language) => {
    switch (key) {
        case 'side':
            return language === 'vi' ? rowData[key] === 'Sell' ? t('common:sell') : t('common:buy') : rowData[key];
        case 'type':
            return language === 'vi' ?
                (rowData[key] === 'Market' ? t('futures:market') : rowData[key] === 'Limit' ? t('futures:limit') : rowData[key]) : rowData[key];
        default:
    }
};


export const getRatioProfit = (sltp, order) => {
    let { leverage, side, order_value, margin, open_price } = order;
    if (order_value && margin) leverage = order_value / margin;
    let formatX = 0;
    if (side == VndcFutureOrderType.Side.BUY) {
        formatX = (sltp * (1 - DefaultFuturesFee.NamiFrameOnus) - open_price * (1 + DefaultFuturesFee.NamiFrameOnus)) * leverage / open_price * 100
    } else {
        formatX = (sltp * (-1 - DefaultFuturesFee.NamiFrameOnus) + open_price * (1 - DefaultFuturesFee.NamiFrameOnus)) * leverage / open_price * 100
    }
    const percent = (formatX <= -100 ? -1 : Math.abs(formatX > 0 ? 50 + formatX / 2 : -50 - formatX / 2)).toFixed(0);
    const result = percent === 50 ? 0 : percent > 50 ? (percent - 50) * 2 : -(50 - percent) * 2;
    return result < 0 ? result : '+' + result;
};

export const fees = [
    { assetId: 72, assetCode: 'VNDC', ratio: '0.06%' },
    { assetId: 447, assetCode: 'NAO', ratio: '0.036%' },
    { assetId: 86, assetCode: 'ONUS', ratio: '0.045%' },
    { assetId: 1, assetCode: 'NAMI', ratio: '0.045%' },
    { assetId: 22, assetCode: 'USDT', ratio: '0.06%' },
];

export const modeOrders = {
    detail: 'detail',
    shortcut: 'shortcut'
}


export const getTypesLabel = (mode, t) => {
    switch (mode) {
        case FuturesOrderTypes.Limit:
            return t('trade:order_types.limit')
        case FuturesOrderTypes.StopLimit:
            return t('trade:order_types.stop_limit')
        case FuturesOrderTypes.Market:
            return t('trade:order_types.market')
        case FuturesOrderTypes.StopMarket:
            return t('trade:order_types.stop_market')
        case FuturesOrderTypes.TrailingStopMarket:
            return t('trade:order_types.trailing_stop')
        default:
            return '--'
    }
}


export const getMaxQuoteQty = (price, type, side, leverage, availableAsset, pairPrice, pairConfig, isQuoteQty, isAuth) => {
    let maxBuy = 0;
    let maxSell = 0;
    let _price = price;
    const _type = String(type).toUpperCase();
    if (Math.trunc(availableAsset) > 0) {
        if ([FuturesOrderTypes.Limit, FuturesOrderTypes.StopMarket, FuturesOrderTypes.StopLimit].includes(_type) && price) {
            maxBuy = availableAsset / ((1 / leverage) + DefaultFuturesFee.NamiFrameOnus) / (isQuoteQty ? 1 : price);
            maxSell = maxBuy;
        } else if ([FuturesOrderTypes.Market].includes(_type)) {
            price = side === VndcFutureOrderType.Side.BUY ? pairPrice?.ask : pairPrice?.bid;
            maxBuy = availableAsset / ((1 / leverage) + DefaultFuturesFee.NamiFrameOnus) / (isQuoteQty ? 1 : pairPrice?.ask);
            maxSell = availableAsset / ((1 / leverage) + DefaultFuturesFee.NamiFrameOnus) / (isQuoteQty ? 1 : pairPrice?.bid);
        }
    }
    const lotSize =
        pairConfig?.filters?.find((o) =>
            [
                FuturesOrderTypes.Market,
                FuturesOrderTypes.StopMarket,
            ].includes(_type)
                ? o?.filterType === 'MARKET_LOT_SIZE'
                : o?.filterType === 'LOT_SIZE'
        ) || {};
    const _maxConfig = lotSize?.maxQty * (isQuoteQty ? price : 1); //maxConfig quoteQty
    const _maxQty = side === VndcFutureOrderType.Side.BUY ? maxBuy : maxSell;
    return isAuth ? Math.min(_maxConfig, _maxQty) : _maxConfig;
};

export const validator = (key, price, type, side, lastPrice, pairConfig, decimal, t) => {
    let isValid = true;
    let msg = null;
    switch (key) {
        case 'price':
            const priceFilter = getFilter(ExchangeOrderEnum.Filter.PRICE_FILTER, pairConfig);
            const percentPriceFilter = getFilter(ExchangeOrderEnum.Filter.PERCENT_PRICE, pairConfig);
            const _maxPrice = priceFilter?.maxPrice;
            const _minPrice = priceFilter?.minPrice;
            let _activePrice = lastPrice;

            // Truong hop dat lenh market
            const lowerBound = {
                min: Math.max(_minPrice, _activePrice * percentPriceFilter?.multiplierDown),
                max: Math.min(_activePrice, _activePrice * (1 - percentPriceFilter?.minDifferenceRatio)),
            };

            const upperBound = {
                min: Math.max(_activePrice, _activePrice * (1 + percentPriceFilter?.minDifferenceRatio)),
                max: Math.min(_maxPrice, _activePrice * percentPriceFilter?.multiplierUp),
            };

            if (side === FuturesOrderEnum.Side.BUY) {
                // Truong hop la buy thi gia limit phai nho hon gia hien tai
                if (type === "LIMIT") {
                    if (price < lowerBound.min) {
                        isValid = false;
                        msg = `${t("futures:minimum_price")} ${formatNumber(lowerBound.min, decimal, 0, true)}`;
                    } else if (price > lowerBound.max) {
                        isValid = false;
                        msg = `${t("futures:maximum_price")} ${formatNumber(lowerBound.max, decimal, 0, true)}`;
                    }
                } else if (type === "STOP_MARKET") {
                    if (price < upperBound.min) {
                        isValid = false;
                        msg = `${t("futures:minimum_price")} ${formatNumber(upperBound.min, decimal, 0, true)}`;
                    } else if (price > upperBound.max) {
                        isValid = false;
                        msg = `${t("futures:maximum_price")} ${formatNumber(upperBound.max, decimal, 0, true)}`;
                    }
                }
            } else if (side === FuturesOrderEnum.Side.SELL) {
                if (type === "LIMIT") {
                    if (price < upperBound.min) {
                        isValid = false;
                        msg = `${t("futures:minimum_price")} ${formatNumber(upperBound.min, decimal, 0, true)}`;
                    } else if (price > upperBound.max) {
                        isValid = false;
                        msg = `${t("futures:maximum_price")} ${formatNumber(upperBound.max, decimal, 0, true)}`;
                    }
                } else if (type === "STOP_MARKET") {
                    if (price < lowerBound.min) {
                        isValid = false;
                        msg = `${t("futures:minimum_price")} ${formatNumber(lowerBound.min, decimal, 0, true)}`;
                    } else if (price > lowerBound.max) {
                        isValid = false;
                        msg = `${t("futures:maximum_price")} ${formatNumber(lowerBound.max, decimal, 0, true)}`;
                    }
                }
            }
            break;
        default:
            break;
    }
    return { isValid, msg, };


};
