import qs from 'qs'
import { get } from 'lodash'
import { TRADING_MODE } from 'redux/actions/const'

export const ___DEV___ = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev'

export const log =  {
    d: (...arg) => {
       ___DEV___ && console.log('%cnamidev-DEBUG: ', 'color: purple;font-weight: bold', ...arg)
    },
    i: (...arg) => {
        ___DEV___ && console.log('%cnamidev-INFO: ', 'color: green;font-weight: bold', ...arg)
    },
    e: (...arg) => {
        ___DEV___ && console.log('%cnamidev-ERROR: ', 'color: red;font-weight: bold', ...arg)
    },
    w: (...arg) => {
        ___DEV___ && console.log('%cnamidev-WARNING: ', 'color: orange;font-weight: bold', ...arg)
    }
}

export function buildLogoutUrl() {
    const currentUrl = window.location.href;
    const params = {
        redirect: currentUrl
    };
    return `/logout?${qs.stringify(params)}`;
}

export function isNumeric(val) {
    return (
        (typeof val === 'string' &&
            !!val && !isNaN(+val)
        )
        || typeof val === 'number'
    );
}

export function marketWatchToFavorite (favList = [], tradingMode = TRADING_MODE.EXCHANGE, marketWatch, isFutureDataOrigin = false) {
    if (!favList || !favList.length || !marketWatch) return []

    if (tradingMode === TRADING_MODE.EXCHANGE) {
        return Array.isArray(marketWatch) && marketWatch.length && marketWatch.filter(m => favList.includes(`${m?.bi}_${m?.qi}`))
    }
    if (tradingMode === TRADING_MODE.FUTURES) {
        const result = []
        if (isFutureDataOrigin) {
            return Array.isArray(marketWatch) && marketWatch.length && marketWatch.filter(m => favList.includes(`${m?.b}_${m?.q}`))
        } else {
            favList.forEach(f => result.push(marketWatch[f.replace('_', '')]))
        }
        return result
    }
}

export function initMarketWatchItem (pair, debug = false) {
    const _ = {
        symbol: get(pair, 's', null),     // this.symbol = source.s;
        lastPrice: get(pair, 'p', null), // this.lastPrice = +source.p;
        lastPrice24h: get(pair, 'ld', null), // this.lastPrice24h = +source.ld;
        high: get(pair, 'h', null), // this.high = +source.h;
        low: get(pair, 'l', null), // this.low = +source.l;
        high1h: get(pair, 'hh', null), // this.high1h = +source.hh;
        low1h: get(pair, 'lh', null), // this.low1h = +source.lh;
        totalExchangeVolume: get(pair, 'vb', null), // this.totalExchangeVolume = source.vb;
        volume24h: get(pair, 'vq', null),  // this.volume24h = source.vq;
        quoteAsset: get(pair, 'q', null),
        quoteAssetId: get(pair, 'qi', null),
        baseAsset: get(pair, 'b'),
        baseAssetId: get(pair, 'bi', null),
        up: get(pair, 'u', false), // this.up = source.u;
        lastHistoryId: get(pair, 'li', null),  // this.lastHistoryId = source.li;
        supply: get(pair, 'sp', null), // this.supply = source.sp;
        label: get(pair, 'lbl', null), // this.label = source.lbl;
    }
    debug && log.d('ExchangePair', _)
    return _
}

export function initFuturesMarketWatchItem (pair, debug = false) {
    const lcp = get(pair, 'lcp', null)

    const _ = {
        baseAsset: get(pair, 'b', null), // exchangeCurrency: FuturesCurrency.fromName(source.b),
        quoteAsset: get(pair, 'q', null),  // baseCurrency: FuturesCurrency.fromName(source.q),
        ask: get(pair, 'ap', null), // ask: source.ap,
        bid: get(pair, 'bp', null), // bid: source.bp,
        lastPrice: get(pair, 'p', null), // lastPrice: source.p,
        markPrice: get(pair, 'mp', null), // markPrice: source.mp,
        lastPrice24h: get(pair, 'ld', null), // lastPrice24h: source.ld,
        high: get(pair, 'h', null), // high: source.h,
        low: get(pair, 'l', null), // low: source.l,
        volume24h: get(pair, 'vb', null), // volume24h: source.vb,
        up: get(pair, 'u', null), // up: source.u,
        label: get(pair, 'lbl', null), // label: source.lbl,
        placeCurrency: get(pair, 'pa', null), // placeCurrency: FuturesCurrency.fromName(source.pa),
        lastChangePercentage: isNumeric(lcp) ? lcp * 100 : 0, // lastChangePercentage: isNumeric(source.lcp) ? +source.lcp * 100 : 0,
        hideInMarketWatch: get(pair, 'hide_in_market_watch', null), // hideInMarketWatch: source.hide_in_market_watch,
    }
    debug && log.d('FuturesPair: ', _)
    return _
}

export function subscribeExchangeSocket(socket, arr = [], statusCb) {
    if (!Array.isArray(arr) || !arr.length) return
    if (!socket) {
        statusCb && statusCb(!!socket)
    } else {
        arr.forEach(item => {
            const payload = get(item, 'payload', null)
            const socketString = get(item, 'socketString', null)
            if (payload && socketString) socket.emit(`subscribe:${socketString}`, `${payload}`)
        })
        statusCb && statusCb(!!socket)
    }
}

export const unsubscribeExchangeSocket = (socket, symbol) => {
    if (!socket) return
    socket.emit('unsubscribe:all', symbol)
}

// export function subscribeFuturesSocket(socket, arr = [], lastSubscribe, lastSubscribeCb) {
//     if (!Array.isArray(arr) || !arr.length || !socket) return
//     arr.forEach(item => {
//         const payload = get(item, 'payload', null)
//         const socketString = get(item, 'socketString', null)
//         if (!lastSubscribe || lastSubscribe !== payload) {
//
//         }
//     })
// }
