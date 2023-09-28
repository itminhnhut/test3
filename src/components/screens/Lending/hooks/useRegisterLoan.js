import React from 'react';
import { API_HISTORY_LOAN } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';
import { LOANABLE } from '../constants';

const useRegisterLoan = ({ loanCoin, collateralCoin, loanValue, collateralValue, loanTerm, typingField }) => {
    const registerLoan = async () => {
        const amount =
            typingField === LOANABLE
                ? {
                      loanAmount: loanValue
                  }
                : {
                      collateralAmount: collateralValue
                  };
        const registerResponse = await FetchApi({
            url: API_HISTORY_LOAN,
            options: {
                method: 'POST'
            },
            params: {
                loanCoin,
                collateralCoin,
                loanTerm,
                ...amount
            }
        });
        return registerResponse;
    };
    return { registerLoan };
};

export default useRegisterLoan;
