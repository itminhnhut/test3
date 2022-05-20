import React, { memo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';
import { useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { FUTURES_RECORD_CODE, RECORD_TAB_VNDC } from 'components/screens/Futures/TradeRecord/RecordTableTab'
import TabOpenOrders from 'components/screens/Mobile/Futures/TabOrders/TabOpenOrders'
import TabOrdersHistory from 'components/screens/Mobile/Futures/TabOrders/TabOrdersHistory';
import Link from 'next/link';
import { getLoginUrl } from 'redux/actions/utils'
import OrderBalance from './OrderBalance';
import useDarkMode, { THEME_MODE } from 'hooks/useDarkMode';

const TabOrders = memo(({ isVndcFutures, pair, pairConfig, isAuth, scrollSnap }) => {
    const { t } = useTranslation();
    const [currentTheme] = useDarkMode()
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const [tab, setTab] = useState(FUTURES_RECORD_CODE.position)

    useEffect(() => {
        setTab(FUTURES_RECORD_CODE.openOrders)
    }, [isVndcFutures])

    const renderTabContent = useCallback(() => {
        switch (tab) {
            case FUTURES_RECORD_CODE.openOrders:
                return <TabOpenOrders isDark={currentTheme === THEME_MODE.DARK} ordersList={ordersList} pair={pair} pairConfig={pairConfig} />;
            case FUTURES_RECORD_CODE.orderHistory:
                return <TabOrdersHistory scrollSnap={scrollSnap} isDark={currentTheme === THEME_MODE.DARK} />;
            default:
                return null
        }
    }, [tab, ordersList, pair, pairConfig, scrollSnap])

    return (
        <div className="h-full">
            <TabMobile isDark={currentTheme === THEME_MODE.DARK} data-tut="order-tab">
                {(isVndcFutures ? RECORD_TAB_VNDC : RECORD_TAB).map((item) => (
                    <TabItem key={item.code} active={tab === item.code} onClick={() => setTab(item.code)}>
                        {isVndcFutures ? t(item.title) : item.title}&nbsp;{isVndcFutures && item.code === FUTURES_RECORD_CODE.openOrders && ' (' + ordersList.length + ')'}
                    </TabItem>
                ))}
                {/* <img src="/images/icon/ic_filter.png" height={24} width={24} /> */}
            </TabMobile>
            {isAuth &&
                <OrderBalance ordersList={ordersList} visible={tab === FUTURES_RECORD_CODE.openOrders} />}
            {isAuth ? renderTabContent() : <LoginOrder />}
        </div>
    );
});

const TabMobile = styled.div.attrs({
    className: "flex items-center px-[16px] bg-white dark:bg-darkBlue-1 dark:border-divider-dark"
})`
    height:42px;
    width:100%;
    border-bottom:1px solid ${colors.grey4};
    border-top:${({ isDark }) => isDark ? '0' : '1px solid ' + colors.grey4};
    position:sticky;
    top:0;
    .active::after {
        content:'';
        position:absolute;
        bottom:0;
        width:32px;
        height:4px;
        background-color: ${colors.teal}
    }
`
const TabItem = styled.div.attrs(({ active }) => ({
    className: classNames(
        `text-sm font-medium mr-[32px] text-gray-1 h-full flex items-center justify-center dark:text-txtSecondary-dark`,
        {
            'active font-semibold text-darkBlue dark:text-white': active
        }
    )
}))`
`


export const LoginOrder = () => {
    const { t } = useTranslation();
    return (
        <div className="cursor-pointer flex items-center justify-center h-full text-sm py-[10px]">
            <Link href={getLoginUrl('sso', 'login')} locale={false}>
                <a className='w-[200px] bg-dominant !text-white font-medium text-center py-2.5 rounded-lg cursor-pointer hover:opacity-80'>
                    {t('futures:mobile:login_short')}
                </a>
            </Link>
        </div>
    )
}

export default TabOrders;