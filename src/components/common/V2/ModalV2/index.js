import { PORTAL_MODAL_ID } from 'constants/constants';
import { X } from 'react-feather';
import { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import Portal from 'components/hoc/Portal';
import { useOutside } from 'components/screens/Nao/NaoStyle';
import useWindowSize from 'hooks/useWindowSize';

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
    btnCloseclassName = ''
}) => {
    const wrapperRef = useRef(null);
    const container = useRef(null);
    const timer = useRef(null);
    const [mount, setMount] = useState(false);
    const { width } = useWindowSize();
    const top = useRef(0);

    const handleOutside = () => {
        if (isVisible && onBackdropCb) onBackdropCb();
    };

    if (canBlur) {
        useOutside(wrapperRef, handleOutside, container);
    }

    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(
            () => {
                setMount(isVisible);
            },
            isVisible ? 10 : 200
        );
        if (isVisible) {
            setTimeout(() => {
                top.current = scroll_pause();
            }, 100);
        } else {
            if (top.current) scroll_resume(top.current);
        }
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isVisible]);

    if (!isVisible && !mount) return null;
    return (
        <Portal portalId={PORTAL_MODAL_ID}>
            <div
                className={classnames(
                    'fixed top-0 left-0 z-[99] w-full h-full overflow-hidden bg-shadow/[0.6]',
                    'z-30',
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
                        'translate-y-full duration-200': !isVisible || !mount,
                        'translate-y-0 duration-200': isVisible && mount,
                        'flex-col justify-end': isMobile && width && width < 820
                    })}
                >
                    <div
                        ref={wrapperRef}
                        className={classnames(
                            'w-full absolute overflow-auto max-h-[90%] border border-divider-dark',
                            {
                                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl max-w-[90%] min-w-[390px]':
                                    !isMobile || (width && width >= 820),
                                '!border-none': isMobile
                            },
                            className
                        )}
                    >
                        <div className={classnames(`p-8 h-full bg-bgSpotContainer dark:bg-dark`, { 'p-6': isMobile }, wrapClassName)}>
                            <>
                                {customHeader
                                    ? customHeader()
                                    : closeButton && (
                                          <div
                                              className={classnames(
                                                  'flex items-end justify-end h-12 sticky top-0 z-10  pb-6 sm:pb-2',
                                                  { '-mt-6': !isMobile, 'dark:bg-dark': isMobile },
                                                  btnCloseclassName
                                              )}
                                          >
                                              <X size={18} onClick={handleOutside} className="cursor-pointer" />
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

const scroll_pause = () => {
    const top = document.body.scrollTop || document.scrollingElement?.scrollTop || 0;
    document.body.classList.add('no-scroll');
    document.body.style.top = -1 * top + 'px';
    return top;
};

const scroll_resume = (top) => {
    document.body.classList.remove('no-scroll');
    document.body.removeAttribute('style');
    window.scrollTo(0, top);
};
