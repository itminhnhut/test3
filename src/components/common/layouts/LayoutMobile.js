import Footer from 'src/components/common/Footer/Footer';
import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT, } from 'src/components/common/NavBar/constants';
import NavBar from 'src/components/common/NavBar/NavBar';
import { useState, useEffect } from 'react';
import ReactNotification from 'react-notifications-component';
import { useWindowSize } from 'utils/customHooks';
import TransferModal from 'components/wallet/TransferModal';
import useApp from 'hooks/useApp';
import { PORTAL_MODAL_ID } from 'constants/constants';
import { NavBarBottomShadow } from '../NavBar/NavBar';
import BottomNavBar from 'components/screens/Mobile/BottomNavBar'

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

    useEffect(() => {
        const frame = document.querySelector('#fc_frame')
        if (frame) {
            frame.style.display = 'none';
        }
    }, [])

    return (
        <>
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
                <ReactNotification className='fixed z-[9000] pointer-events-none w-full h-full' />
                <div
                    className='relative flex-1 bg-white dark:bg-darkBlue-1 mb-[80px]'
                >
                    {children}
                </div>
                <TransferModal />
                <div id={`${PORTAL_MODAL_ID}`} />
                <BottomNavBar />
            </div>
        </>
    )
}

export default LayoutMobile
