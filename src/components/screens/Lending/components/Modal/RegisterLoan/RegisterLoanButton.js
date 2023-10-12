import useFetchPriceCounter from 'components/screens/Lending/hooks/useFetchPriceCounter';
import ButtonV2 from 'components/screens/Nao/Components/ButtonV2/Button';
import React from 'react';

const RegisterLoanButton = ({ loading, loadingPrice, handlerRegisterLoan, handleRefetch }) => {
    const { resetCountdown, status, countdown } = useFetchPriceCounter({ loadingPrice });

    const handleClick = () => {
        if (status === 'finished') {
            handleRefetch();
            resetCountdown();
            return;
        }
        handlerRegisterLoan();
    };

    return (
        <ButtonV2 onClick={handleClick} loading={loading || loadingPrice} disabled={loadingPrice} className="mt-10">
            {status === 'finished' ? 'Làm mới' : <>Xác nhận ({countdown}s)</>}
        </ButtonV2>
    );
};

export default RegisterLoanButton;
