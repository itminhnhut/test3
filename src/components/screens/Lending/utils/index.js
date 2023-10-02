// ** Context
import { getAssetConfig } from 'components/screens/Lending/Context';
import { formatNumber } from 'redux/actions/utils';

const totalAsset = (total, asset) => {
    if (!total || !asset) return;

    const { assetConfig } = getAssetConfig();

    const symbol = assetConfig.find((f) => f.assetCode === asset) || {};
    const rsTotal = formatNumber(total || 0, symbol?.assetDigit, 0, true);

    return { total: rsTotal, symbol: symbol };
};

export { totalAsset };
