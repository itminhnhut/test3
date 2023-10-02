// ** Context
import { formatNumber } from 'redux/actions/utils';
import { getAssetConfig } from 'components/screens/Lending/Context';

const totalAsset2 = (total, asset, assetConfig) => {
    if (!total || !asset) return;

    const symbol = assetConfig?.find((f) => f?.assetCode === asset) || {};
    const rsTotal = formatNumber(total || 0, symbol?.assetDigit, 0, true);

    return { total: rsTotal, symbol: symbol };
};

// ** Context

const totalAsset = (total, asset) => {
    if (!total || !asset) return;

    const { assetConfig } = getAssetConfig();

    const symbol = assetConfig.find((f) => f.assetCode === asset) || {};
    const rsTotal = formatNumber(total || 0, symbol?.assetDigit, 0, true);

    return { total: rsTotal, symbol: symbol };
};

export { totalAsset, totalAsset2 };
