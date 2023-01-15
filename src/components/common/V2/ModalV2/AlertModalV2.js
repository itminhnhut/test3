import React from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import Button from 'components/common/V2/ButtonV2/Button';

const AlertModalV2 = ({ isVisible, onClose, type = 'success', title = '', message = '', textButton = '', customButton, onConfirm }) => {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <SuccessIcon />;
            case 'warning':
                return <WarningIcon />;
            default:
                <SuccessIcon />;
        }
    };

    return (
        <ModalV2 className="!max-w-[488px]" isVisible={isVisible} onBackdropCb={onClose}>
            <div className="mt-6 flex flex-col items-center">
                {getIcon()}
                <div className="mt-6 font-medium text-xl">{title}</div>
                <span className="mt-4 text-txtSecondary-dark text-center">{message}</span>
                {!customButton && textButton && (
                    <Button onClick={onConfirm} className="mt-10">
                        {textButton}
                    </Button>
                )}
                {customButton && customButton}
            </div>
        </ModalV2>
    );
};

export default AlertModalV2;

const WarningIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M42.947 8.44c-1.154-2.18-4.74-2.18-5.894 0l-30 56.667A3.333 3.333 0 0 0 10 70h60c1.17 0 2.253-.613 2.853-1.613a3.32 3.32 0 0 0 .09-3.277L42.947 8.44zM43.333 60h-6.666v-6.667h6.666V60zm-6.666-13.333V30h6.666l.004 16.667h-6.67z"
            fill="#FFC632"
        />
    </svg>
);

const SuccessIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M40 6.667C21.6 6.667 6.666 21.6 6.666 40S21.6 73.333 40 73.333C58.4 73.333 73.333 58.4 73.333 40S58.4 6.667 40 6.667zm-6.667 50L16.667 40l4.7-4.7 11.966 11.933 25.3-25.3 4.7 4.734-30 30z"
            fill="#47CC85"
        />
    </svg>
);
