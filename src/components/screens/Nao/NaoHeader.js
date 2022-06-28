import React, { useState, Fragment, useRef, useEffect } from 'react';
import styled from 'styled-components';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import SvgMenu from 'src/components/svg/Menu';
import { useWindowSize } from 'utils/customHooks';
import colors from 'styles/colors';
import Portal from 'components/hoc/Portal';
import { Transition } from '@headlessui/react';
import classNames from 'classnames';

const NaoHeader = () => {
    const [currentLocale, onChangeLang] = useLanguage()
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize();
    const [visible, setVisible] = useState(false);

    return (
        <div className="nao_header flex justify-between items-center h-[90px]">
            <Drawer visible={visible} />
            <img src='/images/nao/ic_nao.png' width='40' height='40' className='min-w-[2.5rem]' />
            <div className={`flex items-center text-nao-text font-medium ${width > 1180 ? 'space-x-10' : 'space-x-4'}`}>
                {width > 1180 && <>
                    <div>Introducing</div>
                    <div>Performance</div>
                    <div>Governance Pool</div>
                    <div>Buy Token</div>
                </>
                }
                <div className="flex items-center p-2 bg-nao-bg2 rounded-[4px] select-none space-x-2">
                    <Language onClick={() => language !== LANGUAGE_TAG.VI && onChangeLang()}
                        active={language === LANGUAGE_TAG.VI}>VI</Language>
                    <Language onClick={() => language !== LANGUAGE_TAG.EN && onChangeLang()}
                        active={language === LANGUAGE_TAG.EN}>ENG</Language>
                </div>
                {width < 1180 &&
                    <div
                        className='relative'
                        onClick={() => setVisible(true)}
                    >
                        <SvgMenu
                            size={25}
                            className={'cursor-pointer'}
                            color={colors.nao.text}
                        />
                    </div>
                }
            </div>
        </div>
    );
};

function useOutsideAlerter(ref, cb) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event, cb) {
            if (ref.current && !ref.current.contains(event.target)) {
                cb()
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", (event) => handleClickOutside(event, cb));
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, cb]);
}

const Drawer = ({ visible, onClose }) => {
    const wrapperRef = useRef(null);
    const handleOutside = () => {
        if (visible && onClose) {
            onClose()
        }
    }
    useOutsideAlerter(wrapperRef, handleOutside.bind(this));

    return (
        <Portal portalId='PORTAL_MODAL'>
            <Transition
                key={`Transition_mobile_market}`}
                show={visible}
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 -translate-x-full"
            >
                <div
                    className={classNames(
                        'flex flex-col absolute top-0 left-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9]',
                    )}
                >
                    <div ref={wrapperRef} className='flex-1 w-[calc(100%-106px)] min-h-0'>
                        23232
                    </div>

                </div>
            </Transition>

        </Portal>
    )
}

const Language = styled.div.attrs({
    className: 'px-3 text-xs py-[3px] nao:py-[1px] nao:px-4 nao:text-sm rounded-[4px] cursor-pointer text-nao-white  font-semibold nao:leading-[26px]'
})`
    background:${({ active }) => active ? `linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)` : ''} ;
            `

export default NaoHeader;