import NavBar from 'components/common/NavBar/NavBar'
import Footer from 'components/common/Footer/Footer'

import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT } from 'components/common/NavBar/constants'
import { useWindowSize } from 'utils/customHooks'
import { useMemo, useState } from 'react'

const MadivesLayout = ({ navOverComponent, navMode = false, navStyle = {}, children, hidden }) => {
    // * Initial State
    const [state, set] = useState({ isDrawer: false })
    const setState = (_state) => set(prevState => ({...prevState, ..._state}));

    // Use Hooks
    const { width, height } = useWindowSize()

    // NOTE: Apply this style for NavBar on this layout.
    const navbarStyle = {
        position: 'absolute',
        top: 0,
        left: 0
    }

    return (
        <div className="mal-layouts flex flex-col" style={state.isDrawer ? {height, overflow: 'hidden'} : {}}>
            {!hidden && <NavBar useOnly={navMode} style={{ ...navbarStyle, ...navStyle }} layoutStateHandler={setState}/>}
            <div style={!navOverComponent ? { paddingTop: width >= 992 ? DESKTOP_NAV_HEIGHT : MOBILE_NAV_HEIGHT } : {}}
                 className="relative flex-1">
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default MadivesLayout
