import useFetchPriceCounter from 'components/screens/Lending/hooks/useFetchPriceCounter';
import ButtonV2 from 'components/screens/Nao/Components/ButtonV2/Button';
import React from 'react';

const RegisterLoanButton = ({ loading, loadingPrice, handlerRegisterLoan, handleRefetch }) => {
    const countdown = useFetchPriceCounter({ handleRefetch, loadingPrice });

    return (
        <ButtonV2 onClick={handlerRegisterLoan} loading={loading || loadingPrice} disabled={loadingPrice} className="mt-10">
            Xác nhận ({countdown}s)
        </ButtonV2>
    );
};

export default RegisterLoanButton;
