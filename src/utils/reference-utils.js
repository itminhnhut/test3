export const LoginButtonPosition = {
    WEB_HEADER: 'web_header',
    WEB_MODAL: 'web_modal',
    WEB_MIDDLE: 'web_middle',
    MOBILE_HEADER: 'mobile_header',
    MOBILE_MODAL: 'mobile_modal',
    MOBILE_MIDDLE: 'mobile_middle'
};

import moment from 'moment-timezone';
import numeral from 'numeral';

import React from 'react';
import { defaults, findKey } from 'lodash';

export const WalletCurrency = {
    NAMI: 1,
    NAC: 1,
    ETH: 2,
    DAI: 3,
    SPIN: 4,
    DOGE: 5,
    XLM: 6,
    KNC: 7,
    TOMO: 8,
    BTC: 9,
    XRP: 10,
    KAT: 11,
    FNX: 12,
    TURN_CHRISTMAS_2017: 20,
    TURN_CHRISTMAS_2017_FREE: 21, // 1 ngay 1 lan neu tham gia exchange
    USDT: 22,
    USDT_BINANCE_FUTURES: 23,

    SPIN_CONQUEST: 31, // Spin cho che do 1E hoac custom
    SPIN_BONUS: 32, // Spin free
    SPIN_SPONSOR: 33, // Spin tai tro
    VNST: 39,
    // Token for nami.exchange
    BNB: 40,
    BAT: 41,
    OMG: 42,
    LINK: 43,
    ZRX: 44,
    ZIL: 45,
    REP: 46,
    HOT: 47,
    ENJ: 48,
    NPXS: 49,
    IOST: 50,
    GNT: 51,
    SNT: 52,
    PPT: 53,
    MCO: 54,
    WTC: 55,
    MANA: 56,
    LOOM: 57,
    LRC: 58,
    ELF: 59,
    POWR: 60,
    MKR: 61,
    THETA: 62,
    HT: 63,
    USDC: 64,

    FET: 65,
    CELR: 66,
    BLOC: 67,
    DOS: 68,

    MATIC: 69,
    MITH: 70,
    GTO: 71,
    VNDC: 72,
    TRX: 73,
    RET: 74,
    // Bitcoin future
    XBT: 75,
    C98: 76,
    CHI: 77,
    XBT_PENDING: 78,
    ETC: 79,
    UNI: 80,
    FLM: 81,
    SUSHI: 82,
    FIL: 83,
    KAI: 84,
    OLA: 85,
    OLC: 85,
    ONUS: 86,
    '1INCH': 87,
    WHC: 88,
    ELD: 89,
    DOT: 90,
    CTK: 91,
    NEO: 92,
    USD: 99,
    SPIN_CLONE: 100,

    ADA: 101,
    EOS: 102,
    LIT: 103,
    LTC: 104,
    ATOM: 105,
    BCH: 106,
    TWT: 107,
    ONT: 108,
    SFP: 109,

    BUSD: 110,
    FTM: 111,
    ACM: 113,
    SXP: 114,
    SOL: 115,
    EUR: 116,
    SRM: 117,
    UNFI: 118,
    GRT: 119,
    VET: 120,
    REEF: 121,
    CAKE: 122,
    AAVE: 123,
    XVS: 124,
    AVAX: 125,
    DASH: 126,
    ALPHA: 127,
    BTCST: 128,
    LUNA: 129,
    XTZ: 130,
    IOTA: 131,

    BADGER: 132,
    VITE: 133,
    PERL: 134,

    NEAR: 135,
    IRIS: 136,
    CHR: 137,

    OGN: 138,
    CHZ: 139,

    SAND: 140,
    BTT: 141,
    BDS: 142,

    ONE: 143,
    LINA: 144,
    QTUM: 145,

    CVP: 146,
    DREP: 147,

    ATS: 148,

    YFII: 149,
    FTT: 150,
    AUDIO: 151,

    // CTK: 91
    TCT: 152,
    TROY: 153,

    CRV: 154,
    ONG: 155,
    CKB: 156,
    DUSK: 157,
    YFI: 158,

    DENT: 159,
    WIN: 160,

    RSR: 161,
    IOTX: 162,
    PNT: 163,
    BAMI: 164,
    VNCT: 165,

    WRX: 166,
    STX: 167,
    POND: 168,

    FUN: 169,
    RAMP: 170,
    TKO: 171,

    AKRO: 172,
    ALICE: 173,
    AXS: 174,
    BEL: 175,
    BLZ: 176,
    BTS: 177,
    CVC: 178,
    HNT: 179,
    ICX: 180,
    RLC: 181,
    STORJ: 182,
    DPET: 183,

    DIA: 185,
    BAKE: 186,

    SFO: 187,

    BEAM: 188,
    AION: 189,
    AVA: 190,
    DEGO: 192,
    TFUEL: 193,
    DODO: 194,
    SHIB: 195,
    UMA: 196,
    TPH: 197,
    MAN: 198,

    SLP: 199,
    COCOS: 200,
    ANKR: 201,

    ALGO: 203,
    ANT: 204,
    AR: 205,
    ARDR: 206,
    ARPA: 207,
    ASR: 208,
    ATA: 209,
    ATM: 210,
    AUTO: 211,
    BAL: 212,
    BAND: 213,
    BAR: 214,
    BNT: 217,
    BOND: 218,
    BTG: 219,
    BURGER: 221,
    BZRX: 222,
    CELO: 223,
    CFX: 224,
    COMP: 225,
    COS: 226,
    COTI: 227,
    CTSI: 228,
    CTXC: 229,
    DATA: 231,
    DCR: 232,
    DGB: 233,
    DNT: 234,
    DOCK: 235,
    EGLD: 236,
    EPS: 237,
    ERN: 238,
    FIO: 239,
    FIRO: 240,
    FIS: 241,
    FORTH: 243,
    GTC: 244,
    GXS: 245,
    HARD: 246,
    HBAR: 247,
    HIVE: 248,
    ICP: 250,
    INJ: 252,
    JST: 253,
    JUV: 254,
    KAVA: 255,
    KEEP: 256,
    KEY: 257,
    KLAY: 258,
    KMD: 259,
    KSM: 260,
    LPT: 261,
    LSK: 263,
    LTO: 264,
    MASK: 265,
    MBL: 266,
    MDT: 267,
    MDX: 268,
    MFT: 269,
    MIR: 270,
    MLN: 273,
    MTL: 274,
    NANO: 275,
    NBS: 276,
    NKN: 277,
    NMR: 278,
    NU: 279,
    NULS: 280,
    OCEAN: 281,
    OG: 282,
    OM: 283,
    ORN: 285,
    OXT: 286,
    PAXG: 287,
    PERP: 288,
    PHA: 289,
    POLS: 290,
    PSG: 291,
    PUNDIX: 292,
    REN: 293,
    RIF: 295,
    ROSE: 297,
    RUNE: 298,
    RVN: 299,
    SC: 300,
    SKL: 301,
    SNX: 302,
    STMX: 303,
    STPT: 305,
    STRAX: 306,
    SUN: 307,
    SUPER: 308,
    TLM: 310,
    TORN: 312,
    TRB: 313,
    TRU: 314,
    UTK: 315,
    VTHO: 316,
    WAN: 317,
    WAVES: 318,
    WING: 319,
    WNXM: 320,
    XEM: 322,
    XMR: 323,
    XVG: 325,
    ZEC: 326,
    ZEN: 327,
    RICE: 328,
    DEXE: 329,
    DFL: 330,
    SPS: 331,
    CLV: 332,
    QNT: 333,
    LTD: 334,
    FAM: 335,
    MIST: 336,
    MINA: 337,
    RAY: 338,
    ALPACA: 339,
    FARM: 340,
    LPDI: 341,
    QUICK: 342,
    KSC: 343,
    BKS: 344,
    ITAM: 345,
    MBOX: 346,
    FOR: 347,
    REQ: 348,
    KPHI: 349,
    WAXP: 350,
    TRIBE: 351,
    GNO: 352,
    DYDX: 353,
    POLY: 354,
    VIDT: 355,
    IDEX: 356,
    GALA: 357,
    ILV: 358,
    YGG: 359,
    FIDA: 360,
    FRONT: 361,
    DF: 362,
    SYS: 363,
    AGLD: 364,
    RAD: 365,
    BETA: 366,
    RARE: 367,
    RABBIT: 368,
    LAZIO: 369,
    CHESS: 370,
    AUCTION: 371,

    NAO: 447,
    VNST: 39
};

export function assetCodeFromId(assetId) {
    return findKey(WalletCurrency, (id) => id === assetId);
}

export function formatNumber(value, digits = 2, forceDigits = 0, acceptNegative = false) {
    const defaultValue = `0${forceDigits > 0 ? `.${'0'.repeat(forceDigits)}` : ''}`;
    if (_.isNil(value)) return defaultValue;
    if (Math.abs(+value) < 1e-9) return defaultValue;
    if (!acceptNegative && +value < 0) return defaultValue;
    return numeral(+value).format(`0,0.${'0'.repeat(forceDigits)}${digits > 0 ? `[${'0'.repeat(digits)}]` : ''}`, Math.floor);
}

export function formatTime(value, format = 'HH:mm DD/MM/YYYY') {
    return moment(value).format(format);
}

export function getTokenIcon(currency, size) {
    if (currency) {
        return size ? <img src={getTokenIconSrc(currency)} alt="" width={size} /> : <img src={getTokenIconSrc(currency)} alt="" />;
    }
    return null;
}

export function getTokenIconSrc(currency) {
    if (currency) {
        return getS3Url(`/images/coins/64/${currency}.png`);
    }
    return null;
}

export function getS3Url(url) {
    return (process.env.NEXT_PUBLIC_CDN + '/nami.exchange' || '') + url;
}

export function emitEventData(data = {}) {
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify(data));
}

export function currencyToText(currency) {
    currency = +currency;
    switch (currency) {
        case WalletCurrency.TURN_CHRISTMAS_2017:
        case WalletCurrency.TURN_CHRISTMAS_2017_FREE:
            return 'Turn';
        case WalletCurrency.XBT:
            return 'XBT';
        case WalletCurrency.USDT_BINANCE_FUTURES:
            return 'USDT.f';
        case WalletCurrency.NAC:
            return 'NAMI';
        default:
            for (let currencyText in WalletCurrency) {
                if (currencyText && WalletCurrency.hasOwnProperty(currencyText) && WalletCurrency[currencyText] === currency) {
                    return currencyText;
                }
            }
            return '';
    }
}
