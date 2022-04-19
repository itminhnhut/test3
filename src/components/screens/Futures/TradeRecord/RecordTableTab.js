import classNames from 'classnames';

const FuturesRecordTableTab = ({ tabActive, onChangeTab, isVndcFutures, countOrders }) => {
    return (
        <div className='flex items-center flex-grow font-medium text-sm text-txtSecondary dark:text-txtSecondary-dark'>
            {(isVndcFutures ? RECORD_TAB_VNDC : RECORD_TAB).map((tab) => (
                <div
                    key={tab.code}
                    onClick={() => onChangeTab(tab.code)}
                    className={classNames(
                        'mr-[28px] hover:text-dominant cursor-pointer select-none last:mr-2.5',
                        { 'text-dominant': tabActive === tab.code }
                    )}
                >
                    {tab.title}&nbsp;{isVndcFutures && tab.code === FUTURES_RECORD_CODE.openOrders && ' (' + countOrders + ')'}
                </div>
            ))}
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
}

const RECORD_TAB_VNDC = [
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
]

const RECORD_TAB = [
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
