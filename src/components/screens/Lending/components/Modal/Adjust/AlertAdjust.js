import { useContext } from 'react';

// ** Next
import { useTranslation } from 'next-i18next';

// ** Components
import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';

// ** Context
import { LendingContext } from 'components/screens/Lending/context';
import { globalActionTypes as actions } from 'components/screens/Lending/context/actions';

const ERRORS = {
    ORDER_IS_ACCRUING_INTEREST: {
        message: { vi: 'Đơn hàng đang tích lũy tiền lãi', en: 'Order is accruing interest' }
    },
    UNSUPPORTED_ASSET_PAIR: {
        message: { vi: 'Chúng tôi không hỗ trợ cặp tiền cho vay và tiền thế chấp này', en: 'We do not support this loan coin and collateral coin pair' }
    }
};

const AlertAdjust = () => {
    const {
        t,
        i18n: { language }
    } = useTranslation();

    // ** useContext
    const { state, dispatchReducer } = useContext(LendingContext);

    const isModal = state.modal;

    const handleConfirm = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_RESET });
        dispatchReducer({ type: actions.RESET_AMOUNT });
    };

    const handleCloseCancel = () => {
        dispatchReducer({ type: actions.TOGGLE_MODAL_CANCEL, modal: { isCancel: false, isAdjust: true } });
    };

    const handleClose = () => {
        dispatchReducer({ type: actions.RESET });
        dispatchReducer({ type: actions.REFETCH });
    };

    const renderModal = () => {
        if (isModal.isCancel) {
            return (
                <AlertModalV2
                    onConfirm={() => handleConfirm()}
                    textButton="Huỷ"
                    title="Huỷ bỏ trả khoản vay"
                    message="Khi bạn xác nhận huỷ, tất cả thông tin trả khoản vay sẽ được huỷ bỏ."
                    isVisible={isModal.isCancel}
                    onClose={() => handleCloseCancel()}
                    type="warning"
                />
            );
        }
        if (isModal?.isError) {
            return (
                <AlertModalV2
                    title="Lổi"
                    message={ERRORS?.[state.error?.code]?.message?.[language]}
                    isVisible={isModal.isError}
                    onClose={() => handleClose()}
                    type="error"
                />
            );
        }
    };

    return <>{renderModal()}</>;
};

export default AlertAdjust;
