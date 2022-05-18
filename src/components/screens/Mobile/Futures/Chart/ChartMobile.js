import KlineChart from 'components/KlineChart/KlineChart'
import ms from 'ms'
import React, {useState, memo} from 'react'
import useDarkMode from 'hooks/useDarkMode'
import ChartTimer from './ChartTimer'
import Indicators from './Indicators'
import {IconStarFilled} from "components/common/Icons";
import colors from "styles/colors";

const ChartMobile = memo(({ pairConfig, pair, isVndcFutures, setCollapse, collapse }) => {
    const [resolution, setResolution] = useState(ms('1h'))
    const [mainIndicator, setMainIndicator] = useState()
    const [subIndicator, setSubIndicator] = useState()
    const [themeMode, switchTheme] = useDarkMode()
    const [candle, setCandle] = useState('candle_solid');
    return (
        <div style={{ height: `calc(100% - ${collapse ? 109 : 290}px)`, minHeight: 300 }}>
            <div className='flex flex-col w-full h-full' >
                <ChartTimer pair={pair} pairConfig={pairConfig}
                    isVndcFutures={isVndcFutures} resolution={resolution}
                    setResolution={setResolution}
                    candle={candle} setCandle={setCandle}

                />
                <div style={{ height: 'calc(100% - 102px)' }}>
                    <KlineChart
                        symbolInfo={{ exchange: 'NAMI_FUTURES', symbol: pair, pricePrecision: 0 }}
                        resolution={resolution}
                        mainIndicator={mainIndicator}
                        subIndicator={subIndicator}
                        candle={candle}
                        collapse={collapse}
                    />
                </div>
                <Indicators
                    setCollapse={setCollapse} collapse={collapse}
                    setMainIndicator={setMainIndicator} mainIndicator={mainIndicator}
                    setSubIndicator={setSubIndicator} subIndicator={subIndicator} />
            </div>
        </div>
    );
});

export default ChartMobile
