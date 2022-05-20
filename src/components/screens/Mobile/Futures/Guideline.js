import React, { useState, useEffect, useRef, useMemo } from 'react';
import Tour from "reactour";
import colors from 'styles/colors';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { X } from 'react-feather'
const Guideline = ({ pair, start, setStart }) => {
    const { t } = useTranslation();
    const [showClose, setShowClose] = useState(false);
    const step = useRef(0);

    const onClose = (e) => {
        if (e) setStart(false);
    }

    useEffect(() => {
        // if (pair) setStart(true);
    }, [pair])

    const getCurrentStep = (e) => {
        step.current = e;
    }

    useEffect(() => {
        const vh = window.innerHeight * 0.01;
        const el = document.querySelector('.bottom-navigation')
        const order = document.querySelector('#futures-mobile')
        if (start) {
            order.style.height = window.innerHeight + 'px';
            el.style.display = 'none'
        } else {
            order.style.height = vh * 100 - 80 + 'px'
            el.style.display = 'flex'
        }
    }, [start])

    const tourConfig = useMemo(() => {
        const small = window.innerHeight < 650;
        const positionButton = small ? [10, 0] : 'bottom';
        return [
            {
                selector: '[data-tut="order-symbol"]',
                content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:symbol')} />,
            },
            {
                selector: '[data-tut="order-side"]',
                content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:side')} />,
                position: small ? 'bottom' : 'top'
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
                position: positionButton,
            },
            {
                selector: '[data-tut="order-tab"]',
                content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:tab')} />,
            }
        ]
    }, [])

    return (
        <Tour
            onRequestClose={() => onClose()}
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
            inViewThreshold={100}
        />
    );
};

const Content = ({ title, text, step, onClose, goTo, ...props }) => {
    const { t } = useTranslation();
    const [bottom, setBottom] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            const el = document.querySelector('#guideline-step-' + step);
            let result = false;
            if (el) {
                const ref = el.getBoundingClientRect();
                const clientHeight = window.innerHeight > 600 ? window.innerHeight / 2 : window.innerHeight - 100
                result = ref.bottom > clientHeight;
            }
            setBottom(result)
        }, 500);
    }, [step])

    return (
        <div className="flex flex-col items-center justify-center" >
            {!bottom && <img className="m-auto" src="/images/icon/ic_guide_arrow.png" width={10} />}
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
                    <div className='min-w-[60px] px-[10px] bg-dominant rounded-[4.33333px] text-center text-[10px]' onClick={() => step === 6 ? onClose(true) : goTo(step)}>{t(step === 6 ? 'common:close' : 'common:global_btn:next')}</div>
                </div>
            </View>
            {bottom && <img className="m-auto rotate-180" src="/images/icon/ic_guide_arrow.png" width={10} />}
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