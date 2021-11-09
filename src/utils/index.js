import qs from 'qs'
import { get } from 'lodash'

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
    debug && log.d('pair___', _)
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
