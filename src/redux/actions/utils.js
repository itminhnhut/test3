import { memo, useEffect, useRef, useState, useMemo } from 'react';
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
import {
    DefaultFuturesFee,
    ExchangeFilterDefault,
    LoginButtonPosition,
    TokenConfigV1 as TokenConfig,
    TradingViewSupportTimezone,
    WalletType,
    rateCurrency
} from './const';
import { SET_BOTTOM_NAVIGATION, SET_TRANSFER_MODAL, UPDATE_DEPOSIT_HISTORY } from 'redux/actions/types';
import { API_GET_REFERENCE_CURRENCY } from 'redux/actions/apis';
import fetchAPI from 'utils/fetch-api';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { EXCHANGE_ACTION } from 'pages/wallet';
import { PATHS } from 'constants/paths';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';

const WAValidator = require('multicoin-address-validator');
const EthereumAddress = require('ethereum-address');
import ChevronDown from 'src/components/svg/ChevronDown';
import colors from 'styles/colors';
import { useTranslation } from 'next-i18next';
import { createSelector } from 'reselect';
import { FuturesOrderTypes } from 'redux/reducers/futures';
import { CopyIcon, CheckedIcon } from 'components/svg/SvgIcon';
import { useSelector } from 'react-redux';
import utilsSelectors from 'redux/selectors/utilsSelectors';
import { useRouter } from 'next/router';

export function scrollHorizontal(el, parentEl) {
    if (!parentEl || !el) return;

    const style = el.currentStyle || window.getComputedStyle(el),
        margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
        padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
        border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

    const child = el.getBoundingClientRect();
    const parent = parentEl.getBoundingClientRect();
    const activeWidth = el.clientWidth / 2;
    var pos = child.left - parent.left + activeWidth;
    pos = pos + parentEl.scrollLeft + margin + padding + border - parentEl.clientWidth / 2;
    parentEl.scrollTo({
        left: pos,
        behavior: 'smooth'
    });
}

export function getFilter(filterType, config) {
    const filter = find(config?.filters, { filterType });
    return filter || ExchangeFilterDefault[filterType];
}

export const getDecimalScale = memoize((value = 0.00000001) => {
    let decimalScale = 8;
    if (value && value > 0 && value <= 1) {
        decimalScale = +(-Math.floor(Math.log(value) / Math.log(10))).toFixed(0);
    }
    return decimalScale;
});

export const countDecimals = function (value) {
    if (Math.floor(value) === value) return 0;

    var str = Number(value)?.toString();
    if (str?.indexOf('.') !== -1 && str?.indexOf('-') !== -1) {
        return str?.split('-')[1] || 0;
    } else if (str?.indexOf('.') !== -1) {
        return str?.split('.')[1].length || 0;
    }
    return str?.split('-')[1] || 0;
};

export const formatSwapRate = (value, scaleMore = 2) => {
    if (!value) return;
    let x;
    if (value.toString().includes('e')) {
        const last = getDecimalScale(eToNumber(value)) + scaleMore;
        x = eToNumber(value).substring(0, last);
    } else {
        x = formatSwapValue(value);
    }

    return x;
};

export const formatCurrency = (n, digits = 4, vi = false, e = 1e3) => {
    if (n < e) return formatNumber(n, 0, 0, true);
    if (n >= 1e3 && n < 1e6) return formatNumber(+(n / 1e3).toFixed(4), digits, 0, true) + 'K';
    if (n >= 1e6 && n < 1e9) return formatNumber(+(n / 1e6).toFixed(4), digits, 0, true) + (vi ? ' triệu' : 'M');
    if (n >= 1e9 && n < 1e12) return formatNumber(+(n / 1e9).toFixed(4), digits, 0, true) + (vi ? ' tỷ' : 'B');
    if (n >= 1e12) return formatNumber(+(n / 1e12).toFixed(4), digits, 0, true) + 'T';
};

export function eToNumber(value) {
    let sign = '';

    (value += '').charAt(0) === '-' && ((value = value?.toString().substring(1)), (sign = '-'));
    let arr = value?.toString().split(/[e]/gi);
    if (arr.length < 2) return sign + value;
    let dot = (0.1).toLocaleString().substr(1, 1),
        n = arr[0],
        exp = +arr[1],
        w = (n = n.replace(/^0+/, '')).replace(dot, ''),
        pos = n.split(dot)[1] ? n.indexOf(dot) + exp : w.length + exp,
        L = pos - w.length,
        s = '' + BigInt(w);
    w = exp >= 0 ? (L >= 0 ? s + '0'.repeat(L) : r()) : pos <= 0 ? '0' + dot + '0'.repeat(Math.abs(pos)) + s : r();
    L = w.split(dot);
    if ((L[0] === 0 && L[1] === 0) || (+w === 0 && +s === 0)) w = 0; //** added 9/10/2021
    return sign + w;

    function r() {
        return w.replace(new RegExp(`^(.{${pos}})(.)`), `$1${dot}$2`);
    }
}

export const getDecimalSpotPrice = memoize(
    (symbol = '') => {
        const configs = store().getState()?.utils?.exchangeConfig || null;
        if (isArray(configs)) {
            const config = configs.find((e) => e?.symbol === symbol);
            if (config) {
                const filter = getFilter('PRICE_FILTER', config);
                return +filter?.tickSize ? getDecimalScale(+filter?.tickSize) : 6;
            }
        }
        return 6;
    },
    (symbol) => symbol
);

export function getLoginUrl(mode = 'sso', action = 'login', options = {}) {
    let params = {};
    if (typeof window !== 'undefined') {
        const currentUrl = window.location.href;

        const _options = defaults(options, {
            redirect: currentUrl,
            referral: null,
            utm_source: 'web',
            utm_medium: 'direct',
            utm_campaign: 'nami.exchange',
            utm_content: LoginButtonPosition.WEB_HEADER,
            mobile_web: false
        });

        const referral = sessionStorage && sessionStorage.getItem('refCode') ? sessionStorage.getItem('refCode') : _options.referral;

        const theme = localStorage?.getItem('theme') ?? 'light';

        let language = 'vi';
        if (!currentUrl.includes('/vi')) language = 'en';

        params = {
            ..._options,
            referral,
            theme,
            language
        };
        params = defaults(params, { redirect: process.env.APP_URL });

        switch (mode) {
            case 'sso':
                if (action === 'register') {
                    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/en', '').replace('/vi', '')}/register/nami?${qs.stringify(params)}`;
                    // return `${___DEV___ ? 'https://auth-test.nami.trade' : 'https://auth.nami.io'}/register?${qs.stringify(params)}`;
                }
                return `${process.env.NEXT_PUBLIC_API_URL?.replace('/en', '').replace('/vi', '')}/login/nami?${qs.stringify(params)}`;

            default:
                break;
        }
    }

    return '';
}

export function getSymbolString(symbol = {}) {
    if (symbol) {
        return `${symbol.base}${symbol.quote}`;
    }
}

export function formatTime(value, f = 'yyyy-MM-dd HH:mm') {
    try {
        if (value) {
            const date = value instanceof Date ? value : new Date(value);
            return format(date, f);
        }
    } catch (error) {
        console.error(error);
        return value;
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
    price = exponentialToDecimal(price);
    if (isArray(configs)) {
        const asset = configs.find((e) => e.assetCode?.toUpperCase() === assetCode?.toUpperCase());
        if (asset) {
            if (price <= 1e-6) return formatNumber2(price, asset.assetDigit);
            return numeral(+price).format(`0,0.[${'0'.repeat(asset.assetDigit)}]`);
        }
    }
    if (isNumber(configs)) {
        if (price <= 1e-6) return formatNumber2(price, configs);
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
    return numeral(+price).format('0,0.[00000000]');
}

export function isInvalidPrecision(value, precision) {
    if (Number.isNaN(value)) return true;
    return +(Math.round(+value / precision) * precision).toFixed(12) !== value;
}

export function formatNumberToText(value = 0) {
    return numeral(+value).format('0,00a');
}

export function formatNumber(value, digits = 2, forceDigits = 0, acceptNegative = false) {
    value = exponentialToDecimal(value);
    const defaultValue = `0${forceDigits > 0 ? `.${'0'.repeat(forceDigits)}` : ''}`;
    if (value <= 1e-6) return formatNumber2(value, digits);
    if (isNil(value)) return defaultValue;
    if (Math.abs(+value) <= 1e-6) return defaultValue;
    if (!acceptNegative && +value < 0) return defaultValue;
    return numeral(+value).format(`0,0.${'0'.repeat(forceDigits)}${digits > 0 ? `[${'0'.repeat(digits)}]` : ''}`, Math.floor);
}

export function formatNumber2(number, decimalScale = 8, thousandSeparator = true) {
    if (!number) {
        return '';
    }
    if (thousandSeparator) {
        // Can't use toLocaleString because it's not available on Android
        const parts = number.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if (parts[1]) {
            parts[1] = parts[1].substring(0, decimalScale);
        }
        if (decimalScale === 0) return parts[0];
        return parts.join('.');
    } else {
        return numberToString(number, decimalScale);
    }
}

export function numberToString(number, decimalScale = 8, cutPaddingDecimalsZero = true) {
    if (!number) {
        return '';
    }
    let result = Number(number).toFixed(decimalScale);
    if (decimalScale > 0 && cutPaddingDecimalsZero) {
        return result.replace(/\.?0+$/, '');
    } else {
        return result;
    }
}

export const exponentialToDecimal = (exponential) => {
    let decimal = exponential?.toString().toLowerCase() || '';
    if (decimal.includes('e+')) {
        const exponentialSplitted = decimal.split('e+');
        let postfix = '';
        for (let i = 0; i < +exponentialSplitted[1] - (exponentialSplitted[0].includes('.') ? exponentialSplitted[0].split('.')[1].length : 0); i++) {
            postfix += '0';
        }
        const addCommas = (text) => {
            let j = 3;
            let textLength = text.length;
            while (j < textLength) {
                text = `${text.slice(0, textLength - j)},${text.slice(textLength - j, textLength)}`;
                textLength++;
                j += 3 + 1;
            }
            return text;
        };
        decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
    }
    if (decimal.toLowerCase().includes('e-')) {
        const exponentialSplitted = decimal.split('e-');
        let prefix = '0.';
        for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
            prefix += '0';
        }
        decimal = prefix + exponentialSplitted[0].replace('.', '');
    }
    return decimal;
};

export function scrollFocusInput() {
    if (typeof window !== 'undefined') {
        window.scrollTo(0, window.innerHeight);
    }
}

export function getExchange24hPercentageChange(price) {
    let change24h;
    if (price) {
        const { p: lastPrice, ld: lastPrice24h, q: quoteAsset } = price;
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

export function render24hChange(ticker, showPrice = false, className = '') {
    const change24h = getExchange24hPercentageChange(ticker);
    let percent, priceChange;
    // let className = '';
    let negative = false;
    if (change24h) {
        priceChange = (change24h * ticker.ld) / 100;
        if (change24h > 0) {
            className += ' text-teal';
        } else if (change24h < 0) {
            negative = true;
            className += ' text-red';
        }

        percent = `${formatPercentage(Math.abs(change24h), 2, true)}%`;
    } else {
        percent = null;
    }
    return (
        <div className={`${className} text-xs space-x-2 flex font-semibold`}>
            {showPrice && <span>{formatNumber(Math.abs(priceChange), ticker?.q === 'VNDC' ? 0 : 2, 0, true)}</span>}
            <span className={'flex items-center ' + (percent ? '' : 'text-teal')}>
                {percent ? <ChevronDown color={negative ? colors.red2 : colors.teal} className={negative ? '' : '!rotate-0'} /> : null} {percent ?? '-'}
            </span>
        </div>
    );
}

export function getS3Url(url) {
    return process.env.NEXT_PUBLIC_CDN + url;
}

export function getV1Url(url) {
    return process.env.NEXT_PUBLIC_WEB_V1 + url;
}

function encodeData(data) {
    return Object.keys(data)
        .map((key) => {
            return [key, data[key]].map(encodeURIComponent).join('=');
        })
        .join('&');
}

export function getSparkLine(symbol, color = '#00C8BC', resolution) {
    const query = {
        symbol,
        broker: 'NAMI_SPOT',
        color
    };
    if (resolution) query.resolution = resolution;
    return process.env.NEXT_PUBLIC_PRICE_API_URL + `/api/v1/chart/sparkline?${encodeData(query)}`;
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
        offset: -new Date().getTimezoneOffset()
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
        percentage = (a / b) * 100;
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
        percentage = ((to - from) / from) * 100;
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
    fixed = !fixed || fixed < 0 ? 0 : fixed; // number of decimal places to show
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

export function hashValidator(hash, type) {
    let regex;
    switch (type) {
        case TokenConfig.Type.BEP2:
            regex = new RegExp(TokenConfig.HashRegex.BEP2);
            break;
        case TokenConfig.Type.BEP20:
            regex = new RegExp(TokenConfig.HashRegex.BEP20);
            break;
        case TokenConfig.Type.ERC20:
            regex = new RegExp(TokenConfig.HashRegex.ERC20);
            break;
        case TokenConfig.Type.TRC20:
            regex = new RegExp(TokenConfig.HashRegex.TRC20);
            break;
        case TokenConfig.Type.TRON_NATIVE:
            regex = new RegExp(TokenConfig.HashRegex.TRC20);
            break;
        case TokenConfig.Type.BITCOIN:
            regex = new RegExp(TokenConfig.HashRegex.BITCOIN);
            break;
        case TokenConfig.Type.BITCOIN_FUTURE:
            return null;
        case TokenConfig.Type.TomoChain:
            regex = new RegExp(TokenConfig.HashRegex.TomoChain);
            break;
        case TokenConfig.Type.THETA_TOKEN:
            regex = new RegExp(TokenConfig.HashRegex.THETA_TOKEN);
            break;
        case TokenConfig.Type.VITE_CHAIN_TOKEN:
            regex = new RegExp(TokenConfig.HashRegex.VITE_CHAIN_TOKEN);
            break;
        case 'BEP2MEMO':
            regex = new RegExp(TokenConfig.HashRegex.BEP2MEMO);
            break;
        case 'VITEMEMO':
            regex = new RegExp(TokenConfig.HashRegex.BEP2MEMO);
            break;
        default:
            regex = 'NOT_FOUND';
            break;
    }
    if (regex !== 'NOT_FOUND') return regex.test(hash);
    return regex;
}

export const shortHashAddress = (address, first, last) => {
    if (!address) return;
    return `${address?.substring(0, first)}...${address.substring(address.length - last)}`;
};

export function buildExplorerUrl(value, tokenNetwork) {
    switch (tokenNetwork) {
        case TokenConfig.Network.BITCOIN:
        case TokenConfig.Network.BITCOIN_FUTURE:
            return buildBlockchainComUrl(value);
        case TokenConfig.Network.BINANCE_CHAIN:
            return buildBinanceExplorerUrl(value);
        case TokenConfig.Network.ETHEREUM:
            return buildEtherscanUrl(value);
        case TokenConfig.Network.TRON_NETWORK:
            return buildTronExplorerUrl(value);
        case TokenConfig.Network.TOMO_CHAIN:
            return buildTomoscanExplorerUrl(value);
        case TokenConfig.Network.ETHEREUM_CLASSIC:
            return buildEtcExplorerUrl(value);
        case TokenConfig.Network.KARDIA_CHAIN:
            return buildKardiaChainExplorerUrl(value);
        case TokenConfig.Network.VITE_CHAIN:
            return buildViteChainExplorerUrl(value);
        case TokenConfig.Network.BINANCE_SMART_CHAIN:
            return buildBSCExplorerUrl(value);
        case TokenConfig.Network.THETA:
            return buildThetaExplorerUrl(value);
    }
    return null;
}

export function buildBlockchainComUrl(txhash) {
    const isAddress = WAValidator.validate(txhash, 'BTC');
    if (isAddress) {
        return `https://www.blockchain.com/btc/address/${txhash}`;
    } else {
        return `https://www.blockchain.com/btc/tx/${txhash}`;
    }
}

export function buildBinanceExplorerUrl(addressOrTxhash) {
    const networkConfig = process.env.NEXT_PUBLIC_BINANCE_NETWORK;
    let network;
    switch (networkConfig.toLowerCase()) {
        case 'main':
        case 'mainnet':
            network = null;
            break;
        default:
            network = networkConfig;
            break;
    }
    if (addressOrTxhash.length === 64) {
        // Txhash
        if (network) {
            return `https://${network}-explorer.binance.org/tx/${addressOrTxhash}`;
        } else {
            return `https://explorer.binance.org/tx/${addressOrTxhash}`;
        }
    } else if (addressOrTxhash.startsWith('tbnb') || addressOrTxhash.startsWith('bnb')) {
        // Address
        if (network) {
            return `https://${network}-explorer.binance.org/address/${addressOrTxhash}`;
        } else {
            return `https://explorer.binance.org/address/${addressOrTxhash}`;
        }
    } else {
        return null;
    }
}

export function buildEtherscanUrl(txhash) {
    const networkIndex = process.env.NEXT_PUBLIC_ETH_NETWORK;
    let network;
    switch (networkIndex) {
        case '1':
            network = null;
            break;
        case '3':
            network = 'ropsten';
            break;
        default:
            return null;
    }
    const isAddress = EthereumAddress.isAddress(txhash);
    if (isAddress) {
        if (network) {
            return `https://${network}.etherscan.io/address/${txhash}`;
        } else {
            return `https://etherscan.io/address/${txhash}`;
        }
    } else {
        if (network) {
            return `https://${network}.etherscan.io/tx/${txhash}`;
        } else {
            return `https://etherscan.io/tx/${txhash}`;
        }
    }
}

export function buildTronExplorerUrl(addressOrTxhash) {
    const networkConfig = process.env.NEXT_PUBLIC_TRON_NETWORK;
    let network;
    switch (networkConfig.toLowerCase()) {
        case 'main':
        case 'mainnet':
            network = null;
            break;
        default:
            network = networkConfig;
            break;
    }
    let isAddress = WAValidator.validate(addressOrTxhash, 'TRX');
    if (isAddress) {
        if (network) {
            return `https://shasta.tronscan.org/#/address/${addressOrTxhash}`;
        } else {
            return `https://tronscan.org/#/address/${addressOrTxhash}`;
        }
    } else {
        if (network) {
            return `https://shasta.tronscan.org/#/transaction/${addressOrTxhash}`;
        } else {
            return `https://tronscan.org/#/transaction/${addressOrTxhash}`;
        }
    }
}

export function buildTomoscanExplorerUrl(addressOrTxhash) {
    const isAddress = EthereumAddress.isAddress(addressOrTxhash);
    if (isAddress) {
        return `https://scan.tomochain.com/address/${addressOrTxhash}`;
    } else {
        return `https://scan.tomochain.com/txs/${addressOrTxhash}`;
    }
}

export function buildEtcExplorerUrl(addressOrTxhash) {
    const isAddress = EthereumAddress.isAddress(addressOrTxhash);
    if (isAddress) {
        if (process.env.NODE_ENV === 'production') {
            return `https://etc.tokenview.com/en/address/${addressOrTxhash}`;
        } else {
            return `https://blockscout.com/etc/kotti/address/${addressOrTxhash}`;
        }
    } else {
        if (process.env.NODE_ENV === 'production') {
            return `https://etc.tokenview.com/en/tx/${addressOrTxhash}`;
        } else {
            return `https://blockscout.com/etc/kotti/tx/${addressOrTxhash}`;
        }
    }
}

export function buildKardiaChainExplorerUrl(addrOrHash) {
    if (!addrOrHash) return;
    const isAddress = addrOrHash.length === 42;

    if (isAddress) {
        if (process.env.NODE_ENV === 'production') {
            return `https://explorer.kardiachain.io/address/${addrOrHash}`;
        } else {
            return `https://testnet.kardiachain.io/address/${addrOrHash}`;
        }
    } else {
        if (process.env.NODE_ENV === 'production') {
            return `https://explorer.kardiachain.io/tx/${addrOrHash}`;
        } else {
            return `https://testnet.kardiachain.io/tx/${addrOrHash}`;
        }
    }
}

export function buildViteChainExplorerUrl(txhash) {
    if (txhash == null) {
        return null;
    }
    const isAddress = txhash.length === 55;

    if (isAddress) {
        return `https://vitescan.io/address/${txhash}`;
    } else {
        return `https://vitescan.io/tx/${txhash}`;
    }
}

export function buildBSCExplorerUrl(txhash) {
    switch (txhash.length) {
        case 42: {
            // Address
            return `https://bscscan.com/address/${txhash}`;
        }
        case 66: {
            // Txhash
            return `https://bscscan.com/tx/${txhash}`;
        }
        default: {
            // Search for it
            return `https://bscscan.com/search?f=0&q=${txhash}`;
        }
    }
}

export function buildThetaExplorerUrl(txhash) {
    switch (txhash.length) {
        case 42: {
            // Address
            return `https://explorer.thetatoken.org/account/${txhash}`;
        }
        default: {
            // Txhash
            return `https://explorer.thetatoken.org/txs/${txhash}`;
        }
    }
}

export function updateOrInsertDepositHistory(searchCriteria, history) {
    return {
        type: UPDATE_DEPOSIT_HISTORY,
        criteria: searchCriteria,
        payload: history
    };
}

export function walletLinkBuilder(walletType, action, payload) {
    if (walletType === WalletType.SPOT) {
        switch (action) {
            case EXCHANGE_ACTION.DEPOSIT:
                return `${PATHS.WALLET.EXCHANGE.DEPOSIT}?type=${payload?.type || 'crypto'}&asset=${payload?.asset || 'USDT'}`;
            case EXCHANGE_ACTION.WITHDRAW:
                return `${PATHS.WALLET.EXCHANGE.WITHDRAW}?type=${payload?.type || 'crypto'}&asset=${payload?.asset || 'USDT'}`;
            default:
                return '';
        }
    }

    if (walletType === WalletType.FUTURES) {
    }
}

export function setTransferModal(payload) {
    // source look like
    // payload = {
    //     isVisible: <boolean>,
    //     fromAsset: <WalletType>,
    //     toAsset: <WalletType>,
    //     asset: <WalletType>
    // }

    return {
        type: SET_TRANSFER_MODAL,
        payload
    };
}

export function getLastestSourcePath(paths) {
    if (!paths) return undefined;
    const caskPath = paths.split('/');
    if (Array.isArray(caskPath)) {
        // console.log('namidev-DEBUG: caskPath => ', caskPath)
        return caskPath[caskPath.length - 1];
    }
    return undefined;
}

export function measureTextWidth(value) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    context.font = getComputedStyle(document.body).font;
    return context.measureText(value).width;
}

export const secondToMinutesAndSeconds = (time) => {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = Math.floor(time % 60);

    // Output like "1:01" or "01:01:01"
    let result = '';
    if (hours > 0) result += '' + hours + ':' + (minutes < 10 ? '0' : '');
    result += '' + minutes + ':' + (seconds < 10 ? '0' : '');
    result += '' + seconds;

    return {
        toString: () => result,
        parse: () => ({
            hours,
            minutes,
            seconds
        })
    };
};

export const getPriceColor = (value, onusMode = false) => {
    if (onusMode) {
        return value === 0 ? '' : value < 0 ? 'text-onus-red' : 'text-onus-green';
    } else {
        return value === 0 ? '' : value < 0 ? 'text-red-2 dark:text-red' : 'text-green-3 dark:text-teal';
    }
};

const BASE_ASSET = ['VNDC', 'USDT'];

export const getSymbolObject = (symbol) => {
    if (!symbol || ['USDTVNDC', 'VNDCUSDT', 'VNDC/USDT', 'USDT/VNDC', 'VNDC/', 'USDT/'].includes(symbol)) {
        log?.d(`Symbol not support`);
        return;
    }

    if (symbol?.includes('/VNDC') || symbol?.includes('/USDT') || symbol?.includes('VNDC') || symbol?.includes('USDT')) {
        let baseAsset = '',
            quoteAsset = '';

        if (symbol?.includes('VNDC')) {
            quoteAsset = 'VNDC';
            baseAsset = symbol?.replace('VNDC', '');
        }

        if (symbol?.includes('USDT')) {
            quoteAsset = 'USDT';
            baseAsset = symbol?.replace('USDT', '');
        }

        // ? Handle predictable symbol
        if (baseAsset?.includes('_')) {
            baseAsset = baseAsset?.split('_')?.[0];
        }

        return {
            symbol,
            baseAsset,
            quoteAsset
        };
    }

    return {};
};

export const setBottomTab = (tab) => async (dispatch) => {
    dispatch({
        type: SET_BOTTOM_NAVIGATION,
        payload: tab
    });
};

export const emitWebViewEvent = (event) => {
    if (typeof window !== undefined) {
        console.log('__ emitWebViewEvent', event);
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(event);
    }
};

export const getLiquidatePrice = (order = {}, activePrice = 0) => {
    let liquidatePrice = 0;
    const { side, quantity: size, leverage, quoteQty } = order;
    const _size = side === VndcFutureOrderType.Side.SELL ? -size : size;
    const _sign = side === VndcFutureOrderType.Side.SELL ? -1 : 1;
    const margin = quoteQty / leverage;
    const feeRatio = DefaultFuturesFee.NamiFrameOnus;
    liquidatePrice = (_size * activePrice + quoteQty * feeRatio - margin) / (size * (_sign - feeRatio));
    return liquidatePrice;
};

export const getSuggestSl = (side, activePrice = 0, leverage = 10, profitRatio = 0.6) => {
    if (side == VndcFutureOrderType.Side.BUY) {
        return ((-profitRatio * activePrice) / leverage + activePrice * (1 + DefaultFuturesFee.NamiFrameOnus)) / (1 - DefaultFuturesFee.NamiFrameOnus);
    } else {
        return ((-profitRatio * activePrice) / leverage - activePrice * (1 - DefaultFuturesFee.NamiFrameOnus)) / (-1 - DefaultFuturesFee.NamiFrameOnus);
    }
};

export const getSuggestTp = (side, activePrice = 0, leverage = 10, profitRatio = 0.6) => {
    if (side == VndcFutureOrderType.Side.BUY) {
        return ((profitRatio * activePrice) / leverage + activePrice * (1 + DefaultFuturesFee.NamiFrameOnus)) / (1 - DefaultFuturesFee.NamiFrameOnus);
    } else {
        return ((profitRatio * activePrice) / leverage - activePrice * (1 - DefaultFuturesFee.NamiFrameOnus)) / (-1 - DefaultFuturesFee.NamiFrameOnus);
    }
};

export const checkInFundingTime = () => {
    const now = new Date();
    const hour = now.getUTCHours();
    const min = now.getMinutes();
    return (min === 0 && hour % 8 === 0) || (min >= 50 && hour % 8 === 7);
};

export const Countdown = memo(({ date, onEnded, isDays = false }) => {
    const timer = useRef(null);
    const [count, setCount] = useState({
        days: 0,
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    const formatN = (number) => {
        return number > 9 ? number : `0${number}`;
    };

    const startCountDown = (date) => {
        if (!date) return;
        const countDownDate = new Date(date).getTime();
        const now = new Date().getTime();
        const distance = countDownDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCount({
            days: formatN(days),
            hours: formatN(hours),
            minutes: formatN(minutes),
            seconds: formatN(seconds)
        });
        if (distance < 0) {
            clearInterval(timer.current);
            setCount({
                days: 0,
                hours: '00',
                minutes: '00',
                seconds: '00'
            });
            if (onEnded) onEnded();
        }
    };

    useEffect(() => {
        if (!date) return;
        timer.current = setInterval(() => {
            startCountDown(date);
        }, 1000);
        return () => {
            clearInterval(timer.current);
        };
    }, [date]);

    return (
        <>
            {isDays ? count?.days + 'D' : ''} {count?.hours}:{count?.minutes}:{count?.seconds}
        </>
    );
});

export const formatFundingRate = (value) => {
    return (value ? (value > 0 ? '' : '-') + formatNumber(Math.abs(value), 6, 0, true) : 0) + '%';
};

export function checkLargeVolume(notional, isVndc = true) {
    if (isVndc) {
        return notional >= 600e6;
    } else {
        return notional >= 30e3;
    }
}

export const RefCurrency = ({ price, quoteAsset }) => {
    const [referencePrice, setReferencePrice] = useState([]);

    useEffect(() => {
        fetchAPI({
            url: API_GET_REFERENCE_CURRENCY,
            params: { base: 'VNDC,USDT', quote: 'USD' }
        })
            .then(({ data = [] }) => {
                setReferencePrice(
                    data.reduce((acm, current) => {
                        return {
                            ...acm,
                            [`${current.base}/${current.quote}`]: current.price
                        };
                    }, {})
                );
            })
            .catch((err) => console.error(err));
    }, []);

    return `$${formatPrice(quoteAsset === 'VNDC' ? price / rateCurrency[quoteAsset] : referencePrice[`${quoteAsset}/USD`] * price, 4)}`;
};

export const TypeTable = ({ type, data }) => {
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const str = String(data[type]).toUpperCase();
    const color = str === 'SELL' ? 'text-red-2 dark:text-red' : 'text-green-3 dark:text-teal';
    switch (type) {
        case 'side':
            return <span className={color}>{str === 'SELL' ? t('common:sell') : t('common:buy')}</span>;
        case 'type':
            return str === 'MARKET' ? t('common:market') : str === 'LIMIT' ? t('common:limit') : getType(str);
        default:
            return null;
    }
};

export const getDecimalPrice = (config) => {
    const decimalScalePrice = config?.filters?.find((rs) => rs.filterType === 'PRICE_FILTER') ?? 1;
    return +countDecimals(decimalScalePrice?.tickSize);
};

export const getDecimalQty = (config) => {
    const decimal = config?.filters?.find((rs) => rs.filterType === 'LOT_SIZE') ?? 1;
    return +countDecimals(decimal?.stepSize);
};

export const getUnit = createSelector([(state) => state.utils.assetConfig, (unitConfig, assetCode) => assetCode], (unitConfig, assetCode) =>
    unitConfig.find((rs) => rs?.assetCode === assetCode)
);

export const getType = (type) => {
    switch (type) {
        case FuturesOrderTypes.Limit:
            return VndcFutureOrderType.Type.LIMIT;
        case FuturesOrderTypes.Market:
            return VndcFutureOrderType.Type.MARKET;
        case FuturesOrderTypes.StopLimit:
        case FuturesOrderTypes.StopMarket:
            return VndcFutureOrderType.Type.STOP;
        default:
            return null;
    }
};

export function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export const copy = (text, cb) => {
    if (navigator.clipboard && navigator.permissions) {
        navigator.clipboard.writeText(text).then(cb);
    } else if (document.queryCommandSupported('copy')) {
        const ele = document.createElement('textarea');
        ele.value = text;
        document.body.appendChild(ele);
        ele.select();
        document.execCommand('copy');
        document.body.removeChild(ele);
        if (cb) cb();
    }
};

export const CopyText = memo(({ text = '', setText, value, className = '', size = 16, label }) => {
    const [copied, setCopied] = useState(false);
    const title = label ?? text;
    useEffect(() => {
        if (value) setCopied(value === text);
    }, [value]);

    useEffect(() => {
        if (copied)
            setTimeout(() => {
                setCopied(false);
            }, 3000);
    }, [copied]);

    return (
        <div
            className={`flex items-center space-x-2 cursor-pointer ${className}`}
            onClick={() =>
                copy(text, () => {
                    setCopied(true);
                    if (setText) setText(text);
                })
            }
        >
            <span>{title}</span>
            {!copied ? <CopyIcon size={size} /> : <CheckedIcon size={size} color={colors.teal} />}
        </div>
    );
});

export const ReasonClose = ({ order }) => {
    const { t } = useTranslation();
    switch (order?.reason_close_code) {
        case 0:
            return t('futures:order_history:normal');
        case 1:
            return t('futures:order_history:hit_sl');
        case 2:
            return t('futures:order_history:hit_tp');
        case 3:
            return t('futures:order_history:liquidate');
        case 5:
            return t('futures:mobile:adjust_margin:added_volume');
        case 6:
            return t('futures:mobile:adjust_margin:close_partially');
        default:
            return '-';
    }
};

export const FeeMetaFutures = ({ order, mode = 'open_fee' }) => {
    const allAssets = useSelector((state) => utilsSelectors.getAllAssets(state));
    const convertObject = (obj) => {
        if (obj?.currency) {
            return [
                {
                    asset: +obj?.currency,
                    value: obj?.value ?? 0
                }
            ];
        } else {
            const arr = [];
            Object.keys(obj).map((key) => {
                arr.push({
                    asset: +key,
                    value: obj[key]
                });
            });
            return arr;
        }
    };

    const fee_metadata = useMemo(() => {
        const metadata = order?.fee_data ?? order?.fee_metadata;
        const feeFilter = metadata?.[mode === 'open_fee' ? 'place_order' : 'close_order'];
        const fee = feeFilter ? convertObject(feeFilter) : [];
        return fee;
    }, [order]);

    const decimal = fee_metadata[0]?.asset === 72 ? allAssets[fee_metadata[0]?.asset]?.assetDigit : allAssets[fee_metadata[0]?.asset]?.assetDigit + 2;
    return fee_metadata.length > 0 ? formatNumber(fee_metadata[0]?.value, decimal) + ' ' + allAssets[fee_metadata[0]?.asset]?.assetCode : '-';
};

export const getOffsetEl = (el) => {
    var clone = el.cloneNode(true);
    clone.style.cssText = 'position: fixed; top: 0; left: 0; overflow: auto; visibility: hidden; pointer-events: none; height: unset; max-height: unset';
    document.body.append(clone);
    const width = clone.offsetWidth;
    const height = clone.offsetHeight;
    clone.remove();
    return { w: width, h: height };
};
