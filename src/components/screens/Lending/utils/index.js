// ** Context
import { ceilByExactDegit, formatNumber } from 'redux/actions/utils';
import { getAssetConfig } from 'components/screens/Lending/Context';

const PERCENT_DECIMAL = 4;

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

// K dung cai nay cho % LTV
const formatPercent = (percent) => ceilByExactDegit(percent, PERCENT_DECIMAL);

export { totalAsset, getCurrentLTV, getReceiveCollateral, formatPercent };
