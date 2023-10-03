import React, { useMemo } from 'react';
import useCollateralPrice from './useCollateralPrice';
import { COLLATERAL, LOANABLE } from '../constants';
import { ceilByExactDegit, formatNumber, roundByExactDigit } from 'redux/actions/utils';
import { useTranslation } from 'next-i18next';

const calcCollateralAmount = ({ loanAmount, initLTV, collateralToLoanPrice, digit = 0 }) => loanAmount / initLTV / collateralToLoanPrice;
const calcLoanAmount = ({ collateralAmount, initLTV, collateralToLoanPrice }) => collateralAmount * initLTV * collateralToLoanPrice;

const useLoanInput = ({ collateralInput, loanInput, collateral, loanable, typingField, initialLTV, collateralAvailable, refetch }) => {
    const { data: collateralPrice } = useCollateralPrice({ collateralAssetCode: collateral?.assetCode, loanableAssetCode: loanable?.assetCode, refetch });
    const { t } = useTranslation();
    const isTypingLoanField = typingField === LOANABLE;

    const loanAmount = calcLoanAmount({
        collateralAmount: parseFloat(collateralInput),
        collateralToLoanPrice: parseFloat(collateralPrice),
        initLTV: parseFloat(initialLTV)
    });

    const collateralAmount = calcCollateralAmount({
        loanAmount: parseFloat(loanInput),
        collateralToLoanPrice: parseFloat(collateralPrice),
        initLTV: parseFloat(initialLTV),
        digit: collateral?.assetDigit
    });

    const minCollateralAmount =
        ceilByExactDegit(
            calcCollateralAmount({
                loanAmount: parseFloat(loanable?.config?.minLimit || 0),
                collateralToLoanPrice: parseFloat(collateralPrice),
                initLTV: parseFloat(initialLTV)
            }),
            collateral?.assetDigit
        ) || 0;

    const loanValue = isTypingLoanField ? loanInput : roundByExactDigit(loanAmount, 0) || '';

    const collateralValue = isTypingLoanField ? ceilByExactDegit(collateralAmount, collateral?.assetDigit) || '' : collateralInput;

    const validator = useMemo(
        () => ({
            [LOANABLE]: () => {
                let isValid = true,
                    msg = '',
                    isError = false;
                if (loanValue < +loanable?.config?.minLimit) {
                    return {
                        isValid: false,
                        isError: true,
                        msg: `Số lượng muốn vay phải lớn hơn ${formatNumber(loanable?.config?.minLimit, loanable?.assetDigit)} `
                    };
                }
                if (loanValue > +loanable?.config?.maxLimit) {
                    return {
                        isValid: false,
                        isError: true,
                        msg: `Số lượng muốn vay phải bé hơn ${formatNumber(loanable?.config?.maxLimit, loanable?.assetDigit)} `
                    };
                }

                return {
                    isValid,
                    msg,
                    isError
                };
            },
            [COLLATERAL]: () => {
                let isValid = true,
                    msg = '',
                    isError = false;

                if (+collateralValue > collateralAvailable) {
                    return {
                        isValid: false,
                        isError: true,
                        msg: t('lending:lending.modal.input_description.insufficient_balance')
                    };
                }

                if (+collateralValue < minCollateralAmount) {
                    return {
                        isValid: false,
                        isError: true,
                        msg: `Số lượng muốn thế chấp phải lớn hơn ${formatNumber(minCollateralAmount, collateral?.assetDigit)}`
                    };
                }
                if (+collateralValue > +collateral?.config?.maxLimit) {
                    return {
                        isValid: false,
                        isError: true,
                        msg: `Số lượng muốn thế chấp phải bé hơn ${formatNumber(collateral?.config?.maxLimit, collateral?.assetDigit)} `
                    };
                }

                return {
                    isValid,
                    msg,
                    isError
                };
            }
        }),
        [loanable, collateral, collateralValue, loanValue, minCollateralAmount, isTypingLoanField, collateralAvailable]
    );

    return {
        collateralPrice,
        loanValue,
        collateralValue,
        validator,
        minCollateralAmount
    };
};

export default useLoanInput;
