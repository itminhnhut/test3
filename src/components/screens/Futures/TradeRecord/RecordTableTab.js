import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Tabs, { TabItem } from 'components/common/Tabs/Tabs';

const FuturesRecordTableTab = ({ tabActive, onChangeTab, isVndcFutures, countOrders }) => {
    const { t } = useTranslation()
    return (
        <div className='flex items-center flex-grow font-normal text-sm text-txtSecondary dark:text-txtSecondary-dark'>
            <Tabs tab={tabActive} className='gap-6'>
                {(isVndcFutures ? RECORD_TAB_VNDC : RECORD_TAB).map((tab, index) => (
                    <TabItem
                        className='!text-left !px-0 !text-sm' value={tab.code}
                        onClick={() => onChangeTab(tab.code)}
                        isMobile
                    >
                        {isVndcFutures ? t(tab.title) : tab.title}&nbsp;{isVndcFutures && [FUTURES_RECORD_CODE.openOrders, FUTURES_RECORD_CODE.position].includes(tab.code) && ' (' + countOrders[index] + ')'}
                    </TabItem>

                ))}
            </Tabs>
            <div className='h-full flex-grow dragHandleArea opacity-0 select-none'>
                dragHandleArea
            </div>
        </div>
    )
}

export const FUTURES_RECORD_CODE = {
    position: 'position',
    openOrders: 'openOrders',
    openOrdersVndc: 'openOrdersVndc',
    orderHistory: 'orderHistory',
    orderHistoryVndc: 'orderHistoryVndc',
    tradingHistory: 'tradingHistory',
    txHistory: 'txHistory',
    assets: 'assets',
    information: 'information'
}

export const RECORD_TAB_VNDC = [
    {
        key: 1,
        code: FUTURES_RECORD_CODE.position,
        title: 'futures:positions',
        localized: null,
    },
    {
        key: 1,
        code: FUTURES_RECORD_CODE.openOrders,
        title: 'futures:open_orders',
        localized: null,
    },
    {
        key: 2,
        code: FUTURES_RECORD_CODE.orderHistory,
        title: 'futures:orders_history',
        localized: null,
    },
]

export const RECORD_TAB_VNDC_MOBILE = [
    {
        key: 0,
        code: FUTURES_RECORD_CODE.position,
        title: 'futures:positions',
        localized: null,
    },
    {
        key: 1,
        code: FUTURES_RECORD_CODE.openOrders,
        title: 'futures:open_orders',
        localized: null,
    },
    {
        key: 4,
        code: FUTURES_RECORD_CODE.information,
        title: 'futures:order_information',
        localized: null,
    },
    {
        key: 2,
        code: FUTURES_RECORD_CODE.orderHistory,
        title: 'futures:orders_history',
        localized: null,
    },
    {
        key: 3,
        code: FUTURES_RECORD_CODE.tradingHistory,
        title: 'futures:transaction_histories',
        localized: null,
    },
]

export const RECORD_TAB = [
    {
        key: 0,
        code: FUTURES_RECORD_CODE.position,
        title: 'Position',
        localized: null,
    },
    {
        key: 1,
        code: FUTURES_RECORD_CODE.openOrders,
        title: 'Open Orders',
        localized: null,
    },
    {
        key: 2,
        code: FUTURES_RECORD_CODE.orderHistory,
        title: 'Order History',
        localized: null,
    },
    {
        key: 3,
        code: FUTURES_RECORD_CODE.tradingHistory,
        title: 'Trading History',
        localized: null,
    },
    {
        key: 4,
        code: FUTURES_RECORD_CODE.txHistory,
        title: 'Transaction History',
        localized: null,
    },
    {
        key: 5,
        code: FUTURES_RECORD_CODE.assets,
        title: 'Assets',
        localized: null,
    },
]

export default FuturesRecordTableTab
