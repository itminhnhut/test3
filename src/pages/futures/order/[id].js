import React, { useEffect, useMemo, useState } from 'react';
import DynamicNoSsr from 'components/DynamicNoSsr';
import MaldivesLayout from 'components/common/layouts/MaldivesLayout';
import { Responsive, WidthProvider } from 'react-grid-layout';
import futuresGridConfig, { futuresGridKey } from 'components/screens/Futures/_futuresGrid';
import useWindowSize from 'hooks/useWindowSize';
import { BREAK_POINTS } from 'constants/constants';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { X } from 'react-feather';
import { useRouter } from 'next/router';
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import FuturesPairDetail from 'components/screens/Futures/PairDetail';
import { useSelector } from 'react-redux';
import FuturesChart from 'components/screens/Futures/FuturesChart';
import { formatNumber, formatTime, getUnit, getDecimalQty, getDecimalPrice } from 'redux/actions/utils';
import { ShareIcon } from 'components/svg/SvgIcon';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import colors from 'styles/colors';
import FututesShareModal from 'components/screens/Futures/FuturesModal/FututesShareModal';

const GridLayout = WidthProvider(Responsive);

const OrderDetail = ({ id }) => {
    const allPairConfigs = useSelector((state) => state.futures.pairConfigs);
    const marketWatch = useSelector((state) => state.futures.marketWatch);
    const publicSocket = useSelector((state) => state.socket.publicSocket);
    const auth = useSelector((state) => state.auth?.user);
    const [currentTheme] = useDarkMode();
    const router = useRouter();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const isMediumDevices = width >= BREAK_POINTS.md;
    const [detail, setDetail] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);

    const pairConfig = useMemo(() => {
        return allPairConfigs.find((rs) => rs.symbol === detail?.symbol);
    }, [detail, allPairConfigs]);

    const unitConfig = useSelector((state) => getUnit(state, pairConfig?.quoteAsset));

    const pairTicker = marketWatch[pairConfig?.symbol];
    const isVndcFutures = pairConfig?.quoteAsset === 'VNDC';
    const isDark = currentTheme === THEME_MODE.DARK;

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
        if (!publicSocket || !pairConfig) return;
        publicSocket.emit('subscribe:futures:ticker', pairConfig?.symbol);
        return () => {
            publicSocket?.emit('unsubscribe:futures:ticker', pairConfig?.symbol);
        };
    }, [publicSocket, pairConfig]);

    const isHistory = useMemo(() => {
        return detail?.status === VndcFutureOrderType.Status.CLOSED;
    }, [detail]);

    useEffect(() => {
        if (detail) console.log(detail);
    }, [detail]);

    const decimals = useMemo(() => {
        return {
            price: getDecimalPrice(pairConfig),
            qty: getDecimalQty(pairConfig),
            symbol: unitConfig?.assetDigit ?? 0
        };
    }, [unitConfig, pairConfig]);

    if (!detail) return null;

    return (
        <DynamicNoSsr>
            <FututesShareModal order={detail} isVisible={showShareModal} onClose={() => setShowShareModal(false)} decimals={decimals} pairTicker={pairTicker} />
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
                            <div id="futures_detail_containter_chart" key={futuresGridKey.chart} className={`border border-divider dark:border-divider-dark`}>
                                <FuturesChart
                                    key="futures_detail_containter_chart"
                                    chartKey="futures_detail_containter_chart"
                                    pair={pairConfig?.symbol}
                                    initTimeFrame="1D"
                                    isVndcFutures={isVndcFutures}
                                    ordersList={[detail]}
                                />
                            </div>
                            <div key={futuresGridKey.orderDetail} className={`border-l border-divider dark:border-divider-dark py-10 `}>
                                <div className="px-4 flex items-center space-x-1 text-xs leading-5 text-txtSecondary dark:text-txtSecondary-dark">
                                    <span>ID #{detail?.displaying_id}</span>
                                    <span>•</span>
                                    <span>{formatTime(detail?.opened_at, 'HH:mm:ss dd/MM/yyyy')}</span>
                                </div>
                                <div className="px-4 mt-5">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{detail?.symbol}</span>
                                            <span className="py-0.5 px-1 bg-dark-2 rounded-[3px] text-xs">{detail?.leverage}x</span>
                                            <ShareIcon
                                                onClick={() => setShowShareModal(true)}
                                                color={isDark ? colors.white : colors.darkBlue}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
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
