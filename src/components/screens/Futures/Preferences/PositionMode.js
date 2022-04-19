import { useDispatch } from 'react-redux';
import { getFuturesUserSettings, setFuturesPositionMode, } from 'redux/actions/futures';
import { FuturesPositionMode } from 'redux/reducers/futures';

import RadioBox from 'components/common/RadioBox';

const FuturesPreferencesPositionMode = ({ positionMode }) => {
    const dispatch = useDispatch()

    const onSetPositionMode = (mode) => {
        setFuturesPositionMode(mode)
        dispatch(getFuturesUserSettings())
    }

    return (
        <>
            <div className='mb-3'>
                <RadioBox
                    id={FuturesPositionMode.OneWay}
                    label='One-way Mode'
                    checked={!positionMode}
                    description='In the One-way Mode, one contract can only hold positions in
                    one direction.'
                    onChange={() => onSetPositionMode(false)}
                />
            </div>
            <div>
                <RadioBox
                    id={FuturesPositionMode.Hedge}
                    label='Hedge Mode'
                    checked={positionMode}
                    description='In the Hedge-way Mode, one contract can only hold positions in both long and short directions at the same time, and hedge positions in different directions under the same contract.'
                    onChange={() => onSetPositionMode(true)}
                />
            </div>
            <div className='mt-5 text-xs text-txtSecondary dark:text-txtSecondary-dark'>
                If there are open positions or open orders in the contract, you
                are not allowed to adjust the position mode. Position mode
                adjustments are effective for all contracts. This setting only
                applies to USD-M Futures
            </div>
        </>
    )
}

export default FuturesPreferencesPositionMode
