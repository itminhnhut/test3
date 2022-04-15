import { useEffect, useState, useRef } from 'react'
import FuturesRecordTableTab, { FUTURES_RECORD_CODE } from './RecordTableTab'
import FuturesOrderHistory from './OrderHistory'
import FuturesTradeHistory from './TradeHistory'
import FuturesPosition from './Position'
import classNames from 'classnames'
import CheckBox from 'components/common/CheckBox'
import FuturesOpenOrders from './OpenOrders'
import FuturesTxHistory from './TxHistory'
import FuturesAssets from './Assets'
import FuturesOpenOrdersVndc from '../PlaceOrder/Vndc/OpenOrdersVndc'
import FuturesOrderHistoryVndc from '../PlaceOrder/Vndc/OrderHistoryVndc'

const FuturesTradeRecord = ({ isVndcFutures, layoutConfig, pairConfig, pairPrice }) => {
    const [tabActive, setTabActive] = useState(FUTURES_RECORD_CODE.position)
    const [hideOther, setHideOther] = useState(false)
    const [pickedTime, setPickedTime] = useState({
        [FUTURES_RECORD_CODE.openOrders]: null,
        [FUTURES_RECORD_CODE.orderHistory]: null,
        [FUTURES_RECORD_CODE.tradingHistory]: null,
        [FUTURES_RECORD_CODE.txHistory]: null,
        [FUTURES_RECORD_CODE.orderHistoryVndc]: null,
    })
    const [forceUpdateState, setForceUpdateState] = useState(0)

    const tableRef = useRef(null)

    // ? Helper
    const onChangeTab = (tab) => tab !== tabActive && setTabActive(tab)

    const hideOtherToggle = () => setHideOther((prevState) => !prevState)

    const onForceUpdate = () =>
        setForceUpdateState((prevState) => (prevState > 15 ? 0 : prevState + 1))

    const onChangeTimePicker = (field, nextPickedTime) =>
        setPickedTime({ ...pickedTime, [field]: nextPickedTime })

    useEffect(() => {
        setTabActive(FUTURES_RECORD_CODE.openOrders)
    }, [isVndcFutures])

    useEffect(() => {
        if (tableRef?.current?.clientHeight) {
            // console.log('Re-calculate height ')
            const tableHeight = tableRef.current.clientHeight - 42

            const tableHeaderElement =
                document.getElementsByClassName('rdt_TableHead')?.[0]
            const tableBodyElement =
                document.getElementsByClassName('rdt_TableBody')?.[0]

            if (tableHeight && tableHeaderElement && tableBodyElement) {
                if (
                    tabActive === FUTURES_RECORD_CODE.orderHistory ||
                    tabActive === FUTURES_RECORD_CODE.tradingHistory ||
                    tabActive === FUTURES_RECORD_CODE.txHistory
                ) {
                    tableBodyElement.style.height = `${tableHeight - tableHeaderElement?.clientHeight - 15 - 32
                        }px`
                } else {
                    tableBodyElement.style.maxHeight = `${tableHeight - tableHeaderElement?.clientHeight - 15
                        }px`
                }
            }
        }
    }, [layoutConfig?.h, tableRef, tabActive, forceUpdateState])

    return (
        <div ref={tableRef} className='h-full flex flex-col overflow-y-hidden'>
            <div className='min-h-[42px] px-5 flex items-center border-b border-divider dark:border-divider-dark'>
                <FuturesRecordTableTab
                    tabActive={tabActive}
                    onChangeTab={onChangeTab}
                    isVndcFutures={isVndcFutures}
                />
                <div
                    className='flex items-center text-sm font-medium select-none cursor-pointer'
                    onClick={hideOtherToggle}
                >
                    <CheckBox active={hideOther} />{' '}
                    <span className='ml-1 whitespace-nowrap'>
                        Hide Other Symbols
                    </span>
                </div>
            </div>
            <div className='flex-grow'>
                <div className='custom_trading_record h-full overflow-auto'>
                    {tabActive === FUTURES_RECORD_CODE.position && !isVndcFutures && (
                        <FuturesPosition pairConfig={pairConfig} />
                    )}

                    {tabActive === FUTURES_RECORD_CODE.openOrders &&
                        (isVndcFutures ? (
                            <FuturesOpenOrdersVndc
                                pairConfig={pairConfig}
                                onForceUpdate={onForceUpdate}
                                hideOther={hideOther}
                                pairPrice={pairPrice}
                            />
                        ) : (
                            <FuturesOpenOrders pairConfig={pairConfig} />
                        ))}

                    {tabActive === FUTURES_RECORD_CODE.orderHistory &&
                        (isVndcFutures ? (
                            <FuturesOrderHistoryVndc
                                onForceUpdate={onForceUpdate}
                                pairConfig={pairConfig}
                                pairPrice={pairPrice}
                                pickedTime={
                                    pickedTime?.[
                                    FUTURES_RECORD_CODE.orderHistoryVndc
                                    ]
                                }
                                onChangeTimePicker={onChangeTimePicker}
                            />
                        ) : (
                            <FuturesOrderHistory
                                pairConfig={pairConfig}
                                pickedTime={
                                    pickedTime?.[
                                    FUTURES_RECORD_CODE.orderHistory
                                    ]
                                }
                                onChangeTimePicker={onChangeTimePicker}
                            />
                        ))}
                    {tabActive === FUTURES_RECORD_CODE.tradingHistory && !isVndcFutures && (
                        <FuturesTradeHistory
                            pairConfig={pairConfig}
                            onForceUpdate={onForceUpdate}
                            pickedTime={
                                pickedTime?.[FUTURES_RECORD_CODE.tradingHistory]
                            }
                            onChangeTimePicker={onChangeTimePicker}
                        />
                    )}
                    {tabActive === FUTURES_RECORD_CODE.txHistory && !isVndcFutures && (
                        <FuturesTxHistory
                            pairConfig={pairConfig}
                            onForceUpdate={onForceUpdate}
                            pickedTime={
                                pickedTime?.[FUTURES_RECORD_CODE.txHistory]
                            }
                            onChangeTimePicker={onChangeTimePicker}
                        />
                    )}
                    {tabActive === FUTURES_RECORD_CODE.assets && !isVndcFutures && (
                        <FuturesAssets pairConfig={pairConfig} />
                    )}
                </div>
            </div>
        </div>
    )
}

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
}

export default FuturesTradeRecord
