import React, { memo, useMemo } from 'react';
import useDarkMode from 'hooks/useDarkMode';

import dynamic from 'next/dynamic';
import { useTranslation } from 'next-i18next';
import { ChartMode } from 'redux/actions/const';
import { useSelector } from 'react-redux';

const MobileTradingView = dynamic(
    () => import('components/TVChartContainer/MobileTradingView/').then(mod => mod.MobileTradingView),
    { ssr: false },
);

// import {MobileTradingView} from "components/TVChartContainer/MobileTradingView";

const ChartMobile = memo(({ pairConfig, isVndcFutures, setCollapse, collapse, forceRender, isFullScreen, decimals }) => {
    const [themeMode] = useDarkMode()
    const { t } = useTranslation();

    const ordersList = useSelector(state => state?.futures?.ordersList)

    const style = useMemo(() => {
        if (typeof window !== "undefined") {
            const vh = window.innerHeight * 0.01;
            return { height: !isFullScreen ? (collapse ? (vh * 100 - 100) : 400) : `calc(100% - ${collapse ? 120 : 230}px)` }
        } else {
            return { height: `calc(100% - ${collapse ? 120 : 230}px)` }
        }
    }, [isFullScreen, collapse, typeof window])

    return (
        <div className='spot-chart h-full max-w-full' style={style}>
            <MobileTradingView
                t={t}
                symbol={pairConfig?.symbol}
                pairConfig={pairConfig}
                initTimeFrame="15"
                isVndcFutures={true}
                theme={themeMode}
                mode={ChartMode.FUTURES}
                setCollapse={setCollapse}
                collapse={collapse}
                isFullScreen={isFullScreen}
                showIconGuide={!collapse}
                styleChart={{ height: `calc(100% - 90px)` }}
            />
        </div>
    );
});

export default ChartMobile
