import React, { useState, useMemo, useRef } from 'react';
// import OrderDetailComponent from 'components/screens/Nao_futures/Futures/OrderDetail';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router'
import { API_ORDER_DETAIL } from 'redux/actions/apis';
import fetchApi from 'utils/fetch-api';
import { ApiStatus } from 'redux/actions/const';
import { useEffect } from 'react';
import { VndcFutureOrderType } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LayoutMobile from 'components/common/layouts/LayoutMobile';
import { UserSocketEvent } from 'redux/actions/const';
import { getOrdersList } from 'redux/actions/futures';
import OrderDetailLoading from 'components/screens/Nao_futures/Futures/OrderDetailLoading'
import dynamic from 'next/dynamic';
const OrderDetailComponent = dynamic(
    () => import('components/screens/Nao_futures/Futures/OrderDetail'),
    { loading: () => <OrderDetailLoading /> }
);

const OrderDetail = (props) => {
    const [currentTheme] = useDarkMode()
    const router = useRouter();
    const pair = router.query.id;
    const dispatch = useDispatch();
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const userSocket = useSelector((state) => state.socket.userSocket);
    const timestamp = useSelector((state) => state.heath.timestamp);
    const auth = useSelector((state) => state.auth?.user);
    const [orderDetail, setOrderDetail] = useState(null);
    const isTabHistory = useRef(true);
    const [loading, setLoading] = useState(true);
    const mount = useRef(false);
    const checking = useRef(false);

    const pairConfigDetail = useMemo(() => {
        return allPairConfigs.find(rs => rs.symbol === orderDetail?.symbol)
    }, [orderDetail, allPairConfigs])

    useEffect(() => {
        if (auth && timestamp) getOrders();
    }, [auth, timestamp]);

    const getOrders = () => {
        if (auth) dispatch(getOrdersList());
    };

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER, getOrders);
            }
        };
    }, [userSocket]);

    useEffect(() => {
        getDetail();
    }, [pair])

    const getDetail = async () => {
        try {
            const {
                status,
                data,
                message
            } = await fetchApi({
                url: API_ORDER_DETAIL,
                options: { method: 'GET' },
                params: {
                    orderId: pair
                },
            });
            if (status === ApiStatus.SUCCESS) {
                isTabHistory.current = data.status === VndcFutureOrderType.Status.CLOSED;
                setOrderDetail(data);
            }
        } catch (e) {
            console.log(e);
        } finally {
            checking.current = false;
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!mount.current && Array.isArray(ordersList) && ordersList.length > 0 && orderDetail) {
            mount.current = true;
            return;
        }
        if (Array.isArray(ordersList) && orderDetail && !isTabHistory.current && mount.current) {
            const detail = ordersList.find(item => item.displaying_id === orderDetail?.displaying_id);
            if (!detail) {
                router.back();
            } else {
                const mainOrder = detail?.metadata?.dca_order_metadata?.is_main_order || detail?.metadata?.partial_close_metadata?.is_main_order
                if (Number(detail?.order_value) !== Number(orderDetail?.order_value) && mainOrder && !checking.current) {
                    checking.current = true;
                    getDetail()
                }
            }
        }

    }, [ordersList, orderDetail])

    if (loading) return <OrderDetailLoading />
    if (!orderDetail) return null;
    const isVndcFutures = pairConfigDetail?.quoteAsset === 'VNDC'
    return (
        <LayoutMobile>
            <OrderDetailComponent order={orderDetail} isMobile
                pairConfig={pairConfigDetail}
                pairParent={pair} isVndcFutures={isVndcFutures}
                isTabHistory={isTabHistory.current}
                isDark={currentTheme === THEME_MODE.DARK}
                getDetail={getDetail}
            />
        </LayoutMobile>
    );
};

export const getServerSideProps = async (context) => {
    return {
        props: {
            ...(await serverSideTranslations(context.locale, [
                'common',
                'navbar',
                'trade',
                'futures',
                'wallet',
                'spot',
                'error',
                'markets'
            ])),
        },
    };
};
export default OrderDetail;
