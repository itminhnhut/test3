import { PORTAL_MODAL_ID } from '../../../constants/constants';
import { X } from 'react-feather';

import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import Portal from 'components/hoc/Portal';
import hexRgb from 'utils/hexRgb';
import colors from '../../../styles/colors';

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
}) => {

    const timer = useRef(null)

    useEffect(() => {
        if (isVisible) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        }
    }, [isVisible]);

    return (
        <Portal portalId={PORTAL_MODAL_ID}>
            <div
                className={classNames(
                    'absolute top-0 left-0 w-full h-full overflow-hidden',
                    { invisible: !isVisible },
                    { visible: isVisible },
                    modalClassName
                )}
            >
                <div
                    onClick={() => onBackdropCb && onBackdropCb()}
                    style={{
                        backgroundColor: hexRgb(colors.darkBlue2, {
                            alpha: 0.7,
                            format: 'rgba',
                        }),
                    }}
                    className={classNames(
                        'absolute z-[9999999] top-0 left-0 w-full h-full transition-opacity duration-200',
                        { 'visible opacity-100': isVisible },
                        { 'invisible opacity-0': !isVisible },
                        { '!bg-onus-bgModal2/[0.7]': onusMode },
                    )}
                />
                <div style={{ ...containerStyle }}
                    className={classNames(
                        `fixed min-w-[280px] min-h-[100px] p-4 z-[99999999] rounded-lg dark:drop-shadow-dark`,
                        { 'bg-bgPrimary dark:bg-darkBlue-2 dark:border dark:border-teal-opacity top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 ': !onusMode },
                        { 'bg-onus-bgModal bg-[transparent] left-0 top-0 w-full h-full p-0': onusMode },
                        containerClassName,

                    )}
                >
                    <div className='relative'>
                        {useCross && (
                            <div className='absolute top-0 right-0'>
                                <div
                                    className='w-24 h-24 flex-center hover:bg-gray-3 dark:hover:bg-darkBlue-4 rounded-md cursor-pointer'
                                    onClick={() => onClose && onClose()}
                                >
                                    <X />
                                </div>
                            </div>
                        )}
                    </div>
                    {title && (
                        <div className='my-2 text-center font-bold text-[18px]'>
                            {title}
                        </div>
                    )}
                    {onusMode ?
                        <div className="h-full flex flex-col justify-between relative">
                            <div className="flex-1" onClick={() => onBackdropCb && onBackdropCb()}></div>
                            <div className={`${onusClassName} h-max w-full relative bg-onus-bgModal rounded-t-[16px] px-4 pt-11 pb-[3.25rem] max-h-[90%] overflow-y-auto`}>
                                <div
                                    style={{ transform: 'translate(-50%,0)' }}
                                    className="h-[4px] w-[48px] rounded-[100px] opacity-[0.16] bg-onus-white  absolute top-2 left-1/2 "></div>
                                {children}
                            </div>
                        </div>
                        :
                        children
                    }
                </div>
            </div>
        </Portal>
    )
}

export default Modal
