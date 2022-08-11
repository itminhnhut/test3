import React, { memo, useMemo, useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { FUTURES_RECORD_CODE, RECORD_TAB_VNDC_MOBILE } from 'components/screens/Futures/TradeRecord/RecordTableTab';
import TabOpenOrders from 'components/screens/Mobile/Futures/TabOrders/TabOpenOrders';
import TabOrdersHistory from 'components/screens/Mobile/Futures/TabOrders/TabOrdersHistory';
import { emitWebViewEvent, scrollHorizontal } from 'redux/actions/utils';
import OrderBalance from 'components/screens/Mobile/Futures/TabOrders/OrderBalance';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';
import OrderDetail from 'components/screens/Mobile/Futures/OrderDetail';
import { VndcFutureOrderType, modeOrders } from 'components/screens/Futures/PlaceOrder/Vndc/VndcFutureOrderType';
import { useRouter } from 'next/router';
import Portal from 'components/hoc/Portal';
import TabTransactionsHistory from 'components/screens/Mobile/Futures/TabOrders/TabTransactionsHistory';
import { countBy } from 'lodash';
import CheckBox from 'components/common/CheckBox';

const TabOrders = memo(({
    isVndcFutures,
    pair,
    pairConfig,
    isAuth,
    scrollSnap,
    setForceRender,
    forceRender,
    isFullScreen
}) => {
    const { t } = useTranslation();
    const allPairConfigs = useSelector((state) => state?.futures?.pairConfigs);
    const [currentTheme] = useDarkMode();
    const ordersList = useSelector(state => state?.futures?.ordersList);
    const [tab, setTab] = useState(FUTURES_RECORD_CODE.position);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const rowData = useRef(null);
    const router = useRouter();
    const oldDetail = useRef({});
    const isModal = +router.query?.v > 1;
    const refTabsOrder = useRef(null);
    const [mode, setMode] = useState(modeOrders.detail)
    const [openCloseModal, setOpenCloseModal] = useState(false);
    const [hideOther, setHideOther] = useState(false);

    useEffect(() => {
        const modeOrder = localStorage.getItem('MODE_ORDER');
        if (modeOrder) setMode(modeOrder);
    }, [])

    const onShowDetail = (row, isTabHistory) => {
        if (isModal) {
            rowData.current = row;
            rowData.current?.isTabHistory = isTabHistory;
            emitWebViewEvent(openDetailModal ? 'nami_futures' : 'order_detail');
            setOpenDetailModal(!openDetailModal);
        } else {
            router.push(`/mobile/futures/order/${row.displaying_id}`);
        }
    };

    const pairConfigDetail = useMemo(() => {
        return allPairConfigs.find(rs => rs.symbol === rowData.current?.symbol);
    }, [rowData.current, openDetailModal]);

    const orderDetail = useMemo(() => {
        if (rowData.current?.isTabHistory) return rowData.current;
        const detail = ordersList.find(item => item.displaying_id === rowData.current?.displaying_id);
        if (detail) {
            detail.isTabHistory = detail.status === VndcFutureOrderType.Status.CLOSED;
            oldDetail.current = detail;
            return detail;
        } else {
            oldDetail.current?.isTabHistory = true;
            return oldDetail.current;
        }

    }, [rowData.current, ordersList]);

    const orderListFilter = useMemo(() => {
        const isPositions = tab === FUTURES_RECORD_CODE.position;
        const position = ordersList?.filter(item => item.status === 1) ?? [];
        const openOrders = ordersList?.filter(item => item.status === 0 || item.status === 3) ?? [];
        return {
            position,
            openOrders,
            orderList: isPositions ? position : openOrders
        };
    }, [tab, ordersList]);

    const needShowHideOther = useMemo(() => {
        if (tab === FUTURES_RECORD_CODE.orderHistory) return true;
        const totalSymbol = countBy(orderListFilter.orderList, 'symbol')
        return Object.keys(totalSymbol).length > 1
    }, [orderListFilter, tab]);

    const onChangeMode = (key) => {
        if (key === mode) return;
        localStorage.setItem('MODE_ORDER', key)
        setMode(key)
    }

    return (
        <div className={`h-full ${isFullScreen ? 'overflow-hidden' : ''}`}>
            {openDetailModal &&
                <Portal portalId="PORTAL_MODAL">
                    <div className={classNames(
                        'flex flex-col absolute top-0 left-0 h-[100vh] w-full z-[20] !bg-onus',
                        { invisible: !openDetailModal },
                        { visible: openDetailModal }
                    )}>
                        <OrderDetail order={orderDetail} onClose={onShowDetail} isMobile
                            pairConfig={pairConfigDetail}
                            pairParent={pair} isVndcFutures={isVndcFutures}
                            isTabHistory={orderDetail?.isTabHistory}
                            isDark={currentTheme === THEME_MODE.DARK}
                            isModal={isModal}
                        />
                    </div>
                </Portal>
            }
            <TabMobile ref={refTabsOrder} onusMode={true} isDark={currentTheme === THEME_MODE.DARK}
                data-tut="order-tab">
                {RECORD_TAB_VNDC_MOBILE.map((item) => (
                    <TabItem key={item.code} active={tab === item.code}
                        onClick={(e) => {
                            setTab(item.code);
                            scrollHorizontal(e.target, refTabsOrder.current);
                        }}
                    >
                        {t(item.title)}&nbsp;{
                            (item.code === FUTURES_RECORD_CODE.openOrders || item.code === FUTURES_RECORD_CODE.position)
                            && (orderListFilter[item.code].length > 0 ? ' (' + orderListFilter[item.code].length + ')' : '')}
                    </TabItem>
                ))}
                {/* <img src="/images/icon/ic_filter.png" height={24} width={24} /> */}
            </TabMobile>
            {isAuth &&
                <OrderBalance ordersList={ordersList} isTabHistory={tab === FUTURES_RECORD_CODE.orderHistory}
                    visible={[FUTURES_RECORD_CODE.position, FUTURES_RECORD_CODE.openOrders].includes(tab)}
                    pairConfig={pairConfig}
                />}
            {
                isAuth ?
                    <div className="h-full">
                        {tab !== FUTURES_RECORD_CODE.tradingHistory &&
                            <div className={classNames(
                                "sticky bg-onus z-[10] flex items-center justify-between py-4 px-4",
                                {
                                    'top-[108px]': tab !== FUTURES_RECORD_CODE.orderHistory,
                                    'top-[42px]': tab === FUTURES_RECORD_CODE.orderHistory,
                                }
                            )}>
                                {tab !== FUTURES_RECORD_CODE.orderHistory &&
                                    <div className="flex items-center text-xs font-medium leading-[1.375rem]">
                                        <div onClick={() => onChangeMode(modeOrders.detail)}
                                            className={`py-[2px] px-3 rounded-l ${mode === modeOrders.detail ? 'bg-onus-base' : 'bg-onus-bg3'}`}>
                                            {t('common:details')}
                                        </div>
                                        <div onClick={() => onChangeMode(modeOrders.shortcut)}
                                            className={`py-[2px] px-3 rounded-r ${mode === modeOrders.shortcut ? 'bg-onus-base' : 'bg-onus-bg3'}`}>
                                            {t('futures:mobile:shortcut')}
                                        </div>
                                    </div>
                                }
                                {needShowHideOther &&
                                    <div
                                        className="flex items-center text-sm font-medium select-none cursor-pointer"
                                        onClick={() => setHideOther(!hideOther)}
                                    >
                                        <CheckBox onusMode={true} active={hideOther} boxContainerClassName="rounded-[2px]" />
                                        <span className="ml-3 whitespace-nowrap font-medium capitalize text-onus-grey text-xs">
                                            {t('futures:hide_other_symbols')}
                                        </span>
                                    </div>
                                }
                            </div>
                        }
                        <TabContent
                            active={tab === FUTURES_RECORD_CODE.openOrders || tab === FUTURES_RECORD_CODE.position}>
                            <TabOpenOrders
                                isDark={currentTheme === THEME_MODE.DARK}
                                tab={tab} hideOther={hideOther}
                                ordersList={orderListFilter.orderList} pair={pair} pairConfig={pairConfig}
                                onShowDetail={onShowDetail} mode={mode}
                            />
                        </TabContent>
                        <TabContent active={tab === FUTURES_RECORD_CODE.orderHistory}>
                            <TabOrdersHistory
                                forceRender={forceRender} setForceRender={setForceRender} scrollSnap={scrollSnap}
                                isDark={currentTheme === THEME_MODE.DARK} pair={pair}
                                isVndcFutures={isVndcFutures}
                                tab={tab} hideOther={hideOther}
                                active={tab === FUTURES_RECORD_CODE.orderHistory}
                                onShowDetail={onShowDetail}
                            />
                        </TabContent>
                        <TabContent active={tab === FUTURES_RECORD_CODE.tradingHistory}>
                            <TabTransactionsHistory scrollSnap={scrollSnap}
                                active={tab === FUTURES_RECORD_CODE.tradingHistory} />
                        </TabContent>
                    </div>
                    : <LoginOrder />
            }
        </div>
    );
});

const TabMobile = styled.div.attrs({
    className: 'flex items-center px-[16px] bg-onus border-b border-onus-line h-[38px] overflow-x-auto'
})`
  height: 42px;
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;

  .active::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 32px;
    height: 4px;
    background-color: ${({ onusMode }) => onusMode ? '#418FFF' : colors.teal};
    left: 50%;
    transform: translate(-50%, 0);
  }
`;
const TabItem = styled.div.attrs(({ active }) => ({
    className: classNames(
        `text-sm relative font-semibold h-full flex items-center justify-center text-onus-grey mr-[32px] last:mr-0`,
        'whitespace-nowrap',
        {
            'active font-semibold text-[#418FFF]': active
        }
    )
}))`
`;
const TabContent = styled.div.attrs(({ active }) => ({
    className: classNames(
        `h-full`,
        {
            'hidden': !active
        }
    )
}))`
`;

export const LoginOrder = () => {
    const { t } = useTranslation();
    return (
        <div className="cursor-pointer flex items-center justify-center h-full text-sm py-[10px] min-h-[300px]">
            <div onClick={() => emitWebViewEvent('login')}
                className="w-[200px] bg-onus-base !text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80">
                {t('futures:mobile:login_short')}
            </div>
        </div>
    );
};

export default TabOrders;
