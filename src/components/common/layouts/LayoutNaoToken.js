import React, { useRef, createContext } from 'react';
import { PORTAL_MODAL_ID } from 'constants/constants';
import AlertModal from 'components/screens/Mobile/AlertModal';
export const AlertContext = createContext(null);

const LayoutNaoToken = ({ children }) => {
    const alert = useRef(null);

    return (
        <div className="bg-nao-bgShadow text-nao-white min-h-full">
            <AlertContext.Provider value={{
                alert: alert.current,
            }}>
                {children}
            </AlertContext.Provider>
            <div id={`${PORTAL_MODAL_ID}`} />
            <AlertModal ref={alert} />
        </div>
    );
};

export default LayoutNaoToken;