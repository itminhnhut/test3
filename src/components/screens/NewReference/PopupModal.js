import { PORTAL_MODAL_ID } from '../../../constants/constants';
import { X } from 'react-feather';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import Portal from 'components/hoc/Portal';
import hexRgb from 'utils/hexRgb';
import colors from '../../../styles/colors';
import { useOutside } from "components/screens/Nao/NaoStyle";
import { Line } from '.';
import React from 'react';

const PopupModal = ({
    isVisible,
    title,
    children = null,
    containerClassName = '',
    useCross = false,
    onBackdropCb,
    onClose,
    containerStyle,
    contentClassname = '',
    modalClassName = '',
    center = false,
    isAlertModal,
    useFullScreen = false
}) => {

    const wrapperRef = useRef(null);
    const container = useRef(null);

    const handleOutside = () => {
        if (onBackdropCb && center && !isAlertModal) onBackdropCb()
    }

    useOutside(wrapperRef, handleOutside, container);

    useEffect(() => {
        const hidding = document.body.classList.contains('overflow-hidden');
        if (hidding) return;
        if (isVisible) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            if (!hidding) document.body.classList.remove("overflow-hidden");
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
                ref={container}
            >
                <div
                    onClick={() => onBackdropCb && onBackdropCb()}
                    style={{
                        backgroundColor: hexRgb(colors.darkBlue, {
                            alpha: 0.7,
                            format: 'rgba',
                        }),
                    }}
                    className={classNames(
                        'absolute z-[9999999] top-0 left-0 w-full h-full transition-opacity duration-200',
                        { 'visible opacity-100': isVisible },
                        { 'invisible opacity-0': !isVisible },
                    )}
                />
                <div style={{ ...containerStyle }}
                    className={classNames(
                        `fixed min-w-[280px] min-h-[100px] z-[99999999] rounded-lg dark:drop-shadow-dark bg-[transparent] left-0 top-0 w-full h-full p-0`,
                        containerClassName,
                    )}
                >
                    <div className={`justify-end h-full flex flex-col relative`}>
                        <div className="flex-1" onClick={() => onBackdropCb && onBackdropCb()}></div>
                        <div ref={wrapperRef} className={classNames(`${contentClassname} rounded-t-xl h-max w-full relative bg-white px-4 pt-9 pb-[3.25rem] max-h-[100%] overflow-y-auto`, { 'h-full !rounded-none': useFullScreen })} >
                            {useFullScreen ? null : <div style={{ transform: 'translate(-50%,0)' }}
                                className="h-[4px] w-[48px] rounded-[100px] opacity-[0.16] bg-gray-1  absolute top-2 left-1/2 ">
                            </div>}
                            <div className='w-full flex justify-between items-center'>
                                <div className={classNames('font-bold text-[18px] text-darkBlue', { 'text-[20px] px-4 max-h-screen': useFullScreen })}>
                                    {title}
                                </div>
                                <div className='absolute top-0 right-0'>
                                    <div
                                        className='w-24 h-24 flex-center hover:bg-gray-3 dark:hover:bg-darkBlue-4 rounded-md cursor-pointer'
                                        onClick={() => onBackdropCb && onBackdropCb()}
                                    >
                                        <X color='#718096' />
                                    </div>
                                </div>
                            </div>
                            {useFullScreen ? <div className='h-6'></div> : <Line className='mt-3 mb-6' />}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    )
}


export const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.667 2.667H3.333C2.597 2.667 2 3.263 2 4v9.333c0 .737.597 1.333 1.333 1.333h9.334c.736 0 1.333-.596 1.333-1.333V4c0-.737-.597-1.333-1.333-1.333zM10.667 1.333V4M5.333 1.333V4M2 6.667h12" stroke="#718096" stroke-linecap="round" stroke-linejoin="round" />
</svg>

export const CopyIcon = ({ size = 12, color = '#B2B7BC', className = '', onClick }) => {
    return (
        <svg onClick={onClick} className={className} width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.222 5.444h-8c-.982 0-1.778.796-1.778 1.778v8c0 .982.796 1.778 1.778 1.778h8c.982 0 1.778-.796 1.778-1.778v-8c0-.982-.796-1.778-1.778-1.778z" stroke="#718096" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3.667 12.556h-.89A1.778 1.778 0 0 1 1 10.778v-8A1.778 1.778 0 0 1 2.778 1h8a1.778 1.778 0 0 1 1.778 1.778v.889" stroke="#718096" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export const copy = (text, cb) => {
    if (navigator.clipboard && navigator.permissions) {
        navigator.clipboard.writeText(text).then(cb)
    } else if (document.queryCommandSupported('copy')) {
        const ele = document.createElement('textarea')
        ele.value = text
        document.body.appendChild(ele)
        ele.select()
        document.execCommand('copy')
        document.body.removeChild(ele)
        cb?.()
    }
}

export const renderRefInfo = (text, className = '', size = 15) => {
    return (
        <div className={classNames('w-full h-11 px-3 rounded-[3px] flex justify-between items-center bg-[#f5f6f7]', className)}>
            <div className='font-medium text-sm text-darkBlue w-3/4 truncate'>
                {text}
            </div>
            <div>
                <CopyIcon
                    onClick={() => {
                        copy(text)
                    }}
                    size={size}
                    className="cursor-pointer"
                />
            </div>
        </div>
    )
}
export default PopupModal
