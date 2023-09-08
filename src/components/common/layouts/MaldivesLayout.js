import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT } from 'src/components/common/NavBar/constants';
import { useEffect } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { useWindowSize } from 'utils/customHooks';
import useApp from 'hooks/useApp';
import { PORTAL_MODAL_ID } from 'constants/constants';
import { ToastContainer } from 'react-toastify';
import { useStore } from 'src/redux/store';
import { setTheme } from 'redux/actions/user';
import dynamic from 'next/dynamic';
import { isMobile } from 'react-device-detect';

import { useDispatch, useSelector } from 'react-redux';
import { THEME_MODE } from 'hooks/useDarkMode';
import Skeletor from '../Skeletor';
import Head from 'next/head';
import toast from 'utils/toast';
import { useTranslation } from 'next-i18next';
import { UserSocketEvent } from 'redux/actions/const';
import { useRouter } from 'next/router';
import { PARTNER_WD_TABS, PATHS } from 'constants/paths';
import { getNotifications } from 'redux/actions/notification';
import { ALLOWED_ASSET } from 'components/screens/WithdrawDeposit/constants';

const NavBar = dynamic(() => import('src/components/common/NavBar/NavBar'), {
    ssr: false,
    loading: () => <Skeletor className="!fixed" width="100%" height={isMobile ? MOBILE_NAV_HEIGHT : DESKTOP_NAV_HEIGHT} />
});
const Footer = dynamic(() => import('components/common/Footer/Footer'), { ssr: false });
const TransferModal = dynamic(() => import('components/wallet/TransferModal'), { ssr: false });

// NOTE: Apply this style for NavBar on this layout.
const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0
};

const HookPartnerSocket = () => {
    return <></>;
};

const MadivesLayout = ({
    navOverComponent,
    navMode = false,
    hideFooter = false,
    navStyle = {},
    navName,
    contentWrapperStyle = {},
    children,
    hideNavBar,
    page,
    changeLayoutCb,
    hideInApp,
    spotState,
    resetDefault,
    onChangeSpotState,
    useNavShadow = false,
    useGridSettings = false
}) => {
    // Use Hooks
    const { width } = useWindowSize();
    const theme = useSelector((state) => state.user.theme);
    const { user } = useSelector((state) => state.auth) || null;
    const isPartner = user?.partner_type === 2;
    const isApp = useApp();
    const store = useStore();
    const dispatch = useDispatch();

    useEffect(() => {
        store.dispatch(setTheme());
    }, []);

    const router = useRouter();

    const { t, i18n } = useTranslation();

    const userSocket = useSelector((state) => state.socket.userSocket);
    useEffect(() => {
        if (user?.partner_type !== 2) return;

        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER_AUTO_SUGGEST, (data) => {
                // make sure the socket displayingId is the current page
                if (!data || data?.status !== 0 || data.partnerAcceptStatus !== 0) return;

                const { displayingId, baseQty, baseAssetId, side } = data;

                if (router?.query?.id === PARTNER_WD_TABS.OPEN_ORDER) return;

                setTimeout(() => {
                    dispatch(getNotifications({ lang: i18n.language }));
                }, 3000);

                toast({
                    key: `suggest_order_${displayingId}`,
                    text: t('common:partner_toast_suggest_order', {
                        side: t(`common:${side.toLowerCase()}`),
                        displayingID: displayingId,
                        amount: baseQty,
                        asset: ALLOWED_ASSET[+baseAssetId || 72]
                    }),
                    type: 'info',
                    duration: 5000,
                    customActionClose: (closeToast) => (
                        <span
                            className="ml-6 font-semibold text-green-3 hover:text-green-4 active:text-green-4 dark:text-green-2 dark:hover:text-green-4 dark:active:text-green-4 cursor-pointer"
                            onClick={() => {
                                closeToast();
                                router.push({ pathname: PATHS.PARTNER_WITHDRAW_DEPOSIT.OPEN_ORDER, query: { suggest: displayingId } });
                            }}
                        >
                            {i18n.language === 'en' ? 'Detail' : 'Chi tiết'}
                        </span>
                    )
                });
            });
        }

        return () => {
            if (userSocket) {
                userSocket.off(UserSocketEvent.PARTNER_UPDATE_ORDER_AUTO_SUGGEST);
                userSocket.removeListener(UserSocketEvent.PARTNER_UPDATE_ORDER_AUTO_SUGGEST, (data) => {
                    console.log('socket removeListener PARTNER_UPDATE_ORDER_AUTO_SUGGEST:', data);
                });
            }
        };
    }, [userSocket, i18n]);

    return (
        <>
            {isApp && (
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
                </Head>
            )}
            <div
                className={`mal-layouts flex flex-col `}
                // style={
                // state.isDrawer
                //     ? {
                //           height,
                //           overflow: 'hidden'
                //       }
                //     : {}
                // }
            >
                <ToastContainer
                    position="top-center"
                    autoClose={5000}
                    hideProgressBar
                    closeButton={false}
                    theme={theme === THEME_MODE.LIGHT ? 'light' : 'dark'}
                    className="nami-toast !top-[92px] md:!top-[104px]"
                />
                <ReactNotifications className="fixed z-[9000] pointer-events-none w-full h-full" />
                {!hideNavBar && !hideInApp && !isApp && (
                    <NavBar
                        name={navName}
                        useOnly={navMode}
                        // style={ isHomePage ? {...navStyle} : {  ...navbarStyle, ...navStyle }}
                        style={{ ...navbarStyle, ...navStyle }}
                        spotState={spotState}
                        onChangeSpotState={onChangeSpotState}
                        resetDefault={resetDefault}
                        page={page}
                        changeLayoutCb={changeLayoutCb}
                        useGridSettings={useGridSettings}
                    />
                )}
                <div
                    style={{
                        paddingTop: !navOverComponent && !hideInApp && !isApp ? (width >= 992 ? DESKTOP_NAV_HEIGHT : MOBILE_NAV_HEIGHT) : 0,
                        ...contentWrapperStyle
                    }}
                    className="relative flex-1"
                >
                    {/* {useNavShadow && <NavBarBottomShadow />} */}
                    {children}
                </div>
                {!hideFooter && !hideInApp && <Footer />}
                <TransferModal />
                <div id={`${PORTAL_MODAL_ID}`} />
                {isPartner && <HookPartnerSocket />}
            </div>
        </>
    );
};

export default MadivesLayout;
