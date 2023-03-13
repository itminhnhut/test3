import { memo, useEffect, useState, useCallback } from 'react';
import { formatNumber, getS3Url } from 'redux/actions/utils';
import { PulseLoader } from 'react-spinners';
import { useAsync } from 'react-use';
import { API_GET_OVERVIEW_STATISTIC } from 'redux/actions/apis';
import colors from 'styles/colors';
import CountUp from 'react-countup';
import GradientButton from 'components/common/V2/ButtonV2/GradientButton';
import axios from 'axios';
import dynamic from 'next/dynamic';

const TrendingSlide = dynamic(() => import('./TrendingSlide'), {
    ssr: false,
    loading: () => <div className="h-10 w-full bg-transparent" />
});

const HomeIntroduce = ({ trendData, t }) => {
    const [state, set] = useState({
        pairsLength: null,
        loading: false,
        makedData: null,
        trending: null,
        loadingTrend: false,
        statistic: null,
        loadingStatistic: true
    });

    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));
    useEffect(() => {
        const makedData = makeData();
        if (Object.keys(makedData).length) {
            setState({ makedData });
        }
    }, []);

    useAsync(async () => {
        try {
            const stats = await axios.get(API_GET_OVERVIEW_STATISTIC);
            if (stats.data.status === 'ok' && stats.data.data.overview) {
                setState({ statistic: stats.data.data.overview });
            }
        } catch (error) {
            console.log('fetch OVERVIEW_STATISTIC failed...');
        } finally {
            setState({ loadingStatistic: false });
        }
    }, []);

    // Using video.play to lazy loading video on different screen breakpoint;
    useEffect(() => {
        let videoDesktop4k, videoDesktop, videoMobile;
        if (window) {
            videoDesktop4k = window.document.getElementById('video_wrapper-right');
            videoMobile = window.document.getElementById('video-banner_mobile');
            videoDesktop = window.document.getElementById('video-banner_desktop');
        }
        function handleResize() {
            const { innerWidth } = window;
            if (innerWidth >= 2160) {
                videoDesktop4k?.play();
                return;
            }
            if (innerWidth >= 768) {
                videoDesktop?.play();
                return;
            }
            videoMobile?.play();
        }

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <section className="homepage-introduce relative">
            <TrendingSlide trending={trendData} />
            <div className="homepage-introduce___wrapper max-w-screen-v3 2xl:max-w-screen-xxl mx-auto relative">
                <div className="homepage-introduce___wrapper__left">
                    <div className="homepage-introduce___nami_exchange">NAMI EXCHANGE</div>
                    <div className="homepage-introduce___title">
                        {t('home:introduce.title_desktop1')} <br />
                        {t('home:introduce.title_desktop2')}
                    </div>

                    <div className="flex">
                        <div className="homepage-introduce___statitics">
                            <div className="homepage-introduce___statitics____item">
                                <div className="homepage-introduce___statitics____item___value">
                                    {/* {renderCountUp} */}
                                    {state.loadingStatistic || !state.statistic?.volume_24h ? (
                                        <PulseLoader size={5} color={colors.teal} />
                                    ) : (
                                        <>
                                            $
                                            <CountUp
                                                start={0}
                                                end={state.statistic?.volume_24h}
                                                duration={2.75}
                                                prefix="$"
                                                formattingFn={(value) => formatNumber(value, 0)}
                                                delay={0}
                                                useEasing
                                            >
                                                {({ countUpRef }) => <span ref={countUpRef} />}
                                            </CountUp>
                                        </>
                                    )}
                                </div>
                                <div className="homepage-introduce___statitics____item___description">{t('home:introduce.total_order_paid')}</div>
                            </div>
                            <div className="homepage-introduce___statitics____item">
                                <div className="homepage-introduce___statitics____item___value">
                                    {state.loadingStatistic || !state.statistic?.num_of_users ? (
                                        <PulseLoader size={5} color={colors.teal} />
                                    ) : (
                                        <CountUp
                                            start={0}
                                            end={state.statistic.num_of_users}
                                            duration={2.75}
                                            formattingFn={(value) => formatNumber(value, 0)}
                                            delay={0}
                                            useEasing
                                        >
                                            {({ countUpRef }) => <span ref={countUpRef} />}
                                        </CountUp>
                                    )}{' '}
                                </div>
                                <div className="homepage-introduce___statitics____item___description">{t('home:introduce.total_user')}</div>
                            </div>
                            <div className="homepage-introduce___statitics____item">
                                <div className="homepage-introduce___statitics____item___value">
                                    {state.loadingStatistic || !state.statistic?.total_trading_pair ? (
                                        <PulseLoader size={5} color={colors.teal} />
                                    ) : (
                                        <CountUp
                                            start={0}
                                            end={state.statistic.total_trading_pair}
                                            duration={2.75}
                                            formattingFn={(value) => formatNumber(value, 0)}
                                            delay={0}
                                            useEasing
                                        >
                                            {({ countUpRef }) => <span ref={countUpRef} />}
                                        </CountUp>
                                    )}
                                </div>
                                <div className="homepage-introduce___statitics____item___description">{t('home:introduce.total_pairs')}</div>
                            </div>
                        </div>
                    </div>

                    <div className="homepage-introduce___download">
                        <GradientButton
                            onClick={() => {
                                document.getElementById('download_section').scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-auto hover:!bg-gradient-button-hover-dark hover:!text-dark-dark !bg-gradient-button-dark  text-txtPrimary-dark"
                        >
                            {t('home:introduce.download_app')}
                        </GradientButton>
                    </div>
                </div>
                <div className="homepage-introduce___wrapper__right">
                    <video
                        loop
                        muted
                        id="video_wrapper-right"
                        class="pointer-events-none max-h-[500px]"
                        // poster={getS3Url('/images/screen/homepage/banner_graphics_1.webp')}
                        poster="/images/screen/homepage/banner_graphics_fit.webp"

                        preload="none"
                        playsInline
                    >
                        <source
                        src="/images/screen/homepage/banner_graphics_fit.mp4"
                        //  src={getS3Url('/images/screen/homepage/banner_graphics.mp4')} 
                         type="video/mp4" />
                    </video>
                </div>
            </div>
            <div className="homepage-introduce__banner ">
                <video
                    loop
                    muted
                    className="lg:hidden pointer-events-none max-h-[390px] "
                    poster="/images/screen/homepage/banner_graphics_fit.webp"
                    preload="none"
                    playsInline
                >
                    <source src="/images/screen/homepage/banner_graphics_fit.mp4" type="video/mp4" />
                </video>
                <video
                    loop
                    muted
                    className="hidden  lg:block pointer-events-none "
                    poster={getS3Url('/images/screen/homepage/banner_graphics_1.webp')}
                    preload="none"
                    playsInline
                    id="video-banner_desktop"
                >
                    <source
                        //  src={getS3Url('/images/screen/homepage/banner_graphics.mp4')}
                        src="/images/screen/homepage/banner_graphics_fit.mp4"
                        type="video/mp4"
                    />
                </video>
            </div>
        </section>
    );
};

const COUNT = {
    VOLUME_24H: 7e6,
    MEMBER: 200000
};

// const TIME_FLAG = 1638856917 // 200,000 Member at this time
// const current = Date.now()

const makeData = () => {
    const volume24h = Math.floor(Math.random() * (VOLUME_24H_RANGE[1] - VOLUME_24H_RANGE[0] + 1) + VOLUME_24H_RANGE[0]);
    return {
        volume24h
    };
};

// const MEMBER_RANGE = [5, 20]
const VOLUME_24H_RANGE = [1e5, 9e5];

export default memo(HomeIntroduce);
