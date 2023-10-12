import { PORTAL_MODAL_ID } from '../../../constants/constants';
import { X } from 'react-feather';

import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import Portal from 'components/hoc/Portal';
import hexRgb from 'utils/hexRgb';
import colors from '../../../styles/colors';
import { useOutside } from 'components/screens/Nao/NaoStyle';

const Modal = ({
    isVisible,
    title,
    children = null,
    containerClassName = '',
    useCross = false,
    onBackdropCb,
    onClose,
    onusMode = false,
    containerStyle,
    onusClassName = '',
    modalClassName = '',
    center = false,
    isAlertModal
}) => {
    const timer = useRef(null);
    const wrapperRef = useRef(null);
    const container = useRef(null);

    const handleOutside = () => {
        if (onBackdropCb && center && !isAlertModal) onBackdropCb();
    };

    useOutside(wrapperRef, handleOutside, container);

    useEffect(() => {
        const hidding = document.body.classList.contains('overflow-hidden');
        if (hidding) return;
        if (isVisible) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
        return () => {
            if (!hidding) document.body.classList.remove('overflow-hidden');
        };
    }, [isVisible]);

    return (
        <Portal portalId={PORTAL_MODAL_ID}>
            <div
                className={classNames('absolute top-0 left-0 w-full h-full overflow-hidden', { invisible: !isVisible }, { visible: isVisible }, modalClassName)}
                ref={container}
            >
                <div
                    onClick={() => onBackdropCb && onBackdropCb()}
                    style={{
                        backgroundColor: hexRgb(colors.darkBlue2, {
                            alpha: 0.7,
                            format: 'rgba'
                        })
                    }}
                    className={classNames(
                        'absolute z-[9999999] top-0 left-0 w-full h-full transition-opacity duration-200',
                        { 'visible opacity-100': isVisible },
                        { 'invisible opacity-0': !isVisible },
                        { '!bg-black-800/[0.6] dark:!bg-black-800/[0.8]': onusMode }
                    )}
                />
                <div
                    style={{ ...containerStyle }}
                    className={classNames(
                        `fixed min-w-[280px] min-h-[100px] p-4 z-[99999999] rounded-lg dark:drop-shadow-dark`,
                        {
                            'bg-bgPrimary dark:bg-darkBlue-2 dark:border dark:border-teal-opacity top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 ':
                                !onusMode
                        },
                        { 'bg-black-800/[0.6] dark:bg-black-800/[0.8] left-0 top-0 w-full h-full p-0': onusMode },
                        containerClassName
                    )}
                >
                    {useCross && (
                        <div className="flex flex-row-reverse">
                            <div
                                className=" flex-center dark:hover:bg-darkBlue-4 dark:text-[#e2e8f0] rounded-md cursor-pointer"
                                onClick={() => onClose && onClose()}
                            >
                                <X />
                            </div>
                        </div>
                    )}
                    {title && (
                        <div className="my-6 text-left font-medium font-sfPro leading-7 text-[20px] text-[#1c232e] dark:text-[#e2e8f0] hover:bg-transparent">
                            {title}
                        </div>
                    )}
                    {onusMode ? (
                        <div className={`${center ? 'items-center justify-center' : 'justify-end'} h-full flex flex-col relative`}>
                            {!center && <div className="flex-1" onClick={() => onBackdropCb && onBackdropCb()}></div>}
                            <div
                                ref={wrapperRef}
                                className={`${onusClassName} ${
                                    center ? 'rounded-xl' : 'rounded-t-xl'
                                } h-max w-full relative bg-black-800/[0.6] dark:bg-black-800/[0.8] px-4 pt-11 pb-[3.25rem] max-h-[90%] overflow-y-auto`}
                            >
                                {!center && (
                                    <div
                                        style={{ transform: 'translate(-50%,0)' }}
                                        className="h-[4px] w-[48px] rounded-[100px] opacity-[0.16] bg-gray-15 dark:bg-gray-4  absolute top-2 left-1/2 "
                                    ></div>
                                )}
                                {children}
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </Portal>
    );
};

export default Modal;
