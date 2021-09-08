import * as types from 'src/redux/actions/types';
import fetchAPI from 'utils/fetch-api';
import { ApiStatus } from './const';
import {
    API_CATEGORY_AVATAR_LIST,
    API_GET_ASSET_CONFIG,
    API_GET_EXCHANGE_CONFIG,
    API_GET_MARKET_WATCH,
    API_GET_ORDER_BOOK,
    API_GET_RECENT_TRADE, API_METRIC_VIEW,
    API_WATCH_LIST,
} from './apis';

export const setUser = (user) => (dispatch) => dispatch({ type: types.SET_USER, payload: user });

export const actionExample = async (payload, next = f => f) => {
    return {
        type: types.SINGLE_API,
        payload: {
            url: '/example',
            payload,
            options: {
                method: 'POST',
            },
            next: async (err, response) => {
                if (err) {
                    return;
                }

                // Do smt
                next();
            },
        },
    };
};

export function getExchangeConfig() {
    return async dispatch => {
        try {
            const res = await fetchAPI({
                url: API_GET_EXCHANGE_CONFIG,
                options: {
                    method: 'GET',
                },
            });
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                dispatch({
                    type: types.SET_EXCHANGE_CONFIG,
                    payload: data,
                });
            }
        } catch (e) {
            dispatch({
                type: types.SET_EXCHANGE_CONFIG,
                payload: [],
            });
        }
    };
}

export function getAssetConfig() {
    return async dispatch => {
        try {
            const res = await fetchAPI({
                url: API_GET_ASSET_CONFIG,
                options: {
                    method: 'GET',
                },
            });
            const { status, data } = res;
            if (status === ApiStatus.SUCCESS) {
                dispatch({
                    type: types.SET_ASSET_CONFIG,
                    payload: data,
                });
            }
        } catch (e) {
            dispatch({
                type: types.SET_ASSET_CONFIG,
                payload: [],
            });
        }
    };
}

export async function getMarketWatch(symbol = null) {
    try {
        const opts = {
            url: API_GET_MARKET_WATCH,
            options: {
                method: 'GET',
            },
        };
        if (symbol) {
            opts.params = {
                symbol,
            };
        }
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (e) {
        return [];
    }
}

export async function getUserSymbolList() {
    try {
        const opts = {
            url: API_WATCH_LIST,
            options: {
                method: 'GET',
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (e) {
        return null;
    }
}

export async function postSymbolViews(symbol) {
    try {
        const opts = {
            url: API_METRIC_VIEW,
            options: {
                method: 'POST',
            },
            params: {
                symbol,
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (e) {
        return null;
    }
}

export async function setUserSymbolList(id, assets) {
    try {
        const opts = {
            url: API_WATCH_LIST,
            options: {
                method: 'PUT',
            },
            params: {
                id, assets,
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (e) {
        return null;
    }
}

export async function getOrderBook(symbol) {
    try {
        const res = await fetchAPI({
            url: API_GET_ORDER_BOOK,
            options: {
                method: 'GET',
            },
            params: { symbol },
        });
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (e) {
        return null;
    }
}

export async function getRecentTrade(symbol) {
    try {
        const res = await fetchAPI({
            url: API_GET_RECENT_TRADE,
            options: {
                method: 'GET',
            },
            params: { symbol },
        });
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (e) {
        return null;
    }
}

export async function getCategoryAvatarList() {
    try {
        const opts = {
            url: API_CATEGORY_AVATAR_LIST,
            options: {
                method: 'GET',
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
        return null;
    } catch (e) {
        return null;
    }
}

export async function createCategory({ name = '', assets = '', avatar = null, isDefault = false }) {
    try {
        const opts = {
            url: API_WATCH_LIST,
            options: {
                method: 'POST',
            },
            params: {
                name,
                assets,
                avatar,
                isDefault,
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (error) {
        return null;
    }
}

export async function getCategoryList() {
    try {
        const opts = {
            url: API_WATCH_LIST,
            options: {
                method: 'GET',
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (error) {
        return null;
    }
}

export async function updateCategory({ id = '', assets = [], avatar = '', isDefault = false, name }) {
    try {
        let opts;
        if (name && name.length > 0) {
            opts = {
                url: API_WATCH_LIST,
                options: {
                    method: 'PUT',
                },
                params: {
                    id,
                    assets,
                    avatar,
                    isDefault,
                    name,
                },
            };
        } else {
            opts = {
                url: API_WATCH_LIST,
                options: {
                    method: 'PUT',
                },
                params: {
                    id,
                    assets,
                    avatar,
                    isDefault,
                },
            };
        }
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (error) {
        return null;
    }
}

export async function deleteCategory({ id = '' }) {
    try {
        const opts = {
            url: API_WATCH_LIST,
            options: {
                method: 'DELETE',
            },
            params: {
                id,
            },
        };
        const res = await fetchAPI(opts);
        const { status, data } = res;
        if (status === ApiStatus.SUCCESS) {
            return data;
        }
    } catch (error) {
        return null;
    }
}
