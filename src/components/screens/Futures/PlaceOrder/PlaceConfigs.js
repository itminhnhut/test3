import { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { FuturesMarginMode as MarginModes } from 'redux/reducers/futures'

import FuturesMarginModeSettings from '../MarginModeSettings'
import FuturesLeverageSettings from '../LeverageSettings'
import FuturesPreferences from '../Preferences'
import TradeSetings from 'components/svg/TradeSettings'

const PlaceConfigs = ({ pairConfig }) => {
    const pair = pairConfig?.pair

    const [isActive, setIsActive] = useState({})

    const marginMode = useSelector(
        (state) => state.futures.preloadedState?.marginMode || MarginModes.Cross
    )

    const openPopup = (key) => setIsActive({ [key]: true })
    const closePopup = (key) => setIsActive({ [key]: false })

    return (
        <>
            <div className='pt-5 flex items-center w-full'>
                <div className='flex-grow flex items-center w-full'>
                    <div
                        onClick={() => openPopup('marginMode')}
                        className='px-[16px] py-1 mr-2.5 text-xs font-bold bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md'
                    >
                        {marginMode}
                    </div>
                    <div
                        onClick={() => openPopup('leverage')}
                        className='px-[16px] py-1 mr-2.5 text-xs font-bold bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md'
                    >
                        20x
                    </div>
                </div>
                <div
                    onClick={() => openPopup('preferences')}
                    className='-mr-1.5 w-8 h-7 flex items-center justify-center rounded-md cursor-pointer hover:bg-gray-4 dark:hover:bg-darkBlue-3'
                >
                    <TradeSetings size={16} />
                </div>
            </div>
            <FuturesPreferences
                isVisible={!!isActive?.preferences}
                onClose={() => closePopup('preferences')}
            />
            <FuturesMarginModeSettings
                isVisible={!!isActive?.marginMode}
                onClose={() => closePopup('marginMode')}
            />
            <FuturesLeverageSettings
                pair={pair}
                isVisible={!!isActive?.leverage}
                onClose={() => closePopup('leverage')}
            />
        </>
    )
}

export default PlaceConfigs
