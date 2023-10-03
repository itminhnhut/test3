import React from 'react';
import { API_HISTORY_LOAN } from 'redux/actions/apis';
import FetchApi from 'utils/fetch-api';

const useRepayLoan = ({ type, amount, loanId }) => {
    const repayLoan = async () => {
        return await FetchApi({
            url: `${API_HISTORY_LOAN}/${loanId}`,
            options: {
                method: 'PUT'
            },
            params: {
                type: type?.toUpperCase(),
                amount
            }
        });
    };

    return repayLoan;
};

export default useRepayLoan;
