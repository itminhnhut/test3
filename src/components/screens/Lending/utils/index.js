// ** Context
import { formatNumber } from 'redux/actions/utils';
import { getAssetConfig } from 'components/screens/Lending/context';

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

export { totalAsset, getCurrentLTV, getReceiveCollateral };
