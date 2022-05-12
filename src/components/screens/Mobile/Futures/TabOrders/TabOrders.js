import React, { memo, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import classNames from 'classnames';
import { useSelector } from 'react-redux'
import { useTranslation } from 'next-i18next'
import { FUTURES_RECORD_CODE, RECORD_TAB_VNDC } from 'components/screens/Futures/TradeRecord/RecordTableTab'
import TabOpenOrders from 'components/screens/Mobile/Futures/TabOrders/TabOpenOrders'
import TabOrdersHistory from 'components/screens/Mobile/Futures/TabOrders/TabOrdersHistory'



const TabOrders = memo(({ isVndcFutures, pair }) => {
    const { t } = useTranslation();
    const ordersList = useSelector(state => state?.futures?.ordersList)
    const [tab, setTab] = useState(FUTURES_RECORD_CODE.position)

    useEffect(() => {
        setTab(FUTURES_RECORD_CODE.openOrders)
    }, [isVndcFutures])

    const renderTabContent = useCallback(() => {
        switch (tab) {
            case FUTURES_RECORD_CODE.openOrders:
                return <TabOpenOrders ordersList={ordersList} pair={pair} />;
            case FUTURES_RECORD_CODE.orderHistory:
                return <TabOrdersHistory />;
            default:
                return null
        }
    }, [tab, ordersList, pair])

    return (
        <React.Fragment>
            <TabMobile>
                {(isVndcFutures ? RECORD_TAB_VNDC : RECORD_TAB).map((item) => (
                    <TabItem key={item.code} active={tab === item.code} onClick={() => setTab(item.code)}>
                        {isVndcFutures ? t(item.title) : item.title}&nbsp;{isVndcFutures && item.code === FUTURES_RECORD_CODE.openOrders && ' (' + ordersList.length + ')'}
                    </TabItem>
                ))}
            </TabMobile>
            <div className="px-[16px] py-[10px]">
                {renderTabContent()}
            </div>
        </React.Fragment>
    );
});

const TabMobile = styled.div.attrs({
    className: "flex items-center px-[16px] mb-[10px]"
})`
    height:42px;
    width:100%;
    border-bottom:1px solid ${colors.grey4};
    border-top:1px solid ${colors.grey4};
    position:relative;
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
        `text-md font-medium mr-[32px] text-gray h-full flex items-center justify-center `,
        {
            'active font-semibold text-darkBlue': active
        }
    )
}))`
`
export default TabOrders;