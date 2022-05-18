import React, { useState, useEffect, useRef } from 'react';
import Tour from "reactour";
import colors from 'styles/colors';
import { useTranslation } from 'next-i18next';
import styled from 'styled-components';
import { X } from 'react-feather'

const Guideline = ({ pair }) => {
    const { t } = useTranslation();
    const [isStart, setIsStart] = useState(false);
    const [showClose, setShowClose] = useState(false);
    const step = useRef(0);

    const onClose = (e) => {
        if (e) setIsStart(false);
    }

    useEffect(() => {
        // if (pair) setIsStart(true);
    }, [pair])

    const getCurrentStep = (e) => {
        step.current = e;
    }

    const tourConfig = [
        {
            selector: '[data-tut="order-symbol"]',
            content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:symbol')} />,
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
        },
        {
            selector: '[data-tut="order-tab"]',
            content: (props) => <Content {...props} onClose={onClose} text={t('futures:mobile:guide:tab')} />,
        }
    ]

    return (
        <Tour
            onRequestClose={() => onClose()}
            steps={tourConfig}
            isOpen={isStart}
            showCloseButton={false}
            maskClassName="guideline"
            rounded={5}
            disableInteraction
            disableKeyboardNavigation
            accentColor={colors.teal}
            getCurrentStep={getCurrentStep}
            // highlightedMaskClassName="bg-teal"
            showNavigation={false}
            showButtons={false}
            showNumber={false}
        />
    );
};

const Content = ({ title, text, step, onClose, goTo, ...props }) => {
    console.log(props)
    return (
        <View>
            <div className="flex items-center justify-between">
                <label className="text-teal font-semibold text-sm">Bước {step}</label>
                <div className='cursor-pointer' onClick={() => onClose(true)}>
                    <X width={20} />
                </div>
            </div>
            <div className="mt-[8px] mb-[16px]">{text}</div>
            <div className="flex items-center justify-between font-medium">
                <div className='text-sm'>Bước {step + '/'}<span className="text-xs">6</span></div>
                <div className='px-[19px] py-[3px] bg-dominant rounded-[4px]' onClick={() => goTo(step)}>Next</div>
            </div>
        </View>
    )
}

const View = styled.div.attrs({
    className: 'text-xs'
})`
    height:144px;
    width:294px;
    background-color:${colors.darkBlue1};
    border:1px solid ${colors.teal};
    ${'' /* opacity:0.8; */}
    border-radius: 8px;
    padding:16px;
`

export default Guideline;