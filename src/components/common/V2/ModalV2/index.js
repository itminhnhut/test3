import { PORTAL_MODAL_ID } from 'constants/constants';
import { X } from 'react-feather';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import Portal from 'components/hoc/Portal';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useWindowSize from 'hooks/useWindowSize';
import useLockedBody from 'hooks/useLockedBody';

const ModalV2 = ({
    isVisible,
    children = null,
    onBackdropCb,
    canBlur = true,
    isMobile = false,
    containerClassName = '',
    wrapClassName = '',
    className = '',
    customHeader,
    closeButton = true,
    btnCloseclassName = '',
    loading = false,
    animateModal = true
}) => {
    const wrapperRef = useRef(null);
    const container = useRef(null);
    const timer = useRef(null);
    const [mount, setMount] = useState(false);
    const { width } = useWindowSize();
    const [locked, setLocked] = useState(false);
    useLockedBody(locked);

    const handleOutside = () => {
        if (isVisible && onBackdropCb) onBackdropCb();
    };

    if (canBlur) {
        useOnClickOutside(wrapperRef, handleOutside, loading, container);
    }

    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(
            () => {
                setMount(isVisible);
            },
            isVisible ? 10 : 200
        );
        setLocked(isVisible);
    }, [isVisible]);

    if (!isVisible && !mount) return null;
    return (
        <Portal portalId={PORTAL_MODAL_ID}>
            <div
                className={classnames(
                    'fixed top-0 left-0 z-[99] w-full h-full overflow-hidden bg-shadow/[0.6]',
                    {
                        invisible: !isVisible && !mount,
                        visible: isVisible
                    },
                    containerClassName
                )}
                ref={container}
            >
                <div
                    className={classnames('h-full relative ease-in transition-all flex', {
                        'translate-y-full duration-200': animateModal && (!isVisible || !mount),
                        'translate-y-0 duration-200': animateModal && isVisible && mount,
                        'flex-col justify-end': isMobile && width && width < 820
                    })}
                >
                    <div
                        ref={wrapperRef}
                        className={classnames(
                            'w-full absolute overflow-auto max-h-[90%] border-transparent dark:!border-divider-dark',
                            {
                                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl max-w-[90%] min-w-[390px]':
                                    !isMobile || (width && width >= 820),
                                border: !isMobile
                            },
                            className
                        )}
                    >
                        <div
                            className={classnames(
                                `h-full bg-white dark:bg-dark text-base`,
                                { 'px-8 pb-8': !isMobile, 'px-6 pb-6': isMobile, 'pt-6 sm:pt-8': !closeButton || loading },
                                wrapClassName
                            )}
                        >
                            <>
                                {customHeader
                                    ? customHeader()
                                    : closeButton &&
                                      !loading && (
                                          <div
                                              className={classnames(
                                                  'flex items-end justify-end sticky top-0 z-10 py-6 sm:pt-8',
                                                  { 'bg-white dark:bg-dark': isMobile },
                                                  btnCloseclassName
                                              )}
                                          >
                                              <X size={24} onClick={handleOutside} className="cursor-pointer" />
                                          </div>
                                      )}
                                {children}
                            </>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    );
};

export default ModalV2;
