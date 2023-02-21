import React, { useEffect, useMemo, useState } from 'react';
import DynamicNoSsr from 'components/DynamicNoSsr';
import dynamic from 'next/dynamic';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import futuresGridConfig, { futuresGridKey } from 'components/screens/Futures/_futuresGrid';
import useWindowSize from 'hooks/useWindowSize';
import { BREAK_POINTS, LOCAL_STORAGE_KEY } from 'constants/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { X } from 'react-feather';
import { useRouter } from 'next/router';
import { PublicSocketEvent } from 'redux/actions/const';
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import FuturesPairDetail from 'components/screens/Futures/PairDetail';
import { useSelector } from 'react-redux';
import FuturesMarketWatch from 'models/FuturesMarketWatch';
import Emitter from 'redux/actions/emitter';

const GridLayout = WidthProvider(Responsive);

const OrderDetail = ({ id }) => {
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const auth = useSelector((state) => state.auth?.user);
    const router = useRouter();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const isMediumDevices = width >= BREAK_POINTS.md;
    const [detail, setDetail] = useState(null);
    const pairConfig = useMemo(() => {
        return allPairConfigs.find((rs) => rs.symbol === detail?.symbol);
    }, [detail]);
    const pairTicker = marketWatch[pairConfig?.symbol];
    const isVndcFutures = pairConfig?.quoteAsset === 'VNDC';
    console.log(pairTicker);
    useEffect(() => {
        if (id) getDetail(id);
    }, [id]);

    const getDetail = async (id) => {
        try {
            const { status, data } = await fetchApi({
                url: API_ORDER_DETAIL,
                options: { method: 'GET' },
                params: {
                    orderId: id
                }
            });
            if (data) {
                setDetail(data);
            }
            return data;
        } catch (e) {
            console.log('detail', e);
        } finally {
        }
    };

    useEffect(() => {
        if (!publicSocket || !pairConfig || !pairTicker) return;
        publicSocket.emit('subscribe:futures:mini_ticker', pairConfig?.symbol);

        return () => {
            publicSocket?.emit('unsubscribe:futures:ticker', pairConfig?.symbol);
        };
    }, [publicSocket, pairConfig]);

    const isHistory = useMemo(() => {
        return detail?.status === VndcFutureOrderType.Status.CLOSED;
    }, [detail]);

   

    useEffect(() => {
        if (detail) console.log(marketWatch[detail?.symbol]);
    }, [detail]);

    return (
        <DynamicNoSsr>
            <MaldivesLayout
                navStyle={{
                    boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.03)'
                }}
                hideFooter
                page="futures"
            >
                <div className="w-full">
                    {isMediumDevices && (
                        <GridLayout
                            className="layout"
                            layouts={futuresGridConfig.layoutsDetail}
                            breakpoints={futuresGridConfig.breakpoints}
                            cols={futuresGridConfig.cols}
                            margin={[-1, -1]}
                            containerPadding={[0, 0]}
                            rowHeight={24}
                        >
                            <div key={futuresGridKey.title} className={`border-b border-divider dark:border-divider-dark w-full flex items-center px-6`}>
                                <div className="flex items-center justify-between w-full">
                                    <div className="text-2xl font-semibold">{t('futures:mobile:order_detail')}</div>
                                    <X size={20} className="cursor-pointer" onClick={() => router.back()} />
                                </div>
                            </div>
                            <div key={futuresGridKey.pairDetail} className={`relative z-20 border-b border-r border-divider dark:border-divider-dark`}>
                                <FuturesPairDetail pairPrice={pairTicker} pairConfig={pairConfig} isVndcFutures={isVndcFutures} isAuth={!!auth} />
                            </div>
                            <div id="futures_containter_chart" key={futuresGridKey.chart} className={`border border-divider dark:border-divider-dark`}>
                                {/* <FuturesChart
                                    chartKey="futures_containter_chart"
                                    pair={pairConfig?.pair}
                                    initTimeFrame="1D"
                                    isVndcFutures={state.isVndcFutures}
                                    ordersList={ordersList}
                                /> */}
                                3
                            </div>
                            <div key={futuresGridKey.orderDetail} className={`border-l border-divider dark:border-divider-dark`}>
                                5
                            </div>
                            <div key={futuresGridKey.logs} className={`border-t border-divider dark:border-divider-dark`}>
                                4
                            </div>
                        </GridLayout>
                    )}
                </div>
            </MaldivesLayout>
        </DynamicNoSsr>
    );
};

export const getServerSideProps = async ({ locale, params }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common', 'navbar', 'trade', 'futures', 'wallet', 'error', 'spot'])),
            id: params?.id
        }
    };
};
export default OrderDetail;
