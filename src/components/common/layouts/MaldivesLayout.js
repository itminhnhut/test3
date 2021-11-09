import NavBar from 'components/common/NavBar/NavBar'
import Footer from 'components/common/Footer/Footer'

import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT } from 'components/common/NavBar/constants'
import { useWindowSize } from 'utils/customHooks'
import { useMemo, useState } from 'react'

const MadivesLayout = ({
                           navOverComponent,
                           navMode = false,
                           navStyle = {},
                           navName,
                           contentWrapperStyle = {},
                           light,
                           dark,
                           children,
                           hideNavBar
                       }) => {
    // * Initial State
    const [state, set] = useState({ isDrawer: false })
    const setState = (_state) => set(prevState => ({...prevState, ..._state}));

    // Use Hooks
    const { width, height } = useWindowSize()

    // NOTE: Apply this style for NavBar on this layout.
    const navbarStyle = {
        position: 'fixed',
        top: 0,
        left: 0
    }


    return (
        <div
            className={`mal-layouts flex flex-col ${light ? 'mal-layouts___light' : ''} ${dark ? 'mal-layouts___dark' : ''}`}
            style={state.isDrawer ? { height, overflow: 'hidden' } : {}}>
            {!hideNavBar &&
            <NavBar name={navName} useOnly={navMode} style={{ ...navbarStyle, ...navStyle }} layoutStateHandler={setState}/>}
            <div style={{
                paddingTop: !navOverComponent ? (width >= 992 ? DESKTOP_NAV_HEIGHT : MOBILE_NAV_HEIGHT) : 0,
                ...contentWrapperStyle
            }}
                 className={`relative flex-1`}>
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default MadivesLayout
