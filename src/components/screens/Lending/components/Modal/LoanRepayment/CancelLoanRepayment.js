import AlertModalV2 from 'components/common/V2/ModalV2/AlertModalV2';
import React from 'react';

const CancelLoanRepayment = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AlertModalV2
            onConfirm={onConfirm}
            textButton="Huỷ"
            title="Huỷ bỏ trả khoản vay"
            message="Khi bạn xác nhận huỷ, tất cả thông tin trả khoản vay sẽ được huỷ bỏ."
            isVisible={isOpen}
            onClose={onClose}
            type="warning"
        />
    );
};

export default CancelLoanRepayment;
