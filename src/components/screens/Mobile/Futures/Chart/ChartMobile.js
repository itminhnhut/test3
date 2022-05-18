import KlineChart from 'components/KlineChart/KlineChart'
import ms from 'ms'
import React, { useState, memo } from 'react'
import useDarkMode from 'hooks/useDarkMode'
import classNames from 'classnames'
import { concat, without } from 'lodash'
import ChartTimer from './ChartTimer'
import Indicators from './Indicators'
import Portal from 'components/hoc/Portal'
import Market from 'components/screens/Mobile/Market/Market'
import { X } from 'react-feather'
import { useTranslation } from 'next-i18next'
import ModelMarketMobile from "components/screens/Mobile/Market/ModelMarket";

const ChartMobile = memo(
    ({ pairConfig, pair, isVndcFutures, setCollapse, collapse }) => {
        const [resolution, setResolution] = useState(ms('1h'))
        const [mainIndicator, setMainIndicator] = useState()
        const [subIndicator, setSubIndicator] = useState()
        const [themeMode, switchTheme] = useDarkMode()
        const [candle, setCandle] = useState('candle_solid')

        return (
            <div style={{ height: 'calc(100% - 290px)', minHeight: 300 }}>
                <div className='flex flex-col w-full h-full'>
                    <ChartTimer
                        pair={pair}
                        pairConfig={pairConfig}
                        isVndcFutures={isVndcFutures}
                        resolution={resolution}
                        setResolution={setResolution}
                        candle={candle}
                        setCandle={setCandle}
                    />
                    <div style={{ height: 'calc(100% - 102px)' }}>
                        <KlineChart
                            symbolInfo={{
                                exchange: 'NAMI_FUTURES',
                                symbol: 'BTCVNDC',
                                pricePrecision: 2,
                            }}
                            resolution={resolution}
                            mainIndicator={mainIndicator}
                            subIndicator={subIndicator}
                            candle={candle}
                        />
                    </div>
                    <Indicators
                        setCollapse={setCollapse}
                        collapse={collapse}
                        setMainIndicator={setMainIndicator}
                        mainIndicator={mainIndicator}
                        setSubIndicator={setSubIndicator}
                        subIndicator={subIndicator}
                    />
                </div>
            </div>
        )
    }
)

export default ChartMobile
