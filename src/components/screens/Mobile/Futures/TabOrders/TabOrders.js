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
import CloseOrdersByCondtionMobile from 'components/screens/Mobile/Futures/CloseOrders/CloseOrdersByCondtionMobile';
import { ApiStatus, ExchangeOrderEnum, UserSocketEvent } from 'src/redux/actions/const';
import { Spinner } from 'src/components/common/Icons';

const Button = styled.div.attrs({
    className: `text-onus-grey bg-gray-4 rounded-[4px] flex items-center justify-center text-xs font-semibold px-3 py-[6px]`
})``;

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
    const [isClosingOrders, setIsClosingOrders] = useState({ isClosing: 'false', timeout: 0 });

    const userSocket = useSelector((state) => state.socket.userSocket);

    useEffect(() => {
        const modeOrder = localStorage.getItem('MODE_ORDER');
        if (modeOrder) setMode(modeOrder);
    }, [])

    useEffect(() => {
        if (userSocket) {
            userSocket.on(UserSocketEvent.FUTURE_DONE_CLOSING_ALL_ORDERS, (data) => {
                if (data === 'done') setIsClosingOrders({ isClosing: 'done', timeout: 0 })
                setTimeout(() => setIsClosingOrders({ isClosing: 'false', timeout: 0 }), 2000)
            });
        }
        return () => {
            if (userSocket) {
                userSocket.removeListener(UserSocketEvent.FUTURES_OPEN_ORDER);
            }
        };
    }, [userSocket]);

    // useEffect(() => {
    //     if(isClosingOrders.isClosing === 'true') setTimeout(() => setIsClosingOrders({ isClosing: 'false', timeout: 0 }), isClosingOrders.timeout * 1000) 
    // }, [isClosingOrders])

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

    const handleCloseAll = () => {
        setOpenCloseModal(true)
    }

    const currrencyFilter = useMemo(() => {
        if(!ordersList) return false 
        return ordersList.filter(order => order?.symbol?.includes(pair?.includes('VNDC') ? 'VNDC' : 'USDT'))
    }, [hideOther, ordersList, pair]);

    const renderCloseAllButton = () => {
        let button
        switch (isClosingOrders.isClosing) {
            case 'false':
                button = (<Button
                    className="bg-onus-bg3 text-onus-gray !h-[32px]"
                    onClick={() => handleCloseAll()}
                >
                    {tab === FUTURES_RECORD_CODE.position ? t('futures:mobile.close_all_positions.title') : t('futures:mobile.close_all_positions.title_pending')}
                </Button>)
                break;
            case 'true':
                button = (<Button
                    className="bg-onus-bg3 text-onus-gray !h-[32px]"
                >
                    <Spinner className="w-4 h-4" color="#0068FF" />
                    <div className='w-[8px]'></div> {t('futures:mobile.close_all_positions.processing')}
                </Button>)
                break;
            case 'done':
                button = (<Button
                    className="bg-onus-bg3 text-onus-gray !h-[32px]"
                >
                    {doneIcon} <div className='w-[10px]'></div> {t('futures:mobile.close_all_positions.done')}
                </Button>)
                break;
            default:
                break
        }
        return orderListFilter.orderList.length > 0 ? button : null
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
            {openCloseModal &&
                <CloseOrdersByCondtionMobile 
                    orderList={orderListFilter.orderList}
                    tab={tab} onClose={() => setOpenCloseModal(false)} isClosing={setIsClosingOrders}
                    pair={pair} pairConfig={pairConfig}
                />
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
                                "sticky bg-onus z-[10] flex items-center justify-between px-4",
                                {
                                    'top-[108px] py-4': tab !== FUTURES_RECORD_CODE.orderHistory,
                                    'top-[42px] py-2': tab === FUTURES_RECORD_CODE.orderHistory,
                                }
                            )}>
                                {tab !== FUTURES_RECORD_CODE.orderHistory &&
                                    <>
                                        <TabModeContainer tab={mode === modeOrders.detail ? 0 : 1}>
                                            <TabMode onClick={() => onChangeMode(modeOrders.detail)}
                                                active={mode === modeOrders.detail}
                                            >
                                                {t('futures:mobile:full')}
                                            </TabMode>
                                            <TabMode onClick={() => onChangeMode(modeOrders.shortcut)}
                                                active={mode === modeOrders.shortcut}
                                            >
                                                {t('futures:mobile:simple')}
                                            </TabMode>
                                        </TabModeContainer>
                                        <div>
                                            { tab === FUTURES_RECORD_CODE.openOrders ? currrencyFilter.length > 1 && renderCloseAllButton() : renderCloseAllButton()}
                                        </div>
                                    </>
                                }
                            </div>
                        }
                                {needShowHideOther &&
                                    <div
                                        className="flex items-center text-sm font-medium select-none cursor-pointer px-4 pb-4"
                                        onClick={() => setHideOther(!hideOther)}
                                    >
                                        <CheckBox onusMode={true} active={hideOther} boxContainerClassName="rounded-[2px]" />
                                        <span className="ml-3 whitespace-nowrap font-medium  text-onus-grey text-xs">
                                            {t('futures:hide_other_symbols')}
                                        </span>
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
    className: 'flex items-center px-4 bg-onus border-b border-onus-line h-[38px] overflow-x-auto'
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
        `text-sm relative font-semibold h-full flex items-center justify-center text-onus-grey mr-8 last:mr-0`,
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

const TabModeContainer = styled.div.attrs(({ active }) => ({
    className: "p-[2px] flex items-center text-xs font-semibold leading-[1.125rem] bg-onus-bg3 rounded-lg relative",

}))`
 ::after {
        width:calc(100% / 2 - 2px);
        height: calc(100% - 4px);
        content: '';
        position: absolute;
        bottom:0;
        left: 0;
        transform:${({ tab }) => `translate(${tab * 100}%,0)`};
        background-color: ${() => colors.onus.bg2};
        border-radius:8px;
        transition: all 0.2s ease-out;
        margin:2px
    }
`

const TabMode = styled.div.attrs(({ active }) => ({
    className: classNames(
        'py-[5px] relative z-[10] min-w-[5rem] text-center',
        {
            'text-onus-grey': !active
        }
    )
}))`
`;

const doneIcon = <svg className='nao-spinner' width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.00024 6.79988L1.66691 4.46655C1.40691 4.20655 0.993574 4.20655 0.733574 4.46655C0.473574 4.72655 0.473574 5.13988 0.733574 5.39988L3.52691 8.19322C3.78691 8.45322 4.20691 8.45322 4.46691 8.19322L11.5336 1.13322C11.7936 0.873216 11.7936 0.459883 11.5336 0.199883C11.2736 -0.0601172 10.8602 -0.0601172 10.6002 0.199883L4.00024 6.79988Z" fill="#0DB787" />
</svg>

export default TabOrders;
