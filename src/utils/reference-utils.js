export const LoginButtonPosition = {
    WEB_HEADER: "web_header",
    WEB_MODAL: "web_modal",
    WEB_MIDDLE: "web_middle",
    MOBILE_HEADER: "mobile_header",
    MOBILE_MODAL: "mobile_modal",
    MOBILE_MIDDLE: "mobile_middle"
};

import moment from "moment-timezone";
import numeral from "numeral";

import React from "react";
import _, { defaults } from "lodash";


export function formatNumber(
    value,
    digits = 2,
    forceDigits = 0,
    acceptNegative = false
) {
    const defaultValue = `0${forceDigits > 0 ? `.${"0".repeat(forceDigits)}` : ""
        }`;
    if (_.isNil(value)) return defaultValue;
    if (Math.abs(+value) < 1e-9) return defaultValue;
    if (!acceptNegative && +value < 0) return defaultValue;
    return numeral(+value).format(
        `0,0.${"0".repeat(forceDigits)}${digits > 0 ? `[${"0".repeat(digits)}]` : ""
        }`,
        Math.floor
    );
}

export function formatTime(value, format = "HH:mm DD/MM/YYYY") {
    return moment(value).format(format);
}

export function getTokenIcon(currency, size) {
    if (currency) {
        return size ? (
            <img src={getTokenIconSrc(currency)} alt="" width={size} />
        ) : (
            <img src={getTokenIconSrc(currency)} alt="" />
        );
    }
    return null;
}


export function getTokenIconSrc(currency) {
    if (currency) {
        return getS3Url(`/images/coins/64/${currency}.png`)
    }
    return null;
}


export function getS3Url(url) {
    return (process.env.REACT_APP_PUBLIC_CDN + '/nami.exchange' || '') + url;
}

export function emitEventData(data = {}) {
    window.ReactNativeWebView &&
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
}
