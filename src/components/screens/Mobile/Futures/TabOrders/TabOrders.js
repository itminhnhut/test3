import React, { memo, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';
import { useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { FUTURES_RECORD_CODE, RECORD_TAB_VNDC_MOBILE, RECORD_TAB } from 'components/screens/Futures/TradeRecord/RecordTableTab'
import TabOpenOrders from 'components/screens/Mobile/Futures/TabOrders/TabOpenOrders'
import TabOrdersHistory from 'components/screens/Mobile/Futures/TabOrders/TabOrdersHistory';
import Link from 'next/link';
import { emitWebViewEvent, getLoginUrl } from 'redux/actions/utils'
import OrderBalance from 'components/screens/Mobile/Futures/TabOrders/OrderBalance';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import OrderDetail from 'components/screens/Mobile/Futures/OrderDetail';
import { socket } from "components/KlineChart/kline.service";
import { VndcFutureOrderType } from "../../../Futures/PlaceOrder/Vndc/VndcFutureOrderType"
import { useRouter } from 'next/router';

const TabOrders = memo(({ isVndcFutures, pair, pairConfig, isAuth, scrollSnap, setForceRender, forceRender, isFullScreen }) => {
    const { t } = useTranslation();
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const [currentTheme] = useDarkMode()
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const [tab, setTab] = useState(FUTURES_RECORD_CODE.position)
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const rowData = useRef(null);
    const router = useRouter();

    const onShowDetail = (row, isTabHistory) => {
        // if (openDetailModal) {
        //     if (rowData.current.symbol !== pair) {
        //         socket.emit('subscribe:futures:ticker', pair)
        //     }
        //     setForceRender(!forceRender)
        // }
        // rowData.current = row;
        // rowData.current?.isTabHistory = isTabHistory;
        // emitWebViewEvent(openDetailModal ? 'nami_futures' : 'order_detail')
        // setOpenDetailModal(!openDetailModal);
        router.push(`/mobile/futures/order/${row.displaying_id}`)
    }

    const pairConfigDetail = useMemo(() => {
        return allPairConfigs.find(rs => rs.symbol === rowData.current?.symbol)
    }, [rowData.current, openDetailModal])

    const oldDetail = useRef({});

    const orderDetail = useMemo(() => {
        if (rowData.current?.isTabHistory) return rowData.current
        const detail = ordersList.find(item => item.displaying_id === rowData.current?.displaying_id);
        if (detail) {
            detail.isTabHistory = detail.status === VndcFutureOrderType.Status.CLOSED;
            oldDetail.current = detail;
            return detail;
        } else {
            oldDetail.current?.isTabHistory = true;
            return oldDetail.current
        }

    }, [rowData.current, ordersList])


    const orderListFilter = useMemo(() => {
        const isPositions = tab === FUTURES_RECORD_CODE.position;
        const position = ordersList?.filter(item => item.status === 1) ?? [];
        const openOrders = ordersList?.filter(item => item.status === 0 || item.status === 3) ?? [];
        return { position, openOrders, orderList: isPositions ? position : openOrders }
    }, [tab, ordersList])

    return (
        <div className={`h-full ${isFullScreen ? 'overflow-hidden' : ''}`}>
            {openDetailModal &&
                <OrderDetail order={orderDetail} onClose={onShowDetail} isMobile
                    pairConfig={pairConfigDetail}
                    pairParent={pair} isVndcFutures={isVndcFutures}
                    isTabHistory={orderDetail?.isTabHistory}
                    isDark={currentTheme === THEME_MODE.DARK}
                />
            }
            <TabMobile onusMode={true} isDark={currentTheme === THEME_MODE.DARK} data-tut="order-tab">
                {(isVndcFutures ? RECORD_TAB_VNDC_MOBILE : RECORD_TAB).map((item) => (
                    <TabItem key={item.code} active={tab === item.code} onClick={() => setTab(item.code)}>
                        {isVndcFutures ? t(item.title) : item.title}&nbsp;{isVndcFutures &&
                            (item.code === FUTURES_RECORD_CODE.openOrders || item.code === FUTURES_RECORD_CODE.position)
                            && (orderListFilter[item.code].length > 0 ? ' (' + orderListFilter[item.code].length + ')' : '')}
                    </TabItem>
                ))}
                {/* <img src="/images/icon/ic_filter.png" height={24} width={24} /> */}
            </TabMobile>
            {isAuth &&
                <OrderBalance ordersList={ordersList} visible={tab === FUTURES_RECORD_CODE.position} />}
            {isAuth ?
                <div className="h-full">
                    <TabContent active={tab === FUTURES_RECORD_CODE.openOrders || tab === FUTURES_RECORD_CODE.position} >
                        <TabOpenOrders isDark={currentTheme === THEME_MODE.DARK}
                            ordersList={orderListFilter.orderList} pair={pair} pairConfig={pairConfig}
                            onShowDetail={onShowDetail} />
                    </TabContent>
                    <TabContent active={tab === FUTURES_RECORD_CODE.orderHistory} >
                        <TabOrdersHistory
                            forceRender={forceRender} setForceRender={setForceRender} scrollSnap={scrollSnap}
                            isDark={currentTheme === THEME_MODE.DARK} pair={pair}
                            isVndcFutures={isVndcFutures}
                            active={tab === FUTURES_RECORD_CODE.orderHistory}
                            onShowDetail={onShowDetail}
                        />
                    </TabContent>
                </div>
                : <LoginOrder />}
        </div>
    );
});

const TabMobile = styled.div.attrs({
    className: "flex items-center px-[16px] bg-white dark:bg-onus dark:border-onus-line"
})`
    height:42px;
    width:100%;
    border-bottom:1px solid ${colors.grey4};
    border-top:${({ isDark }) => isDark ? '0' : '1px solid ' + colors.grey4};
    position:sticky;
    top:0;
    z-index:10;
    .active::after {
        content:'';
        position:absolute;
        bottom:0;
        width:32px;
        height:4px;
        background-color: ${({ onusMode }) => onusMode ? colors.onus.green : colors.teal}
    }
`
const TabItem = styled.div.attrs(({ active }) => ({
    className: classNames(
        `text-sm font-medium text-gray-1 h-full flex items-center justify-center dark:text-onus-gray mr-[32px] last:mr-0`,
        {
            'active font-semibold text-darkBlue dark:!text-white': active
        }
    )
}))`
`
const TabContent = styled.div.attrs(({ active }) => ({
    className: classNames(
        `h-full`,
        {
            'hidden': !active
        }
    )
}))`
`

export const LoginOrder = () => {
    const { t } = useTranslation();
    return (
        <div className="cursor-pointer flex items-center justify-center h-full text-sm py-[10px] min-h-[300px]">
            <Link href={getLoginUrl('sso', 'login')} locale={false}>
                <a className='w-[200px] bg-onus-base !text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'>
                    {t('futures:mobile:login_short')}
                </a>
            </Link>
        </div>
    )
}

export default TabOrders;
