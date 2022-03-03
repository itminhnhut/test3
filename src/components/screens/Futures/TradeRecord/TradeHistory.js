import FuturesTimeFilter from '../TimeFilter'
import { FUTURES_RECORD_CODE } from './RecordTableTab'

const FuturesTradeHistory = ({ pickedTime, onChangeTimePicker }) => {
    return (
        <>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.tradingHistory,
                        pickedTime
                    )
                }
            />
        </>
    )
}

export default FuturesTradeHistory
