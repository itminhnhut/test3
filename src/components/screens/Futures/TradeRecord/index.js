import { useEffect, useState, useRef } from 'react'
import FuturesRecordTableTab, { FUTURES_RECORD_CODE } from './RecordTableTab'
import FuturesOrderHistory from './OrderHistory'
import FuturesTradeHistory from './TradeHistory'
import FuturesPosition from './Position'
import classNames from 'classnames'
import CheckBox from 'components/common/CheckBox'
import FuturesOpenOrders from './OpenOrders'

const FuturesTradeRecord = ({ layoutConfig, pairConfig }) => {
    const [tabActive, setTabActive] = useState(FUTURES_RECORD_CODE.position)
    const [hideOther, setHideOther] = useState(false)
    const [pickedTime, setPickedTime] = useState({
        [FUTURES_RECORD_CODE.orderHistory]: null,
        [FUTURES_RECORD_CODE.tradingHistory]: null,
    })
    const [bodyMaxH, setBodyMaxH] = useState(0)

    const tableRef = useRef(null)

    // ? Helper
    const onChangeTab = (tab) => tab !== tabActive && setTabActive(tab)

    const hideOtherToggle = () => setHideOther((prevState) => !prevState)

    const onChangeTimePicker = (field, nextPickedTime) =>
        setPickedTime({ ...pickedTime, [field]: nextPickedTime })

    useEffect(() => {
        if (tableRef?.current?.clientHeight) {
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
                    tableBodyElement.style.height = `${
                        tableHeight - tableHeaderElement?.clientHeight - 15 - 32
                    }px`
                } else {
                    tableBodyElement.style.maxHeight = `${
                        tableHeight - tableHeaderElement?.clientHeight - 15
                    }px`
                }
            }
        }
    }, [layoutConfig?.h, tableRef?.current, tabActive])

    return (
        <div ref={tableRef} className='h-full flex flex-col overflow-y-hidden'>
            <div className='min-h-[42px] px-5 flex items-center border-b border-divider dark:border-divider-dark'>
                <FuturesRecordTableTab
                    tabActive={tabActive}
                    onChangeTab={onChangeTab}
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
                    {tabActive === FUTURES_RECORD_CODE.position && (
                        <FuturesPosition pairConfig={pairConfig} />
                    )}

                    {tabActive === FUTURES_RECORD_CODE.openOrders && (
                        <FuturesOpenOrders pairConfig={pairConfig} />
                    )}

                    {tabActive === FUTURES_RECORD_CODE.orderHistory && (
                        <FuturesOrderHistory
                            pairConfig={pairConfig}
                            pickedTime={
                                pickedTime?.[FUTURES_RECORD_CODE.orderHistory]
                            }
                            onChangeTimePicker={onChangeTimePicker}
                        />
                    )}
                    {tabActive === FUTURES_RECORD_CODE.tradingHistory && (
                        <FuturesTradeHistory
                            pairConfig={pairConfig}
                            pickedTime={
                                pickedTime?.[FUTURES_RECORD_CODE.tradingHistory]
                            }
                            onChangeTimePicker={onChangeTimePicker}
                        />
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
        style: {},
    },
}

export default FuturesTradeRecord
