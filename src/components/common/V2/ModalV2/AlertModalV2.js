import React from 'react';
import ModalV2 from 'components/common/V2/ModalV2';
import Button from 'components/common/V2/ButtonV2/Button';
import TextButton from 'components/common/V2/ButtonV2/TextButton';
import { useTranslation } from 'next-i18next';

const AlertModalV2 = ({
    isVisible,
    onClose,
    type = 'success',
    title = '',
    message = '',
    children,
    textButton = '',
    customButton,
    onConfirm,
    notes,
    loading = false,
    buttonClassName = ''
}) => {
    const { t } = useTranslation();
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <SuccessIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'error':
                return <ErroIcon />;
            default:
                <SuccessIcon />;
        }
    };

    const onOpenChat = () => {
        window.fcWidget.open({ name: 'Inbox', replyText: '' });
    };

    return (
        <ModalV2 loading={loading} className="!max-w-[488px]" isVisible={isVisible} onBackdropCb={onClose}>
            <div className="flex flex-col items-center">
                {getIcon()}
                <div className="mt-6 mb-4 font-semibold text-2xl text-txtPrimary dark:text-gray-4">{title}</div>
                {message && <span className="text-gray-1 dark:text-gray-7 text-center">{message}</span>}
                {children}
                {notes && <span className="mt-2 dark:text-gray-1 text-center text-xs">{notes}</span>}
                <div className="mt-10 space-y-3 w-full">
                    {!customButton && textButton && (
                        <Button className={buttonClassName} onClick={onConfirm}>
                            <span>{textButton}</span>
                            {loading && <CircleSpinner />}
                        </Button>
                    )}
                    {customButton && customButton}
                    {type === 'error' && (
                        <TextButton className={buttonClassName} onClick={onOpenChat}>
                            {t('common:chat_with_support')}
                        </TextButton>
                    )}
                </div>
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

const ErroIcon = () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M40 6.667C21.567 6.667 6.666 21.567 6.666 40S21.566 73.333 40 73.333c18.433 0 33.333-14.9 33.333-33.333S58.433 6.666 40 6.666zm16.666 45.3-4.7 4.7L40 44.7 28.033 56.666l-4.7-4.7L35.3 40 23.333 28.033l4.7-4.7L40 35.3l11.967-11.967 4.7 4.7L44.7 40l11.966 11.967z"
            fill="#F93636"
        />
    </svg>
);

const CircleSpinner = ({ width = 6, height = 6, color = 'white', className = '' }) => (
    <div role="status">
        <svg
            aria-hidden="true"
            className={`ml-2 w-${width} h-${height} text-gray-200 animate-spin dark:text-gray-600 ${color} ${className}`}
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#0000004d"
            ></path>
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="white"
            ></path>
        </svg>
    </div>
);
