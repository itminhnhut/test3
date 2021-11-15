import Footer from 'components/common/Footer/Footer';
import { DESKTOP_NAV_HEIGHT, MOBILE_NAV_HEIGHT } from 'components/common/NavBar/constants';
import NavBar from 'components/common/NavBar/NavBar';
import { useState } from 'react';
import ReactNotification from 'react-notifications-component';
import { useWindowSize } from 'utils/customHooks';

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
}) => {
    // * Initial State
    const [state, set] = useState({ isDrawer: false });
    const setState = (_state) => set(prevState => ({ ...prevState, ..._state }));

    // Use Hooks
    const { width, height } = useWindowSize();

    // NOTE: Apply this style for NavBar on this layout.
    const navbarStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
    };

    return (
        <div
            className={`mal-layouts flex flex-col ${light ? 'mal-layouts___light' : ''} ${dark ? 'mal-layouts___dark' : ''}`}
            style={state.isDrawer ? { height, overflow: 'hidden' } : {}}
        >
            <ReactNotification />
            {!hideNavBar && <NavBar name={navName} useOnly={navMode} style={{ ...navbarStyle, ...navStyle }} layoutStateHandler={setState} page={page}/>}
            <div
                style={{
                    paddingTop: !navOverComponent ? (width >= 992 ? DESKTOP_NAV_HEIGHT : MOBILE_NAV_HEIGHT) : 0,
                    ...contentWrapperStyle,
                }}
                className="relative flex-1 bg-white dark:bg-darkBlue-2"
            >
                {children}
            </div>
            {!hideFooter && <Footer />}
        </div>
    );
};

export default MadivesLayout;
