import React, { useRef, createContext } from 'react';
import { PORTAL_MODAL_ID } from 'constants/constants';
import AlertNaoModal from 'components/screens/Nao/AlertNaoModal';
import Head from 'next/head';
import { useEffect } from 'react';
import NaoHeader from 'components/screens/Nao/NaoHeader';
import NaoFooter from 'components/screens/Nao/NaoFooter';
import styled from 'styled-components';
import { useWindowSize } from 'utils/customHooks';
import { getS3Url } from 'redux/actions/utils';

export const AlertContext = createContext(null);

const LayoutNaoToken = ({ children, isHeader = true }) => {
    const alert = useRef(null);
    const { width } = useWindowSize();

    useEffect(() => {
        document.body.classList.add('disabled-zoom');
    }, [])

    const onDownload = (key) => {
        let url = '';
        switch (key) {
            case 'app_store':
                url = 'https://apps.apple.com/us/app/onus-invest-btc-eth-doge/id1498452975';
                break;
            case 'google_play':
                url = 'https://play.google.com/store/apps/details?id=com.vndc';
                break;
            default:
                break;
        }
        window.open(url, '_blank');
    }

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
            </Head>
            <div className="bg-nao-bgShadow text-nao-white min-h-full font-inter">

                <AlertContext.Provider value={{
                    alert: alert.current,
                }}>
                    {isHeader ?
                        <Background width={width}>
                            <div className="px-4 nao:p-0 max-w-[72.5rem] w-full m-auto !mt-0">
                                <NaoHeader onDownload={onDownload} />
                                {children}
                            </div>
                            <NaoFooter />
                        </Background>
                        :
                        children
                    }
                </AlertContext.Provider>
                <div id={`${PORTAL_MODAL_ID}`} />
                <AlertNaoModal ref={alert} />
            </div>
        </>
    );
};

const Background = styled.div.attrs({
    className: 'min-w-full min-h-screen flex flex-col justify-between'
})`
    background-image:${({ width }) => `url(${getS3Url(`/images/nao/bg-dashboard${width <= 780 ? '_mb' : ''}.png`)})`};
    background-repeat: no-repeat;     
    background-size: cover;
    background-position: center top;
`

export default LayoutNaoToken;