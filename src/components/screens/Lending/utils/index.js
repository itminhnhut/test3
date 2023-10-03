// ** Context
import { formatNumber } from 'redux/actions/utils';
import { getAssetConfig } from 'components/screens/Lending/Context';

// ** Context
const totalAsset = (total, asset) => {
    if (!total || !asset) return;

    const { assetConfig } = getAssetConfig();

    const symbol = assetConfig.find((f) => f.assetCode === asset) || {};
    const rsTotal = formatNumber(total || 0, symbol?.assetDigit, 0, true);

    return { total: rsTotal, symbol: symbol };
};

const getCurrentLTV = ({ totalDebtLeft, totalCollateralLeft, collateralPrice }) => {
    return totalDebtLeft / (totalCollateralLeft * collateralPrice);
};

const getReceiveCollateral = ({ repayAmount, totalDebt, totalCollateralAmount, marginUsed }) => {
    return ((repayAmount / totalDebt) * totalCollateralAmount - marginUsed) * 0.95;
};

const handleTotalAsset = (data, asset, assetConfig) => {
    const symbol = assetConfig.find((f) => f.assetCode === asset) || {};
    const total = formatNumber(data || 0, symbol?.assetDigit, 0, true);
    return { total: total, symbol: symbol };
};

export { totalAsset, getCurrentLTV, getReceiveCollateral, handleTotalAsset };
