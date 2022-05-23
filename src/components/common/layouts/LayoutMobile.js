import Footer from 'src/components/common/Footer/Footer';
import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT, } from 'src/components/common/NavBar/constants';
import NavBar from 'src/components/common/NavBar/NavBar';
import { useState, useEffect, useRef, createContext } from 'react';
import ReactNotification from 'react-notifications-component';
import { useWindowSize } from 'utils/customHooks';
import TransferModal from 'components/wallet/TransferModal';
import useApp from 'hooks/useApp';
import { PORTAL_MODAL_ID } from 'constants/constants';
import { NavBarBottomShadow } from '../NavBar/NavBar';
import BottomNavBar from 'components/screens/Mobile/BottomNavBar'
import Head from 'next/head'
import dynamic from 'next/dynamic';
import AlertModal from 'components/screens/Mobile/AlertModal'
export const AlertContext = createContext(null);

const LayoutMobile = ({
    navOverComponent,
    navMode = false,
    hideFooter = false,
    navStyle = {},
    navName,
    contentWrapperStyle = {},
    light,
    dark,
    children,
    hideNavBar,
    page,
    changeLayoutCb,
    hideInApp,
    spotState,
    resetDefault,
    onChangeSpotState,
    useNavShadow = false,
    useGridSettings = false,
}) => {
    // * Initial State
    const [state, set] = useState({ isDrawer: false })
    const setState = (_state) =>
        set((prevState) => ({ ...prevState, ..._state }))

    // Use Hooks
    const { width, height } = useWindowSize()

    const isApp = useApp()
    const alert = useRef(null);

    useEffect(() => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        setTimeout(() => {
            if (window.fcWidget) {
                window.fcWidget.hide()
                window.fcWidget.close()
            }
        }, 1000);
    }, [])

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>
            </Head>
            <div
                className={`mal-layouts flex flex-col ${light ? 'mal-layouts___light' : ''
                    } ${dark ? 'mal-layouts___dark' : ''}`}
                style={
                    state.isDrawer
                        ? {
                            height,
                            overflow: 'hidden',
                        }
                        : {}
                }
            >
                {/* <ReactNotification className='fixed z-[9000] pointer-events-none w-full h-full' /> */}
                <div
                    className='relative flex-1 bg-white dark:bg-darkBlue-1'
                >
                    <AlertContext.Provider value={{ alert: alert.current }}>
                        {children}
                    </AlertContext.Provider>
                </div>
                <TransferModal isMobile />
                <div id={`${PORTAL_MODAL_ID}`} />
                <BottomNavBar />
                <AlertModal ref={alert} />
            </div>
        </>
    )
}

export default LayoutMobile
