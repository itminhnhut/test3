import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import LayoutNaoToken from 'components/common/layouts/LayoutNaoToken';
import { useWindowSize } from 'utils/customHooks';
import SvgMenu from 'components/svg/Menu';
import { getS3Url } from 'redux/actions/utils';
import colors from 'styles/colors';
import useLanguage, { LANGUAGE_TAG } from 'hooks/useLanguage';
import { useTranslation } from 'next-i18next';
import Portal from 'components/hoc/Portal';
import { X, ChevronLeft } from 'react-feather';
import classNames from 'classnames';
import StakeTab from 'components/screens/Nao/Stake/StakeTab';
import PerformanceTab from 'components/screens/Nao/Stake/PerformanceTab';
import { BackgroundHeader } from 'components/screens/Nao/NaoStyle';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import fetchApi from 'utils/fetch-api';
import { API_POOL_USER_INFO } from 'redux/actions/apis';
import { ApiStatus } from 'redux/actions/const';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useRouter } from 'next/router';
('next/router');
import { useOutsideAlerter } from 'components/screens/Nao/NaoStyle';
import NaoHeader from 'components/screens/Nao/NaoHeader';
import NaoFooter from 'components/screens/Nao/NaoFooter';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { getLoginUrl } from 'redux/actions/utils';

const getAssetNao = createSelector([(state) => state.utils.assetConfig, (utils, params) => params], (assets, params) => {
    return assets.find((rs) => rs.assetCode === params);
});

const Stake = () => {
    const { width, height } = useWindowSize();
    const isMobile = width < 820;
    const {
        t,
        i18n: { language }
    } = useTranslation();
    const [tab, setTab] = useState(0);
    const [dataSource, setDataSource] = useState(null);
    const assetNao = useSelector((state) => getAssetNao(state, 'NAO'));
    const refStake = useRef(null);
    const router = useRouter();
    const user = useSelector((state) => state.auth.user) || null;
    const [currentTheme] = useDarkMode();

    useEffect(() => {
        getStake();
    }, []);

    const getStake = async () => {
        try {
            const { data } = await fetchApi({
                url: API_POOL_USER_INFO
            });
            if (data) {
                setDataSource(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
        }
    };

    const onShowLock = () => {
        refStake.current.showLock(true);
    };

    return (
        <MaldivesLayout>
            <LayoutNaoToken isHeader={false}>
                {/* <div className="px-4 nao:p-0 max-w-[72.5rem] w-full m-auto !mt-0 mb:block hidden">
                <NaoHeader />
            </div> */}
                <div className={`${user ? 'mb:min-h-[calc(100vh-16.75rem)]' : 'mb:pb-[7.5rem] pb-10'} px-4`}>
                    <div className="mb_only:sticky top-0 z-10 nao:p-0 max-w-[72.5rem] w-full m-auto">
                        <div className="stake_header bg-bgPrimary dark:bg-bgPrimary-dark relative z-[9]">
                            {/* <Drawer visible={visible} onClose={() => setVisible(false)} onChangeLang={onChangeLang}
                    language={language} t={t} />
                <div className="flex items-center justify-between px-4 pt-6">
                    <img src={getS3Url("/images/nao/ic_nao.png")} alt="" width={40} height={40} />
                    {width <= 768 &&
                        <div
                            className='relative'
                            onClick={() => setVisible(true)}
                        >
                            <SvgMenu
                                size={25}
                                className={'cursor-pointer select-none'}
                                color={colors.nao.text}
                            />
                        </div>
                    }
                </div> */}
                            <div className={`flex items-center pb-4 pt-6 mb:pt-20 ${user ? 'mb:pb-12' : 'mb:pb-7'} `}>
                                <ChevronLeft size={20} onClick={() => router.back()} className="mb:hidden mr-2" />
                                <label onClick={() => router.back()} className="font-semibold mb:text-5xl">
                                    {t('nao:governance_pool')}
                                </label>
                            </div>
                            {user && (
                                <Tabs isMobile={isMobile} tab={tab}>
                                    <TabItem className="py-4 mb:w-[fit-content]" onClick={() => setTab(0)} active={tab === 0}>
                                        {t('nao:pool:stake_nao')}
                                    </TabItem>
                                    <TabItem className="py-4 mb:w-[fit-content]" onClick={() => setTab(1)} active={tab === 1}>
                                        {t('nao:pool:performance')}
                                    </TabItem>
                                </Tabs>
                            )}
                        </div>
                    </div>
                    {user ? (
                        <div className="nao:px-0 max-w-[72.5rem] w-full m-auto !mt-0">
                            <div className={`h-full w-full py-6 mb:py-8`}>
                                <div className={tab !== 0 ? 'hidden' : ''}>
                                    <StakeTab ref={refStake} assetNao={assetNao} dataSource={dataSource} getStake={getStake} />
                                </div>
                                <div className={tab !== 1 ? 'hidden' : height < 600 ? 'min-h-[600px] relative' : ''}>
                                    <PerformanceTab onShowLock={onShowLock} assetNao={assetNao} isSmall={height < 600} dataSource={dataSource} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`flex flex-col space-y-3 items-center justify-center font-semibold leading-normal mb:bg-bgPrimary mb:dark:bg-[#141921] p-4 max-w-[72.5rem] w-full m-auto h-[16.25rem] rounded-xl`}
                        >
                            <img
                                className="max-h-[124px]"
                                src={currentTheme === THEME_MODE.DARK ? getS3Url('/images/icon/ic_login.png') : '/images/nao/login.png'}
                            />
                            <div className="flex flex-wrap justify-center space-x-1 text-txtSecondary dark:text-darkBlue-5 truncate overflow-x-auto">
                                <span className="whitespace-pre-wrap text-center">
                                    <span
                                        className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 cursor-pointer"
                                        onClick={() => {
                                            window.location.href = getLoginUrl('sso');
                                        }}
                                    >
                                        {t('common:sign_in')}
                                    </span>{' '}
                                    <span>{t('common:or')}</span>{' '}
                                    <span
                                        className="font-semibold text-green-3 hover:text-green-4 dark:text-green-2 dark:hover:text-green-4 cursor-pointer"
                                        onClick={() => {
                                            window.location.href = getLoginUrl('sso', 'register');
                                        }}
                                    >
                                        {t('common:sign_up')}
                                    </span>{' '}
                                    {t('nao:to_stake_now')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                {/* <div className="hidden mb:block">
                <NaoFooter />
            </div> */}
            </LayoutNaoToken>
        </MaldivesLayout>
    );
};

const Drawer = ({ visible, onClose, language, onChangeLang, t, scrollToView }) => {
    const wrapperRef = useRef(null);
    const timer = useRef(null);
    const handleOutside = () => {
        if (visible && onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (visible) {
            document.body.classList.add('overflow-hidden');
        } else {
            clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                document.body.classList.remove('overflow-hidden');
            }, 300);
        }
    }, [visible]);

    useOutsideAlerter(wrapperRef, handleOutside.bind(this));

    const _scrollToView = (el) => {
        document.body.classList.remove('overflow-hidden');
        if (scrollToView) scrollToView(el);
    };

    return (
        <Portal portalId="PORTAL_MODAL">
            <div
                className={classNames(
                    'flex flex-col fixed top-0 right-0 h-full w-full z-[20] bg-black-800/[0.6] dark:bg-black-800/[0.8] overflow-hidden',
                    'ease-in-out transition-all flex items-end duration-300 z-30',
                    { invisible: !visible },
                    { visible: visible },
                    { 'translate-x-full': !visible },
                    { 'translate-x-0': visible }
                )}
            >
                <div ref={wrapperRef} className="flex-1 w-[284px] min-h-0 bg-bgPrimary dark:bg-bgPrimary-dark">
                    <div className="pt-[35px] px-5 flex justify-end">
                        <img
                            className="cursor-pointer select-none"
                            onClick={onClose}
                            src={getS3Url('/images/nao/ic_close.png')}
                            height="18"
                            width="18"
                            alt=""
                        />
                    </div>
                    <div className="pt-10 px-6 pb-[50px] flex flex-col items-center justify-between h-[calc(100%-65px)]"></div>
                </div>
            </div>
        </Portal>
    );
};

const Tabs = styled.div.attrs({
    className: 'relative flex items-center border-b-2 border-divider dark:border-divider-dark mb:space-x-6'
})`
    &:after {
        content: '';
        position: absolute;
        bottom: -2px;
        height: 2px;
        background-color: ${() => colors.teal};
        transform: ${({ tab, isMobile }) => (isMobile ? `translate(${tab * 100}%,0)` : tab === 1 ? `translate(106px,0)` : `translate(0)`)};
        width: ${({ tab, isMobile }) => (isMobile ? '50%' : tab === 1 ? '74px' : '85px')};
        transition: all 0.2s;
    }
`;

const TabItem = styled.div.attrs(({ active }) => ({
    className: `pb-3 w-full flex items-center justify-center text-sm mb:text-base leading-6 hover:cursor-pointer ${active ? 'text-txtPrimary dark:text-txtPrimary-dark font-semibold' : 'text-txtSecondary dark:text-txtSecondary-dark'
        }`
}))``;

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'nao', 'error', 'navbar']))
    }
});
export default Stake;
