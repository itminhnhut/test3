import { createSelector } from 'reselect';

export const getPairConfig = createSelector([(state) => state.futures?.pairConfigs, (pairConfigs, pair) => pair], (pairConfigs, pair) => {
    return pairConfigs?.find((rs) => rs.pair === pair);
});

export const getPairConfigSpot = createSelector([(state) => state.utils.exchangeConfig, (exchangeConfig, symbol) => symbol], (exchangeConfig, symbol) => {
    return exchangeConfig?.find((rs) => rs.symbol === symbol);
});

export const getAssetConfig = createSelector([(state) => state.utils?.assetConfig, (assetConfig, id) => id], (assetConfig, id) => {
    return assetConfig?.find((rs) => rs.id === id);
});

export const getMarketWatch = createSelector([(state) => state.futures?.marketWatch, (marketWatch, symbol) => symbol], (marketWatch, symbol) => {
    return marketWatch?.[symbol];
});
