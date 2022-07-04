import React, { useRef, createContext } from 'react';
import { PORTAL_MODAL_ID } from 'constants/constants';
import AlertNaoModal from 'components/screens/Nao/AlertNaoModal';
import Head from 'next/head';
import { useEffect } from 'react';
export const AlertContext = createContext(null);

const LayoutNaoToken = ({ children }) => {
    const alert = useRef(null);

    useEffect(() => {
        document.body.classList.add('disabled-zoom');
    }, [])

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
            </Head>
            <div className="bg-nao-bgShadow text-nao-white min-h-full font-inter">

                <AlertContext.Provider value={{
                    alert: alert.current,
                }}>
                    {children}
                </AlertContext.Provider>
                <div id={`${PORTAL_MODAL_ID}`} />
                <AlertNaoModal ref={alert} />
            </div>
        </>
    );
};

export default LayoutNaoToken;