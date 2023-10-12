import useFetchPriceCounter from 'components/screens/Lending/hooks/useFetchPriceCounter';
import ButtonV2 from 'components/screens/Nao/Components/ButtonV2/Button';
import React from 'react';

const RegisterLoanButton = ({ loading, loadingPrice, handlerRegisterLoan, handleRefetch }) => {
    const [countdown, resetCountdown] = useFetchPriceCounter({ loadingPrice });

    const handleClick = () => {
        if (countdown === null) {
            handleRefetch();
            resetCountdown()
            return;
        }
        handlerRegisterLoan();
    };

    return (
        <ButtonV2 onClick={handleClick} loading={loading || loadingPrice} disabled={loadingPrice} className="mt-10">
            {countdown === null ? 'Làm mới' : <>Xác nhận ({countdown}s)</>}
        </ButtonV2>
    );
};

export default RegisterLoanButton;
