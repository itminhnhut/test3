import { createSelector } from 'reselect';
import { fees } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';

const selectExchangeConfig = (state) => state?.utils;

const assetConfigSelector = createSelector(selectExchangeConfig, (state) => {
    return state?.assetConfig;
});

const exchangeConfigSelector = createSelector(selectExchangeConfig, (state) => {
    return state?.exchangeConfig;
});

const getAllAssets = createSelector([(state) => state.utils, (utils, params) => params], (utils, params) => {
    const assets = {};
    return fees.reduce((newItem, item) => {
        const asset = utils.assetConfig.find((rs) => rs.id === item?.assetId);
        if (asset) {
            assets[item?.assetId] = {
                assetCode: asset?.assetCode,
                assetDigit: asset?.assetDigit
            };
        }
        return assets;
    }, {});
});

const UtilsSelector = {
    assetConfigSelector,
    exchangeConfigSelector,
    getAllAssets
};

export default UtilsSelector;
