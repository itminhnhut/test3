import { PORTAL_MODAL_ID } from '../../../constants/constants';
import { X } from 'react-feather';
import { Component, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Portal from 'components/hoc/Portal';
import { useOutside } from 'components/screens/Nao/NaoStyle';
import { Line } from './mobile';
import React from 'react';
import { useState } from 'react';
import { MobileFont } from './mobile'

const PopupModal = ({
    isVisible,
    title,
    children = null,
    containerClassName = '',
    onBackdropCb,
    contentClassname = '',
    modalClassName = '',
    center = false,
    isAlertModal,
    useFullScreen = false,
    useAboveAll = false,
    useCenter = false,
    background,
    bgClassName,
    isDesktop,
    isMobile = false
}) => {
    const wrapperRef = useRef(null);
    const container = useRef(null);

    const handleOutside = () => {
        if (onBackdropCb) onBackdropCb();
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

    const Container = !isDesktop ? MobileFont : EmptyComponent

    return (
        <Portal portalId={PORTAL_MODAL_ID}>
            <Container>
                <div
                    className={classNames('absolute top-0 left-0 w-full h-full overflow-hidden', { invisible: !isVisible }, { visible: isVisible }, modalClassName)}
                    ref={container}
                >
                    <div
                        onClick={() => onBackdropCb && onBackdropCb()}
                        className={classNames(
                            'absolute top-0 left-0 w-full h-full transition-opacity duration-200 z-[100] bg-shadow/[0.6]', bgClassName,
                            { 'visible opacity-100': isVisible },
                            { 'invisible opacity-0': !isVisible },
                            { '!z-[200]': useAboveAll },
                            { '!bg-[#000] !bg-opacity-80': isMobile },
                        )}
                    />
                    <div
                        className={classNames(
                            `fixed min-w-[280px] min-h-[100px] rounded-lg dark:drop-shadow-dark bg-transparent left-0 top-0 w-full h-full p-0 z-[101]`,
                            containerClassName,
                            { '!z-[201]': useAboveAll },
                        )}
                    >
                        <div className={classNames(`justify-end h-full flex flex-col relative`, { '!justify-center !items-center !mx-[25px]': useCenter })}>
                            {!useCenter && <div className="flex-1" onClick={() => onBackdropCb && onBackdropCb()}></div>}
                            <div
                                ref={wrapperRef}
                                className={classNames(
                                    `${contentClassname} rounded-t-xl h-max w-full relative px-4 pt-9 pb-12 max-h-[90%] overflow-y-auto`,
                                    { 'h-full max-h-screen !rounded-none !fixed': useFullScreen },
                                    {
                                        '!rounded-xl !px-6': useCenter && !isDesktop,
                                        'bg-dark': isMobile,
                                        '!bg-white text-darkBlue': isDesktop
                                    }
                                )}
                                style={{ backgroundImage: background ?? null, backgroundSize: background ? 'cover' : null, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', position: 'fixed', maxHeight: 'none' }}
                            >
                                {useFullScreen || useCenter ? null : (
                                    <div
                                        style={{ transform: 'translate(-50%,0)' }}
                                        className="h-[4px] w-[48px] rounded-[100px] opacity-[0.16] bg-gray-1  absolute top-2 left-1/2 "
                                    ></div>
                                )}
                                <div className={classNames("w-full flex justify-between items-center",
                                    {
                                        '!justify-start': useFullScreen,
                                    })}
                                >
                                    {useFullScreen ? <div className='mr-3' onClick={() => onBackdropCb && onBackdropCb()}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m15 18-6-6 6-6" stroke="#e2e8f0" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                        : null}
                                    {title ? <div className={classNames('font-bold text-[18px] text-darkBlue', { 'text-[20px] max-h-screen': useFullScreen, '!text-gray-6': isMobile })}>{title}</div> : <div></div>}

                                    {useFullScreen ? null : <div
                                        className="flex-center hover:bg-gray-3 dark:hover:bg-darkBlue-4 rounded-md cursor-pointer"
                                        onClick={() => onBackdropCb && onBackdropCb()}
                                    >
                                        {/* <X size={18} color={useCenter ? '#fff' : '#718096'} /> */}
                                        {isMobile ?
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#7v918lj1ea)">
                                                    <path d="M6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41 17.59 5 12 10.59 6.41 5z" fill="#E2E8F0" />
                                                </g>
                                                <defs>
                                                    <clipPath id="7v918lj1ea">
                                                        <path fill="#fff" transform="rotate(-90 12 12)" d="M0 0h24v24H0z" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="m6 6 12 12M6 18 18 6" stroke={useCenter ? '#fff' : '#e2e8f0'} strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>}
                                    </div>}
                                </div>
                                {(isDesktop || isMobile) ? null : useFullScreen || useCenter ? <div className="h-6"></div> : <Line className="mt-2 absolute mb-6 ml-[-16px] !w-screen" />}
                                <div className={classNames('mt-7')}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Portal>
    );
};

export const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12.667 2.667H3.333C2.597 2.667 2 3.263 2 4v9.333c0 .737.597 1.333 1.333 1.333h9.334c.736 0 1.333-.596 1.333-1.333V4c0-.737-.597-1.333-1.333-1.333zM10.667 1.333V4M5.333 1.333V4M2 6.667h12"
            stroke="#718096"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Could not copy text: ', err)
    }
    document.body.removeChild(textArea);
}

function copy(text) {
    if (!navigator?.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator?.clipboard?.writeText(text).then(function () {
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

export const CopyIcon = ({ size = 12, color = '#718096', className = '', data }) => {
    const [isClicked, setIsClicked] = useState(false);
    const onClick = () => {
        copy(data);
        setIsClicked(true);
        setTimeout(async () => {
            setIsClicked(false);
        }, 600);
    };
    return isClicked ? (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0598 2.85758C14.2766 3.02869 14.3136 3.3431 14.1424 3.55984L6.64244 13.0598C6.55397 13.1719 6.4218 13.2408 6.27926 13.2492C6.13672 13.2575 5.99741 13.2045 5.89645 13.1036L1.89645 9.10357C1.70118 8.90831 1.70118 8.59173 1.89645 8.39647C2.09171 8.2012 2.40829 8.2012 2.60355 8.39647L6.20597 11.9989L13.3576 2.9402C13.5287 2.72346 13.8431 2.68647 14.0598 2.85758Z"
                fill="#00C8BC"
            />
        </svg>
    ) : (
        <svg onClick={() => onClick()} className={className} width={size} height={size} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.222 5.444h-8c-.982 0-1.778.796-1.778 1.778v8c0 .982.796 1.778 1.778 1.778h8c.982 0 1.778-.796 1.778-1.778v-8c0-.982-.796-1.778-1.778-1.778z"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.667 12.556h-.89A1.778 1.778 0 0 1 1 10.778v-8A1.778 1.778 0 0 1 2.778 1h8a1.778 1.778 0 0 1 1.778 1.778v.889"
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export const renderRefInfo = (text, className = '', size = 15, originalText) => {
    return (
        <div className={classNames('w-full h-11 px-3 rounded-[3px] flex justify-between items-center bg-[#f5f6f7]', className)}>
            <div className="font-medium text-sm text-shadow-3 w-3/4">{text}</div>
            <div>
                <CopyIcon data={originalText ?? text} size={size} className="cursor-pointer" />
            </div>
        </div>
    );
};
export default PopupModal;


const EmptyComponent = ({ children }) => <>{children}</>
