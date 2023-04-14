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
import AlertNaoV2Modal from 'components/screens/Nao/AlertNaoV2Modal';
export const AlertContext = createContext(null);
import vi from 'date-fns/locale/vi'
import en from 'date-fns/locale/en-US'
vi.localize = {
    day: (n) => days[n]['vi'],
    month: (n) => months[n]['vi'],
    ordinalNumber: () => undefined,
    era: () => undefined,
    quarter: () => undefined,
    dayPeriod: () => undefined,
}

en.localize = {
    day: (n) => days[n]['en'],
    month: (n) => months[n]['en'],
    ordinalNumber: () => undefined,
    era: () => undefined,
    quarter: () => undefined,
    dayPeriod: () => undefined,
}

const months = [
    {
        en: 'January',
        vi: 'Tháng 1',
    },
    {
        en: 'February',
        vi: 'Tháng 2',
    },
    {
        en: 'March',
        vi: 'Tháng 3',
    },
    {
        en: 'April',
        vi: 'Tháng 4',
    },
    {
        en: 'May',
        vi: 'Tháng 5',
    },
    {
        en: 'June',
        vi: 'Tháng 6',
    },
    {
        en: 'July',
        vi: 'Tháng 7',
    },
    {
        en: 'August',
        vi: 'Tháng 8',
    },
    {
        en: 'September',
        vi: 'Tháng 9',
    },
    {
        en: 'October',
        vi: 'Tháng 10',
    },
    {
        en: 'November',
        vi: 'Tháng 11',
    },
    {
        en: 'December',
        vi: 'Tháng 12',
    },
]

const days = [
    {
        en: 'SUN',
        vi: 'CN',
    },
    {
        en: 'MON',
        vi: 'T2',
    },
    {
        en: 'TUE',
        vi: 'T3',
    },
    {
        en: 'WED',
        vi: 'T4',
    },
    {
        en: 'THU',
        vi: 'T5',
    },
    {
        en: 'FRI',
        vi: 'T6',
    },
    {
        en: 'SAT',
        vi: 'T7',
    },
]

const LayoutNaoToken = ({ children, isHeader = true }) => {
    const alert = useRef(null);
    const alertV2 = useRef(null);
    const { width } = useWindowSize();

    useEffect(() => {
        document.body.classList.add('disabled-zoom');
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        let vw = window.innerWidth;
        if (vw <= 360) {
            document.documentElement.style.setProperty('font-size', '14px');
        }
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
            <div className="bg-bgPrimary dark:bg-bgPrimary-dark text-txtPrimary dark:text-txtPrimary-dark min-h-full font-inter">

                <AlertContext.Provider value={{
                    alert: alert.current,
                    alertV2: alertV2.current
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
                <AlertNaoV2Modal ref={alertV2} />
            </div>
        </>
    );
};

const Background = styled.div.attrs({
    className: 'min-w-full min-h-screen flex flex-col justify-between'
})`
    /* background-image:${({ width }) => `url(${getS3Url(`/images/nao/bg-dashboard${width <= 780 ? '_mb' : ''}.png`)})`}; */
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center top;
`

export default LayoutNaoToken;