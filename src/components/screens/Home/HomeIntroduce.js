import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { formatNumber } from 'redux/actions/utils';
import { getMarketWatch } from 'redux/actions/market';
import { PulseLoader } from 'react-spinners';
import { useAsync } from 'react-use';
import { API_GET_TRENDING } from 'redux/actions/apis';

import colors from 'styles/colors';
import CountUp from 'react-countup';
import GradientButton from 'components/common/V2/ButtonV2/GradientButton';
import axios from 'axios';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const TrendingSlide = dynamic(() => import('./TrendingSlide'), {
    ssr: false,loading:() => <div className="h-10 w-full bg-transparent" />
});

const HomeIntroduce = ({ trendData,t }) => {
    const [state, set] = useState({
        pairsLength: null,
        loading: false,
        makedData: null,
        trending: null,
        loadingTrend: false
    });
    const setState = (state) => set((prevState) => ({ ...prevState, ...state }));

    // Use Hooks
    const getTrending = async () => {
        setState({ loadingTrend: true });
        try {
            const { data } = await axios.get(API_GET_TRENDING);
            console.log('__ data', data);
            if (data && data.status === 'ok') {
                setState({ trending: data?.data });
                console.log('data?.data:', data?.data)
            }
        } catch (e) {
            console.log('Cant get top trending data: ', e);
        } finally {
            setState({ loadingTrend: false });
        }
    };

    const renderIntroduce = useCallback(() => {
        return (
            <section className="homepage-introduce">
                <TrendingSlide trending={state.trending} />
                <div className="homepage-introduce___wrapper max-w-screen-v3 mx-auto relative">
                    <div className="homepage-introduce___wrapper__left">
                        <div className="homepage-introduce___nami_exchange">NAMI EXCHANGE</div>
                        <div className="homepage-introduce___title">
                            {t('home:introduce.title_desktop1')} <br />
                            {t('home:introduce.title_desktop2')}
                        </div>
                        {/* <div className="homepage-introduce___description">
                            <Trans>{t('home:introduce.description')}</Trans>
                        </div> */}
                        <div className="flex"></div>
                        <div className="homepage-introduce___statitics">
                            <div className="homepage-introduce___statitics____item">
                                <div className="homepage-introduce___statitics____item___value">
                                    {/* {renderCountUp} */}
                                    {state.loading && !state.makedData ? (
                                        <PulseLoader size={5} color={colors.teal} />
                                    ) : (
                                        <>
                                            $
                                            <CountUp
                                                start={0}
                                                end={COUNT.VOLUME_24H + state.makedData?.volume24h}
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
                                    {state.loading && !state.makedData ? (
                                        <PulseLoader size={5} color={colors.teal} />
                                    ) : (
                                        <CountUp
                                            start={0}
                                            end={COUNT.MEMBER}
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
                                    {state.loading ? (
                                        <PulseLoader size={5} color={colors.teal} />
                                    ) : (
                                        <CountUp
                                            start={0}
                                            end={state.pairsLength}
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

                        <div className="homepage-introduce___download">
                            <Link href="#download_section" passHref>
                                <GradientButton className="w-auto hover:!bg-gradient-button-hover-dark hover:!text-dark-dark !bg-gradient-button-dark  text-txtPrimary-dark">
                                    {t('home:introduce.download_app')}
                                </GradientButton>
                            </Link>
                        </div>
                    </div>
                    <div className="homepage-introduce___wrapper__right">
                        <video src="/images/screen/homepage/banner_graphics.mp4" loop muted autoPlay className="pointer-events-none h-full" />
                    </div>
                </div>
            </section>
        );
    }, [state.loading, state.pairsLength, state.makedData, state.trending]);

    useAsync(async () => {
        setState({ loading: true });
        const pairs = await getMarketWatch();
        if (pairs && pairs.length) {
            setState({ pairsLength: pairs.length });
        }
        setState({ loading: false });
    });

    useEffect(() => {
        const makedData = makeData();
        if (Object.keys(makedData).length) {
            setState({ makedData });
        }
    }, []);

    useEffect(() => {
        getTrending();
        const inverval = setInterval(() => getTrending(), 60000);
        return () => inverval && clearInterval(inverval);
    }, []);
    return renderIntroduce();
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
