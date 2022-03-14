import { useState, useCallback, memo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FuturesMarginMode as MarginModes } from 'redux/reducers/futures'
import { API_FUTURES_LEVERAGE } from 'redux/actions/apis'
import { getMarginModeLabel } from 'redux/actions/futures'

import FuturesMarginModeSettings from '../MarginModeSettings'
import FuturesLeverageSettings from '../LeverageSettings'
import FuturesPreferences from '../Preferences'
import TradeSetings from 'components/svg/TradeSettings'
import axios from 'axios'

const PlaceConfigs = memo(({ pairConfig, userSettings }) => {
    const pair = pairConfig?.pair
    const marginMode = userSettings?.marginType?.[pairConfig?.pair]
    const positionMode = userSettings?.dualSidePosition || false

    const [isActive, setIsActive] = useState({})
    const [leverage, setLeverage] = useState(0)

    const openPopup = (key) => setIsActive({ [key]: true })
    const closePopup = (key) => setIsActive({ [key]: false })

    const getLeverage = async (symbol) => {
        const { data } = await axios.get(API_FUTURES_LEVERAGE, {
            params: {
                symbol,
            },
        })
        if (data?.status === 'ok') {
            setLeverage(data?.data?.[pair])
        }
    }

    useEffect(() => {
        getLeverage(pair)
    }, [pair])

    return (
        <>
            <div className='pt-5 flex items-center w-full'>
                <div className='flex-grow flex items-center w-full'>
                    <div
                        onClick={() => openPopup('marginMode')}
                        className='px-[16px] py-1 mr-2.5 text-xs font-bold bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md'
                    >
                        {getMarginModeLabel(marginMode) || '--'}
                    </div>
                    <div
                        onClick={() => openPopup('leverage')}
                        className='px-[16px] py-1 mr-2.5 text-xs font-bold bg-bgSecondary dark:bg-bgSecondary-dark cursor-pointer hover:opacity-80 rounded-md'
                    >
                        {leverage}x
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
                positionMode={positionMode}
                onClose={() => closePopup('preferences')}
            />
            <FuturesMarginModeSettings
                isVisible={!!isActive?.marginMode}
                marginMode={marginMode}
                pair={pairConfig?.pair}
                onClose={() => closePopup('marginMode')}
            />
            {!!isActive?.leverage && (
                <FuturesLeverageSettings
                    pair={pair}
                    leverage={leverage}
                    setLeverage={setLeverage}
                    leverageConfig={pairConfig?.leverageConfig}
                    isVisible={!!isActive?.leverage}
                    onClose={() => closePopup('leverage')}
                />
            )}
        </>
    )
})

export default PlaceConfigs
