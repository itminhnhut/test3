import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import SvgMenu from 'src/components/svg/Menu';
import { useWindowSize } from 'utils/customHooks';
import colors from 'styles/colors';
import Portal from 'components/hoc/Portal';
import classNames from 'classnames';
import { X } from 'react-feather';
import { Divider } from 'components/screens/Nao/NaoStyle';
import { getS3Url } from 'redux/actions/utils';
const category = [
    { label: 'performance', el: 'nao_performance' },
    { label: 'governance_pool', el: 'nao_pool' },
    { label: 'buy_token', el: 'nao_token' }
];

const NaoHeader = () => {
    const [currentLocale, onChangeLang] = useLanguage()
    const { t, i18n: { language } } = useTranslation()
    const { width } = useWindowSize();
    const [visible, setVisible] = useState(false);

    const scrollToView = (el) => {
        const _el = document.querySelector('#' + el);
        if (_el) {
            _el.scrollIntoView()
            if (visible) setVisible(false);
        }
    }

    return (
        <div className="nao_header flex justify-between items-center h-[90px] relative">
            <Drawer visible={visible} onClose={() => setVisible(false)} onChangeLang={onChangeLang} language={language} t={t} scrollToView={scrollToView} />
            <img src={getS3Url('/images/nao/ic_nao.png')} width='40' height='40' className='min-w-[2.5rem]' />
            <div className={`flex items-center text-nao-text font-medium ${width > 1180 ? 'space-x-10' : 'space-x-4'}`}>
                {width > 1180 && <>
                    {category.map(item => (
                        <div onClick={() => scrollToView(item.el)} className="cursor-pointer capitalize">{t(`nao:${item.label}`)}</div>
                    ))}
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

const Drawer = ({ visible, onClose, language, onChangeLang, t, scrollToView }) => {
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

    const _scrollToView = (el) => {
        document.body.classList.remove('overflow-hidden')
        if (scrollToView) scrollToView(el)
    }

    return (
        <Portal portalId='PORTAL_MODAL'>
            <div
                className={classNames(
                    'flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-nao-bgShadow/[0.9] overflow-hidden',
                    'ease-in-out transition-all flex items-end duration-300 z-30',
                    { invisible: !visible },
                    { visible: visible },
                    { 'translate-x-full': !visible },
                    { 'translate-x-0': visible },
                )}
            >
                <div ref={wrapperRef} className='flex-1 w-[284px] min-h-0 bg-nao-bgModal'>
                    <div className="pt-[35px] px-5 flex justify-end">
                        <img className="cursor-pointer" onClick={onClose} src={getS3Url('/images/nao/ic_close.png')} height='24' width='24' alt="" />
                    </div>
                    <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between h-[calc(100%-65px)]">
                        <div className="text-[1.25rem] font-medium text-nao-text space-y-11 text-center">
                            {category.map(item => (
                                <div onClick={() => _scrollToView(item.el)} className="cursor-pointer capitalize">{t(`nao:${item.label}`)}</div>
                            ))}
                            <div className="flex items-center select-none gap-2 justify-center">
                                <Language className="m-0 !text-sm" onClick={() => language !== LANGUAGE_TAG.VI && onChangeLang()}
                                    active={language === LANGUAGE_TAG.VI}>VI</Language>
                                <Language className="m-0 !text-sm" onClick={() => language !== LANGUAGE_TAG.EN && onChangeLang()}
                                    active={language === LANGUAGE_TAG.EN}>ENG</Language>
                            </div>
                        </div>
                        <div className="flex flex-col w-full">
                            <Divider className="w-full !mb-8" />
                            <div className="flex items-center pb-[18px]">
                                <img alt="" src={getS3Url("/images/nao/ic_onus.png")} height="30" width="30" />
                                <div className="text-nao-text text-xs font-semibold ml-2">{t('nao:nao_token:get_buy_now')}</div>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <img alt="" src={getS3Url("/images/nao/ic_app_store.png")} className="min-h-[35px]" width="107" />
                                <img alt="" src={getS3Url("/images/nao/ic_google_play.png")} className="min-h-[35px]" width="107" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Portal>
    )
}

const Language = styled.div.attrs({
    className: 'px-3 text-xs py-[3px] nao:py-[1px] nao:px-4 nao:text-sm rounded-[4px] cursor-pointer text-nao-white  font-semibold nao:leading-[26px]'
})`
    background:${({ active }) => active ? `linear-gradient(101.26deg, #093DD1 -5.29%, #49E8D5 113.82%)` : ''} ;
            `

export default NaoHeader;