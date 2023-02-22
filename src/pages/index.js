import MaldivesLayout from 'src/components/common/layouts/MaldivesLayout';
import dynamic from 'next/dynamic';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { QRCode } from 'react-qrcode-logo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';
import Button from 'components/common/Button';
import { getMarketWatch } from 'redux/actions/market';
import { compact, uniqBy, find } from 'lodash';
import { useSelector } from 'react-redux';
const APP_URL = process.env.APP_URL || 'https://nami.exchange';

const HomeNews = dynamic(() => import('components/screens/Home/HomeNews'), { ssr: false });
const HomeAdditional = dynamic(() => import('components/screens/Home/HomeAdditional'), { ssr: false });
const Modal = dynamic(() => import('src/components/common/ReModal'), { ssr: false });
const ModalV2 = dynamic(() => import('components/common/V2/ModalV2'), { ssr: false });
const HomeIntroduce = dynamic(() => import('components/screens/Home/HomeIntroduce'), { ssr: false });
const HomeMarketTrend = dynamic(() => import('components/screens/Home/HomeMarketTrend'), { ssr: false });
const HomeCommunity = dynamic(() => import('components/screens/Home/HomeCommunity'), {
    ssr: false
});
const HomeFirstAward = dynamic(() => import('components/screens/Home/HomeFirstAward'), {
    ssr: false
});
const HomeLightDark = dynamic(() => import('components/screens/Home/HomeLightDark'), {
    ssr: false
});

// const HomeNews = dynamic(() => import('components/screens/Home/HomeNews'), { ssr: false });

import { getExchange24hPercentageChange } from 'src/redux/actions/utils';
import { X } from 'react-feather';
import useDarkMode from 'hooks/useDarkMode';
import { useRefWindowSize } from 'hooks/useWindowSize';
const Index = () => {
    // * Initial State
    const [state, set] = useState({
        showQR: false,
        streamLineData: null,
        trendData: null
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const exchangeConfig = useSelector((state) => state.utils.exchangeConfig);
    // * Use Hooks
    const {
        t,
        i18n: { language }
    } = useTranslation(['home', 'modal']);
    const [currentTheme] = useDarkMode();
    const { width } = useRefWindowSize();

    // * Render Handler
    const renderQrCodeModal = useCallback(() => {
        return (
            <ModalV2
                isVisible={state.showQR}
                title={t('modal:scan_qr_to_download')}
                onBackdropCb={() => setState({ showQR: false })}
                className="w-[90%] !max-w-[488px] bg-darkBlue-3 !border-divider dark:!border-divider-dark"
                customHeader={() => (
                    <div className="flex justify-end mb-6">
                        <div
                            className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-bgHover dark:hover:bg-bgHover-dark cursor-pointer"
                            onClick={() => setState({ showQR: false })}
                        >
                            <X size={24} />
                        </div>
                    </div>
                )}
            >
                <div className={`mb-6 text-sm font-bold`}>
                    <div className="text-2xl dark:text-txtPrimary-dark font-semibold">{t('modal:scan_qr_to_download')}</div>
                </div>
                <div className="flex items-center justify-center relative py-12 ">
                    <div className="z-10 rounded-xl">
                        <QRCode value={`${APP_URL}#nami_exchange_download_app`} style={{ borderRadius: 20 }} eyeRadius={6} size={150} />
                    </div>
                    <img src={`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`} className="absolute w-full h-full z-0 rounded-xl" />
                </div>
            </ModalV2>
        );
    }, [state.showQR]);

    useEffect(async () => {
        if (!(exchangeConfig && exchangeConfig.length)) return;
        const originPairs = await getMarketWatch();
        let pairs = originPairs;
        pairs = compact(
            pairs.map((p) => {
                p.change_24 = getExchange24hPercentageChange(p);
                const config = find(exchangeConfig, { symbol: p.s });
                if (config?.tags?.length && config.tags.includes('NEW_LISTING')) {
                    p.is_new_listing = true;
                    p.listing_time = config?.createdAt ? new Date(config?.createdAt).getTime() : 0;
                }

                if (p?.vq > 1000) return p;
                return null;
            })
        );
        pairs = uniqBy(pairs, 'b');

        const topView = _.sortBy(pairs, [
            function (o) {
                return -o.vc;
            }
        ]);
        const topGainers = _.sortBy(pairs, [
            function (o) {
                return -o.change_24;
            }
        ]);
        const topLosers = _.sortBy(pairs, [
            function (o) {
                return o.change_24;
            }
        ]);
        const newListings = _.sortBy(pairs, [
            function (o) {
                return (o?.is_new_listing ? -1 : 1) * (o?.listing_time || 0);
            }
        ]);

        setState({
            trendData: {
                topView: topView.slice(0, 5),
                topGainers: topGainers.slice(0, 5),
                topLosers: topLosers.slice(0, 5),
                newListings: newListings.slice(0, 5)
            },
            streamLineData: {
                total: originPairs.length
            }
        });
    }, [exchangeConfig]);

    // Adding scroll smooth behavior for homepage only
    useEffect(() => {
        let htmlElement;
        if (window !== undefined) {
            htmlElement = window.document.getElementsByTagName('html')[0];
            htmlElement.style.scrollBehavior = 'smooth';
        }

        return () => {
            htmlElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <MaldivesLayout navOverComponent navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className="homepage">
                <HomeIntroduce trendData={state.trendData} t={t} />
                <HomeMarketTrend trendData={state.trendData} />
                <HomeNews />
                <HomeAdditional t={t} width={width} currentTheme={currentTheme} />
                <HomeLightDark t={t} onShowQr={() => setState({ showQR: true })} />

                <HomeFirstAward theme={currentTheme} t={t} language={language} />
                <HomeCommunity t={t} language={language} width={width} />

                {renderQrCodeModal()}
            </div>
        </MaldivesLayout>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common', 'navbar', 'home', 'modal', 'input', 'table']))
    }
});

export default Index;
