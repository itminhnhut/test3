import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT } from 'src/components/common/NavBar/constants';
import { useEffect, useState } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { useWindowSize } from 'utils/customHooks';
import useApp from 'hooks/useApp';
import { PORTAL_MODAL_ID } from 'constants/constants';
import { ToastContainer } from 'react-toastify';
import { useStore } from 'src/redux/store';
import { setTheme } from 'redux/actions/user';
import dynamic from 'next/dynamic';
import { isMobile } from 'react-device-detect';
import ButtonV2 from 'components/common/V2/ButtonV2/Button';

import { useSelector } from 'react-redux';
import { THEME_MODE } from 'hooks/useDarkMode';
import Skeletor from '../Skeletor';
import Head from 'next/head';
import toast from 'utils/toast';
import { useTranslation } from 'next-i18next';
import { UserSocketEvent } from 'redux/actions/const';
import { useRouter } from 'next/router';
import HrefButton from '../V2/ButtonV2/HrefButton';
import { formatNumber } from 'utils/reference-utils';
import ModalProcessSuggestPartner from 'components/screens/WithdrawDeposit/ModalProcessSuggestPartner';
import PartnerModalDetailsOrderSuggest from 'components/screens/WithdrawDeposit/PartnerModalDetailsOrderSuggest';

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
    const [showPartnerSuggest, setShowPartnerSuggest] = useState(null);

    useEffect(() => {
        store.dispatch(setTheme());
    }, []);

    const router = useRouter();

    const { t } = useTranslation();
    const userSocket = useSelector((state) => state.socket.userSocket);
    useEffect(() => {
        if (user?.partner_type !== 2) return;

        if (userSocket) {
            userSocket.on(UserSocketEvent.PARTNER_UPDATE_ORDER_AUTO_SUGGEST, (data) => {
                // make sure the socket displayingId is the current details/[id] page
                if (!data || data?.status !== 0 || data.partnerAcceptStatus !== 0) return;

                console.log('______Socket partner: ', data);

                const { displayingId, quoteQty, baseAssetId, userMetadata } = data;
                toast({
                    key: displayingId,
                    text: `Lệnh mua #${displayingId} trị giá ${formatNumber(quoteQty)} ${baseAssetId === 72 ? 'VNDC' : 'USDT'} vừa được tạo bởi ${
                        userMetadata?.name
                    }`,
                    type: 'info',
                    duration: 60000,
                    customActionClose: (closeToast) => (
                        <span
                            className="ml-6 text-green-3 hover:text-green-4 active:text-green-4 dark:text-green-2 dark:hover:text-green-4 dark:active:text-green-4 cursor-pointer"
                            onClick={() => {
                                // router.push('/partner-dw/opening-orders');
                                setShowPartnerSuggest(data);
                                closeToast();
                            }}
                        >
                            Xem
                        </span>
                    )
                });
            });
        }

        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.PARTNER_UPDATE_ORDER_AUTO_SUGGEST, (data) => {
                    console.log('socket removeListener PARTNER_UPDATE_ORDER_AUTO_SUGGEST:', data);
                });
            }
        };
    }, [userSocket]);

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
            {showPartnerSuggest && (
                <PartnerModalDetailsOrderSuggest showProcessSuggestPartner={showPartnerSuggest} onBackdropCb={() => setShowPartnerSuggest(null)} />
            )}
        </>
    );
};

export default MadivesLayout;
