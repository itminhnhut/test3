import FuturesTimeFilter from '../TimeFilter'
import { FUTURES_RECORD_CODE } from './RecordTableTab'

const FuturesOrderHistory = ({ pickedTime, onChangeTimePicker }) => {
    return (
        <>
            <FuturesTimeFilter
                currentTimeRange={pickedTime}
                onChange={(pickedTime) =>
                    onChangeTimePicker(
                        FUTURES_RECORD_CODE.orderHistory,
                        pickedTime
                    )
                }
            />
        </>
    )
}

export default FuturesOrderHistory
