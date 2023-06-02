import { useEffect, useMemo, useRef, useState } from 'react';
import FuturesRecordTableTab, { FUTURES_RECORD_CODE } from 'components/screens/Futures/TradeRecord/RecordTableTab';
import FuturesTradeHistory from 'components/screens/Futures/TradeRecord/TradeHistory';
import FuturesPosition from 'components/screens/Futures/TradeRecord/Position';
import CheckBox from 'components/common/CheckBox';
import FuturesTxHistory from 'components/screens/Futures/TradeRecord/TxHistory';
import FuturesAssets from 'components/screens/Futures/TradeRecord/Assets';
import FuturesOpenOrdersVndc from 'components/screens/Futures/PlaceOrder/Vndc/OpenOrdersVndc';
import FuturesOrderHistoryVndc from 'components/screens/Futures/PlaceOrder/Vndc/OrderHistoryVndc';
import { useRouter } from 'next/router';
import { getLoginUrl } from 'redux/actions/utils';
import { useSelector } from 'react-redux';
import { useTranslation } from 'next-i18next';
import { VndcFutureOrderType } from '../PlaceOrder/Vndc/VndcFutureOrderType';
import NoData from 'components/common/V2/TableV2/NoData';

const FuturesTradeRecord = ({
    isVndcFutures,
    layoutConfig,
    pairConfig,
    pairPrice,
    isAuth,
    pair,
}) => {
    const ordersList = useSelector(state => state?.futures?.ordersList);
    const router = useRouter();
    const [tabActive, setTabActive] = useState(FUTURES_RECORD_CODE.position);
    const [hideOther, setHideOther] = useState(false);
    const [pickedTime, setPickedTime] = useState({
        [FUTURES_RECORD_CODE.openOrders]: null,
        [FUTURES_RECORD_CODE.orderHistory]: null,
        [FUTURES_RECORD_CODE.information]: null,
        [FUTURES_RECORD_CODE.tradingHistory]: null,
        [FUTURES_RECORD_CODE.txHistory]: null,
        [FUTURES_RECORD_CODE.orderHistoryVndc]: null,
    });
    const [forceUpdateState, setForceUpdateState] = useState(0);
    const tableRef = useRef(null);
    const { t } = useTranslation();

    // ? Helper
    const onChangeTab = (tab) => tab !== tabActive && setTabActive(tab);

    const hideOtherToggle = () => setHideOther((prevState) => !prevState);

    const onForceUpdate = () =>
        setForceUpdateState((prevState) => (prevState > 15 ? 0 : prevState + 1));

    const onChangeTimePicker = (field, nextPickedTime) =>
        setPickedTime({
            ...pickedTime,
            [field]: nextPickedTime
        });

    useEffect(() => {
        if (tableRef?.current?.clientHeight) {
            // console.log('Re-calculate height ')
            const tableHeight = tableRef.current.clientHeight - 42;
            const tableHeaderElement =
                document.getElementsByClassName('rdt_TableHead')?.[0];
            const tableBodyElement =
                document.getElementsByClassName('rdt_TableBody')?.[0];

            if (tableHeight && tableHeaderElement && tableBodyElement) {
                if (
                    tabActive === FUTURES_RECORD_CODE.orderHistory ||
                    tabActive === FUTURES_RECORD_CODE.tradingHistory ||
                    tabActive === FUTURES_RECORD_CODE.txHistory ||
                    tabActive === FUTURES_RECORD_CODE.openOrders
                ) {
                    let offsetH = 32;
                    if (tabActive === FUTURES_RECORD_CODE.orderHistory) {
                        offsetH += 56;
                    }
                    if (tabActive === FUTURES_RECORD_CODE.openOrders) {
                        offsetH += layoutConfig?.w < 15 ? 10 : 5;
                    }
                    tableBodyElement.style.height = `${tableHeight - tableHeaderElement?.clientHeight - 15 - offsetH}px`;

                } else {
                    tableBodyElement.style.maxHeight = `${tableHeight - tableHeaderElement?.clientHeight - 15
                        }px`;
                }
            }
        }
    }, [layoutConfig?.h, tableRef, tabActive, forceUpdateState]);

    const onLogin = () => {
        router.push(getLoginUrl('sso'));
    };

    const renderDataTable = useMemo(() => {
        if(!isAuth) return <NoData className='mt-12' />
        switch (tabActive) {
            case FUTURES_RECORD_CODE.position:
                return <FuturesOpenOrdersVndc
                    pairConfig={pairConfig}
                    onForceUpdate={onForceUpdate}
                    hideOther={hideOther}
                    isAuth={isAuth}
                    onLogin={onLogin}
                    pair={pair}
                    key={0}
                    status={VndcFutureOrderType.Status.ACTIVE}
                />

            case FUTURES_RECORD_CODE.openOrders:
                return <FuturesOpenOrdersVndc
                    pairConfig={pairConfig}
                    onForceUpdate={onForceUpdate}
                    hideOther={hideOther}
                    isAuth={isAuth}
                    onLogin={onLogin}
                    pair={pair}
                    key={1}
                    status={VndcFutureOrderType.Status.PENDING}
                />
            case FUTURES_RECORD_CODE.orderHistory:
                return <FuturesOrderHistoryVndc
                    onForceUpdate={onForceUpdate}
                    pairConfig={pairConfig}
                    hideOther={hideOther}
                    pairPrice={pairPrice}
                    pickedTime={
                        pickedTime?.[
                        FUTURES_RECORD_CODE.orderHistoryVndc
                        ]
                    }
                    onChangeTimePicker={onChangeTimePicker}
                    isAuth={isAuth}
                    onLogin={onLogin}
                    pair={pair}
                />
            case FUTURES_RECORD_CODE.tradingHistory:
                if (!isVndcFutures)
                    return <FuturesTradeHistory
                        pairConfig={pairConfig}
                        onForceUpdate={onForceUpdate}
                        pickedTime={
                            pickedTime?.[FUTURES_RECORD_CODE.tradingHistory]
                        }
                        onChangeTimePicker={onChangeTimePicker}
                    />
            case FUTURES_RECORD_CODE.txHistory:
                if (!isVndcFutures)
                    return <FuturesTxHistory
                        pairConfig={pairConfig}
                        onForceUpdate={onForceUpdate}
                        pickedTime={
                            pickedTime?.[FUTURES_RECORD_CODE.txHistory]
                        }
                        onChangeTimePicker={onChangeTimePicker}
                    />
            case FUTURES_RECORD_CODE.assets:
                if (!isVndcFutures) return <FuturesAssets pairConfig={pairConfig} />
        }
        return null
    }, [tabActive, isVndcFutures, pairConfig, onChangeTimePicker, onForceUpdate, isAuth, onLogin, pair, pickedTime, hideOther])

    return (
        <div ref={tableRef} className="flex flex-col overflow-y-hidden">
            <div className="min-h-[52px] px-5 flex items-center border-b border-divider dark:border-divider-dark">
                <FuturesRecordTableTab
                    tabActive={tabActive}
                    onChangeTab={onChangeTab}
                    isVndcFutures={isVndcFutures}
                    countOrders={[ordersList.filter(e => e.status === VndcFutureOrderType.Status.ACTIVE).length, ordersList.filter(e => e.status === VndcFutureOrderType.Status.PENDING).length]}
                />
                {isAuth ? <div
                    className="flex items-center text-sm font-medium cursor-pointer select-none gap-3"
                    onClick={hideOtherToggle}
                >
                    <CheckBox active={hideOther} />
                    <span className="font-medium whitespace-nowrap text-gray dark:text-txtSecondary-dark">
                        {t('futures:hide_other_symbols')}
                    </span>
                </div> : null}
            </div>
            <div className="flex-grow">
                <div className="h-full overflow-auto custom_trading_record">
                    {renderDataTable}
                </div>
            </div>
        </div>
    );
};

export const customTableStyles = {
    headCells: {
        style: {
            whiteSpace: 'nowrap',
        },
    },
    rows: {
        style: {
            marginBottom: '8px',
        },
    },
};

export default FuturesTradeRecord;
