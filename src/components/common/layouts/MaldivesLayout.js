import Footer from 'src/components/common/Footer/Footer'
import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT } from 'src/components/common/NavBar/constants'
import NavBar from 'src/components/common/NavBar/NavBar'
import { useState } from 'react'
import ReactNotification from 'react-notifications-component'
import { useWindowSize } from 'utils/customHooks'
import TransferModal from 'components/wallet/TransferModal'
import useApp from 'hooks/useApp'
import { Head } from 'next/document'

const MadivesLayout = ({
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
                           onChangeSpotState
                       }) => {
    // * Initial State
    const [state, set] = useState({ isDrawer: false })
    const setState = (_state) => set(prevState => ({ ...prevState, ..._state }))

    // Use Hooks
    const {
        width,
        height
    } = useWindowSize()

    const isApp = useApp()

    // NOTE: Apply this style for NavBar on this layout.
    const navbarStyle = {
        position: 'absolute',
        top: 0,
        left: 0
    }

    return (
        <div
            className={`mal-layouts flex flex-col ${light ? 'mal-layouts___light' : ''} ${dark ? 'mal-layouts___dark' : ''}`}
            style={state.isDrawer ? {
                height,
                overflow: 'hidden'
            } : {}}
        >
            <ReactNotification/>
            {(!hideNavBar && !hideInApp) && !isApp &&
            <NavBar name={navName} useOnly={navMode} style={{ ...navbarStyle, ...navStyle }}
                    spotState={spotState}
                    onChangeSpotState={onChangeSpotState}
                    resetDefault={resetDefault}
                    layoutStateHandler={setState} page={page} changeLayoutCb={changeLayoutCb}/>}
            <div
                style={{
                    paddingTop: !navOverComponent && !hideInApp && !isApp ? (width >= 992 ? DESKTOP_NAV_HEIGHT : MOBILE_NAV_HEIGHT) : 0,
                    ...contentWrapperStyle
                }}
                className="relative flex-1 bg-white dark:bg-darkBlue-1"
            >
                {children}
            </div>
            {(!hideFooter && !hideInApp) && <Footer/>}
            <TransferModal/>
        </div>
    )
}

export default MadivesLayout
