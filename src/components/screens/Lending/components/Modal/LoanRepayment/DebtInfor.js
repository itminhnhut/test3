import React from 'react';
import { formatNumber } from 'redux/actions/utils';

const DebtInfor = ({
    isLoanRepay,
    repayAmount,
    totalDebt,
    totalDebtLeft,
    loanCoinConfig,
    collateralCoinConfig,
    collateralPriceToLoanCoin,
    collateralAmountReceive
}) => {
    const loanCoin = loanCoinConfig?.assetCode;
    const collateralCoin = collateralCoinConfig?.assetCode;
    const loanCoinDigit = loanCoinConfig?.assetDigit || 0;
    const collateralCoinDigit = collateralCoinConfig?.assetDigit || 0;

    // lay digit = 4 chu so thap phan neu totalDebtLeft < 1.
    const totalDebtLeftDigit = totalDebtLeft < 1 ? 4 : loanCoinDigit;

    return (
        <section className="flex flex-col space-y-3">
            <section className="flex flex-row justify-between ">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">Tổng dư nợ</div>
                <div className="font-semibold">
                    {formatNumber(totalDebt, loanCoinDigit)} {loanCoin}
                </div>
            </section>
            <section className="flex flex-row justify-between ">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">Dư nợ còn lại</div>
                <div className="font-semibold">
                    {formatNumber(totalDebtLeft, totalDebtLeftDigit) || 0} {loanCoin}
                </div>
            </section>
            {!isLoanRepay && (
                <section className="flex flex-row justify-between ">
                    <div className="text-txtSecondary dark:text-txtSecondary-dark">Tỉ giá</div>
                    <div className="text-right font-semibold">
                        1 {collateralCoin} ≈ {formatNumber(collateralPriceToLoanCoin, loanCoinDigit)} {loanCoin}
                    </div>
                </section>
            )}

            <section className="flex flex-row justify-between ">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">Kí quỹ nhận lại ước tính</div>
                <div className="font-semibold">
                    {formatNumber(collateralAmountReceive, collateralCoinDigit)} {collateralCoin}
                </div>
            </section>
            <section className="flex flex-row justify-between ">
                <div className="text-txtSecondary dark:text-txtSecondary-dark">Số lượng cần trả</div>
                <div className="font-semibold">
                    {formatNumber(repayAmount || 0, isLoanRepay ? loanCoinDigit : collateralCoinDigit)} {isLoanRepay ? loanCoin : collateralCoin}
                </div>
            </section>
        </section>
    );
};

export default DebtInfor;
