import useFetchPriceCounter from 'components/screens/Lending/hooks/useFetchPriceCounter';
import ButtonV2 from 'components/screens/Nao/Components/ButtonV2/Button';
import React from 'react';

const ConfirmLoanButton = ({ loading, onRepayHandler, handleRefetch, loadingPrice }) => {
    const { resetCountdown, status, countdown } = useFetchPriceCounter({ loadingPrice });

    const handleClick = () => {
        if (status === 'finished') {
            handleRefetch();
            resetCountdown();
            return;
        }
        onRepayHandler();
    };

    return (
        <ButtonV2 loading={loading || loadingPrice} disabled={loadingPrice} onClick={handleClick} className="mt-10">
            {status === 'finished' ? 'Làm mới' : <>Xác nhận ({countdown}s)</>}
        </ButtonV2>
    );
};

export default ConfirmLoanButton;
