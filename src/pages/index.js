import dynamic from 'next/dynamic';
import Image from 'next/image';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { QRCode } from 'react-qrcode-logo';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NAVBAR_USE_TYPE } from 'src/components/common/NavBar/NavBar';
import { getFuturesMarketWatch } from 'redux/actions/market';
import compact from 'lodash/compact';
import uniqBy from 'lodash/uniqBy';
import find from 'lodash/find';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import LoadingPage from 'components/screens/Nao_futures/LoadingPage';
import { SkeletonHomeIntroduce } from 'components/screens/Home/Skeleton';
import { getS3Url } from 'redux/actions/utils';
import { getExchange24hPercentageChange } from 'src/redux/actions/utils';
import useDarkMode from 'hooks/useDarkMode';
import { useRefWindowSize } from 'hooks/useWindowSize';
import Skeletor from '../components/common/Skeletor';
import { useAsync } from 'react-use';
import { LANGUAGE_TAG } from 'hooks/useLanguage';

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
    const {
        t,
        i18n: { language }
    } = useTranslation(['home', 'modal']);

    const [state, set] = useState({
        showQR: false,
        loadingTrendData: false,
        marketTrendCurrency: language === LANGUAGE_TAG.VI ? 'VNST' : 'USDT',
        marketWatchData: []
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    const futuresConfigs = useSelector((state) => state.futures.pairConfigs);
    const ipCountry = useSelector((state) => state.user.country);

    const setMarketTrendCurrency = useCallback(
        (currencyCode) =>
            setState({
                marketTrendCurrency: currencyCode
            }),
        []
    );

    // * Use Hooks
    const [currentTheme] = useDarkMode();
    const { width } = useRefWindowSize();

    useEffect(() => {
        if (ipCountry) setMarketTrendCurrency(ipCountry === 'VN' ? 'VNST' : 'USDT');
    }, [ipCountry]);

    // * Render Handler
    const renderQrCodeModal = useCallback(() => {
        return (
            <ModalV2
                isMobile={width < 570}
                isVisible={state.showQR}
                title={t('modal:scan_qr_to_download')}
                onBackdropCb={() => setState({ showQR: false })}
                className="sm:max-w-[488px] dark:!bg-bgContainer-dark  !bg-hover-1 "
            >
                <div className={`mb-6 text-sm font-bold`}>
                    <div className="text-2xl dark:text-txtPrimary-dark font-semibold">{t('modal:scan_qr_to_download')}</div>
                </div>
                <div className="flex items-center justify-center relative py-12 ">
                    <div className="z-10 rounded-xl qr-code">
                        <QRCode value={`${APP_URL}#nami_exchange_download_app`} eyeRadius={6} size={150} />
                    </div>
                    <div className="absolute w-full h-full z-0">
                        <Image
                            layout="fill"
                            objectFit="cover"
                            className="rounded-xl"
                            src={getS3Url(`/images/screen/account/bg_transfer_onchain_${currentTheme}.png`)}
                        />
                    </div>
                </div>
            </ModalV2>
        );
    }, [state.showQR]);

    useAsync(async () => {
        if (!(futuresConfigs && futuresConfigs.length)) return;
        setState({
            loadingTrendData: true
        });
        let originPairs = null;
        try {
            originPairs = await getFuturesMarketWatch();
        } catch (error) {
        } finally {
            setState({
                marketWatchData: originPairs ?? [],
                loadingTrendData: false
            });
        }
    }, [futuresConfigs]);

    const convertMarketWatchData = useMemo(() => {
        let pairs = state.marketWatchData;
        const quoteFilter = ['VNDC', 'VNST'].includes(state.marketTrendCurrency) ? 'VNDC' : 'USDT';
        pairs = compact(
            pairs.map((p) => {
                p.change_24 = getExchange24hPercentageChange(p);
                const config = futuresConfigs?.find((pair) => pair?.symbol === p.s);
                if (config?.tags?.length && config.tags.includes('NEW_LISTING')) {
                    p.is_new_listing = true;
                    p.listing_time = config?.createdAt ? new Date(config?.createdAt).getTime() : 0;
                }
                p.leverage = config?.leverageConfig;
                if (p?.vq > 1000) return p;
                return null;
            })
        );
        pairs = filter(pairs, { q: quoteFilter });

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

        return {
            trending: {
                topView: topView.slice(0, 5),
                topGainers: topGainers.slice(0, 5),
                topLosers: topLosers.slice(0, 5),
                newListings: newListings.slice(0, 5)
            },
            streamLine: {
                total: state.marketWatchData.length
            }
        };
    }, [state.marketWatchData, state.marketTrendCurrency]);

    return (
        <MaldivesLayout navMode={NAVBAR_USE_TYPE.FLUENT}>
            <div className="homepage">
                <HomeIntroduce width={width} marketCurrency={state.marketTrendCurrency} trendData={convertMarketWatchData.trending} t={t} />
                <HomeMarketTrend
                    loadingTrendData={state.loadingTrendData}
                    trendData={convertMarketWatchData.trending}
                    setCurrency={setMarketTrendCurrency}
                    marketCurrency={state.marketTrendCurrency}
                />
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
