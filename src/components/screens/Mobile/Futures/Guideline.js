import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import Tour from "reactour";
import colors from 'styles/colors';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { X } from 'react-feather';
import { AlertContext } from 'components/common/layouts/LayoutMobile';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { getS3Url } from 'redux/actions/utils';
const Guideline = ({ pair, start, setStart, isFullScreen }) => {
    const { t } = useTranslation();
    const context = useContext(AlertContext);
    const [showClose, setShowClose] = useState(false);
    const step = useRef(0);
    const refGuide = useRef(null)

    useEffect(() => {
        // if (pair) setStart(true);
    }, [pair])

    const getCurrentStep = (e) => {
        step.current = e;
    }

    useEffect(() => {
        const vh = window.innerHeight * 0.01;
        const order = document.querySelector('#futures-mobile')
        if (!order) return;
        if (start) {
            order.style.height = window.innerHeight + 'px';
            // context.onHiddenBottomNavigation(true)
        } else {
            order.style.height = vh * 100 + 'px'
            // context.onHiddenBottomNavigation(false)
        }
    }, [start])

    const tourConfig = useMemo(() => {
        return [
            {
                selector: '[data-tut="order-symbol"]',
                content: (props) => <Content {...props} top onClose={onClose} text={t('futures:mobile:guide:symbol')} />,
                position: 'bottom'
            },
            {
                selector: '[data-tut="order-side"]',
                content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:side')} />,
            },
            {
                selector: '[data-tut="order-volume"]',
                content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:volume')} />,
            },
            {
                selector: '[data-tut="order-sl"]',
                content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:sl')} />,
                highlightedSelectors: ['[data-tut="order-tp"]'],
            },
            {
                selector: '[data-tut="order-button"]',
                content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:order')} />,
                position: !isFullScreen ? [15, 0] : 'top'
            },
            {
                selector: '[data-tut="order-tab"]',
                content: (props) => <Content {...props} top={isFullScreen} onClose={onClose} text={t('futures:mobile:guide:tab')} />,
            }
        ]
    }, [isFullScreen])

    const onClose = (e) => {
        if (!e) {
            if (refGuide.current.state.current === tourConfig.length - 1) {
                setStart(false);
            } else {
                refGuide.current.nextStep()
            }
        } else {
            setStart(false);
        }
    }

    return (
        <Tour
            onRequestClose={() => onClose(false)}
            steps={tourConfig}
            isOpen={start}
            showCloseButton={false}
            maskClassName="guideline"
            rounded={5}
            startAt={0}
            disableInteraction
            disableKeyboardNavigation
            accentColor={colors.teal}
            getCurrentStep={getCurrentStep}
            showNavigation={false}
            showButtons={false}
            showNumber={false}
            scrollDuration="300"
            ref={refGuide}
            onAfterOpen={disableBodyScroll}
            onBeforeClose={enableBodyScroll}
        // inViewThreshold={100}
        />
    );
};

const Content = ({ title, text, step, onClose, top, goTo, ...props }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center" onClick={() => onClose(false)}>
            {top && <img className="m-auto" src={getS3Url("/images/icon/ic_guide_arrow.png")} width={10} />}
            <View id={`guideline-step-${step}`}>
                <div className="flex items-center justify-between">
                    <label className="text-teal font-semibold text-sm">{t('futures:mobile:guide:step')} {step}</label>
                    <div className='cursor-pointer text-white' onClick={() => onClose(true)}>
                        <X width={20} />
                    </div>
                </div>
                <div className="mt-[8px] mb-[16px] text-white text-xs">{text}</div>
                <div className="flex items-center justify-between font-medium text-white">
                    <div className='text-sm'>{t('futures:mobile:guide:step')} {step + '/'}<span className="text-[10px]">6</span></div>
                    <div className='min-w-[60px] px-[10px] bg-dominant rounded-[4.33333px] text-center text-[10px]'
                        onClick={() => step === 6 && onClose(true)}>
                        {t(step === 6 ? 'common:close' : 'futures:mobile:guide:next')}
                    </div>
                </div>
            </View>
            {!top && <img className="m-auto rotate-180" src={getS3Url("/images/icon/ic_guide_arrow.png")} width={10} />}
        </div>
    )
}

const View = styled.div.attrs({
    className: 'my-[10px] bg-darkBlue dark:bg-darkBlue-1 flex flex-col justify-between'
})`
    height:144px;
    width:294px;
    ${'' /* background-color:${colors.darkBlue1}; */}
    border:1px solid ${colors.teal};
    opacity:0.8;
    border-radius: 8px;
    padding:16px;
`

export default Guideline;
