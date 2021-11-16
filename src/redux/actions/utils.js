import qs from 'qs';
import format from 'date-fns/format';
import numeral from 'numeral';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import isNil from 'lodash/isNil';
import memoize from 'lodash/memoize';
import defaults from 'lodash/defaults';
import find from 'lodash/find';
import { useStore as store } from 'src/redux/store';
import Big from 'big.js';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { ExchangeFilterDefault, LoginButtonPosition, TradingViewSupportTimezone } from './const';
import { ___DEV___, log } from 'utils'

export function getFilter(filterType, config) {
    const filter = find(config.filters, { filterType });
    return filter || ExchangeFilterDefault[filterType];
}

export const getDecimalScale = memoize((value = 0.00000001) => {
    let decimalScale = 8;
    if (value && value > 0 && value <= 1) {
        decimalScale = +(-Math.floor(Math.log(value) / Math.log(10))).toFixed(0);
    }
    return decimalScale;
});

export const getDecimalSpotPrice = memoize((symbol = '') => {
    const configs = store().getState()?.utils?.exchangeConfig || null;
    if (isArray(configs)) {
        const config = configs.find(e => e?.symbol === symbol);
        if (config) {
            const filter = getFilter('PRICE_FILTER', config);
            return +filter?.tickSize ? getDecimalScale(+filter?.tickSize) : 6;
        }
    }
    return 6;
}, (symbol) => symbol);

export function getLoginUrl(mode, action = 'login', options = {}) {
    let params = {};
    if (typeof window !== 'undefined') {
        const _options = defaults(options, {
            redirect: window.location.href,
            referral: null,
            utm_source: 'web',
            utm_medium: 'direct',
            utm_campaign: 'nami.exchange',
            utm_content: LoginButtonPosition.WEB_HEADER,
            mobile_web: false,
        });

        const referral = sessionStorage && sessionStorage.getItem('refCode')
            ? sessionStorage.getItem('refCode')
            : _options.referral;

        params = {
            ..._options,
            referral,
        };
    }
    params = defaults(params, { redirect: process.env.APP_URL });

    switch (mode) {
        case 'sso':
            if (action === 'register') {
                return `${___DEV___ ? 'https://auth-test.nami.trade' : 'https://auth.nami.io'}/register?${qs.stringify(params)}`;
            }
            return `${process.env.NEXT_PUBLIC_API_URL}/login/nami?${qs.stringify(params)}`;

        default:
            break;
    }
}

export function getSymbolString(symbol = {}) {
    if (symbol) {
        return `${symbol.base}${symbol.quote}`;
    }
}

export function formatTime(value, f = 'yyyy-MM-dd HH:mm') {
    if (value) {
        const date = value instanceof Date ? value : new Date(value);
        return format(date, f);
    }
}

export function getTimeAgo(value, options) {
    if (!value) return;
    const date = value instanceof Date ? value : new Date(value);
    if (options) {
        return formatDistanceToNow(date, options);
    }
    return formatDistanceToNow(date);
}

export function formatBalance(value, digits = 2, acceptNegative = false) {
    if (isNil(value)) return '0';
    if (Math.abs(+value) < 1e-8) return '0';
    if (!acceptNegative && +value < 0) return '0';
    return numeral(+value).format(`0,0.[${'0'.repeat(digits)}]`, Math.floor);
}

// Hiển thị cho phí spot tính bằng VNDC, USDT, ATS
export function formatSpotFee(value) {
    if (isNil(value)) return '0';
    if (Math.abs(+value) < 0.01) return '< 0.01';
    return numeral(+value).format('0,0.[00]', Math.floor);
}

export function formatPercentage(value, digits = 2, acceptNegative = false) {
    if (isNil(value)) return '0';
    if (Math.abs(+value) < 1e-2) return '0';
    if (!acceptNegative && +value < 0) return '0';
    return numeral(+value).format(`0,0.[${'0'.repeat(digits)}]`, Math.floor);
}

export function formatWallet(value, additionDigits = 2, acceptNegative = false) {
    if (isNil(value)) return '0';
    if (Math.abs(+value) < 1e-8) return '0';
    if (!acceptNegative && +value < 0) return '0';
    return numeral(+value).format(`0,0.00[${'0'.repeat(additionDigits)}]`, Math.floor);
}

export function formatPrice(price = 0, configs = [], assetCode = '') {
    if (isArray(configs)) {
        const asset = configs.find(e => e.assetCode?.toUpperCase() === assetCode?.toUpperCase());
        if (asset) {
            return numeral(+price).format(`0,0.[${'0'.repeat(asset.assetDigit)}]`);
        }
    }
    if (isNumber(configs)) {
        return numeral(+price).format(`0,0.[${'0'.repeat(configs)}]`);
    }

    return numeral(+price).format('0,0.[000000]');
}

export function formatSpotPrice(price = 0, symbol = '') {
    return numeral(+price).format(`0,0.[${'0'.repeat(getDecimalSpotPrice(symbol))}]`);
}

export function randomString(length = 15) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; ++i) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// Format cho ca gia va so luong
export function formatSwapValue(price = 0) {
    return numeral(+price).format('0,0.[000000]');
}

export function isInvalidPrecision(value, precision) {
    if (Number.isNaN(value)) return true;
    return +(Math.round(+value / precision) * precision).toFixed(12) !== value;
}

export function formatNumberToText(value = 0) {
    return numeral(+value).format('0,00a');
}

export function getExchange24hPercentageChange(price) {
    let change24h;
    if (price) {
        const { p: lastPrice, ld: lastPrice24h } = price;
        if (lastPrice && lastPrice24h) {
            change24h = ((lastPrice - lastPrice24h) / lastPrice24h) * 100;
        } else if (lastPrice && !lastPrice24h) {
            change24h = 100;
        } else if (!lastPrice && lastPrice24h) {
            change24h = -100;
        }
    }
    // log.d('get exchange 24h ', change24h)
    return change24h;
}

export function render24hChange(ticker) {
    const change24h = getExchange24hPercentageChange(ticker);
    let text;
    let className = '';
    if (change24h != null) {
        let sign;
        if (change24h > 0) {
            sign = '+';
            className += ' text-teal';
        } else if (change24h < 0) {
            sign = '';
            className += ' text-red';
        } else sign = '';

        text = `${sign}${formatPercentage(change24h, 2, true)}%`;
    } else {
        text = '-';
    }
    return <span className={`${className}`}>{text}</span>;
}

export function getS3Url(url) {
    return process.env.NEXT_PUBLIC_CDN + url;
}

export function getV1Url(url) {
    return process.env.NEXT_PUBLIC_WEB_V1 + url;
}

function encodeData(data) {
    return Object.keys(data).map((key) => {
        return [key, data[key]].map(encodeURIComponent).join('=');
    }).join('&');
}

export function getSparkLine(symbol, color = '#00C8BC', resolution) {
    const query = {
        symbol,
        broker: 'NAMI_SPOT',
        color,
    };
    if (resolution) query.resolution = resolution;
    return (process.env.NEXT_PUBLIC_PRICE_API_URL + `/api/v1/chart/sparkline?${encodeData(query)}`);
}

export const getAssetCode = (assetId) => {
    const configs = store().getState()?.utils?.assetConfig || null;
    const assetConfig = find(configs, { id: assetId });
    if (assetConfig) {
        return assetConfig.assetCode;
    }
    return null;
};

export const getAssetName = (assetId) => {
    const configs = store().getState()?.utils?.assetConfig || null;
    const assetConfig = find(configs, { id: assetId });
    if (assetConfig) {
        return assetConfig.assetName;
    }
    return null;
};

export const getAssetId = (assetCode) => {
    const configs = store().getState()?.utils?.assetConfig || null;
    const assetConfig = find(configs, { assetCode });
    if (assetConfig) {
        return assetConfig.id;
    }
    return null;
};

export const getAssetFromCode = (assetCode) => {
    const configs = store().getState()?.utils?.assetConfig || null;
    const assetConfig = find(configs, { assetCode });
    if (assetConfig) {
        return assetConfig;
    }
    return null;
};

export function renderName(assetCode, configs) {
    const assetConfig = find(configs, { assetCode });
    if (assetConfig) {
        return assetConfig.assetName;
    }
    return '';
}

export function safeToFixed(value, digits = 2) {
    return numeral(+value).format(`0.[${'0'.repeat(digits)}]`, Math.trunc);
}

export function getTradingViewTimezone() {
    const timezone = find(TradingViewSupportTimezone, {
        offset: -new Date().getTimezoneOffset(),
    });
    return timezone ? timezone.timezone : 'America/New_York';
}

export function getPercentageOf(a, b) {
    if (Number.isNaN(a) || Number.isNaN(b)) {
        return '- %';
    }
    let percentage = 0;
    if (b === 0 || a === 0) {
        percentage = 0;
    } else {
        percentage = (a) / b * 100;
    }
    let sign = '';
    let className = 'text-teal';
    if (percentage > 0) {
        sign = '+';
    } else if (percentage < 0) {
        sign = '';
        className = 'text-red';
    }
    return <span className={className}>{`${sign}${formatPercentage(percentage, 2, true)}%`}</span>;
}

export function getChangePercentage(from, to) {
    if (Number.isNaN(from) || Number.isNaN(to)) {
        return '- %';
    }
    let percentage = 0;
    if (from === 0) {
        percentage = 0;
    } else {
        percentage = (to - from) / from * 100;
    }
    let sign = '';
    let className = 'text-teal';
    if (percentage > 0) {
        sign = '+';
    } else if (percentage < 0) {
        sign = '';
        className = 'text-red';
    }
    return <span className={className}>{`${sign}${formatPercentage(percentage, 2, true)}%`}</span>;
}

export function formatWalletWithoutDecimal(value, acceptNegative = false) {
    if (isNil(value)) return '0';
    if (Math.abs(+value) < 1e-8) return '0';
    if (!acceptNegative && +value < 0) return '0';
    return numeral(+value).format('0,0', Math.floor);
}

export function formatWalletReverseWithoutDecimal(value, acceptNegative = false) {
    if (isNil(value)) return '0';
    if (Math.abs(+value) < 1e-8) return '0';
    if (!acceptNegative && +value < 0) return '0';
    return numeral(+value * -1).format('0,0', Math.floor);
}

export function roundByWithdraw(val, roundByValue) {
    const dirtyValue = Math.floor(+val / +roundByValue) * +roundByValue;
    return dirtyValue.toFixed(12);
}

export function formatAbbreviateNumber(num, fixed) {
    if (num === null) return null; // terminate early
    if (num === 0) return '0'; // terminate early

    // eslint-disable-next-line no-param-reassign
    fixed = (!fixed || fixed < 0) ? 0 : fixed; // number of decimal places to show
    const b = Number(num).toPrecision(2).split('e'); // get power
    const k = b.length === 1 ? 0 : Math.floor(Math.min(b[1].slice(1), 14) / 3); // floor at decimals, ceiling at trillions
    // eslint-disable-next-line no-restricted-properties
    const c = k < 1 ? Number(num).toFixed(0 + fixed) : (Number(num) / Math.pow(10, k * 3)).toFixed(1 + fixed); // divide by power
    const d = c < 0 ? c : Math.abs(c); // enforce -0 is 0
    const e = (+d).toLocaleString() + ['', 'K', 'M', 'B', 'T'][k]; // append power
    // if (e === 'NaN' || Number.isNaN(e)) {
    //     return '-';
    // }
    return e;
}
