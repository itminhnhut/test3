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

import { useSelector } from 'react-redux';
import { THEME_MODE } from 'hooks/useDarkMode';
import Skeletor from '../Skeletor';
import Head from 'next/head';

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
    const isApp = useApp();

    const store = useStore();
    useEffect(() => {
        store.dispatch(setTheme());
    }, []);

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
                    className="nami-toast !top-[104px]"
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
            </div>
        </>
    );
};

export default MadivesLayout;
