import dynamic from 'next/dynamic';
import Image from 'next/image';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { QRCode } from 'react-qrcode-logo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';
import { getMarketWatch, getFuturesMarketWatch } from 'redux/actions/market';
import { compact, uniqBy, find, filter, sortBy } from 'lodash';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import LoadingPage from 'components/screens/Mobile/LoadingPage';
import { SkeletonHomeIntroduce } from 'components/screens/Home/Skeleton';
import { getS3Url } from 'redux/actions/utils';
import { getExchange24hPercentageChange } from 'src/redux/actions/utils';
import useDarkMode from 'hooks/useDarkMode';
import { useRefWindowSize } from 'hooks/useWindowSize';
import Skeletor from '../components/common/Skeletor';

const APP_URL = process.env.APP_URL || 'https://nami.exchange';

const MaldivesLayout = dynamic(() => import('src/components/common/layouts/MaldivesLayout'), { ssr: false });

const HomeNews = dynamic(() => import('components/screens/Home/HomeNews'), {
    ssr: false,
    loading: () => <Skeletor baseColor="#000" width="100%" height="50vh" />
});
const HomeAdditional = dynamic(() => import('components/screens/Home/HomeAdditional'), {
    ssr: false,
    loading: () => <Skeletor baseColor="#000" width="100%" height="50vh" />
});
const ModalV2 = dynamic(() => import('components/common/V2/ModalV2'), { ssr: false });
const HomeIntroduce = dynamic(() => import('components/screens/Home/HomeIntroduce'), {
    ssr: false,
    loading: () => (isMobile ? <LoadingPage /> : <SkeletonHomeIntroduce />)
});
const HomeMarketTrend = dynamic(() => import('components/screens/Home/HomeMarketTrend'), {
    ssr: false,
    loading: () => <Skeletor width="100%" height="50vh" />
});
const HomeCommunity = dynamic(() => import('components/screens/Home/HomeCommunity'), {
    ssr: false,
    loading: () => <Skeletor width="100%" height="50vh" />
});
const HomeFirstAward = dynamic(() => import('components/screens/Home/HomeFirstAward'), {
    ssr: false,
    loading: () => <Skeletor width="100%" height="50vh" />
});
const HomeLightDark = dynamic(() => import('components/screens/Home/HomeLightDark'), {
    ssr: false,
    loading: () => <Skeletor width="100%" height="50vh" />
});

// const HomeNews = dynamic(() => import('components/screens/Home/HomeNews'), { ssr: false });
const Index = () => {
    // * Initial State
    const [state, set] = useState({
        showQR: false,
        streamLineData: null,
        trendData: null
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const futuresConfigs = useSelector((state) => state.futures.pairConfigs);

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
                isMobile={width < 570}
                isVisible={state.showQR}
                title={t('modal:scan_qr_to_download')}
                onBackdropCb={() => setState({ showQR: false })}
                className="!max-w-[488px]  !bg-hover-1 "
            >
                <div className={`mb-6 text-sm font-bold`}>
                    <div className="text-2xl dark:text-txtPrimary-dark font-semibold">{t('modal:scan_qr_to_download')}</div>
                </div>
                <div className="flex items-center justify-center relative py-12 ">
                    <div className="z-10 rounded-xl qr-code">
                        <QRCode value={`${APP_URL}#nami_exchange_download_app`} eyeRadius={6} size={150} />
                    </div>
                    <div className="absolute w-full h-full z-0">
                        <Image layout="fill" className="rounded-xl" src={getS3Url(`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`)} />
                    </div>
                </div>
            </ModalV2>
        );
    }, [state.showQR]);

    useEffect(async () => {
        if (!(futuresConfigs && futuresConfigs.length)) return;
        const originPairs = await getFuturesMarketWatch();
        let pairs = originPairs;
        pairs = compact(
            pairs.map((p) => {
                p.change_24 = getExchange24hPercentageChange(p);
                const config = find(futuresConfigs, { symbol: p.s });
                if (config?.tags?.length && config.tags.includes('NEW_LISTING')) {
                    p.is_new_listing = true;
                    p.listing_time = config?.createdAt ? new Date(config?.createdAt).getTime() : 0;
                    console.log(p.s);
                }

                if (p?.vq > 1000) return p;
                return null;
            })
        );
        pairs = filter(pairs, { q: 'VNDC' });

        pairs = uniqBy(pairs, 'b');

        const topView = sortBy(pairs, [
            function (o) {
                return -o.vq;
            }
        ]);

        const topGainers = sortBy(pairs, [
            function (o) {
                return -o.change_24;
            }
        ]);
        const topLosers = sortBy(pairs, [
            function (o) {
                return o.change_24;
            }
        ]);
        const newListings = sortBy(pairs, [
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
    }, [futuresConfigs]);

    return (
        <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className="homepage">
                <HomeIntroduce trendData={state.trendData} t={t} />
                <HomeMarketTrend trendData={state.trendData} />
                <HomeNews />
                <HomeAdditional t={t} width={width} currentTheme={currentTheme} />
                <HomeLightDark t={t} onShowQr={() => setState({ showQR: true })} />

                <HomeFirstAward theme={currentTheme} t={t} language={language} />
                <HomeCommunity currentTheme={currentTheme} t={t} language={language} width={width} />

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
