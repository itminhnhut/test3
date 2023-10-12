import React from 'react';
import DebtInfor from './DebtInfor';
import LoanToValueInfor from './LoanToValueInfor';

const RepaymentInformation = ({
    collateralAmountReceive,
    isLoanRepay,
    totalDebtLeft,
    loanCoinConfig,
    collateralCoinConfig,
    collateralPriceToLoanCoin,
    repayAmount,
    adjustLTV,
    totalDebt,
    initialLTV
}) => {
    const debtInforProps = {
        isLoanRepay,
        repayAmount,
        totalDebt,
        totalDebtLeft,
        loanCoinConfig,
        collateralCoinConfig,
        collateralPriceToLoanCoin,
        collateralAmountReceive
    };

    const loanToValueProps = {
        initialLTV,
        adjustLTV
    };

    return (
        <div>
            <div className="font-semibold mb-6">Thông tin dư nợ và ký quỹ</div>
            <DebtInfor {...debtInforProps} />
            <div className="font-semibold mt-8 mb-6">Thông tin LTV</div>
            <LoanToValueInfor {...loanToValueProps} />
        </div>
    );
};

export default RepaymentInformation;
