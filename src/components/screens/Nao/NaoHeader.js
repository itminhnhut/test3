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
import { X } from 'react-feather';
import { Divider } from 'components/screens/Nao/NaoStyle';
import { getS3Url } from 'redux/actions/utils';

const NaoHeader = () => {
    const [currentLocale, onChangeLang] = useLanguage()
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize();
    const [visible, setVisible] = useState(false);

    return (
        <div className="nao_header flex justify-between items-center h-[90px]">
            <Drawer visible={visible} onClose={() => setVisible(false)} onChangeLang={onChangeLang} language={language} />
            <img src={getS3Url('/images/nao/ic_nao.png')} width='40' height='40' className='min-w-[2.5rem]' />
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

const Drawer = ({ visible, onClose, language, onChangeLang }) => {
    const wrapperRef = useRef(null);
    const timer = useRef(null)
    const handleOutside = () => {
        if (visible && onClose) {
            onClose()
        }
    }

    useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden')
        } else {
            clearTimeout(timer.current)
            timer.current = setTimeout(() => {
                document.body.classList.remove('overflow-hidden')
            }, 300);
        }
    }, [visible])

    useOutsideAlerter(wrapperRef, handleOutside.bind(this));

    return (
        <Portal portalId='PORTAL_MODAL'>
            <Transition
                key={`nao-token-drawer}`}
                show={visible}
                as={Fragment}
                enter="transition ease-in duration-200"
                enterFrom="opacity-0 translate-x-full"
                enterTo="opacity-100 translate-x-0"
                leave="transition ease-out duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="opacity-0 translate-x-full"
            >
                <div
                    className={classNames(
                        'flex flex-col absolute top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden',
                    )}
                    style={{ direction: 'rtl' }}
                >
                    <div ref={wrapperRef} className='flex-1 w-[284px] min-h-0 bg-nao-bgModal'>
                        <div className="pt-[35px] px-5">
                            <img className="cursor-pointer" onClick={onClose} src={getS3Url('/images/nao/ic_close.png')} height='24' width='24' alt="" />
                        </div>
                        <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between h-[calc(100%-65px)]">
                            <div className="text-[1.25rem] font-medium text-nao-text space-y-11 text-center">
                                <div className="cursor-pointer">Introducing</div>
                                <div className="cursor-pointer">Performance</div>
                                <div className="cursor-pointer">Governance Pool</div>
                                <div className="cursor-pointer">Buy Token</div>
                                <div className="flex items-center select-none gap-2 justify-center">
                                    <Language className="m-0 !text-sm" onClick={() => language !== LANGUAGE_TAG.EN && onChangeLang()}
                                        active={language === LANGUAGE_TAG.EN}>ENG</Language>
                                    <Language className="m-0 !text-sm" onClick={() => language !== LANGUAGE_TAG.VI && onChangeLang()}
                                        active={language === LANGUAGE_TAG.VI}>VI</Language>
                                </div>
                            </div>
                            <div className="flex flex-col items-end w-full">
                                <Divider className="w-full !mb-8" />
                                <div className="flex items-center pb-[18px]">
                                    <div className="text-nao-text text-xs font-semibold ml-2">Get Onus App to buy NAO now!</div>
                                    <img alt="" src={getS3Url("/images/nao/ic_onus.png")} height="30" width="30" />
                                </div>
                                <div className="flex justify-between items-center w-full">
                                    <img alt="" src={getS3Url("/images/nao/ic_google_play.png")} className="min-h-[35px]" width="107" />
                                    <img alt="" src={getS3Url("/images/nao/ic_app_store.png")} className="min-h-[35px]" width="107" />
                                </div>
                            </div>
                        </div>
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