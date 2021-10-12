import DOMPurify from 'dompurify';

export const truncate = (fullStr, strLen, separator) => {
    if (fullStr.length <= strLen) return fullStr;

    // eslint-disable-next-line no-param-reassign
    separator = separator || '...';

    const sepLen = separator.length;
    const charsToShow = strLen - sepLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);

    return fullStr.substr(0, frontChars) +
        separator +
        fullStr.substr(fullStr.length - backChars);
};

export const sanitize = (content) => {
    return typeof window === 'undefined' ? content : DOMPurify.sanitize(content);
};


export const ___DEV___ = process.env.NODE_ENV === 'development'

export const sparkLineBuilder = (symbol, color) => {
    if (___DEV___) {
        return `https://data-test.bitbattle.io/api/v1/chart/sparkline?symbol=${symbol}&broker=NAMI_SPOT&color=%23${color.replace('#', '')}`
    } else {
        return `https://data.bitbattle.io/api/v1/chart/sparkline?symbol=${symbol}&broker=NAMI_SPOT&color=%23${color.replace('#', '')}`
    }
}
