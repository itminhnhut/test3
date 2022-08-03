import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, memo } from 'react';
import Modal from 'components/common/ReModal';
import Button from 'components/common/Button';
import { useTranslation } from 'next-i18next';
import { getS3Url } from 'redux/actions/utils';
import { ButtonNao } from 'components/screens/Nao/NaoStyle';

const AlertNaoV2Modal = memo(forwardRef((props, ref) => {
    const { t } = useTranslation();
    const [isVisible, setVisible] = useState(false);
    const [height, setHeight] = useState(362 / 2);

    const options = useRef({
        type: '',
        title: '',
        messages: '',
        note: '',
    })
    const actions = useRef({
        onConfirm: null, onCancel: null,
    })

    useImperativeHandle(ref, () => ({
        show: onShow
    }))

    const onShow = (type, title, messages, note, onConfirm, onCancel, _options) => {
        options.current = { type, title, messages, note, ..._options };
        actions.current.onConfirm = onConfirm;
        actions.current.onCancel = onCancel;
        setVisible(true);
    }

    const onConfirm = () => {
        if (actions.current.onConfirm) actions.current.onConfirm();
        options.current = {}
        setVisible(false);
    }

    const onCancel = () => {
        options.current = {}
        if (actions.current.onCancel) actions.current.onCancel();
        setVisible(false);
    }

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <SuccessIcon />;
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />
            default:
                return <SuccessIcon />;
        }
    }

    useEffect(() => {
        setTimeout(() => {
            const el = document.querySelector('.alert-modal-mobile');
            if (el) {
                setHeight(el.clientHeight / 2)
            }
        }, 50);
    }, [isVisible])

    if (!options.current.title) return null;
    return (
        <Modal onusMode={true} isVisible={true} onBackdropCb={onCancel}
            modalClassName="z-[99999999999]"
            onusClassName="min-h-[304px] rounded-t-[16px] !bg-nao-tooltip pb-[3.75rem] !px-6"
            containerClassName="!bg-nao-bgModal2/[0.9]"
        >
            <div className="flex flex-col items-center justify-between h-full">
                <div className='mb-6'>
                    {getIcon(options.current.type)}
                </div>
                <div className='text-2xl font-semibold leading-8 mb-6'>
                    {options.current.title}
                </div>
                {options.current.messages &&
                    <div className='mb-6 text-center text-sm' dangerouslySetInnerHTML={{__html: options.current.messages}}>
                        {/* {options.current.messages} */}
                    </div>
                }
                {/* <div className='text-gray-1 mb-[30px] text-center'>
                    {options.current.note}
                </div> */}
                <div className='flex items-center w-full space-x-4'>
                    {!options.current?.hideCloseButton
                        && <ButtonNao onClick={onCancel} border className="w-full !rounded-md">{options.current.closeTitle || t('common:close')}</ButtonNao>
                    }
                    {actions.current?.onConfirm &&
                        <ButtonNao onClick={onConfirm} className="w-full !rounded-md">
                            {options.current?.confirmTitle || t('futures:leverage:confirm')}
                        </ButtonNao>
                    }
                </div>
            </div>
        </Modal>
    );
}));


const SuccessIcon = () => {
    return (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M57 26L37.1667 52L23 41.0526" stroke="#49E8D5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M77 40C77 60.4345 60.4345 77 40 77C19.5655 77 3 60.4345 3 40C3 19.5655 19.5655 3 40 3C60.4345 3 77 19.5655 77 40Z" stroke="#49E8D5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export const WarningIcon = ({ size = 80 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M40 0C62.056 0 80 17.944 80 40C80 62.056 62.056 80 40 80C17.944 80 0 62.056 0 40C0 17.944 17.944 0 40 0ZM40 6C21.252 6 6 21.252 6 40C6 58.748 21.252 74 40 74C58.748 74 74 58.748 74 40C74 21.252 58.748 6 40 6ZM40.0156 51.1836C42.2276 51.1836 44.0156 52.9716 44.0156 55.1836C44.0156 57.3956 42.2276 59.1836 40.0156 59.1836C37.8036 59.1836 35.9956 57.3956 35.9956 55.1836C35.9956 52.9716 37.7676 51.1836 39.9756 51.1836H40.0156ZM39.9764 21.816C41.6324 21.816 42.9764 23.16 42.9764 24.816V42.492C42.9764 44.148 41.6324 45.492 39.9764 45.492C38.3204 45.492 36.9764 44.148 36.9764 42.492V24.816C36.9764 23.16 38.3204 21.816 39.9764 21.816Z" fill="#FF9F1A" />
        </svg>
    )
}

export const ErrorIcon = () => {
    return (
        <svg width="89" height="80" viewBox="0 0 89 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M44.0515 0C48.5385 0 52.5548 2.32706 54.7807 6.22457L86.3918 61.4935C88.6045 65.3602 88.5913 69.9747 86.3522 73.8326C84.1131 77.6949 80.1144 80 75.6582 80H12.3876C7.92703 80 3.92835 77.6949 1.68927 73.8326C-0.549815 69.9747 -0.563012 65.3602 1.64968 61.4935L33.3224 6.21577C35.5483 2.32267 39.5558 0 44.0471 0H44.0515ZM44.0471 6.59848C41.9532 6.59848 40.088 7.68063 39.0411 9.49741L7.37716 64.7707C6.3478 66.5743 6.3566 68.7254 7.39916 70.5246C8.44172 72.3238 10.3069 73.4015 12.3876 73.4015H75.6582C77.7346 73.4015 79.5997 72.3238 80.6423 70.5246C81.6893 68.7254 81.6981 66.5743 80.6599 64.7707L49.0532 9.49741C48.0106 7.68063 46.1454 6.59848 44.0471 6.59848ZM44.0172 54.9829C46.4499 54.9829 48.4162 56.9493 48.4162 59.3819C48.4162 61.8146 46.4499 63.7809 44.0172 63.7809C41.5846 63.7809 39.5962 61.8146 39.5962 59.3819C39.5962 56.9493 41.545 54.9829 43.9732 54.9829H44.0172ZM44.0084 28.875C45.8296 28.875 47.3077 30.353 47.3077 32.1742V45.8111C47.3077 47.6322 45.8296 49.1103 44.0084 49.1103C42.1872 49.1103 40.7092 47.6322 40.7092 45.8111V32.1742C40.7092 30.353 42.1872 28.875 44.0084 28.875Z" fill="#DC1F4E" />
        </svg>
    )
}

export default AlertNaoV2Modal;
