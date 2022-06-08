import KlineChart from 'components/KlineChart/KlineChart'
import ms from 'ms'
import React, {useState, memo, useMemo} from 'react'
import useDarkMode from 'hooks/useDarkMode'

import dynamic from "next/dynamic";
import {useTranslation} from "next-i18next";
import {ChartMode} from "redux/actions/const";
import {useSelector} from "react-redux";

const MobileTradingView = dynamic(
    () => import('src/components/TVChartContainer/MobileTradingView'),
    {ssr: false},
);

// import {MobileTradingView} from "components/TVChartContainer/MobileTradingView";

const ChartMobile = memo(({pairConfig, isVndcFutures, setCollapse, collapse, forceRender, isFullScreen, decimals}) => {
    const [themeMode] = useDarkMode()
    const {t} = useTranslation();

    const ordersList = useSelector(state => state?.futures?.ordersList)

    const style = useMemo(() => {
        const vh = window.innerHeight * 0.01;
        return { height: !isFullScreen ? (collapse ? (vh * 100 - 100) : 400) : `calc(100% - ${collapse ? 120 : 230}px)` }
    }, [isFullScreen, collapse])

    return (
        <div className='spot-chart h-full max-w-full' style={style}>
            <MobileTradingView
                t={t}
                symbol={pairConfig?.symbol}
                pairConfig={pairConfig}
                initTimeFrame="1D"
                isVndcFutures={true}
                ordersList={ordersList}
                theme={themeMode}
                mode={ChartMode.FUTURES}
                setCollapse={setCollapse}
                collapse={collapse}
            />
        </div>
    );
});

export default ChartMobile
